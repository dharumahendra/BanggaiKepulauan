"use client";

import { Heart } from "lucide-react";
import { toggleSimpan, usePaketDisimpan } from "@/lib/store";

export function SimpanButton({ slug, className = "", varian = "ikon" }: { slug: string; className?: string; varian?: "ikon" | "tombol" }) {
  const disimpan = usePaketDisimpan().includes(slug);
  if (varian === "tombol") {
    return (
      <button
        type="button"
        onClick={() => toggleSimpan(slug)}
        aria-pressed={disimpan}
        className={`flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium hover:bg-surface ${className}`}
      >
        <Heart className={`size-4 ${disimpan ? "fill-bad text-bad" : ""}`} />
        {disimpan ? "Disimpan" : "Simpan"}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => toggleSimpan(slug)}
      aria-pressed={disimpan}
      aria-label={disimpan ? "Hapus dari simpanan" : "Simpan paket"}
      className={`z-10 grid size-9 place-items-center rounded-full bg-white/95 text-ink shadow-sm hover:bg-white ${className}`}
    >
      <Heart className={`size-[18px] ${disimpan ? "fill-bad text-bad" : ""}`} />
    </button>
  );
}
