export const meta = {
  name: 'cortex-blog-en-native-rewrite',
  description: 'Rewrite all 10 posts’ English into native idiom, then dual English+LCA review',
  phases: [
    { title: 'Native rewrite', detail: 'idiomatic English, Cortex voice, facts frozen' },
    { title: 'Dual review', detail: 'native-English editor + LCA verifier; finalize' },
  ],
}

const DIR = 'src/content/blog'
const SKILL = '~/.claude/skills/cortex-writing'

const SLUGS = [
  'ecoinvent-overestimates-china-renewables',
  'china-provincial-grid-factors',
  'crude-steel-bom-unit-error',
  'polymer-grade-inference',
  'bom-to-factors-without-averaging',
  'openlca-cortex-drives-it',
  'ecoinvent-system-models-explained',
  'iso-14067-vs-en-15804',
  'local-execution-data-never-uploaded',
  'asks-before-it-guesses',
]

// Facts that survived an LCA expert panel — the rewrite must NOT touch these.
const FROZEN = `FROZEN (rewrite the wording, NEVER the substance — these were corrected by an LCA expert panel and must stay exactly as-framed):
- The Ecoinvent vs HiQLCD story is a DISAGREEMENT (176% / 244%), never "overestimate/inflate".
- The steel BOM error is ~676x (from the mass/energy balance), never "10,000x" / "four extra zeros".
- The "Resin" post names NO specific inferred material (no PAM) and makes no ">95% confidence" identity claim.
- GWP100 is IPCC LCIA characterization, never "carried by" a system model.
- Run-of-river hydro: civil-works infrastructure amortization, never "reservoir".
- CBAM is not fed by cradle-to-gate LCI factors; no CBAM category error.
- "alignment with" standards, never "certification". Fourteen databases. DQI dims: Temporal, Geographic, Technology, Completeness, Reliability (Pedigree-Matrix lineage).
- Every number, name, and the Cortex hook stay identical. Keep the pillar, the structure, the opening <span class="dropcap">…</span>.`

const VOICE = `Cortex voice (read ${SKILL}/references/COPY_RUBRIC.md and ${SKILL}/references/voice-by-page.md): terse, specific, audit-ready — closer to The Economist than a startup pitch. Banned words apply (empower, leverage, seamless, robust, AI-powered, etc.). Pronoun discipline: Cortex = third person, "we" = HiQ-AI, reader = "you".`

const REWRITE_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['title', 'description', 'tags', 'body', 'changes'],
  properties: {
    title: { type: 'string' }, description: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    body: { type: 'string', description: 'Rewritten Markdown body, no frontmatter' },
    changes: { type: 'array', items: { type: 'string' }, description: 'The translationese/stiffness patterns you fixed' },
  },
}
const REVIEW_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['slug', 'reads_native', 'lca_intact', 'issues', 'final'],
  properties: {
    slug: { type: 'string' },
    reads_native: { type: 'boolean', description: 'Does it read as native English, free of translationese?' },
    lca_intact: { type: 'boolean', description: 'Are all facts/LCA framings preserved and correct?' },
    issues: { type: 'array', items: { type: 'string' } },
    final: { type: 'object', additionalProperties: false, required: ['title', 'description', 'tags', 'body'],
      properties: { title: { type: 'string' }, description: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, body: { type: 'string' } } },
  },
}

const rewritePrompt = (slug) => `You are a NATIVE English writer with deep LCA fluency — picture a sharp British/American LCA consultant who also writes for The Economist. You are rewriting an existing Cortex blog post so it reads as if it was conceived in English, not translated or assembled by a non-native.

Read the current post: ${DIR}/${slug}.mdx (with the Read tool). Also read ${SKILL}/references/COPY_RUBRIC.md, ${SKILL}/references/copy-editing-method.md, and ${SKILL}/references/product-truth.md.

Rewrite the English body for IDIOM and FLOW. Hunt and kill:
- translationese and calques; phrasing that mirrors Chinese rhetorical structure
- mechanical transitions ("Read the pattern before you read the cause"), over-explained logic, throat-clearing
- repeated sentence openings; monotone rhythm; hedging; filler
- any phrase a native LCA practitioner simply wouldn't say
Make it sharp, concrete, and natural. Vary cadence. Trust the reader.

${VOICE}

${FROZEN}

Return via StructuredOutput: the rewritten title, description (70-160 chars), tags (keep), body (Markdown, no frontmatter), and a short "changes" list of the translationese patterns you fixed.`

const reviewPrompt = (rw, slug) => `You hold TWO roles at once: (1) a native-English line editor with a ruthless ear for translationese, and (2) a senior LCA verifier. Review this rewritten post on BOTH axes and produce the final publishable English.

For fact-checking, Read the pre-rewrite source on disk: ${DIR}/${slug}.mdx — confirm the rewrite kept every number, claim, and LCA framing (it must NOT have reintroduced: "overestimate" framing, "10,000x", a named PAM/material, "carries GWP100", "reservoir" for run-of-river, a CBAM category error, "certification", or any non-fourteen database count).

As the native editor: does it read as native English, free of translationese, stiffness, and calques? Flag any sentence that still reads translated.
As the LCA verifier: is everything still correct and defensible?

APPLY a final polish directly — fix any residual stiffness and any LCA slip — and return the FINAL English. Return via StructuredOutput: reads_native, lca_intact, issues (what you found/fixed), and final {title, description, tags, body}. Set slug="${slug}".

REWRITTEN POST UNDER REVIEW:
TITLE: ${rw.title}
DESC: ${rw.description}
TAGS: ${rw.tags.join(', ')}
BODY:
${rw.body}`

phase('Native rewrite')
const results = await pipeline(
  SLUGS,
  (slug) => agent(rewritePrompt(slug), { label: `rewrite:${slug}`, phase: 'Native rewrite', schema: REWRITE_SCHEMA }).then((rw) => ({ slug, rw })),
  ({ slug, rw }) => agent(reviewPrompt(rw, slug), { label: `dual-review:${slug}`, phase: 'Dual review', schema: REVIEW_SCHEMA })
    .then((v) => ({ slug, final: v.final, reads_native: v.reads_native, lca_intact: v.lca_intact, issues: v.issues, changes: rw.changes })),
)

const ok = results.filter(Boolean)
log(`Rewrote ${ok.length}/${SLUGS.length}; flags: ${ok.filter((r) => !r.reads_native || !r.lca_intact).map((r) => r.slug).join(', ') || 'none'}`)
return ok
