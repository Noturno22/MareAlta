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
const ink = (r, g, b) => r + g + b < 675;
const wink = (r, g, b) => r + g + b > 550;
const orange = (r, g, b) => r > 170 && g > 40 && g < 175 && b < 110;
const diffBg = (c, bg) => Math.abs(c[0] - bg[0]) + Math.abs(c[1] - bg[1]) + Math.abs(c[2] - bg[2]) > 30;

function bbox(img, [x0, y0, x1, y1], p) {
  let minx = 1e9, miny = 1e9, maxx = -1, maxy = -1, n = 0;
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const [r, g, b] = px(img, x, y);
      if (p(r, g, b)) {
        n++;
        if (x < minx) minx = x;
        if (x > maxx) maxx = x;
        if (y < miny) miny = y;
        if (y > maxy) maxy = y;
      }
    }
  return n ? `[${minx},${miny} ${maxx + 1 - minx}x${maxy + 1 - miny}]` : "none";
}
function rows(img, [x0, y0, x1, y1], p, minHit = 3) {
  const out = [];
  let start = -1;
  for (let y = y0; y < y1; y++) {
    let hit = 0;
    for (let x = x0; x < x1; x++) {
      const [r, g, b] = px(img, x, y);
      if (p(r, g, b)) hit++;
    }
    if (hit > minHit && start < 0) start = y;
    if (hit <= minHit && start >= 0) {
      out.push(`${start}-${y}`);
      start = -1;
    }
  }
  if (start >= 0) out.push(`${start}-${y1}`);
  return out.join(" ") || "none";
}
function clusters(img, [x0, y0, x1, y1], p, gapMin = 14) {
  const cols = [];
  for (let x = x0; x < x1; x++) {
    let hit = 0;
    for (let y = y0; y < y1; y++) {
      const [r, g, b] = px(img, x, y);
      if (p(r, g, b)) hit++;
    }
    cols.push(hit > 0);
  }
  const out = [];
  let start = -1, lastOn = -1;
  for (let i = 0; i < cols.length; i++) {
    if (cols[i]) {
      if (start < 0) start = i;
      lastOn = i;
    } else if (start >= 0 && i - lastOn > gapMin) {
      out.push(`${x0 + start}-${x0 + lastOn + 1}`);
      start = -1;
    }
  }
  if (start >= 0) out.push(`${x0 + start}-${x0 + lastOn + 1}`);
  return out.join(" ") || "none";
}
function vlines(img, [x0, y0, x1, y1], bg, thr = 30, frac = 0.7) {
  const out = [];
  for (let x = x0; x < x1; x++) {
    let n = 0;
    for (let y = y0; y < y1; y++) if (diffBg(px(img, x, y), bg)) n++;
    if (n > (y1 - y0) * frac) out.push(x);
  }
  return out.join(",") || "none";
}
function hlines(img, [x0, y0, x1, y1], bg, thr = 30, frac = 0.7) {
  const out = [];
  for (let y = y0; y < y1; y++) {
    let n = 0;
    for (let x = x0; x < x1; x++) if (diffBg(px(img, x, y), bg)) n++;
    if (n > (x1 - x0) * frac) out.push(y);
  }
  return out.join(",") || "none";
}
function bands(img, x) {
  const q = (c) => {
    const a = (c[0] + c[1] + c[2]) / 3;
    if (a < 60) return "dark";
    if (a < 120) return "g120";
    if (a < 180) return "g180";
    if (a < 220) return "g220";
    if (a < 238) return "g238";
    if (a < 247) return "g247";
    return "white";
  };
  const out = [];
  let cur = null, start = 0;
  for (let y = 0; y < img.h; y++) {
    const b = q(px(img, x, y));
    if (b !== cur) {
      if (cur !== null && y - start >= 4) out.push(`${start}-${y}:${cur}`);
      cur = b;
      start = y;
    }
  }
  if (img.h - start >= 4) out.push(`${start}-${img.h}:${cur}`);
  return out.join(" ");
}

const qa = await load(join(root, "qa-light.png"));
const ref = await load(join(root, "img/ref/3.png"));

function cmp(label, fn) {
  const a = fn(qa), b = fn(ref);
  const mark = a === b ? " " : "*";
  console.log(`${mark} ${label.padEnd(22)} ours=${String(a).padEnd(46)} ref=${b}`);
}

console.log("== BANDS x20 ==");
console.log("  ours:", bands(qa, 20));
console.log("  ref :", bands(ref, 20));
console.log("== BANDS x1490 ==");
console.log("  ours:", bands(qa, 1490));
console.log("  ref :", bands(ref, 1490));

console.log("== HEADER ==");
cmp("nav ink x", (i) => clusters(i, [540, 30, 1200, 62], ink, 16));
cmp("nav ink rows", (i) => rows(i, [560, 15, 1140, 75], ink, 4));
cmp("nav underline", (i) => bbox(i, [540, 45, 780, 83], orange));
cmp("hdr btn clusters", (i) => clusters(i, [1150, 0, 1536, 83], orange, 12));
cmp("hdr btn bbox", (i) => bbox(i, [1180, 5, 1450, 83], orange));

console.log("== HERO BTN1 ==");
cmp("btn1 pill", (i) => bbox(i, [95, 385, 345, 470], orange));
cmp("btn1 circle", (i) => bbox(i, [115, 395, 175, 465], wink));
cmp("btn1 text", (i) => bbox(i, [165, 395, 340, 465], wink));
console.log("== HERO BTN2 ==");
cmp("btn2 orange", (i) => bbox(i, [330, 388, 640, 470], orange));
cmp("btn2 border x", (i) => vlines(i, [335, 398, 640, 462], [255, 255, 255], 30, 0.85));
cmp("btn2 border y", (i) => hlines(i, [345, 390, 630, 470], [255, 255, 255], 30, 0.85));
cmp("btn2 ink", (i) => bbox(i, [345, 398, 630, 462], ink));

console.log("== SERVICES LEFT ==");
cmp("kick", (i) => bbox(i, [60, 518, 480, 560], orange));
cmp("h2 l1 ink", (i) => bbox(i, [60, 550, 480, 614], ink));
cmp("h2 l2 ink", (i) => bbox(i, [60, 614, 480, 678], orange));
cmp("para rows", (i) => rows(i, [60, 625, 480, 765], ink, 4));
cmp("para l1", (i) => bbox(i, [60, 645, 480, 690], ink));
cmp("note icon", (i) => bbox(i, [60, 700, 175, 795], orange));
cmp("note rows", (i) => rows(i, [150, 700, 480, 795], ink, 4));

console.log("== CARDS ==");
cmp("c1 icon", (i) => bbox(i, [435, 528, 510, 600], orange));
cmp("c1 title rows", (i) => rows(i, [498, 530, 645, 600], ink, 3));
cmp("c1 title l2", (i) => bbox(i, [498, 562, 645, 598], ink));
cmp("c1 desc rows", (i) => rows(i, [440, 700, 645, 790], ink, 4));
cmp("c1 desc l1", (i) => bbox(i, [440, 702, 645, 726], ink));
cmp("c5 desc rows", (i) => rows(i, [1268, 700, 1462, 790], ink, 4));
cmp("c5 desc l1", (i) => bbox(i, [1268, 702, 1462, 726], ink));

console.log("== CTA ==");
cmp("phone circle", (i) => bbox(i, [975, 795, 1082, 895], orange));
cmp("label clusters", (i) => clusters(i, [1000, 806, 1270, 845], orange, 14));
cmp("number ink", (i) => bbox(i, [1040, 846, 1310, 884], ink));
cmp("wa ink", (i) => bbox(i, [1040, 884, 1310, 925], ink));
cmp("siga", (i) => bbox(i, [1270, 806, 1475, 846], orange));
cmp("social x", (i) => clusters(i, [1255, 846, 1475, 884], orange, 6));
cmp("social y", (i) => rows(i, [1255, 842, 1475, 890], orange, 2));
cmp("addr ink", (i) => bbox(i, [1300, 888, 1480, 920], ink));

console.log("== FOOTER ==");
cmp("logo ink", (i) => bbox(i, [95, 942, 345, 1024], ink));
cmp("logo orange", (i) => bbox(i, [95, 942, 345, 1024], orange));
cmp("div x", (i) => vlines(i, [300, 960, 380, 1020], [255, 255, 255], 25, 0.6));
cmp("copy ink", (i) => bbox(i, [350, 965, 880, 1018], ink));
cmp("right orange", (i) => bbox(i, [950, 965, 1510, 1018], orange));
cmp("right div x", (i) => vlines(i, [1030, 970, 1300, 1012], [255, 255, 255], 25, 0.6));
