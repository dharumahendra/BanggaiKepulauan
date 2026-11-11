import Image from "next/image";
import Link from "next/link";
import { MapPin, Mountain, Rotate3d } from "lucide-react";
import type { DestinasiKartu } from "@/lib/data";
import { KATEGORI_LABEL } from "./PaketCard";

/** Kartu destinasi: dipakai di /wisata, halaman kecamatan, dan artikel (destinasi lain). */
export function DestinasiCard({ d, priority = false }: { d: DestinasiKartu; priority?: boolean }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg hover:shadow-deep/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        {d.foto ? (
          <Image
            src={d.foto}
            alt={d.nama}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid size-full place-items-center bg-gradient-to-br from-laut-100 to-surface text-laut-700/40">
            <Mountain className="size-10" />
          </div>
        )}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-laut-800">{KATEGORI_LABEL[d.kategori]}</span>
          {d.tur && (
            <span className="flex items-center gap-1 rounded-full bg-sun-400 px-2.5 py-1 text-xs font-semibold text-ink" title="Ada Virtual Tour 360°">
              <Rotate3d className="size-3.5" /> 360°
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="flex items-center gap-1.5 text-[13px] text-link">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{d.lokasi}</span>
        </p>
        <h3 className="mt-1.5 text-[17px] font-medium leading-snug text-ink">
          <Link href={`/wisata/${d.slug}`} className="after:absolute after:inset-0 focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-laut-700 focus-visible:after:rounded-2xl">
            {d.nama}
          </Link>
        </h3>
        {d.ringkasan && <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-muted">{d.ringkasan}</p>}
      </div>
    </article>
  );
}
