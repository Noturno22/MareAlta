import sharp from "sharp";

const SRC = "img/logo-n.jpg";
const OUT_LIGHT = "public/img/logo-n.png";
const OUT_DARK = "public/img/logo-n-dark.png";

const SAT_GRAY = 48;

async function trim(buf) {
  return sharp(buf)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 6 })
    .png()
    .toBuffer();
}

async function report(path) {
  const m = await sharp(path).metadata();
  console.log(`${path}: ${m.width}x${m.height} ratio ${(m.width / m.height).toFixed(3)}`);
  return m;
}

const light = await trim(await sharp(SRC).png().toBuffer());
await sharp(light).toFile(OUT_LIGHT);

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const out = Buffer.alloc(info.width * info.height * 4);
for (let i = 0; i < out.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max - min;
  if (sat < SAT_GRAY) {
    out[i] = 255 - r;
    out[i + 1] = 255 - g;
    out[i + 2] = 255 - b;
  } else {
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
  }
  out[i + 3] = a;
}

const dark = await trim(
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer()
);
await sharp(dark).toFile(OUT_DARK);

await report(OUT_LIGHT);
await report(OUT_DARK);
