#!/usr/bin/env bash
# Manual deploy — syncs ./dist to S3 and invalidates CloudFront.
# CI does this on merge to main; this is for out-of-band pushes.
#
# Usage:
#   ./scripts/deploy.sh                         # reads from .env.deploy
#   S3_BUCKET=... CLOUDFRONT_DISTRIBUTION_ID=... ./scripts/deploy.sh

set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -f .env.deploy ]]; then
  # shellcheck disable=SC1091
  source .env.deploy
fi

: "${S3_BUCKET:?S3_BUCKET is required}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?CLOUDFRONT_DISTRIBUTION_ID is required}"

AWS_REGION="${AWS_REGION:-us-east-1}"

# If AWS_ACCESS_KEY_ID is not set, try to read from the Cortex creds CSV.
if [[ -z "${AWS_ACCESS_KEY_ID:-}" ]]; then
  CSV="${CORTEX_AWS_CSV:-../cortex/keystone/aws/cortex-automation_accessKeys.csv}"
  if [[ -f "$CSV" ]]; then
    AWS_ACCESS_KEY_ID="$(tail -1 "$CSV" | tr -d '\r\n' | cut -d',' -f1)"
    AWS_SECRET_ACCESS_KEY="$(tail -1 "$CSV" | tr -d '\r\n' | cut -d',' -f2)"
    export AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY
  fi
fi
export AWS_DEFAULT_REGION="$AWS_REGION"

echo "→ Building"
npm run build

echo "→ Syncing assets (immutable cache)"
aws s3 sync dist/ "s3://$S3_BUCKET/" \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "sitemap*.xml" \
  --exclude "robots.txt" \
  --exclude "404.html"

echo "→ Syncing HTML (no cache)"
aws s3 sync dist/ "s3://$S3_BUCKET/" \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html; charset=utf-8" \
  --exclude "*" --include "*.html"

echo "→ Syncing sitemap + robots"
aws s3 cp dist/sitemap-index.xml "s3://$S3_BUCKET/sitemap-index.xml" \
  --content-type "application/xml" --cache-control "public, max-age=300"
aws s3 cp dist/sitemap-0.xml "s3://$S3_BUCKET/sitemap-0.xml" \
  --content-type "application/xml" --cache-control "public, max-age=300"
aws s3 cp dist/robots.txt "s3://$S3_BUCKET/robots.txt" \
  --content-type "text/plain; charset=utf-8" --cache-control "public, max-age=300"

echo "→ Invalidating CloudFront"
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*" >/dev/null

echo "✓ Deployed to s3://$S3_BUCKET (distribution $CLOUDFRONT_DISTRIBUTION_ID)"
