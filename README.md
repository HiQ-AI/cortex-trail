# hiq-cortex-web

Marketing + docs + blog for HiQ Cortex — https://cortex.hiq.earth (production, pending rollout) · https://preview.hiq.earth (staging).

## Stack

- **Astro 5** (SSG) + MDX content collections
- **Tailwind 3** for styling; design tokens in `tailwind.config.mjs` + `src/styles/global.css`
- **i18n**: English primary (`/`), Chinese fallback (`/zh`). See `astro.config.mjs`.
- **Deploy**: S3 + CloudFront (us-east-1), DNS via Cloudflare
- **CI**: GitHub Actions on push to `main`

## Local dev

```bash
npm install
npm run dev
# → http://localhost:4321
```

## Content authoring

- **Marketing pages**: `src/pages/*.astro` (English), `src/pages/zh/*.astro` (Chinese)
- **Blog posts**: `src/content/blog/*.mdx` with frontmatter `locale: en | zh`
- **Docs**: `src/content/docs/*.mdx` with frontmatter `section`, `order`, `locale`

Brand source of truth: `../cortex/docs/BRAND.md`. Voice guide:
`../cortex/desktop/whatsnew/_authoring/STYLE_GUIDE.md`.

## Deploy

Production deploys run from GitHub Actions on merge to `main`. Manual deploy:

```bash
npm run build
./scripts/deploy.sh           # syncs dist/ → S3 + invalidates CloudFront
```

Infrastructure bootstrap is a one-shot:

```bash
./scripts/bootstrap-infra.sh  # creates S3 bucket, CloudFront distribution, Cloudflare DNS
```

## Structure

```
hiq-cortex-web/
├── astro.config.mjs           # i18n, integrations, site URL
├── tailwind.config.mjs        # design tokens
├── src/
│   ├── pages/                 # routed pages (Astro files)
│   │   ├── index.astro        # English landing
│   │   ├── solutions/         # /solutions/bom-matching etc.
│   │   ├── methodology.astro
│   │   ├── blog/index.astro
│   │   ├── docs/index.astro
│   │   ├── 404.astro
│   │   └── zh/                # Chinese mirror
│   ├── content/               # collections (blog, docs)
│   ├── components/            # Header, Footer, SiteHead
│   ├── layouts/               # BaseLayout
│   └── styles/                # global.css (Tailwind entry + base layer)
├── public/                    # static assets (snail.svg, favicons)
└── scripts/                   # infra + deploy helpers
```
