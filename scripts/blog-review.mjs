export const meta = {
  name: 'cortex-blog-expert-review',
  description: 'Panel of LCA-expert agents adversarially reviews the 10 blog posts for domain errors',
  phases: [
    { title: 'Expert review', detail: '4 distinct LCA-expert lenses, all 10 posts' },
    { title: 'Synthesize', detail: 'dedup + rank findings into one report' },
  ],
}

const DIR = 'src/content/blog'
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
const EN_FILES = SLUGS.map((s) => `${DIR}/${s}.mdx`)
const ZH_FILES = SLUGS.map((s) => `${DIR}/${s}-zh.mdx`)

const CONTEXT = `These are marketing blog posts for HiQ Cortex, an LCA workbench. The China electricity factors (HiQLCD vs Ecoinvent) come from HiQ's own proprietary comparison study — you cannot verify HiQ's measured values, so DO NOT flag them as "unverifiable"; instead judge (a) physical PLAUSIBILITY of the values, (b) whether the methodological CLAIMS about why the databases differ are correct, (c) whether the framing is DEFENSIBLE to a third-party verifier. Your job is to stop the company from publishing something a real LCA practitioner would laugh at or a verifier would tear apart. Be specific and harsh. A vague "looks fine" is useless.`

const FINDINGS_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['lens', 'overall', 'findings'],
  properties: {
    lens: { type: 'string' },
    overall: { type: 'string', description: 'One-paragraph verdict: are these publishable to an LCA audience? Worst problems?' },
    findings: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['slug', 'lang', 'severity', 'location', 'problem', 'fix'],
        properties: {
          slug: { type: 'string' },
          lang: { type: 'string', enum: ['en', 'zh', 'both'] },
          severity: { type: 'string', enum: ['blocker', 'should-fix', 'nit'] },
          location: { type: 'string', description: 'Short verbatim quote of the problematic text' },
          problem: { type: 'string', description: 'Why an LCA expert would object' },
          fix: { type: 'string', description: 'Concrete corrected phrasing or what to do' },
        },
      },
    },
  },
}

const LENSES = [
  {
    key: 'lci-system-models',
    persona: `You are a senior LCA practitioner and LCI database specialist (15+ yrs, ecoinvent power user, has built China grid datasets). You know cut-off vs APOS vs consequential cold, allocation methods, system boundaries, GWP100 vs other metrics, and what is/isn't physically plausible for grid emission factors.`,
    focus: `Scrutinize: every claim about Ecoinvent system models and why databases differ; allocation and boundary claims (e.g. run-of-river hydro reservoir allocation, nuclear fuel-cycle boundary); plausibility of the kg CO2-eq/kWh values and the % gaps; any conflation of GWP100 with "carbon footprint"; the mass/energy-balance reasoning in the crude-steel post; the PAM/polyacrylamide inference plausibility.`,
    files: EN_FILES,
  },
  {
    key: 'standards-compliance',
    persona: `You are an LCA standards and EPD/PCR compliance expert (ISO 14040/44/67, ISO 14025/21930, EN 15804, GHG Protocol, PEF/EF, CBAM). You verify EPDs and review PCF reports for a programme operator.`,
    focus: `Scrutinize every standards claim: ISO 14067 vs EN 15804 scope and how they relate; EPD/PCR framework correctness; CBAM Annex IV / embedded-emissions claims; GHG Protocol Scope 3 (15 categories); DQI / Pedigree Matrix dimensions; and crucially any claim that drifts from "alignment" into implied certification, or that overstates what a tool (vs a verifier) can do.`,
    files: EN_FILES,
  },
  {
    key: 'skeptical-verifier',
    persona: `You are a hard-nosed third-party LCA verifier / critical-review chair. Your instinct is to challenge every number and every claim. You have rejected reports for less.`,
    focus: `For each post, find the single sentence you would challenge first in a review, and any claim that is overstated, indefensible, naive, or that a competitor could mock. Flag marketing puffery dressed as fact. Judge whether the case studies (steel unit error, resin inference) are reasoned correctly or hand-wavy.`,
    files: EN_FILES,
  },
  {
    key: 'zh-terminology',
    persona: `You are a Chinese LCA expert (中国 LCA 从业者，熟悉国标/团标术语与行业习惯用语). You read the Chinese versions.`,
    focus: `检查中文版的 LCA 术语是否准确、是否符合中文 LCA 圈习惯：cut-off / APOS / consequential 的中文（截断/后果性 等）、分摊、系统边界、特征化、排放因子、GWP100、清单(LCI)、EPD/PCR、CBAM 的中文表述；数字与单位（kg CO2-eq/kWh、%、×）；以及任何会让中文读者觉得"外行/机翻"的措辞。Compare against the English meaning where needed.`,
    files: ZH_FILES,
  },
]

phase('Expert review')
const reviews = await parallel(
  LENSES.map((L) => () =>
    agent(
      `${L.persona}

${CONTEXT}

Read all ${L.files.length} posts with the Read tool:
${L.files.join('\n')}

Review focus for YOUR lens:
${L.focus}

Return findings via StructuredOutput. Severity: "blocker" = factually wrong / embarrassing / indefensible (must fix before publish); "should-fix" = imprecise or weak; "nit" = minor. Quote the exact problematic text in "location". Only report real problems — if a post is clean on your lens, report no findings for it. Set lens="${L.key}".`,
      { label: `review:${L.key}`, phase: 'Expert review', schema: FINDINGS_SCHEMA },
    ),
  ),
)

const all = reviews.filter(Boolean)
const flat = all.flatMap((r) => r.findings.map((f) => ({ ...f, lens: r.lens })))
log(`Collected ${flat.length} findings from ${all.length} reviewers`)

phase('Synthesize')
const SYNTH_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['verdict', 'blockers', 'by_post'],
  properties: {
    verdict: { type: 'string', description: 'Overall: are the 10 posts publishable to an LCA audience? How many blockers?' },
    blockers: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['slug', 'lang', 'problem', 'fix', 'lenses'],
        properties: {
          slug: { type: 'string' }, lang: { type: 'string' },
          problem: { type: 'string' }, fix: { type: 'string' },
          lenses: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    by_post: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['slug', 'status', 'summary'],
        properties: {
          slug: { type: 'string' },
          status: { type: 'string', enum: ['clean', 'minor', 'needs-fix', 'blocked'] },
          summary: { type: 'string' },
        },
      },
    },
  },
}

const synthesis = await agent(
  `You are the critical-review chair consolidating an expert panel's findings on 10 LCA blog posts.
Here are all ${flat.length} raw findings (JSON):
${JSON.stringify(flat, null, 1)}

And each reviewer's overall verdict:
${all.map((r) => `[${r.lens}] ${r.overall}`).join('\n\n')}

Produce a consolidated report via StructuredOutput:
- verdict: are these publishable to a real LCA audience? how many true blockers?
- blockers: dedup the genuine blocker-severity issues (merge duplicates across lenses; list which lenses flagged each). Each with concrete fix.
- by_post: one row per slug (${SLUGS.join(', ')}) with status (clean / minor / needs-fix / blocked) and a one-line summary.
Be decisive. Distinguish real technical errors from stylistic nits.`,
  { label: 'synthesize', phase: 'Synthesize', schema: SYNTH_SCHEMA },
)

return { synthesis, rawFindings: flat, reviewerVerdicts: all.map((r) => ({ lens: r.lens, overall: r.overall })) }
