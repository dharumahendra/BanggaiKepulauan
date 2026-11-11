import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { KeranjangView } from "@/components/produk/KeranjangView";

export const metadata: Metadata = { title: "Keranjang", robots: { index: false } };

export default function KeranjangPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ href: "/", label: "Beranda" }, { href: "/produk", label: "Oleh-oleh" }, { label: "Keranjang" }]} />
      <h1 className="mb-8 mt-5 text-4xl font-semibold tracking-tight">Keranjang</h1>
      <KeranjangView />
    </div>
  );
}
