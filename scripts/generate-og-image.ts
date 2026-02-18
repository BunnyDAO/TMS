#!/usr/bin/env tsx
/**
 * Generates the OG image (1200x630) for social sharing previews.
 * Run: npx tsx scripts/generate-og-image.ts
 */
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'fs';

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="50%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

  <!-- Subtle grid pattern -->
  <g opacity="0.04" stroke="#94a3b8" stroke-width="0.5">
    ${Array.from({ length: 20 }, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${HEIGHT}"/>`).join('')}
    ${Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 60}" x2="${WIDTH}" y2="${i * 60}"/>`).join('')}
  </g>

  <!-- Accent line at top -->
  <rect x="0" y="0" width="${WIDTH}" height="3" fill="url(#accent)"/>

  <!-- Category dots -->
  <circle cx="80" cy="480" r="5" fill="#8b5cf6" opacity="0.6"/>
  <text x="96" y="484" font-family="monospace" font-size="13" fill="#64748b">AI</text>

  <circle cx="160" cy="480" r="5" fill="#f97316" opacity="0.6"/>
  <text x="176" y="484" font-family="monospace" font-size="13" fill="#64748b">Bitcoin</text>

  <circle cx="280" cy="480" r="5" fill="#3b82f6" opacity="0.6"/>
  <text x="296" y="484" font-family="monospace" font-size="13" fill="#64748b">Ethereum</text>

  <circle cx="420" cy="480" r="5" fill="#14F195" opacity="0.6"/>
  <text x="436" y="484" font-family="monospace" font-size="13" fill="#64748b">Solana</text>

  <circle cx="540" cy="480" r="5" fill="#f43f5e" opacity="0.6"/>
  <text x="556" y="484" font-family="monospace" font-size="13" fill="#64748b">RWA</text>

  <circle cx="640" cy="480" r="5" fill="#94a3b8" opacity="0.6"/>
  <text x="656" y="484" font-family="monospace" font-size="13" fill="#64748b">Infra</text>

  <!-- Main title -->
  <text x="80" y="240" font-family="monospace" font-weight="900" font-size="72" fill="#f8fafc" letter-spacing="-3">toomuch.sh</text>

  <!-- Tagline -->
  <text x="80" y="300" font-family="monospace" font-size="22" fill="#64748b">AI tools, crypto ecosystems, and RWA protocols</text>
  <text x="80" y="332" font-family="monospace" font-size="22" fill="#64748b">curated, categorized, and explained.</text>

  <!-- Decorative bracket -->
  <text x="80" y="160" font-family="monospace" font-size="16" fill="#334155">// the directory</text>

  <!-- Bottom border -->
  <rect x="80" y="520" width="200" height="1" fill="#1e293b"/>

  <!-- URL -->
  <text x="80" y="560" font-family="monospace" font-size="16" fill="#475569">toomuch.sh</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: WIDTH },
});

const pngData = resvg.render();
const pngBuffer = pngData.asPng();

writeFileSync('public/og-image.png', pngBuffer);
console.log(`Generated public/og-image.png (${(pngBuffer.length / 1024).toFixed(0)} KB)`);
