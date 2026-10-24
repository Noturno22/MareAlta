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

const theme = process.argv[2] || "dark";
const LIGHT = theme === "light";
const qa = await load(join(root, LIGHT ? "qa-light.png" : "qa-dark.png"));
const ref = await load(join(root, LIGHT ? "img/ref/3.png" : "img/ref/1.png"));

const mk = (mode) =>
  mode === "o"
    ? (r, g, b) => r > 140 && g > 30 && g < 175 && b < 115 && r - b > 70
    : LIGHT
      ? (r, g, b) => r < 110 && g < 110 && b < 130
      : (r, g, b) => r > 185 && g > 185 && b > 185;

function scan(label, [x0, y0, x1, y1], mode) {
  const p = mk(mode);
  const run = (img) => {
    const bands = [];
    let cur = null;
    for (let y = y0; y < y1; y++) {
      let minx = 1e9, maxx = -1, n = 0;
      for (let x = x0; x < x1; x++) {
        const [r, g, b] = px(img, x, y);
        if (p(r, g, b)) {
          n++;
          if (x < minx) minx = x;
          if (x > maxx) maxx = x;
        }
      }
      if (n >= 2) {
        if (!cur) cur = { y0: y, y1: y, minx, maxx, n };
        else {
          cur.y1 = y;
          cur.minx = Math.min(cur.minx, minx);
          cur.maxx = Math.max(cur.maxx, maxx);
          cur.n += n;
        }
      } else if (cur) {
        bands.push(cur);
        cur = null;
      }
    }
    if (cur) bands.push(cur);
    return bands.map((b) => `y${b.y0}-${b.y1 + 1} x${b.minx}-${b.maxx + 1}`).join(" | ");
  };
  const a = run(qa), b = run(ref);
  console.log(`-- ${label}`);
  console.log(`   ours: ${a}`);
  console.log(`   ref : ${b}`);
  console.log(`   ${a === b ? "=" : "*"}`);
}

const S = process.argv[3];
if (S === "hero") {
  scan("kicker(orange)", [145, 135, 610, 170], "o");
  scan("h1+sub(white)", [145, 160, 610, 420], "t");
  scan("btn1(orange)", [145, 410, 440, 485], "o");
  scan("btn2(white)", [430, 410, 640, 485], "t");
} else if (S === "nav") {
  scan("nav(white)", [560, 18, 1200, 68], "t");
  scan("nav(orange)", [560, 18, 1200, 70], "o");
  scan("hdr-btn(orange)", [1200, 5, 1460, 75], "o");
} else if (S === "svc") {
  scan("leftcol(orange)", [145, 550, 478, 791], "o");
  scan("leftcol(white)", [145, 550, 478, 791], "t");
  scan("card1(white)", [486, 545, 672, 791], "t");
  scan("card1(orange)", [486, 545, 672, 791], "o");
} else if (S === "cta") {
  scan("circle(orange)", [930, 795, 1070, 915], "o");
  scan("phone(white)", [1025, 805, 1245, 935], "t");
  scan("label(orange)", [1025, 805, 1245, 850], "o");
  scan("wa(orange)", [1025, 875, 1245, 915], "o");
  scan("social(orange)", [1260, 830, 1400, 900], "o");
  scan("addr(white)", [1260, 885, 1450, 930], "t");
  scan("sigalabel(orange)", [1260, 830, 1400, 860], "o");
} else if (S === "foot") {
  scan("copy(white)", [330, 965, 760, 1018], "t");
  scan("right(orange)", [1080, 965, 1460, 1018], "o");
  scan("logo(nonbg-dark)", [140, 955, 320, 1022], "t");
}
