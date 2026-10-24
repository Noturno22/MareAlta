import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const isWhite = (r, g, b) => r > 190 && g > 190 && b > 190;
const isOrange = (r, g, b) => r > 170 && g > 40 && g < 170 && b < 100;

async function load(p) {
  const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
  return { d: data, w: info.width, h: info.height, c: info.channels };
}
const px = (img, x, y) => {
  const i = (y * img.w + x) * img.c;
  return [img.d[i], img.d[i + 1], img.d[i + 2]];
};
const pred = { white: isWhite, orange: isOrange };

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

function rows(img, [x0, y0, x1, y1], mode) {
  const p = pred[mode];
  const out = [];
  let start = -1;
  for (let y = y0; y < y1; y++) {
    let hit = 0;
    for (let x = x0; x < x1; x++) {
      const [r, g, b] = px(img, x, y);
      if (p(r, g, b)) hit++;
    }
    if (hit > 3 && start < 0) start = y;
    if (hit <= 3 && start >= 0) {
      out.push(`${start}-${y}`);
      start = -1;
    }
  }
  if (start >= 0) out.push(`${start}-${y1}`);
  return out.join(" ") || "none";
}

function diffFromBg(img, x, y, bg) {
  const [r, g, b] = px(img, x, y);
  return Math.hypot(r - bg[0], g - bg[1], b - bg[2]);
}
function hlines(img, [x0, y0, x1, y1], bg) {
  const out = [];
  for (let y = y0; y < y1; y++) {
    let n = 0;
    for (let x = x0; x < x1; x++) if (diffFromBg(img, x, y, bg) > 18) n++;
    if (n > (x1 - x0) * 0.85) out.push(y);
  }
  return out.join(",") || "none";
}
function vlines(img, [x0, y0, x1, y1], bg) {
  const out = [];
  for (let x = x0; x < x1; x++) {
    let n = 0;
    for (let y = y0; y < y1; y++) if (diffFromBg(img, x, y, bg) > 18) n++;
    if (n > (y1 - y0) * 0.85) out.push(x);
  }
  return out.join(",") || "none";
}

function cmp(label, fn) {
  const a = fn(qa), b = fn(ref);
  const mark = a === b ? " " : "*";
  console.log(`${mark} ${label.padEnd(18)} ours=${String(a).padEnd(46)} ref=${b}`);
}

const theme = process.argv[2] || "dark";
const qa = await load(join(root, theme === "light" ? "qa-light.png" : "qa-dark.png"));
const ref = await load(join(root, theme === "light" ? "img/ref/3.png" : "img/ref/1.png"));

const L = theme === "light";
const W = L
  ? {
      nav: [600, 28, 1160, 62], navUL: [600, 50, 700, 66], hbtn: [1200, 12, 1450, 72],
      kicker: [140, 122, 760, 146], h1a: [140, 150, 700, 216], h1b: [140, 221, 700, 276], h1c: [140, 279, 700, 330],
      sub1: [140, 326, 700, 356], sub2: [140, 357, 700, 387], btn1: [140, 392, 430, 462], btn2: [410, 392, 640, 462],
      sKick: [140, 520, 700, 552], sH2a: [140, 554, 700, 604], sH2b: [140, 606, 700, 658],
      sPara: [140, 658, 700, 736], sNote: [140, 738, 700, 782],
      icons: [480, 515, 1440, 640], card1t: [497, 598, 662, 662], card1d: [497, 662, 662, 775],
      cCircle: [900, 795, 1100, 910], cText: [1030, 805, 1245, 930],
      cSoc: [1265, 835, 1390, 890], cAddr: [1265, 890, 1440, 925],
      fCopy: [340, 975, 720, 1012], fRight: [1100, 975, 1450, 1012],
      bgCard: [300, 600], cardWin: [495, 505, 660, 782], divWin: [1240, 830, 1260, 940], fdivWin: [1060, 985, 1190, 1000],
    }
  : {
      nav: [600, 24, 1160, 60], navUL: [600, 46, 700, 64], hbtn: [1200, 8, 1450, 70],
      kicker: [140, 142, 760, 164], h1a: [140, 168, 700, 240], h1b: [140, 244, 700, 298], h1c: [140, 300, 700, 338],
      sub1: [140, 352, 700, 379], sub2: [140, 380, 700, 407], btn1: [140, 418, 430, 478], btn2: [410, 418, 640, 478],
      sKick: [140, 556, 700, 586], sH2a: [140, 588, 700, 640], sH2b: [140, 642, 700, 694],
      sPara: [140, 694, 700, 744], sNote: [140, 746, 700, 791],
      icons: [480, 545, 1440, 655], card1t: [497, 620, 662, 678], card1d: [497, 678, 662, 785],
      cCircle: [900, 800, 1100, 915], cText: [1030, 815, 1245, 930],
      cSoc: [1270, 845, 1390, 895], cAddr: [1270, 895, 1440, 930],
      fCopy: [340, 975, 720, 1012], fRight: [1100, 975, 1450, 1012],
      bgCard: [300, 620], cardWin: [495, 530, 660, 791], divWin: [1245, 835, 1265, 940], fdivWin: [1060, 985, 1190, 1000],
    };

const bgOf = (img) => px(img, W.bgCard[0], W.bgCard[1]);

console.log(`== ${theme.toUpperCase()} [x,y WxH] * = differs ==`);
cmp("nav items x", (i) => clusters(i, W.nav, "white", 16));
cmp("nav underline", (i) => bbox(i, W.navUL, "orange"));
cmp("header btn", (i) => bbox(i, W.hbtn, "orange"));
cmp("kicker", (i) => bbox(i, W.kicker, "orange"));
cmp("h1 line1", (i) => bbox(i, W.h1a, "white"));
cmp("h1 line2", (i) => bbox(i, W.h1b, "orange"));
cmp("h1 line3", (i) => bbox(i, W.h1c, "white"));
cmp("sub rows", (i) => rows(i, [140, W.sub1[1], 700, W.sub2[3]], "white"));
cmp("sub line1", (i) => bbox(i, W.sub1, "white"));
cmp("btn1 orange", (i) => bbox(i, W.btn1, "orange"));
cmp("btn2 text", (i) => bbox(i, W.btn2, "white"));
cmp("svc kicker", (i) => bbox(i, W.sKick, "orange"));
cmp("svc h2 l1", (i) => bbox(i, W.sH2a, "white"));
cmp("svc h2 l2", (i) => bbox(i, W.sH2b, "orange"));
cmp("svc para rows", (i) => rows(i, [140, W.sPara[1], 700, W.sPara[3]], "white"));
cmp("svc note rows", (i) => rows(i, [140, W.sNote[1], 700, W.sNote[3]], "white"));
cmp("card h-lines", (i) => hlines(i, W.cardWin, bgOf(i)));
cmp("card v-lines", (i) => vlines(i, [470, W.cardWin[1] + 30, 700, W.cardWin[3] - 30], bgOf(i)));
cmp("icon circles x", (i) => clusters(i, W.icons, "orange", 30));
cmp("icon circles y", (i) => rows(i, [500, W.icons[1], 570, W.icons[3]], "orange"));
cmp("card1 title", (i) => bbox(i, W.card1t, "white"));
cmp("card1 desc", (i) => bbox(i, W.card1d, "white"));
cmp("cta circle", (i) => bbox(i, W.cCircle, "orange"));
cmp("cta text rows", (i) => rows(i, [1030, W.cText[1], 1240, W.cText[3]], "white"));
cmp("cta text x", (i) => bbox(i, [1030, W.cText[1], 1240, W.cText[3]], "white"));
cmp("cta divider", (i) => vlines(i, W.divWin, px(i, W.divWin[0] - 15, W.divWin[1])));
cmp("cta social x", (i) => clusters(i, W.cSoc, "orange", 8));
cmp("cta social y", (i) => rows(i, [W.cSoc[0], W.cSoc[1], W.cSoc[2], W.cSoc[3]], "orange"));
cmp("cta addr", (i) => bbox(i, W.cAddr, "white"));
cmp("footer copy", (i) => bbox(i, W.fCopy, "white"));
cmp("footer right", (i) => bbox(i, W.fRight, "orange"));
cmp("footer divider", (i) => vlines(i, W.fdivWin, px(i, W.fdivWin[0] - 20, W.fdivWin[1])));
