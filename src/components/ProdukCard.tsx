import Image from "next/image";
import { Check, Hourglass, MapPin, Store } from "lucide-react";
import type { ProdukLengkap } from "@/lib/data";
import { rupiah } from "@/lib/format";
import { TambahKeranjangButton } from "./TambahKeranjangButton";

export function StokBadge({ tipe, lead }: { tipe: "ready" | "preorder"; lead?: number }) {
  return tipe === "ready" ? (
    <span className="flex items-center gap-1 rounded-full bg-ok px-2.5 py-1 text-xs font-medium text-white">
      <Check className="size-3" /> Ready
    </span>
  ) : (
    <span className="flex items-center gap-1 rounded-full bg-sun-400 px-2.5 py-1 text-xs font-medium text-ink">
      <Hourglass className="size-3" /> Pre-order · {lead} hari
    </span>
  );
}

export function ProdukCard({ produk, reservasiKode }: { produk: ProdukLengkap; reservasiKode?: string }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative aspect-[4/3] bg-surface">
        <Image src={produk.foto} alt={produk.nama} fill sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw" className="object-cover" />
        <span className="absolute left-3 top-3">
          <StokBadge tipe={produk.tipe} lead={produk.leadTimeHari} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <Store className="size-3.5 shrink-0" />
          <span className="truncate">{produk.umkmData?.nama}</span>
        </p>
        <h3 className="mt-1.5 font-medium text-ink sm:text-lg">{produk.nama}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-link sm:text-[13px]">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{produk.lokasi}</span>
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <p className="font-semibold text-ink sm:text-lg">
            {rupiah(produk.harga)} <span className="text-xs font-normal text-muted">/ {produk.satuan}</span>
          </p>
          <TambahKeranjangButton produk={produk.slug} nama={produk.nama} reservasiKode={reservasiKode} />
        </div>
      </div>
    </article>
  );
}
