"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { CalendarDays } from "lucide-react";
import type { Paket } from "@/lib/types";
import { jadwalKeDepan, type StatusSlot } from "@/lib/jadwal";
import { hariPendek, namaBulan, parseTanggal, tambahHari } from "@/lib/format";

const WARNA: Record<StatusSlot, string> = {
  tersedia: "bg-[#3ccf7a]",
  sedikit: "bg-sun-400",
  penuh: "bg-white/40",
  diblokir: "bg-bad",
};

const sub = () => () => {};

/** Strip ketersediaan 14 hari ke depan untuk paket terpopuler (B7). Dihitung di browser agar selalu mulai dari hari ini. */
export function JadwalStrip({ paket }: { paket: Paket }) {
  const besok = useSyncExternalStore(
    sub,
    () => tambahHari(new Date(new Date().toDateString()), 1).getTime(),
    () => 0,
  );
  const slots = besok ? jadwalKeDepan(paket, new Date(besok), 14) : [];

  return (
    <section className="bg-deep py-6 text-white" aria-label="Jadwal terdekat">
      <div className="container-page">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2.5 font-medium">
            <CalendarDays className="size-5 text-sun-400" />
            Jadwal terdekat {besok ? `${namaBulan(new Date(besok))} ${new Date(besok).getFullYear()}` : ""} · {paket.nama}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/80">
            <li className="flex items-center gap-1.5"><span className={`size-2 rounded-full ${WARNA.tersedia}`} />Tersedia</li>
            <li className="flex items-center gap-1.5"><span className={`size-2 rounded-full ${WARNA.sedikit}`} />Sisa sedikit</li>
            <li className="flex items-center gap-1.5"><span className={`size-2 rounded-full ${WARNA.penuh}`} />Penuh</li>
            <li className="flex items-center gap-1.5"><span className={`size-2 rounded-full ${WARNA.diblokir}`} />Diblokir cuaca/adat</li>
          </ul>
        </div>
        <ol className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {(slots.length ? slots : Array.from({ length: 14 }, () => null)).map((s, i) => {
            if (!s) return <li key={i} className="h-[74px] min-w-[68px] flex-1 rounded-xl bg-white/5" />;
            const d = parseTanggal(s.tanggal);
            const bisa = s.status === "tersedia" || s.status === "sedikit";
            const label =
              s.status === "penuh" ? "Penuh" : s.status === "diblokir" ? (s.alasan ?? "Diblokir") : `${s.sisa} slot`;
            const isi = (
              <>
                <span className="text-[11px] text-white/60">{hariPendek(d)}</span>
                <span className={`text-lg font-semibold ${s.status === "penuh" ? "text-white/40" : ""}`}>{d.getDate()}</span>
                <span className="flex items-center gap-1 text-[10px] text-white/70">
                  <span className={`size-1.5 rounded-full ${WARNA[s.status]}`} />
                  {label}
                </span>
              </>
            );
            const cls = `flex min-w-[68px] flex-1 flex-col items-center gap-0.5 rounded-xl py-2.5 ${
              s.status === "diblokir" ? "border border-bad/60 bg-white/5" : s.status === "sedikit" ? "bg-white/15" : "bg-white/5"
            }`;
            return (
              <li key={s.tanggal} className="flex min-w-[68px] flex-1">
                {bisa ? (
                  <Link href={`/paket/${paket.slug}?tanggal=${s.tanggal}`} className={`${cls} hover:bg-white/20`} title={`Pesan untuk ${s.tanggal}`}>
                    {isi}
                  </Link>
                ) : (
                  <div className={cls} aria-disabled="true">
                    {isi}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
