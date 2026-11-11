"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleCheck, Copy, Lock, MessageCircle, Upload, Users } from "lucide-react";
import type { Paket, Reservasi } from "@/lib/types";
import { pesanReservasi, waLink } from "@/lib/whatsapp";
import { simpanBuktiBayar } from "@/lib/store";
import { QrPlaceholder } from "@/components/icons";
import { Stepper } from "./Stepper";
import { Ringkasan } from "./Ringkasan";
import { StatusPill } from "./StatusPill";

export function KonfirmasiView({
  r,
  paket,
  pengelola,
}: {
  r: Reservasi;
  paket: Paket;
  pengelola: { nama: string; wa: string[]; bumdes: string };
}) {
  const [tersalin, setTersalin] = useState(false);
  const [metode, setMetode] = useState<"qris" | "transfer">("qris");
  const pesan = pesanReservasi(r, paket);
  const terbuka = r.status !== "menunggu";
  const homestay = paket.homestay?.find((h) => h.id === r.homestayId)?.nama;
  const jam = new Date(r.createdAt);

  const salin = async () => {
    try {
      await navigator.clipboard.writeText(r.kode);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 1500);
    } catch {
      /* clipboard diblokir */
    }
  };

  const qUbah = new URLSearchParams({ ubah: r.kode, tanggal: r.tanggal, peserta: String(r.peserta) });

  return (
    <>
      <section className="bg-surface">
        <div className="container-page py-8 sm:py-10">
          <Stepper aktif={3} />
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Konfirmasi ke pengelola</h1>
              <p className="mt-3 text-[17px] text-muted">Reservasi sudah tercatat. Kirim pesan ke pengelola desa, lalu bayar DP setelah dikonfirmasi.</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-4 self-start rounded-2xl border border-line bg-white px-5 py-3.5 lg:self-auto">
              <div>
                <p className="text-xs text-muted">Kode reservasi</p>
                <p className="whitespace-nowrap text-2xl font-semibold tracking-wide">{r.kode}</p>
              </div>
              <button type="button" onClick={salin} aria-label="Salin kode reservasi" className="grid size-10 place-items-center rounded-xl bg-surface hover:bg-line">
                {tersalin ? <Check className="size-4 text-ok" /> : <Copy className="size-4" />}
              </button>
              <StatusPill status={r.status} />
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_354px] lg:gap-9">
        <div className="min-w-0 space-y-5">
          <section className="grid gap-6 rounded-3xl border-2 border-wa/70 bg-white p-5 sm:p-6 md:grid-cols-[1fr_266px]">
            <div>
              <h2 className="flex items-center gap-3 text-xl font-semibold">
                <span className="grid size-7 place-items-center rounded-full bg-wa text-sm text-white">1</span>
                Kirim konfirmasi via WhatsApp
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Pesan di samping sudah terisi otomatis dan dikirim ke nomor {pengelola.nama}, bukan nomor kabupaten. Pengelola membalas paling lambat 24 jam.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {["Pengelola cek ketersediaan perahu & homestay", "Pengelola kirim harga final dan nominal DP", "Status di halaman ini berubah menjadi Dikonfirmasi"].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-wa" />
                    {t}
                  </li>
                ))}
              </ul>
              <a
                href={waLink(pengelola.wa[0] ?? "", pesan)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-wa px-6 py-3.5 text-base font-medium text-white hover:bg-wa-dark"
              >
                <MessageCircle className="size-5" /> Konfirmasi via WhatsApp
              </a>
              {pengelola.wa[1] && (
                <a href={waLink(pengelola.wa[1], pesan)} target="_blank" rel="noopener noreferrer" className="mt-3 block text-sm font-medium text-link">
                  Atau kirim ke nomor cadangan pengelola
                </a>
              )}
            </div>
            <div className="overflow-hidden rounded-2xl bg-[#ece5dd]" aria-label="Pratinjau pesan WhatsApp">
              <div className="flex items-center gap-2.5 bg-[#126c4f] px-4 py-2.5 text-white">
                <span className="grid size-7 place-items-center rounded-full bg-white/20">
                  <Users className="size-3.5" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-medium">{pengelola.nama}</p>
                  <p className="text-[11px] text-white/75">biasanya membalas dalam 24 jam</p>
                </div>
              </div>
              <div className="p-3">
                <div className="rounded-xl rounded-tr-sm bg-[#dcf8c6] p-3 text-[12.5px] leading-relaxed text-ink">
                  <p className="whitespace-pre-line break-words">{pesan}</p>
                  <p className="mt-1 text-right text-[10px] text-muted">
                    {String(jam.getHours()).padStart(2, "0")}.{String(jam.getMinutes()).padStart(2, "0")} ✓✓
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-line bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-3 text-xl font-semibold">
                <span className="grid size-7 place-items-center rounded-full border border-line text-sm">2</span>
                Bayar DP setelah dikonfirmasi
              </h2>
              {!terbuka && (
                <span className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-muted">
                  <Lock className="size-3.5" /> Terbuka setelah status Dikonfirmasi
                </span>
              )}
            </div>
            <div className="mt-5 flex gap-2" role="tablist">
              {(["qris", "transfer"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={metode === m}
                  onClick={() => setMetode(m)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium ${metode === m ? "border-ink bg-ink text-white" : "border-line"}`}
                >
                  {m === "qris" ? "QRIS" : "Transfer bank"}
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-6 sm:grid-cols-[180px_1fr]">
              <div className="rounded-2xl border border-line p-4 text-center">
                <p className="text-[11px] font-semibold tracking-wide uppercase">{pengelola.bumdes}</p>
                {metode === "qris" ? (
                  <div className="mx-auto mt-3 grid size-[132px] place-items-center rounded-lg bg-surface">
                    <QrPlaceholder className={`size-24 ${terbuka ? "text-ink" : "text-faint"}`} />
                  </div>
                ) : (
                  <div className="mt-3 rounded-lg bg-surface px-3 py-4 text-sm">
                    <p className="text-muted">Nomor rekening</p>
                    <p className="mt-1 font-semibold">{terbuka ? "Dikirim pengelola" : "•••• •••• ••••"}</p>
                  </div>
                )}
                <p className="mt-2 text-[11px] text-muted">{terbuka ? "Bayar sesuai nominal DP dari pengelola" : "QR aktif setelah dikonfirmasi"}</p>
              </div>
              <ol className="space-y-3 text-[15px]">
                {[
                  "Tunggu pesan konfirmasi berisi nominal DP dari pengelola.",
                  metode === "qris"
                    ? `Scan QRIS ${pengelola.bumdes} dengan e-wallet atau m-banking apa pun.`
                    : `Transfer ke rekening ${pengelola.bumdes} yang dikirim pengelola. Jangan transfer ke rekening pribadi.`,
                  "Unggah bukti bayar di bawah. Status berubah menjadi DP diterima setelah dicek pengelola.",
                ].map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-laut-100 text-xs font-semibold text-laut-700">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
            <UnggahBukti kode={r.kode} terbuka={terbuka} nama={r.buktiBayar} />
          </section>

          <div className="flex flex-col-reverse items-stretch gap-4 pt-3 sm:flex-row sm:items-center sm:justify-between">
            {r.status === "menunggu" ? (
              <Link href={`/paket/${paket.slug}/reservasi?${qUbah}`} className="flex items-center justify-center gap-2 text-[15px] font-medium">
                <ArrowLeft className="size-4" /> Ubah data pemesan
              </Link>
            ) : (
              <span />
            )}
            <Link
              href={`/cek?kode=${r.kode}`}
              className="flex items-center justify-center gap-2 rounded-full bg-laut-700 px-7 py-4 text-base font-medium text-white hover:bg-laut-800"
            >
              Cek status reservasi <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <Ringkasan paket={paket} tanggal={r.tanggal} peserta={r.peserta} homestay={homestay} rincian={r.rincian} total={r.total} />
        </aside>
      </div>
    </>
  );
}

function UnggahBukti({ kode, terbuka, nama }: { kode: string; terbuka: boolean; nama?: string }) {
  const [file, setFile] = useState<string | undefined>(nama);
  const [error, setError] = useState("");
  return (
    <div className={`mt-6 flex flex-col gap-4 rounded-2xl border-2 p-4 sm:flex-row sm:items-center ${terbuka ? "border-line" : "border-line/70 bg-surface/60"}`}>
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white shadow-sm">
        <Upload className="size-5" />
      </span>
      <div className="flex-1">
        <p className="font-medium">{file ? `Bukti terunggah: ${file}` : "Unggah bukti transfer / QRIS"}</p>
        <p className="text-[13px] text-muted">{error || "JPG, PNG, atau PDF, maks 5 MB. Bisa diulang bila sinyal putus."}</p>
      </div>
      <label
        className={`self-start rounded-full border border-line bg-white px-4 py-2 text-sm font-medium sm:self-auto ${
          terbuka ? "cursor-pointer hover:bg-surface" : "cursor-not-allowed opacity-50"
        }`}
      >
        Pilih file
        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="sr-only"
          disabled={!terbuka}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            if (f.size > 5 * 1024 * 1024) {
              setError("File lebih dari 5 MB. Kompres atau foto ulang.");
              return;
            }
            setError("");
            // TODO: unggah ke Supabase Storage; sementara hanya nama file yang dicatat
            simpanBuktiBayar(kode, f.name);
            setFile(f.name);
          }}
        />
      </label>
    </div>
  );
}
