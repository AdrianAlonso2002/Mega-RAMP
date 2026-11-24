import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const source = new URL('../art/source/media/assets/Gameicon.png', import.meta.url);
const output = new URL('../public/assets/icons/', import.meta.url);
await mkdir(output, { recursive: true });

for (const size of [192, 512]) {
  await sharp(fileURLToPath(source))
    .resize(size, size, { fit: 'contain', background: '#00000000' })
    .png({ compressionLevel: 9 })
    .toFile(fileURLToPath(new URL(`game-icon-${size}.png`, output)));
}

// iOS applies its own rounded mask and expects an opaque touch icon.
await sharp(fileURLToPath(source))
  .resize(180, 180, { fit: 'contain', background: '#101827' })
  .flatten({ background: '#101827' })
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(new URL('game-apple-touch-180.png', output)));
