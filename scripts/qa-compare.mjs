import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const bands = [
  ["header", 0, 80],
  ["hero", 80, 510],
  ["services", 510, 792],
  ["cta", 792, 952],
  ["footer", 952, 1024],
];

async function stats(shot, ref, label) {
  const a = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(ref).raw().toBuffer({ resolveWithObject: true });
  console.log(`${label}: shot=${a.info.width}x${a.info.height} ref=${b.info.width}x${b.info.height}`);
  const w = Math.min(a.info.width, b.info.width);
  const h = Math.min(a.info.height, b.info.height);
  const ch = Math.min(a.info.channels, b.info.channels);
  for (const [name, y0, y1] of bands) {
    let sum = 0, n = 0;
    for (let y = y0; y < Math.min(y1, h); y++) {
      for (let x = 0; x < w; x++) {
        for (let c = 0; c < 3; c++) {
          sum += Math.abs(a.data[(y * a.info.width + x) * a.info.channels + c] - b.data[(y * b.info.width + x) * b.info.channels + c]);
          n++;
        }
      }
    }
    console.log(`  ${name.padEnd(9)} MAE=${(sum / n).toFixed(2)}`);
  }
}

async function pair(shot, ref, name, x, y, w, h) {
  const S = await sharp(shot).extract({ left: x, top: y, width: w, height: h }).png().toBuffer();
  const R = await sharp(ref).extract({ left: x, top: y, width: w, height: h }).png().toBuffer();
  await sharp({
    create: { width: w, height: h * 2 + 6, channels: 3, background: { r: 255, g: 0, b: 0 } },
  })
    .composite([
      { input: S, top: 0, left: 0 },
      { input: R, top: h + 6, left: 0 },
    ])
    .png()
    .toFile(join(root, `qa-cmp-${name}.png`));
  console.log(`wrote qa-cmp-${name}.png (top=nossa, bottom=ref)`);
}

const [mode] = process.argv.slice(2);
if (mode === "stats") {
  await stats(join(root, "qa-dark.png"), join(root, "img/ref/1.png"), "DARK");
  await stats(join(root, "qa-light.png"), join(root, "img/ref/3.png"), "LIGHT");
} else if (mode === "pairs") {
  const theme = process.argv[3];
  const shot = join(root, theme === "light" ? "qa-light.png" : "qa-dark.png");
  const ref = join(root, theme === "light" ? "img/ref/3.png" : "img/ref/1.png");
  const p = theme[0];
  await pair(shot, ref, `${p}-header`, 0, 0, 1536, 80);
  await pair(shot, ref, `${p}-herotext`, 100, 120, 660, 380);
  await pair(shot, ref, `${p}-services`, 100, 510, 1360, 282);
  await pair(shot, ref, `${p}-cta`, 0, 792, 1536, 160);
  await pair(shot, ref, `${p}-footer`, 0, 945, 1536, 79);
}
