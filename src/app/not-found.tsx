import Link from "next/link";
import { Compass } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <Logo />
      <Compass className="mt-12 size-12 text-laut-700" />
      <h1 className="mt-5 text-3xl font-semibold">Halaman tidak ditemukan</h1>
      <p className="mt-3 max-w-md text-muted">Tautan mungkin sudah berubah. Coba mulai dari daftar paket wisata atau oleh-oleh.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/paket" className="rounded-full bg-laut-700 px-6 py-3 font-medium text-white">
          Lihat paket
        </Link>
        <Link href="/" className="rounded-full border border-line px-6 py-3 font-medium">
          Beranda
        </Link>
      </div>
    </div>
  );
}
