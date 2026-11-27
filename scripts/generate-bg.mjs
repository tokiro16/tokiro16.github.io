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

const mobileSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="2160" viewBox="0 0 1000 2160">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff9fc"/>
      <stop offset=".38" stop-color="#f8eef3"/>
      <stop offset=".72" stop-color="#f5e2eb"/>
      <stop offset="1" stop-color="#efd3e0"/>
    </linearGradient>
    <radialGradient id="veil" cx="50%" cy="47%" r="68%">
      <stop offset="0" stop-color="#fff9fc" stop-opacity=".96"/>
      <stop offset=".62" stop-color="#fff9fc" stop-opacity=".68"/>
      <stop offset="1" stop-color="#fff9fc" stop-opacity="0"/>
    </radialGradient>
    <pattern id="gingham" width="58" height="58" patternUnits="userSpaceOnUse">
      <path d="M0 29h58M29 0v58" stroke="#ff2e7e" stroke-opacity=".055" stroke-width="2"/>
      <path d="M0 14h58M14 0v58" stroke="#b58cff" stroke-opacity=".035" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1000" height="2160" fill="url(#paper)"/>
  <rect width="1000" height="2160" fill="url(#gingham)"/>
  <circle cx="960" cy="200" r="330" fill="#ffc1d7" opacity=".26"/>
  <circle cx="60" cy="1980" r="360" fill="#c7a6ff" opacity=".14"/>
  <g fill="none" stroke="#ff2e7e" stroke-opacity=".1">
    <circle cx="500" cy="1080" r="420"/>
    <circle cx="500" cy="1080" r="520" stroke-dasharray="4 16"/>
  </g>
  <rect width="1000" height="2160" fill="url(#veil)"/>

  ${sticker('kuromi-star', -20, 600, 118, 118, 18, 0.26)}
  ${sticker('kuromi-heart', 832, 500, 132, 104, -10, 0.28)}
  ${sticker('kuromi-bow', -36, 1040, 148, 102, -14, 0.26)}
  ${sticker('kuromi-devil', 772, 1160, 158, 198, 9, 0.26)}

  <g fill="#ff2e7e" opacity=".18">
    <path d="m500 116 7 18 18 7-18 7-7 18-7-18-18-7 18-7Z"/>
    <path d="m180 1780 6 15 15 6-15 6-6 15-6-15-15-6 15-6Z"/>
    <path d="m860 1600 6 15 15 6-15 6-6 15-6-15-15-6 15-6Z"/>
  </g>
</svg>`;

writeFileSync('src/assets/images/kuromi-bg-mobile.svg', mobileSvg, 'utf8');
await sharp(Buffer.from(mobileSvg))
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile('src/assets/images/kuromi-bg-mobile.jpg');

console.log('Generated desktop and mobile background images');
