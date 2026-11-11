import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TurApp } from "@/features/tour/TurApp";
import { destinasiKartu, getDestinasi, getTur, paketDiDestinasi, semuaDestinasi } from "@/lib/data";

// Halaman layar penuh di luar layout navbar (PRD: struktur kode yang disarankan).

export function generateStaticParams() {
  return semuaDestinasi()
    .filter((d) => getTur(d.slug))
    .map((d) => ({ slug: d.slug }));
}

export const viewport: Viewport = { themeColor: "#0c2831" };

export async function generateMetadata({ params }: PageProps<"/wisata/[slug]/virtual-tour">): Promise<Metadata> {
  const { slug } = await params;
  const d = getDestinasi(slug);
  if (!d) return {};
  return {
    title: `Virtual Tour 360° ${d.nama}`,
    description: `Jelajahi ${d.nama} secara virtual dari HP: panorama 360°, pandangan drone, dan info konservasi di setiap titik.`,
    openGraph: { images: d.foto ? [d.foto] : undefined },
  };
}

export default function VirtualTourPage({ params }: PageProps<"/wisata/[slug]/virtual-tour">) {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-deep" aria-busy="true" />}>
      <VirtualTour params={params} />
    </Suspense>
  );
}

async function VirtualTour({ params }: { params: PageProps<"/wisata/[slug]/virtual-tour">["params"] }) {
  const { slug } = await params;
  const a = getDestinasi(slug);
  const tur = getTur(slug);
  if (!a || !tur) notFound();
  const d = destinasiKartu(a);
  const { paket } = paketDiDestinasi(slug);
  const info = {
    jumlah: paket.length,
    termurah: paket.length ? Math.min(...paket.map((p) => p.harga)) : 0,
    cover: paket[0]?.cover,
    href: paket.length === 1 ? `/paket/${paket[0].slug}` : `/wisata/${slug}#paket`,
  };
  return (
    <TurApp
      tur={tur}
      destinasi={{ slug, nama: a.nama, lokasi: `Desa ${d.desaNama}, ${d.kecamatanNama}`, foto: a.foto }}
      paket={info}
    />
  );
}
