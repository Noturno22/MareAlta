import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const our = await sharp(join(root, "qa-light.png")).raw().toBuffer({ resolveWithObject: true });
const ref = await sharp(join(root, "img/ref/3.png")).raw().toBuffer({ resolveWithObject: true });
const W = 1536;

const jobs = [
  { name: "lc2-h2", box: [60, 525, 430, 660], z: 3 },
  { name: "lc2-note", box: [60, 712, 430, 806], z: 3 },
  { name: "lc2-cta", box: [1240, 795, 1470, 935], z: 3 },
  { name: "lc2-hdrdeco", box: [1380, 0, 1536, 90], z: 4 },
  { name: "lc2-card", box: [425, 520, 645, 785], z: 2 },
];

for (const j of jobs) {
  const [x0, y0, x1, y1] = j.box;
  const w = x1 - x0, h = y1 - y0;
  const meta = { w: W, h: 1024, c: our.info.channels };
  const extract = (buf) =>
    sharp(buf, { raw: { width: meta.w, height: meta.h, channels: meta.c } })
      .extract({ left: x0, top: y0, width: w, height: h })
      .resize(w * j.z, h * j.z, { kernel: "nearest" })
      .png()
      .toBuffer();
  const a = await extract(our.data);
  const b = await extract(ref.data);
  const sep = await sharp({
    create: { width: w * j.z, height: 6, channels: 3, background: { r: 255, g: 0, b: 255 } },
  })
    .png()
    .toBuffer();
  await sharp({
    create: { width: w * j.z, height: h * j.z * 2 + 6, channels: 3, background: "#fff" },
  })
    .composite([
      { input: a, top: 0, left: 0 },
      { input: sep, top: h * j.z, left: 0 },
      { input: b, top: h * j.z + 6, left: 0 },
    ])
    .png()
    .toFile(join(root, "crops", j.name + ".png"));
  console.log(j.name, w * j.z + "x" + (h * j.z * 2 + 6));
}
