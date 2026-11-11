"use client";

// Penyimpanan sisi-browser untuk keranjang, reservasi, dan pesanan.
// SEMENTARA: sebelum Supabase tersambung, data transaksi disimpan di localStorage
// supaya alur reservasi & pesanan bisa diuji ujung-ke-ujung. Ganti fungsi
// buatReservasi/buatPesanan/cariTransaksi dengan panggilan API saat backend siap.

import { useSyncExternalStore } from "react";
import type { Pesanan, Reservasi } from "./types";
import { RESERVASI_CONTOH } from "@/data/contoh-transaksi";

type ItemKeranjang = { produk: string; qty: number };
export type Keranjang = { item: ItemKeranjang[]; reservasiKode?: string };

const KEY = {
  keranjang: "bk:keranjang",
  reservasi: "bk:reservasi",
  pesanan: "bk:pesanan",
  simpan: "bk:paket-disimpan",
} as const;

const cache = new Map<string, { raw: string | null; val: unknown }>();
const listeners = new Set<() => void>();

function baca<T>(key: string, awal: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    raw = null;
  }
  const c = cache.get(key);
  if (c && c.raw === raw) return c.val as T;
  let val: T = awal;
  if (raw) {
    try {
      val = JSON.parse(raw) as T;
    } catch {
      val = awal;
    }
  }
  cache.set(key, { raw, val });
  return val;
}

function tulis<T>(key: string, val: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // penyimpanan penuh / diblokir: abaikan, UI tetap jalan untuk sesi ini
    cache.set(key, { raw: "__mem__" + Math.random(), val });
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = () => cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const KOSONG_KERANJANG: Keranjang = { item: [] };
const KOSONG_ARR: never[] = [];

function useKey<T>(key: string, awal: T): T {
  return useSyncExternalStore(
    subscribe,
    () => baca<T>(key, awal),
    () => awal,
  );
}

/* ---------- Keranjang ---------- */

export const useKeranjang = () => useKey<Keranjang>(KEY.keranjang, KOSONG_KERANJANG);

export function tambahKeKeranjang(produk: string, qty = 1, reservasiKode?: string) {
  const k = baca<Keranjang>(KEY.keranjang, KOSONG_KERANJANG);
  const ada = k.item.find((i) => i.produk === produk);
  const item = ada
    ? k.item.map((i) => (i.produk === produk ? { ...i, qty: i.qty + qty } : i))
    : [...k.item, { produk, qty }];
  tulis(KEY.keranjang, { item, reservasiKode: reservasiKode ?? k.reservasiKode });
}

export function ubahQty(produk: string, qty: number) {
  const k = baca<Keranjang>(KEY.keranjang, KOSONG_KERANJANG);
  const item = qty <= 0 ? k.item.filter((i) => i.produk !== produk) : k.item.map((i) => (i.produk === produk ? { ...i, qty } : i));
  tulis(KEY.keranjang, { ...k, item });
}

export function setReservasiKeranjang(kode?: string) {
  const k = baca<Keranjang>(KEY.keranjang, KOSONG_KERANJANG);
  tulis(KEY.keranjang, { ...k, reservasiKode: kode });
}

export const kosongkanKeranjang = () => tulis(KEY.keranjang, KOSONG_KERANJANG);

/* ---------- Paket disimpan (favorit) ---------- */

export const usePaketDisimpan = () => useKey<string[]>(KEY.simpan, KOSONG_ARR);
export function toggleSimpan(slug: string) {
  const s = baca<string[]>(KEY.simpan, KOSONG_ARR);
  tulis(KEY.simpan, s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]);
}

/* ---------- Reservasi ---------- */

const semuaReservasi = () => [...RESERVASI_CONTOH, ...baca<Reservasi[]>(KEY.reservasi, KOSONG_ARR)];

export function useReservasi(kode: string): Reservasi | undefined | null {
  const list = useKey<Reservasi[]>(KEY.reservasi, KOSONG_ARR);
  const terhidrasi = useSyncExternalStore(subscribe, () => true, () => false);
  if (!terhidrasi) return null; // null = belum dibaca dari browser
  return [...RESERVASI_CONTOH, ...list].find((r) => r.kode === kode.toUpperCase());
}

function kodeAcak(prefix: string) {
  const d = new Date();
  const yymm = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}`;
  const n = String(Math.floor(Math.random() * 900) + 100);
  return `${prefix}-${yymm}-${n}`;
}

export function buatReservasi(data: Omit<Reservasi, "kode" | "status" | "riwayat" | "createdAt">): Reservasi {
  const list = baca<Reservasi[]>(KEY.reservasi, KOSONG_ARR);
  let kode = kodeAcak("RSV");
  while (semuaReservasi().some((r) => r.kode === kode)) kode = kodeAcak("RSV");
  const now = new Date().toISOString();
  const r: Reservasi = { ...data, kode, status: "menunggu", riwayat: [{ status: "menunggu", waktu: now }], createdAt: now };
  tulis(KEY.reservasi, [...list, r]);
  return r;
}

/** Ubah data reservasi yang masih "menunggu" (tombol "Ubah data pemesan"). */
export function perbaruiReservasi(kode: string, data: Omit<Reservasi, "kode" | "status" | "riwayat" | "createdAt">): Reservasi | null {
  const list = baca<Reservasi[]>(KEY.reservasi, KOSONG_ARR);
  const lama = list.find((r) => r.kode === kode);
  if (!lama || lama.status !== "menunggu") return null;
  const baru = { ...lama, ...data };
  tulis(KEY.reservasi, list.map((r) => (r.kode === kode ? baru : r)));
  return baru;
}

export function simpanBuktiBayar(kode: string, namaFile: string) {
  const list = baca<Reservasi[]>(KEY.reservasi, KOSONG_ARR);
  tulis(
    KEY.reservasi,
    list.map((r) => (r.kode === kode ? { ...r, buktiBayar: namaFile } : r)),
  );
}

/* ---------- Pesanan UMKM ---------- */

export function usePesanan(kode: string): Pesanan | undefined | null {
  const list = useKey<Pesanan[]>(KEY.pesanan, KOSONG_ARR);
  const terhidrasi = useSyncExternalStore(subscribe, () => true, () => false);
  if (!terhidrasi) return null;
  return list.find((p) => p.kode === kode.toUpperCase());
}

export function buatPesanan(data: Omit<Pesanan, "kode" | "status" | "createdAt">[]): Pesanan[] {
  const list = baca<Pesanan[]>(KEY.pesanan, KOSONG_ARR);
  const now = new Date().toISOString();
  const baru = data.map((d) => {
    let kode = kodeAcak("PSN");
    while (list.some((p) => p.kode === kode)) kode = kodeAcak("PSN");
    return { ...d, kode, status: "menunggu" as const, createdAt: now };
  });
  tulis(KEY.pesanan, [...list, ...baru]);
  return baru;
}

/* ---------- Cek pesanan (/cek) ---------- */

export function cariTransaksi(kode: string, wa: string): { jenis: "reservasi" | "pesanan"; kode: string } | null {
  const k = kode.trim().toUpperCase();
  const w = wa.replace(/\D/g, "").replace(/^0/, "62").replace(/^8/, "628");
  const cocokWA = (x: string) => x.replace(/\D/g, "").endsWith(w.slice(-9));
  const r = semuaReservasi().find((x) => x.kode === k && cocokWA(x.wa));
  if (r) return { jenis: "reservasi", kode: r.kode };
  const p = baca<Pesanan[]>(KEY.pesanan, KOSONG_ARR).find((x) => x.kode === k && cocokWA(x.wa));
  if (p) return { jenis: "pesanan", kode: p.kode };
  return null;
}
