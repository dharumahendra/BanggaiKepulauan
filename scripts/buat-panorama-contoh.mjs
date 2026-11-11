// Membuat panorama CONTOH (equirectangular 2:1) dari foto datar, supaya viewer
// Virtual Tour bisa diuji sebelum foto 360° asli dari lapangan tersedia.
// Foto ditaruh di tengah (±100° horizontal), sisa bola diisi versi blur.
//
// Pakai: node scripts/buat-panorama-contoh.mjs
// Panorama asli dari kamera 360° TIDAK perlu script ini; cukup kompres ke
// lebar ±4096 px (preview ±2048 px) lalu taruh di public/tur/<slug>/.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SLUG = "telaga-paisu-pok";
const OUT = `public/tur/${SLUG}`;
const W = 4096;
const H = 2048;
const LEBAR_FOTO = Math.round((W * 100) / 360); // foto menutup ±100°

// [id scene, sumber foto]
const SCENE = [
  ["udara", "public/images/tur-udara.webp"],
  ["gerbang-desa", "public/images/hero-perahu.webp"],
  ["jalan-setapak", "public/images/pkt-danau.webp"],
  ["tepi-barat", "public/images/tur-dermaga.webp"],
  ["ujung-dermaga", "public/images/telaga-paisu-pok.webp"],
  ["pondok-jaga", "public/images/pkt-telaga-pohon.webp"],
  ["mata-air", "public/images/pkt-air-terjun.webp"],
];

// Potongan foto dari gambar desain (bagian tanpa elemen UI)
async function potongDariDesain() {
  await sharp("Gambar Design/Virtual Tour – Scene Udara (Desktop).png")
    .extract({ left: 2016, top: 216, width: 864, height: 1224 })
    .webp({ quality: 78 })
    .toFile("public/images/tur-udara.webp");
  await sharp("Gambar Design/Tur 360 – Fallback Galeri (HP).png")
    .extract({ left: 34, top: 450, width: 712, height: 388 })
    .webp({ quality: 80 })
    .toFile("public/images/tur-dermaga.webp");
  await sharp("Gambar Design/Virtual Tour – Kartu Hotspot (Desktop).png")
    .extract({ left: 2140, top: 196, width: 672, height: 332 })
    .webp({ quality: 80 })
    .toFile("public/images/tur-udang-merah.webp");
}

async function panorama(id, sumber) {
  const meta = await sharp(sumber).metadata();
  const tinggiFoto = Math.min(Math.round((LEBAR_FOTO * meta.height) / meta.width), Math.round(H * 0.6));
  const lebarFoto = Math.round((tinggiFoto * meta.width) / meta.height);

  const latar = await sharp(sumber).resize(W, H, { fit: "cover" }).blur(60).modulate({ brightness: 0.8 }).toBuffer();
  const feather = Math.round(Math.min(lebarFoto, tinggiFoto) * 0.08);
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${lebarFoto}" height="${tinggiFoto}">
      <filter id="b"><feGaussianBlur stdDeviation="${feather / 2}"/></filter>
      <rect x="${feather}" y="${feather}" width="${lebarFoto - feather * 2}" height="${tinggiFoto - feather * 2}" fill="#fff" filter="url(#b)"/>
    </svg>`,
  );
  const foto = await sharp(sumber)
    .resize(lebarFoto, tinggiFoto)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp(latar)
    .composite([{ input: foto, left: Math.round((W - lebarFoto) / 2), top: Math.round((H - tinggiFoto) / 2) }])
    .webp({ quality: 74 })
    .toFile(`${OUT}/${id}.webp`);
  // Foto datar untuk strip scene & galeri fallback (next/image mengecilkan sesuai layar)
  await sharp(sumber).resize(960, 600, { fit: "cover" }).webp({ quality: 74 }).toFile(`${OUT}/${id}-thumb.webp`);
  console.log("✓", id);
}

await mkdir(OUT, { recursive: true });
await potongDariDesain();
for (const [id, sumber] of SCENE) await panorama(id, sumber);
