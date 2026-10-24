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

const isOrange = (r, g, b) => r > 140 && g > 30 && g < 175 && b < 115 && r - b > 70;
const isWhite = (r, g, b) => r > 185 && g > 185 && b > 185;

function runs(img, y, x0, x1, p, minLen = 2) {
  const out = [];
  let start = -1;
  for (let x = x0; x < x1; x++) {
    const hit = p(...px(img, x, y));
    if (hit && start < 0) start = x;
    if ((!hit || x === x1 - 1) && start >= 0) {
      const end = hit ? x + 1 : x;
      if (end - start >= minLen) out.push(`${start}-${end}`);
      start = -1;
    }
  }
  return out.join(" ") || "none";
}
function cruns(img, x, y0, y1, p, minLen = 2) {
  const out = [];
  let start = -1;
  for (let y = y0; y < y1; y++) {
    const hit = p(...px(img, x, y));
    if (hit && start < 0) start = y;
    if ((!hit || y === y1 - 1) && start >= 0) {
      const end = hit ? y + 1 : y;
      if (end - start >= minLen) out.push(`${start}-${end}`);
      start = -1;
    }
  }
  return out.join(" ") || "none";
}
function bbox(img, [x0, y0, x1, y1], p) {
  let minx = 1e9, miny = 1e9, maxx = -1, maxy = -1, n = 0;
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      if (p(...px(img, x, y))) {
        n++;
        if (x < minx) minx = x;
        if (x > maxx) maxx = x;
        if (y < miny) miny = y;
        if (y > maxy) maxy = y;
      }
    }
  return n ? `[${minx},${miny} ${maxx + 1 - minx}x${maxy + 1 - miny}]` : "none";
}
function rowsRun(img, [x0, y0, x1, y1], p, minHit = 4) {
  const out = [];
  let start = -1;
  for (let y = y0; y < y1; y++) {
    let hit = 0;
    for (let x = x0; x < x1; x++) if (p(...px(img, x, y))) hit++;
    if (hit > minHit && start < 0) start = y;
    if (hit <= minHit && start >= 0) {
      out.push(`${start}-${y}`);
      start = -1;
    }
  }
  if (start >= 0) out.push(`${start}-${y1}`);
  return out.join(" ") || "none";
}
function transitions(img, x, y0, y1) {
  const out = [];
  let prev = null;
  for (let y = y0; y < y1; y++) {
    const c = px(img, x, y);
    if (!prev) { prev = c; continue; }
    const d = Math.abs(c[0] - prev[0]) + Math.abs(c[1] - prev[1]) + Math.abs(c[2] - prev[2]);
    if (d > 4) out.push(`${y}:[${c.join(",")}]`);
    prev = c;
  }
  return out.join(" ") || "none";
}

const which = process.argv[2] || "all";
const qa = await load(join(root, "qa-dark.png"));
const ref = await load(join(root, "img/ref/1.png"));

if (which === "all" || which === "bounds") {
  console.log("ours x800 transitions 400-1024:", transitions(qa, 800, 400, 1023));
  console.log("ref  x800 transitions 400-1024:", transitions(ref, 800, 400, 1023));
}

if (which === "all" || which === "btns") {
  for (const y of [430, 445, 460]) {
    console.log(`ref  row${y} orange x140-640:`, runs(ref, y, 140, 640, isOrange));
    console.log(`ours row${y} orange x140-640:`, runs(qa, y, 140, 640, isOrange));
    console.log(`ref  row${y} white  x140-640:`, runs(ref, y, 140, 640, isWhite));
    console.log(`ours row${y} white  x140-640:`, runs(qa, y, 140, 640, isWhite));
  }
  console.log("ref  col170 orange y415-480:", cruns(ref, 170, 415, 480, isOrange));
  console.log("ref  col430 orange y415-480:", cruns(ref, 430, 415, 480, isOrange));
  console.log("ref  col430 white  y415-480:", cruns(ref, 430, 415, 480, isWhite));
  console.log("ref  col560 white  y415-480:", cruns(ref, 560, 415, 480, isWhite));
  console.log("ref  col560 orange y415-480:", cruns(ref, 560, 415, 480, isOrange));
}

if (which === "all" || which === "svc") {
  for (const [img, tag] of [[ref, "ref "], [qa, "ours"]]) {
    console.log(`${tag} kicker  orange:`, bbox(img, [140, 520, 700, 590], isOrange));
    console.log(`${tag} kicker  rows  :`, rowsRun(img, [140, 520, 700, 590], isOrange));
    console.log(`${tag} h2l1    white :`, bbox(img, [140, 575, 700, 640], isWhite));
    console.log(`${tag} h2l2    orange:`, bbox(img, [140, 600, 700, 690], isOrange));
    console.log(`${tag} para    white rows:`, rowsRun(img, [140, 650, 700, 745], isWhite, 8));
    console.log(`${tag} para    white bbox:`, bbox(img, [140, 650, 700, 745], isWhite));
    console.log(`${tag} note    white rows:`, rowsRun(img, [140, 735, 700, 800], isWhite, 6));
    console.log(`${tag} note    white bbox:`, bbox(img, [140, 735, 700, 800], isWhite));
    console.log(`${tag} card1   title:`, bbox(img, [495, 615, 665, 675], isWhite));
    console.log(`${tag} card1   desc :`, rowsRun(img, [495, 675, 665, 750], isWhite, 6));
    console.log(`${tag} card1   desc bbox:`, bbox(img, [495, 675, 665, 750], isWhite));
    console.log(`${tag} circles x:`, runs(img, 598, 470, 1400, isOrange, 5));
    console.log(`${tag} circle col527 y:`, cruns(img, 527, 540, 650, isOrange));
  }
}

if (which === "all" || which === "cta") {
  for (const [img, tag] of [[ref, "ref "], [qa, "ours"]]) {
    console.log(`${tag} phone rows x1020-1200:`, rowsRun(img, [1020, 835, 1200, 915], isWhite, 5));
    console.log(`${tag} phone bbox:`, bbox(img, [1020, 835, 1200, 915], isWhite));
    console.log(`${tag} label  bbox:`, bbox(img, [1020, 825, 1200, 845], isOrange));
    console.log(`${tag} social x runs row866:`, runs(img, 866, 1240, 1420, isOrange, 3));
    console.log(`${tag} social y col1272:`, cruns(img, 1272, 840, 900, isOrange));
    console.log(`${tag} addr   bbox:`, bbox(img, [1275, 890, 1450, 925], isWhite));
    console.log(`${tag} circle col987 y:`, cruns(img, 987, 795, 915, isOrange));
    console.log(`${tag} circle col1000 y:`, cruns(img, 1000, 795, 915, isOrange));
    console.log(`${tag} circle row850 x:`, runs(img, 850, 930, 1060, isOrange, 3));
    console.log(`${tag} circle row840 x:`, runs(img, 840, 930, 1060, isOrange, 3));
  }
}

if (which === "all" || which === "foot") {
  const notBg = (r, g, b) => Math.abs(r - 10) + Math.abs(g - 12) + Math.abs(b - 14) > 30;
  for (const [img, tag] of [[ref, "ref "], [qa, "ours"]]) {
    console.log(`${tag} footer logo:`, bbox(img, [100, 950, 340, 1023], notBg));
    console.log(`${tag} footer copy rows:`, rowsRun(img, [350, 965, 720, 1020], isWhite, 3));
    console.log(`${tag} footer copy bbox:`, bbox(img, [350, 965, 720, 1020], isWhite));
    console.log(`${tag} footer right row986:`, runs(img, 986, 1000, 1450, isOrange, 3));
    console.log(`${tag} footer divider cols:`, runs(img, 986, 340, 460, (r, g, b) => r > 30 && g > 30 && b > 30, 1));
  }
}
