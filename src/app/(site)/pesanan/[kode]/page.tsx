import type { Metadata } from "next";
import { Suspense } from "react";
import { PesananStatus } from "@/components/produk/PesananStatus";

export const metadata: Metadata = { title: "Status pesanan", robots: { index: false } };

export default function PesananPage({ params }: PageProps<"/pesanan/[kode]">) {
  return (
    <div className="container-page py-12">
      <Suspense fallback={<div className="h-80" aria-busy="true" />}>
        <Isi params={params} />
      </Suspense>
    </div>
  );
}

async function Isi({ params }: { params: PageProps<"/pesanan/[kode]">["params"] }) {
  const { kode } = await params;
  return <PesananStatus kode={decodeURIComponent(kode)} />;
}
