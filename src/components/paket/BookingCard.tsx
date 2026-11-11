"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { ArrowRight, CalendarDays, Check, MessageCircle, Minus, Plus } from "lucide-react";
import type { Paket } from "@/lib/types";
import { hitungHarga, satuanLabel } from "@/lib/harga";
import { rupiah, tanggalPanjang } from "@/lib/format";
import { minTanggalPesan, slotPaket, tanggalTersediaPertama } from "@/lib/jadwal";
import { waLink } from "@/lib/whatsapp";

const noop = () => () => {};

export function BookingCard({ paket, waPengelola }: { paket: Paket; waPengelola: string }) {
  const sp = useSearchParams();
  const terhidrasi = useSyncExternalStore(noop, () => true, () => false);

  const [tanggalPilih, setTanggal] = useState<string | null>(sp.get("tanggal"));
  const [peserta, setPeserta] = useState(() => {
    const n = Number(sp.get("peserta"));
    return n >= paket.minPeserta && n <= paket.maxPeserta ? n : Math.min(Math.max(paket.minPeserta, 6), paket.maxPeserta);
  });
  const [addOns, setAddOns] = useState<string[]>(() => {
    const a = sp.get("addon");
    return a ? a.split(",") : paket.addOns.slice(0, 1).map((x) => x.id);
  });

  // tanggal default baru dihitung di browser (bergantung "hari ini")
  const tanggal = tanggalPilih ?? (terhidrasi ? tanggalTersediaPertama(paket) : null);
  const slot = tanggal ? slotPaket(paket, tanggal) : null;
  const bisa = slot && (slot.status === "tersedia" || slot.status === "sedikit");
  const { rincian, total } = hitungHarga(paket, peserta, addOns);

  const q = new URLSearchParams();
  if (tanggal) q.set("tanggal", tanggal);
  q.set("peserta", String(peserta));
  if (addOns.length) q.set("addon", addOns.join(","));

  const tanya = `Halo ${paket.penyelenggara.nama}, saya ingin bertanya tentang paket "${paket.nama}"${
    tanggal ? ` untuk tanggal ${tanggalPanjang(tanggal)}` : ""
  } (${peserta} orang).`;

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-xl shadow-deep/5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">Mulai dari</p>
          <p className="whitespace-nowrap text-[28px] font-semibold text-ink">
            {rupiah(paket.harga)} <span className="text-base font-normal text-muted">/orang</span>
          </p>
        </div>
        <span className="whitespace-nowrap rounded-full bg-sun-100 px-2.5 py-1 text-xs font-medium text-sun-800">Harga estimasi</span>
      </div>

      <label className="mt-6 block text-sm font-medium" htmlFor="bk-tanggal">
        Tanggal berangkat
      </label>
      <div className="relative mt-2 flex items-center gap-3 rounded-xl border border-line px-4 py-3 focus-within:border-laut-700">
        <CalendarDays className="size-5 shrink-0 text-laut-700" />
        <span className="flex-1 text-[15px] font-medium">{tanggal ? tanggalPanjang(tanggal) : "Pilih tanggal"}</span>
        {slot && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              slot.status === "tersedia"
                ? "bg-ok-50 text-ok"
                : slot.status === "sedikit"
                  ? "bg-sun-100 text-sun-800"
                  : "bg-bad-50 text-bad"
            }`}
          >
            {slot.status === "penuh" ? "Penuh" : slot.status === "diblokir" ? `Diblokir · ${slot.alasan}` : `${slot.sisa} slot`}
          </span>
        )}
        <input
          id="bk-tanggal"
          type="date"
          min={terhidrasi ? minTanggalPesan() : undefined}
          value={tanggal ?? ""}
          onChange={(e) => e.target.value && setTanggal(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Pilih tanggal berangkat"
        />
      </div>
      {slot && !bisa && <p className="mt-1.5 text-xs text-bad">Tanggal ini tidak tersedia. Pilih tanggal lain.</p>}

      <div className="mt-5 flex items-baseline justify-between">
        <p className="text-sm font-medium" id="bk-peserta">
          Jumlah peserta
        </p>
        <p className="text-xs text-muted">
          min {paket.minPeserta} · maks {paket.maxPeserta}
        </p>
      </div>
      <div className="mt-2 flex items-center justify-between rounded-xl border border-line p-1.5" role="group" aria-labelledby="bk-peserta">
        <button
          type="button"
          onClick={() => setPeserta((n) => Math.max(paket.minPeserta, n - 1))}
          disabled={peserta <= paket.minPeserta}
          className="grid size-10 place-items-center rounded-lg border border-line disabled:opacity-40"
          aria-label="Kurangi peserta"
        >
          <Minus className="size-4" />
        </button>
        <span className="text-lg font-medium" aria-live="polite">
          {peserta} orang
        </span>
        <button
          type="button"
          onClick={() => setPeserta((n) => Math.min(paket.maxPeserta, n + 1))}
          disabled={peserta >= paket.maxPeserta}
          className="grid size-10 place-items-center rounded-lg bg-laut-700 text-white disabled:opacity-40"
          aria-label="Tambah peserta"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {paket.addOns.length > 0 && (
        <fieldset className="mt-5">
          <legend className="text-sm font-medium">Add-on</legend>
          <div className="mt-2 space-y-2">
            {paket.addOns.map((a) => {
              const on = addOns.includes(a.id);
              return (
                <label
                  key={a.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm ${
                    on ? "border-laut-700/40 bg-laut-50" : "border-line"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() => setAddOns((s) => (on ? s.filter((x) => x !== a.id) : [...s, a.id]))}
                  />
                  <span className={`grid size-5 shrink-0 place-items-center rounded-md border ${on ? "border-laut-700 bg-laut-700 text-white" : "border-line"}`}>
                    {on && <Check className="size-3.5" />}
                  </span>
                  <span className="flex-1 font-medium">{a.nama}</span>
                  <span className="text-xs text-muted">
                    {rupiah(a.harga)} {satuanLabel[a.satuan]}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
        {rincian.map((r) => (
          <div key={r.label} className="flex justify-between gap-3">
            <dt className="text-muted">{r.label}</dt>
            <dd className="font-medium">{rupiah(r.nilai)}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-baseline justify-between">
        <p className="font-semibold">Total estimasi</p>
        <p className="text-2xl font-semibold text-laut-700 sm:text-[28px]">{rupiah(total)}</p>
      </div>

      {bisa ? (
        <Link
          href={`/paket/${paket.slug}/reservasi?${q}`}
          className="mt-5 flex items-center justify-center gap-2 rounded-full bg-laut-700 px-6 py-4 text-base font-medium text-white hover:bg-laut-800"
        >
          Pesan sekarang <ArrowRight className="size-5" />
        </Link>
      ) : (
        <button type="button" disabled className="mt-5 w-full rounded-full bg-laut-700/40 px-6 py-4 text-base font-medium text-white">
          {tanggal ? "Tanggal tidak tersedia" : "Pilih tanggal dulu"}
        </button>
      )}
      <a
        href={waLink(waPengelola, tanya)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center justify-center gap-2 rounded-full border-2 border-wa px-6 py-3.5 text-base font-medium text-wa hover:bg-wa/5"
      >
        <MessageCircle className="size-5" /> Tanya dulu via WhatsApp
      </a>
      <p className="mt-4 text-center text-xs leading-relaxed text-muted">
        Belum ada pembayaran di tahap ini. Harga final dikonfirmasi pengelola desa.
      </p>
    </div>
  );
}
