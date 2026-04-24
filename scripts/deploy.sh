#!/usr/bin/env bash
# Manual deploy — syncs ./dist to S3 and invalidates CloudFront.
# CI does this on merge to main; this is for out-of-band pushes.
#
# Usage:
#   ./scripts/deploy.sh                         # reads .env.deploy + .env.local
#   S3_BUCKET=... CLOUDFRONT_DISTRIBUTION_ID=... ./scripts/deploy.sh

set -euo pipefail
cd "$(dirname "$0")/.."

# Auto-source local env files if present (both are gitignored).
for f in .env.deploy .env.local; do
  if [[ -f "$f" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$f"
    set +a
  fi
done

: "${S3_BUCKET:?S3_BUCKET is required (set in .env.deploy or environment)}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?CLOUDFRONT_DISTRIBUTION_ID is required}"

AWS_REGION="${AWS_REGION:-us-east-1}"
export AWS_DEFAULT_REGION="$AWS_REGION"

# If npm isn't on PATH, try sourcing nvm (common on macOS interactive shells).
if ! command -v npm >/dev/null 2>&1; then
  [[ -s "$HOME/.nvm/nvm.sh" ]] && \. "$HOME/.nvm/nvm.sh" >/dev/null 2>&1 || true
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "✗ npm not found. Install Node 22+ or activate your nvm shell first." >&2
  exit 1
fi

# Verify AWS auth before building
if ! aws sts get-caller-identity >/dev/null 2>&1; then
  echo "✗ AWS credentials not found. Export AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY," >&2
  echo "  or configure ~/.aws/credentials, or set up an instance profile." >&2
  exit 1
fi

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
