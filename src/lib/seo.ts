// Centralized SEO helpers: hreflang pairing + JSON-LD builders.
// Keep this the single source of truth so every page emits consistent
// language alternates and structured data.

export const SITE = {
  name: 'HiQ Cortex',
  legalName: 'HiQ-AI',
  url: 'https://cortex.hiq.earth',
  email: 'info@hiqlcd.com',
  // The umbrella product/brand and its parent. Used in Organization JSON-LD.
  parentUrl: 'https://www.hiq.earth',
} as const;

export type Locale = 'en' | 'zh';

export interface Alternate {
  hreflang: string;
  href: string;
}

/**
 * Compute the en/zh path counterparts for a path-prefixed page.
 *
 * Works for every page whose Chinese variant lives under the `/zh` prefix
 * (about, pricing, solutions, product, docs, guides, blog index, …).
 * Blog *posts* use a `-zh` filename suffix instead and must pass explicit
 * alternates — see makeAlternates().
 */
export function pathCounterparts(
  pathname: string,
  locale: Locale,
): { en: string; zh: string } {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (locale === 'zh') {
    const en = p === '/zh' ? '/' : p.replace(/^\/zh/, '') || '/';
    return { en, zh: p };
  }
  const zh = p === '/' ? '/zh' : `/zh${p}`;
  return { en: p, zh };
}

/**
 * Build the full hreflang alternate set (absolute URLs) from two paths.
 * x-default points at the English page, matching Google's recommendation
 * for an international site with an English default locale.
 */
export function makeAlternates(
  site: URL | string | undefined,
  enPath: string,
  zhPath: string,
): Alternate[] {
  const base = site ? new URL(site).toString().replace(/\/$/, '') : SITE.url;
  const abs = (path: string) => {
    const clean = path.startsWith('/') ? path : `/${path}`;
    // Match Astro's directory build format (trailing slash), except root.
    const withSlash = clean === '/' ? '/' : `${clean.replace(/\/$/, '')}/`;
    return `${base}${withSlash}`;
  };
  return [
    { hreflang: 'en', href: abs(enPath) },
    { hreflang: 'zh-CN', href: abs(zhPath) },
    { hreflang: 'x-default', href: abs(enPath) },
  ];
}

// ─── JSON-LD builders ───────────────────────────────────────────────

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    email: SITE.email,
    logo: `${SITE.url}/og-default.png`,
    description:
      'HiQ Cortex is an LCA workbench built specifically for life-cycle assessment: authoritative databases, direct integration with professional LCA software (openLCA, brightway, 积木LCA), and a full reasoning chain at every step.',
    sameAs: [SITE.parentUrl],
  };
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: ['en', 'zh-CN'],
  };
}

export interface BlogPostingInput {
  url: string;
  title: string;
  description: string;
  datePublished: string; // ISO date
  dateModified?: string;
  author: string;
  locale: Locale;
  image?: string;
}

export function blogPostingLd(post: BlogPostingInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    inLanguage: post.locale === 'zh' ? 'zh-CN' : 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': post.url },
    image: post.image ?? `${SITE.url}/og-default.png`,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export interface Crumb {
  name: string;
  url: string;
}

export function breadcrumbLd(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

export function faqLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
