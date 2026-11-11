"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { cariTransaksi } from "@/lib/store";

export function CekForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const [kode, setKode] = useState(sp.get("kode") ?? "");
  const [wa, setWa] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kode.trim() || wa.replace(/\D/g, "").length < 8) {
      setError("Isi kode dan nomor WhatsApp yang dipakai saat memesan.");
      return;
    }
    const hasil = cariTransaksi(kode, wa);
    if (!hasil) {
      setError("Kode dan nomor WhatsApp tidak cocok. Periksa kembali, atau hubungi pengelola desa.");
      return;
    }
    router.push(hasil.jenis === "reservasi" ? `/reservasi/${hasil.kode}` : `/pesanan/${hasil.kode}`);
  };

  const input = "w-full rounded-xl border border-line bg-white px-4 py-3.5 text-[15px] outline-none focus:border-laut-700";
  return (
    <form onSubmit={submit} className="rounded-3xl border border-line bg-white p-5 shadow-xl shadow-deep/5 sm:p-7" noValidate>
      <label className="block text-sm font-semibold">
        Kode reservasi atau pesanan
        <input className={`${input} mt-2 uppercase`} placeholder="RSV-2607-014 atau PSN-…" value={kode} onChange={(e) => setKode(e.target.value)} />
      </label>
      <label className="mt-4 block text-sm font-semibold">
        Nomor WhatsApp pemesan
        <input className={`${input} mt-2`} inputMode="tel" placeholder="0812 4455 7801" value={wa} onChange={(e) => setWa(e.target.value)} />
      </label>
      {error && <p className="mt-3 text-sm text-bad">{error}</p>}
      <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-laut-700 px-6 py-3.5 font-medium text-white hover:bg-laut-800">
        <Search className="size-4" /> Cek status <ArrowRight className="size-4" />
      </button>
    </form>
  );
}
