import { SITE } from "./site";
import { rupiah, tanggalSedang } from "./format";
import type { Paket, Pesanan, Reservasi } from "./types";

export const waLink = (nomor: string, pesan?: string) =>
  `https://wa.me/${nomor}${pesan ? `?text=${encodeURIComponent(pesan)}` : ""}`;

export const urlStatus = (kode: string) => `https://${SITE.domain}/reservasi/${kode}`;

/** Pesan otomatis tombol "Konfirmasi via WhatsApp" (format sesuai PRD). */
export function pesanReservasi(r: Reservasi, p: Paket): string {
  const addOn = p.addOns
    .filter((a) => r.addOns.includes(a.id))
    .map((a) => (a.satuan === "orang" ? `${a.nama.toLowerCase()} (${r.peserta})` : a.nama.toLowerCase()));
  return [
    "Halo Pengelola Wisata, saya ingin konfirmasi reservasi.",
    `Kode: ${r.kode}`,
    `Paket: ${p.nama}`,
    `Tanggal: ${tanggalSedang(r.tanggal)} | Peserta: ${r.peserta} orang`,
    addOn.length ? `Add-on: ${addOn.join(", ")}` : null,
    `Estimasi total: ${rupiah(r.total)}`,
    `Cek status: ${urlStatus(r.kode)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function pesanPesanan(o: Pesanan, namaProduk: (slug: string) => string): string {
  return [
    "Halo Pengelola Desa, saya ingin memesan oleh-oleh.",
    `Kode: ${o.kode}`,
    ...o.item.map((i) => `- ${namaProduk(i.produk)} × ${i.qty} = ${rupiah(i.harga * i.qty)}`),
    `Total: ${rupiah(o.total)}${o.metode === "kirim" ? " (belum termasuk ongkir)" : ""}`,
    o.metode === "ambil"
      ? `Diambil di desa${o.reservasiKode ? ` saat kunjungan (reservasi ${o.reservasiKode})` : ""}`
      : `Dikirim ke: ${o.alamat ?? "-"}`,
    `Atas nama: ${o.nama}`,
  ].join("\n");
}
