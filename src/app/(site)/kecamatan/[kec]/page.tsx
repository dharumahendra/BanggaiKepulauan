import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Hourglass } from "lucide-react";
import { Breadcrumb } from "@/components/ui";
import { PaketCard } from "@/components/PaketCard";
import { DestinasiCard } from "@/components/DestinasiCard";
import { atraksiDiKecamatan, desaDiKecamatan, destinasiKartu, getKecamatan, paketDiKecamatan, semuaKecamatan } from "@/lib/data";

// CATATAN: halaman detail kecamatan (sub-navbar Tentang, Wisata, Statistik, Desa, Peta)
// menunggu desain. Versi ini sementara agar tautan dari navbar & kartu tidak buntu.

export function generateStaticParams() {
  return semuaKecamatan().map((k) => ({ kec: k.slug }));
}

export async function generateMetadata({ params }: PageProps<"/kecamatan/[kec]">): Promise<Metadata> {
  const { kec } = await params;
  const k = getKecamatan(kec);
  return k ? { title: `Kecamatan ${k.nama}`, description: `Wisata, desa, dan paket di Kecamatan ${k.nama}, ibu kota ${k.ibuKota}.` } : {};
}

export default function KecamatanDetailPage({ params }: PageProps<"/kecamatan/[kec]">) {
  return (
    <Suspense fallback={<div className="container-page h-[60vh] py-10" aria-busy="true" />}>
      <KecamatanDetail params={params} />
    </Suspense>
  );
}

async function KecamatanDetail({ params }: { params: PageProps<"/kecamatan/[kec]">["params"] }) {
  const { kec } = await params;
  const k = getKecamatan(kec);
  if (!k) notFound();
  const paket = paketDiKecamatan(k.slug);
  const atraksi = atraksiDiKecamatan(k.slug);
  const desa = desaDiKecamatan(k.slug);
  const fmt = (n: number, d = 0) => n.toLocaleString("id-ID", { maximumFractionDigits: d });

  return (
    <>
      <section className="bg-surface">
        <div className="container-page py-10 sm:py-12">
          <Breadcrumb items={[{ href: "/", label: "Beranda" }, { href: "/kecamatan", label: "Kecamatan" }, { label: k.nama }]} />
          <p className="mt-5 text-sm text-muted">{k.kode}</p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">Kecamatan {k.nama}</h1>
          <p className="mt-3 text-[17px] text-muted">Ibu kota {k.ibuKota}</p>
          <dl className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { n: fmt(k.luasKm2, 2), l: "km² luas" },
              { n: fmt(k.penduduk), l: "penduduk (est. 2025)" },
              { n: String(k.jumlahDesa), l: "desa/kelurahan" },
              { n: k.jumlahPulau ? String(k.jumlahPulau) : "—", l: "pulau" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-line bg-white p-4">
                <dt className="text-2xl font-semibold text-laut-700">{s.n}</dt>
                <dd className="mt-1 text-[13px] text-muted">{s.l}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs text-muted">Sumber: BPS Banggai Kepulauan, Dalam Angka 2026.</p>
        </div>
      </section>

      <div className="container-page py-12">
        <p className="flex items-start gap-3 rounded-2xl border border-dashed border-line px-5 py-4 text-sm text-muted">
          <Hourglass className="mt-0.5 size-4 shrink-0" />
          Halaman lengkap kecamatan (sub-menu Tentang, Wisata, Statistik, Desa, dan Peta GIS) sedang disiapkan.
        </p>

        {atraksi.length > 0 && (
          <>
            <h2 className="mt-10 text-2xl font-semibold">Destinasi wisata di {k.nama}</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
              {atraksi.map((a) => (
                <DestinasiCard key={a.slug} d={destinasiKartu(a)} />
              ))}
            </div>
          </>
        )}

        <h2 className="mt-12 text-2xl font-semibold">Paket wisata di {k.nama}</h2>
        {paket.length ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paket.map((p) => (
              <PaketCard key={p.slug} paket={p} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-muted">Segera hadir. Paket dari desa-desa di kecamatan ini sedang didata.</p>
        )}


        {desa.length > 0 && (
          <>
            <h2 className="mt-12 text-2xl font-semibold">Desa yang sudah terdata</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {desa.map((d) => (
                <li key={d.slug} className="rounded-full border border-line px-4 py-2 text-sm">
                  {d.nama}
                  {d.desaWisata && <span className="ml-2 rounded-full bg-sun-100 px-2 py-0.5 text-[11px] text-sun-800">Desa wisata</span>}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
