import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
async function load(p) {
  const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
  return { d: data, w: info.width, h: info.height, c: info.channels };
}
const px = (img, x, y) => {
  const i = (y * img.w + x) * img.c;
  return [img.d[i], img.d[i + 1], img.d[i + 2]];
};
const dark = await load(join(root, "qa-dark.png"));
const ref = await load(join(root, "img/ref/1.png"));

const isOrange = (r, g, b) => r > 140 && g > 30 && g < 175 && b < 115 && r - b > 70;
const isWhite = (r, g, b) => r > 185 && g > 185 && b > 185;
const near = (c, t, d) => Math.abs(c[0] - t[0]) <= d && Math.abs(c[1] - t[1]) <= d && Math.abs(c[2] - t[2]) <= d;

function bbox(img, [x0, y0, x1, y1], p) {
  let minx = 1e9, miny = 1e9, maxx = -1, maxy = -1, n = 0;
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      if (p(px(img, x, y))) {
        n++;
        if (x < minx) minx = x;
        if (x > maxx) maxx = x;
        if (y < miny) miny = y;
        if (y > maxy) maxy = y;
      }
    }
  return n ? `[${minx},${miny} ${maxx + 1 - minx}x${maxy + 1 - miny}]` : "none";
}

const name = process.argv[2] || "all";

if (name === "all" || name === "logo") {
  const bgD = [10, 12, 14], bgL = [251, 252, 251];
  const notBg = (bg) => (c) => Math.abs(c[0] - bg[0]) + Math.abs(c[1] - bg[1]) + Math.abs(c[2] - bg[2]) > 40;
  console.log("footer logo dark ours:", bbox(dark, [100, 950, 340, 1024], notBg(bgD)));
  console.log("footer logo dark ref :", bbox(ref, [100, 950, 340, 1024], notBg(bgD)));
  console.log("header logo dark ours:", bbox(dark, [100, 0, 400, 80], notBg([10, 12, 13])));
  console.log("header logo dark ref :", bbox(ref, [100, 0, 400, 80], notBg([10, 12, 13])));
}

if (name === "all" || name === "btn") {
  console.log("hdr btn orange ours:", bbox(dark, [1180, 5, 1500, 78], isOrange));
  console.log("hdr btn orange ref :", bbox(ref, [1180, 5, 1500, 78], isOrange));
  console.log("hdr btn white ours :", bbox(dark, [1240, 8, 1440, 75], isWhite));
  console.log("hdr btn white ref :", bbox(ref, [1240, 8, 1440, 75], isWhite));
}

if (name === "all" || name === "circle") {
  for (const img of [dark, ref]) {
    const rows = [];
    for (let x = 930; x <= 1075; x++) {
      let mn = 1e9, mx = -1;
      for (let y = 795; y < 915; y++) if (isOrange(...px(img, x, y))) { if (y < mn) mn = y; if (y > mx) mx = y; }
      if (mx >= 0) rows.push(`${x}:${mn}-${mx + 1}`);
    }
    console.log((img === dark ? "ours" : "ref ") + " circle cols:", rows.join(" "));
  }
}

if (name === "all" || name === "div") {
  for (const img of [dark, ref]) {
    const out = [];
    for (let x = 1225; x <= 1285; x++) {
      let n = 0, sum = 0;
      for (let y = 815; y < 925; y++) { const c = px(img, x, y); sum += c[0] + c[1] + c[2]; if (c[0] > 40 && c[1] > 40 && c[2] > 40) n++; }
      out.push(`${x}:${Math.round(sum / 110 / 3)}/${n}`);
    }
    console.log((img === dark ? "ours" : "ref ") + " div:", out.join(" "));
  }
}

if (name === "all" || name === "card") {
  for (const img of [dark, ref]) {
    const out = [];
    for (let x = 470; x <= 700; x++) {
      const c = px(img, x, 640);
      const bright = c[0] + c[1] + c[2];
      out.push(`${x}:${bright}`);
    }
    console.log((img === dark ? "ours" : "ref ") + " card row640:", out.join(" "));
  }
}

if (name === "all" || name === "cta") {
  for (const img of [dark, ref]) {
    const out = [];
    for (let y = 800; y < 950; y++) {
      let n = 0;
      for (let x = 1240; x < 1270; x++) { const c = px(img, x, y); if (c[0] > 40 && c[1] > 40 && c[2] > 40) n++; }
      out.push(`${y}:${n}`);
    }
    console.log((img === dark ? "ours" : "ref ") + " cta-div rows:", out.filter((s) => !s.endsWith(":0")).join(" "));
  }
}
