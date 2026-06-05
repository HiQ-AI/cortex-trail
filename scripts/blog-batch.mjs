export const meta = {
  name: 'cortex-blog-batch-10',
  description: 'Draft 10 bilingual (en+zh) Cortex blog posts, grounded & gate-checked',
  phases: [
    { title: 'Write EN', detail: 'cortex-writing Stage-1 writer per topic' },
    { title: 'Render ZH', detail: 'native parallel rewrite per topic' },
    { title: 'QA + fix', detail: 'fresh-eyes audit vs gates & grounding; apply fixes' },
  ],
}

// ── Skill files every agent must obey ───────────────────────────────
const SKILL = '~/.claude/skills/cortex-writing'

// Inline hard gates — backstop in case an agent skimps on reading.
const GATES = `
HARD GATES (a violation fails the draft):
- Database count is FOURTEEN. Never "12" / "twelve" / "5". (HiQLCD, Ecoinvent, EF, CarbonMinds, and others.)
- openLCA/brightway/积木LCA: say Cortex "connects to and operates" the engine; it "does not replace the engine, it drives it". NEVER write "IPC server", ports, gRPC, or "local Python" — internal, not public copy.
- NEVER "three gates" / "三道闸". Say Cortex pauses where automation would break an audit, give 2-4 UNNUMBERED examples, "the practitioner decides; recorded in the reasoning chain".
- Banned EN: empower, leverage, unlock, harness, streamline, seamless, powerful, robust, comprehensive, AI-powered, next-generation, purpose-built, end-to-end, holistic, revolutionary, world-class, mission-critical, actionable insights.
- Standards: "alignment with", NOT "certification". Cortex produces a reasoning chain; the practitioner files. No auto-filing.
- Pronoun: "Cortex" = product, third person. "we"/"我们" = HiQ-AI (the company). Reader = "you"/"你". Never "we at Cortex".
- Specificity test: every claim passes a number, a named artifact, or a specific process. Otherwise cut.
- No fake attribution (no client names, no "trusted by..."). No internal agent names.
- DQI five dimensions, this order/spelling: Temporal, Geographic, Technology, Completeness, Reliability.
- GROUNDING: use ONLY the facts in the brief + claims verifiable in product-truth.md. Invent NO numbers, names, or capabilities. Where the brief and product-truth.md conflict, product-truth wins.`

const PILLAR_VOICE = {
  audit: 'pillar "audit" (The Audit Trail): second person ("your BOM"), terse, evidence-led, NO snail metaphor.',
  journal: 'pillar "journal" (Practitioner\'s Journal): first person, a worked story; snail metaphor at most once.',
  dispatch: 'pillar "dispatch" (The Slow Dispatch): first-or-second person, reflective; snail metaphor permitted, sparing.',
}

// ── The 10 topics + grounding fact-sheets (product-truth-corrected) ──
const TOPICS = [
  {
    slug: 'ecoinvent-overestimates-china-renewables', pillar: 'audit',
    query: 'Ecoinvent China solar wind carbon footprint accuracy vs local data',
    hook: 'Cortex searches fourteen databases and returns top-k candidates side by side, DQI-scored; when the same material\'s cross-database GWP spread exceeds 2x it pauses for the practitioner instead of averaging.',
    facts: `Source: HiQLCD v1.4.0 (China LCI database) vs Ecoinvent v3.12.0 (cut-off — the only system model carrying GWP100). All values GWP100, kg CO2-eq per kWh.
- Solar PV: HiQLCD 0.029 vs Ecoinvent-China 0.080 (Ecoinvent +176%).
- Wind (onshore): HiQLCD 0.009 vs 0.031 (+244%).
- Coal thermal: 1.033 vs 1.210 (+17%; Ecoinvent includes a mine-CHP extreme value).
- Run-of-river hydro: HiQLCD 0.012 vs 0.005 (HiQLCD higher — it allocates reservoir-construction; boundary definitions differ).
- Nuclear PWR: 0.006 vs 0.008 (close; difference is uranium-mining / fuel-cycle boundary).
Root cause: Ecoinvent has no China-built scenario data; it transplants European/global manufacturing inventories, so it misses China's PV-cell and turbine manufacturing efficiency. Ecoinvent's China electricity = 33 provincial hard-coal datasets + global generics. HiQLCD = 4,862 China energy datasets, 4,256 energy-type, 31 provinces at provincial precision.
Consequence: inflated factors distort export carbon labels, CBAM filings, carbon-market pricing.`,
  },
  {
    slug: 'china-provincial-grid-factors', pillar: 'audit',
    query: 'China provincial grid emission factor vs national average LCA',
    hook: 'For an ambiguous "China electricity" input Cortex asks one clarifying question — which province, which year — then returns the region-specific factor with the DQI Geographic dimension scored; it does not silently pick a national average.',
    facts: `HiQLCD v1.4.0 covers all 31 Chinese provinces/municipalities at provincial precision (4,862 China energy datasets). Provincial grids differ sharply: coal-dominant northern grids vs hydro-heavy south-western grids. A single national-average grid factor misrepresents a province-specific product. Many international databases offer only a China national average or a transplanted generic. DQI five dimensions: Temporal, Geographic, Technology, Completeness, Reliability — the Geographic dimension is exactly what a national average sacrifices.`,
  },
  {
    slug: 'crude-steel-bom-unit-error', pillar: 'audit',
    query: 'LCA data quality error BOM steel unit mistake catch',
    hook: 'Cortex Cowork reads the Excel BOM in place, runs the mass/energy balance, and surfaces each anomaly with the reasoning recorded in the project decision log; it flags and returns the decision rather than silently filling the number.',
    facts: `Real case: Cortex Cowork analysing a crude-steel producer's BOM. 12 processes (6 main smelting + 6 auxiliary), output 2,093,927 t/yr crude steel/billet, 85 purchased materials of which 71 matched = 83.5% LCA match rate, 45 data-quality issues found.
The unit error: the coking process listed mixed-grid electricity as 6,649,140 (万kWh) — larger than the whole plant's total of 95,503 (万kWh). Back-calculating from the plant electricity balance, the true value is ~9,838 (万kWh): a raw kWh figure had been entered into the 万kWh (x10,000) field — a ~10,000x error.
Critical gaps also flagged: air emissions (SOx, NOx, particulates) blank across all 12 processes; external transport distances entirely empty.
NOTE: Cortex produces the reasoning chain and flags issues; it is not an audit certification and the practitioner decides.`,
  },
  {
    slug: 'polymer-grade-inference', pillar: 'journal',
    query: 'identify unknown material grade BOM polymer resin LCA',
    hook: 'Fuzzy-material identification + clarification + self-correcting retrieval; a proxy substitution is exactly the kind of decision Cortex pauses on and returns to the practitioner, recorded in the reasoning chain. Top-k, not a single guessed number.',
    facts: `Real case: a customer BOM for an industrial IoT controller listed a material only as 「高分子」/「树脂」 (polymer/resin) — a non-standard name, no grade. From the surrounding process context and the rest of the inventory Cortex inferred the material as PAM (polyacrylamide) at >95% confidence, then proposed it with literature verification. The first database search returned malformed record links; Cortex detected the bad result and re-queried (self-correcting search), then returned multiple proxy candidates plus an expert recommendation for the next step.`,
  },
  {
    slug: 'bom-to-factors-without-averaging', pillar: 'audit',
    query: 'match BOM to emission factors Scope 3 without averaging',
    hook: 'No averaging, no single fabricated number — the practitioner sees the spread and decides; when coverage falls below 80% or a proxy is needed, Cortex pauses and returns the decision.',
    facts: `Cortex matches a BOM to emission factors across fourteen databases (HiQLCD, Ecoinvent, EF, CarbonMinds, and others). Returns top-k candidates per row (NOT top-1), each carrying: GWP value, unit, geographic region, system model, source URL, and a DQI score across five dimensions (Temporal, Geographic, Technology, Completeness, Reliability). Matching is tiered: same item -> close family -> equivalent use -> generic entry. Editor-cleared benchmark: ~10 min for a 100-row BOM, with DQI-scored candidates per row. Export carries full provenance. All 15 GHG Protocol Scope 3 categories are supported (Cowork).`,
  },
  {
    slug: 'openlca-cortex-drives-it', pillar: 'audit',
    query: 'openLCA AI emission factor matching automate calculation',
    hook: 'Cortex does not replace the calculation engine — it drives it; openLCA users keep working in openLCA.',
    facts: `Cortex does NOT replace the LCA engine; it drives it. Cortex Cowork connects to and operates openLCA end-to-end: it matches background datasets, builds the product system, runs the LCIA with a chosen impact method, and retrieves the contribution tree (emission hotspots). You keep working in openLCA. The real bottleneck is the flow match — pairing a real-world BOM item to the right database entry — which is Cortex's cross-database search (top-k candidates, DQI-scored, provenance kept).
Cortex also drives brightway and 积木LCA; it complements SimaPro and GaBi.
DO NOT claim a "HiQ AI Match" open-source contribution to openLCA / greenDelta — that was an internal demo, never contributed; it must not appear in copy.
COPY RULE: do NOT mention "IPC server", ports, gRPC, or "local Python" — internal accuracy, not public copy. Say "connects to and operates".`,
  },
  {
    slug: 'ecoinvent-system-models-explained', pillar: 'audit',
    query: 'Ecoinvent cut-off vs APOS vs consequential which system model',
    hook: 'Cortex carries embedded LCA expertise: ask "cut-off vs APOS for my stainless-steel row?" and it cites the dataset record and system-model documentation, not a training-data summary; an ambiguous system-model match is a situation where Cortex pauses and asks.',
    facts: `Ecoinvent ships the same datasets under different system models (cut-off, APOS = Allocation at the Point of Substitution, consequential). They answer different questions and are NOT interchangeable; choosing the wrong one for your goal-and-scope silently changes the result. In the China-power comparison context, cut-off was the only model carrying a GWP100 value. Ground ALL terminology (cut-off / APOS / consequential / allocation / system boundary) in lca-terminology.md and use its canonical phrasing.`,
  },
  {
    slug: 'iso-14067-vs-en-15804', pillar: 'audit',
    query: 'ISO 14067 vs EN 15804 product carbon footprint EPD which standard',
    hook: 'Cortex\'s embedded expert knowledge base carries these methodologies and system-boundary conventions, so it answers "which standard governs this deliverable" with the boundary/module implications and a citation — not a generic summary.',
    facts: `ISO 14067 specifies requirements for the carbon footprint of a product (PCF). EN 15804 is the European core PCR (product category rules) for construction-product EPDs, within the ISO 14025 / ISO 21930 EPD framework; it governs which life-cycle modules (A1-A3, etc.) an EPD reports. So: a standalone product carbon footprint -> ISO 14067; a construction-product EPD -> EN 15804 (with ISO 14067 informing the GWP indicator). Cortex aligns with ISO 14067, ISO 14044, GHG Protocol Product Standard, EF 3.1 / PEF, and CBAM (transitional + definitive). ALIGNMENT, not certification — certification is verifier-led and project-scope. Ground terminology via lca-terminology.md.`,
  },
  {
    slug: 'local-execution-data-never-uploaded', pillar: 'dispatch',
    query: 'LCA tool data privacy local supply chain BOM not uploaded',
    hook: 'Think in the cloud, act locally — the AI comes to your data; it does not take your data away.',
    facts: `Cortex Cowork runs on your machine (macOS — Apple Silicon + Intel —, Windows, Linux), zero-config. The split: the CLOUD handles AI reasoning, task planning, and LCA database search; YOUR COMPUTER handles file read/write/search, local tool execution, the workspace and conversation history, and your BOM / cost / supply-chain data. Files never leave the device. Project memory is local; Cortex does not federate data across customers. Editor-cleared framing: "think in the cloud, act locally". Keep it concrete (which side does what); avoid a vague "secure".`,
  },
  {
    slug: 'asks-before-it-guesses', pillar: 'dispatch',
    query: 'human in the loop LCA AI does not guess emission factor',
    hook: 'An LCA number you can defend requires a tool that asks before it guesses. "It does not replace experts. It scales their judgment."',
    facts: `Cortex pauses where automation would break an audit and returns the decision to the practitioner — the decision is recorded in the reasoning chain. Common, NON-exhaustive, NEVER-numbered, NEVER "three gates" examples: coverage below 80% of BOM rows confidently matched; a proxy substitution is required; cross-database GWP spread above 2x for the same material; restricted/licensed data with no access (Cortex won't silently substitute a literature value); an ambiguous system-model match (cut-off vs APOS vs consequential). Editor-cleared line: "It does not replace experts. It scales their judgment."`,
  },
]

// ── Schemas ─────────────────────────────────────────────────────────
const EN_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['title', 'description', 'tags', 'body', 'word_count', 'note'],
  properties: {
    title: { type: 'string', description: 'Post title, <= 70 chars, no "— HiQ Cortex" suffix' },
    description: { type: 'string', description: 'Meta description, 70-160 chars' },
    tags: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 6 },
    body: { type: 'string', description: 'Markdown body (no frontmatter). ## H2, ### H3, **bold**, > quote, lists. May open with <span class="dropcap">X</span>.' },
    word_count: { type: 'integer' },
    note: { type: 'string', description: 'Editorial note: hardest part, what is most uncertain' },
  },
}
const ZH_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['title', 'description', 'tags', 'body'],
  properties: {
    title: { type: 'string', description: '中文标题，<= 30 字' },
    description: { type: 'string', description: '中文 meta 描述' },
    tags: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 6 },
    body: { type: 'string', description: '中文 Markdown 正文（无 frontmatter）。CJK-Latin 半角空格。' },
  },
}
const QA_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['passed_before_fix', 'issues', 'en', 'zh'],
  properties: {
    passed_before_fix: { type: 'boolean' },
    issues: { type: 'array', items: { type: 'string' }, description: 'Gate/grounding violations found (and fixed). Empty if clean.' },
    en: {
      type: 'object', additionalProperties: false, required: ['title', 'description', 'tags', 'body'],
      properties: { title: { type: 'string' }, description: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, body: { type: 'string' } },
    },
    zh: {
      type: 'object', additionalProperties: false, required: ['title', 'description', 'tags', 'body'],
      properties: { title: { type: 'string' }, description: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, body: { type: 'string' } },
    },
  },
}

// ── Stage prompts ───────────────────────────────────────────────────
const writeEN = (t) => `You are a Stage-1 Writer for the HiQ Cortex blog, working inside the cortex-writing skill.
FIRST, with the Read tool, read and obey:
  ${SKILL}/agents/writer.md
  ${SKILL}/references/COPY_RUBRIC.md
  ${SKILL}/references/product-truth.md
  ${SKILL}/references/lca-terminology.md
  ${SKILL}/references/templates.md   (the Blog post section)
  ${SKILL}/references/banned-words.md

Write ONE English blog post. Shape D (editorial long-form), ${PILLAR_VOICE[t.pillar]}
Length 800-1500 words, one argument. Target search intent: "${t.query}".
It MUST tie to Cortex (this is the point of the post): ${t.hook}

GROUNDING FACTS — the post's factual claims come ONLY from here (plus product-truth.md):
${t.facts}
${GATES}

Return via the StructuredOutput tool. Body = Markdown only (no frontmatter, no title H1 — the title is a separate field). Open with a <span class="dropcap">X</span> on the first letter if it fits the pillar.`

const renderZH = (en, t) => `You are the ZH translator for the HiQ Cortex blog (cortex-writing skill). This is a NATIVE parallel rewrite, not literal translation.
FIRST, with the Read tool, read and obey:
  ${SKILL}/agents/translator-zh.md
  ${SKILL}/references/BRAND.md
  ${SKILL}/references/STYLE_GUIDE.md
  ${SKILL}/references/banned-words.md   (ZH section, zero tolerance)
  ${SKILL}/references/lca-terminology.md   (CN-specific terminology table)
  ${SKILL}/references/product-truth.md

Render this English post into native Chinese for cortex.hiq.earth, ${PILLAR_VOICE[t.pillar]}
Preserve the argument and EVERY number exactly (write "14 个数据库", "83.5%", "2×", "~10,000×"). Keep technical terms in English where the Chinese LCA community does (Cortex / DQI / CBAM / BOM / GWP / Ecoinvent / HiQLCD / openLCA / brightway / 积木LCA). CJK-Latin half-width spacing. Pronoun: 我们=HiQ-AI, Cortex 第三人称, 读者=你.
Same grounding facts apply — invent nothing:
${t.facts}
${GATES}

ENGLISH POST:
TITLE: ${en.title}
DESCRIPTION: ${en.description}
BODY:
${en.body}

Return via StructuredOutput.`

const qa = (pair, t) => `You are a FRESH-EYES editor + fact-checker for the HiQ Cortex blog (cortex-writing skill). The writer and translator cannot audit their own work — you do.
Read ${SKILL}/references/COPY_RUBRIC.md, ${SKILL}/references/product-truth.md, ${SKILL}/references/banned-words.md, ${SKILL}/references/lca-terminology.md.

Audit BOTH the English and Chinese posts below against:
1. The HARD GATES.${GATES}
2. GROUNDING — every number/name/claim must come from these facts or be verifiable in product-truth.md. Flag and remove anything fabricated:
${t.facts}
3. The post must clearly tie to Cortex (hook: ${t.hook}). 4. Voice: ${PILLAR_VOICE[t.pillar]}

APPLY FIXES directly: rewrite any violation, remove fabricated claims, fix 12->14 databases, strip any "IPC server"/"three gates"/"AI-powered"/banned words, fix pronouns, enforce specificity. Keep the author's argument and length.
Return via StructuredOutput: passed_before_fix (was it clean before your fixes?), issues (what you fixed), and the FINAL corrected en {title,description,tags,body} and zh {title,description,tags,body}. The en/zh you return are the publishable versions.

ENGLISH:
TITLE: ${pair.en.title}
DESC: ${pair.en.description}
TAGS: ${pair.en.tags.join(', ')}
BODY:
${pair.en.body}

中文:
标题: ${pair.zh.title}
描述: ${pair.zh.description}
标签: ${pair.zh.tags.join(', ')}
正文:
${pair.zh.body}`

// ── Pipeline ────────────────────────────────────────────────────────
log(`Drafting ${TOPICS.length} bilingual posts through write -> render -> QA`)

const results = await pipeline(
  TOPICS,
  (t) => agent(writeEN(t), { label: `write:${t.slug}`, phase: 'Write EN', schema: EN_SCHEMA }),
  (en, t) => agent(renderZH(en, t), { label: `zh:${t.slug}`, phase: 'Render ZH', schema: ZH_SCHEMA }).then((zh) => ({ en, zh })),
  (pair, t) => agent(qa(pair, t), { label: `qa:${t.slug}`, phase: 'QA + fix', schema: QA_SCHEMA })
    .then((v) => ({ slug: t.slug, pillar: t.pillar, query: t.query, passed_before_fix: v.passed_before_fix, issues: v.issues, en: v.en, zh: v.zh })),
)

const ok = results.filter(Boolean)
log(`Done: ${ok.length}/${TOPICS.length} posts produced`)
return ok
