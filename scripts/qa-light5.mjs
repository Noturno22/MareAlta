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
const line = (l, a, b) => console.log(`  ${l.padEnd(24)} ours=${String(a).padEnd(44)} ref=${b}`);

const qa = await load(join(root, "qa-light.png"));
const ref = await load(join(root, "img/ref/3.png"));

console.log("== HEADER BTN (interior) ==");
line("pill white bbox", bbox(qa, [1284, 27, 1404, 62], white), bbox(ref, [1216, 20, 1404, 66], white));
line("pill white cols", clusters(qa, [1284, 27, 1404, 62], white, 5), clusters(ref, [1216, 20, 1404, 66], white, 5));
line("pill orange cols", clusters(qa, [1195, 25, 1435, 60], orange, 3), clusters(ref, [1195, 25, 1435, 60], orange, 3));
console.log("  deco ref cols notWhite:", clusters(ref, [1415, 0, 1536, 84], notWhite, 4));
console.log("  px ref(1460,75)", px(ref, 1460, 75), "(1470,60)", px(ref, 1470, 60), "(1500,64)", px(ref, 1500, 64), "(1435,80)", px(ref, 1435, 80));
console.log("  px our(1460,75)", px(qa, 1460, 75), "(1500,64)", px(qa, 1500, 64), "(1520,84)", px(qa, 1520, 84), "ref(1520,84)", px(ref, 1520, 84));

console.log("== HERO BTN1 ==");
line("white content", bbox(qa, [118, 404, 296, 444], white), bbox(ref, [118, 412, 316, 448], white));
line("white cols", clusters(qa, [118, 404, 296, 444], white, 6), clusters(ref, [118, 412, 316, 448], white, 6));
line("pill rows", rows(qa, [270, 390, 295, 465], orange, 5), rows(ref, [300, 395, 318, 465], orange, 5));
line("pill cols", clusters(qa, [95, 405, 340, 445], orange, 8), clusters(ref, [95, 410, 340, 450], orange, 8));

console.log("== H2 L2 ==");
line("h2 l2", bbox(qa, [60, 618, 430, 672], ink), bbox(ref, [60, 594, 430, 644], ink));

console.log("== NOTE ==");
line("icon", bbox(qa, [58, 756, 96, 802], orange), bbox(ref, [100, 712, 160, 766], orange));
line("text orange?", bbox(qa, [97, 756, 430, 802], orange), bbox(ref, [160, 718, 430, 742], orange));
line("text ink", bbox(qa, [97, 756, 430, 802], ink), bbox(ref, [160, 718, 430, 742], ink));
line("ref line2 ink", "—", bbox(ref, [160, 740, 430, 762], ink));
console.log("  px our note text (200,775)", px(qa, 200, 775), " ref (200,730)", px(ref, 200, 730), " ref (250,752)", px(ref, 250, 752));
console.log("  px our note icon (70,775)", px(qa, 70, 775), " ref (120,735)", px(ref, 120, 735));

console.log("== CTA ==");
line("label", bbox(qa, [1035, 810, 1258, 838], orange), bbox(ref, [1072, 820, 1258, 846], orange));
line("siga", bbox(qa, [1275, 810, 1470, 838], orange), bbox(ref, [1305, 822, 1470, 846], orange));
line("wa icon full", bbox(qa, [1035, 872, 1105, 912], orange), bbox(ref, [1060, 876, 1110, 918], orange));
line("addr text", bbox(qa, [1303, 884, 1470, 915], ink), bbox(ref, [1345, 886, 1470, 915], ink));
line("x1296 rows", rows(qa, [1295, 810, 1300, 940], (r, g, b) => diffBg([r, g, b], [254, 254, 254]), 1), rows(ref, [1295, 810, 1300, 940], (r, g, b) => diffBg([r, g, b], [254, 254, 254]), 1));
line("x1265 rows", rows(qa, [1263, 810, 1269, 940], (r, g, b) => diffBg([r, g, b], [254, 254, 254]), 1), rows(ref, [1263, 810, 1269, 940], (r, g, b) => diffBg([r, g, b], [254, 254, 254]), 1));
console.log("  px our mystery (1265,850)", px(qa, 1265, 850), "(1270,880)", px(qa, 1270, 880), "(1275,920)", px(qa, 1275, 920));
console.log("  px ref (1265,850)", px(ref, 1265, 850), " ref(1296,850)", px(ref, 1296, 850), " our(1296,850)", px(qa, 1296, 850));
console.log("  px our code div (1265,900)", px(qa, 1265, 900), " ref (1296,900)", px(ref, 1296, 900));

console.log("== PARA pitch ==");
line("our para rows", rows(qa, [60, 690, 430, 760], ink, 40), rows(ref, [60, 645, 430, 715], ink, 40));

console.log("== FOOTER DIV ==");
line("ref div col328 rows", "—", rows(ref, [327, 955, 331, 1020], (r, g, b) => diffBg([r, g, b], [254, 254, 254]), 1));
line("our div col357 rows", rows(qa, [356, 955, 359, 1020], (r, g, b) => diffBg([r, g, b], [254, 254, 254]), 1), "—");
line("ref logo cols", clusters(ref, [105, 958, 345, 1010], ink, 6), "—");
