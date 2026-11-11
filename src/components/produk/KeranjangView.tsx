"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ArrowRight, MapPin, MessageCircle, Minus, Plus, ShoppingBag, Trash, Truck } from "lucide-react";
import { getDesa, getProduk, lokasiDesa, produkLengkap } from "@/lib/data";
import { normalisasiWA, rupiah } from "@/lib/format";
import { buatPesanan, kosongkanKeranjang, setReservasiKeranjang, ubahQty, useKeranjang } from "@/lib/store";
import { pesanPesanan, waLink } from "@/lib/whatsapp";
import type { Pesanan } from "@/lib/types";

const noop = () => () => {};

export function KeranjangView() {
  const keranjang = useKeranjang();
  const terhidrasi = useSyncExternalStore(noop, () => true, () => false);
  const [metode, setMetode] = useState<"ambil" | "kirim">("ambil");
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [alamat, setAlamat] = useState("");
  const [error, setError] = useState("");
  const [hasil, setHasil] = useState<Pesanan[] | null>(null);

  if (!terhidrasi) return <div className="h-96" />;
  if (hasil) return <HasilCheckout pesanan={hasil} />;

  const item = keranjang.item
    .map((i) => {
      const p = getProduk(i.produk);
      return p ? { ...produkLengkap(p), qty: i.qty } : null;
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  if (item.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-surface px-6 py-20 text-center">
        <ShoppingBag className="size-12 text-muted" />
        <h2 className="mt-5 text-2xl font-semibold">Keranjang masih kosong</h2>
        <p className="mt-2 text-muted">Pilih oleh-oleh dari UMKM desa, lalu pesan ke pembuatnya.</p>
        <Link href="/produk" className="mt-6 flex items-center gap-2 rounded-full bg-laut-700 px-6 py-3 font-medium text-white">
          Belanja oleh-oleh <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  // Satu pesanan per desa (PRD: keranjang lintas desa dipecah)
  const perDesa = new Map<string, typeof item>();
  for (const i of item) {
    const d = i.desaSlug ?? "lain";
    perDesa.set(d, [...(perDesa.get(d) ?? []), i]);
  }
  const total = item.reduce((s, i) => s + i.harga * i.qty, 0);
  const adaPreorder = item.some((i) => i.tipe === "preorder");

  const checkout = (e: React.FormEvent) => {
    e.preventDefault();
    const nomor = normalisasiWA(wa);
    if (nama.trim().length < 3) return setError("Isi nama lengkap.");
    if (!/^628\d{7,11}$/.test(nomor)) return setError("Nomor WhatsApp tidak valid.");
    if (metode === "kirim" && alamat.trim().length < 10) return setError("Isi alamat pengiriman lengkap.");
    setError("");
    const dibuat = buatPesanan(
      [...perDesa.entries()].map(([desa, list]) => ({
        desa,
        nama: nama.trim(),
        wa: nomor,
        item: list.map((i) => ({ produk: i.slug, qty: i.qty, harga: i.harga })),
        metode,
        reservasiKode: metode === "ambil" ? keranjang.reservasiKode : undefined,
        alamat: metode === "kirim" ? alamat.trim() : undefined,
        total: list.reduce((s, i) => s + i.harga * i.qty, 0),
      })),
    );
    kosongkanKeranjang();
    setHasil(dibuat);
  };

  const input = "w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] outline-none focus:border-laut-700";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        {[...perDesa.entries()].map(([desa, list]) => (
          <section key={desa} className="rounded-3xl border border-line p-4 sm:p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-link">
              <MapPin className="size-4" /> {lokasiDesa(desa)}
              <span className="ml-auto text-xs font-normal text-muted">1 pesanan untuk desa ini</span>
            </p>
            <ul className="mt-3 divide-y divide-line">
              {list.map((i) => (
                <li key={i.slug} className="flex gap-3 py-3.5 sm:gap-4">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-xl sm:size-20">
                    <Image src={i.foto} alt="" fill sizes="80px" className="object-cover" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{i.nama}</p>
                    <p className="text-[13px] text-muted">
                      {i.umkmData?.nama} · {i.tipe === "ready" ? "Ready" : `Pre-order ${i.leadTimeHari} hari`}
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {rupiah(i.harga)} <span className="font-normal text-muted">/ {i.satuan}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between gap-2">
                    <button type="button" onClick={() => ubahQty(i.slug, 0)} aria-label={`Hapus ${i.nama}`} className="text-muted hover:text-bad">
                      <Trash className="size-4" />
                    </button>
                    <div className="flex items-center gap-1.5 rounded-full border border-line p-1">
                      <button type="button" onClick={() => ubahQty(i.slug, i.qty - 1)} aria-label="Kurangi" className="grid size-7 place-items-center rounded-full hover:bg-surface">
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{i.qty}</span>
                      <button type="button" onClick={() => ubahQty(i.slug, i.qty + 1)} aria-label="Tambah" className="grid size-7 place-items-center rounded-full hover:bg-surface">
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <form onSubmit={checkout} className="space-y-5 lg:sticky lg:top-24 lg:self-start" noValidate>
        <div className="rounded-3xl bg-surface p-5">
          <p className="font-semibold">Cara menerima</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(
              [
                { v: "ambil", l: "Ambil di desa", Icon: MapPin },
                { v: "kirim", l: "Kirim", Icon: Truck },
              ] as const
            ).map(({ v, l, Icon }) => (
              <label key={v} className={`flex cursor-pointer items-center gap-2 rounded-xl border bg-white px-3 py-3 text-sm ${metode === v ? "border-2 border-laut-700" : "border-line"}`}>
                <input type="radio" name="metode" className="sr-only" checked={metode === v} onChange={() => setMetode(v)} />
                <Icon className="size-4 text-laut-700" /> {l}
              </label>
            ))}
          </div>
          {metode === "ambil" ? (
            <label className="mt-4 block text-sm">
              <span className="font-medium">Kode reservasi</span> <span className="text-muted">(opsional)</span>
              <input
                className={`${input} mt-1.5 uppercase`}
                placeholder="RSV-2607-014"
                value={keranjang.reservasiKode ?? ""}
                onChange={(e) => setReservasiKeranjang(e.target.value.toUpperCase() || undefined)}
              />
              <span className="mt-1 block text-xs text-muted">Produk disiapkan sesuai hari kunjungan Anda.</span>
            </label>
          ) : (
            <label className="mt-4 block text-sm">
              <span className="font-medium">Alamat pengiriman</span>
              <textarea className={`${input} mt-1.5`} rows={3} value={alamat} onChange={(e) => setAlamat(e.target.value)} />
              <span className="mt-1 block text-xs text-muted">Ongkir dikonfirmasi manual oleh pengelola desa.</span>
            </label>
          )}
        </div>

        <div className="rounded-3xl border border-line p-5">
          <label className="block text-sm font-medium">
            Nama lengkap
            <input className={`${input} mt-1.5`} value={nama} onChange={(e) => setNama(e.target.value)} autoComplete="name" />
          </label>
          <label className="mt-3 block text-sm font-medium">
            Nomor WhatsApp
            <input className={`${input} mt-1.5`} inputMode="tel" placeholder="0812 4455 7801" value={wa} onChange={(e) => setWa(e.target.value)} autoComplete="tel" />
          </label>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal ({item.reduce((s, i) => s + i.qty, 0)} barang)</dt>
              <dd className="font-medium">{rupiah(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Dipecah menjadi</dt>
              <dd className="font-medium">{perDesa.size} pesanan</dd>
            </div>
          </dl>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-semibold">Total</p>
            <p className="text-2xl font-semibold text-laut-700">{rupiah(total)}</p>
          </div>
          {adaPreorder && <p className="mt-2 text-xs text-muted">Ada produk pre-order; waktu siap mengikuti lama pembuatan tiap produk.</p>}
          {error && <p className="mt-3 text-sm text-bad">{error}</p>}
          <button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-laut-700 px-6 py-3.5 font-medium text-white hover:bg-laut-800">
            Buat pesanan <ArrowRight className="size-4" />
          </button>
          <p className="mt-3 text-center text-xs text-muted">Belum ada pembayaran. Pengelola desa mengonfirmasi lewat WhatsApp.</p>
        </div>
      </form>
    </div>
  );
}

function HasilCheckout({ pesanan }: { pesanan: Pesanan[] }) {
  const nama = (slug: string) => getProduk(slug)?.nama ?? slug;
  return (
    <div>
      <div className="rounded-3xl bg-ok-50 p-6">
        <h2 className="text-2xl font-semibold text-ink">Pesanan tercatat</h2>
        <p className="mt-2 text-muted">
          Kirim pesan WhatsApp ke tiap desa di bawah supaya pengelola bisa menyiapkan pesanan Anda. Simpan kodenya untuk cek status.
        </p>
      </div>
      <ul className="mt-5 grid gap-4 md:grid-cols-2">
        {pesanan.map((o) => {
          const desa = getDesa(o.desa);
          const nomor = desa?.pengelola?.wa[0] ?? "";
          return (
            <li key={o.kode} className="rounded-3xl border border-line p-5">
              <p className="text-xs text-muted">Kode pesanan</p>
              <p className="text-xl font-semibold">{o.kode}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-link">
                <MapPin className="size-3.5" /> {lokasiDesa(o.desa)}
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                {o.item.map((i) => (
                  <li key={i.produk} className="flex justify-between gap-3">
                    <span>
                      {nama(i.produk)} × {i.qty}
                    </span>
                    <span>{rupiah(i.harga * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex justify-between border-t border-line pt-3 font-semibold">
                <span>Total</span> <span>{rupiah(o.total)}</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={waLink(nomor, pesanPesanan(o, nama))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-wa px-4 py-2.5 text-sm font-medium text-white hover:bg-wa-dark"
                >
                  <MessageCircle className="size-4" /> Kirim ke {desa?.pengelola?.nama ?? "pengelola"}
                </a>
                <Link href={`/pesanan/${o.kode}`} className="rounded-full border border-line px-4 py-2.5 text-sm font-medium hover:bg-surface">
                  Lihat status
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
