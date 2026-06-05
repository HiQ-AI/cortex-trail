// Rewrite the 8 fixed posts (en+zh), preserving each file's existing
// publishDate / pillar / locale / draft frontmatter.
// Usage: node scripts/blog-fix-emit.mjs <fix-output.json>
import fs from 'node:fs';
import path from 'node:path';

const env = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const posts = env.result;
const blogDir = path.resolve('src/content/blog');

const mdxSafe = (s) => s.replace(/<(?![a-zA-Z/])/g, '&lt;');

// Pull a scalar frontmatter field from an existing file.
const readFm = (file, key) => {
  const txt = fs.readFileSync(file, 'utf8');
  const m = txt.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
};

const fm = (o) =>
  '---\n' +
  Object.entries(o)
    .map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: ${JSON.stringify(v)}`;
      if (k === 'publishDate' || k === 'pillar' || k === 'locale' || typeof v === 'boolean') return `${k}: ${v}`;
      return `${k}: ${JSON.stringify(v)}`;
    })
    .join('\n') +
  '\n---\n\n';

let n = 0;
for (const p of posts) {
  const enFile = path.join(blogDir, `${p.slug}.mdx`);
  const zhFile = path.join(blogDir, `${p.slug}-zh.mdx`);
  const publishDate = readFm(enFile, 'publishDate');
  const pillar = readFm(enFile, 'pillar');

  fs.writeFileSync(
    enFile,
    fm({ title: p.en.title, description: p.en.description, publishDate, pillar, tags: p.en.tags, locale: 'en', draft: false }) +
      mdxSafe(p.en.body.trim()) + '\n',
  );
  fs.writeFileSync(
    zhFile,
    fm({ title: p.zh.title, description: p.zh.description, publishDate, pillar, tags: p.zh.tags, locale: 'zh', draft: false }) +
      mdxSafe(p.zh.body.trim()) + '\n',
  );
  n += 2;
  console.log(`${p.slug}  recheck=${p.recheck.pass ? 'PASS' : 'FAIL'}`);
}
console.log(`\nRewrote ${n} MDX files`);
