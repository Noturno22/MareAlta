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
const dark = await load(join(root, "qa-dark.png"));
const ref = await load(join(root, "img/ref/1.png"));
const isWhite = (r, g, b) => r > 185 && g > 185 && b > 185;

// 1) btn2 rows: white runs in x430-600, y422-470
for (const [name, img] of [["ours", dark], ["ref ", ref]]) {
  const out = [];
  for (let y = 422; y < 470; y++) {
    let run = [], runs = [];
    for (let x = 430; x < 600; x++) {
      if (isWhite(...px(img, x, y))) run.push(x);
      else if (run.length) { runs.push(`${run[0]}-${run[run.length - 1]}`); run = []; }
    }
    if (run.length) runs.push(`${run[0]}-${run[run.length - 1]}`);
    if (runs.length) out.push(`y${y}:${runs.join(",")}`);
  }
  console.log(name + " btn2 white runs:", out.join(" | "));
}

// 2) copy region white runs y975-995 x330-760
for (const [name, img] of [["ours", dark], ["ref ", ref]]) {
  let minx = 1e9, maxx = -1, miny = 1e9, maxy = -1, n = 0;
  for (let y = 970; y < 1000; y++)
    for (let x = 330; x < 760; x++)
      if (isWhite(...px(img, x, y))) {
        n++;
        if (x < minx) minx = x; if (x > maxx) maxx = x;
        if (y < miny) miny = y; if (y > maxy) maxy = y;
      }
  console.log(name + ` copy bbox [${minx},${miny} ${maxx + 1 - minx}x${maxy + 1 - miny}] n=${n}`);
}

// 3) card desc rows: white runs per row, x495-660, y680-740
for (const [name, img] of [["ours", dark], ["ref ", ref]]) {
  const out = [];
  for (let y = 680; y < 740; y++) {
    let mn = 1e9, mx = -1, c = 0;
    for (let x = 495; x < 660; x++) if (isWhite(...px(img, x, y))) { c++; if (x < mn) mn = x; if (x > mx) mx = x; }
    if (c >= 3) out.push(`y${y}:${mn}-${mx + 1}`);
  }
  console.log(name + " card1 desc:", out.join(" "));
}

// 4) note icon orange bbox x145-200 y730-775
const isOrange = (r, g, b) => r > 140 && g > 30 && g < 175 && b < 115 && r - b > 70;
for (const [name, img] of [["ours", dark], ["ref ", ref]]) {
  let minx = 1e9, maxx = -1, miny = 1e9, maxy = -1, n = 0;
  for (let y = 730; y < 775; y++)
    for (let x = 145; x < 200; x++)
      if (isOrange(...px(img, x, y))) {
        n++;
        if (x < minx) minx = x; if (x > maxx) maxx = x;
        if (y < miny) miny = y; if (y > maxy) maxy = y;
      }
  console.log(name + ` note-icon bbox [${minx},${miny} ${maxx + 1 - minx}x${maxy + 1 - miny}] n=${n}`);
  // per-column heights
  const cols = [];
  for (let x = minx; x <= maxx; x++) {
    let a = 1e9, b = -1;
    for (let y = 730; y < 775; y++) if (isOrange(...px(img, x, y))) { if (y < a) a = y; if (y > b) b = y; }
    if (b >= 0) cols.push(`${x}:${a}-${b + 1}`);
  }
  console.log(name + " note cols:", cols.join(" "));
}

// 5) addr pin orange bbox x1255-1285 y885-920
for (const [name, img] of [["ours", dark], ["ref ", ref]]) {
  let minx = 1e9, maxx = -1, miny = 1e9, maxy = -1, n = 0;
  for (let y = 885; y < 920; y++)
    for (let x = 1255; x < 1285; x++)
      if (isOrange(...px(img, x, y))) {
        n++;
        if (x < minx) minx = x; if (x > maxx) maxx = x;
        if (y < miny) miny = y; if (y > maxy) maxy = y;
      }
  console.log(name + ` pin bbox [${minx},${miny} ${maxx + 1 - minx}x${maxy + 1 - miny}] n=${n}`);
}
