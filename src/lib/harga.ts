import type { AddOn, Paket } from "./types";
import { rupiah } from "./format";

export const jumlahMalam = (p: Paket) => Math.max(1, p.durasiHari - 1);

export function kaliAddOn(a: AddOn, p: Paket, peserta: number) {
  switch (a.satuan) {
    case "orang":
      return peserta;
    case "hari":
      return p.durasiHari;
    case "malam":
      return jumlahMalam(p);
    default:
      return 1;
  }
}

export const satuanLabel: Record<AddOn["satuan"], string> = {
  orang: "/orang",
  hari: "/hari",
  malam: "/malam",
  unit: "/unit",
};

/**
 * Kalkulator harga (B2): paket × peserta + add-on.
 * Hasilnya rincian baris + total; disalin ke reservasi saat dibuat.
 */
export function hitungHarga(p: Paket, peserta: number, addOnIds: string[]) {
  const rincian: { label: string; nilai: number }[] = [
    { label: `Paket · ${peserta} × ${rupiah(p.harga)}`, nilai: p.harga * peserta },
  ];
  for (const a of p.addOns) {
    if (!addOnIds.includes(a.id)) continue;
    const kali = kaliAddOn(a, p, peserta);
    rincian.push({ label: `${a.nama} · ${kali} × ${rupiah(a.harga)}`, nilai: a.harga * kali });
  }
  const total = rincian.reduce((s, r) => s + r.nilai, 0);
  return { rincian, total };
}

/** DP default 30% (kebijakan final menunggu musyawarah desa, lihat pertanyaan terbuka PRD). */
export const PERSEN_DP = 0.3;
