"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, X } from "lucide-react";

export function Galeri({ foto, nama }: { foto: string[]; nama: string }) {
  const [idx, setIdx] = useState<number | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (idx !== null && !d.open) d.showModal();
    if (idx === null && d.open) d.close();
  }, [idx]);

  const [utama, ...lain] = foto;
  const kecil = lain.slice(0, 3);

  return (
    <>
      <div className="relative">
      <div className="grid gap-2.5 sm:h-[430px] sm:grid-cols-[1.8fr_1fr] sm:grid-rows-2">
        <button type="button" onClick={() => setIdx(0)} className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:row-span-2 sm:aspect-auto sm:rounded-3xl">
          <Image src={utama} alt={nama} fill priority sizes="(min-width: 640px) 710px, 100vw" className="object-cover" />
        </button>
        <div className="hidden sm:block">
          {kecil[0] && (
            <button type="button" onClick={() => setIdx(1)} className="relative block size-full overflow-hidden rounded-3xl">
              <Image src={kecil[0]} alt="" fill sizes="390px" className="object-cover" />
            </button>
          )}
        </div>
        <div className="hidden gap-2.5 sm:grid sm:grid-cols-2">
          {kecil.slice(1).map((f, i) => (
            <button key={f} type="button" onClick={() => setIdx(i + 2)} className="relative overflow-hidden rounded-3xl">
              <Image src={f} alt="" fill sizes="195px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
        <button
          type="button"
          onClick={() => setIdx(0)}
          className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium shadow sm:bottom-5 sm:right-5"
        >
          <LayoutGrid className="size-4" /> Lihat {foto.length} foto
        </button>
      </div>

      <dialog
        ref={dlg}
        onClose={() => setIdx(null)}
        onClick={(e) => e.target === dlg.current && setIdx(null)}
        className="m-auto w-[min(1000px,calc(100vw-24px))] rounded-2xl bg-deep p-0 text-white backdrop:bg-black/70"
      >
        {idx !== null && (
          <div className="relative">
            <div className="relative aspect-[16/10]">
              <Image src={foto[idx]} alt={`${nama} — foto ${idx + 1}`} fill sizes="1000px" className="object-contain" />
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <span>
                {idx + 1} / {foto.length}
              </span>
              <div className="flex gap-2">
                <button type="button" aria-label="Foto sebelumnya" onClick={() => setIdx((idx - 1 + foto.length) % foto.length)} className="grid size-9 place-items-center rounded-full bg-white/10">
                  <ChevronLeft className="size-4" />
                </button>
                <button type="button" aria-label="Foto berikutnya" onClick={() => setIdx((idx + 1) % foto.length)} className="grid size-9 place-items-center rounded-full bg-white/10">
                  <ChevronRight className="size-4" />
                </button>
                <button type="button" aria-label="Tutup" onClick={() => setIdx(null)} className="grid size-9 place-items-center rounded-full bg-white/10">
                  <X className="size-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
