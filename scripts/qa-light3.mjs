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
const white = (r, g, b) => r > 200 && g > 200 && b > 200;
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
function hlines(img, [x0, y0, x1, y1], bg, thr = 30, frac = 0.7) {
  const out = [];
  for (let y = y0; y < y1; y++) {
    let n = 0;
    for (let x = x0; x < x1; x++) if (diffBg(px(img, x, y), bg)) n++;
    if (n > (x1 - x0) * frac) out.push(y);
  }
  return out.join(",") || "none";
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
const line = (l, a, b) => console.log(`  ${l.padEnd(24)} ours=${String(a).padEnd(46)} ref=${b}`);

const qa = await load(join(root, "qa-light.png"));
const ref = await load(join(root, "img/ref/3.png"));

console.log("== LEFT COL ROWS (ink x60-430 y515-795) ==");
line("rows", rows(qa, [60, 515, 430, 795], ink, 4), rows(ref, [60, 515, 430, 795], ink, 4));

console.log("== KICKER (orange x60-430 y520-565) ==");
line("rows", rows(qa, [60, 520, 430, 565], orange, 3), rows(ref, [60, 520, 430, 565], orange, 3));
line("bbox", bbox(qa, [60, 520, 430, 565], orange), bbox(ref, [60, 520, 430, 565], orange));

console.log("== H2 (window from kicker rows) ==");
line("l1 bbox", bbox(qa, [60, 578, 430, 614], ink), bbox(ref, [60, 552, 430, 610], ink));
line("l2 bbox", bbox(qa, [60, 614, 430, 675], orange), bbox(ref, [60, 614, 430, 660], orange));

console.log("== NOTE (icon+text) ==");
line("icon bbox", bbox(qa, [60, 755, 148, 795], orange), bbox(ref, [60, 715, 148, 765], orange));
line("text cols", clusters(qa, [95, 760, 430, 795], ink, 10), clusters(ref, [150, 718, 430, 762], ink, 10));
line("text rows", rows(qa, [150, 760, 430, 795], ink, 4), rows(ref, [150, 718, 430, 762], ink, 4));

console.log("== HEADER RIGHT ==");
line("orange c-gap3", clusters(qa, [1150, 0, 1536, 84], orange, 3), clusters(ref, [1150, 0, 1536, 84], orange, 3));
line("orange rows x1450+", rows(qa, [1450, 0, 1536, 84], orange, 1), rows(ref, [1450, 0, 1536, 84], orange, 1));
console.log("  px hdr(300,40) ours", px(qa, 300, 40), "ref", px(ref, 300, 40));
console.log("  px hdr(1490,40) ours", px(qa, 1490, 40), "ref", px(ref, 1490, 40));
console.log("  px hdr(1520,75) ours", px(qa, 1520, 75), "ref", px(ref, 1520, 75));

console.log("== BTN1 INTERIOR ==");
line("circle+text c", clusters(qa, [113, 400, 330, 445], white, 8), clusters(ref, [113, 409, 330, 450], white, 8));
line("circle rows", rows(qa, [120, 398, 152, 448], white, 3), rows(ref, [120, 407, 152, 453], white, 3));
line("pill rows x115", rows(qa, [115, 385, 130, 470], orange, 5), rows(ref, [115, 385, 130, 470], orange, 5));

console.log("== BTN2 ==");
line("border rows", hlines(qa, [350, 392, 500, 468], [255, 255, 255]), hlines(ref, [360, 392, 510, 468], [255, 255, 255]));
line("border cols", vlines(qa, [300, 412, 519, 448], [255, 255, 255], 30, 0.9), vlines(ref, [320, 414, 540, 446], [255, 255, 255], 30, 0.9));

console.log("== CTA RIGHT ==");
line("label rows", rows(qa, [1086, 806, 1184, 846], orange, 2), rows(ref, [1086, 806, 1184, 846], orange, 2));
line("label bbox", bbox(qa, [1040, 810, 1270, 840], orange), bbox(ref, [1075, 810, 1270, 845], orange));
line("number bbox", bbox(qa, [1040, 845, 1330, 884], ink), bbox(ref, [1075, 845, 1330, 884], ink));
line("number rows", rows(qa, [1045, 842, 1330, 886], ink, 3), rows(ref, [1075, 842, 1330, 886], ink, 3));
line("wa bbox", bbox(qa, [1040, 884, 1330, 930], ink), bbox(ref, [1075, 884, 1330, 930], ink));
line("siga rows", rows(qa, [1280, 806, 1470, 840], orange, 2), rows(ref, [1280, 806, 1470, 845], orange, 2));
line("siga bbox", bbox(qa, [1280, 806, 1470, 840], orange), bbox(ref, [1280, 806, 1470, 845], orange));
line("div cols", vlines(qa, [1240, 815, 1345, 935], [255, 255, 255], 14, 0.6), vlines(ref, [1240, 815, 1345, 935], [255, 255, 255], 14, 0.6));
line("addr rows", rows(qa, [1280, 884, 1470, 930], ink, 3), rows(ref, [1280, 884, 1470, 930], ink, 3));
line("addr bbox", bbox(qa, [1280, 884, 1470, 930], ink), bbox(ref, [1280, 884, 1470, 930], ink));
line("addr text bbox", bbox(qa, [1330, 890, 1470, 925], ink), bbox(ref, [1350, 890, 1470, 925], ink));

console.log("== FOOTER ==");
line("copy rows", rows(qa, [400, 970, 730, 1005], ink, 3), rows(ref, [365, 970, 640, 1005], ink, 3));
line("copy bbox", bbox(qa, [395, 972, 740, 1002], ink), bbox(ref, [360, 972, 645, 1002], ink));
line("tags cols", clusters(qa, [1220, 975, 1460, 995], orange, 7), clusters(ref, [1130, 975, 1460, 995], orange, 7));
line("tags bbox", bbox(qa, [1225, 974, 1450, 994], orange), bbox(ref, [1135, 974, 1450, 994], orange));
line("div v", vlines(qa, [340, 965, 375, 1015], [255, 255, 255], 14, 0.6), vlines(ref, [310, 965, 345, 1015], [255, 255, 255], 14, 0.6));
line("logo ink bbox", bbox(qa, [95, 945, 345, 1024], ink), bbox(ref, [95, 945, 345, 1024], ink));
