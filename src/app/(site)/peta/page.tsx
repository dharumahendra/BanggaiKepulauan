import type { Metadata } from "next";
import Link from "next/link";
import { Map as MapIcon } from "lucide-react";
import { Breadcrumb } from "@/components/ui";
import { kecamatanUrutAbjad } from "@/lib/data";

export const metadata: Metadata = { title: "Peta", description: "Peta 12 kecamatan Banggai Kepulauan." };

// Peta GIS (MapLibre + GeoJSON batas BIG) dikerjakan bersama desain detail kecamatan.
export default function PetaPage() {
  return (
    <section className="container-page py-10 sm:py-12">
      <Breadcrumb items={[{ href: "/", label: "Beranda" }, { label: "Peta" }]} />
      <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Peta kabupaten</h1>
      <div className="mt-8 flex flex-col items-center rounded-3xl bg-surface px-6 py-16 text-center">
        <MapIcon className="size-12 text-laut-700" />
        <p className="mt-4 text-xl font-semibold">Peta interaktif sedang disiapkan</p>
        <p className="mt-2 max-w-md text-muted">Batas kecamatan dan desa dari Badan Informasi Geospasial, plus titik atraksi, homestay, UMKM, dan dermaga.</p>
      </div>
      <h2 className="mt-10 text-xl font-semibold">Buka per kecamatan</h2>
      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {kecamatanUrutAbjad().map((k) => (
          <li key={k.slug}>
            <Link href={`/kecamatan/${k.slug}`} className="block rounded-xl border border-line px-4 py-3 hover:bg-surface">
              <span className="font-medium">{k.nama}</span>
              <span className="block text-xs text-muted">Ibu kota {k.ibuKota}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
