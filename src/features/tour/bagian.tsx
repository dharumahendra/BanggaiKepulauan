"use client";

// Potongan UI Virtual Tour: kartu hotspot, panel scene, minimap, CTA paket, layar etika.
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, ChevronsRight, Lightbulb, Maximize2, Minimize2, ShieldCheck, X } from "lucide-react";
import { GAYA_HOTSPOT, IKON_ATURAN, IkonHotspot } from "./ikon";
import type { Hotspot, Scene, Tur } from "./types";

export type InfoPaket = { jumlah: number; termurah: number; cover?: string; href: string };
export type InfoDestinasi = { slug: string; nama: string; lokasi: string; foto?: string };

const rupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

// ---------- Kartu hotspot (K1, K5) ----------
export function KartuHotspot({
  h,
  urutan,
  total,
  onSebelumnya,
  onBerikutnya,
  onTutup,
  sheet = false,
}: {
  h: Hotspot;
  urutan: number;
  total: number;
  onSebelumnya: () => void;
  onBerikutnya: () => void;
  onTutup: () => void;
  sheet?: boolean;
}) {
  const g = GAYA_HOTSPOT[h.tipe];
  return (
    <div
      role="dialog"
      aria-modal={sheet}
      aria-labelledby={`hs-judul-${h.id}`}
      className={`overflow-hidden bg-white text-ink shadow-2xl ${sheet ? "max-h-[78vh] overflow-y-auto rounded-t-[28px]" : "rounded-3xl"}`}
    >
      {sheet && <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-line" aria-hidden="true" />}
      {h.foto && !sheet && (
        <div className="relative aspect-[2/1] bg-surface">
          <Image src={h.foto} alt={h.judul} fill sizes="480px" className="object-cover" />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold" style={{ background: g.muda, color: g.teks }}>
            <g.Ikon className="size-4" /> {g.label}
          </span>
          <button type="button" onClick={onTutup} aria-label="Tutup kartu" className="grid size-11 place-items-center rounded-full bg-surface hover:bg-line">
            <X className="size-5" />
          </button>
        </div>
        <h2 id={`hs-judul-${h.id}`} className="mt-3 text-[26px] font-semibold leading-tight">
          {h.judul}
        </h2>
        {h.subjudul && <p className={`mt-1 text-[15px] text-muted ${sheet ? "italic" : ""}`}>{h.subjudul}</p>}
        <div className={`mt-4 ${sheet && h.foto ? "grid grid-cols-[120px_1fr] gap-4" : ""}`}>
          {sheet && h.foto && (
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
              <Image src={h.foto} alt={h.judul} fill sizes="120px" className="object-cover" />
            </div>
          )}
          <p className="text-[16px] leading-relaxed">{h.isi}</p>
        </div>
        {h.tips && (
          <p className="mt-4 flex gap-3 rounded-2xl bg-sun-100 px-4 py-3.5 text-[15px] leading-relaxed">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-sun-800" /> {h.tips}
          </p>
        )}
        {h.validasi && (
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-ok">
            <BadgeCheck className="size-4.5" /> Divalidasi oleh {h.validasi.oleh} · {h.validasi.tanggal}
          </p>
        )}
        {h.sumber && <p className="mt-1.5 text-[13px] leading-snug text-muted">Sumber: {h.sumber}</p>}
      </div>
      {total > 1 && (
        <div className="flex items-center justify-between border-t border-line px-3 py-2 text-[15px]">
          <button type="button" onClick={onSebelumnya} className="flex min-h-11 items-center gap-1 rounded-xl px-2 font-medium text-laut-800 hover:bg-surface">
            <ChevronLeft className="size-5" /> Sebelumnya
          </button>
          <span className="text-sm text-muted">
            {urutan} dari {total}
            {sheet ? " di scene ini" : ""}
          </span>
          <button type="button" onClick={onBerikutnya} className="flex min-h-11 items-center gap-1 rounded-xl px-2 font-medium text-laut-800 hover:bg-surface">
            Berikutnya <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- Daftar hotspot sebagai teks (K4) ----------
export function DaftarHotspot({ hotspot, onPilih, gelap = true }: { hotspot: Hotspot[]; onPilih: (id: string) => void; gelap?: boolean }) {
  return (
    <ul className="space-y-1.5">
      {hotspot.map((h, i) => (
        <li key={h.id}>
          <button
            type="button"
            onClick={() => onPilih(h.id)}
            className={`flex w-full items-center gap-3.5 rounded-2xl px-3 py-3 text-left ${
              gelap ? (i === 0 ? "bg-white/10 ring-1 ring-white/15" : "") + " hover:bg-white/10" : "hover:bg-surface"
            }`}
          >
            <IkonHotspot tipe={h.tipe} className="size-11" />
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-medium leading-snug">{h.judul}</span>
              <span className={`block truncate text-sm ${gelap ? "text-white/60" : "text-muted"}`}>{h.subjudul ?? GAYA_HOTSPOT[h.tipe].label}</span>
            </span>
            <ChevronRight className={`size-5 shrink-0 ${gelap ? "text-white/60" : "text-muted"}`} />
          </button>
        </li>
      ))}
    </ul>
  );
}

// ---------- Panel "Di scene ini" (desktop) ----------
export function PanelScene({ scene, onHotspot, onEtika, onTutup }: { scene: Scene; onHotspot: (id: string) => void; onEtika: () => void; onTutup: () => void }) {
  return (
    <section className="rounded-3xl bg-deep/80 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-md" aria-label="Di scene ini">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-sun-400 uppercase">Di scene ini</p>
          <h2 className="mt-1.5 text-2xl font-semibold">{scene.nama}</h2>
        </div>
        <button type="button" onClick={onTutup} aria-label="Sembunyikan panel" className="grid size-10 place-items-center rounded-full text-white/80 hover:bg-white/10">
          <ChevronsRight className="size-5" />
        </button>
      </div>
      <p className="mt-3 text-[16px] leading-relaxed text-white/80">{scene.deskripsi}</p>
      {scene.hotspot.length > 0 && (
        <>
          <div className="mt-5 flex items-baseline justify-between border-t border-white/10 pt-5">
            <h3 className="text-lg font-semibold">Info konservasi</h3>
            <span className="text-sm text-white/60">{scene.hotspot.length} titik</span>
          </div>
          <div className="mt-3">
            <DaftarHotspot hotspot={scene.hotspot} onPilih={onHotspot} />
          </div>
        </>
      )}
      <button
        type="button"
        onClick={onEtika}
        className="mt-5 flex min-h-12 w-full items-center gap-2.5 rounded-2xl border border-sun-400/50 bg-sun-400/10 px-4 text-[15px] font-medium text-sun-400 hover:bg-sun-400/20"
      >
        <ShieldCheck className="size-5" /> Lihat lagi etika berkunjung
      </button>
    </section>
  );
}

// ---------- Minimap (V9) ----------
const ARAH = ["utara", "timur laut", "timur", "tenggara", "selatan", "barat daya", "barat", "barat laut"];
export const namaArah = (heading: number) => ARAH[Math.round((((heading % 360) + 360) % 360) / 45) % 8];

export function Minimap({
  tur,
  scene,
  heading,
  besar,
  ringkas = false,
  onBesar,
  onPilih,
}: {
  tur: Tur;
  scene: Scene;
  heading: number;
  besar: boolean;
  ringkas?: boolean;
  onBesar?: () => void;
  onPilih: (id: string) => void;
}) {
  const titik = tur.scene.filter((s) => s.peta);
  const garis = new Set<string>();
  for (const s of titik)
    for (const t of s.tautan) {
      const ke = tur.scene.find((x) => x.id === t.ke);
      if (ke?.peta) garis.add([s.id, ke.id].sort().join("|"));
    }
  const posisi = (id: string) => tur.scene.find((s) => s.id === id)?.peta;

  const peta = (
    <div className={`relative overflow-hidden rounded-2xl bg-deep ${ringkas ? "aspect-square" : "aspect-[5/4]"}`}>
      <Image src={tur.peta} alt="" fill sizes={besar ? "480px" : "260px"} className="object-cover" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        {[...garis].map((g) => {
          const [a, b] = g.split("|").map(posisi);
          return a && b ? <line key={g} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#fff" strokeWidth="0.9" vectorEffect="non-scaling-stroke" opacity="0.9" /> : null;
        })}
      </svg>
      {scene.peta && (
        <span
          className="pointer-events-none absolute size-0"
          style={{ left: `${scene.peta.x}%`, top: `${scene.peta.y}%`, transform: `rotate(${heading}deg)` }}
          aria-hidden="true"
        >
          <span className="absolute -left-[22px] -top-[44px] h-[44px] w-[44px] bg-sun-400/55 [clip-path:polygon(50%_100%,0_0,100%_0)]" />
        </span>
      )}
      {titik.map((s) => {
        const aktif = s.id === scene.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onPilih(s.id)}
            aria-label={`Pindah ke ${s.nama}`}
            aria-current={aktif ? "location" : undefined}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${
              aktif ? "size-5 border-white bg-sun-400 shadow-[0_0_0_3px_rgba(0,0,0,.25)]" : "size-3 border-white bg-white/60 hover:bg-white"
            }`}
            style={{ left: `${s.peta!.x}%`, top: `${s.peta!.y}%` }}
          />
        );
      })}
    </div>
  );

  if (ringkas) return peta;
  return (
    <section className={`rounded-3xl bg-deep/75 p-3.5 ring-1 ring-white/10 backdrop-blur-md transition-[width] ${besar ? "w-[440px]" : "w-[270px]"}`} aria-label="Peta scene">
      <div className="mb-2.5 flex items-center justify-between px-1">
        <h2 className="text-[15px] font-semibold">Peta scene</h2>
        {onBesar && (
          <button type="button" onClick={onBesar} aria-label={besar ? "Perkecil peta" : "Perbesar peta"} className="grid size-8 place-items-center rounded-lg text-white/80 hover:bg-white/10">
            {besar ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>
        )}
      </div>
      {peta}
      <p className="mt-2.5 flex items-start gap-2 px-1 text-[13px] leading-snug text-white/80">
        <span className="mt-1 size-2.5 shrink-0 rounded-full bg-sun-400" />
        {scene.tipe === "udara" ? "Pandangan udara · pilih titik untuk turun" : `Kamu di sini · menghadap ${namaArah(heading)}`}
      </p>
    </section>
  );
}

// ---------- CTA paket (I2) ----------
const ribuan = (n: number) => (n >= 1_000_000 ? `Rp${(n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt` : `Rp${Math.round(n / 1000)}rb`);

/** Tombol pil ringkas: selalu terlihat tapi tidak menutupi panorama. */
export function CtaPil({ paket, onKlik, className = "" }: { paket: InfoPaket; onKlik: () => void; className?: string }) {
  return (
    <Link
      href={paket.href}
      onClick={onKlik}
      className={`flex min-h-12 items-center gap-1.5 whitespace-nowrap rounded-full bg-white pl-4 pr-3 font-semibold text-laut-800 shadow-lg shadow-deep/20 hover:bg-laut-50 lg:min-h-14 lg:gap-2 lg:pl-6 lg:pr-5 ${className}`}
    >
      <span className="text-[15px] lg:text-[17px]">Lihat paket</span>
      {paket.jumlah > 0 && <span className="text-[13px] font-normal text-muted max-[369px]:hidden lg:text-sm">mulai {ribuan(paket.termurah)}</span>}
      <ArrowRight className="size-4.5" />
    </Link>
  );
}

export function CtaPaket({ paket, onKlik, ringkas = false }: { paket: InfoPaket; onKlik: () => void; ringkas?: boolean }) {
  if (ringkas)
    return (
      <Link href={paket.href} onClick={onKlik} className="flex items-center gap-3 rounded-[22px] bg-white py-3 pl-5 pr-3 text-ink shadow-xl">
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-semibold">Lihat paket di lokasi ini</span>
          <span className="block truncate text-sm text-muted">
            {paket.jumlah > 0 ? `${paket.jumlah} paket · mulai ${rupiah(paket.termurah)}` : "Tanya pengelola desa"}
          </span>
        </span>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-laut-700 text-white">
          <ArrowRight className="size-5" />
        </span>
      </Link>
    );
  return (
    <div className="w-[340px] rounded-3xl bg-white p-4 text-ink shadow-2xl">
      <div className="flex items-center gap-3.5">
        {paket.cover && (
          <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface">
            <Image src={paket.cover} alt="" fill sizes="64px" className="object-cover" />
          </span>
        )}
        <div className="min-w-0">
          <p className="text-sm text-muted">{paket.jumlah > 0 ? `${paket.jumlah} paket singgah di sini` : "Belum ada paket"}</p>
          {paket.jumlah > 0 && (
            <p className="text-xl font-semibold">
              Mulai {rupiah(paket.termurah)} <span className="text-base font-medium">/orang</span>
            </p>
          )}
        </div>
      </div>
      <Link
        href={paket.href}
        onClick={onKlik}
        className="mt-3.5 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-laut-700 text-[16px] font-semibold text-white hover:bg-laut-800"
      >
        Lihat paket di lokasi ini <ArrowRight className="size-4.5" />
      </Link>
    </div>
  );
}

// ---------- Layar etika berkunjung (K3) ----------
export function LayarEtika({
  tur,
  destinasi,
  statistik,
  onMulai,
  onLewati,
  kembaliHref,
}: {
  tur: Tur;
  destinasi: InfoDestinasi;
  statistik: string;
  onMulai: () => void;
  onLewati: () => void;
  kembaliHref: string;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-deep/60 backdrop-blur-xl" role="dialog" aria-modal="true" aria-labelledby="etika-judul">
      <Link
        href={kembaliHref}
        aria-label="Tutup dan kembali ke artikel"
        className="fixed right-4 top-4 z-10 grid size-12 place-items-center rounded-full bg-deep/70 text-white ring-1 ring-white/15 sm:right-8 sm:top-6 sm:size-14"
      >
        <X className="size-6" />
      </Link>
      <div className="flex min-h-full items-end justify-center sm:items-center sm:p-8">
        <div className="grid w-full max-w-[920px] overflow-hidden rounded-t-[28px] bg-white text-ink sm:rounded-[28px] md:grid-cols-[0.95fr_1.35fr]">
          <div className="relative isolate hidden min-h-[520px] flex-col justify-end p-7 text-white md:flex">
            {destinasi.foto && <Image src={destinasi.foto} alt="" fill sizes="400px" className="-z-10 object-cover" />}
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-deep/85 via-deep/10 to-transparent" />
            <p className="text-xs font-semibold tracking-[0.16em] text-sun-400 uppercase">Tur 360° · {destinasi.nama}</p>
            <p className="mt-3 text-[28px] font-semibold leading-tight">{tur.sorotan}</p>
            <p className="mt-3 text-[15px] text-white/80">{statistik}</p>
          </div>
          <div className="p-6 sm:p-9">
            <p className="text-xs font-semibold tracking-[0.16em] text-laut-700 uppercase md:hidden">Tur 360° · {destinasi.nama}</p>
            <h2 id="etika-judul" className="mt-2 text-[28px] font-semibold leading-tight sm:text-[32px] md:mt-0">
              Sebelum mulai, kenali etikanya
            </h2>
            <p className="mt-2 text-[16px] text-muted">Berlaku juga saat kamu datang langsung ke lokasi.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {tur.aturan.map((a) => {
                const ik = IKON_ATURAN[a.ikon];
                return (
                  <li key={a.judul} className="rounded-2xl bg-surface p-4 sm:p-5">
                    <span className="grid size-10 place-items-center rounded-xl bg-white shadow-sm">
                      <ik.Ikon className="size-5" style={{ color: ik.warna }} />
                    </span>
                    <p className="mt-3 text-[16px] font-semibold leading-snug">{a.judul}</p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{a.teks}</p>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted">
              <BadgeCheck className="size-4.5 shrink-0 text-ok" /> Disusun bersama {tur.disusunBersama}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                autoFocus
                onClick={onMulai}
                className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-laut-700 text-[17px] font-semibold text-white hover:bg-laut-800"
              >
                Saya paham, mulai tur <ArrowRight className="size-5" />
              </button>
              <button type="button" onClick={onLewati} className="min-h-14 rounded-2xl border border-line px-6 text-[17px] font-medium hover:bg-surface">
                Lewati
              </button>
            </div>
            <p className="mt-4 text-[13px] text-muted">Layar ini muncul sekali per sesi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
