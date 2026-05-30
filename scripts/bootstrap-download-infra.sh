#!/usr/bin/env bash
# 一次性建好 download.hiq.earth 的下载 + 自更新 CDN（AWS S3 + CloudFront）。
#
# 和 bootstrap-infra.sh（官网站点）刻意分开：
#   1. 站点 deploy.sh 用 `aws s3 sync --delete`，下载产物放同桶会被站点部署删掉。
#   2. 站点分发挂了 SPA-rewrite 函数（无扩展名路径 → /index.html），会把 Squirrel
#      的 `RELEASES` 文件改写成 /RELEASES/index.html，Windows 自更新挂。本分发不挂
#      任何函数，静态文件原样返回。
#
# 创建：
#   1. S3 桶 cortex-desktop-downloads（私有，仅 CloudFront 经 OAC 读）
#   2. ACM 证书（download.hiq.earth，CF DNS 验证）
#   3. CloudFront 分发（指向 S3，无 URI-rewrite 函数）
#   4. Cloudflare CNAME download.hiq.earth → <dist>.cloudfront.net（DNS-only，橙云 OFF）
#
# 完成后把输出的 DOWNLOAD_S3_BUCKET / DOWNLOAD_CF_DIST_ID 配成 cortex 仓的
# GitHub secrets（见 docs/internal/CN_DOWNLOAD_CDN.md）。
#
# 前置：AWS 凭据（aws sts get-caller-identity 能过）+ CF_API_KEY/CF_ZONE_ID/CF_EMAIL
# （或 source .env.local）；CLI：jq curl aws。脚本幂等，可重复跑。

set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -f .env.local ]]; then
  set -a; source .env.local; set +a
fi

DOMAIN="${DOWNLOAD_DOMAIN:-download.hiq.earth}"
BUCKET="${DOWNLOAD_BUCKET:-cortex-desktop-downloads}"
AWS_REGION="${AWS_REGION:-us-east-1}"
export AWS_DEFAULT_REGION="$AWS_REGION"

aws sts get-caller-identity >/dev/null 2>&1 || { echo "✗ AWS 凭据缺失" >&2; exit 1; }
: "${CF_API_KEY:?CF_API_KEY required (see .env.local.example)}"
: "${CF_ZONE_ID:?CF_ZONE_ID required}"
: "${CF_EMAIL:?CF_EMAIL required}"

cf_api() {
  local method="$1" path="$2"; shift 2
  curl -sS -X "$method" "https://api.cloudflare.com/client/v4${path}" \
    -H "X-Auth-Email: $CF_EMAIL" -H "X-Auth-Key: $CF_API_KEY" \
    -H "Content-Type: application/json" "$@"
}
cf_upsert() {
  local name="$1" type="$2" content="$3" proxied="${4:-false}" existing body
  existing="$(cf_api GET "/zones/$CF_ZONE_ID/dns_records?name=${name}&type=${type}" | jq -r '.result[0].id // empty')"
  body="$(jq -n --arg t "$type" --arg n "$name" --arg c "$content" --argjson p "$proxied" \
    '{type:$t,name:$n,content:$c,ttl:1,proxied:$p}')"
  if [[ -n "$existing" ]]; then cf_api PATCH "/zones/$CF_ZONE_ID/dns_records/$existing" --data "$body" >/dev/null
  else cf_api POST "/zones/$CF_ZONE_ID/dns_records" --data "$body" >/dev/null; fi
  echo "  ↻ $type $name → $content"
}

# ── 1. S3 桶 ────────────────────────────────────────────────────────────
echo "→ [1/4] S3 桶 $BUCKET"
if aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  echo "  ✓ 已存在"
else
  aws s3api create-bucket --bucket "$BUCKET" --region "$AWS_REGION" >/dev/null
  aws s3api put-public-access-block --bucket "$BUCKET" --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" >/dev/null
  echo "  ✓ 私有桶已建"
fi

# ── 2. ACM 证书 ─────────────────────────────────────────────────────────
echo "→ [2/4] ACM 证书 $DOMAIN"
CERT_ARN="$(aws acm list-certificates --region us-east-1 \
  --certificate-statuses ISSUED PENDING_VALIDATION \
  --query "CertificateSummaryList[?DomainName=='$DOMAIN'].CertificateArn | [0]" --output text)"
if [[ "$CERT_ARN" == "None" || -z "$CERT_ARN" ]]; then
  CERT_ARN="$(aws acm request-certificate --domain-name "$DOMAIN" --validation-method DNS \
    --region us-east-1 --query CertificateArn --output text)"
  echo "  + 申请证书 $CERT_ARN"; sleep 5
fi
VAL_JSON="$(aws acm describe-certificate --certificate-arn "$CERT_ARN" --region us-east-1 \
  --query "Certificate.DomainValidationOptions[0].ResourceRecord" --output json)"
cf_upsert "$(echo "$VAL_JSON" | jq -r '.Name' | sed 's/\.$//')" \
          "$(echo "$VAL_JSON" | jq -r '.Type')" \
          "$(echo "$VAL_JSON" | jq -r '.Value' | sed 's/\.$//')" false
echo "  …等待 ACM 验证"
aws acm wait certificate-validated --certificate-arn "$CERT_ARN" --region us-east-1
echo "  ✓ 证书签发"

# ── 3. CloudFront 分发（无函数）─────────────────────────────────────────
echo "→ [3/4] CloudFront 分发"
DIST_ID="$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, '$DOMAIN')].Id | [0]" \
  --output text 2>/dev/null || echo None)"
if [[ "$DIST_ID" == "None" || -z "$DIST_ID" ]]; then
  OAC_ID="$(aws cloudfront list-origin-access-controls \
    --query "OriginAccessControlList.Items[?Name=='$BUCKET-oac'].Id | [0]" --output text 2>/dev/null)"
  if [[ "$OAC_ID" == "None" || -z "$OAC_ID" ]]; then
    OAC_ID="$(aws cloudfront create-origin-access-control --origin-access-control-config \
      "Name=$BUCKET-oac,SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3" \
      --query 'OriginAccessControl.Id' --output text)"
  fi
  DIST_CFG="$(mktemp)"
  cat > "$DIST_CFG" <<JSON
{
  "CallerReference": "cortex-downloads-$(date +%s)",
  "Aliases": { "Quantity": 1, "Items": ["$DOMAIN"] },
  "Origins": { "Quantity": 1, "Items": [{
    "Id": "s3-$BUCKET", "DomainName": "$BUCKET.s3.$AWS_REGION.amazonaws.com",
    "S3OriginConfig": { "OriginAccessIdentity": "" }, "OriginAccessControlId": "$OAC_ID",
    "CustomHeaders": { "Quantity": 0 }, "ConnectionAttempts": 3, "ConnectionTimeout": 10
  }]},
  "DefaultCacheBehavior": {
    "TargetOriginId": "s3-$BUCKET", "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": { "Quantity": 2, "Items": ["GET","HEAD"], "CachedMethods": { "Quantity": 2, "Items": ["GET","HEAD"] } },
    "Compress": true,
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "FunctionAssociations": { "Quantity": 0 }, "LambdaFunctionAssociations": { "Quantity": 0 }
  },
  "Comment": "cortex downloads + update feed — $DOMAIN",
  "Enabled": true,
  "ViewerCertificate": { "ACMCertificateArn": "$CERT_ARN", "SSLSupportMethod": "sni-only", "MinimumProtocolVersion": "TLSv1.2_2021" },
  "PriceClass": "PriceClass_All", "HttpVersion": "http2and3", "IsIPV6Enabled": true
}
JSON
  DIST_ID="$(aws cloudfront create-distribution --distribution-config "file://$DIST_CFG" \
    --query 'Distribution.Id' --output text)"
  rm -f "$DIST_CFG"
  echo "  + 分发已建 $DIST_ID"
  ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
  POLICY="$(mktemp)"
  cat > "$POLICY" <<JSON
{ "Version": "2012-10-17", "Statement": [{
  "Sid": "AllowCloudFront", "Effect": "Allow",
  "Principal": { "Service": "cloudfront.amazonaws.com" }, "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::$BUCKET/*",
  "Condition": { "StringEquals": { "AWS:SourceArn": "arn:aws:cloudfront::$ACCOUNT_ID:distribution/$DIST_ID" } }
}]}
JSON
  aws s3api put-bucket-policy --bucket "$BUCKET" --policy "file://$POLICY"
  rm -f "$POLICY"
  echo "  + 桶策略放行 CloudFront"
else
  echo "  ✓ 分发已存在 $DIST_ID"
fi
DIST_DOMAIN="$(aws cloudfront get-distribution --id "$DIST_ID" --query 'Distribution.DomainName' --output text)"

# ── 4. Cloudflare DNS ───────────────────────────────────────────────────
echo "→ [4/4] DNS $DOMAIN → $DIST_DOMAIN"
cf_upsert "$DOMAIN" "CNAME" "$DIST_DOMAIN" false

echo
echo "── 完成 ───────────────────────────────────────────────────"
echo "把这两个值配成 cortex 仓的 GitHub secrets："
echo "  DOWNLOAD_S3_BUCKET   = $BUCKET"
echo "  DOWNLOAD_CF_DIST_ID  = $DIST_ID"
echo "另需配 DOWNLOAD_AWS_ACCESS_KEY_ID / DOWNLOAD_AWS_SECRET_ACCESS_KEY（仅限本桶 + CF invalidation 权限的 IAM user）"
echo "CloudFront 边缘传播约 15 分钟。"
