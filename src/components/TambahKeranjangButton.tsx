"use client";

import { Check, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { tambahKeKeranjang } from "@/lib/store";

export function TambahKeranjangButton({ produk, nama, reservasiKode }: { produk: string; nama: string; reservasiKode?: string }) {
  const [baru, setBaru] = useState(false);
  useEffect(() => {
    if (!baru) return;
    const t = setTimeout(() => setBaru(false), 1400);
    return () => clearTimeout(t);
  }, [baru]);
  return (
    <button
      type="button"
      onClick={() => {
        tambahKeKeranjang(produk, 1, reservasiKode);
        setBaru(true);
      }}
      aria-label={`Tambah ${nama} ke keranjang`}
      className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors sm:size-10 ${
        baru ? "bg-ok text-white" : "bg-laut-100 text-laut-700 hover:bg-laut-700 hover:text-white"
      }`}
    >
      {baru ? <Check className="size-4" /> : <Plus className="size-[18px]" />}
      <span className="sr-only" aria-live="polite">
        {baru ? `${nama} ditambahkan` : ""}
      </span>
    </button>
  );
}
