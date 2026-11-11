"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Map, Minus, Plus, ShieldCheck, User, Users } from "lucide-react";
import type { Paket, Reservasi } from "@/lib/types";
import { hitungHarga } from "@/lib/harga";
import { normalisasiWA } from "@/lib/format";
import { bisaDipesan, minTanggalPesan, slotPaket, tanggalTersediaPertama } from "@/lib/jadwal";
import { buatReservasi, perbaruiReservasi, useReservasi } from "@/lib/store";
import { Ringkasan } from "./Ringkasan";

const noop = () => () => {};

export function FormPemesan({ paket }: { paket: Paket }) {
  const sp = useSearchParams();
  const kodeUbah = sp.get("ubah") ?? "";
  const lama = useReservasi(kodeUbah);
  // tunggu data lama terbaca dulu sebelum mengisi form
  if (kodeUbah && lama === null) return <div className="h-96" />;
  return <Form paket={paket} sp={sp} lama={lama ?? undefined} />;
}

function Form({ paket, sp, lama }: { paket: Paket; sp: Pick<URLSearchParams, "get">; lama?: Reservasi }) {
  const router = useRouter();
  const terhidrasi = useSyncExternalStore(noop, () => true, () => false);
  const dimuat = useRef(0);
  useEffect(() => {
    dimuat.current = Date.now();
  }, []);

  const awalPeserta = () => {
    const n = Number(sp.get("peserta"));
    return n >= paket.minPeserta && n <= paket.maxPeserta ? n : paket.minPeserta;
  };

  const [nama, setNama] = useState(lama?.nama ?? "");
  const [wa, setWa] = useState(lama ? lama.wa.replace(/^62/, "") : "");
  const [email, setEmail] = useState(lama?.email ?? "");
  const [tanggalPilih, setTanggal] = useState<string | null>(lama?.tanggal ?? sp.get("tanggal"));
  const [peserta, setPeserta] = useState(lama?.peserta ?? awalPeserta());
  const [anak, setAnak] = useState(lama?.anak ?? 0);
  const [addOns] = useState<string[]>(lama?.addOns ?? (sp.get("addon")?.split(",").filter(Boolean) || []));
  const [homestayId, setHomestayId] = useState<string | undefined>(() => {
    if (lama?.homestayId) return lama.homestayId;
    const hs = paket.homestay;
    if (!hs?.length) return undefined;
    const viaAddOn = hs.find((h) => h.addOnId && (sp.get("addon") ?? "").includes(h.addOnId));
    return (viaAddOn ?? hs[0]).id;
  });
  const [catatan, setCatatan] = useState(lama?.catatan ?? "");
  const [setujuSyarat, setSetujuSyarat] = useState(Boolean(lama));
  const [pahamEstimasi, setPahamEstimasi] = useState(Boolean(lama));
  const [manusia, setManusia] = useState(Boolean(lama));
  const [jebakan, setJebakan] = useState(""); // honeypot anti-spam
  const [error, setError] = useState<Record<string, string>>({});
  const [kirim, setKirim] = useState(false);

  const tanggal = tanggalPilih ?? (terhidrasi ? tanggalTersediaPertama(paket) : "");
  const homestay = paket.homestay?.find((h) => h.id === homestayId);

  // Homestay yang terkait add-on (mis. kamar keluarga) menyalakan add-on tsb.
  const addOnEfektif = (() => {
    const terkait = new Set((paket.homestay ?? []).map((h) => h.addOnId).filter(Boolean) as string[]);
    const dasar = addOns.filter((a) => !terkait.has(a));
    return homestay?.addOnId ? [...dasar, homestay.addOnId] : dasar;
  })();
  const { rincian, total } = hitungHarga(paket, peserta, addOnEfektif);

  const validasi = () => {
    const e: Record<string, string> = {};
    if (nama.trim().length < 3) e.nama = "Isi nama lengkap.";
    const nomor = normalisasiWA(wa);
    if (!/^628\d{7,11}$/.test(nomor)) e.wa = "Nomor WhatsApp tidak valid. Contoh: 812 4455 7801.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Format email tidak valid.";
    if (!tanggal) e.tanggal = "Pilih tanggal berangkat.";
    else if (tanggal < minTanggalPesan()) e.tanggal = "Pemesanan paling lambat H-2.";
    else if (!bisaDipesan(slotPaket(paket, tanggal))) e.tanggal = "Tanggal ini penuh atau diblokir. Pilih tanggal lain.";
    if (!setujuSyarat || !pahamEstimasi) e.syarat = "Centang kedua persetujuan untuk melanjutkan.";
    if (!manusia) e.manusia = "Selesaikan verifikasi anti-spam.";
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (jebakan || Date.now() - dimuat.current < 2500) {
      setError({ manusia: "Pengiriman terlalu cepat. Coba lagi beberapa detik lagi." });
      return;
    }
    const e = validasi();
    setError(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setKirim(true);
    const data = {
      paketSlug: paket.slug,
      nama: nama.trim(),
      wa: normalisasiWA(wa),
      email: email.trim() || undefined,
      tanggal,
      peserta,
      anak,
      addOns: addOnEfektif,
      homestayId,
      catatan: catatan.trim() || undefined,
      rincian,
      total,
    };
    const r = lama ? perbaruiReservasi(lama.kode, data) : buatReservasi(data);
    router.push(`/reservasi/${(r ?? buatReservasi(data)).kode}`);
  };

  const input = "w-full rounded-xl border border-line bg-white px-4 py-3.5 text-[15px] outline-none focus:border-laut-700 focus:ring-2 focus:ring-laut-700/15";
  const qKembali = new URLSearchParams();
  if (tanggal) qKembali.set("tanggal", tanggal);
  qKembali.set("peserta", String(peserta));
  if (addOns.length) qKembali.set("addon", addOns.join(","));

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_354px] lg:gap-9">
      <form onSubmit={submit} noValidate className="min-w-0">
        <div className="space-y-5">
          <Kartu Icon={User} judul="Kontak pemesan">
            <Bidang id="f-nama" label="Nama lengkap" error={error.nama}>
              <input id="f-nama" className={input} value={nama} onChange={(e) => setNama(e.target.value)} autoComplete="name" required />
            </Bidang>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Bidang id="f-wa" label="Nomor WhatsApp" error={error.wa} hint="Untuk konfirmasi dan cek status. Tidak tampil di publik.">
                <div className="flex rounded-xl border border-line bg-white focus-within:border-laut-700 focus-within:ring-2 focus-within:ring-laut-700/15">
                  <span className="border-r border-line px-3.5 py-3.5 text-[15px] font-medium">+62</span>
                  <input
                    id="f-wa"
                    inputMode="tel"
                    autoComplete="tel-national"
                    className="w-full rounded-r-xl px-3.5 py-3.5 text-[15px] outline-none"
                    placeholder="812 4455 7801"
                    value={wa}
                    onChange={(e) => setWa(e.target.value)}
                    required
                  />
                </div>
              </Bidang>
              <Bidang id="f-email" label="Email" opsional error={error.email} hint="Salinan kode reservasi dikirim ke sini.">
                <input id="f-email" type="email" autoComplete="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} />
              </Bidang>
            </div>
          </Kartu>

          <Kartu Icon={Map} judul="Detail perjalanan">
            <div className="grid gap-4 sm:grid-cols-2">
              <Bidang id="f-tanggal" label="Tanggal berangkat" error={error.tanggal}>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-laut-700" />
                  <input
                    id="f-tanggal"
                    type="date"
                    min={terhidrasi ? minTanggalPesan() : undefined}
                    className={`${input} pl-12`}
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    required
                  />
                </div>
              </Bidang>
              <Bidang id="f-peserta" label="Jumlah peserta" hint={`min ${paket.minPeserta} · maks ${paket.maxPeserta}`}>
                <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-2 py-1.5">
                  <Users className="ml-2 size-5 shrink-0 text-laut-700" />
                  <span className="flex-1 px-1 text-[15px]" id="f-peserta" aria-live="polite">
                    {peserta} orang{anak > 0 ? ` (${peserta - anak} dewasa, ${anak} anak)` : ""}
                  </span>
                  <Stepper
                    label="peserta"
                    kurang={() => {
                      setPeserta((n) => Math.max(paket.minPeserta, n - 1));
                      setAnak((a) => Math.min(a, peserta - 2));
                    }}
                    tambah={() => setPeserta((n) => Math.min(paket.maxPeserta, n + 1))}
                  />
                </div>
                <label className="mt-2 flex items-center gap-2 text-[13px] text-muted">
                  Di antaranya anak-anak:
                  <select
                    className="rounded-lg border border-line bg-white px-2 py-1 text-ink"
                    value={anak}
                    onChange={(e) => setAnak(Number(e.target.value))}
                  >
                    {Array.from({ length: Math.max(0, peserta - 1) + 1 }, (_, i) => i).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </Bidang>
            </div>

            {paket.homestay && paket.homestay.length > 0 && (
              <fieldset className="mt-5">
                <legend className="text-sm font-semibold">Homestay</legend>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {paket.homestay.map((h) => {
                    const on = h.id === homestayId;
                    return (
                      <label
                        key={h.id}
                        className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3.5 ${on ? "border-2 border-laut-700 bg-laut-50" : "border-line"}`}
                      >
                        <input type="radio" name="homestay" className="mt-1 size-[18px] accent-laut-700" checked={on} onChange={() => setHomestayId(h.id)} />
                        <span>
                          <span className="block font-medium">{h.nama}</span>
                          <span className="block text-[13px] text-muted">{h.keterangan}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <div className="mt-5">
              <Bidang id="f-catatan" label="Catatan untuk pengelola" opsional>
                <textarea
                  id="f-catatan"
                  rows={3}
                  className={`${input} resize-y`}
                  placeholder="Mis. ada anak kecil, alergi makanan, butuh penjemputan dari Salakan"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                />
              </Bidang>
            </div>
          </Kartu>
        </div>

        <div className="mt-6 space-y-3">
          <Centang id="f-syarat" checked={setujuSyarat} onChange={setSetujuSyarat}>
            Saya setuju dengan{" "}
            <Link href="/info#syarat" className="text-link underline" target="_blank">
              syarat &amp; ketentuan serta kebijakan pembatalan
            </Link>{" "}
            {paket.penyelenggara.nama}.
          </Centang>
          <Centang checked={pahamEstimasi} onChange={setPahamEstimasi}>
            Saya paham harga adalah estimasi dan pembayaran dilakukan setelah pengelola mengonfirmasi.
          </Centang>
          {error.syarat && <p className="text-sm text-bad">{error.syarat}</p>}
        </div>

        {/* honeypot: disembunyikan dari manusia */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
          value={jebakan}
          onChange={(e) => setJebakan(e.target.value)}
          name="website"
        />

        <button
          id="f-manusia"
          type="button"
          onClick={() => setManusia(true)}
          className={`mt-5 flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm ${
            manusia ? "bg-surface text-ink" : "border border-line bg-white text-ink hover:bg-surface"
          }`}
          aria-pressed={manusia}
        >
          <ShieldCheck className={`size-5 ${manusia ? "text-ok" : "text-muted"}`} />
          {manusia ? "Verifikasi anti-spam berhasil" : "Klik untuk verifikasi: saya bukan robot"}
        </button>
        {error.manusia && <p className="mt-1.5 text-sm text-bad">{error.manusia}</p>}

        <div className="mt-8 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href={`/paket/${paket.slug}?${qKembali}`} className="flex items-center justify-center gap-2 text-[15px] font-medium">
            <ArrowLeft className="size-4" /> Kembali ke paket
          </Link>
          <button
            type="submit"
            disabled={kirim}
            className="flex items-center justify-center gap-2 rounded-full bg-laut-700 px-7 py-4 text-base font-medium text-white hover:bg-laut-800 disabled:opacity-60"
          >
            {lama ? "Simpan perubahan" : "Buat kode reservasi"} <ArrowRight className="size-5" />
          </button>
        </div>
      </form>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <Ringkasan paket={paket} tanggal={tanggal || undefined} peserta={peserta} homestay={homestay?.nama} rincian={rincian} total={total} />
      </aside>
    </div>
  );
}

function Kartu({ Icon, judul, children }: { Icon: typeof User; judul: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-white p-5 sm:p-6">
      <h2 className="flex items-center gap-3 text-xl font-semibold">
        <span className="grid size-8 place-items-center rounded-lg bg-laut-100 text-laut-700">
          <Icon className="size-4" />
        </span>
        {judul}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Bidang({
  id,
  label,
  opsional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  opsional?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label} {opsional && <span className="font-normal text-muted">(opsional)</span>}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-[13px] text-bad">{error}</p> : hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Stepper({ label, kurang, tambah }: { label: string; kurang: () => void; tambah: () => void }) {
  return (
    <span className="flex gap-1">
      <button type="button" onClick={kurang} aria-label={`Kurangi ${label}`} className="grid size-9 place-items-center rounded-lg border border-line">
        <Minus className="size-4" />
      </button>
      <button type="button" onClick={tambah} aria-label={`Tambah ${label}`} className="grid size-9 place-items-center rounded-lg bg-laut-700 text-white">
        <Plus className="size-4" />
      </button>
    </span>
  );
}

function Centang({ id, checked, onChange, children }: { id?: string; checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-[15px]">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-laut-700" />
      <span>{children}</span>
    </label>
  );
}
