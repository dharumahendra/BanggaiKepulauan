const rupiahFmt = new Intl.NumberFormat("id-ID");

export const rupiah = (n: number) => `Rp${rupiahFmt.format(Math.round(n))}`;

/** Rp150rb, Rp1,2jt */
export function rupiahRingkas(n: number) {
  if (n >= 1_000_000) return `Rp${(n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt`;
  if (n >= 1_000) return `Rp${Math.round(n / 1000)}rb`;
  return rupiah(n);
}

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const HARI_PENDEK = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const BULAN_PENDEK = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/** Parse YYYY-MM-DD sebagai tanggal lokal (bukan UTC). */
export function parseTanggal(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function isoTanggal(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function tambahHari(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** Senin, 12 Juli 2027 */
export const tanggalPanjang = (iso: string) => {
  const d = parseTanggal(iso);
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
};

/** 12 Juli 2027 */
export const tanggalSedang = (iso: string) => {
  const d = parseTanggal(iso);
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
};

/** 12–13 Juli 2027 (rentang sesuai durasi paket) */
export function rentangTanggal(iso: string, durasiHari: number) {
  const a = parseTanggal(iso);
  if (durasiHari <= 1) return tanggalSedang(iso);
  const b = tambahHari(a, durasiHari - 1);
  if (a.getMonth() === b.getMonth()) return `${a.getDate()}–${b.getDate()} ${BULAN[a.getMonth()]} ${a.getFullYear()}`;
  return `${a.getDate()} ${BULAN_PENDEK[a.getMonth()]} – ${b.getDate()} ${BULAN_PENDEK[b.getMonth()]} ${b.getFullYear()}`;
}

/** Sen–Sel, 12–13 Juli 2027 */
export function rentangDenganHari(iso: string, durasiHari: number) {
  const a = parseTanggal(iso);
  const b = tambahHari(a, Math.max(0, durasiHari - 1));
  const hari = durasiHari > 1 ? `${HARI_PENDEK[a.getDay()]}–${HARI_PENDEK[b.getDay()]}` : HARI_PENDEK[a.getDay()];
  return `${hari}, ${rentangTanggal(iso, durasiHari)}`;
}

/** 10 Jun, 09.41 */
export function waktuSingkat(isoDateTime: string) {
  const d = new Date(isoDateTime);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getDate()} ${BULAN_PENDEK[d.getMonth()]}, ${p(d.getHours())}.${p(d.getMinutes())}`;
}

export const hariPendek = (d: Date) => HARI_PENDEK[d.getDay()];
export const namaBulan = (d: Date) => BULAN[d.getMonth()];
export const bulanPendek = (d: Date) => BULAN_PENDEK[d.getMonth()];

/** Normalisasi nomor WA Indonesia ke 62xxxxxxxx. */
export function normalisasiWA(input: string): string {
  let n = input.replace(/\D/g, "");
  if (n.startsWith("0")) n = "62" + n.slice(1);
  else if (n.startsWith("8")) n = "62" + n;
  return n;
}
