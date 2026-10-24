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
const notWhite = (r, g, b) => !(r > 238 && g > 238 && b > 238);
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
function firstRow(img, x, y0, y1, p) {
  for (let y = y0; y < y1; y++) if (p(px(img, x, y))) return y;
  return -1;
}
function vlines(img, [x0, y0, x1, y1], bg, frac = 0.6) {
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

console.log("== HEADER ==");
line("hdr bottom x1140", firstRow(qa, 1140, 50, 140, notWhite), firstRow(ref, 1140, 50, 140, notWhite));
line("pill bbox", bbox(qa, [1195, 10, 1432, 83], orange), bbox(ref, [1195, 10, 1432, 83], orange));
line("pill rows x1340", rows(qa, [1340, 5, 1360, 83], orange, 5), rows(ref, [1340, 5, 1360, 83], orange, 5));
line("pill white content", bbox(qa, [1225, 20, 1405, 75], white), bbox(ref, [1225, 20, 1405, 75], white));
line("pill white cols", clusters(qa, [1225, 20, 1405, 75], white, 5), clusters(ref, [1225, 20, 1405, 75], white, 5));
console.log("  px(1440,70) ours", px(qa, 1440, 70), "ref", px(ref, 1440, 70));
console.log("  px(1440,84) ours", px(qa, 1440, 84), "ref", px(ref, 1440, 84));
console.log("  px(1440,90) ours", px(qa, 1440, 90), "ref", px(ref, 1440, 90));
console.log("  px(1520,70) ours", px(qa, 1520, 70), "ref", px(ref, 1520, 70));
console.log("  px(768,90)  ours", px(qa, 768, 90), "ref", px(ref, 768, 90));

console.log("== BTN2 ==");
line("pill box", bbox(qa, [310, 392, 519, 468], (r, g, b) => diffBg([r, g, b], [254, 254, 254])), bbox(ref, [335, 392, 519, 468], (r, g, b) => diffBg([r, g, b], [254, 254, 254])));
line("border rows", rows(qa, [430, 392, 450, 468], (r, g, b) => diffBg([r, g, b], [254, 254, 254]), 15), rows(ref, [455, 392, 475, 468], (r, g, b) => diffBg([r, g, b], [254, 254, 254]), 15));
line("icon+text", bbox(qa, [330, 414, 465, 446], ink), bbox(ref, [365, 414, 510, 446], ink));
line("icon+text cols", clusters(qa, [330, 414, 465, 446], ink, 5), clusters(ref, [365, 414, 510, 446], ink, 5));
console.log("  px ref border(400,405)", px(ref, 400, 405), " (400,454)", px(ref, 400, 454), " (346,430)", px(ref, 346, 430));
console.log("  px ours border(400,396)", px(qa, 400, 396), " (315,430)", px(qa, 315, 430));

console.log("== SERVICES ==");
line("kicker", bbox(qa, [60, 565, 430, 588], orange), bbox(ref, [60, 528, 430, 548], orange));
line("para l1", bbox(qa, [60, 694, 430, 718], ink), bbox(ref, [60, 648, 430, 669], ink));
line("h2 l1 only", bbox(qa, [60, 580, 430, 618], ink), bbox(ref, [60, 550, 430, 594], ink));
line("note icon", bbox(qa, [60, 762, 150, 795], orange), bbox(ref, [60, 716, 150, 764], orange));
line("note t cols", clusters(qa, [96, 766, 430, 784], ink, 8), clusters(ref, [150, 722, 430, 740], ink, 8));

console.log("== CTA PHONE ==");
line("number", bbox(qa, [1040, 838, 1258, 868], ink), bbox(ref, [1072, 848, 1288, 880], ink));
line("wa text", bbox(qa, [1065, 874, 1258, 905], ink), bbox(ref, [1105, 880, 1288, 915], ink));
line("wa icon", bbox(qa, [1040, 874, 1064, 905], orange), bbox(ref, [1080, 878, 1104, 915], orange));
line("circle", bbox(qa, [975, 795, 1078, 878], orange), bbox(ref, [1000, 815, 1078, 880], orange));
line("mystery x1260 rows", rows(qa, [1257, 810, 1278, 940], (r, g, b) => diffBg([r, g, b], [254, 254, 254]), 4), rows(ref, [1294, 810, 1300, 940], (r, g, b) => diffBg([r, g, b], [254, 254, 254]), 4));
line("x1296 rows", rows(qa, [1296, 810, 1298, 940], (r, g, b) => diffBg([r, g, b], [254, 254, 254]), 4), rows(ref, [1296, 810, 1298, 940], (r, g, b) => diffBg([r, g, b], [254, 254, 254]), 4));

console.log("== CTA FOLLOW ==");
line("pin", bbox(qa, [1280, 880, 1352, 915], orange), bbox(ref, [1305, 878, 1352, 918], orange));
line("addr text", bbox(qa, [1305, 886, 1470, 912], ink), bbox(ref, [1340, 886, 1470, 915], ink));
line("social bbox", bbox(qa, [1270, 838, 1470, 872], orange), bbox(ref, [1300, 845, 1470, 882], orange));

console.log("== FOOTER ==");
line("div window", vlines(qa, [331, 965, 363, 1015], [254, 254, 254]), vlines(ref, [331, 965, 363, 1015], [254, 254, 254]));
line("div win2", vlines(qa, [364, 965, 396, 1015], [254, 254, 254]), vlines(ref, [364, 965, 396, 1015], [254, 254, 254]));
line("copy rows h", rows(qa, [400, 970, 730, 1005], ink, 3), rows(ref, [365, 970, 640, 1005], ink, 3));
