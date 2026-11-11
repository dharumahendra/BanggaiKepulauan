// Lapisan akses data. Semua halaman membaca data lewat fungsi di sini,
// sehingga saat pindah ke Supabase cukup file ini yang diganti.
import { DESA, KECAMATAN } from "@/data/wilayah";
import { PAKET } from "@/data/paket";
import { PRODUK, UMKM_LIST } from "@/data/umkm";
import { ATRAKSI } from "@/data/destinasi";
import { TUR_TELAGA_PAISU_POK } from "@/data/tours/telaga-paisu-pok";
import type { Tur } from "@/features/tour/types";
import type { Atraksi, Desa, Kecamatan, Paket, Produk, UMKM } from "./types";

const TUR: Tur[] = [TUR_TELAGA_PAISU_POK];

export const semuaKecamatan = () => KECAMATAN;
export const kecamatanUrutAbjad = () => [...KECAMATAN].sort((a, b) => a.nama.localeCompare(b.nama, "id"));
export const getKecamatan = (slug: string) => KECAMATAN.find((k) => k.slug === slug);

export const semuaDesa = () => DESA;
export const getDesa = (slug: string) => DESA.find((d) => d.slug === slug);
export const desaDiKecamatan = (kec: string) => DESA.filter((d) => d.kecamatan === kec);

export function kecamatanDariDesa(desaSlug: string): Kecamatan | undefined {
  const d = getDesa(desaSlug);
  return d ? getKecamatan(d.kecamatan) : undefined;
}

export const semuaPaket = () => PAKET;
export const getPaket = (slug: string) => PAKET.find((p) => p.slug === slug);

/** Kecamatan yang dilewati paket, urut sesuai desa singgah. */
export function kecamatanPaket(p: Paket): Kecamatan[] {
  const out: Kecamatan[] = [];
  for (const s of p.singgah) {
    const k = kecamatanDariDesa(s.desa);
    if (k && !out.some((x) => x.slug === k.slug)) out.push(k);
  }
  return out;
}

export function desaPaket(p: Paket): Desa[] {
  return p.singgah.map((s) => getDesa(s.desa)).filter((d): d is Desa => Boolean(d));
}

/** Label lokasi kartu: "Lumbi-Lumbia · Buko Selatan" atau "Lintas 3 desa · 3 kecamatan". */
export function lokasiPaket(p: Paket): string {
  const desa = desaPaket(p);
  const kec = kecamatanPaket(p);
  if (desa.length > 1) return `Lintas ${desa.length} desa · ${kec.length} kecamatan`;
  return `${desa[0]?.nama ?? "-"} · ${kec[0]?.nama ?? "-"}`;
}

/** Kontak WhatsApp penyelenggara paket (desa, atau desa singgah pertama untuk paket kabupaten/kecamatan). */
export function pengelolaPaket(p: Paket) {
  const desa = getDesa(p.penyelenggara.desa ?? p.singgah[0]?.desa ?? "");
  return {
    nama: p.penyelenggara.nama,
    operator: desa?.pengelola?.operator,
    wa: desa?.pengelola?.wa ?? [],
    terverifikasi: desa?.pengelola?.terverifikasi ?? false,
    desa,
  };
}

export const paketDiKecamatan = (kec: string) => PAKET.filter((p) => kecamatanPaket(p).some((k) => k.slug === kec));
export const atraksiDiKecamatan = (kec: string) =>
  ATRAKSI.filter((a) => getDesa(a.desa)?.kecamatan === kec);

export const semuaAtraksi = () => ATRAKSI;

// ---------- Destinasi (atraksi) & Virtual Tour ----------
export const semuaDestinasi = () => ATRAKSI;
export const getDestinasi = (slug: string) => ATRAKSI.find((a) => a.slug === slug);
export const destinasiDiDesa = (desa: string) => ATRAKSI.filter((a) => a.desa === desa);

/** Tur yang boleh dibuka publik (status Tayang). */
export const getTur = (slug: string) => TUR.find((t) => t.atraksi === slug && t.status === "tayang");
export const adaTur = (slug: string) => Boolean(getTur(slug));

export type DestinasiKartu = Atraksi & { lokasi: string; desaNama: string; kecamatanSlug: string; kecamatanNama: string; tur: boolean };

export function destinasiKartu(a: Atraksi): DestinasiKartu {
  const d = getDesa(a.desa);
  const k = d ? getKecamatan(d.kecamatan) : undefined;
  return {
    ...a,
    lokasi: `${d?.nama ?? "-"} · ${k?.nama ?? "-"}`,
    desaNama: d?.nama ?? "-",
    kecamatanSlug: k?.slug ?? "",
    kecamatanNama: k?.nama ?? "-",
    tur: adaTur(a.slug),
  };
}

/** Destinasi yang disinggahi paket, urut sesuai itinerary. */
export function destinasiPaket(p: Paket): Atraksi[] {
  return p.singgah.flatMap((s) => s.atraksi ?? []).map((slug) => getDestinasi(slug)).filter((a): a is Atraksi => Boolean(a));
}

/**
 * Paket untuk artikel/tur destinasi (PRD A8 & I2):
 * paket yang singgah di destinasi ini; bila kosong, paket di desa yang sama.
 */
export function paketDiDestinasi(slug: string): { paket: Paket[]; sumber: "singgah" | "desa" | "kosong" } {
  const singgah = PAKET.filter((p) => p.singgah.some((s) => s.atraksi?.includes(slug)));
  if (singgah.length) return { paket: singgah, sumber: "singgah" };
  const a = getDestinasi(slug);
  const desa = a ? PAKET.filter((p) => p.singgah.some((s) => s.desa === a.desa)) : [];
  return desa.length ? { paket: desa, sumber: "desa" } : { paket: [], sumber: "kosong" };
}

export const semuaUMKM = () => UMKM_LIST;
export const getUMKM = (slug: string) => UMKM_LIST.find((u) => u.slug === slug);
export const semuaProduk = () => PRODUK;
export const getProduk = (slug: string) => PRODUK.find((p) => p.slug === slug);
export const produkUMKM = (umkm: string) => PRODUK.filter((p) => p.umkm === umkm);

/** Desa asal produk (lewat UMKM). Satu pesanan dibuat per desa. */
export function desaProduk(p: Produk): Desa | undefined {
  const u = getUMKM(p.umkm);
  return u ? getDesa(u.desa) : undefined;
}

export function lokasiDesa(desaSlug: string): string {
  const d = getDesa(desaSlug);
  const k = d ? getKecamatan(d.kecamatan) : undefined;
  return `${d?.nama ?? "-"} · ${k?.nama ?? "-"}`;
}

export const produkDiDesa = (desa: string[]) => PRODUK.filter((p) => desa.includes(getUMKM(p.umkm)?.desa ?? ""));

export type ProdukLengkap = Produk & { umkmData?: UMKM; desaSlug?: string; kecamatanSlug?: string; lokasi: string };

export function produkLengkap(p: Produk): ProdukLengkap {
  const u = getUMKM(p.umkm);
  const d = u ? getDesa(u.desa) : undefined;
  return { ...p, umkmData: u, desaSlug: d?.slug, kecamatanSlug: d?.kecamatan, lokasi: u ? lokasiDesa(u.desa) : "-" };
}
