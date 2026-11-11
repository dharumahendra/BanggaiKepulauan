import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/ui";
import { CekForm } from "@/components/CekForm";

export const metadata: Metadata = { title: "Cek pesanan", description: "Cek status reservasi paket atau pesanan oleh-oleh dengan kode dan nomor WhatsApp." };

export default function CekPage() {
  return (
    <section className="bg-surface">
      <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <Breadcrumb items={[{ href: "/", label: "Beranda" }, { label: "Cek pesanan" }]} />
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Cek status pesanan</h1>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-muted">
            Masukkan kode reservasi paket (RSV-…) atau kode pesanan oleh-oleh (PSN-…) beserta nomor WhatsApp yang dipakai saat memesan.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            <li>• Menunggu konfirmasi → Dikonfirmasi → DP diterima → Selesai</li>
            <li>• Status diperbarui pengelola desa setelah chat WhatsApp.</li>
          </ul>
        </div>
        <Suspense fallback={<div className="h-80 rounded-3xl bg-white" />}>
          <CekForm />
        </Suspense>
      </div>
    </section>
  );
}
