import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// /llms.txt — a curated, LLM-friendly map of the site (https://llmstxt.org).
// Helps AI crawlers and assistants understand what HiQ Cortex is and where the
// authoritative pages live, in Markdown they can read directly.

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://cortex.hiq.earth')).toString().replace(/\/$/, '');
  const u = (path: string) => `${base}${path}`;

  const posts = (await getCollection('blog', ({ data }) => !data.draft && data.locale === 'en')).sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );
  const blogLines = posts.map(
    (p) => `- [${p.data.title}](${u(`/blog/${p.id}/`)}): ${p.data.description}`,
  );

  const body = `# HiQ Cortex

> HiQ Cortex is an LCA (life-cycle assessment) workbench built specifically for LCA, not general AI. It searches fourteen authoritative LCA databases, matches BOM rows to emission factors as top-k DQI-scored candidates with full provenance (never a single averaged number), drives the calculation engine you already use (openLCA, brightway, 积木LCA) instead of replacing it, and records every decision in a reasoning chain a verifier can walk back. Built by HiQ-AI (海科). Site is bilingual: English and 简体中文.

Two products share one engine. Cortex Chat (web) answers cross-database emission-factor questions and clarifies before searching. Cortex Cowork (desktop: macOS, Windows, Linux) reads local project files, operates the LCA engine end to end, and logs substitution decisions in versioned project memory. Your BOM, cost, and supply-chain data stay on your machine — the AI comes to your data; it does not take your data away.

Outputs align with (they do not certify under) ISO 14067, ISO 14044, EN 15804+A2, the GHG Protocol Product Standard, PEF / EF 3.1, and CBAM. DQI is scored across five Pedigree-Matrix dimensions: Temporal, Geographic, Technology, Completeness, Reliability. Contact: info@hiqlcd.com.

## Product
- [Cortex Chat](${u('/product/chat')}): Web app. Natural-language search across fourteen LCA databases; asks a clarifying question before searching; returns top-k DQI-scored candidates with source, region, and system model — not a single number.
- [Cortex Cowork](${u('/product/cowork')}): Desktop agent. Reads/writes local files, drives openLCA / brightway / 积木LCA, runs multi-step LCA workflows, and keeps a versioned reasoning chain per project. Data never leaves the device.
- [Pricing](${u('/pricing')}): Free €0 / Pro €99 per month / Plus €299 per month (adds Cowork). Database licenses are purchased separately from the subscription.

## Solutions
- [BOM matching](${u('/solutions/bom-matching')}): Match a bill of materials to emission factors across fourteen databases, DQI-scored per row, with full provenance.
- [Product carbon footprint](${u('/solutions/product-carbon-footprint')}): Run a PCF calculation in openLCA with Cortex operating the engine and flagging where it must pause.
- [LCA dataset authoring](${u('/solutions/lca-dataset-authoring')}): Author and quality-score datasets against the Pedigree Matrix in HiQ Editor.
- [ILCD validation and conversion](${u('/solutions/ilcd-validation')}): Validate and convert ILCD / EcoSpold datasets without silently dropping fields.
- [EPD audit](${u('/solutions/epd-audit')}): Audit EPD submission dossiers against ISO 14025, EN 15804+A2, the PCR, and CPR 2024/3110; output a branded PDF report (other formats supported).

## Standards & methodology
- [Standards alignment](${u('/standards')}): What Cortex outputs align with — ISO 14067, ISO 14044, EN 15804, GHG Protocol, PEF / EF 3.1, CBAM, Scope 3 — and why alignment is not certification.
- [Security](${u('/security')}): Local-execution architecture; what stays on your device and what does not.
- [API docs](${u('/docs')}): Reach the same Cortex agent over four protocols — REST, MCP, AG-UI, A2A.

## Blog
${blogLines.join('\n')}

## Chinese / 中文
- [HiQ Cortex 中文站](${u('/zh')}): LCA 工作台，每一行都经得起追问。所有页面均有中文版本（${u('/zh/...')}）。
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
