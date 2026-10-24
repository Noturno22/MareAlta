import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
async function load(p) {
  const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
  return { d: data, w: info.width, h: info.height, c: info.channels };
}
const px = (img, x, y) => {
  const i = (y * img.w + x) * img.c;
  return [img.d[i], img.d[i + 1], img.d[i + 2]];
};
const isW = (r, g, b) => r > 175 && g > 175 && b > 175;
const dark = await load(join(root, "qa-dark.png"));
const ref = await load(join(root, "img/ref/1.png"));

function rows(img, x0, x1, y0, y1) {
  const out = [];
  let cur = null;
  for (let y = y0; y < y1; y++) {
    let mn = 1e9, mx = -1, n = 0;
    for (let x = x0; x < x1; x++) if (isW(...px(img, x, y))) { n++; if (x < mn) mn = x; if (x > mx) mx = x; }
    if (n >= 3) {
      if (!cur) cur = { y0: y, y1: y, mn, mx };
      else { cur.y1 = y; cur.mn = Math.min(cur.mn, mn); cur.mx = Math.max(cur.mx, mx); }
    } else if (cur) { out.push(cur); cur = null; }
  }
  if (cur) out.push(cur);
  return out.map((r) => `${r.y0}-${r.y1 + 1}:x${r.mn}-${r.mx + 1}`).join(" | ");
}

const lefts = [484, 676, 868, 1060, 1252];
for (let i = 0; i < 5; i++) {
  const x0 = lefts[i] + 2, x1 = lefts[i] + 174;
  console.log(`card${i + 1} TITLE`);
  console.log("  ours:", rows(dark, x0, x1, 634, 676));
  console.log("  ref :", rows(ref, x0, x1, 634, 676));
  console.log(`card${i + 1} DESC`);
  console.log("  ours:", rows(dark, x0, x1, 678, 745));
  console.log("  ref :", rows(ref, x0, x1, 678, 745));
}
