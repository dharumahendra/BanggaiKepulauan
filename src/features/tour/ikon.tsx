import { Droplets, FishSymbol, Hand, Info, Map, Trash2, Users, Camera } from "lucide-react";
import type { AturanBerkunjung, TipeHotspot } from "./types";

export const GAYA_HOTSPOT: Record<TipeHotspot, { label: string; warna: string; muda: string; teks: string; Ikon: typeof Info }> = {
  info: { label: "Info", warna: "#0e4c68", muda: "#e3eef3", teks: "#0e4c68", Ikon: Info },
  aturan: { label: "Aturan", warna: "#d92d2d", muda: "#fde8e8", teks: "#b42323", Ikon: Hand },
  spesies: { label: "Spesies", warna: "#2e8b3e", muda: "#e5f3e7", teks: "#25793a", Ikon: FishSymbol },
  zona: { label: "Zona", warna: "#138a9e", muda: "#e0f2f5", teks: "#0f6f80", Ikon: Map },
};

export function IkonHotspot({ tipe, className = "size-11" }: { tipe: TipeHotspot; className?: string }) {
  const g = GAYA_HOTSPOT[tipe];
  return (
    <span className={`grid shrink-0 place-items-center rounded-full text-white ${className}`} style={{ background: g.warna }} aria-hidden="true">
      <g.Ikon className="size-[48%]" />
    </span>
  );
}

export const IKON_ATURAN: Record<AturanBerkunjung["ikon"], { Ikon: typeof Info; warna: string }> = {
  tangan: { Ikon: Hand, warna: "#d92d2d" },
  tetes: { Ikon: Droplets, warna: "#0e4c68" },
  sampah: { Ikon: Trash2, warna: "#2e8b3e" },
  pemandu: { Ikon: Users, warna: "#a16207" },
  kamera: { Ikon: Camera, warna: "#0e4c68" },
};
