import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const sticker = (name, x, y, width, height, angle, opacity) => {
  const raw = readFileSync(`src/assets/stickers/${name}.svg`, 'utf8')
    .replace(/<\?xml[^>]*\?>\s*/, '')
    .replace('<svg ', `<svg width="${width}" height="${height}" `);
  const cx = width / 2;
  const cy = height / 2;
  return `<g transform="translate(${x} ${y}) rotate(${angle} ${cx} ${cy})" opacity="${opacity}">${raw}</g>`;
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1800" viewBox="0 0 2400 1800">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff9fc"/>
      <stop offset=".38" stop-color="#f8eef3"/>
      <stop offset=".72" stop-color="#f5e2eb"/>
      <stop offset="1" stop-color="#efd3e0"/>
    </linearGradient>
    <radialGradient id="veil" cx="50%" cy="47%" r="68%">
      <stop offset="0" stop-color="#fff9fc" stop-opacity=".96"/>
      <stop offset=".62" stop-color="#fff9fc" stop-opacity=".66"/>
      <stop offset="1" stop-color="#fff9fc" stop-opacity="0"/>
    </radialGradient>
    <pattern id="gingham" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M0 36h72M36 0v72" stroke="#ff2e7e" stroke-opacity=".055" stroke-width="2"/>
      <path d="M0 18h72M18 0v72" stroke="#b58cff" stroke-opacity=".035" stroke-width="1"/>
    </pattern>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.2"/>
    </filter>
  </defs>

  <rect width="2400" height="1800" fill="url(#paper)"/>
  <rect width="2400" height="1800" fill="url(#gingham)"/>

  <circle cx="2160" cy="180" r="500" fill="#ffc1d7" opacity=".28"/>
  <circle cx="160" cy="1660" r="540" fill="#c7a6ff" opacity=".16"/>
  <circle cx="2100" cy="1540" r="300" fill="#ff2e7e" opacity=".07"/>

  <g fill="none" stroke="#ff2e7e" stroke-opacity=".12">
    <circle cx="1200" cy="900" r="690"/>
    <circle cx="1200" cy="900" r="820" stroke-dasharray="4 18"/>
  </g>

  <rect width="2400" height="1800" fill="url(#veil)"/>

  ${sticker('kuromi-star', 50, 770, 184, 184, 18, 0.34)}
  ${sticker('kuromi-heart', 2120, 720, 268, 210, -10, 0.38)}
  ${sticker('kuromi-devil', 36, 1540, 262, 328, -10, 0.32)}
  ${sticker('kuromi-bow', 2040, 1460, 238, 165, 12, 0.28)}

  <g fill="#ff2e7e" opacity=".2" filter="url(#soft)">
    <path d="m1240 96 9 24 24 9-24 9-9 24-9-24-24-9 24-9Z"/>
    <path d="m1020 1600 7 18 18 7-18 7-7 18-7-18-18-7 18-7Z"/>
    <path d="m590 118 6 16 16 6-16 6-6 16-6-16-16-6 16-6Z"/>
    <path d="m1880 1680 8 20 20 8-20 8-8 20-8-20-20-8 20-8Z"/>
  </g>
</svg>`;

writeFileSync('src/assets/images/kuromi-bg.svg', svg, 'utf8');
await sharp(Buffer.from(svg))
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile('src/assets/images/kuromi-bg.jpg');

console.log('Generated src/assets/images/kuromi-bg.jpg');
