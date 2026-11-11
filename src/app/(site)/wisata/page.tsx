import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Backpack } from "lucide-react";
import { HeroSearch } from "@/components/landing/HeroSearch";
import { DestinasiKatalog } from "@/components/wisata/DestinasiKatalog";
import { destinasiKartu, kecamatanUrutAbjad, semuaDestinasi, semuaPaket } from "@/lib/data";
import { rupiahRingkas } from "@/lib/format";

export const metadata: Metadata = {
  title: "Wisata",
  description: "Destinasi wisata alam, bahari, dan budaya di 12 kecamatan Banggai Kepulauan, lengkap dengan artikel dan Virtual Tour 360°.",
};

export default function WisataPage() {
  const paket = semuaPaket();
  const termurah = Math.min(...paket.map((p) => p.harga));
  const kecamatan = kecamatanUrutAbjad();
  // Unggulan & yang punya tur tampil lebih dulu
  const destinasi = semuaDestinasi()
    .map(destinasiKartu)
    .sort((a, b) => Number(b.tur) - Number(a.tur) || Number(Boolean(b.unggulan)) - Number(Boolean(a.unggulan)));

  return (
    <>
      {/* Menu Paket Wisata — paling atas, terlihat tanpa menggulir (PRD A4) */}
      <section className="container-page pt-5 sm:pt-8">
        <div className="relative isolate overflow-hidden rounded-3xl bg-deep text-white">
          <Image src="/images/hero-perahu.webp" alt="" fill priority sizes="(min-width: 1140px) 1140px, 100vw" className="-z-10 object-cover opacity-55" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-deep via-deep/80 to-deep/30" />
          <div className="flex flex-col gap-5 p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-sun-400 uppercase">
                  <Backpack className="size-4" /> Paket Wisata
                </p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight sm:text-[32px]">Perahu, homestay, dan pemandu dalam satu paket</h2>
                <p className="mt-1.5 text-[15px] text-white/80">
                  {paket.length} paket dari desa · mulai {rupiahRingkas(termurah)}/orang · pesan lewat WhatsApp pengelola
                </p>
              </div>
              <Link
                href="/paket"
                className="flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-laut-800 hover:bg-laut-50"
              >
                Lihat paket wisata <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="hidden lg:block">
              <HeroSearch kecamatan={kecamatan} />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <p className="eyebrow">Destinasi wisata</p>
        <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight sm:text-4xl">Mau ke mana di Banggai Kepulauan?</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          Baca artikel tiap tempat sebelum berangkat. Destinasi berlabel 360° bisa dijelajahi lewat Virtual Tour langsung dari HP.
        </p>
        <Suspense fallback={<div className="mt-6 h-[480px] rounded-2xl bg-surface" aria-busy="true" />}>
          <DestinasiKatalog destinasi={destinasi} kecamatan={kecamatan.map((k) => ({ slug: k.slug, nama: k.nama }))} />
        </Suspense>
      </section>
    </>
  );
}
