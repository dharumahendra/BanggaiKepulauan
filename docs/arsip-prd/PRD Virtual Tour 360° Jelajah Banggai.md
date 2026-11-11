# PRD Virtual Tour 360° Jelajah Banggai

Nov 10, 2026 · @Dharu Bintang

## Ringkasan & latar belakang

Modul Virtual Tour 360° menambahkan tur foto panorama dengan navigasi maju-mundur ala Street View untuk 10 tempat wisata di Portal Wisata & UMKM Banggai Kepulauan. Modul ini menempel di halaman atraksi (A3), tab Wisata kecamatan (E4), dan Peta GIS (F2), lalu mengarahkan wisatawan ke alur reservasi paket (modul B) yang sudah ada.

**Masalah.** Lokasi wisata terpencil, akses perahu mahal, dan informasi visual minim, sehingga wisatawan sulit menilai lokasi sebelum berangkat. Perairan Banggai juga kawasan konservasi laut yang dikelola bersama Blue Alliance, jadi promosi wisata perlu disertai edukasi etika berkunjung.

**Pendekatan.** Tur disusun dari foto 360° (equirectangular) yang diambil setiap beberapa meter di jalur utama, dihubungkan dengan panah. Setiap tur dibuka dengan panorama drone dan dilengkapi hotspot edukasi konservasi.

**Asumsi dokumen ini**

- Prototipe high-fi berupa kode (Next.js), bukan mockup statis, supaya bisa langsung digabung ke repo portal.
- Daftar final 10 tempat wisata ditentukan dari survei; sebelum itu prototipe memakai satu lokasi uji.
- Konten edukasi divalidasi Blue Alliance atau Dinas Pariwisata sebelum tayang.
- Pemotretan seluruh lokasi dilakukan saat KKN; prototipe dibangun sebelum berangkat, mengikuti prinsip rencana rilis portal.

## Tujuan, non-goals, dan metrik

Sukses berarti wisatawan bisa "berjalan" di 10 tempat wisata dari HP, memahami etika berkunjung, lalu lanjut ke paket wisata, dan tur tetap bisa dirawat pengelola setelah KKN.

**Tujuan**

1. Wisatawan menjelajah 10 tempat wisata secara virtual dari HP sebelum memesan.
2. Setiap tur mengarah ke paket wisata yang singgah di lokasi itu.
3. Edukasi konservasi muncul tepat di titik yang relevan.
4. Admin bisa mengganti foto, panah, dan hotspot tanpa menulis kode.

**Non-goals versi pertama**

- Video 360°, live streaming, atau mode VR headset.
- Tur bawah air (kandidat fase 2).
- Model 3D atau fotogrametri.
- Upload otomatis ke Google Maps; dilakukan manual bila disepakati.

**Metrik keberhasilan** (selama KKN dan 3 bulan setelahnya)

| Metrik | Target | Cara ukur |
| --- | --- | --- |
| Tempat wisata dengan tur tayang | 10 dari 10 | Status tur di dashboard |
| Scene per tur | ≥ 8 | Data scene |
| Hotspot edukasi tervalidasi mitra per tur | ≥ 3 | Data hotspot |
| Pengunjung halaman atraksi yang membuka tur | ≥ 30% | Event `tour_open` |
| Tur yang berlanjut ke klik paket | ≥ 5% | Event `cta_paket_click` |
| Preview tur tampil di 3G | < 3 detik | Lighthouse dengan throttling |
| Pembaruan tur oleh admin lokal | ≥ 1 per kuartal setelah KKN | Log aktivitas admin |

Target ini titik awal dan dikalibrasi setelah data kunjungan pertama masuk.

## Pengguna & peran

Peran mengikuti hierarki portal (D1), ditambah mitra konservasi sebagai peninjau konten tanpa akun.

| Peran | Yang dilakukan di modul tur | Batasan |
| --- | --- | --- |
| Wisatawan | Membuka tur, berpindah scene, membaca hotspot, lanjut ke paket | HP, sinyal dan kuota terbatas |
| Operator desa | Mengganti foto scene dan mengedit teks hotspot di desanya | Tidak teknis, sinyal lemah |
| Admin kecamatan | Memeriksa tur desa di kecamatannya sebelum tayang | Waktu terbatas |
| Admin kabupaten / tim KKN | Membuat tur, menyusun scene dan panah, mengatur status tayang | Tim KKN hanya ada selama program |
| Mitra konservasi (Blue Alliance, Dinas) | Meninjau dan menyetujui isi hotspot edukasi lewat link pratinjau | Tidak perlu login |

**Prinsip desain:** tur harus bisa dipakai penuh dengan satu tangan di layar 360 px, dan semua isi edukasi tetap terbaca sebagai teks biasa bila panorama gagal dimuat.

## User flow utama

Wisatawan bisa masuk dari tiga pintu, melihat etika berkunjung, menjelajah dari udara ke darat, lalu diarahkan ke paket wisata; bila panorama gagal dimuat, mereka tetap mendapat foto dan isi edukasi.

&#91;embedded content: alur wisatawan · 3 pintu masuk, 1 fallback\]

Kartu hotspot bisa dibuka dan ditutup kapan saja di scene darat; CTA paket juga selalu terlihat di viewer, tidak hanya di akhir tur.

## Kebutuhan fungsional

MVP prototipe = semua baris **Must**. ID memakai awalan baru (V, K, I, T) supaya tidak bentrok dengan ID di PRD portal.

### V. Viewer & navigasi

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| V1 | Viewer panorama: geser untuk melihat sekeliling, cubit untuk zoom, tombol layar penuh | Must |
| V2 | Panah di lantai menuju scene tetangga, transisi halus, tombol kembali ke scene sebelumnya | Must |
| V3 | Scene pembuka dari drone dengan tombol "Turun ke lokasi" | Must |
| V4 | Preview statis + tombol "Jelajahi 360°"; viewer baru dimuat setelah diklik | Must |
| V5 | Fallback galeri foto datar bila WebGL tidak tersedia atau gambar gagal dimuat | Must |
| V6 | Strip thumbnail scene untuk lompat langsung | Should |
| V7 | Mode giroskop: gerakkan HP untuk melihat sekeliling | Should |
| V8 | Minimap posisi scene dan arah pandang | Should |
| V9 | Link per scene dan arah pandang (`?scene=&yaw=`) untuk dibagikan | Should |
| V10 | Kompas dan putar otomatis pelan saat diam | Could |

### K. Edukasi konservasi

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| K1 | Hotspot berikon di panorama; diklik membuka kartu (judul, 2–3 kalimat, foto opsional, sumber) | Must |
| K2 | Empat tipe hotspot dengan ikon berbeda: info, aturan, spesies, zona | Must |
| K3 | Layar etika berkunjung (3–5 aturan) sebelum tur, bisa dilewati, muncul sekali per sesi | Must |
| K4 | Daftar seluruh hotspot sebagai teks di bawah viewer | Must |
| K5 | Label "Divalidasi oleh \[mitra\]" di kartu | Should |
| K6 | Poligon zona (boleh dikunjungi / dilindungi) di panorama drone | Should |
| K7 | Audio narasi warga per scene | Could |

### I. Integrasi portal

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| I1 | Badge "360°" di kartu atraksi dan tombol buka tur di halaman atraksi | Must |
| I2 | CTA "Lihat paket di lokasi ini" di dalam tur, menuju paket yang memuat atraksi itu | Must |
| I3 | Event analytics: `tour_open`, `scene_view`, `hotspot_open`, `cta_paket_click` | Must |
| I4 | Layer "Tur 360°" di Peta kecamatan dan kabupaten; klik titik membuka tur | Should |
| I5 | Tombol bagikan ke WhatsApp dengan link scene | Should |

### T. Editor tur (dashboard)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| T1 | Upload panorama per scene; sistem membuat preview dan tiles otomatis | Must |
| T2 | Atur arah awal scene dengan memutar panorama lalu "Jadikan arah depan" | Must |
| T3 | Taruh panah dengan klik di panorama dan pilih scene tujuan; panah balik dibuat otomatis | Must |
| T4 | Tambah dan edit hotspot dengan klik di panorama + form | Must |
| T5 | Hak akses mengikuti peran portal (D1) | Must |
| T6 | Status tur: Draf → Ditinjau mitra → Tayang, dengan link pratinjau tanpa login | Should |
| T7 | Lokasi scene dari GPS di file foto atau pin di peta | Should |
| T8 | Blur manual area tertentu di editor | Could |

## Integrasi dengan portal

Modul tur menggantung pada entitas `Atraksi` yang sudah ada: satu atraksi punya paling banyak satu tur, dan semua relasi ke desa, kecamatan, paket, serta hak akses diturunkan dari atraksi itu.

**Halaman dan URL baru**

| Halaman | URL | Isi |
| --- | --- | --- |
| Tur (layar penuh) | `/360/[slug]?scene=&yaw=` | Viewer, etika berkunjung, hotspot, CTA paket |
| Tur di halaman atraksi | komponen di halaman atraksi | Preview + tombol "Jelajahi 360°" (V4) |
| Daftar tur (admin) | `/admin/tur` | Daftar tur sesuai wilayah peran, status |
| Editor tur (admin) | `/admin/tur/[id]` | Scene, panah, hotspot, status |
| Pratinjau mitra | `/360/[slug]?preview=[token]` | Tur berstatus Ditinjau, tanpa login |

**Entitas baru**

| Entitas | Field utama | Relasi |
| --- | --- | --- |
| `Tur` | id, atraksi\_id, nama, slug, scene\_awal\_id, status (draf/ditinjau/tayang), validator\_mitra, divalidasi\_pada, preview\_token | milik satu Atraksi; punya banyak Scene |
| `Scene` | id, tur\_id, nama, urutan, tipe (darat/udara), tiles\_url, preview\_url, yaw\_awal, koreksi\_utara, lokasi (Point), diambil\_pada | punya banyak TautanScene dan Hotspot |
| `TautanScene` | id, dari\_scene\_id, ke\_scene\_id, yaw, pitch | satu panah; pasangan balik dibuat otomatis |
| `Hotspot` | id, scene\_id, tipe (info/aturan/spesies/zona), yaw, pitch, judul, isi, foto\_url, sumber, poligon (opsional) | milik Scene |
| `AturanBerkunjung` | id, urutan, teks, ikon, tur\_id (kosong = berlaku untuk semua tur) | tampil di layar etika (K3) |

**Titik sambung ke modul lain**

- **Atraksi (A3, E4, E7):** kartu atraksi menampilkan badge 360° bila `Tur.status = tayang`.
- **Paket (B1, B14):** CTA di tur mencari paket yang memuat atraksi tersebut; bila kosong, CTA berganti ke paket di desa yang sama.
- **Peta (F2, F7):** titik scene pertama tiap tur diekspor sebagai GeoJSON menjadi `LayerPeta` bertipe titik bernama "Tur 360°".
- **Dashboard (D1, D2):** menu Tur muncul untuk tiga peran pengelola, dengan RLS Supabase yang sama.
- **Analytics:** event tur dikirim ke Umami/GA4 yang sama dengan portal.

## Kebutuhan non-fungsional

Foto 360° adalah aset terberat di seluruh portal, jadi aturan utamanya: tidak ada yang dimuat sebelum diminta, dan yang dimuat pertama selalu versi kecil.

- **Ringan:** preview statis ≤ 150 KB; scene pertama tampil dari versi resolusi rendah (lebar ±2048 px, ≤ 400 KB), lalu tiles resolusi tinggi dimuat sesuai arah pandang.
- **Tidak membebani halaman lain:** kode viewer dimuat lewat dynamic import hanya saat tur dibuka; halaman atraksi tidak bertambah berat selain preview.
- **Hemat kuota:** pramuat scene tetangga hanya versi resolusi rendah, dan dimatikan bila browser melaporkan mode hemat data.
- **Mobile-first:** semua kontrol ≥ 44 px, bisa dipakai satu tangan; izin giroskop di iOS diminta lewat tombol, bukan otomatis.
- **Aksesibel:** navigasi dengan tombol panah keyboard, deskripsi teks per scene, dan daftar hotspot sebagai teks (K4).
- **Privasi:** wajah dan plat kendaraan diblur sebelum upload; tidak memotret rumah warga atau tempat sakral tanpa izin; ada jalur permintaan hapus foto.
- **Keberlanjutan:** data tersimpan dalam format terbuka (JPG equirectangular + JSON scene), bisa diekspor dan dipindah tanpa layanan berbayar.
- **Biaya:** tetap di batas free tier; perkiraan kasar 10 tur × ±20 scene × ±8 MB tiles ≈ 1,6 GB, sehingga tiles disimpan di object storage terpisah dari Supabase Storage.

## Rekomendasi tech stack

Pakai Photo Sphere Viewer di dalam repo Next.js portal yang sama, dengan tiles di Cloudflare R2 dan metadata di Supabase. Tidak ada layanan berbayar baru.

| Lapisan | Rekomendasi | Alasan | Alternatif |
| --- | --- | --- | --- |
| Viewer | [Photo Sphere Viewer](https://photo-sphere-viewer.js.org/) v5 + [VirtualTourPlugin](https://photo-sphere-viewer.js.org/plugins/virtual-tour) | Plugin tur menautkan banyak panorama; panah bisa diatur manual atau dari GPS; mendukung TypeScript | Pannellum, Marzipano |
| Plugin pendukung | Markers (hotspot), Gallery (strip scene), Gyroscope, Map/Plan (minimap), Compass, Autorotate | Semua dari keluarga PSV dan terintegrasi dengan plugin tur | — |
| Gambar resolusi tinggi | Adapter tiles equirectangular PSV + script Node (sharp) yang memotong panorama menjadi tiles dan preview | Hanya potongan yang dilihat yang diunduh | Cubemap |
| Integrasi Next.js | Komponen client dengan `dynamic(..., { ssr: false })` | Viewer butuh WebGL di browser; tidak ikut bundle halaman lain | — |
| Penyimpanan tiles | [Cloudflare R2](https://developers.cloudflare.com/r2/pricing/) | Free tier 10 GB per bulan dan egress gratis, cocok untuk gambar yang sering diunduh | Supabase Storage (kuota lebih kecil) |
| Metadata | Supabase Postgres + RLS (tabel di bagian Integrasi) | Sama dengan portal, hak akses ikut peran | — |
| Pra-produksi foto | Software bawaan kamera untuk stitching dan ekspor equirectangular; blur di editor foto | Gratis, standar format | — |
| Data contoh prototipe | Panorama uji yang dipotret sendiri, atau panorama berlisensi CC0 | Prototipe tidak menunggu KKN | — |
| Analytics | Umami atau GA4 yang sama dengan portal | Event tur bisa dibandingkan dengan konversi paket | — |

## SOP pemotretan 360° di lapangan

Kualitas tur ditentukan saat memotret: arah kamera yang konsisten adalah satu-satunya cara agar panah maju-mundur tidak melenceng.

1. Survei jalur dan tandai titik foto di peta: tiap 3–5 m di jalur sempit, tiap 8–15 m di area terbuka.
2. Pasang kamera di monopod setinggi mata (±1,6 m), tegak lurus; operator menjauh atau memakai timer.
3. Hadapkan lensa depan kamera ke arah "maju" di jalur pada setiap titik; catat bila terpaksa berbeda.
4. Nyalakan GPS (lewat HP yang terhubung ke kamera) atau catat koordinat manual.
5. Potret pagi atau sore, hindari matahari tepat di atas kepala; aktifkan mode HDR.
6. Ambil dua foto per titik sebagai cadangan.
7. Beri nama file `[kode-tur]-[urutan]-[tanggal].jpg`.
8. Drone: satu panorama sferis per lokasi, hanya setelah cek cuaca, angin, izin pengelola, dan aturan terbang.
9. Minta orang menyingkir dari frame; tempat sakral hanya dipotret dengan izin adat.
10. Cadangkan foto setiap hari ke dua media berbeda.

## Plan prototipe high-fi

Prototipe dibangun dalam 8 minggu dengan satu lokasi uji, langsung di repo portal, sehingga di lapangan tim cukup memotret dan mengunggah 10 lokasi tanpa coding baru.

**Definisi high-fi di sini:** tampilan memakai warna dan tipografi portal, semua interaksi berjalan nyata di HP, dan datanya realistis (15–20 panorama contoh, minimal 1 scene drone, 5 hotspot). Yang belum perlu: data final 10 lokasi dan konten edukasi yang sudah divalidasi.

**Layar yang dibangun**

| Layar | Isi utama | Kebutuhan |
| --- | --- | --- |
| Halaman atraksi + preview | Badge 360°, thumbnail, tombol "Jelajahi 360°" | I1, V4 |
| Layar etika berkunjung | 3–5 aturan berikon, tombol "Mulai tur" | K3 |
| Viewer: scene udara | Panorama drone, poligon zona, tombol "Turun ke lokasi" | V3, K6 |
| Viewer: scene darat | Panah di lantai, strip thumbnail, tombol kembali, CTA paket | V1, V2, V6, I2 |
| Kartu hotspot | Bottom sheet berisi judul, isi, foto, sumber, label validasi | K1, K2, K5 |
| Fallback galeri | Foto datar + daftar hotspot sebagai teks | V5, K4 |
| Editor: daftar scene | Upload panorama, urutan, status tur | T1, T6 |
| Editor: panorama | Atur arah depan, taruh panah, taruh hotspot | T2–T4 |

**Struktur kode yang disarankan:** `src/features/tour/` (viewer, kartu hotspot, layar etika), `src/app/360/[slug]/` (halaman tur), `src/app/admin/tur/` (editor), `scripts/make-tiles.ts` (potong panorama), dan `data/tours/demo.json` sebagai data statis sebelum tabel Supabase siap.

&#91;embedded content: rencana prototipe · 6 fase, 3 gerbang\]

Setiap gerbang harus lolos sebelum fase berikutnya; bila Gerbang B belum lolos saat berangkat, tur dibuat tim KKN lewat JSON dan editor menyusul.

## Risiko dan pertanyaan terbuka

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Kamera 360° atau drone tidak tersedia | Tur tidak bisa dibuat | Sewa, pinjam lab, atau ajukan sponsor alat; cadangan: mode panorama HP untuk lokasi prioritas |
| Arah kamera tidak konsisten | Panah melenceng, wisatawan bingung | SOP poin 3 + fitur atur arah di editor (T2) |
| File terlalu berat | Portal lambat, wisatawan menutup tur | Tiles, preview kecil, dynamic import, uji 3G di setiap gerbang |
| Spot ekosistem rentan terekspos | Kerumunan dan kerusakan | Validasi mitra; spot tertentu sengaja tidak dibuat tur |
| Cuaca dan gelombang mengganggu jadwal | Kurang dari 10 lokasi terpotret | Jadwal cadangan; prioritaskan 5 lokasi utama dulu |
| Keberatan warga soal privasi | Tur ditolak atau harus diturunkan | Izin tertulis, blur, jalur permintaan hapus |
| Tidak ada yang merawat setelah KKN | Konten basi | Editor tanpa kode, pelatihan 2 operator, panduan PDF + video |

**Pertanyaan terbuka**

- [ ] Apa saja 10 tempat wisata final, dan di desa serta kecamatan mana?
- [ ] Kamera dan drone apa yang tersedia: beli, sewa, atau pinjam?
- [ ] Apakah Blue Alliance bersedia menjadi validator dan penyedia materi edukasi?
- [ ] Apakah tur juga diunggah ke Google Maps, dan akun siapa yang dipakai?
- [ ] Perlukah kartu edukasi berbahasa Inggris sejak awal untuk penyelam asing?
- [ ] Apakah tur bawah air masuk fase 2?

**Sumber**

- [Photo Sphere Viewer: VirtualTourPlugin](https://photo-sphere-viewer.js.org/plugins/virtual-tour)
- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [Blue Alliance di Banggai (For the Ocean)](https://for-the-ocean.org/?p=1553)
