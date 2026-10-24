import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const REF = "C:/Users/Nortuno/Desktop/DEV/Mare/img/ref";
const OUT = "C:/Users/Nortuno/Desktop/DEV/Mare/public/img";

// box = [x0,y0,x1,y1] relativo ao crop (inclusivo); fora da box nao se mascara
const JOBS = [
  { src: "1.png", out: "hero-dark-left.png", crop: [0, 81, 615, 429], rule: "dark", box: [140, 40, 614, 415], dilate: 5 },
  { src: "3.png", out: "hero-light-left.png", crop: [0, 85, 600, 429], rule: "light", box: [95, 40, 599, 410], dilate: 6 },
  { src: "1.png", out: "cta-dark-right.png", crop: [980, 792, 556, 160], rule: "dark", box: [0, 0, 555, 159], dilate: 5 },
  { src: "3.png", out: "cta-light-right.png", crop: [962, 784, 574, 166], rule: "light", box: [30, 0, 573, 165], dilate: 6, forceMask: [[292, 0, 316, 165]] },
];

const MAX_AREA = 2500;

function isOrange(r, g, b) { return r > 190 && g < 175 && b < 120; }
function isDarkText(r, g, b) { // navy/cinza-escuro a NOVO (texto claro); exclui verdes (folhagem)
  const val = Math.max(r, g, b);
  const green = g > r + 12 && g > b + 12;
  return val < 130 && !green;
}
function isBrightGray(r, g, b) { // texto branco/cinza (tema escuro)
  const val = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = val === 0 ? 0 : ((val - min) / val) * 255;
  return val > 60 && sat < 70;
}

function label(mask, w, h) {
  const comp = new Int32Array(w * h).fill(-1);
  const stack = new Int32Array(w * h);
  const comps = [];
  let id = 0;
  for (let i = 0; i < w * h; i++) {
    if (!mask[i] || comp[i] !== -1) continue;
    let sp = 0; stack[sp++] = i; comp[i] = id; let area = 0; let hasOrange = false;
    while (sp > 0) {
      const p = stack[--sp]; area++;
      const x = p % w, y = (p / w) | 0;
      if (isOrange(data[p * 4], data[p * 4 + 1], data[p * 4 + 2])) hasOrange = true;
      const nb = [
        x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1,
        y > 0 ? p - w : -1, y < h - 1 ? p + w : -1,
      ];
      for (const n of nb) if (n >= 0 && mask[n] && comp[n] === -1) { comp[n] = id; stack[sp++] = n; }
    }
    comps.push({ id, area, hasOrange });
    id++;
  }
  return { comp, comps };
}

function dilate(mask, w, h, times) {
  for (let t = 0; t < times; t++) {
    const cp = Uint8Array.from(mask);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (cp[p]) continue;
      if ((x > 0 && cp[p - 1]) || (x < w - 1 && cp[p + 1]) || (y > 0 && cp[p - w]) || (y < h - 1 && cp[p + w])) mask[p] = 1;
    }
  }
}

let data; // global simples p/ label()
async function run(job) {
  const [cx, cy, cw, ch] = job.crop;
  const { data: buf, info } = await sharp(path.join(REF, job.src))
    .extract({ left: cx, top: cy, width: cw, height: ch })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  data = buf;
  const w = info.width, h = info.height;
  const mask = new Uint8Array(w * h);
  const [bx0, by0, bx1, by1] = job.box;
  const test = job.rule === "dark" ? isBrightGray : isDarkText;
  for (let y = by0; y <= by1 && y < h; y++) {
    for (let x = bx0; x <= bx1 && x < w; x++) {
      const p = y * w + x;
      const r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2];
      if (isOrange(r, g, b) || test(r, g, b)) mask[p] = 1;
    }
  }
  const { comp, comps } = label(mask, w, h);
  const keep = new Uint8Array(comps.length);
  for (const c of comps) keep[c.id] = c.hasOrange || c.area <= MAX_AREA ? 1 : 0;
  for (let p = 0; p < w * h; p++) if (mask[p] && !keep[comp[p]]) mask[p] = 0;
  for (const [fx0, fy0, fx1, fy1] of job.forceMask ?? []) {
    for (let y = fy0; y <= fy1 && y < h; y++) for (let x = fx0; x <= fx1 && x < w; x++) mask[y * w + x] = 1;
  }
  dilate(mask, w, h, job.dilate);

  // BFS fill: fontes = pixels nao-mascarados (valores finais), propagar p/ mascarados
  const out = Buffer.from(data);
  const filled = new Uint8Array(w * h);
  const q = new Int32Array(w * h);
  let qh = 0, qt = 0;
  for (let p = 0; p < w * h; p++) if (!mask[p]) { filled[p] = 1; q[qt++] = p; }
  const fillFrom = (n) => {
    const x = n % w, y = (n / w) | 0;
    let r = 0, g = 0, b = 0, a = 0, cnt = 0;
    const nb = [x > 0 ? n - 1 : -1, x < w - 1 ? n + 1 : -1, y > 0 ? n - w : -1, y < h - 1 ? n + w : -1];
    for (const s of nb) {
      if (s < 0 || !filled[s]) continue;
      r += out[s * 4]; g += out[s * 4 + 1]; b += out[s * 4 + 2]; a += out[s * 4 + 3]; cnt++;
    }
    if (cnt === 0) return false;
    out[n * 4] = (r / cnt) | 0; out[n * 4 + 1] = (g / cnt) | 0; out[n * 4 + 2] = (b / cnt) | 0; out[n * 4 + 3] = (a / cnt) | 0;
    return true;
  };
  while (qh < qt) {
    const p = q[qh++];
    const x = p % w, y = (p / w) | 0;
    const nb = [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1];
    for (const n of nb) {
      if (n < 0 || !mask[n] || filled[n]) continue;
      if (fillFrom(n)) { filled[n] = 1; q[qt++] = n; }
    }
  }
  // pixels ainda por preencher (blocos isolados): mean global da box
  let mr = 0, mg = 0, mb = 0, mn = 0;
  for (let p = 0; p < w * h; p++) if (!mask[p]) { mr += data[p * 4]; mg += data[p * 4 + 1]; mb += data[p * 4 + 2]; mn++; }
  for (let p = 0; p < w * h; p++) if (mask[p] && !filled[p]) {
    out[p * 4] = (mr / mn) | 0; out[p * 4 + 1] = (mg / mn) | 0; out[p * 4 + 2] = (mb / mn) | 0;
  }

  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toFile(path.join(OUT, job.out));
  const masked = mask.reduce((a, b) => a + b, 0);
  console.log(`OK ${job.out} ${w}x${h} masked=${masked}`);
}

for (const job of JOBS) await run(job);
