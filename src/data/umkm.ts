import type { Produk, UMKM } from "@/lib/types";

// DATA CONTOH. Produk dan UMKM riil diinput operator desa lewat dashboard.

export const UMKM_LIST: UMKM[] = [
  { slug: "mama-fitri", nama: "UMKM Mama Fitri", pemilik: "Ibu Fitriani", desa: "sambulangan", cerita: "Mulai mengolah abon dari tangkapan suami pada 2019. Kini dibantu empat ibu tetangga.", foto: "/images/avatar-mama-fitri.webp", unggulan: true },
  { slug: "kwt-mekar-sari", nama: "KWT Mekar Sari", pemilik: "Kelompok Wanita Tani", desa: "lolantang", cerita: "Mengolah ubi banggai dan mete dari kebun anggota menjadi camilan siap bawa.", foto: "/images/avatar-mekar-sari.webp", unggulan: true },
  { slug: "ud-laut-biru", nama: "UD Laut Biru", pemilik: "Pak Hasan Lamading", desa: "lumbi-lumbia", cerita: "Nelayan yang mengeringkan ikan dan cumi dengan para-para bambu di tepi pantai.", foto: "/images/avatar-laut-biru.webp", unggulan: true },
  { slug: "tani-aren-bulagi", nama: "Tani Aren Bulagi", pemilik: "Pak Darwis", desa: "bulagi-satu", cerita: "Menyadap aren dari kebun keluarga dan mencetaknya di batok kelapa." },
  { slug: "sanggar-anyam-liang", nama: "Sanggar Anyam Liang", pemilik: "Ibu Nurlela", desa: "liang", cerita: "Sanggar anyaman pandan yang melatih remaja putri di Liang." },
  { slug: "dapur-ibu-rahma", nama: "Dapur Ibu Rahma", pemilik: "Ibu Rahma", desa: "salakan", cerita: "Minyak kelapa kampung yang dimasak dengan tungku kayu." },
  { slug: "umkm-tabata-jaya", nama: "UMKM Tabata Jaya", pemilik: "Ibu Saida", desa: "tabata", cerita: "Kerupuk ikan dari tangkapan nelayan Tabata." },
  { slug: "dapur-sambiut", nama: "Dapur Sambiut", pemilik: "Ibu Wati", desa: "sambiut", cerita: "Sambal ikan teri resep keluarga." },
  { slug: "perajin-pesisir", nama: "Kelompok Perajin Pesisir", pemilik: "Ibu Hasna", desa: "lumbi-lumbia", cerita: "Tas dan tikar dari daun lontar." },
  { slug: "dapur-mama-ani", nama: "Dapur Mama Ani", pemilik: "Ibu Ani", desa: "lumbi-lumbia", cerita: "Kue bagea kelapa yang dipanggang di oven tanah liat." },
  { slug: "nelayan-liang-jaya", nama: "Nelayan Liang Jaya", pemilik: "Pak Udin", desa: "liang", cerita: "Cumi kering dari perairan Liang." },
];

export const PRODUK: Produk[] = [
  { slug: "abon-ikan-cakalang", nama: "Abon Ikan Cakalang", umkm: "mama-fitri", kategori: "olahan-ikan", harga: 45000, satuan: "250 g", tipe: "ready", foto: "/images/p-abon-cakalang.webp", terjual: 140 },
  { slug: "ikan-asin-jambal", nama: "Ikan Asin Jambal", umkm: "ud-laut-biru", kategori: "olahan-ikan", harga: 60000, satuan: "500 g", tipe: "ready", foto: "/images/p-ikan-asin-jambal.webp", terjual: 122 },
  { slug: "keripik-ubi-banggai", nama: "Keripik Ubi Banggai", umkm: "kwt-mekar-sari", kategori: "kuliner", harga: 20000, satuan: "200 g", tipe: "ready", foto: "/images/p-keripik-ubi.webp", terjual: 118 },
  { slug: "gula-aren-batok", nama: "Gula Aren Batok", umkm: "tani-aren-bulagi", kategori: "hasil-kebun", harga: 25000, satuan: "500 g", tipe: "preorder", leadTimeHari: 3, foto: "/images/p-gula-aren.webp", terjual: 95 },
  { slug: "tikar-anyaman-pandan", nama: "Tikar Anyaman Pandan", umkm: "sanggar-anyam-liang", kategori: "kerajinan", harga: 150000, satuan: "lembar", tipe: "preorder", leadTimeHari: 7, foto: "/images/p-tikar-pandan.webp", terjual: 40 },
  { slug: "minyak-kelapa-kampung", nama: "Minyak Kelapa Kampung", umkm: "dapur-ibu-rahma", kategori: "hasil-kebun", harga: 35000, satuan: "600 ml", tipe: "ready", foto: "/images/p-minyak-kelapa.webp", terjual: 77 },
  { slug: "kerupuk-ikan-tenggiri", nama: "Kerupuk Ikan Tenggiri", umkm: "umkm-tabata-jaya", kategori: "olahan-ikan", harga: 25000, satuan: "250 g", tipe: "ready", foto: "/images/p-kerupuk-tenggiri.webp", terjual: 88 },
  { slug: "sambal-ikan-teri", nama: "Sambal Ikan Teri", umkm: "dapur-sambiut", kategori: "kuliner", harga: 30000, satuan: "botol", tipe: "ready", foto: "/images/p-sambal-teri.webp", terjual: 101 },
  { slug: "tas-anyaman-lontar", nama: "Tas Anyaman Lontar", umkm: "perajin-pesisir", kategori: "kerajinan", harga: 120000, satuan: "pcs", tipe: "preorder", leadTimeHari: 5, foto: "/images/p-tas-lontar.webp", terjual: 55 },
  { slug: "kacang-mete-sangrai", nama: "Kacang Mete Sangrai", umkm: "kwt-mekar-sari", kategori: "hasil-kebun", harga: 55000, satuan: "250 g", tipe: "ready", foto: "/images/p-kacang-mete.webp", terjual: 83 },
  { slug: "dodol-ubi-banggai", nama: "Dodol Ubi Banggai", umkm: "mama-fitri", kategori: "kuliner", harga: 30000, satuan: "kotak", tipe: "preorder", leadTimeHari: 2, foto: "/images/p-dodol-ubi.webp", terjual: 61 },
  { slug: "cumi-kering", nama: "Cumi Kering", umkm: "nelayan-liang-jaya", kategori: "olahan-ikan", harga: 90000, satuan: "250 g", tipe: "ready", foto: "/images/p-cumi-kering.webp", terjual: 70 },
  { slug: "abon-ikan-tuna", nama: "Abon Ikan Tuna", umkm: "ud-laut-biru", kategori: "olahan-ikan", harga: 50000, satuan: "250 g", tipe: "ready", foto: "/images/p-abon-tuna.webp", terjual: 66 },
  { slug: "bagea-kelapa", nama: "Bagea Kelapa", umkm: "dapur-mama-ani", kategori: "kuliner", harga: 25000, satuan: "toples", tipe: "preorder", leadTimeHari: 2, foto: "/images/p-bagea-kelapa.webp", terjual: 48 },
  { slug: "ikan-asin-teri", nama: "Ikan Asin Teri", umkm: "ud-laut-biru", kategori: "olahan-ikan", harga: 40000, satuan: "250 g", tipe: "ready", foto: "/images/p-ikan-asin-jambal-2.webp", terjual: 44 },
  { slug: "tas-lontar-bundar", nama: "Tas Lontar Bundar", umkm: "perajin-pesisir", kategori: "kerajinan", harga: 135000, satuan: "pcs", tipe: "preorder", leadTimeHari: 5, foto: "/images/p-tas-lontar-2.webp", terjual: 21 },
];
