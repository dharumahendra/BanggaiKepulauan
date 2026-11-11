"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe, MessageCircle, X } from "lucide-react";
import { LogoMark } from "./Logo";
import { SITE } from "@/lib/site";
import { waLink } from "@/lib/whatsapp";

const FAQ = [
  { q: "Bagaimana cara memesan paket?", a: "Pilih paket, atur tanggal & peserta, isi data pemesan, lalu konfirmasi lewat WhatsApp pengelola desa. Tidak perlu akun.", href: "/info#cara-memesan" },
  { q: "Kapan saya membayar?", a: "Setelah pengelola mengonfirmasi ketersediaan. DP dibayar via QRIS atau transfer ke rekening BUMDes/Pokdarwis.", href: "/info#syarat" },
  { q: "Bagaimana kalau cuaca buruk?", a: "Jadwal bisa diganti gratis atau DP dikembalikan penuh bila batal karena cuaca/gelombang tinggi.", href: "/info#faq" },
  { q: "Bisa titip oleh-oleh untuk diambil saat datang?", a: "Bisa. Pre-order produk UMKM lalu hubungkan ke kode reservasi; ambil di desa saat kunjungan.", href: "/produk" },
];

export function FloatingAssist() {
  const [panel, setPanel] = useState<null | "ai" | "eng">(null);
  return (
    <div data-floating-assist className="no-print fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2.5 sm:bottom-6 sm:right-6">
      {panel === "ai" && (
        <div role="dialog" aria-label="Bantuan cepat" className="w-[min(340px,calc(100vw-32px))] rounded-2xl border border-line bg-white p-4 shadow-2xl shadow-deep/20">
          <div className="flex items-center justify-between">
            <p className="font-medium">Tanya cepat</p>
            <button type="button" onClick={() => setPanel(null)} aria-label="Tutup" className="grid size-8 place-items-center rounded-full hover:bg-surface">
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-2 max-h-[50vh] space-y-2 overflow-y-auto">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-xl bg-surface px-3 py-2.5">
                <summary className="cursor-pointer text-sm font-medium">{f.q}</summary>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  {f.a}{" "}
                  <Link href={f.href} className="text-link" onClick={() => setPanel(null)}>
                    Selengkapnya
                  </Link>
                </p>
              </details>
            ))}
          </div>
          <a
            href={waLink(SITE.wa, "Halo, saya ingin bertanya tentang wisata di Banggai Kepulauan.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-wa px-4 py-2.5 text-sm font-medium text-white hover:bg-wa-dark"
          >
            <MessageCircle className="size-4" /> Tanya petugas via WhatsApp
          </a>
        </div>
      )}
      {panel === "eng" && (
        <div role="status" className="w-[min(300px,calc(100vw-32px))] rounded-2xl border border-line bg-white p-4 text-sm shadow-2xl shadow-deep/20">
          <p className="font-medium">English version is coming soon.</p>
          <p className="mt-1 text-muted">Meanwhile, village guides can reply in basic English on WhatsApp.</p>
        </div>
      )}
      <button
        type="button"
        onClick={() => setPanel((p) => (p === "ai" ? null : "ai"))}
        aria-expanded={panel === "ai"}
        className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-base font-semibold text-link shadow-lg shadow-deep/15"
      >
        <LogoMark className="size-6" /> AI
      </button>
      <button
        type="button"
        onClick={() => setPanel((p) => (p === "eng" ? null : "eng"))}
        aria-expanded={panel === "eng"}
        className="hidden items-center gap-2 rounded-full bg-link px-4 py-2.5 text-base font-semibold text-white shadow-lg shadow-link/30 sm:flex"
      >
        <Globe className="size-5" /> ENG
      </button>
    </div>
  );
}
