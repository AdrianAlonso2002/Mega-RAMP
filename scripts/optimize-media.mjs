import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
import {normalizeCharacterAssets} from './normalize-character-outlines.mjs';
const root = process.cwd(),
  sourceRoot = path.join(root, "art/source/media");
const report = { files: 0, before: 0, after: 0, images: [], audio: null };
async function source(relative) {
  const target = path.join(root, "public", relative),
    saved = path.join(sourceRoot, relative);
  try {
    await fs.access(saved);
  } catch {
    await fs.mkdir(path.dirname(saved), { recursive: true });
    await fs.copyFile(target, saved);
  }
  return { target, saved };
}
for (const folder of ["assets/characters", "assets/maps"])
  for (const name of await fs.readdir(path.join(root, "public", folder))) {
    if (!/\.(png|jpg)$/i.test(name)) continue;
    const relative = `${folder}/${name}`,
      target = path.join(root, "public", relative),
      current = await fs.readFile(target),
      { saved } = await source(relative),
      input = await fs.readFile(saved);
    let pipeline = sharp(input),
      metadata = await pipeline.metadata();
    if (folder.endsWith("characters")) {
      if (Math.max(metadata.width, metadata.height) > 1024)
        pipeline = pipeline.resize({
          width: 1024,
          height: 1024,
          fit: "inside",
          withoutEnlargement: true,
        });
      pipeline = pipeline
        .ensureAlpha()
        .png({ compressionLevel: 9, adaptiveFiltering: false, palette: false });
    } else
      pipeline = pipeline.jpeg({
        quality: 90,
        mozjpeg: true,
        chromaSubsampling: "4:4:4",
      });
    const output = await pipeline.toBuffer();
    if (output.length < current.length) {
      await fs.writeFile(target, output);
      report.files++;
      report.before += current.length;
      report.after += output.length;
      report.images.push({
        file: relative,
        before: current.length,
        after: output.length,
      });
    }
  }
console.log(await normalizeCharacterAssets(root));
const { target, saved } = await source("audio/menu1.mp3"),
  temporary = path.join(root, "public/audio/menu1.optimized.mp3"),
  before = (await fs.stat(target)).size;
const result = spawnSync(
  ffmpeg.path,
  [
    "-y",
    "-i",
    saved,
    "-map_metadata",
    "-1",
    "-codec:a",
    "libmp3lame",
    "-q:a",
    "3",
    temporary,
  ],
  { windowsHide: true, encoding: "utf8" },
);
if (result.status !== 0) throw new Error(result.stderr);
const after = (await fs.stat(temporary)).size;
if (after < before) {
  await fs.copyFile(temporary, target);
  report.before += before;
  report.after += after;
  report.audio = { before, after };
}
await fs.unlink(temporary);
await fs.mkdir("reports", { recursive: true });
await fs.writeFile(
  "reports/media-optimization.json",
  JSON.stringify(report, null, 2),
);
console.log(
  JSON.stringify({
    files: report.files,
    audio: report.audio,
    savedMB: ((report.before - report.after) / 1048576).toFixed(2),
  }),
);
// Opus is selected only when the browser supports it; MP3 remains the fallback.
const opus = path.join(root, "public/audio/menu1.webm");
const opusResult = spawnSync(
  ffmpeg.path,
  [
    "-y",
    "-i",
    saved,
    "-map_metadata",
    "-1",
    "-codec:a",
    "libopus",
    "-b:a",
    "80k",
    opus,
  ],
  { windowsHide: true, encoding: "utf8" },
);
if (opusResult.status !== 0) throw new Error(opusResult.stderr);
console.log(
  JSON.stringify({ opusMB: ((await fs.stat(opus)).size / 1048576).toFixed(2) }),
);
