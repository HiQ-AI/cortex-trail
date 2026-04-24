# cortex-trail

The public face of HiQ Cortex — marketing, methodology, docs, and blog.

- **Production**: https://cortex.hiq.earth (pending rollout)
- **Staging**: https://preview.hiq.earth

The name echoes the "Trail" quality in our [BRAND.md](https://github.com/HiQ-AI/cortex/blob/main/docs/BRAND.md): a chain of reasoning you can follow back to the origin. That's what this site is, too — the public breadcrumbs that lead into Cortex.

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

Voice guide: `desktop/whatsnew/_authoring/STYLE_GUIDE.md` in the parent Cortex repo.

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
cortex-trail/
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
