import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, MapPin, MessageCircle, Package, ShoppingBag, Store } from "lucide-react";
import { Breadcrumb } from "@/components/ui";
import { ProdukKatalog } from "@/components/produk/ProdukKatalog";
import { kecamatanUrutAbjad, lokasiDesa, produkLengkap, produkUMKM, semuaProduk, semuaUMKM } from "@/lib/data";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Oleh-oleh UMKM",
  description: "Belanja oleh-oleh langsung dari UMKM desa di Banggai Kepulauan. Pre-order lalu ambil saat berkunjung, atau minta dikirim.",
};

export default function ProdukPage() {
  const produk = semuaProduk().map(produkLengkap);
  const umkm = semuaUMKM();
  const unggulan = umkm.filter((u) => u.unggulan);
  const kecDenganProduk = new Set(produk.map((p) => p.kecamatanSlug));
  const kecamatan = kecamatanUrutAbjad().filter((k) => kecDenganProduk.has(k.slug));

  return (
    <>
      <section className="bg-surface">
        <div className="container-page grid items-center gap-10 py-10 sm:py-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Breadcrumb items={[{ href: "/", label: "Beranda" }, { label: "Oleh-oleh" }]} />
            <h1 className="mt-6 text-[40px] font-semibold leading-[1.08] tracking-tight sm:text-[58px]">Oleh-oleh dari dapur dan tangan warga Peleng</h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted">
              Belanja langsung dari UMKM desa. Pesan sekarang lalu ambil saat berkunjung, atau minta dikirim dengan ongkir yang dikonfirmasi pengelola.
            </p>
            <dl className="mt-8 flex gap-10">
              {[
                { n: umkm.length, l: "UMKM aktif" },
                { n: produk.length, l: "produk tayang" },
                { n: SITE.desaFokusKKN.length, l: "desa fokus" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="text-3xl font-semibold text-laut-700">{s.n}</dt>
                  <dd className="mt-1 text-[13px] text-muted">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid h-[300px] grid-cols-[1.75fr_1fr] gap-3 sm:h-[392px] sm:gap-4">
            <div className="relative overflow-hidden rounded-3xl">
              <Image src="/images/umkm-pasar.webp" alt="Produk olahan ikan UMKM Mama Fitri" fill priority sizes="(min-width: 1024px) 340px, 60vw" className="object-cover" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2.5 rounded-xl bg-white/95 px-3 py-2 text-xs sm:bottom-4 sm:left-4">
                <Store className="size-4 text-laut-700" />
                <div className="leading-tight">
                  <p className="font-medium text-ink">UMKM Mama Fitri</p>
                  <p className="text-muted">{lokasiDesa("sambulangan")}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-rows-[1.6fr_1fr] gap-3 sm:gap-4">
              <div className="relative overflow-hidden rounded-3xl">
                <Image src="/images/umkm-anyaman.webp" alt="Anyaman warga" fill sizes="200px" className="object-cover" />
              </div>
              <div className="flex flex-col justify-between rounded-3xl bg-laut-700 p-4 text-white sm:p-5">
                <Package className="size-6 text-sun-400" />
                <p className="text-sm font-medium leading-snug sm:text-lg">Pre-order, ambil saat kunjungan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <ul className="container-page grid gap-5 py-7 md:grid-cols-3">
          {[
            { Icon: ShoppingBag, j: "Pilih produk dari beberapa desa", t: "Satu keranjang untuk semua UMKM" },
            { Icon: MapPin, j: "Ambil di desa atau kirim", t: "Ambil bisa dihubungkan ke kode reservasi" },
            { Icon: MessageCircle, j: "Konfirmasi via WhatsApp", t: "Pesanan dipecah otomatis per desa" },
          ].map(({ Icon, j, t }) => (
            <li key={j} className="flex items-center gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-laut-100 text-laut-700">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-medium">{j}</p>
                <p className="text-[13px] text-muted">{t}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page py-14 sm:py-16">
        <Suspense fallback={<div className="h-[600px]" />}>
          <ProdukKatalog produk={produk} kecamatan={kecamatan.map((k) => ({ slug: k.slug, nama: k.nama }))} />
        </Suspense>
      </section>

      <section className="bg-surface py-14 sm:py-16">
        <div className="container-page">
          <p className="eyebrow">Kenali pembuatnya</p>
          <h2 className="mt-2 text-[28px] font-semibold tracking-tight sm:text-4xl">UMKM unggulan dari desa fokus</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {unggulan.map((u) => (
              <article key={u.slug} className="flex flex-col rounded-2xl border border-line bg-white p-5">
                <div className="flex items-center gap-3.5">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-surface">
                    {u.foto && <Image src={u.foto} alt="" fill sizes="56px" className="object-cover" />}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{u.nama}</h3>
                    <p className="text-[13px] text-muted">{u.pemilik}</p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/85">{u.cerita}</p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5 text-[13px]">
                  <span className="flex items-center gap-1.5 text-link">
                    <MapPin className="size-3.5" /> {lokasiDesa(u.desa)}
                  </span>
                  <Link href={`/produk?umkm=${u.slug}`} className="flex items-center gap-1 font-medium text-laut-800">
                    {produkUMKM(u.slug).length} produk <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-deep text-white">
        <div className="container-page flex flex-col gap-6 border-b border-white/10 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">Punya usaha di desa Anda?</h2>
            <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-white/75">
              Pelaku UMKM tidak perlu membuat akun. Datangi operator desa atau Pokdarwis, bawa foto produk dan harga, lalu produk Anda tayang di portal ini.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/kecamatan" className="flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-medium text-laut-800 hover:bg-laut-50">
              Cari operator desa <ArrowRight className="size-4" />
            </Link>
            <Link href="/info#panduan" className="rounded-full border border-white/40 px-6 py-3.5 font-medium hover:bg-white/10">
              Unduh panduan (PDF)
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
