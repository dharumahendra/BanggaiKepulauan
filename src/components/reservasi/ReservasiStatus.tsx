"use client";

import Link from "next/link";
import { CircleX, SearchX } from "lucide-react";
import { useReservasi } from "@/lib/store";
import { desaPaket, getPaket, pengelolaPaket } from "@/lib/data";
import { KonfirmasiView } from "./KonfirmasiView";
import { SelesaiView } from "./SelesaiView";

/** Menentukan tampilan halaman /reservasi/[kode] berdasarkan status. */
export function ReservasiStatus({ kode }: { kode: string }) {
  const r = useReservasi(kode);
  if (r === null) return <div className="container-page h-[60vh] py-10" aria-busy="true" />;

  const paket = r ? getPaket(r.paketSlug) : undefined;
  if (!r || !paket) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <SearchX className="size-12 text-muted" />
        <h1 className="mt-5 text-3xl font-semibold">Reservasi {kode} tidak ditemukan</h1>
        <p className="mt-3 max-w-md text-muted">
          Periksa kembali kode reservasi Anda, atau cek lewat halaman Cek Pesanan dengan nomor WhatsApp yang dipakai saat memesan.
        </p>
        <Link href="/cek" className="mt-6 rounded-full bg-laut-700 px-6 py-3 font-medium text-white">
          Cek pesanan
        </Link>
      </div>
    );
  }

  const p = pengelolaPaket(paket);
  const desa = desaPaket(paket);
  const bumdes = p.desa ? `BUMDes ${p.desa.nama}` : paket.penyelenggara.nama;

  if (r.status === "dibatalkan") {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <CircleX className="size-12 text-bad" />
        <h1 className="mt-5 text-3xl font-semibold">Reservasi {r.kode} dibatalkan</h1>
        <p className="mt-3 max-w-md text-muted">Hubungi {p.nama} untuk informasi pengembalian DP atau penjadwalan ulang.</p>
        <Link href={`/paket/${paket.slug}`} className="mt-6 rounded-full bg-laut-700 px-6 py-3 font-medium text-white">
          Pesan ulang paket ini
        </Link>
      </div>
    );
  }

  if (r.status === "dp_diterima" || r.status === "selesai") {
    return <SelesaiView r={r} paket={paket} pengelola={{ nama: p.nama, wa: p.wa }} desaNama={desa.map((d) => d.nama)} />;
  }
  return <KonfirmasiView r={r} paket={paket} pengelola={{ nama: p.nama, wa: p.wa, bumdes }} />;
}
