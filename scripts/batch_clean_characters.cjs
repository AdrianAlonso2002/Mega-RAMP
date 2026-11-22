const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function decodePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  let pos = 8;
  let width, height;
  const idatChunks = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    }
    pos += 12 + len;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
  const stride = width * 4 + 1;
  const raw = Buffer.alloc(width * height * 4);
  let rawIdx = 0;
  let prevRow = Buffer.alloc(width * 4);

  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * stride];
    const row = decompressed.subarray(y * stride + 1, (y + 1) * stride);
    const curRow = Buffer.alloc(width * 4);

    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 4; c++) {
        const a = x > 0 ? curRow[(x - 1) * 4 + c] : 0;
        const b = prevRow[x * 4 + c];
        const c_diag = x > 0 ? prevRow[(x - 1) * 4 + c] : 0;
        let val = row[x * 4 + c];
        if (filter === 0) {}
        else if (filter === 1) val = (val + a) & 0xff;
        else if (filter === 2) val = (val + b) & 0xff;
        else if (filter === 3) val = (val + Math.floor((a + b) / 2)) & 0xff;
        else if (filter === 4) {
          const p = a + b - c_diag;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c_diag);
          let pr = c_diag;
          if (pa <= pb && pa <= pc) pr = a;
          else if (pb <= pc) pr = b;
          val = (val + pr) & 0xff;
        }
        curRow[x * 4 + c] = val;
      }
    }
    curRow.copy(raw, rawIdx);
    rawIdx += width * 4;
    prevRow = curRow;
  }
  return { width, height, raw };
}

function encodePNG(width, height, raw) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const scanOffset = y * (width * 4 + 1);
    scanlines[scanOffset] = 0;
    raw.copy(scanlines, scanOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

/**
 * Applies Alpha Bleed / Color Dilation:
 * Extends silhouette border RGB colors into adjacent transparent pixels,
 * clearing white background bleed completely.
 */
function defringeAndBleed(width, height, raw, passes = 16) {
  const totalPixels = width * height;
  const outRaw = Buffer.from(raw);
  const defined = new Uint8Array(totalPixels);

  // Clean faint fringe (< 15 alpha) and mark defined pixels
  for (let i = 0; i < totalPixels; i++) {
    const a = outRaw[i * 4 + 3];
    if (a < 15) {
      outRaw[i * 4] = 0;
      outRaw[i * 4 + 1] = 0;
      outRaw[i * 4 + 2] = 0;
      outRaw[i * 4 + 3] = 0;
      defined[i] = 0;
    } else {
      defined[i] = 1;
    }
  }

  // Find 0-alpha pixels bordering defined pixels
  let curQueue = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (defined[idx] === 0) {
        for (const [dy, dx] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            if (defined[ny * width + nx] === 1) {
              curQueue.push(idx);
              break;
            }
          }
        }
      }
    }
  }

  for (let pass = 0; pass < passes && curQueue.length > 0; pass++) {
    const nextQueue = [];
    const newlyDefined = [];

    for (let k = 0; k < curQueue.length; k++) {
      const idx = curQueue[k];
      const y = Math.floor(idx / width);
      const x = idx % width;

      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      for (const [dy, dx] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]) {
        const ny = y + dy;
        const nx = x + dx;
        if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
          const nIdx = ny * width + nx;
          if (defined[nIdx] === 1) {
            rSum += outRaw[nIdx * 4];
            gSum += outRaw[nIdx * 4 + 1];
            bSum += outRaw[nIdx * 4 + 2];
            count++;
          }
        }
      }

      if (count > 0) {
        outRaw[idx * 4] = Math.round(rSum / count);
        outRaw[idx * 4 + 1] = Math.round(gSum / count);
        outRaw[idx * 4 + 2] = Math.round(bSum / count);
        outRaw[idx * 4 + 3] = 0; // Remains transparent
        newlyDefined.push(idx);

        for (const [dy, dx] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            const nIdx = ny * width + nx;
            if (defined[nIdx] === 0) {
              nextQueue.push(nIdx);
            }
          }
        }
      }
    }

    for (let i = 0; i < newlyDefined.length; i++) {
      defined[newlyDefined[i]] = 1;
    }

    const uniqueNext = [];
    for (let i = 0; i < nextQueue.length; i++) {
      const idx = nextQueue[i];
      if (defined[idx] === 0) {
        defined[idx] = 2;
        uniqueNext.push(idx);
      }
    }
    for (let i = 0; i < uniqueNext.length; i++) {
      defined[uniqueNext[i]] = 0;
    }
    curQueue = uniqueNext;
  }

  // Set all remaining undefined transparent pixels to (0, 0, 0, 0)
  for (let i = 0; i < totalPixels; i++) {
    if (outRaw[i * 4 + 3] === 0 && defined[i] === 0) {
      outRaw[i * 4] = 0;
      outRaw[i * 4 + 1] = 0;
      outRaw[i * 4 + 2] = 0;
    }
  }

  return outRaw;
}

const dir = 'public/assets/characters';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

console.log(`Starting batch cleaning of ${files.length} character assets in ${dir}...`);
const startTime = Date.now();

for (const file of files) {
  const fullPath = path.join(dir, file);
  const t0 = Date.now();
  const { width, height, raw } = decodePNG(fullPath);

  let initialWhite = 0;
  for (let i = 0; i < raw.length; i += 4) {
    if (raw[i + 3] === 0 && raw[i] === 255 && raw[i + 1] === 255 && raw[i + 2] === 255) {
      initialWhite++;
    }
  }

  const cleanedRaw = defringeAndBleed(width, height, raw, 16);
  const encoded = encodePNG(width, height, cleanedRaw);
  fs.writeFileSync(fullPath, encoded);

  console.log(`[DONE] ${file.padEnd(20)} (${width}x${height}): Removed ${initialWhite} white transparent pixels. Saved in ${Date.now() - t0}ms`);
}

console.log(`\nAll ${files.length} assets successfully cleaned and defringed in ${((Date.now() - startTime) / 1000).toFixed(2)}s!`);
