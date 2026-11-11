"use client";

import Link from "next/link";
import { MapPin, MessageCircle, SearchX } from "lucide-react";
import { usePesanan } from "@/lib/store";
import { getDesa, getProduk, lokasiDesa } from "@/lib/data";
import { rupiah, waktuSingkat } from "@/lib/format";
import { pesanPesanan, waLink } from "@/lib/whatsapp";
import type { StatusPesanan } from "@/lib/types";

const LABEL: Record<StatusPesanan, string> = {
  menunggu: "Menunggu konfirmasi",
  dikonfirmasi: "Dikonfirmasi",
  siap: "Siap diambil/dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export function PesananStatus({ kode }: { kode: string }) {
  const o = usePesanan(kode);
  if (o === null) return <div className="h-80" aria-busy="true" />;
  if (!o) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <SearchX className="size-12 text-muted" />
        <h1 className="mt-5 text-3xl font-semibold">Pesanan {kode} tidak ditemukan</h1>
        <Link href="/cek" className="mt-6 rounded-full bg-laut-700 px-6 py-3 font-medium text-white">
          Cek pesanan
        </Link>
      </div>
    );
  }
  const desa = getDesa(o.desa);
  const nama = (s: string) => getProduk(s)?.nama ?? s;
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm text-muted">Pesanan oleh-oleh · dibuat {waktuSingkat(o.createdAt)}</p>
      <h1 className="mt-1 text-4xl font-semibold tracking-tight">{o.kode}</h1>
      <span className="mt-3 inline-flex rounded-full bg-sun-100 px-3 py-1.5 text-xs font-medium text-sun-800">{LABEL[o.status]}</span>
      <div className="mt-6 rounded-3xl border border-line p-5 sm:p-6">
        <p className="flex items-center gap-1.5 text-sm text-link">
          <MapPin className="size-4" /> {lokasiDesa(o.desa)}
        </p>
        <ul className="mt-4 space-y-2 text-[15px]">
          {o.item.map((i) => (
            <li key={i.produk} className="flex justify-between gap-3">
              <span>
                {nama(i.produk)} × {i.qty}
              </span>
              <span>{rupiah(i.harga * i.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-line pt-4 text-lg font-semibold">
          <span>Total</span> <span>{rupiah(o.total)}</span>
        </p>
        <p className="mt-3 text-sm text-muted">
          {o.metode === "ambil"
            ? `Diambil di desa${o.reservasiKode ? ` saat kunjungan (${o.reservasiKode})` : ""}.`
            : `Dikirim ke ${o.alamat}. Ongkir dikonfirmasi pengelola.`}
        </p>
        <a
          href={waLink(desa?.pengelola?.wa[0] ?? "", pesanPesanan(o, nama))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-wa px-5 py-3 font-medium text-white hover:bg-wa-dark"
        >
          <MessageCircle className="size-4" /> Chat {desa?.pengelola?.nama ?? "pengelola desa"}
        </a>
      </div>
    </div>
  );
}
