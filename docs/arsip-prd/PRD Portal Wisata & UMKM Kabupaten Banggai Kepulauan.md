# PRD Portal Wisata & UMKM Kabupaten Banggai Kepulauan

Nov 10, 2026 · @Dharu Bintang

## Ringkasan & latar belakang

Kita membangun portal pariwisata dan UMKM tingkat Kabupaten Banggai Kepulauan: wisatawan menjelajah per kecamatan dan desa, memesan paket wisata, dan membeli produk UMKM di satu website. Flow reservasi dan pemesanan tetap mengikuti website Balantak Utara; yang baru adalah lapisan wilayah kabupaten → kecamatan → desa, lengkap dengan statistik dan peta GIS per kecamatan.

**Konteks wilayah.** Banggai Kepulauan beribu kota di Salakan dan sejak pemekaran Banggai Laut (2012) mencakup Pulau Peleng serta pulau-pulau kecil di sekitarnya. Wilayahnya terdiri dari 12 kecamatan, 141 desa, dan 3 kelurahan, dengan perkiraan penduduk 131.682 jiwa pada pertengahan 2025 ([Wikipedia, mengutip BPS](https://en.wikipedia.org/wiki/Banggai_Islands_Regency)). Perairannya adalah habitat endemik ikan capungan Banggai (Banggai cardinalfish), daya tarik khas untuk wisata bahari.

**Masalah (hipotesis, divalidasi saat survei).** Potensi wisata dan produk UMKM tersebar di 141 desa yang dipisahkan laut dan jarak antarkecamatan, tapi belum ada satu pintu yang menampilkan semuanya beserta cara memesan. Akibatnya wisatawan sulit merencanakan kunjungan, dan belanja ke homestay, pemandu, serta UMKM desa tidak terjadi.

**Referensi flow.** Struktur konten mengikuti website paket wisata Balantak Utara: profil → atraksi → homestay/paket → suvenir → kontak, serupa listing desa wisata di sana ([Jadesta](https://sulteng.jadesta.com/desa/lukapan_mr_conio)). Alur reservasi dan pesanan di bawah tidak berubah.

**Desa fokus KKN.** Konten lengkap pertama disiapkan untuk delapan desa: Sambulangan, Lukpanenteng, Bungin, Bakalan, Lumbi-Lumbia, Buko, Lolantang, dan Leme-leme. Tiga di antaranya adalah ibu kota kecamatan: Sambulangan (Bulagi Utara), Lolantang (Bulagi Selatan), dan Lumbi-Lumbia (Buko Selatan). Desa lainnya tampil dengan profil dasar dan dilengkapi bertahap.

**Asumsi PRD ini.**

- Portal dimiliki Pemerintah Kabupaten (mis. Dinas Pariwisata), dengan admin di tingkat kecamatan dan operator di tingkat desa.
- Pembayaran versi pertama tetap via WhatsApp pengelola lalu transfer/QRIS manual, tanpa payment gateway.
- Data wilayah awal (kecamatan, desa, statistik dasar) diambil dari BPS dan data batas administrasi resmi, lalu dilengkapi hasil survei KKN.

## Tujuan, non-goals, dan metrik

Sukses berarti wisatawan bisa menemukan dan memesan wisata di kecamatan mana pun dari satu portal, dan portal tetap hidup setelah tim KKN pulang.

**Tujuan**

1. Wisatawan bisa melihat dan memesan paket wisata (termasuk perahu, homestay, kuliner, pemandu) dalam satu alur.
2. UMKM desa punya etalase online dan bisa menerima pesanan, termasuk pre-order oleh-oleh untuk diambil saat kunjungan.
3. Pengelola desa bisa memperbarui paket, produk, harga, dan ketersediaan sendiri tanpa bantuan mahasiswa.
4. Tiap kecamatan punya halaman sendiri: tentang kecamatan, wisata, statistik, daftar desa, dan peta GIS.
5. Pemda kabupaten punya satu tampilan potensi wisata dan UMKM lintas 12 kecamatan.

**Non-goals versi pertama**

- Payment gateway, escrow, atau dompet digital terintegrasi.
- Pengiriman produk ke luar daerah dengan cek ongkir otomatis.
- Aplikasi mobile native dan multi-bahasa penuh (cukup Bahasa Indonesia, Inggris menyusul).
- Marketplace terbuka untuk penjual luar desa.
- Menggantikan website resmi pemda atau sistem informasi desa (SID); portal ini fokus wisata dan UMKM.
- Analisis spasial (buffer, overlay, routing); peta hanya untuk menampilkan dan menjelajah.

**Metrik keberhasilan** (diukur selama periode KKN dan 3 bulan setelahnya)

| Metrik | Target | Cara ukur |
| --- | --- | --- |
| Kecamatan dengan halaman tentang, statistik, daftar desa, dan peta batas | 12 dari 12 | Kelengkapan data di dashboard |
| Desa fokus KKN dengan profil, atraksi, dan UMKM lengkap | 8 dari 8 | Kelengkapan data di dashboard |
| Reservasi paket yang terkonfirmasi | ≥ 10 reservasi | Status reservasi di dashboard admin |
| UMKM aktif dengan ≥ 3 produk tayang | ≥ 8 UMKM | Data produk di dashboard |
| Pesanan produk UMKM | ≥ 30 pesanan | Status pesanan di dashboard |
| Konversi kunjungan halaman paket → klik reservasi | ≥ 5% | Analytics (Umami/GA4) |
| Konten diperbarui oleh admin kecamatan/desa, bukan mahasiswa | ≥ 1 pembaruan per bulan setelah KKN | Log aktivitas admin |
| Paket lintas desa yang tayang dan pernah dipesan | ≥ 2 paket, minimal 1 lintas kecamatan | Data paket dan reservasi di dashboard |

Target angka di atas adalah titik awal dan perlu dikalibrasi dengan data kunjungan saat observasi.

## Pengguna & persona

Ada lima peran; tiga peran pengelola dibuat berjenjang mengikuti wilayah, sehingga tiap orang hanya mengurus data di wilayahnya.

| Peran | Siapa | Kebutuhan utama | Batasan |
| --- | --- | --- | --- |
| Wisatawan | Wisatawan dari Luwuk, Palu, Makassar; penyelam; wisatawan asing | Memilih kecamatan/desa tujuan, tahu harga total sebelum berangkat, pesan paket dan oleh-oleh | Mengakses dari HP, sering sebelum berangkat |
| Pelaku UMKM | Pengolah hasil laut dan kebun, perajin, pemilik warung | Produk terlihat, pesanan masuk lewat WhatsApp | Literasi digital rendah; tidak wajib login |
| Operator desa | Pokdarwis / BUMDes / perangkat desa | Konfirmasi reservasi, atur paket, produk, dan profil desanya | Sinyal terbatas, pergantian pengurus |
| Admin kecamatan | Staf kantor camat atau koordinator Pokdarwis kecamatan | Isi halaman tentang dan statistik kecamatan, verifikasi konten desa | Waktu terbatas, bukan staf TI |
| Admin kabupaten | Dinas Pariwisata (dan tim KKN selama program) | Kelola akun, data wilayah dan peta, pantau seluruh kecamatan | Pemilik domain dan hosting jangka panjang |

**Prinsip desain dari persona:** semua aksi wisatawan berakhir di WhatsApp pengelola desa pemilik paket, UMKM tidak wajib login (operator desa yang menginput produk mereka), dan dashboard semua peran harus bisa dipakai penuh dari HP.

## User flow utama

Dua alur berjalan paralel dan bertemu di satu titik: reservasi yang sudah dikonfirmasi langsung ditawari oleh-oleh pre-order untuk diambil saat kunjungan.

&#91;embedded content: user flow · reservasi paket dan pesanan oleh-oleh\]

Website tidak memproses uang; ia mengumpulkan data rapi lalu menyerahkan transaksi ke WhatsApp pengelola. Contoh pesan otomatis yang dibuka tombol "Konfirmasi via WhatsApp":

```
Halo Pengelola Wisata, saya ingin konfirmasi reservasi.
Kode: RSV-2607-014
Paket: Snorkeling & Bukit 2H1M
Tanggal: 12 Juli 2027 | Peserta: 6 orang
Add-on: sewa alat snorkel (6)
Estimasi total: Rp4.200.000
Cek status: https://<domain>/reservasi/RSV-2607-014
```

Alur admin: pengelola membuka dashboard, mengubah status reservasi atau pesanan sesuai chat, dan wisatawan melihat status terbaru di halaman Cek Pesanan.

Karena portal mencakup 12 kecamatan, nomor WhatsApp tujuan diambil dari penyelenggara paket (desa, kecamatan, atau kabupaten) atau desa pemilik produk, bukan satu nomor kabupaten. Keranjang yang berisi produk dari beberapa desa dipecah menjadi satu pesanan per desa.

## Paket lintas desa

Satu paket boleh singgah di beberapa desa, bahkan lintas kecamatan; wisatawan tetap melihat satu harga, satu kode reservasi, dan satu nomor WhatsApp koordinator. Pembagian tugas dan uang ke tiap desa terjadi di belakang layar dan tercatat di dashboard.

**Siapa yang boleh membuat**

| Cakupan paket | Penyelenggara (koordinator) | Persetujuan |
| --- | --- | --- |
| Satu desa | Operator desa itu | Langsung tayang |
| Beberapa desa dalam satu kecamatan | Admin kecamatan atau desa koordinator yang ditunjuk | Tiap desa singgah menyetujui perannya dan harga komponennya |
| Lintas kecamatan | Admin kabupaten (Dinas Pariwisata) atau Pokdarwis yang ditunjuk | Tiap desa singgah menyetujui; admin kecamatan terkait mendapat notifikasi |

Status paket: Draf → Menunggu persetujuan desa → Tayang. Paket tidak tayang selama ada desa singgah yang belum setuju.

**Alur reservasi**

&#91;embedded content: reservasi paket lintas desa · 1 koordinator, 3 desa singgah\]

Sistem membuat satu alokasi per desa singgah berisi tanggal, jumlah peserta, dan komponen yang harus disiapkan. Operator desa menandai Siap atau Tidak bisa dari dashboard. Koordinator baru mengonfirmasi ke wisatawan setelah semua desa Siap, atau mengganti tanggal atau desa bila ada yang tidak bisa.

**Harga dan pembagian pendapatan**

Harga paket = jumlah harga komponen tiap desa + transport antardesa (perahu atau mobil) + fee koordinator (persentase disepakati, mis. 5–10%). Halaman paket menampilkan total, sedangkan dashboard menampilkan rincian per desa. DP diterima koordinator lalu dicatat pembagiannya per desa; versi pertama tidak mentransfer uang otomatis.

**Contoh struktur itinerary (ilustratif)**

| Hari | Desa singgah (kecamatan) | Komponen yang disiapkan desa | Perpindahan |
| --- | --- | --- | --- |
| 1 | Lumbi-Lumbia (Buko Selatan) | Penjemputan, atraksi unggulan desa, makan malam, homestay | — |
| 2 | Lolantang (Bulagi Selatan) | Pemandu lokal, atraksi unggulan desa, makan siang, homestay | Perahu/mobil dari Lumbi-Lumbia |
| 3 | Sambulangan (Bulagi Utara) | Atraksi pagi, pengambilan oleh-oleh pre-order, pengantaran pulang | Perahu/mobil dari Lolantang |

Aktivitas dan rute riil diisi dari hasil survei; urutan desa di atas hanya contoh bentuk data.

**Tampil di mana**

- Kartu paket muncul di tab Wisata setiap desa dan kecamatan yang dilewati, berlabel misalnya "Lintas 3 desa · 2 kecamatan".
- Halaman paket menampilkan itinerary per hari per desa dan peta rute antartitik singgah.
- Di halaman konfirmasi, wisatawan bisa pre-order oleh-oleh dari semua desa singgah dan mengambilnya di desa masing-masing sesuai hari kunjungan.

## Kebutuhan fungsional

MVP = semua baris **Must**; itulah yang harus jalan sebelum peluncuran di desa. Should dan Could dikerjakan bila waktu KKN tersisa.

### A. Profil & konten desa

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| A1 | Beranda dengan hero foto/video, ringkasan desa, CTA "Lihat Paket" dan "Belanja Oleh-oleh" | Must |
| A2 | Halaman profil per desa (sejarah, budaya, fasilitas, peta lokasi Google Maps) | Must |
| A3 | Daftar atraksi wisata (alam, budaya, bahari) dengan foto, deskripsi, dan tips | Must |
| A4 | Info cara menuju lokasi: rute dari kota terdekat, estimasi waktu, titik penjemputan perahu | Must |
| A5 | Galeri foto/video dan tautan media sosial desa | Should |
| A6 | Artikel/berita desa sederhana | Could |

### B. Paket wisata & reservasi

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| B1 | Katalog paket: nama, durasi, itinerary per hari, yang termasuk/tidak termasuk, harga per orang atau per grup, kapasitas minimum–maksimum | Must |
| B2 | Kalkulator harga di halaman paket: jumlah orang + tanggal + add-on (sewa alat snorkel, pemandu, makan) → total estimasi | Must |
| B3 | Form reservasi: nama, WhatsApp, email (opsional), tanggal, jumlah peserta, catatan, persetujuan syarat & ketentuan | Must |
| B4 | Setelah submit: kode reservasi + tombol "Konfirmasi via WhatsApp" yang membuka chat pengelola dengan pesan terisi otomatis | Must |
| B5 | Status reservasi: Menunggu konfirmasi → Dikonfirmasi → DP diterima → Selesai / Dibatalkan, bisa dicek wisatawan dengan kode reservasi + nomor WA | Must |
| B6 | Homestay sebagai item tersendiri atau add-on paket (harga per malam, kapasitas kamar, fasilitas) | Should |
| B7 | Blokir tanggal (cuaca buruk, perahu penuh, acara adat) yang ditampilkan di pemilih tanggal | Should |
| B8 | Upload bukti transfer/QRIS oleh wisatawan | Should |
| B9 | Ulasan dan rating setelah status Selesai | Could |

**Paket lintas desa** (detail di bagian Paket lintas desa)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| B10 | Paket bisa berisi beberapa desa singgah, masing-masing dengan hari ke-, urutan, komponen, dan harga komponennya | Must |
| B11 | Penyelenggara paket bertingkat: desa, kecamatan, atau kabupaten, sesuai cakupan desa singgah | Must |
| B12 | Persetujuan desa singgah sebelum paket tayang (Draf → Menunggu persetujuan → Tayang) | Must |
| B13 | Reservasi otomatis membuat alokasi per desa; operator desa menandai Siap / Tidak bisa | Must |
| B14 | Kartu paket tampil di tab Wisata semua desa dan kecamatan yang dilewati, dengan label jumlah desa/kecamatan | Must |
| B15 | Rincian harga per desa + fee koordinator di dashboard, dan rekap pembagian DP per desa | Should |
| B16 | Peta rute antartitik singgah di halaman paket | Should |
| B17 | Paket kustom: wisatawan memilih sendiri kombinasi desa dari daftar komponen yang tersedia | Could |

### C. Produk UMKM

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| C1 | Katalog produk per kategori (olahan ikan, kuliner, kerajinan, hasil kebun) dengan foto, harga, stok/status ready vs pre-order | Must |
| C2 | Profil UMKM: nama usaha, pemilik, cerita singkat, desa, daftar produknya | Must |
| C3 | Keranjang sederhana lintas UMKM, lalu checkout menjadi pesanan dengan kode pesanan | Must |
| C4 | Metode penerimaan: ambil di desa saat kunjungan (terhubung ke kode reservasi) atau kirim (ongkir dikonfirmasi manual oleh pengelola) | Must |
| C5 | Notifikasi WhatsApp ke pengelola berisi rincian pesanan, dipecah per UMKM supaya mudah diteruskan | Must |
| C6 | Rekomendasi "Bawa pulang oleh-oleh" di halaman konfirmasi reservasi paket (cross-sell) | Should |
| C7 | Rekap penjualan per UMKM per bulan | Should |

### D. Dashboard pengelola

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| D1 | Login pengelola (email + password) dengan tiga peran berjenjang: Admin kabupaten, Admin kecamatan, Operator desa; tiap peran hanya bisa mengubah data di wilayahnya | Must |
| D2 | CRUD paket, atraksi, homestay, produk, UMKM, termasuk upload foto yang dikompresi otomatis | Must |
| D3 | Daftar reservasi dan pesanan dengan filter status/tanggal; ubah status dengan satu ketukan | Must |
| D4 | Kalender ketersediaan (tanggal terisi, tanggal diblokir) | Should |
| D5 | Ekspor CSV reservasi/pesanan untuk laporan BUMDes | Should |
| D6 | Log aktivitas admin | Could |

### E. Wilayah: kabupaten, kecamatan, desa

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| E1 | Navbar utama punya menu **Kecamatan** dengan dropdown 12 kecamatan, urut abjad; di HP tampil sebagai daftar yang bisa digulir | Must |
| E2 | Halaman kecamatan punya sub-navbar sendiri: Tentang, Wisata, Statistik, Desa, Peta; sub-navbar menempel (sticky) saat digulir | Must |
| E3 | **Tentang**: sejarah singkat, ibu kota kecamatan, cara menuju (dari Salakan/Luwuk), kontak kantor camat, foto sampul | Must |
| E4 | **Wisata**: atraksi, paket, dan homestay yang berada di kecamatan tersebut, memakai kartu dan alur reservasi yang sama dengan modul B | Must |
| E5 | **Statistik**: kartu angka (luas, penduduk, jumlah desa/kelurahan, jumlah pulau, jumlah UMKM, jumlah atraksi) + grafik sederhana, tiap angka mencantumkan tahun dan sumber | Must |
| E6 | **Desa**: daftar desa dan kelurahan berupa kartu (nama, foto, jumlah atraksi/UMKM, label "Desa wisata" bila ada), dengan pencarian | Must |
| E7 | Halaman desa: profil, atraksi, homestay, paket, UMKM, kontak operator, lokasi di peta | Must |
| E8 | Breadcrumb Beranda › Kecamatan › Desa di semua halaman wilayah | Should |
| E9 | Statistik tingkat kabupaten yang merangkum 12 kecamatan, bisa dibandingkan antarkecamatan | Should |
| E10 | Statistik pariwisata hasil sistem sendiri (jumlah reservasi, pesanan, wisatawan per kecamatan per bulan) | Could |

### F. Peta GIS

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| F1 | Menu **Peta** di sub-navbar tiap kecamatan: peta interaktif dengan batas kecamatan dan batas desa | Must |
| F2 | Layer titik: atraksi wisata, homestay, UMKM, dermaga/pelabuhan, bisa dinyalakan dan dimatikan | Must |
| F3 | Klik poligon desa atau titik membuka kartu ringkas dengan tautan ke halaman detail | Must |
| F4 | Basemap jalan dan citra satelit, bisa dipilih pengguna | Should |
| F5 | Peta tingkat kabupaten (menu Peta di navbar utama) yang menampilkan 12 kecamatan; klik kecamatan menuju halamannya | Should |
| F6 | Admin menambah titik dengan menaruh pin di peta atau memakai lokasi HP saat survei | Should |
| F7 | Admin kabupaten bisa unggah atau ganti layer GeoJSON (mis. batas desa terbaru, zona konservasi) | Should |
| F8 | Layer tematik: zona konservasi laut, titik selam, jalur perahu | Could |
| F9 | Unduh peta kecamatan sebagai gambar/PDF untuk dicetak | Could |

## Struktur halaman & navigasi

Navbar utama berisi enam menu: Beranda, Kecamatan ▾, Wisata, Oleh-oleh, Peta, Cek Pesanan. Menu Kecamatan adalah pintu utama; setiap kecamatan punya sub-navbar Tentang, Wisata, Statistik, Desa, dan Peta GIS.

&#91;embedded content: navigasi · navbar kabupaten, dropdown kecamatan, sub-navbar kecamatan\]

Wisata, Oleh-oleh, dan Peta di navbar utama menampilkan gabungan 12 kecamatan dengan filter kecamatan; isi tab Wisata di halaman kecamatan adalah data yang sama, sudah tersaring. Alur reservasi dan pesanan dari bagian User flow dipakai apa adanya di semua level.

| Halaman | URL | Isi utama |
| --- | --- | --- |
| Beranda kabupaten | `/` | Hero Banggai Kepulauan, peta mini 12 kecamatan, highlight paket dan UMKM lintas kecamatan, CTA WhatsApp |
| Daftar kecamatan | `/kecamatan` | Kartu 12 kecamatan (ibu kota, jumlah desa, jumlah atraksi) |
| Kecamatan · Tentang | `/kecamatan/[kec]` | Tab bawaan: sejarah, ibu kota, cara menuju, kontak kantor camat |
| Kecamatan · Wisata | `/kecamatan/[kec]/wisata` | Atraksi, paket, homestay di kecamatan itu |
| Kecamatan · Statistik | `/kecamatan/[kec]/statistik` | Kartu angka + grafik, tahun dan sumber per angka |
| Kecamatan · Desa | `/kecamatan/[kec]/desa` | Kartu desa dan kelurahan, pencarian |
| Kecamatan · Peta | `/kecamatan/[kec]/peta` | Peta GIS batas desa + layer titik |
| Halaman desa | `/kecamatan/[kec]/desa/[desa]` | Profil, atraksi, homestay, paket, UMKM, kontak operator, lokasi |
| Wisata (kabupaten) | `/wisata`, `/paket/[slug]` | Semua atraksi dan paket, filter kecamatan; detail paket + kalkulator harga |
| Reservasi & konfirmasi | `/paket/[slug]/reservasi`, `/reservasi/[kode]` | Form B3, kode, status, tombol WhatsApp, rekomendasi oleh-oleh |
| Oleh-oleh | `/produk`, `/produk/[slug]`, `/umkm/[slug]` | Katalog per kategori dan kecamatan, profil UMKM |
| Keranjang | `/keranjang` | Item dikelompokkan per desa, ambil di desa / kirim |
| Peta (kabupaten) | `/peta` | 12 kecamatan; klik kecamatan menuju halamannya |
| Cek pesanan | `/cek` | Kode + nomor WA → status reservasi atau pesanan |
| Info & bantuan | `/info` | Cara pemesanan, syarat, pembatalan, FAQ cuaca dan musim |
| Dashboard | `/admin/*` | Menu tampil sesuai peran: kabupaten, kecamatan, atau desa |

## Model data inti

Semua konten digantungkan pada hierarki `Kecamatan` → `Desa`, sehingga halaman kecamatan, statistik, peta, dan hak akses admin bisa diturunkan dari satu kolom wilayah.

| Entitas | Field utama | Relasi |
| --- | --- | --- |
| `Kecamatan` | id, kode\_kemendagri (mis. 72.07.18), nama, slug, ibu\_kota, deskripsi, cara\_menuju, kontak, foto\_sampul, geom (MultiPolygon) | punya banyak Desa, Statistik, LayerPeta |
| `Desa` | id, kecamatan\_id, kode\_kemendagri, nama, slug, tipe (desa/kelurahan), deskripsi, kontak\_wa, foto, geom (MultiPolygon), titik\_pusat | punya banyak Atraksi, UMKM, Homestay; disinggahi banyak Paket |
| `Statistik` | id, kecamatan\_id, desa\_id (opsional), indikator (penduduk, luas\_km2, jumlah\_pulau, …), tahun, nilai, satuan, sumber | milik Kecamatan atau Desa |
| `LayerPeta` | id, kecamatan\_id (opsional = tingkat kabupaten), nama, tipe (poligon/garis/titik), geojson\_url, style, urutan, aktif\_default | ditampilkan di menu Peta |
| `Atraksi` | id, desa\_id, nama, kategori (alam/budaya/bahari), deskripsi, foto\[\], lokasi (Point) | dirujuk oleh Paket |
| `Paket` | id, penyelenggara\_tipe (desa/kecamatan/kabupaten), penyelenggara\_id, nama, slug, durasi\_hari, itinerary (JSON), termasuk\[\], tidak\_termasuk\[\], tipe\_harga, harga, min\_peserta, max\_peserta, aktif | banyak PaketSinggah, Atraksi, AddOn |
| PaketSinggah | id, paket\_id, desa\_id, hari\_ke, urutan, komponen\[\], harga\_komponen, status\_persetujuan (menunggu/setuju/tolak) | menghubungkan Paket dan Desa (banyak ke banyak) |
| `AddOn` | id, nama, harga, satuan (per orang/per hari/per unit) | milik Paket atau global |
| `Homestay` | id, desa\_id, nama, harga\_per\_malam, kapasitas, fasilitas\[\], lokasi (Point) | bisa dipilih di Reservasi |
| `Reservasi` | id, kode, paket\_id, nama, no\_wa, email, tanggal, jumlah\_peserta, addon\[\], total\_estimasi, status, bukti\_bayar\_url, catatan, created\_at | bisa terhubung ke banyak Pesanan |
| AlokasiReservasi | id, reservasi\_id, paket\_singgah\_id, desa\_id, tanggal, jumlah\_peserta, nominal\_bagian, status (menunggu/siap/tidak\_bisa), catatan | satu per desa singgah per reservasi |
| `UMKM` | id, desa\_id, nama\_usaha, nama\_pemilik, no\_wa, cerita, foto, lokasi (Point) | punya banyak Produk |
| `Produk` | id, umkm\_id, nama, kategori, harga, satuan, stok, tipe (ready/pre-order), lead\_time\_hari, foto\[\], aktif | — |
| `Pesanan` | id, kode, desa\_id, nama, no\_wa, item\[\] (produk\_id, qty, harga), metode (ambil/kirim), reservasi\_id (opsional), ongkir, total, status, created\_at | satu pesanan per desa |
| `Pengguna` | id, nama, email, password\_hash, peran (admin\_kabupaten/admin\_kecamatan/operator\_desa), kecamatan\_id, desa\_id | lingkup akses mengikuti wilayah |

Harga di item `Pesanan` dan `Reservasi` disalin saat transaksi, supaya perubahan harga kemudian tidak mengubah tagihan lama. Kolom `geom` dan `lokasi` disimpan di PostGIS dan dikirim ke peta sebagai GeoJSON yang sudah disederhanakan.

## Kebutuhan non-fungsional

Kendala terbesar bukan fitur, tapi sinyal lemah di lokasi dan pengelola yang tidak teknis.

- **Ringan di jaringan lambat:** halaman publik < 1 MB pada muatan pertama, gambar WebP dengan lazy-load, LCP < 3 detik di 3G. Halaman publik dirender statis/ISR.
- **Mobile-first:** semua alur wisatawan dan dashboard pengelola bisa diselesaikan di layar 360 px dengan satu tangan.
- **Tahan sinyal putus di dashboard:** form simpan draf lokal; upload foto bisa diulang tanpa mengisi ulang form.
- **Biaya operasional rendah:** total di bawah Rp300 ribu per tahun (praktis hanya domain), memakai free tier hosting dan database.
- **Keamanan dasar:** HTTPS, password di-hash, rate limit dan captcha ringan di form reservasi/pesanan untuk mencegah spam, nomor WA pemesan tidak tampil publik.
- **Privasi:** data pemesan hanya untuk proses transaksi; ada kebijakan privasi singkat; data reservasi lama (> 12 bulan) bisa dihapus.
- **Keberlanjutan:** akun admin atas nama lembaga desa (bukan pribadi mahasiswa), domain dan hosting didaftarkan atas nama desa/BUMDes, panduan pengelola dalam bentuk PDF + video singkat, minimal 2 operator desa dilatih.
- **SEO lokal:** meta tag dan Open Graph per paket/produk, sitemap.xml, profil Google Business untuk desa wisata.

Tambahan untuk peta dan skala kabupaten:

- **Peta tetap ringan:** GeoJSON batas desa per kecamatan disederhanakan hingga < 300 KB; peta baru dimuat saat tab Peta dibuka, bukan di setiap halaman kecamatan.
- **Peta tetap berguna saat sinyal hilang:** halaman Peta menampilkan gambar statis peta kecamatan sebagai cadangan bila tile basemap gagal dimuat.
- **Data wilayah konsisten:** kode wilayah mengikuti kode Kemendagri; nama dan batas desa satu sumber untuk halaman, statistik, dan peta.
- **Statistik jujur:** setiap angka menampilkan tahun dan sumber; angka lebih dari 2 tahun ditandai "perlu diperbarui".

## Rekomendasi tech stack

Pilih stack yang bisa di-hosting gratis dan dirawat tanpa server sendiri; tim KKN tidak akan ada untuk mengurus VPS.

| Lapisan | Rekomendasi | Alasan | Alternatif |
| --- | --- | --- | --- |
| Frontend + backend | Next.js (App Router) + TypeScript | Halaman publik statis/ISR yang cepat, rute dinamis `/kecamatan/[slug]`, API route untuk form dalam satu repo | Astro + API terpisah |
| Database & auth | Supabase (Postgres + PostGIS + Auth + Storage) | PostGIS untuk batas wilayah dan titik; Row Level Security untuk membatasi admin per kecamatan/desa | Neon + PostGIS + Auth.js |
| Peta | MapLibre GL JS (atau Leaflet) + basemap OpenStreetMap | Gratis, ringan, mendukung layer GeoJSON yang bisa dinyalakan/dimatikan | Mapbox (berbayar di atas kuota) |
| Data batas wilayah | Batas administrasi dari Badan Informasi Geospasial (Ina-Geoportal), disederhanakan dengan mapshaper | Sumber resmi, bisa dipakai ulang oleh pemda | Peta desa partisipatif hasil survei |
| Data statistik | Publikasi BPS Kabupaten Banggai Kepulauan (Dalam Angka, Kecamatan Dalam Angka) diinput ke tabel `Statistik` | Sumber resmi per kecamatan | Data profil desa (Prodeskel) |
| Grafik | Recharts atau Chart.js | Grafik statistik sederhana di halaman kecamatan | — |
| Penyimpanan foto | Supabase Storage / Cloudinary free | Transformasi dan kompresi gambar otomatis | — |
| Hosting | Vercel (Hobby), lalu akun atas nama pemda | Deploy dari GitHub, HTTPS otomatis | Netlify, Cloudflare Pages |
| Notifikasi | Tautan `wa.me` dengan pesan terisi otomatis | Tanpa biaya API dan tanpa verifikasi bisnis | WhatsApp Cloud API (fase 2) |
| Analytics | Umami atau GA4 | Mengukur konversi halaman paket dan kunjungan per kecamatan | Plausible |
| CI/CD | GitHub Actions: lint, typecheck, build preview per PR | Mencegah rilis rusak saat tim berganti | — |

Catatan: perhatikan batas free tier Supabase (project bisa di-pause jika tidak aktif). Siapkan cron ringan atau upgrade bila desa mulai aktif menerima transaksi.

## Rencana rilis, risiko, dan pertanyaan terbuka

MVP dibangun sebelum berangkat, sehingga waktu di lokasi dipakai untuk konten, uji coba, dan pelatihan, bukan coding.

&#91;embedded content: rencana rilis · 4 fase, 3 gerbang\]

Tiap gerbang harus lolos sebelum fase berikutnya; bila MVP belum jalan di HP saat berangkat, fitur Should ditunda dan fokus ke katalog + reservasi.

**Risiko**

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Konten 12 kecamatan tidak terisi; hanya desa KKN yang lengkap | Portal terlihat kosong di luar lokasi KKN | Isi minimum otomatis dari BPS + batas wilayah untuk semua kecamatan; tampilkan "segera hadir" untuk wisata yang belum ada |
| Pengelola tidak merespons WhatsApp dengan cepat | Wisatawan batal, kepercayaan turun | Dua nomor WA per desa, template balasan cepat, SLA balasan ≤ 24 jam di halaman Info |
| Kepemilikan portal tidak jelas antara KKN dan pemda | Domain/hosting kedaluwarsa, portal mati | MoU atau surat serah terima dengan Dinas Pariwisata; domain dan akun atas nama pemda |
| Data batas desa tidak tersedia atau tidak sesuai kondisi lapangan | Peta menyesatkan, keberatan dari desa | Pakai batas resmi BIG, tandai "indikatif", koreksi lewat verifikasi admin kecamatan |
| Statistik usang | Angka di portal dipertanyakan | Tampilkan tahun dan sumber, label "perlu diperbarui", pengingat tahunan saat BPS rilis Dalam Angka |
| Harga perahu dan paket berubah musiman | Estimasi harga salah | Label "estimasi", harga final dikonfirmasi pengelola, harga mudah diubah di dashboard |
| Cuaca/gelombang membatalkan perjalanan | Refund dan komplain | Kebijakan pembatalan dan reschedule yang jelas, fitur blokir tanggal |
| Konflik pembagian pendapatan antar pihak | Program ditolak warga | Sepakati skema bagi hasil dan fee pengelola di musyawarah desa sebelum peluncuran |

**Pertanyaan terbuka**

- [ ] Apakah Dinas Pariwisata Banggai Kepulauan bersedia menjadi pemilik portal, atau portal dikelola dulu oleh desa/BUMDes?
- [ ] Bagaimana portal ini ditautkan dengan website resmi pemda (banggaikep.go.id) dan website desa yang sudah ada?
- [ ] Lima desa fokus KKN lainnya (Lukpanenteng, Bungin, Bakalan, Buko, Leme-leme) masuk kecamatan apa? Perlu dicek ke data Kemendagri sebelum input.
- [ ] Apakah batas desa resmi tersedia untuk seluruh 141 desa, atau sebagian perlu dipetakan saat KKN?
- [ ] Berapa besar DP dan bagaimana kebijakan refund jika batal karena cuaca?
- [ ] Apakah ada fee pengelola dari tiap reservasi atau pesanan UMKM?
- [ ] Perlukah versi Bahasa Inggris sejak awal untuk wisatawan asing dan penyelam?
- [ ] Untuk paket lintas desa: siapa koordinator default, berapa fee koordinator, dan bagaimana DP diteruskan ke tiap desa (transfer koordinator atau lewat BUMDes)?

## Lampiran: data awal 12 kecamatan

Data ini menjadi isi awal dropdown Kecamatan dan tabel `Kecamatan`/`Statistik`; angka penduduk adalah estimasi pertengahan 2025.

| Kecamatan | Kode | Ibu kota | Luas (km²) | Penduduk 2025 | Desa/kel. | Pulau |
| --- | --- | --- | --- | --- | --- | --- |
| Buko | 72.07.07 | Tabata | 184,84 | 10.569 | 13 | 21 |
| Buko Selatan | 72.07.18 | Lumbi-Lumbia | 187,32 | 9.301 | 11 | — |
| Bulagi | 72.07.06 | Bulagi Satu | 275,66 | 9.921 | 16 | 2 |
| Bulagi Selatan | 72.07.09 | Lolantang | 319,00 | 10.813 | 20 | 8 |
| Bulagi Utara | 72.07.17 | Sambulangan | 318,00 | 10.260 | 12 | — |
| Liang | 72.07.05 | Liang | 176,19 | 10.602 | 16 | 65 |
| Peling Tengah | 72.07.16 | Patukuki | 140,00 | 11.042 | 11 | — |
| Tinangkung | 72.07.04 | Salakan | 312,60 | 19.529 | 11 | 52 |
| Tinangkung Selatan | 72.07.11 | Mansamat | 187,89 | 8.834 | 9 | — |
| Tinangkung Utara | 72.07.19 | Batulombo | 136,65 | 9.620 | 6 | — |
| Totikum | 72.07.03 | Sambiut | 155,45 | 11.570 | 11 | 4 |
| Totikum Selatan | 72.07.15 | Kalumbatan | 95,19 | 9.621 | 8 | — |

Sumber: [Banggai Islands Regency, Wikipedia](https://en.wikipedia.org/wiki/Banggai_Islands_Regency), mengutip BPS, Kabupaten Banggai Kepulauan Dalam Angka 2026. Verifikasi ulang ke [BPS Banggai Kepulauan](https://bangkepkab.bps.go.id) sebelum diinput.

## Sumber

- [Banggai Islands Regency — Wikipedia](https://en.wikipedia.org/wiki/Banggai_Islands_Regency)
- [Desa Wisata Lukapan Mr. Conio — Jadesta](https://sulteng.jadesta.com/desa/lukapan_mr_conio) (referensi flow Balantak Utara)
