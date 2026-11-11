"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import type { KategoriWisata } from "@/lib/types";
import { rupiah } from "@/lib/format";

export type PaketRingkas = {
  slug: string;
  nama: string;
  kategori: KategoriWisata;
  kecamatan: string[];
  desaNama: string[];
  durasiHari: number;
  harga: number;
  dipesan: number;
  node: React.ReactNode;
};

type Opsi = { slug: string; nama: string; jumlah: number };

const PER_HALAMAN = 6;
const URUTAN = {
  populer: "Paling banyak dipesan",
  murah: "Harga terendah",
  mahal: "Harga tertinggi",
  singkat: "Durasi terpendek",
} as const;

export function PaketKatalog({ paket, kecamatan }: { paket: PaketRingkas[]; kecamatan: Opsi[] }) {
  const sp = useSearchParams();
  const hargaMin = Math.min(...paket.map((p) => p.harga));
  const hargaMax = Math.max(...paket.map((p) => p.harga));

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [kecSel, setKecSel] = useState<string[]>(() => {
    const k = sp.get("kecamatan");
    return k ? [k] : [];
  });
  const [katSel, setKatSel] = useState<string[]>(() => {
    const k = sp.get("kategori");
    return k ? [k] : [];
  });
  const [durasi, setDurasi] = useState<"semua" | "1" | "2" | "3">("semua");
  const [rentang, setRentang] = useState<[number, number]>([hargaMin, hargaMax]);
  const [urut, setUrut] = useState<keyof typeof URUTAN>("populer");
  const [hal, setHal] = useState(1);
  const [semuaKec, setSemuaKec] = useState(false);
  const [filterMobile, setFilterMobile] = useState(false);

  const peserta = Number(sp.get("peserta") ?? 0);

  const hasil = useMemo(() => {
    const kata = q.trim().toLowerCase();
    const r = paket.filter(
      (p) =>
        (!kata || p.nama.toLowerCase().includes(kata) || p.desaNama.some((d) => d.toLowerCase().includes(kata))) &&
        (kecSel.length === 0 || p.kecamatan.some((k) => kecSel.includes(k))) &&
        (katSel.length === 0 || katSel.includes(p.kategori)) &&
        (durasi === "semua" || (durasi === "3" ? p.durasiHari >= 3 : p.durasiHari === Number(durasi))) &&
        p.harga >= rentang[0] &&
        p.harga <= rentang[1],
    );
    const sorter: Record<keyof typeof URUTAN, (a: PaketRingkas, b: PaketRingkas) => number> = {
      populer: (a, b) => b.dipesan - a.dipesan,
      murah: (a, b) => a.harga - b.harga,
      mahal: (a, b) => b.harga - a.harga,
      singkat: (a, b) => a.durasiHari - b.durasiHari,
    };
    return r.sort(sorter[urut]);
  }, [paket, q, kecSel, katSel, durasi, rentang, urut]);

  const totalHal = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN));
  const halAman = Math.min(hal, totalHal);
  const tampil = hasil.slice((halAman - 1) * PER_HALAMAN, halAman * PER_HALAMAN);

  const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const reset = (fn: () => void) => {
    fn();
    setHal(1);
  };

  const hitungKat = (k: string) => paket.filter((p) => p.kategori === k).length;
  const hitungDur = (d: string) => paket.filter((p) => (d === "3" ? p.durasiHari >= 3 : p.durasiHari === Number(d))).length;
  const kecTampil = semuaKec ? kecamatan : kecamatan.slice(0, 6);

  const sidebar = (
    <div className="space-y-6">
      <label className="relative block">
        <span className="sr-only">Cari paket atau desa</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => reset(() => setQ(e.target.value))}
          placeholder="Cari paket atau desa"
          className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-laut-700"
        />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold">Kecamatan</legend>
        <ul className="mt-3 space-y-2.5">
          {kecTampil.map((k) => (
            <li key={k.slug}>
              <Cek label={k.nama} jumlah={k.jumlah} checked={kecSel.includes(k.slug)} onChange={() => reset(() => setKecSel((s) => toggle(s, k.slug)))} />
            </li>
          ))}
        </ul>
        {kecamatan.length > 6 && (
          <button type="button" onClick={() => setSemuaKec((v) => !v)} className="mt-3 text-sm font-medium text-link">
            {semuaKec ? "Tampilkan lebih sedikit" : `+ Lihat ${kecamatan.length - 6} kecamatan lainnya`}
          </button>
        )}
      </fieldset>

      <fieldset className="border-t border-line pt-6">
        <legend className="sr-only">Kategori</legend>
        <p className="text-sm font-semibold">Kategori</p>
        <ul className="mt-3 space-y-2.5">
          {(["bahari", "alam", "budaya"] as const).map((k) => (
            <li key={k}>
              <Cek label={k[0].toUpperCase() + k.slice(1)} jumlah={hitungKat(k)} checked={katSel.includes(k)} onChange={() => reset(() => setKatSel((s) => toggle(s, k)))} />
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="border-t border-line pt-6">
        <legend className="sr-only">Durasi</legend>
        <p className="text-sm font-semibold">Durasi</p>
        <ul className="mt-3 space-y-2.5">
          {[
            { v: "semua", l: "Semua durasi" },
            { v: "1", l: "1 hari" },
            { v: "2", l: "2 hari 1 malam" },
            { v: "3", l: "3 hari atau lebih" },
          ].map((d) => (
            <li key={d.v}>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="radio"
                  name="durasi"
                  checked={durasi === d.v}
                  onChange={() => reset(() => setDurasi(d.v as typeof durasi))}
                  className="size-[18px] accent-laut-700"
                />
                <span className="flex-1">{d.l}</span>
                {d.v !== "semua" && <span className="text-xs text-muted">{hitungDur(d.v)}</span>}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="border-t border-line pt-6">
        <legend className="sr-only">Harga per orang</legend>
        <p className="text-sm font-semibold">Harga per orang</p>
        <div className="relative mt-4 h-5">
          <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-line" />
          <div
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-laut-700"
            style={{
              left: `${((rentang[0] - hargaMin) / (hargaMax - hargaMin || 1)) * 100}%`,
              right: `${100 - ((rentang[1] - hargaMin) / (hargaMax - hargaMin || 1)) * 100}%`,
            }}
          />
          <input
            type="range"
            aria-label="Harga minimum"
            min={hargaMin}
            max={hargaMax}
            step={25000}
            value={rentang[0]}
            onChange={(e) => reset(() => setRentang(([, b]) => [Math.min(Number(e.target.value), b), b]))}
            className="range-dual absolute inset-0 w-full"
          />
          <input
            type="range"
            aria-label="Harga maksimum"
            min={hargaMin}
            max={hargaMax}
            step={25000}
            value={rentang[1]}
            onChange={(e) => reset(() => setRentang(([a]) => [a, Math.max(Number(e.target.value), a)]))}
            className="range-dual absolute inset-0 w-full"
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{rupiah(rentang[0])}</span>
          <span>{rupiah(rentang[1])}</span>
        </div>
      </fieldset>
    </div>
  );

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[250px_1fr] lg:gap-9">
      <aside className="hidden lg:block">{sidebar}</aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg font-medium">
            {hasil.length} paket ditemukan
            {peserta > 0 && <span className="ml-2 text-sm font-normal text-muted">untuk {peserta} orang</span>}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterMobile((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-line px-3.5 py-2.5 text-sm lg:hidden"
              aria-expanded={filterMobile}
            >
              <SlidersHorizontal className="size-4" /> Filter
            </button>
            <label className="relative flex items-center gap-1 rounded-xl bg-surface py-2.5 pl-3.5 pr-9 text-sm">
              <span className="text-muted">Urutkan:</span>
              <select value={urut} onChange={(e) => setUrut(e.target.value as keyof typeof URUTAN)} className="appearance-none bg-transparent font-medium outline-none">
                {Object.entries(URUTAN).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 size-4" />
            </label>
          </div>
        </div>

        {filterMobile && <div className="mt-5 rounded-2xl border border-line p-4 lg:hidden">{sidebar}</div>}

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {tampil.map((p) => (
            <div key={p.slug} className="flex">
              {p.node}
            </div>
          ))}
        </div>
        {hasil.length === 0 && (
          <div className="mt-5 rounded-2xl bg-surface p-8 text-center text-muted">
            Tidak ada paket yang cocok. Coba longgarkan filter harga atau kecamatan.
          </div>
        )}

        {totalHal > 1 && (
          <nav className="mt-10 flex justify-center gap-2" aria-label="Halaman">
            <PageBtn disabled={halAman === 1} onClick={() => setHal(halAman - 1)} label="Sebelumnya">
              <ChevronLeft className="size-4" />
            </PageBtn>
            {Array.from({ length: totalHal }, (_, i) => i + 1).map((n) => (
              <PageBtn key={n} aktif={n === halAman} onClick={() => setHal(n)} label={`Halaman ${n}`}>
                {n}
              </PageBtn>
            ))}
            <PageBtn disabled={halAman === totalHal} onClick={() => setHal(halAman + 1)} label="Berikutnya">
              <ChevronRight className="size-4" />
            </PageBtn>
          </nav>
        )}
      </div>
    </div>
  );
}

function Cek({ label, jumlah, checked, onChange }: { label: string; jumlah: number; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="size-[18px] rounded accent-laut-700" />
      <span className="flex-1">{label}</span>
      <span className="text-xs text-muted">{jumlah}</span>
    </label>
  );
}

function PageBtn({
  children,
  onClick,
  aktif,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  aktif?: boolean;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick();
        window.scrollTo({ top: 300, behavior: "smooth" });
      }}
      disabled={disabled}
      aria-label={label}
      aria-current={aktif ? "page" : undefined}
      className={`grid size-10 place-items-center rounded-full border text-sm disabled:opacity-40 ${
        aktif ? "border-laut-700 bg-laut-700 text-white" : "border-line bg-white hover:bg-surface"
      }`}
    >
      {children}
    </button>
  );
}
