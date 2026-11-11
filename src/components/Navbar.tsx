"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { Logo } from "./Logo";
import { useKeranjang } from "@/lib/store";
import type { Kecamatan } from "@/lib/types";

const MENU = [
  { href: "/", label: "Beranda" },
  { href: "/kecamatan", label: "Kecamatan", dropdown: true },
  { href: "/wisata", label: "Wisata" },
  { href: "/produk", label: "Oleh-oleh" },
  { href: "/peta", label: "Peta" },
  { href: "/cek", label: "Cek Pesanan" },
];

function aktif(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/wisata") return pathname.startsWith("/wisata") || pathname.startsWith("/paket");
  if (href === "/produk") return pathname.startsWith("/produk") || pathname.startsWith("/keranjang") || pathname.startsWith("/umkm");
  return pathname.startsWith(href);
}

export function Navbar({ kecamatan }: { kecamatan: Kecamatan[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-[78px]">
        <Logo />
        <Suspense fallback={<NavFallback />}>
          <NavLinks kecamatan={kecamatan} />
        </Suspense>
      </div>
    </header>
  );
}

function NavFallback() {
  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Menu utama">
      {MENU.map((m) => (
        <Link key={m.href} href={m.href} className="rounded-xl px-4 py-2.5 text-[15px] text-ink">
          {m.label}
        </Link>
      ))}
    </nav>
  );
}

function NavLinks({ kecamatan }: { kecamatan: Kecamatan[] }) {
  const pathname = usePathname() ?? "";
  const [buka, setBuka] = useState(false);
  const [mobile, setMobile] = useState(false);
  const dropRef = useRef<HTMLLIElement>(null);
  const keranjang = useKeranjang();
  const jumlah = keranjang.item.reduce((s, i) => s + i.qty, 0);

  // Tutup menu saat pindah halaman / klik di luar
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setBuka(false);
    setMobile(false);
  }
  useEffect(() => {
    if (!buka) return;
    const onDoc = (e: MouseEvent) => {
      if (!dropRef.current?.contains(e.target as Node)) setBuka(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBuka(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [buka]);

  const pill = (on: boolean) =>
    `rounded-xl px-4 py-2.5 text-[15px] transition-colors ${on ? "bg-laut-100 font-medium text-link" : "text-ink hover:bg-surface"}`;

  return (
    <>
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Menu utama">
        <ul className="flex items-center gap-1">
          {MENU.map((m) =>
            m.dropdown ? (
              <li key={m.href} className="relative" ref={dropRef}>
                <button
                  type="button"
                  className={`${pill(aktif(pathname, m.href))} flex items-center gap-1.5`}
                  aria-expanded={buka}
                  aria-haspopup="true"
                  onClick={() => setBuka((v) => !v)}
                >
                  {m.label}
                  <ChevronDown className={`size-4 transition-transform ${buka ? "rotate-180" : ""}`} />
                </button>
                {buka && (
                  <div className="absolute left-1/2 top-full z-50 mt-2 w-[440px] -translate-x-1/2 rounded-2xl border border-line bg-white p-2 shadow-xl shadow-deep/10">
                    <ul className="grid grid-cols-2 gap-0.5">
                      {kecamatan.map((k) => (
                        <li key={k.slug}>
                          <Link
                            href={`/kecamatan/${k.slug}`}
                            className="flex flex-col rounded-xl px-3 py-2 hover:bg-surface"
                          >
                            <span className="text-sm font-medium text-ink">{k.nama}</span>
                            <span className="text-xs text-muted">Ibu kota {k.ibuKota}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link href="/kecamatan" className="mt-1 block rounded-xl px-3 py-2 text-sm font-medium text-link hover:bg-surface">
                      Lihat semua kecamatan →
                    </Link>
                  </div>
                )}
              </li>
            ) : (
              <li key={m.href}>
                <Link href={m.href} className={pill(aktif(pathname, m.href))} aria-current={aktif(pathname, m.href) ? "page" : undefined}>
                  {m.label}
                </Link>
              </li>
            ),
          )}
        </ul>
        <CartButton jumlah={jumlah} className="ml-4" />
      </nav>

      <div className="flex items-center gap-2 lg:hidden">
        <CartButton jumlah={jumlah} />
        <button
          type="button"
          className="grid size-11 place-items-center rounded-full border border-line"
          aria-label={mobile ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobile}
          onClick={() => setMobile((v) => !v)}
        >
          {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobile && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto border-t border-line bg-white px-4 pb-10 pt-3 lg:hidden">
          <ul className="flex flex-col gap-1">
            {MENU.filter((m) => !m.dropdown).map((m) => (
              <li key={m.href}>
                <Link href={m.href} className={`block ${pill(aktif(pathname, m.href))}`}>
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="eyebrow mt-6 px-4">Kecamatan</p>
          <ul className="mt-2 flex flex-col">
            {kecamatan.map((k) => (
              <li key={k.slug}>
                <Link href={`/kecamatan/${k.slug}`} className="flex items-baseline justify-between rounded-xl px-4 py-2.5 hover:bg-surface">
                  <span className="text-[15px]">{k.nama}</span>
                  <span className="text-xs text-muted">{k.ibuKota}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function CartButton({ jumlah, className = "" }: { jumlah: number; className?: string }) {
  return (
    <Link
      href="/keranjang"
      className={`relative grid size-11 place-items-center rounded-full border border-line bg-white hover:bg-surface ${className}`}
      aria-label={`Keranjang, ${jumlah} barang`}
    >
      <ShoppingBag className="size-5" />
      {jumlah > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-full bg-bad px-1 text-[10px] font-semibold leading-[18px] text-white">
          {jumlah}
        </span>
      )}
    </Link>
  );
}
