import type { Paket } from "./types";
import { isoTanggal, parseTanggal, tambahHari } from "./format";

export type StatusSlot = "tersedia" | "sedikit" | "penuh" | "diblokir";

export type Slot = { tanggal: string; status: StatusSlot; sisa: number; alasan?: string };

// Blokir tanggal (B7) — nanti dari tabel blokir_tanggal di dashboard.
export const TANGGAL_DIBLOKIR: { tanggal: string; alasan: string; paket?: string }[] = [];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Ketersediaan per tanggal. SEMENTARA dihitung deterministik dari tanggal
 * (contoh data) sampai tabel reservasi & blokir tanggal di Supabase siap.
 */
export function slotPaket(p: Paket, tanggal: string): Slot {
  const blok = TANGGAL_DIBLOKIR.find((b) => b.tanggal === tanggal && (!b.paket || b.paket === p.slug));
  if (blok) return { tanggal, status: "diblokir", sisa: 0, alasan: blok.alasan };
  const h = hash(`${p.slug}:${tanggal}`);
  if (h % 13 === 0) return { tanggal, status: "diblokir", sisa: 0, alasan: "Cuaca" };
  if (h % 9 === 0) return { tanggal, status: "penuh", sisa: 0 };
  if (h % 4 === 0) {
    const sisa = Math.max(1, Math.min(3, p.maxPeserta - p.minPeserta));
    return { tanggal, status: "sedikit", sisa };
  }
  return { tanggal, status: "tersedia", sisa: p.maxPeserta };
}

export function jadwalKeDepan(p: Paket, mulai: Date, hari: number): Slot[] {
  return Array.from({ length: hari }, (_, i) => slotPaket(p, isoTanggal(tambahHari(mulai, i))));
}

/** Tanggal bisa dipesan paling awal: H+2 dari hari ini, status tersedia/sedikit. */
export function tanggalTersediaPertama(p: Paket, dari: Date = new Date()): string {
  for (let i = 2; i < 120; i++) {
    const s = slotPaket(p, isoTanggal(tambahHari(dari, i)));
    if (s.status === "tersedia" || s.status === "sedikit") return s.tanggal;
  }
  return isoTanggal(tambahHari(dari, 2));
}

export const bisaDipesan = (s: Slot) => s.status === "tersedia" || s.status === "sedikit";

export const minTanggalPesan = () => isoTanggal(tambahHari(new Date(), 2));

export { parseTanggal };
