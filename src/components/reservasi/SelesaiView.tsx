"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarPlus, Check, CloudSun, Download, Leaf, Link as LinkIcon, MessageCircle, Wallet } from "lucide-react";
import type { Paket, Reservasi, StatusReservasi } from "@/lib/types";
import { isoTanggal, parseTanggal, rentangDenganHari, rupiah, tambahHari, tanggalSedang, waktuSingkat } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";
import { QrPlaceholder } from "@/components/icons";
import { ProdukCard } from "@/components/ProdukCard";
import { produkDiDesa, produkLengkap } from "@/lib/data";
import { StatusPill } from "./StatusPill";

const URUT: StatusReservasi[] = ["menunggu", "dikonfirmasi", "dp_diterima", "selesai"];
const LABEL: Record<string, string> = { menunggu: "Menunggu konfirmasi", dikonfirmasi: "Dikonfirmasi", dp_diterima: "DP diterima", selesai: "Selesai" };

export function SelesaiView({
  r,
  paket,
  pengelola,
  desaNama,
}: {
  r: Reservasi;
  paket: Paket;
  pengelola: { nama: string; wa: string[] };
  desaNama: string[];
}) {
  const selesai = r.status === "selesai";
  const homestay = paket.homestay?.find((h) => h.id === r.homestayId)?.nama ?? "-";
  const dp = r.dp?.nominal ?? 0;
  const sisa = r.total - dp;
  const tglAkhir = isoTanggal(tambahHari(parseTanggal(r.tanggal), Math.max(0, paket.durasiHari - 1)));
  const produk = produkDiDesa(paket.singgah.map((s) => s.desa)).slice(0, 4).map(produkLengkap);
  const tujuan = desaNama[desaNama.length - 1] ?? desaNama[0];

  const tambahKalender = () => {
    const f = (iso: string) => iso.replaceAll("-", "");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Portal Wisata Banggai Kepulauan//ID",
      "BEGIN:VEVENT",
      `UID:${r.kode}@banggaikep`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART;VALUE=DATE:${f(r.tanggal)}`,
      `DTEND;VALUE=DATE:${f(isoTanggal(tambahHari(parseTanggal(tglAkhir), 1)))}`,
      `SUMMARY:${paket.nama} (${r.kode})`,
      `LOCATION:${paket.titikKumpul}`,
      `DESCRIPTION:Kode reservasi ${r.kode}. Pengelola: ${pengelola.nama}.`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${r.kode}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section className="bg-surface">
        <div className="container-page flex flex-col items-center py-10 text-center sm:py-14">
          <span className="grid size-[72px] place-items-center rounded-full bg-ok text-white shadow-xl shadow-ok/30">
            <Check className="size-9" />
          </span>
          <h1 className="mt-7 text-3xl font-semibold tracking-tight sm:text-5xl">
            {selesai ? `Terima kasih sudah berkunjung ke ${tujuan}!` : `DP diterima. Sampai jumpa di ${tujuan}!`}
          </h1>
          <p className="mt-4 max-w-xl text-[17px] text-muted">
            {selesai
              ? "Perjalanan Anda sudah selesai. Semoga berkesan dan sampai jumpa lagi di Banggai Kepulauan."
              : `${pengelola.nama} sudah memverifikasi pembayaran Anda. Simpan kode reservasi dan tunjukkan saat tiba di titik kumpul.`}
          </p>

          <ol className="mt-9 grid w-full max-w-[870px] grid-cols-4 rounded-2xl border border-line bg-white px-4 py-5 text-left sm:px-7">
            {URUT.map((s, i) => {
              const log = r.riwayat.find((x) => x.status === s);
              const capai = URUT.indexOf(r.status) >= i;
              const kini = r.status === s;
              return (
                <li key={s} className="relative">
                  <div className="flex items-center">
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-full ${
                        capai ? "bg-ok text-white" : "border-2 border-line bg-white"
                      } ${kini ? "ring-4 ring-ok/20" : ""}`}
                    >
                      {capai && <Check className="size-3.5" />}
                    </span>
                    {i < URUT.length - 1 && <span className={`mx-2 h-0.5 flex-1 ${URUT.indexOf(r.status) > i ? "bg-ok" : "bg-line"}`} />}
                  </div>
                  <p className={`mt-3 pr-2 text-[13px] sm:text-sm ${capai ? "font-medium" : "text-muted"}`}>{LABEL[s]}</p>
                  <p className="mt-0.5 text-[11px] text-muted sm:text-xs">
                    {log ? waktuSingkat(log.waktu) : s === "selesai" ? tanggalSedang(tglAkhir).replace(/^(\d+) (\w{3})\w*/, "$1 $2") : "-"}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="container-page py-10 sm:py-12">
        <div className="mx-auto grid max-w-[942px] overflow-hidden rounded-3xl border border-line md:grid-cols-[1fr_266px]" id="e-tiket">
          <div className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                  <Image src={paket.cover} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <div>
                  <p className="eyebrow !text-[11px]">E-tiket · Paket wisata desa</p>
                  <p className="mt-1 text-xl font-semibold sm:text-2xl">{paket.nama}</p>
                </div>
              </div>
              <span className="hidden sm:block">
                <StatusPill status={r.status} />
              </span>
            </div>
            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 text-[15px] sm:grid-cols-3">
              <Info l="Tanggal" v={rentangDenganHari(r.tanggal, paket.durasiHari)} />
              <Info l="Peserta" v={`${r.peserta} orang`} />
              <Info l="Titik kumpul" v={`${paket.titikKumpul} WITA`} />
              <Info l="Pemesan" v={r.nama} />
              <Info l="Homestay" v={homestay} />
              <Info l="Pengelola" v={pengelola.nama} />
              <Info l="Total" v={rupiah(r.total)} />
              <Info l="DP dibayar" v={dp ? `${rupiah(dp)} · ${r.dp?.metode}` : "-"} />
              <Info l="Sisa di lokasi" v={rupiah(sisa)} sorot />
            </dl>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 bg-deep p-7 text-center text-white">
            <p className="text-[13px] text-white/70">Kode reservasi</p>
            <span className="grid size-[142px] place-items-center rounded-2xl bg-white">
              <QrPlaceholder className="size-28 text-deep" />
            </span>
            <p className="text-2xl font-semibold tracking-wide">{r.kode}</p>
            <p className="max-w-[200px] text-[13px] text-white/70">Tunjukkan ke pengelola saat tiba di titik kumpul</p>
          </div>
        </div>

        <div className="no-print mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => window.print()} className="flex items-center gap-2 rounded-full bg-laut-700 px-5 py-3 text-[15px] font-medium text-white hover:bg-laut-800">
            <Download className="size-4" /> Simpan e-tiket (PDF)
          </button>
          <a
            href={waLink(pengelola.wa[0] ?? "", `Halo ${pengelola.nama}, saya ${r.nama} dengan kode reservasi ${r.kode}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-wa px-5 py-3 text-[15px] font-medium text-white hover:bg-wa-dark"
          >
            <MessageCircle className="size-4" /> Chat pengelola
          </a>
          <button type="button" onClick={tambahKalender} className="flex items-center gap-2 rounded-full border border-line px-5 py-3 text-[15px] font-medium hover:bg-surface">
            <CalendarPlus className="size-4" /> Tambah ke kalender
          </button>
        </div>
      </section>

      {!selesai && produk.length > 0 && (
        <section className="no-print bg-surface py-14 sm:py-16">
          <div className="container-page">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">Bawa pulang oleh-oleh</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Pre-order sekarang, ambil saat di {desaNama.length > 1 ? "desa singgah" : desaNama[0]}</h2>
              </div>
              <div className="flex items-center gap-3 self-start rounded-2xl border border-line bg-white px-4 py-2.5 md:self-auto">
                <LinkIcon className="size-4 text-laut-700" />
                <div className="leading-tight">
                  <p className="text-sm font-medium">Terhubung ke {r.kode}</p>
                  <p className="text-xs text-muted">Diambil {tanggalSedang(tglAkhir).replace(/ \d{4}$/, "")} · bayar di lokasi</p>
                </div>
              </div>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {produk.map((p) => (
                <ProdukCard key={p.slug} produk={p} reservasiKode={r.kode} />
              ))}
            </div>
            <Link href="/keranjang" className="mt-6 inline-flex items-center gap-1.5 font-medium text-link">
              Lihat keranjang <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

      <section className="no-print container-page py-14 sm:py-16">
        <h2 className="text-3xl font-semibold">Sebelum berangkat</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            { Icon: CloudSun, j: "Cek cuaca & gelombang", t: "Pengelola mengabari H-1 bila jadwal perlu digeser karena cuaca.", l: "Info musim & cuaca", h: "/info#faq" },
            { Icon: Wallet, j: "Siapkan uang tunai", t: `Sinyal dan ATM terbatas di desa. Sisa pembayaran ${rupiah(sisa)} dibayar di lokasi.`, l: "Lihat rincian", h: "#e-tiket" },
            { Icon: Leaf, j: "Bawa sunscreen ramah karang", t: "Jangan menyentuh capungan dan bulu babi. Pemandu akan memberi briefing.", l: "Etika wisata bahari", h: "/info#etika" },
          ].map(({ Icon, j, t, l, h }) => (
            <div key={j} className="rounded-2xl border border-line p-5 sm:p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-laut-100 text-laut-700">
                <Icon className="size-5" />
              </span>
              <p className="mt-5 text-lg font-semibold">{j}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{t}</p>
              <Link href={h} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-link">
                {l} <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Info({ l, v, sorot }: { l: string; v: string; sorot?: boolean }) {
  return (
    <div>
      <dt className="text-[13px] text-muted">{l}</dt>
      <dd className={`mt-1 font-medium ${sorot ? "text-laut-700" : ""}`}>{v}</dd>
    </div>
  );
}
