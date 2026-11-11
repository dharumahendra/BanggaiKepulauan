import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import type { Paket } from "@/lib/types";
import { lokasiPaket } from "@/lib/data";
import { rupiah } from "@/lib/format";
import { SimpanButton } from "./SimpanButton";

export const KATEGORI_LABEL = { bahari: "Bahari", alam: "Alam", budaya: "Budaya" } as const;

export function PaketCard({ paket, priority = false }: { paket: Paket; priority?: boolean }) {
  const href = `/paket/${paket.slug}`;
  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg hover:shadow-deep/5">
      <div className="relative aspect-[16/9] overflow-hidden bg-surface">
        <Image
          src={paket.cover}
          alt={paket.nama}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3.5 top-3.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-laut-800">
          {KATEGORI_LABEL[paket.kategori]}
        </span>
        <SimpanButton slug={paket.slug} className="absolute right-3.5 top-3.5" />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-[18px]">
        <p className="flex items-center gap-1.5 text-[13px] text-link">
          <MapPin className="size-3.5 shrink-0" />
          {lokasiPaket(paket)}
        </p>
        <h3 className="mt-2 text-lg font-medium text-ink sm:text-xl">
          <Link href={href} className="after:absolute after:inset-0 focus:outline-none">
            <span className="relative">{paket.nama}</span>
          </Link>
        </h3>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {paket.durasiLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            {paket.minPeserta}–{paket.maxPeserta} orang
          </span>
        </p>
        <div className="mt-auto pt-4">
        <div className="flex items-end justify-between gap-3 border-t border-line pt-3.5">
          <div>
            <p className="text-xs text-muted">Mulai dari</p>
            <p className="text-lg font-semibold text-ink">
              {rupiah(paket.harga)} <span className="text-[13px] font-normal text-muted">/orang</span>
            </p>
          </div>
          <Link
            href={href}
            className="relative z-10 flex shrink-0 items-center gap-1.5 rounded-full bg-laut-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-laut-800"
          >
            Lihat detail <ArrowRight className="size-4" />
          </Link>
        </div>
        </div>
      </div>
    </article>
  );
}
