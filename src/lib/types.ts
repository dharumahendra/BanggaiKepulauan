// Tipe data mengikuti bagian "Model data inti" di PRD.
// Saat pindah ke Supabase, tipe ini menjadi bentuk baris hasil query.

export type Kecamatan = {
  slug: string;
  kode: string; // kode Kemendagri, mis. 72.07.18
  nama: string;
  ibuKota: string;
  luasKm2: number;
  penduduk: number; // estimasi pertengahan 2025
  jumlahDesa: number; // desa + kelurahan
  jumlahPulau: number | null;
  desaFokus: boolean;
};

export type Desa = {
  slug: string;
  nama: string;
  kecamatan: string; // slug kecamatan
  tipe: "desa" | "kelurahan";
  desaWisata?: boolean;
  fokusKKN?: boolean;
  pengelola?: {
    nama: string; // mis. Pokdarwis Lumbi-Lumbia
    operator: string;
    wa: string[]; // format 62xxxxxxxxxx, minimal dua nomor (lihat PRD: risiko respons WA)
    terverifikasi?: boolean;
  };
};

export type KategoriWisata = "bahari" | "alam" | "budaya";

/** Destinasi wisata (tabel `atraksi`). Di UI disebut "destinasi"; satu destinasi = satu artikel + maks. satu tur 360°. */
export type Atraksi = {
  slug: string;
  nama: string;
  desa: string;
  kategori: KategoriWisata;
  tag?: string[]; // chip tambahan, mis. "Telaga"
  ringkasan?: string; // cuplikan satu kalimat di kartu
  foto?: string; // foto sampul
  unggulan?: boolean;
  statusArtikel?: "draf" | "ditinjau" | "tayang"; // kosong = baru kartu minimal
  artikel?: { judul: string; paragraf: string[] }[];
  aktivitas?: string[];
  tips?: string[];
  etika?: string[];
  info?: {
    akses: string; // ringkas, mis. "Perahu 40 mnt"
    caraMenuju: string;
    titikJemput?: string;
    estimasiWaktu?: string;
    waktuTerbaik: string; // ringkas, mis. "Pagi"
    waktuTerbaikDetail?: string;
    tiket: string; // mis. "Rp10.000"
    fasilitas: string[];
  };
  galeri?: string[];
};

export type SatuanAddOn = "orang" | "hari" | "malam" | "unit";

export type AddOn = {
  id: string;
  nama: string;
  harga: number;
  satuan: SatuanAddOn;
};

export type HomestayOpsi = {
  id: string;
  nama: string;
  keterangan: string;
  addOnId?: string; // memilih homestay ini otomatis menyalakan add-on tsb.
};

export type HariItinerary = {
  judul: string;
  desa?: string; // untuk paket lintas desa
  kegiatan: { jam: string; teks: string }[];
};

export type LangkahRute = {
  ikon: "pesawat" | "kapal" | "mobil" | "jangkar";
  judul: string;
  keterangan: string;
};

export type Paket = {
  slug: string;
  nama: string;
  kategori: KategoriWisata;
  penyelenggara: { tipe: "desa" | "kecamatan" | "kabupaten"; desa?: string; nama: string };
  singgah: { desa: string; hariKe: number; atraksi?: string[] }[]; // urutan desa singgah + destinasi yang dikunjungi
  durasiHari: number;
  durasiLabel: string;
  minPeserta: number;
  maxPeserta: number;
  harga: number; // per orang
  ringkasan: string;
  sorotan: { ikon: "ikan" | "bukit" | "rumah" | "makan" | "perahu" | "budaya" | "hutan"; label: string }[];
  itinerary: HariItinerary[];
  termasuk: string[];
  tidakTermasuk: string[];
  addOns: AddOn[];
  homestay?: HomestayOpsi[];
  rute: LangkahRute[];
  titikKumpul: string;
  bahasa: string;
  rating?: { nilai: number; ulasan: number };
  cover: string;
  galeri: string[];
  dipesan: number; // untuk urutan "Paling banyak dipesan"
};

export type KategoriProduk = "olahan-ikan" | "kuliner" | "kerajinan" | "hasil-kebun";

export type UMKM = {
  slug: string;
  nama: string;
  pemilik: string;
  desa: string;
  cerita: string;
  foto?: string;
  unggulan?: boolean;
};

export type Produk = {
  slug: string;
  nama: string;
  umkm: string;
  kategori: KategoriProduk;
  harga: number;
  satuan: string;
  tipe: "ready" | "preorder";
  leadTimeHari?: number;
  foto: string;
  terjual: number;
};

export type StatusReservasi = "menunggu" | "dikonfirmasi" | "dp_diterima" | "selesai" | "dibatalkan";

export type Reservasi = {
  kode: string;
  paketSlug: string;
  nama: string;
  wa: string;
  email?: string;
  tanggal: string; // YYYY-MM-DD
  peserta: number;
  anak: number;
  addOns: string[];
  homestayId?: string;
  catatan?: string;
  rincian: { label: string; nilai: number }[];
  total: number; // harga disalin saat transaksi
  status: StatusReservasi;
  riwayat: { status: StatusReservasi; waktu: string }[];
  dp?: { nominal: number; metode: string };
  buktiBayar?: string;
  createdAt: string;
};

export type StatusPesanan = "menunggu" | "dikonfirmasi" | "siap" | "selesai" | "dibatalkan";

export type Pesanan = {
  kode: string;
  desa: string;
  nama: string;
  wa: string;
  item: { produk: string; qty: number; harga: number }[];
  metode: "ambil" | "kirim";
  reservasiKode?: string;
  alamat?: string;
  total: number;
  status: StatusPesanan;
  createdAt: string;
};
