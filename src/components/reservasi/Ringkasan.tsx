import Image from "next/image";
import { Anchor, CalendarDays, House, Info, Users } from "lucide-react";
import type { Paket } from "@/lib/types";
import { rupiah, rentangTanggal } from "@/lib/format";
import { lokasiPaket } from "@/lib/data";

export function Ringkasan({
  paket,
  tanggal,
  peserta,
  homestay,
  rincian,
  total,
}: {
  paket: Paket;
  tanggal?: string;
  peserta: number;
  homestay?: string;
  rincian: { label: string; nilai: number }[];
  total: number;
}) {
  const baris = [
    { Icon: CalendarDays, l: "Tanggal", v: tanggal ? rentangTanggal(tanggal, paket.durasiHari) : "-" },
    { Icon: Users, l: "Peserta", v: `${peserta} orang` },
    ...(homestay ? [{ Icon: House, l: "Homestay", v: homestay }] : []),
    { Icon: Anchor, l: "Titik kumpul", v: paket.titikKumpul },
  ];
  return (
    <div className="rounded-3xl bg-surface p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Ringkasan reservasi</h2>
      <div className="mt-4 flex items-center gap-3.5">
        <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
          <Image src={paket.cover} alt="" fill sizes="64px" className="object-cover" />
        </span>
        <div>
          <p className="font-semibold">{paket.nama}</p>
          <p className="text-[13px] text-link">{lokasiPaket(paket)}</p>
        </div>
      </div>
      <dl className="mt-5 space-y-2.5 border-t border-line pt-4 text-sm">
        {baris.map(({ Icon, l, v }) => (
          <div key={l} className="flex justify-between gap-4">
            <dt className="flex shrink-0 items-center gap-2 text-muted">
              <Icon className="size-4" /> {l}
            </dt>
            <dd className="text-right font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
        {rincian.map((r) => (
          <div key={r.label} className="flex justify-between gap-4">
            <dt className="text-muted">{r.label}</dt>
            <dd className="font-medium">{rupiah(r.nilai)}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-baseline justify-between">
        <p className="font-semibold">Total estimasi</p>
        <p className="text-2xl font-semibold text-laut-700">{rupiah(total)}</p>
      </div>
      <p className="mt-4 flex gap-2.5 rounded-xl bg-white p-3.5 text-[13px] leading-relaxed text-ink/80">
        <Info className="mt-0.5 size-4 shrink-0 text-laut-700" />
        Dikelola {paket.penyelenggara.nama}. Harga final dan nominal DP dikonfirmasi lewat WhatsApp.
      </p>
    </div>
  );
}
