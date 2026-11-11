"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import type { ProdukLengkap } from "@/lib/data";
import { ProdukCard } from "@/components/ProdukCard";

const KATEGORI = [
  { id: "semua", label: "Semua" },
  { id: "olahan-ikan", label: "Olahan ikan" },
  { id: "kuliner", label: "Kuliner" },
  { id: "kerajinan", label: "Kerajinan" },
  { id: "hasil-kebun", label: "Hasil kebun" },
];
const URUTAN = { terlaris: "Terlaris", murah: "Harga terendah", mahal: "Harga tertinggi" } as const;
const AWAL = 12;

export function ProdukKatalog({ produk, kecamatan }: { produk: ProdukLengkap[]; kecamatan: { slug: string; nama: string }[] }) {
  const sp = useSearchParams();
  const [q, setQ] = useState("");
  const [kat, setKat] = useState("semua");
  const [kec, setKec] = useState(sp.get("kecamatan") ?? "");
  const [stok, setStok] = useState<"semua" | "ready" | "preorder">("semua");
  const [urut, setUrut] = useState<keyof typeof URUTAN>("terlaris");
  const [batas, setBatas] = useState(AWAL);
  const umkm = sp.get("umkm") ?? "";

  const hasil = useMemo(() => {
    const kata = q.trim().toLowerCase();
    const r = produk.filter(
      (p) =>
        (!kata || p.nama.toLowerCase().includes(kata) || (p.umkmData?.nama ?? "").toLowerCase().includes(kata)) &&
        (kat === "semua" || p.kategori === kat) &&
        (!kec || p.kecamatanSlug === kec) &&
        (stok === "semua" || p.tipe === stok) &&
        (!umkm || p.umkm === umkm),
    );
    const s = { terlaris: (a: ProdukLengkap, b: ProdukLengkap) => b.terjual - a.terjual, murah: (a: ProdukLengkap, b: ProdukLengkap) => a.harga - b.harga, mahal: (a: ProdukLengkap, b: ProdukLengkap) => b.harga - a.harga };
    return r.sort(s[urut]);
  }, [produk, q, kat, kec, stok, urut, umkm]);

  const jumlahKat = (id: string) => (id === "semua" ? produk.length : produk.filter((p) => p.kategori === id).length);
  const sisa = hasil.length - batas;

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Katalog produk</p>
          <h2 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight sm:text-4xl">Pilih, lalu pesan ke pembuatnya</h2>
        </div>
        <label className="relative block w-full md:w-[338px]">
          <span className="sr-only">Cari produk</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setBatas(AWAL);
            }}
            placeholder="Cari abon, keripik, anyaman…"
            className="w-full rounded-xl border border-line bg-white py-3.5 pl-11 pr-4 text-sm outline-none focus:border-laut-700"
          />
        </label>
      </div>
      {umkm && (
        <p className="mt-4 text-sm text-muted">
          Menampilkan produk dari <span className="font-medium text-ink">{produk.find((p) => p.umkm === umkm)?.umkmData?.nama ?? umkm}</span>.
        </p>
      )}
      <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 lg:flex-nowrap lg:pb-0" role="tablist" aria-label="Kategori produk">
          {KATEGORI.map((k) => (
            <button
              key={k.id}
              type="button"
              role="tab"
              aria-selected={kat === k.id}
              onClick={() => {
                setKat(k.id);
                setBatas(AWAL);
              }}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm ${
                kat === k.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/30"
              }`}
            >
              {k.label} <span className={`text-xs ${kat === k.id ? "text-white/60" : "text-muted"}`}>{jumlahKat(k.id)}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 lg:flex-nowrap">
          <Pilih label="Kecamatan" value={kec} onChange={setKec} opsi={[{ v: "", l: "Semua" }, ...kecamatan.map((k) => ({ v: k.slug, l: k.nama }))]} />
          <Pilih
            label="Stok"
            value={stok}
            onChange={(v) => setStok(v as typeof stok)}
            opsi={[
              { v: "semua", l: "Ready & pre-order" },
              { v: "ready", l: "Ready" },
              { v: "preorder", l: "Pre-order" },
            ]}
          />
          <Pilih label="Urutkan" value={urut} onChange={(v) => setUrut(v as typeof urut)} opsi={Object.entries(URUTAN).map(([v, l]) => ({ v, l }))} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {hasil.slice(0, batas).map((p) => (
          <ProdukCard key={p.slug} produk={p} />
        ))}
      </div>
      {hasil.length === 0 && <p className="mt-6 rounded-2xl bg-surface p-8 text-center text-muted">Produk tidak ditemukan.</p>}
      {sisa > 0 && (
        <div className="mt-9 flex justify-center">
          <button
            type="button"
            onClick={() => setBatas((b) => b + AWAL)}
            className="flex items-center gap-2 rounded-full border border-line px-6 py-3 font-medium text-laut-800 hover:bg-surface"
          >
            Tampilkan {sisa} produk lainnya <ChevronDown className="size-4" />
          </button>
        </div>
      )}
    </>
  );
}

function Pilih({ label, value, onChange, opsi }: { label: string; value: string; onChange: (v: string) => void; opsi: { v: string; l: string }[] }) {
  return (
    <label className="relative flex shrink-0 items-center gap-1 rounded-xl bg-surface py-2.5 pl-3 pr-8 text-[13px]">
      <span className="text-muted">{label}:</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="max-w-[130px] appearance-none bg-transparent font-medium outline-none">
        {opsi.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 size-4" />
    </label>
  );
}
