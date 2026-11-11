"use client";

// Mode foto (PRD V5): dipakai bila WebGL tidak ada atau panorama gagal dimuat.
// Semua isi edukasi tetap terbaca sebagai teks biasa (K4).
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, ImageOff, Lightbulb, RefreshCw } from "lucide-react";
import { GAYA_HOTSPOT, IkonHotspot } from "./ikon";
import type { InfoDestinasi, InfoPaket } from "./bagian";
import type { Tur } from "./types";

export function FallbackGaleri({
  tur,
  destinasi,
  paket,
  sceneAwal,
  alasan,
  onCoba,
  onCta,
}: {
  tur: Tur;
  destinasi: InfoDestinasi;
  paket: InfoPaket;
  sceneAwal: string;
  alasan: "webgl" | "gagal" | "pilihan";
  onCoba: () => void;
  onCta: () => void;
}) {
  const [aktif, setAktif] = useState(() => Math.max(0, tur.scene.findIndex((s) => s.id === sceneAwal)));
  const [semua, setSemua] = useState(false);
  const [buka, setBuka] = useState<string | null>(null);
  const s = tur.scene[aktif];
  const hotspot = tur.scene.flatMap((sc) => sc.hotspot.map((h) => ({ ...h, scene: sc.namaPendek })));
  const MAKS = 4;
  const thumbs = semua ? tur.scene : tur.scene.slice(0, MAKS);

  return (
    <div className="min-h-dvh bg-white pb-28 text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link href={`/wisata/${destinasi.slug}`} aria-label="Kembali ke artikel" className="grid size-11 place-items-center rounded-full hover:bg-surface">
            <ArrowLeft className="size-6" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold leading-tight">{destinasi.nama}</h1>
            <p className="text-sm text-muted">Mode foto · {tur.scene.length} titik</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-4">
        <div className="rounded-3xl bg-laut-50 p-5">
          <p className="flex items-start gap-3 text-[17px] font-semibold text-laut-800">
            <ImageOff className="mt-0.5 size-6 shrink-0" />
            {alasan === "pilihan" ? "Kamu sedang di mode foto" : "Panorama 360° belum bisa dimuat"}
          </p>
          <p className="mt-1 pl-9 text-[15px] leading-relaxed text-ink/80">
            {alasan === "webgl"
              ? "Perangkat atau browser ini tidak mendukung tampilan 360°. Kami tampilkan foto biasa supaya kamu tetap bisa melihat lokasinya."
              : alasan === "gagal"
                ? "Sinyal lemah atau perangkat tidak mendukung. Kami tampilkan foto biasa supaya kamu tetap bisa melihat lokasinya."
                : "Mode ini lebih hemat kuota. Semua info konservasi tetap ada di bawah."}
          </p>
          {alasan !== "webgl" && (
            <button type="button" onClick={onCoba} className="mt-3 ml-9 flex min-h-11 items-center gap-2 font-semibold text-link">
              <RefreshCw className="size-5" /> Coba muat 360° lagi
            </button>
          )}
        </div>

        <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-3xl bg-surface">
          <Image src={s.thumb} alt={s.nama} fill priority sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-deep/80 to-transparent p-4 pt-12 text-white">
            <p className="text-lg font-semibold">
              {aktif + 1} · {s.nama}
            </p>
            <p className="text-sm text-white/80">
              {aktif + 1} / {tur.scene.length}
            </p>
          </div>
        </div>
        <div className="mt-2.5 grid grid-cols-5 gap-2" role="list" aria-label="Pilih titik">
          {thumbs.map((t) => {
            const i = tur.scene.indexOf(t);
            return (
              <button
                key={t.id}
                type="button"
                role="listitem"
                onClick={() => setAktif(i)}
                aria-label={`${i + 1}. ${t.nama}`}
                aria-current={i === aktif}
                className={`relative aspect-[5/4] overflow-hidden rounded-xl ${i === aktif ? "ring-3 ring-laut-700" : ""}`}
              >
                <Image src={t.thumb} alt="" fill sizes="140px" className="object-cover" />
              </button>
            );
          })}
          {!semua && tur.scene.length > MAKS && (
            <button type="button" onClick={() => setSemua(true)} className="grid aspect-[5/4] place-items-center rounded-xl bg-surface text-lg font-semibold text-laut-800">
              +{tur.scene.length - MAKS}
            </button>
          )}
        </div>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">{s.deskripsi}</p>

        <section className="mt-8">
          <div className="flex items-baseline justify-between border-b border-line pb-3">
            <h2 className="text-2xl font-semibold">Info konservasi di tur ini</h2>
            <span className="text-[15px] text-muted">{hotspot.length} titik</span>
          </div>
          <ul className="divide-y divide-line">
            {hotspot.map((h) => {
              const terbuka = buka === h.id;
              return (
                <li key={h.id}>
                  <button
                    type="button"
                    aria-expanded={terbuka}
                    onClick={() => setBuka(terbuka ? null : h.id)}
                    className="flex w-full items-center gap-4 py-4 text-left"
                  >
                    <IkonHotspot tipe={h.tipe} className="size-12" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[17px] font-semibold">{h.judul}</span>
                      <span className="block text-[15px] text-muted">
                        {GAYA_HOTSPOT[h.tipe].label} · {h.scene}
                      </span>
                    </span>
                    <ChevronDown className={`size-5 shrink-0 text-muted transition-transform ${terbuka ? "rotate-180" : ""}`} />
                  </button>
                  {terbuka && (
                    <div className="pb-5 pl-16 text-[15px] leading-relaxed">
                      <p>{h.isi}</p>
                      {h.tips && (
                        <p className="mt-3 flex gap-2.5 rounded-xl bg-sun-100 px-3.5 py-3">
                          <Lightbulb className="mt-0.5 size-4.5 shrink-0 text-sun-800" /> {h.tips}
                        </p>
                      )}
                      {h.validasi && (
                        <p className="mt-2 text-sm font-medium text-ok">
                          Divalidasi oleh {h.validasi.oleh} · {h.validasi.tanggal}
                        </p>
                      )}
                      {h.sumber && <p className="mt-1 text-[13px] text-muted">Sumber: {h.sumber}</p>}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white px-4 py-4">
        <Link
          href={paket.href}
          onClick={onCta}
          className="mx-auto flex min-h-14 max-w-3xl items-center justify-center gap-2 rounded-2xl bg-laut-700 text-lg font-semibold text-white hover:bg-laut-800"
        >
          Lihat paket di lokasi ini <ArrowRight className="size-5" />
        </Link>
      </div>
    </div>
  );
}
