import sharp from 'sharp';

await sharp('public/og.svg').png({ compressionLevel: 9, palette: false }).toFile('public/og.png');
console.log('Generated public/og.png');
