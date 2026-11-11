import Link from "next/link";
import type { Kecamatan } from "@/lib/types";
import { atraksiDiKecamatan, paketDiKecamatan } from "@/lib/data";

export function KecamatanCard({ k }: { k: Kecamatan }) {
  const paket = paketDiKecamatan(k.slug).length;
  const atraksi = atraksiDiKecamatan(k.slug).length;
  return (
    <Link
      href={`/kecamatan/${k.slug}`}
      className="group flex min-h-[146px] flex-col rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-laut-700 hover:bg-laut-700"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs tracking-wide text-muted group-hover:text-white/70">{k.kode}</span>
        {k.desaFokus && (
          <span className="rounded-full bg-sun-100 px-2 py-0.5 text-[10px] font-medium text-sun-800 group-hover:bg-white/15 group-hover:text-white">
            Desa fokus
          </span>
        )}
      </div>
      <h3 className="mt-4 text-lg font-medium leading-tight text-ink group-hover:text-white">{k.nama}</h3>
      <p className="mt-1 text-xs text-muted group-hover:text-white/70">Ibu kota {k.ibuKota}</p>
      <p className="mt-auto pt-4 text-xs font-medium text-laut-700 group-hover:text-white">
        {atraksi} destinasi · {paket > 0 ? `${paket} paket` : "paket segera hadir"}
      </p>
    </Link>
  );
}
