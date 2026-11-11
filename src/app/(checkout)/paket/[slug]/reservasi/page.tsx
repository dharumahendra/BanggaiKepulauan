import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Stepper } from "@/components/reservasi/Stepper";
import { FormPemesan } from "@/components/reservasi/FormPemesan";
import { getPaket, semuaPaket } from "@/lib/data";

export const metadata: Metadata = { title: "Data pemesan", robots: { index: false } };

export function generateStaticParams() {
  return semuaPaket().map((p) => ({ slug: p.slug }));
}

export default function ReservasiPage({ params }: PageProps<"/paket/[slug]/reservasi">) {
  return (
    <Suspense fallback={<div className="container-page h-[80vh] py-10" aria-busy="true" />}>
      <Reservasi params={params} />
    </Suspense>
  );
}

async function Reservasi({ params }: { params: PageProps<"/paket/[slug]/reservasi">["params"] }) {
  const { slug } = await params;
  const paket = getPaket(slug);
  if (!paket) notFound();

  return (
    <>
      <section className="bg-surface">
        <div className="container-page py-8 sm:py-10">
          <Stepper aktif={2} />
          <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">Data pemesan</h1>
          <p className="mt-3 text-[17px] text-muted">Isi sekali. Kami buatkan kode reservasi dan pesan WhatsApp untuk pengelola desa.</p>
        </div>
      </section>
      <Suspense fallback={<div className="container-page h-[600px] py-10" />}>
        <FormPemesan paket={paket} />
      </Suspense>
    </>
  );
}
