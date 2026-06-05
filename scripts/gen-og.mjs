// Generate the default Open Graph card (public/og-default.png, 1200×630).
// Run: node scripts/gen-og.mjs
// Re-run whenever the brand line or palette changes.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '../public/og-default.png');

// Brand palette (hex approximations of the site's oklch tokens).
const paper = '#fbf9f3';
const paperRim = '#f0ece2';
const ink = '#2b2620';
const inkMute = '#6a6358';
const inkFaint = '#9b9385';
const shell = '#b3603a'; // terracotta accent

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${paper}"/>
  <rect x="0" y="0" width="1200" height="14" fill="${shell}"/>
  <!-- inner rule frame -->
  <rect x="64" y="64" width="1072" height="502" fill="none" stroke="${paperRim}" stroke-width="2"/>

  <!-- eyebrow -->
  <text x="96" y="150" font-family="Georgia, 'Times New Roman', serif" font-size="26"
        letter-spacing="3" fill="${shell}">HiQ CORTEX · AN LCA WORKBENCH</text>

  <!-- headline -->
  <text x="92" y="270" font-family="Georgia, 'Times New Roman', serif" font-size="76"
        font-weight="400" fill="${ink}">An <tspan font-style="italic" fill="${shell}">LCA workbench</tspan></text>
  <text x="92" y="358" font-family="Georgia, 'Times New Roman', serif" font-size="76"
        font-weight="400" fill="${ink}">you can defend,</text>
  <text x="92" y="446" font-family="Georgia, 'Times New Roman', serif" font-size="76"
        font-weight="400" fill="${inkFaint}">line by line.</text>

  <!-- footer -->
  <text x="96" y="528" font-family="Georgia, 'Times New Roman', serif" font-size="27"
        fill="${inkMute}">openLCA · brightway · 积木LCA · full reasoning chain</text>
  <text x="1104" y="528" text-anchor="end" font-family="Georgia, serif" font-size="28"
        letter-spacing="1" fill="${shell}">cortex.hiq.earth</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('wrote', out);
