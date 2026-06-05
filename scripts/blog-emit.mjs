// Turn the blog-batch workflow output into MDX files in src/content/blog/.
// Usage: node scripts/blog-emit.mjs <workflow-output.json>
import fs from 'node:fs';
import path from 'node:path';

const outFile = process.argv[2];
const env = JSON.parse(fs.readFileSync(outFile, 'utf8'));
const posts = env.result;
const blogDir = path.resolve('src/content/blog');

// Stagger publish dates back from 2026-06-04, ~3 days apart, to avoid a
// single-day mass-publish pattern when these eventually go live.
const base = new Date('2026-06-04T00:00:00Z');
const dateFor = (i) => {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() - i * 3);
  return d.toISOString().slice(0, 10);
};

// MDX safety: escape a bare "<" that isn't opening a tag (e.g. "<80%", "< 2x")
// so the MDX parser doesn't treat it as JSX. Preserves <span>, </span>.
const mdxSafe = (s) => s.replace(/<(?![a-zA-Z/])/g, '&lt;');

const fm = (o) =>
  '---\n' +
  Object.entries(o)
    .map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: ${JSON.stringify(v)}`;
      if (k === 'publishDate' || typeof v === 'boolean') return `${k}: ${v}`;
      return `${k}: ${JSON.stringify(v)}`;
    })
    .join('\n') +
  '\n---\n\n';

let n = 0;
posts.forEach((p, i) => {
  const date = dateFor(i);
  // EN
  const enFm = fm({
    title: p.en.title,
    description: p.en.description,
    publishDate: date,
    pillar: p.pillar,
    tags: p.en.tags,
    locale: 'en',
    draft: false,
  });
  fs.writeFileSync(path.join(blogDir, `${p.slug}.mdx`), enFm + mdxSafe(p.en.body.trim()) + '\n');
  // ZH
  const zhFm = fm({
    title: p.zh.title,
    description: p.zh.description,
    publishDate: date,
    pillar: p.pillar,
    tags: p.zh.tags,
    locale: 'zh',
    draft: false,
  });
  fs.writeFileSync(path.join(blogDir, `${p.slug}-zh.mdx`), zhFm + mdxSafe(p.zh.body.trim()) + '\n');
  n += 2;
  console.log(`${p.slug}  (${date})  passed_before_fix=${p.passed_before_fix} issues=${p.issues.length}`);
});
console.log(`\nWrote ${n} MDX files to ${blogDir}`);
