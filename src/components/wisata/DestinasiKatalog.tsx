"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, Rotate3d, Search } from "lucide-react";
import type { DestinasiKartu } from "@/lib/data";
import { DestinasiCard } from "@/components/DestinasiCard";

const KATEGORI = [
  { id: "", label: "Semua" },
  { id: "alam", label: "Alam" },
  { id: "bahari", label: "Bahari" },
  { id: "budaya", label: "Budaya" },
];

export function DestinasiKatalog({ destinasi, kecamatan }: { destinasi: DestinasiKartu[]; kecamatan: { slug: string; nama: string }[] }) {
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [kec, setKec] = useState(sp.get("kecamatan") ?? "");
  const [kat, setKat] = useState(sp.get("kategori") ?? "");
  const [tur, setTur] = useState(sp.get("tur") === "1");

  const hasil = useMemo(() => {
    const kata = q.trim().toLowerCase();
    return destinasi.filter(
      (d) =>
        (!kata || d.nama.toLowerCase().includes(kata) || d.lokasi.toLowerCase().includes(kata)) &&
        (!kec || d.kecamatanSlug === kec) &&
        (!kat || d.kategori === kat) &&
        (!tur || d.tur),
    );
  }, [destinasi, q, kec, kat, tur]);

  const reset = () => {
    setQ("");
    setKec("");
    setKat("");
    setTur(false);
  };

  return (
    <>
      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <span className="sr-only">Cari destinasi</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari telaga, pantai, kampung…"
            className="w-full rounded-xl border border-line bg-white py-3.5 pl-11 pr-4 text-[15px] outline-none focus:border-laut-700"
          />
        </label>
        <label className="relative flex items-center gap-1 rounded-xl bg-surface py-3 pl-4 pr-9 text-sm">
          <span className="text-muted">Kecamatan:</span>
          <select value={kec} onChange={(e) => setKec(e.target.value)} className="w-full appearance-none bg-transparent font-medium outline-none md:w-auto">
            <option value="">Semua</option>
            {kecamatan.map((k) => (
              <option key={k.slug} value={k.slug}>
                {k.nama}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 size-4" />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5" role="group" aria-label="Kategori">
          {KATEGORI.map((k) => (
            <button
              key={k.id}
              type="button"
              aria-pressed={kat === k.id}
              onClick={() => setKat(k.id)}
              className={`min-h-11 rounded-full border px-4 text-sm ${kat === k.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/30"}`}
            >
              {k.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={tur}
          onClick={() => setTur((v) => !v)}
          className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm ${tur ? "border-sun-400 bg-sun-100 font-medium text-sun-800" : "border-line bg-white hover:border-ink/30"}`}
        >
          <Rotate3d className="size-4" /> Ada Virtual Tour 360°
          <span className={`relative h-5 w-9 rounded-full transition-colors ${tur ? "bg-sun-400" : "bg-line"}`} aria-hidden="true">
            <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all ${tur ? "left-[18px]" : "left-0.5"}`} />
          </span>
        </button>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {hasil.length} destinasi
      </p>
      <div className="mt-3 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {hasil.map((d, i) => (
          <DestinasiCard key={d.slug} d={d} priority={i < 4} />
        ))}
      </div>
      {hasil.length === 0 && (
        <div className="mt-4 rounded-2xl bg-surface p-8 text-center text-muted">
          Destinasi tidak ditemukan.{" "}
          <button type="button" onClick={reset} className="font-medium text-link">
            Hapus filter
          </button>
        </div>
      )}
    </>
  );
}
