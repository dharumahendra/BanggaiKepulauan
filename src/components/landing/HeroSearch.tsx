"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, ChevronDown, Map, Search, Users, WavesHorizontal } from "lucide-react";
import type { Kecamatan } from "@/lib/types";

export function HeroSearch({ kecamatan }: { kecamatan: Kecamatan[] }) {
  const router = useRouter();
  const [kec, setKec] = useState("");
  const [jenis, setJenis] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [peserta, setPeserta] = useState("2");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (kec) q.set("kecamatan", kec);
    if (jenis) q.set("kategori", jenis);
    if (tanggal) q.set("tanggal", tanggal);
    if (peserta) q.set("peserta", peserta);
    router.push(`/paket${q.size ? `?${q}` : ""}`);
  };

  const sel = "w-full appearance-none bg-transparent pr-6 text-[15px] font-medium text-ink outline-none";

  return (
    <form
      onSubmit={submit}
      className="mx-auto grid w-full text-left max-w-[980px] grid-cols-1 gap-1 rounded-3xl bg-white p-2 shadow-2xl shadow-deep/30 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:rounded-[22px]"
    >
      <Field ikon={<Map className="size-5" />} label="Kecamatan" htmlFor="hs-kec">
        <select id="hs-kec" className={sel} value={kec} onChange={(e) => setKec(e.target.value)}>
          <option value="">Semua kecamatan</option>
          {kecamatan.map((k) => (
            <option key={k.slug} value={k.slug}>
              {k.nama}
            </option>
          ))}
        </select>
      </Field>
      <Field ikon={<WavesHorizontal className="size-5" />} label="Jenis wisata" htmlFor="hs-jenis">
        <select id="hs-jenis" className={sel} value={jenis} onChange={(e) => setJenis(e.target.value)}>
          <option value="">Semua jenis</option>
          <option value="bahari">Bahari</option>
          <option value="alam">Alam</option>
          <option value="budaya">Budaya</option>
        </select>
      </Field>
      <Field ikon={<CalendarDays className="size-5" />} label="Tanggal kunjungan" htmlFor="hs-tgl" panah={false}>
        <input
          id="hs-tgl"
          type="date"
          className={`${sel} pr-0 ${tanggal ? "" : "text-ink/90"}`}
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          aria-label="Pilih tanggal"
        />
      </Field>
      <Field ikon={<Users className="size-5" />} label="Peserta" htmlFor="hs-peserta">
        <select id="hs-peserta" className={sel} value={peserta} onChange={(e) => setPeserta(e.target.value)}>
          {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} orang
            </option>
          ))}
        </select>
      </Field>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-2xl bg-laut-700 px-6 py-4 text-base font-medium text-white hover:bg-laut-800 sm:col-span-2 lg:col-span-1"
      >
        <Search className="size-5" /> Cari paket
      </button>
    </form>
  );
}

function Field({
  ikon,
  label,
  htmlFor,
  children,
  panah = true,
}: {
  ikon: React.ReactNode;
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  panah?: boolean;
}) {
  return (
    <div className="relative flex items-center gap-3 rounded-2xl px-4 py-2.5 hover:bg-surface lg:border-r lg:border-line lg:rounded-none lg:last-of-type:border-r-0">
      <span className="text-laut-700">{ikon}</span>
      <div className="min-w-0 flex-1">
        <label htmlFor={htmlFor} className="block text-xs text-muted">
          {label}
        </label>
        {children}
      </div>
      {panah && <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" />}
    </div>
  );
}
