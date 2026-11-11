import type { Desa, Kecamatan } from "@/lib/types";

// Sumber: Lampiran PRD (BPS, Kabupaten Banggai Kepulauan Dalam Angka 2026,
// estimasi penduduk pertengahan 2025). Verifikasi ulang ke BPS sebelum rilis.
export const KECAMATAN: Kecamatan[] = [
  { slug: "buko", kode: "72.07.07", nama: "Buko", ibuKota: "Tabata", luasKm2: 184.84, penduduk: 10569, jumlahDesa: 13, jumlahPulau: 21, desaFokus: false },
  { slug: "buko-selatan", kode: "72.07.18", nama: "Buko Selatan", ibuKota: "Lumbi-Lumbia", luasKm2: 187.32, penduduk: 9301, jumlahDesa: 11, jumlahPulau: null, desaFokus: true },
  { slug: "bulagi", kode: "72.07.06", nama: "Bulagi", ibuKota: "Bulagi Satu", luasKm2: 275.66, penduduk: 9921, jumlahDesa: 16, jumlahPulau: 2, desaFokus: false },
  { slug: "bulagi-selatan", kode: "72.07.09", nama: "Bulagi Selatan", ibuKota: "Lolantang", luasKm2: 319.0, penduduk: 10813, jumlahDesa: 20, jumlahPulau: 8, desaFokus: true },
  { slug: "bulagi-utara", kode: "72.07.17", nama: "Bulagi Utara", ibuKota: "Sambulangan", luasKm2: 318.0, penduduk: 10260, jumlahDesa: 12, jumlahPulau: null, desaFokus: true },
  { slug: "liang", kode: "72.07.05", nama: "Liang", ibuKota: "Liang", luasKm2: 176.19, penduduk: 10602, jumlahDesa: 16, jumlahPulau: 65, desaFokus: false },
  { slug: "peling-tengah", kode: "72.07.16", nama: "Peling Tengah", ibuKota: "Patukuki", luasKm2: 140.0, penduduk: 11042, jumlahDesa: 11, jumlahPulau: null, desaFokus: false },
  { slug: "tinangkung", kode: "72.07.04", nama: "Tinangkung", ibuKota: "Salakan", luasKm2: 312.6, penduduk: 19529, jumlahDesa: 11, jumlahPulau: 52, desaFokus: false },
  { slug: "tinangkung-selatan", kode: "72.07.11", nama: "Tinangkung Selatan", ibuKota: "Mansamat", luasKm2: 187.89, penduduk: 8834, jumlahDesa: 9, jumlahPulau: null, desaFokus: false },
  { slug: "tinangkung-utara", kode: "72.07.19", nama: "Tinangkung Utara", ibuKota: "Batulombo", luasKm2: 136.65, penduduk: 9620, jumlahDesa: 6, jumlahPulau: null, desaFokus: false },
  { slug: "totikum", kode: "72.07.03", nama: "Totikum", ibuKota: "Sambiut", luasKm2: 155.45, penduduk: 11570, jumlahDesa: 11, jumlahPulau: 4, desaFokus: false },
  { slug: "totikum-selatan", kode: "72.07.15", nama: "Totikum Selatan", ibuKota: "Kalumbatan", luasKm2: 95.19, penduduk: 9621, jumlahDesa: 8, jumlahPulau: null, desaFokus: false },
];

// Nomor WhatsApp di bawah adalah PLACEHOLDER (awalan 62800 tidak dipakai operator)
// supaya tidak mengirim pesan ke orang sungguhan. Ganti dengan nomor pengelola desa.
const wa = (n: number) => [`628000000${String(n).padStart(4, "0")}`, `628000001${String(n).padStart(4, "0")}`];

// DATA CONTOH: desa fokus KKN + ibu kota kecamatan yang dirujuk paket/UMKM contoh.
// Lukpanenteng, Bungin, Bakalan, Buko, Leme-leme belum dimasukkan karena
// kecamatannya masih menunggu cek data Kemendagri (pertanyaan terbuka di PRD).
export const DESA: Desa[] = [
  {
    slug: "lumbi-lumbia",
    nama: "Lumbi-Lumbia",
    kecamatan: "buko-selatan",
    tipe: "desa",
    desaWisata: true,
    fokusKKN: true,
    pengelola: { nama: "Pokdarwis Lumbi-Lumbia", operator: "Pak Arman", wa: wa(1), terverifikasi: true },
  },
  {
    slug: "lolantang",
    nama: "Lolantang",
    kecamatan: "bulagi-selatan",
    tipe: "desa",
    desaWisata: true,
    fokusKKN: true,
    pengelola: { nama: "Pokdarwis Lolantang", operator: "Ibu Sarni", wa: wa(2), terverifikasi: true },
  },
  {
    slug: "sambulangan",
    nama: "Sambulangan",
    kecamatan: "bulagi-utara",
    tipe: "desa",
    desaWisata: true,
    fokusKKN: true,
    pengelola: { nama: "BUMDes Sambulangan", operator: "Pak Rudi", wa: wa(3), terverifikasi: true },
  },
  {
    slug: "bulagi-satu",
    nama: "Bulagi Satu",
    kecamatan: "bulagi",
    tipe: "desa",
    desaWisata: true,
    pengelola: { nama: "Pokdarwis Paisu Pok", operator: "Pak Yusran", wa: wa(4) },
  },
  {
    slug: "salakan",
    nama: "Salakan",
    kecamatan: "tinangkung",
    tipe: "kelurahan",
    pengelola: { nama: "Pokdarwis Salakan", operator: "Ibu Rahma", wa: wa(5) },
  },
  {
    slug: "liang",
    nama: "Liang",
    kecamatan: "liang",
    tipe: "desa",
    desaWisata: true,
    pengelola: { nama: "Pokdarwis Taman Laut Liang", operator: "Pak Hamid", wa: wa(6) },
  },
  {
    slug: "tabata",
    nama: "Tabata",
    kecamatan: "buko",
    tipe: "desa",
    pengelola: { nama: "BUMDes Tabata", operator: "Pak Salim", wa: wa(7) },
  },
  {
    slug: "sambiut",
    nama: "Sambiut",
    kecamatan: "totikum",
    tipe: "desa",
    pengelola: { nama: "Pokdarwis Sambiut", operator: "Ibu Wati", wa: wa(8) },
  },
  {
    slug: "batulombo",
    nama: "Batulombo",
    kecamatan: "tinangkung-utara",
    tipe: "desa",
    pengelola: { nama: "Pokdarwis Batulombo", operator: "Pak Anto", wa: wa(9) },
  },
  { slug: "patukuki", nama: "Patukuki", kecamatan: "peling-tengah", tipe: "desa" },
  { slug: "mansamat", nama: "Mansamat", kecamatan: "tinangkung-selatan", tipe: "desa" },
  { slug: "kalumbatan", nama: "Kalumbatan", kecamatan: "totikum-selatan", tipe: "desa" },
];
