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
  white: (r, g, b) => r > 190 && g > 190 && b > 190,
  w185: (r, g, b) => r > 185 && g > 185 && b > 185,
  orange: (r, g, b) => r > 170 && g > 40 && g < 170 && b < 100,
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
function vline(img, [x0, y0, x1, y1]) {
  const base = px(img, x0 - 15, Math.floor((y0 + y1) / 2));
  const out = [];
  for (let x = x0; x < x1; x++) {
    let n = 0;
    for (let y = y0; y < y1; y++) {
      const c = px(img, x, y);
      if (Math.hypot(c[0] - base[0], c[1] - base[1], c[2] - base[2]) > 14) n++;
    }
    if (n > (y1 - y0) * 0.5) out.push(`${x}(${n})`);
  }
  return out.join(" ") || "none";
}
function vext(img, x, [y0, y1]) {
  let a = -1, b2 = -1;
  const base = px(img, x - 15, Math.floor((y0 + y1) / 2));
  for (let y = y0; y < y1; y++) {
    const c = px(img, x, y);
    if (Math.hypot(c[0] - base[0], c[1] - base[1], c[2] - base[2]) > 14) {
      if (a < 0) a = y;
      b2 = y;
    }
  }
  return a < 0 ? "none" : `${a}-${b2 + 1}`;
}
function notBg(bg, d = 40) {
  return (c) => Math.abs(c[0] - bg[0]) + Math.abs(c[1] - bg[1]) + Math.abs(c[2] - bg[2]) > d;
}

const theme = process.argv[2] || "dark";
const img = await load(join(root, theme === "light" ? "img/ref/3.png" : "img/ref/1.png"));
const L = theme === "light";
const line = (l, v) => console.log(`${l.padEnd(20)} ${v}`);

console.log(`== REF ${theme.toUpperCase()} ==`);
line("nav clusters", clusters(img, [560, 18, 1200, 70], "white", 16));
line("nav underline", bbox(img, [560, 55, 760, 75], "orange"));
line("hdr btn", bbox(img, [1180, 5, 1500, 78], "orange"));
line("kicker", bbox(img, [140, 135, 780, 168], "orange"));
line("h1 rows", rows(img, [145, 160, 780, 350], L ? "white" : "w185"));
line("h1 l1", bbox(img, [140, L ? 150 : 165, 780, L ? 216 : 240], "white"));
line("h1 l3", bbox(img, [140, L ? 279 : 300, 780, L ? 335 : 345], L ? "white" : "w185"));
line("sub rows", rows(img, [145, 345, 780, 412], "white"));
line("btn1 orange", bbox(img, [140, 410, 450, 490], "orange"));
line("btn2 white", bbox(img, [430, 410, 700, 490], "white"));
line("svc kicker", bbox(img, [140, 545, 478, 588], "orange"));
line("svc h2 l1", bbox(img, [140, 588, 478, 645], "white"));
line("svc h2 l2", bbox(img, [140, 645, 478, 700], "orange"));
line("svc para rows", rows(img, [145, 700, 478, 750], "white"));
line("svc note rows", rows(img, [145, 750, 478, 792], "white"));
line("svc note bbox", bbox(img, [145, 745, 478, 792], "white"));
line("card1 vlines", (() => {
  const bg = px(img, 300, 640);
  const out = [];
  for (let x = 460; x < 720; x++) {
    let n = 0;
    for (let y = 600; y < 740; y++) {
      const c = px(img, x, y);
      if (Math.hypot(c[0] - bg[0], c[1] - bg[1], c[2] - bg[2]) > 6) n++;
    }
    if (n > 120) out.push(x);
  }
  return out.join(",");
})());
line("icon circles x", clusters(img, [480, 545, 1440, 660], "orange", 30));
line("icon circles y", rows(img, [500, 545, 570, 660], "orange"));
line("card1 title", bbox(img, [497, 600, 670, 680], "white"));
line("card1 desc", bbox(img, [497, 680, 670, 785], "w185"));
line("cta circle", bbox(img, [930, 795, 1070, 915], "orange"));
line("cta label", bbox(img, [1010, 805, 1250, 850], "orange"));
line("cta phone rows", rows(img, [1015, 845, 1250, 885], "white"));
line("cta phone", bbox(img, [1015, 845, 1250, 885], "white"));
line("cta wa rows", rows(img, [1015, 885, 1250, 925], "white"));
line("cta divider x", vline(img, [1180, 810, 1250, 935]));
line("siga label", bbox(img, [1255, 805, 1460, 850], "orange"));
line("social x", clusters(img, [1255, 850, 1460, 890], "orange", 8));
line("social y", rows(img, [1255, 845, 1460, 895], "orange"));
line("addr rows", rows(img, [1255, 895, 1470, 935], "white"));
line("addr bbox", bbox(img, [1255, 895, 1470, 935], "white"));
line("foot logo", bbox(img, [100, 955, 320, 1024], notBg(L ? [251, 252, 251] : [10, 12, 14])));
line("foot div x", vline(img, [310, 965, 360, 1010]));
line("foot copy", bbox(img, [340, 965, 800, 1015], L ? "white" : "w185"));
line("foot right x", (() => {
  const o = bbox(img, [1000, 965, 1500, 1015], "orange");
  return o;
})());
line("foot right div", vline(img, [1040, 965, 1200, 1015]));
