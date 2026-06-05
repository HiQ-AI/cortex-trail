export const meta = {
  name: 'cortex-blog-fix',
  description: 'Apply LCA-expert fixes to the 8 flagged posts, then re-review',
  phases: [
    { title: 'Fix', detail: 'apply per-post expert findings + sweeps + user decisions' },
    { title: 'Re-review', detail: 'fresh expert recheck of each fixed post' },
  ],
}

const DIR = 'src/content/blog'
const SKILL = '~/.claude/skills/cortex-writing'
const FINDINGS = '/tmp/blog-findings.json'

// 2 posts were clean (openlca-cortex-drives-it, local-execution-data-never-uploaded) — not touched.
const POSTS = [
  'ecoinvent-overestimates-china-renewables',
  'crude-steel-bom-unit-error',
  'polymer-grade-inference',
  'bom-to-factors-without-averaging',
  'ecoinvent-system-models-explained',
  'iso-14067-vs-en-15804',
  'china-provincial-grid-factors',
  'asks-before-it-guesses',
]

const SWEEP = `CROSS-POST SWEEPS (apply if present):
- GWP100 is IPCC LCIA characterization, NOT a property of a system model. NEVER say a system model "carries/has GWP100". For ecoinvent-system-models-explained, reframe "cut-off was the only one carrying a GWP100 value" as a data-AVAILABILITY artifact (the GWP100-characterized result was only available for the cut-off records in that comparison) and cite the record.
- CBAM: background-LCI factors (Ecoinvent/HiQLCD cradle-to-gate) are NOT CBAM filing inputs — CBAM uses installation-specific actual data (EU ETS monitoring). Do not imply otherwise. Only mention CBAM where defensible, qualified to its real rules.
- "orders of magnitude" for system-model choice (cut-off vs APOS) is OVERSTATED — it typically shifts results by tens of percent, occasionally ~2x. Use a defensible magnitude.
- DQI five dimensions (Temporal, Geographic, Technology, Completeness, Reliability): acknowledge the Pedigree-Matrix lineage; don't present it as a Cortex invention.
- Remove any internal meta-language that leaked into reader copy (e.g. the literal phrase "editor-cleared").
- Keep numbers consistent with each other within a post. Keep the Cortex hook intact. Do NOT introduce banned words or new unverifiable claims while fixing.`

const SPECIAL = {
  'ecoinvent-overestimates-china-renewables': `USER DECISION: reframe to a NEUTRAL "the two databases DISAGREE by 176%/244%" story — NOT "Ecoinvent overestimates/inflates". Keep the title "The 176% Gap...".
- Remove every directional judgment ("overestimate", "inflate", "Europe billed to China"). Present both databases as candidates; the practitioner decides.
- DELETE the false claim "Ecoinvent has no China-built scenario data ...". Soften to: specific Ecoinvent records have weak geographic/technology representativeness for China-built PV/turbine manufacturing. Do NOT assert the data doesn't exist.
- FIX GWP100 category error (see sweep). Just "Ecoinvent v3.12.0, cut-off"; GWP100 comes from IPCC characterization applied to the inventory.
- FIX run-of-river hydro: do NOT say "reservoir construction" (run-of-river has no reservoir). Attribute the higher value to diversion-weir / intake / penstock / powerhouse civil works (concrete + steel) amortized over a low capacity factor — an infrastructure-amortization BOUNDARY difference, not an accuracy defect.
- FIX CBAM: drop CBAM from the "this gap is now in your..." consequence list; use "export carbon label, product carbon footprint, carbon-market price".
- HiQLCD numbers are HiQ's proprietary study — one credible candidate, not the proven truth.`,

  'crude-steel-bom-unit-error': `Make the magnitude INTERNALLY CONSISTENT using the mass/energy BALANCE as the single anchor:
- The coking-process mixed-electricity was entered as 6,649,140 (万kWh) — larger than the whole plant's 95,503 (万kWh). The plant electricity balance back-calculates a true value of ~9,838 (万kWh). So the entered figure is ~676x the true value (6,649,140 / 9,838 ≈ 676) and ~70x the entire plant's output — an impossibility the balance catches.
- REMOVE "10,000x" / "four extra zeros" / "a clean x10,000 unit-field slip" (inconsistent with ~9,838). RETITLE away from "10,000x" — use "~676x" or a qualitative title ("the impossible electricity figure", "two orders of magnitude off").
- The point: the MASS/ENERGY BALANCE caught an impossible value. Don't over-specify the data-entry cause beyond "a magnitude/unit error". Drop any "~70x passes a plausibility check" phrasing and any unsupported engine-capability assertion.`,

  'polymer-grade-inference': `USER DECISION: rewrite as a METHODOLOGY post with NO specific inferred material and NO fabricated case.
- REMOVE "PAM"/"polyacrylamide" entirely (physically wrong for a molded structural part). REMOVE the ">95% confidence" on a specific identity. Frame confidence as "a hypothesis to verify, not an answer".
- Keep the real, defensible mechanics: Cortex asks a clarifying question; narrows from process context + the rest of the inventory; runs a self-correcting search when a result looks malformed; returns ranked candidates WITH provenance; and RETURNS the proxy/identity decision to the practitioner, recorded in the reasoning chain.
- If an example is needed, use a CLASS as illustration (e.g. "a glass-filled engineering thermoplastic") clearly labelled as illustration, never a claimed real identity. Title "The BOM Row That Just Said 'Resin'" is fine.`,

  'bom-to-factors-without-averaging': `- REMOVE "all 15 GHG Protocol Scope 3 categories supported" — scope inflation for a Cat-1/BOM post. Keep the BOM/Category-1 focus.
- Keep "~10 min for a 100-row BOM" only WITH conditions or as clearly illustrative; remove the literal "editor-cleared" qualifier.`,

  'iso-14067-vs-en-15804': `- EN 15804 is the CORE rules for construction-product EPDs, with product-specific c-PCRs layered ON TOP — not flatly "the core PCR".
- Note EN 15804+A2 made modules C1-C4 and D mandatory for most construction EPDs and split GWP into sub-indicators (GWP-fossil, GWP-biogenic, GWP-luluc).
- Soften ISO 14067 "a single number" (biogenic carbon / land-use are reported separately).
- ZH: 产品种类 -> 产品类别规则; fix 直译腔; unify "CO2-eq" notation.`,

  'ecoinvent-system-models-explained': `- Apply the GWP100 sweep (data-availability artifact, cite record).
- "orders of magnitude" for cut-off vs APOS is overstated -> tens of percent, occasionally ~2x.`,

  'china-provincial-grid-factors': `- Don't equate "grid factor" with "a GWP100 value" (inventory vs characterization).
- Avoid "embedded-emissions"/CBAM phrasing for the general claim.
- Soften "the wrong number": a national average is valid for SOME goal/scope, just not province-specific ones.`,

  'asks-before-it-guesses': `- Soften "choosing wrong can shift a result by an order of magnitude" to a defensible magnitude (e.g. "can roughly double in some boundaries").
- Optionally tighten CBAM phrasing for precision.`,
}

const POST_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['en', 'zh', 'changes'],
  properties: {
    en: { type: 'object', additionalProperties: false, required: ['title', 'description', 'tags', 'body'],
      properties: { title: { type: 'string' }, description: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, body: { type: 'string' } } },
    zh: { type: 'object', additionalProperties: false, required: ['title', 'description', 'tags', 'body'],
      properties: { title: { type: 'string' }, description: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, body: { type: 'string' } } },
    changes: { type: 'array', items: { type: 'string' }, description: 'What you changed and why' },
  },
}

const RECHECK_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['slug', 'pass', 'remaining'],
  properties: {
    slug: { type: 'string' },
    pass: { type: 'boolean', description: 'true if no blocker- or should-fix-severity LCA issues remain' },
    remaining: { type: 'array', items: { type: 'string' }, description: 'Any LCA issues still present after the fix' },
  },
}

const fixPrompt = (slug) => `You are an LCA-literate Cortex editor fixing a blog post that an expert panel flagged. Apply the fixes faithfully and return the corrected English AND Chinese versions.

1. Read the current post: ${DIR}/${slug}.mdx and ${DIR}/${slug}-zh.mdx (with the Read tool).
2. Read the expert findings: run \`cat ${FINDINGS}\` (or Read it) and use the entries under keys "${slug}" and "${slug}-zh". Each finding has location/problem/fix — apply every one.
3. Obey the Cortex gates: read ${SKILL}/references/COPY_RUBRIC.md and ${SKILL}/references/product-truth.md. Database count is FOURTEEN. No banned words. No "IPC server"/"three gates"/"AI-powered". Alignment, not certification. Cortex = third person; "we"/"我们" = HiQ-AI; reader = "you"/"你". Every claim passes the specificity test.

${SPECIAL[slug] || ''}

${SWEEP}

Preserve the post's argument, length, pillar voice, the opening <span class="dropcap">…</span>, and the Cortex hook. The Chinese version must mirror the corrected English (native rewrite, ZH banned-words clean, "14 个数据库", CJK-Latin half-width spacing). Return the FINAL corrected en {title,description,tags,body} and zh {title,description,tags,body} via StructuredOutput, plus a short "changes" list. Body = Markdown, no frontmatter.`

const recheckPrompt = (fixed, slug) => `You are a hard-nosed third-party LCA verifier + LCI/standards expert doing a RE-REVIEW of a post that was just corrected. Be skeptical; confirm the fixes actually hold and no new LCA error was introduced.
The post must be defensible to a real LCA audience. Check especially: GWP100 is characterization not a system-model property; no CBAM category error; no run-of-river/reservoir contradiction; internal numeric consistency; no overstated "orders of magnitude"; no fabricated specific case; alignment-not-certification; fourteen databases.

SLUG: ${slug}
ENGLISH:
TITLE: ${fixed.en.title}
DESC: ${fixed.en.description}
BODY:
${fixed.en.body}

中文:
标题: ${fixed.zh.title}
正文:
${fixed.zh.body}

Return via StructuredOutput: pass (true only if NO blocker/should-fix LCA issue remains) and remaining[] (anything still wrong). Set slug="${slug}".`

phase('Fix')
const results = await pipeline(
  POSTS,
  (slug) => agent(fixPrompt(slug), { label: `fix:${slug}`, phase: 'Fix', schema: POST_SCHEMA }).then((p) => ({ slug, ...p })),
  (fixed, slug) => agent(recheckPrompt(fixed, slug), { label: `recheck:${slug}`, phase: 'Re-review', schema: RECHECK_SCHEMA })
    .then((v) => ({ slug, en: fixed.en, zh: fixed.zh, changes: fixed.changes, recheck: v })),
)

const ok = results.filter(Boolean)
log(`Fixed ${ok.length}/${POSTS.length}; still failing: ${ok.filter((r) => !r.recheck.pass).map((r) => r.slug).join(', ') || 'none'}`)
return ok
