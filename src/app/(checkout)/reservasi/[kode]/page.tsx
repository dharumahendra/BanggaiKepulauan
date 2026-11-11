import type { Metadata } from "next";
import { Suspense } from "react";
import { ReservasiStatus } from "@/components/reservasi/ReservasiStatus";

export const metadata: Metadata = { title: "Status reservasi", robots: { index: false } };

export default function ReservasiStatusPage({ params }: PageProps<"/reservasi/[kode]">) {
  return (
    <Suspense fallback={<div className="container-page h-[60vh] py-10" aria-busy="true" />}>
      <Isi params={params} />
    </Suspense>
  );
}

async function Isi({ params }: { params: PageProps<"/reservasi/[kode]">["params"] }) {
  const { kode } = await params;
  return <ReservasiStatus kode={decodeURIComponent(kode)} />;
}
