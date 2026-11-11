import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { semuaKecamatan } from "@/lib/data";

// Beranda hanya berisi hero. Pencarian paket & konten wisata lengkap ada di /wisata.
export default function BerandaPage() {
  const jumlahKecamatan = semuaKecamatan().length;

  return (
    <section className="relative isolate overflow-hidden bg-deep">
      <Image src="/images/hero-perahu.webp" alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-deep/45 via-deep/40 to-deep/70" />
      <div className="container-page flex min-h-[620px] flex-col items-center justify-center py-16 text-center text-white">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
          <Compass className="size-4" /> Wisata &amp; paket desa · {jumlahKecamatan} kecamatan
        </span>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          Dari Telaga Paisu Pok sampai rumah capungan Banggai
        </h1>
        <p className="mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
          Pilih kecamatan tujuan, lihat harga total sebelum berangkat, lalu pesan paket langsung ke pengelola desa lewat WhatsApp.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/wisata" className="flex items-center gap-2 rounded-full bg-white px-7 py-4 text-base font-medium text-laut-800 hover:bg-laut-50">
            Jelajahi wisata <ArrowRight className="size-5" />
          </Link>
          <Link href="/produk" className="rounded-full border border-white/40 px-7 py-4 text-base font-medium hover:bg-white/10">
            Oleh-oleh UMKM
          </Link>
        </div>
      </div>
    </section>
  );
}
