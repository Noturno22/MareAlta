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
const pred = {
  dark: (r, g, b) => r < 110 && g < 130 && b < 175,
  white: (r, g, b) => r > 200 && g > 200 && b > 200,
  orange: (r, g, b) => r > 170 && g > 40 && g < 175 && b < 110,
};
function bbox(img, [x0, y0, x1, y1], mode) {
  const p = pred[mode];
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
function rows(img, [x0, y0, x1, y1], mode, minHit = 3) {
  const p = pred[mode];
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
function clusters(img, [x0, y0, x1, y1], mode, gapMin = 14) {
  const p = pred[mode];
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
function hlines(img, [x0, y0, x1, y1], bg, thr = 8, frac = 0.7) {
  const out = [];
  for (let y = y0; y < y1; y++) {
    let n = 0;
    for (let x = x0; x < x1; x++) {
      const c = px(img, x, y);
      if (Math.abs(c[0] - bg[0]) + Math.abs(c[1] - bg[1]) + Math.abs(c[2] - bg[2]) > thr) n++;
    }
    if (n > (x1 - x0) * frac) out.push(y);
  }
  return out.join(",") || "none";
}
function vlines(img, [x0, y0, x1, y1], bg, thr = 8, frac = 0.7) {
  const out = [];
  for (let x = x0; x < x1; x++) {
    let n = 0;
    for (let y = y0; y < y1; y++) {
      const c = px(img, x, y);
      if (Math.abs(c[0] - bg[0]) + Math.abs(c[1] - bg[1]) + Math.abs(c[2] - bg[2]) > thr) n++;
    }
    if (n > (y1 - y0) * frac) out.push(x);
  }
  return out.join(",") || "none";
}
function firstRow(img, x, y0, y1, test) {
  for (let y = y0; y < y1; y++) if (test(px(img, x, y))) return y;
  return -1;
}
function lastRow(img, x, y0, y1, test) {
  let last = -1;
  for (let y = y0; y < y1; y++) if (test(px(img, x, y))) last = y;
  return last;
}
const isWhiteish = (c) => c[0] > 238 && c[1] > 238 && c[2] > 238;
const notWhiteish = (c) => !(c[0] > 238 && c[1] > 238 && c[2] > 238);

const qa = await load(join(root, "qa-light.png"));
const ref = await load(join(root, "img/ref/3.png"));

function cmp(label, fn) {
  const a = fn(qa), b = fn(ref);
  const mark = a === b ? " " : "*";
  console.log(`${mark} ${label.padEnd(20)} ours=${String(a).padEnd(44)} ref=${b}`);
}

console.log("== LIGHT probes [x,y WxH] * = differs ==");
cmp("hdr bottom/photo", (i) => firstRow(i, 768, 0, 130, notWhiteish));
cmp("logo", (i) => bbox(i, [100, 8, 330, 80], "dark"));
cmp("nav items x", (i) => clusters(i, [540, 32, 1200, 58], "dark", 16));
cmp("nav underline", (i) => bbox(i, [540, 58, 780, 78], "orange"));
cmp("hdr btn", (i) => bbox(i, [1150, 5, 1500, 80], "orange"));

cmp("kicker", (i) => bbox(i, [80, 118, 760, 150], "orange"));
cmp("h1 rows", (i) => rows(i, [100, 145, 760, 330], "white", 5));
cmp("h1 l1", (i) => bbox(i, [100, 148, 760, 218], "white"));
cmp("h1 l2 orange", (i) => bbox(i, [100, 220, 760, 280], "orange"));
cmp("h1 l3", (i) => bbox(i, [100, 282, 760, 335], "white"));
cmp("sub rows", (i) => rows(i, [100, 325, 760, 392], "white", 5));
cmp("sub l1", (i) => bbox(i, [100, 325, 760, 360], "white"));
cmp("btn1", (i) => bbox(i, [80, 388, 345, 472], "orange"));
cmp("btn2 text", (i) => bbox(i, [330, 395, 560, 465], "white"));

cmp("hero bottom", (i) => lastRow(i, 768, 300, 560, notWhiteish));
cmp("cta top", (i) => firstRow(i, 200, 700, 830, notWhiteish));
cmp("footer top", (i) => firstRow(i, 200, 900, 1000, isWhiteish));

cmp("svc kicker", (i) => bbox(i, [60, 515, 480, 558], "orange"));
cmp("svc h2 l1", (i) => bbox(i, [60, 558, 480, 612], "dark"));
cmp("svc h2 l2", (i) => bbox(i, [60, 612, 480, 668], "orange"));
cmp("svc para rows", (i) => rows(i, [60, 665, 480, 748], "dark", 4));
cmp("svc note rows", (i) => rows(i, [95, 712, 480, 792], "dark", 4));
cmp("svc note icon", (i) => bbox(i, [60, 705, 95, 792], "orange"));

cmp("card hlines", (i) => hlines(i, [440, 495, 640, 790], px(i, 410, 600), 10, 0.75));
cmp("card vlines", (i) => vlines(i, [415, 540, 660, 740], px(i, 410, 600), 10, 0.75));
cmp("icons x", (i) => clusters(i, [430, 530, 1460, 600], "orange", 30));
cmp("icons y", (i) => rows(i, [440, 530, 500, 605], "orange", 3));
cmp("card1 title", (i) => rows(i, [500, 535, 640, 598], "dark", 3));
cmp("card1 title bbox", (i) => bbox(i, [500, 535, 640, 598], "dark"));
cmp("card1 img", (i) => bbox(i, [435, 585, 635, 706], "dark"));
cmp("card1 desc rows", (i) => rows(i, [440, 706, 640, 785], "dark", 4));
cmp("card1 desc bbox", (i) => bbox(i, [440, 706, 640, 785], "dark"));
cmp("card2 desc rows", (i) => rows(i, [645, 706, 845, 785], "dark", 4));
cmp("card3 desc rows", (i) => rows(i, [852, 706, 1050, 785], "dark", 4));
cmp("card4 desc rows", (i) => rows(i, [1058, 706, 1256, 785], "dark", 4));
cmp("card5 desc rows", (i) => rows(i, [1265, 706, 1460, 785], "dark", 4));
cmp("card5 desc bbox", (i) => bbox(i, [1265, 706, 1460, 785], "dark"));

cmp("cta title orange", (i) => bbox(i, [80, 790, 540, 940], "orange"));
cmp("cta play", (i) => bbox(i, [545, 820, 665, 925], "orange"));
cmp("cta phone circle", (i) => bbox(i, [940, 795, 1075, 885], "orange"));
cmp("cta label", (i) => bbox(i, [1030, 805, 1260, 845], "orange"));
cmp("cta phone rows", (i) => rows(i, [1035, 845, 1260, 885], "white", 4));
cmp("cta phone bbox", (i) => bbox(i, [1035, 845, 1260, 885], "white"));
cmp("cta wa rows", (i) => rows(i, [1035, 882, 1260, 925], "white", 4));
cmp("cta wa bbox", (i) => bbox(i, [1035, 882, 1260, 925], "white"));
cmp("siga label", (i) => bbox(i, [1255, 805, 1470, 850], "orange"));
cmp("social x", (i) => clusters(i, [1255, 848, 1470, 895], "orange", 8));
cmp("social y", (i) => rows(i, [1255, 845, 1470, 900], "orange", 2));
cmp("addr rows", (i) => rows(i, [1285, 895, 1470, 940], "dark", 3));
cmp("addr bbox", (i) => bbox(i, [1285, 895, 1470, 940], "dark"));

cmp("foot logo", (i) => bbox(i, [95, 942, 345, 1024], "dark"));
cmp("foot logo orange", (i) => bbox(i, [95, 942, 345, 1024], "orange"));
cmp("foot div", (i) => vlines(i, [300, 960, 375, 1020], px(i, 285, 990), 14, 0.5));
cmp("foot copy", (i) => bbox(i, [350, 965, 850, 1018], "dark"));
cmp("foot right", (i) => bbox(i, [950, 965, 1500, 1018], "orange"));
cmp("foot right div", (i) => vlines(i, [1030, 970, 1210, 1012], px(i, 1010, 990), 14, 0.5));
