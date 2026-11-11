import type { Reservasi } from "@/lib/types";

// Reservasi contoh untuk demo halaman status (Langkah 4 di desain).
// Buka /reservasi/RSV-2607-014 atau cek di /cek dengan WA 0812 4455 7801.
export const RESERVASI_CONTOH: Reservasi[] = [
  {
    kode: "RSV-2607-014",
    paketSlug: "snorkeling-bukit-2h1m",
    nama: "Rina Wulandari",
    wa: "6281244557801",
    email: "rina.w@gmail.com",
    tanggal: "2027-07-12",
    peserta: 6,
    anak: 2,
    addOns: ["sewa-snorkel"],
    homestayId: "rumah-ibu-nur",
    catatan: "Ada 2 anak (8 dan 10 tahun), satu peserta belum bisa berenang. Mohon siapkan pelampung ukuran anak.",
    rincian: [
      { label: "Paket · 6 × Rp650.000", nilai: 3900000 },
      { label: "Sewa alat snorkel · 6 × Rp50.000", nilai: 300000 },
    ],
    total: 4200000,
    status: "dp_diterima",
    riwayat: [
      { status: "menunggu", waktu: "2027-06-10T09:41:00+08:00" },
      { status: "dikonfirmasi", waktu: "2027-06-10T14:20:00+08:00" },
      { status: "dp_diterima", waktu: "2027-06-11T08:05:00+08:00" },
    ],
    dp: { nominal: 1260000, metode: "QRIS" },
    createdAt: "2027-06-10T09:41:00+08:00",
  },
];
