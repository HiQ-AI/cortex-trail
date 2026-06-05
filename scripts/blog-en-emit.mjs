// Rewrite ONLY the English MDX of each post from the native-rewrite output,
// preserving publishDate/pillar and leaving the -zh files untouched.
// Usage: node scripts/blog-en-emit.mjs <rewrite-output.json>
import fs from 'node:fs';
import path from 'node:path';

const env = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const posts = env.result;
const blogDir = path.resolve('src/content/blog');

const mdxSafe = (s) => s.replace(/<(?![a-zA-Z/])/g, '&lt;');
const readFm = (file, key) => {
  const m = fs.readFileSync(file, 'utf8').match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
};
const fm = (o) =>
  '---\n' +
  Object.entries(o).map(([k, v]) => {
    if (Array.isArray(v)) return `${k}: ${JSON.stringify(v)}`;
    if (k === 'publishDate' || k === 'pillar' || k === 'locale' || typeof v === 'boolean') return `${k}: ${v}`;
    return `${k}: ${JSON.stringify(v)}`;
  }).join('\n') + '\n---\n\n';

let n = 0;
for (const p of posts) {
  const enFile = path.join(blogDir, `${p.slug}.mdx`);
  const publishDate = readFm(enFile, 'publishDate');
  const pillar = readFm(enFile, 'pillar');
  const f = p.final;
  fs.writeFileSync(
    enFile,
    fm({ title: f.title, description: f.description, publishDate, pillar, tags: f.tags, locale: 'en', draft: false }) +
      mdxSafe(f.body.trim()) + '\n',
  );
  n += 1;
  console.log(`${p.slug}  (en updated, zh untouched)`);
}
console.log(`\nRewrote ${n} English MDX files`);
