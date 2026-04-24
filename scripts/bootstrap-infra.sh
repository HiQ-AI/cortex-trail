#!/usr/bin/env bash
# One-shot infra bootstrap for the preview.hiq.earth staging environment.
#
# What this script creates:
#   1. S3 bucket (private; CloudFront-only access via OAC)
#   2. ACM certificate for preview.hiq.earth (DNS-validated via Cloudflare)
#   3. CloudFront distribution pointing at the S3 bucket
#   4. Cloudflare CNAME: preview.hiq.earth → <distribution>.cloudfront.net
#      (DNS-only, NOT proxied — Cloudflare orange cloud OFF to avoid cert-chain issues)
#
# Prereqs:
#   - AWS creds either exported or readable from $CORTEX_AWS_CSV
#   - Cloudflare API token + zone ID readable from $CF_ENV (defaults to
#     ../cortex/keystone/cf/.env — the API key + zone ID live there)
#   - jq, curl, aws CLI
#
# Safety: this script is idempotent — re-running it will detect existing
# resources by name and reuse them rather than creating duplicates.

set -euo pipefail
cd "$(dirname "$0")/.."

DOMAIN="${DOMAIN:-preview.hiq.earth}"
BUCKET="${BUCKET:-cortex-trail-preview}"
AWS_REGION="${AWS_REGION:-us-east-1}"
CF_ENV="${CF_ENV:-../cortex/keystone/cf/.env}"

# ── Load AWS credentials ────────────────────────────────────────────────
if [[ -z "${AWS_ACCESS_KEY_ID:-}" ]]; then
  CSV="${CORTEX_AWS_CSV:-../cortex/keystone/aws/cortex-automation_accessKeys.csv}"
  if [[ -f "$CSV" ]]; then
    AWS_ACCESS_KEY_ID="$(tail -1 "$CSV" | tr -d '\r\n' | cut -d',' -f1)"
    AWS_SECRET_ACCESS_KEY="$(tail -1 "$CSV" | tr -d '\r\n' | cut -d',' -f2)"
    export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY
  fi
fi
export AWS_DEFAULT_REGION="$AWS_REGION"

# ── Load Cloudflare credentials ─────────────────────────────────────────
if [[ ! -f "$CF_ENV" ]]; then
  echo "✗ Cloudflare env not found at $CF_ENV" >&2
  exit 1
fi
CF_API_KEY="$(grep -E '^APIKEY=' "$CF_ENV" | cut -d'=' -f2)"
CF_ZONE_ID="$(grep -E '^区域ID=' "$CF_ENV" | cut -d'=' -f2)"
CF_ACCOUNT_ID="$(grep -E '^帐户ID=' "$CF_ENV" | cut -d'=' -f2)"
CF_EMAIL="$(grep -E '^邮箱=' "$CF_ENV" | cut -d'=' -f2)"

cf_api() {
  local method="$1" path="$2"
  shift 2
  curl -sS -X "$method" "https://api.cloudflare.com/client/v4${path}" \
    -H "X-Auth-Email: $CF_EMAIL" \
    -H "X-Auth-Key: $CF_API_KEY" \
    -H "Content-Type: application/json" \
    "$@"
}

cf_add_or_update_record() {
  local name="$1" type="$2" content="$3" proxied="${4:-false}"
  local existing
  existing="$(cf_api GET "/zones/$CF_ZONE_ID/dns_records?name=${name}&type=${type}" | jq -r '.result[0].id // empty')"
  local body
  body="$(jq -n --arg t "$type" --arg n "$name" --arg c "$content" --argjson p "$proxied" \
    '{type:$t,name:$n,content:$c,ttl:1,proxied:$p}')"
  if [[ -n "$existing" ]]; then
    echo "  ↻ Updating $type $name → $content"
    cf_api PATCH "/zones/$CF_ZONE_ID/dns_records/$existing" --data "$body" >/dev/null
  else
    echo "  + Creating $type $name → $content"
    cf_api POST "/zones/$CF_ZONE_ID/dns_records" --data "$body" >/dev/null
  fi
}

# ── 1. S3 bucket ────────────────────────────────────────────────────────
echo "→ [1/4] S3 bucket $BUCKET"
if aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  echo "  ✓ Bucket already exists"
else
  if [[ "$AWS_REGION" == "us-east-1" ]]; then
    aws s3api create-bucket --bucket "$BUCKET" --region "$AWS_REGION" >/dev/null
  else
    aws s3api create-bucket --bucket "$BUCKET" --region "$AWS_REGION" \
      --create-bucket-configuration "LocationConstraint=$AWS_REGION" >/dev/null
  fi
  aws s3api put-public-access-block --bucket "$BUCKET" --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" >/dev/null
  echo "  ✓ Created private bucket"
fi

# ── 2. ACM cert (us-east-1 is required for CloudFront) ──────────────────
echo "→ [2/4] ACM certificate for $DOMAIN"
CERT_ARN="$(aws acm list-certificates --region us-east-1 \
  --query "CertificateSummaryList[?DomainName=='$DOMAIN'].CertificateArn | [0]" \
  --output text)"
if [[ "$CERT_ARN" == "None" || -z "$CERT_ARN" ]]; then
  CERT_ARN="$(aws acm request-certificate \
    --domain-name "$DOMAIN" \
    --validation-method DNS \
    --region us-east-1 \
    --query CertificateArn --output text)"
  echo "  + Requested cert $CERT_ARN"
  sleep 5
fi

# Fetch validation record and push to Cloudflare
VAL_JSON="$(aws acm describe-certificate --certificate-arn "$CERT_ARN" --region us-east-1 \
  --query "Certificate.DomainValidationOptions[0].ResourceRecord" --output json)"
VAL_NAME="$(echo "$VAL_JSON" | jq -r '.Name')"
VAL_VALUE="$(echo "$VAL_JSON" | jq -r '.Value')"
VAL_TYPE="$(echo "$VAL_JSON" | jq -r '.Type')"
echo "  Validation record: $VAL_TYPE $VAL_NAME"
# ACM emits trailing '.' on the name; Cloudflare API accepts it either way
cf_add_or_update_record "${VAL_NAME%.}" "$VAL_TYPE" "${VAL_VALUE%.}" false

echo "  …waiting for ACM validation (can take 1–10 min)"
aws acm wait certificate-validated --certificate-arn "$CERT_ARN" --region us-east-1
echo "  ✓ Cert issued"

# ── 3. CloudFront distribution ──────────────────────────────────────────
echo "→ [3/4] CloudFront distribution"
DIST_ID="$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, '$DOMAIN')].Id | [0]" \
  --output text 2>/dev/null || echo None)"

if [[ "$DIST_ID" == "None" || -z "$DIST_ID" ]]; then
  # Create Origin Access Control for S3
  OAC_ID="$(aws cloudfront list-origin-access-controls \
    --query "OriginAccessControlList.Items[?Name=='$BUCKET-oac'].Id | [0]" --output text 2>/dev/null)"
  if [[ "$OAC_ID" == "None" || -z "$OAC_ID" ]]; then
    OAC_ID="$(aws cloudfront create-origin-access-control --origin-access-control-config \
      "Name=$BUCKET-oac,SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3" \
      --query 'OriginAccessControl.Id' --output text)"
    echo "  + Created OAC $OAC_ID"
  fi

  DIST_CFG="$(mktemp)"
  cat > "$DIST_CFG" <<JSON
{
  "CallerReference": "hiq-cortex-web-$(date +%s)",
  "Aliases": { "Quantity": 1, "Items": ["$DOMAIN"] },
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "s3-$BUCKET",
      "DomainName": "$BUCKET.s3.$AWS_REGION.amazonaws.com",
      "OriginPath": "",
      "CustomHeaders": { "Quantity": 0 },
      "S3OriginConfig": { "OriginAccessIdentity": "" },
      "OriginAccessControlId": "$OAC_ID",
      "ConnectionAttempts": 3,
      "ConnectionTimeout": 10
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "s3-$BUCKET",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": { "Quantity": 2, "Items": ["GET","HEAD"], "CachedMethods": { "Quantity": 2, "Items": ["GET","HEAD"] } },
    "Compress": true,
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "FunctionAssociations": { "Quantity": 0 },
    "LambdaFunctionAssociations": { "Quantity": 0 }
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [{ "ErrorCode": 404, "ResponsePagePath": "/404.html", "ResponseCode": "404", "ErrorCachingMinTTL": 10 }]
  },
  "Comment": "HiQ Cortex marketing site — preview.hiq.earth",
  "Enabled": true,
  "ViewerCertificate": {
    "ACMCertificateArn": "$CERT_ARN",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "PriceClass": "PriceClass_All",
  "HttpVersion": "http2and3",
  "IsIPV6Enabled": true
}
JSON
  DIST_ID="$(aws cloudfront create-distribution --distribution-config "file://$DIST_CFG" \
    --query 'Distribution.Id' --output text)"
  rm -f "$DIST_CFG"
  echo "  + Created distribution $DIST_ID"

  # Give S3 bucket policy access to this distribution via OAC
  ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
  POLICY_DOC="$(mktemp)"
  cat > "$POLICY_DOC" <<JSON
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowCloudFrontServicePrincipal",
    "Effect": "Allow",
    "Principal": { "Service": "cloudfront.amazonaws.com" },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::$BUCKET/*",
    "Condition": { "StringEquals": { "AWS:SourceArn": "arn:aws:cloudfront::$ACCOUNT_ID:distribution/$DIST_ID" } }
  }]
}
JSON
  aws s3api put-bucket-policy --bucket "$BUCKET" --policy "file://$POLICY_DOC"
  rm -f "$POLICY_DOC"
  echo "  + Bucket policy grants CloudFront read"
else
  echo "  ✓ Distribution $DIST_ID already exists for $DOMAIN"
fi

DIST_DOMAIN="$(aws cloudfront get-distribution --id "$DIST_ID" \
  --query 'Distribution.DomainName' --output text)"
echo "  Distribution domain: $DIST_DOMAIN"

# ── 4. Cloudflare DNS → CloudFront ──────────────────────────────────────
echo "→ [4/4] Cloudflare DNS $DOMAIN → $DIST_DOMAIN"
cf_add_or_update_record "$DOMAIN" "CNAME" "$DIST_DOMAIN" false

# ── Write .env.deploy for future runs ───────────────────────────────────
cat > .env.deploy <<EOF
# Generated by bootstrap-infra.sh
S3_BUCKET=$BUCKET
CLOUDFRONT_DISTRIBUTION_ID=$DIST_ID
AWS_REGION=$AWS_REGION
EOF
echo "  ✓ Wrote .env.deploy"

echo
echo "── Summary ─────────────────────────────────────────────────"
echo "Domain:         https://$DOMAIN"
echo "S3 bucket:      s3://$BUCKET"
echo "CloudFront:     $DIST_ID ($DIST_DOMAIN)"
echo "ACM cert:       $CERT_ARN"
echo
echo "Next: npm run build && ./scripts/deploy.sh"
echo "Note: CloudFront distribution takes ~15 min to fully propagate edges."
