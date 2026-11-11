import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/ui";
import { PaketCard } from "@/components/PaketCard";
import { PaketKatalog, type PaketRingkas } from "@/components/paket/PaketKatalog";
import { JadwalStrip } from "@/components/paket/JadwalStrip";
import { CaraMemesan } from "@/components/CaraMemesan";
import { desaPaket, kecamatanPaket, kecamatanUrutAbjad, semuaPaket } from "@/lib/data";
import { rupiahRingkas } from "@/lib/format";

export const metadata: Metadata = {
  title: "Semua paket wisata",
  description: "Paket wisata dari desa-desa di Banggai Kepulauan. Harga estimasi, konfirmasi langsung ke pengelola desa lewat WhatsApp.",
};

export default function SemuaPaketPage() {
  const paket = semuaPaket();
  const kecDenganPaket = new Set(paket.flatMap((p) => kecamatanPaket(p).map((k) => k.slug)));
  const termurah = Math.min(...paket.map((p) => p.harga));
  const populer = [...paket].sort((a, b) => b.dipesan - a.dipesan)[0];

  const ringkas: PaketRingkas[] = paket.map((p) => ({
    slug: p.slug,
    nama: p.nama,
    kategori: p.kategori,
    kecamatan: kecamatanPaket(p).map((k) => k.slug),
    desaNama: desaPaket(p).map((d) => d.nama),
    durasiHari: p.durasiHari,
    harga: p.harga,
    dipesan: p.dipesan,
    node: <PaketCard paket={p} />,
  }));

  const opsiKec = kecamatanUrutAbjad()
    .map((k) => ({ slug: k.slug, nama: k.nama, jumlah: ringkas.filter((p) => p.kecamatan.includes(k.slug)).length }))
    .filter((k) => k.jumlah > 0);

  return (
    <>
      <section className="bg-surface">
        <div className="container-page flex flex-col gap-8 py-10 sm:py-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Breadcrumb items={[{ href: "/", label: "Beranda" }, { href: "/wisata", label: "Wisata" }, { label: "Semua paket" }]} />
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-[52px]">Semua paket wisata</h1>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted">
              Paket dari desa-desa di Banggai Kepulauan. Harga tertera adalah estimasi; harga final dikonfirmasi pengelola desa lewat WhatsApp.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-3">
            {[
              { n: String(paket.length), l: "paket aktif" },
              { n: String(kecDenganPaket.size), l: "kecamatan" },
              { n: rupiahRingkas(termurah), l: "harga termurah" },
            ].map((s) => (
              <div key={s.l} className="min-w-0 rounded-2xl border border-line bg-white px-4 py-4 sm:min-w-[134px]">
                <dt className="text-2xl font-semibold text-laut-700 sm:text-[28px]">{s.n}</dt>
                <dd className="mt-1 text-[13px] text-muted">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <JadwalStrip paket={populer} />

      <Suspense fallback={<div className="container-page py-10 text-muted">Memuat paket…</div>}>
        <PaketKatalog paket={ringkas} kecamatan={opsiKec} />
      </Suspense>

      <CaraMemesan />
    </>
  );
}
