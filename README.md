# Jelajah Banggai — Portal Wisata, UMKM & Virtual Tour 360°

Prototipe dari `PRD Jelajah Banggai.md` (PRD gabungan; PRD lama ada di `docs/arsip-prd/`) dengan desain di folder `Gambar Design/`.

Stack: Next.js 16 (App Router, Cache Components) + TypeScript + Tailwind CSS v4 + Photo Sphere Viewer v5. Rencana backend: Supabase (Postgres + PostGIS + Auth + Storage), tiles 360° di Cloudflare R2.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi
npm run lint
```

## Halaman

| URL | Isi | Desain |
| --- | --- | --- |
| `/` | Hero saja (sesuai permintaan) + tombol ke Wisata & Oleh-oleh | Wisata – Banggai Kepulauan (hero) |
| `/wisata` | Menu **Paket Wisata** di paling atas (+ form cari paket di desktop), lalu kartu destinasi: cari, filter kecamatan/kategori, toggle "Ada Virtual Tour 360°" | mengikuti gaya |
| `/wisata/[slug]` | Artikel destinasi: tombol Virtual Tour + thumbnail, info praktis, yang ditemui di tur, galeri, paket yang singgah, destinasi lain, bar bawah menempel di HP | Tur 360 – Halaman Atraksi (HP) |
| `/wisata/[slug]/virtual-tour?scene=&yaw=` | Viewer 360° layar penuh: layar etika, scene drone + zona, scene darat + panah + hotspot, minimap, strip scene, kartu hotspot, CTA paket, giroskop, bagikan scene. `&mode=foto` = mode foto | Virtual Tour (Desktop) & Tur 360 (HP) |
| `/paket`, `/paket/[slug]` | Katalog & detail paket; detail kini menautkan destinasi yang disinggahi (B6) | Semua Paket, Detail Paket |
| `/paket/[slug]/reservasi`, `/reservasi/[kode]` | Reservasi langkah 2–4 | Reservasi Langkah 2–4 |
| `/produk`, `/keranjang`, `/cek`, `/pesanan/[kode]` | Oleh-oleh UMKM, keranjang per desa, cek status | Oleh-oleh UMKM |
| `/kecamatan`, `/kecamatan/[kec]` | Daftar & detail **sementara** (kartu destinasi + paket) | Detail kecamatan menyusul |
| `/peta`, `/info` | Placeholder peta GIS; syarat, FAQ, privasi | — |

Tur uji: `/wisata/telaga-paisu-pok/virtual-tour`. Contoh reservasi "DP diterima": `/reservasi/RSV-2607-014` (cek di `/cek` dengan WA `0812 4455 7801`).

## Struktur

- `src/data/destinasi.ts` — destinasi + artikel (**contoh**). `src/data/tours/telaga-paisu-pok.ts` — data tur uji (scene, panah, hotspot, zona, aturan).
- `src/features/tour/` — viewer (`Panorama.tsx`, dimuat lewat dynamic import), UI tur (`TurApp.tsx`, `bagian.tsx`), mode foto (`FallbackGaleri.tsx`).
- `src/lib/data.ts` — satu-satunya pintu akses data (destinasi, tur, paket per destinasi). Saat Supabase siap, cukup file ini yang diganti.
- `src/lib/analytics.ts` — event `artikel_view`, `tour_open`, `scene_view`, `hotspot_open`, `cta_paket_click` (ke Umami/GA4 bila dipasang).
- `scripts/buat-panorama-contoh.mjs` — membuat **panorama contoh** dari foto datar ke `public/tur/`. Foto 360° asli dari lapangan tidak perlu script ini.
- `supabase/migrations/` — `0001` skema portal, `0002` artikel destinasi + tabel tur/scene/tautan/hotspot/aturan.

## Sebelum rilis (TODO)

- **Panorama tur masih contoh** (foto datar di tengah latar blur), belum foto 360° asli. Label "Divalidasi oleh Blue Alliance" di hotspot juga contoh — wajib divalidasi mitra.
- Isi artikel, retribusi, waktu tempuh adalah ilustrasi. Lokasi Telaga Paisu Pok di data (Bulagi Satu · Bulagi) berbeda dengan desain (Desa Paisu Pok · Bulagi Utara) — perlu dicek.
- Nomor WhatsApp desa masih **placeholder** (`62800…`). Kontak di `src/lib/site.ts` perlu diverifikasi ke Dinas Pariwisata.
- Transaksi masih di `localStorage`; sambungkan Supabase (API route reservasi/pesanan/cek status, unggah bukti bayar).
- Belum dikerjakan: dashboard `/admin/*` termasuk editor artikel & editor tur (modul D, T), tiles resolusi tinggi + script tiles, pratinjau mitra `?preview=token`, halaman detail kecamatan + Peta GIS (menunggu desain), halaman desa, `/produk/[slug]`, `/umkm/[slug]`.
