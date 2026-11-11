import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  Anchor,
  ArrowRight,
  CalendarDays,
  CalendarX,
  Car,
  ChevronUp,
  CircleCheck,
  CloudRain,
  Fish,
  House,
  Info,
  Landmark,
  Languages,
  Leaf,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  Mountain,
  Phone,
  Plane,
  Ship,
  ShoppingBag,
  Star,
  Users,
  Utensils,
  X,
  Check,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui";
import { PaketCard, KATEGORI_LABEL } from "@/components/PaketCard";
import { BookingCard } from "@/components/paket/BookingCard";
import { Galeri } from "@/components/paket/Galeri";
import { BagikanButton } from "@/components/paket/BagikanButton";
import { SimpanButton } from "@/components/SimpanButton";
import { DestinasiCard } from "@/components/DestinasiCard";
import {
  desaPaket,
  destinasiKartu,
  destinasiPaket,
  getDesa,
  getKecamatan,
  getPaket,
  kecamatanPaket,
  paketDiKecamatan,
  pengelolaPaket,
  produkDiDesa,
  semuaPaket,
} from "@/lib/data";
import type { LangkahRute, Paket } from "@/lib/types";

export function generateStaticParams() {
  return semuaPaket().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/paket/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPaket(slug);
  if (!p) return {};
  return {
    title: p.nama,
    description: p.ringkasan.slice(0, 155),
    openGraph: { title: p.nama, description: p.ringkasan.slice(0, 155), images: [p.galeri[0] ?? p.cover] },
  };
}

const SOROTAN_IKON = { ikan: Fish, bukit: Mountain, rumah: House, makan: Utensils, perahu: Ship, budaya: Landmark, hutan: Leaf };
const RUTE_IKON: Record<LangkahRute["ikon"], typeof Plane> = { pesawat: Plane, kapal: Ship, mobil: Car, jangkar: Anchor };

export default function DetailPaketPage({ params }: PageProps<"/paket/[slug]">) {
  return (
    <Suspense fallback={<div className="container-page h-[80vh] py-10" aria-busy="true" />}>
      <DetailPaket params={params} />
    </Suspense>
  );
}

async function DetailPaket({ params }: { params: PageProps<"/paket/[slug]">["params"] }) {
  const { slug } = await params;
  const paket = getPaket(slug);
  if (!paket) notFound();

  const desa = desaPaket(paket);
  const kec = kecamatanPaket(paket);
  const desaUtama = desa[0];
  const kecUtama = kec[0];
  const pengelola = pengelolaPaket(paket);
  const lintas = desa.length > 1;
  const destinasi = destinasiPaket(paket);
  const produkDesa = produkDiDesa(desa.map((d) => d.slug));
  const lain = paketDiKecamatan(kecUtama.slug).filter((p) => p.slug !== paket.slug).slice(0, 3);
  const lainFallback = lain.length ? lain : semuaPaket().filter((p) => p.slug !== paket.slug).slice(0, 3);

  return (
    <>
      <div className="container-page pt-7">
        <Breadcrumb
          items={[
            { href: "/", label: "Beranda" },
            { href: "/kecamatan", label: "Kecamatan" },
            { href: `/kecamatan/${kecUtama.slug}`, label: kecUtama.nama },
            lintas ? { href: "/paket", label: "Paket lintas desa" } : { href: `/kecamatan/${kecUtama.slug}`, label: `Desa ${desaUtama.nama}` },
            { label: paket.nama },
          ]}
        />
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-laut-100 px-3 py-1 text-xs font-medium text-laut-800">{KATEGORI_LABEL[paket.kategori]}</span>
          {lintas && (
            <span className="rounded-full bg-laut-700 px-3 py-1 text-xs font-medium text-white">
              Lintas {desa.length} desa · {kec.length} kecamatan
            </span>
          )}
          {desa.some((d) => d.desaWisata) && <span className="rounded-full bg-sun-100 px-3 py-1 text-xs font-medium text-sun-800">Desa wisata</span>}
          {desa.some((d) => d.fokusKKN) && <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted">Desa fokus KKN</span>}
        </div>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[34px] font-semibold leading-tight tracking-tight sm:text-5xl">{paket.nama}</h1>
            <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-ink">
              <li className="flex items-center gap-2 text-link">
                <MapPin className="size-4" />
                {lintas ? desa.map((d) => d.nama).join(" → ") : `${desaUtama.nama}, ${kecUtama.nama}`}
              </li>
              {paket.rating && (
                <li className="flex items-center gap-2">
                  <Star className="size-4 text-sun-400" />
                  {paket.rating.nilai.toLocaleString("id-ID")} ({paket.rating.ulasan} ulasan)
                </li>
              )}
              <li className="flex items-center gap-2">
                <CalendarDays className="size-4 text-muted" />
                {paket.durasiLabel}
              </li>
              <li className="flex items-center gap-2">
                <Users className="size-4 text-muted" />
                {paket.minPeserta}–{paket.maxPeserta} orang
              </li>
              <li className="flex items-center gap-2">
                <Languages className="size-4 text-muted" />
                {paket.bahasa}
              </li>
            </ul>
          </div>
          <div className="flex gap-2">
            <BagikanButton judul={paket.nama} />
            <SimpanButton slug={paket.slug} varian="tombol" />
          </div>
        </div>
        <div className="mt-5">
          <Galeri foto={paket.galeri} nama={paket.nama} />
        </div>
      </div>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_374px] lg:gap-12">
        <div className="min-w-0 divide-y divide-line [&>section]:py-9 [&>section:first-child]:pt-0">
          <section>
            <h2 className="text-2xl font-semibold">Tentang paket</h2>
            <p className="mt-4 text-[17px] leading-[1.7] text-ink/90">{paket.ringkasan}</p>
            <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {paket.sorotan.map((s) => {
                const Icon = SOROTAN_IKON[s.ikon];
                return (
                  <li key={s.label} className="rounded-2xl bg-surface p-4">
                    <Icon className="size-5 text-laut-700" />
                    <p className="mt-3 text-sm font-medium leading-snug">{s.label}</p>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Itinerary</h2>
            <div className="mt-5 space-y-4">
              {paket.itinerary.map((h) => {
                const d = h.desa ? getDesa(h.desa) : undefined;
                const k = d ? getKecamatan(d.kecamatan) : undefined;
                return (
                  <details key={h.judul} open className="group overflow-hidden rounded-2xl border border-line">
                    <summary className="flex cursor-pointer items-center justify-between gap-3 bg-surface px-4 py-3.5">
                      <span className="font-medium">
                        {h.judul}
                        {k && <span className="ml-2 text-sm font-normal text-muted">({k.nama})</span>}
                      </span>
                      <ChevronUp className="size-4 shrink-0 rotate-180 transition-transform group-open:rotate-0" />
                    </summary>
                    <ol className="divide-y divide-line px-4">
                      {h.kegiatan.map((k) => (
                        <li key={k.jam + k.teks} className="flex gap-6 py-3 text-[15px]">
                          <span className="w-12 shrink-0 font-semibold text-laut-700">{k.jam}</span>
                          <span>{k.teks}</span>
                        </li>
                      ))}
                    </ol>
                  </details>
                );
              })}
            </div>
          </section>

          {destinasi.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold">Destinasi yang disinggahi</h2>
              <p className="mt-2 text-[15px] text-muted">Baca artikel tiap tempat, atau jelajahi dulu lewat Virtual Tour 360°.</p>
              <div className="mt-5 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3">
                {destinasi.map((a) => (
                  <DestinasiCard key={a.slug} d={destinasiKartu(a)} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-semibold">Termasuk &amp; tidak termasuk</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-muted">Termasuk</p>
                <ul className="mt-3 space-y-3">
                  {paket.termasuk.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[15px]">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ok-50 text-ok">
                        <Check className="size-3" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted">Tidak termasuk</p>
                <ul className="mt-3 space-y-3">
                  {paket.tidakTermasuk.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[15px]">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-bad-50 text-bad">
                        <X className="size-3" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Cara menuju &amp; titik kumpul</h2>
            <ol className="mt-6">
              {paket.rute.map((r, i) => {
                const Icon = RUTE_IKON[r.ikon];
                const akhir = i === paket.rute.length - 1;
                return (
                  <li key={r.judul} className="relative flex gap-4 pb-6 last:pb-0">
                    {!akhir && <span className="absolute left-[17px] top-9 h-[calc(100%-36px)] w-px bg-laut-100" aria-hidden="true" />}
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full ${akhir ? "bg-laut-700 text-white" : "bg-laut-100 text-laut-700"}`}>
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="font-medium">{r.judul}</p>
                      <p className="mt-0.5 text-sm text-muted">{r.keterangan}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 flex flex-col gap-2 rounded-xl bg-surface px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-muted">
                <Info className="size-4 shrink-0" /> Durasi perjalanan adalah estimasi dan bisa berubah karena cuaca.
              </p>
              <Link href={`/kecamatan/${kecUtama.slug}`} className="flex items-center gap-1.5 font-medium text-link">
                <MapIcon className="size-4" /> Lihat di Peta {kecUtama.nama}
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">{lintas ? "Koordinator & desa singgah" : "Dikelola oleh desa"}</h2>
            <PengelolaCard paket={paket} pengelola={pengelola} kecNama={kecUtama.nama} kecSlug={kecUtama.slug} />
            {lintas && (
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {paket.singgah.map((s) => {
                  const d = getDesa(s.desa);
                  const k = d ? getKecamatan(d.kecamatan) : undefined;
                  return (
                    <li key={s.desa} className="rounded-2xl border border-line p-4 text-sm">
                      <p className="text-xs text-muted">Hari ke-{s.hariKe}</p>
                      <p className="mt-1 font-medium">{d?.nama}</p>
                      <p className="text-muted">{k?.nama}</p>
                      <p className="mt-2 text-xs text-muted">{d?.pengelola?.nama}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Kebijakan pembatalan &amp; cuaca</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface p-5">
                <CloudRain className="size-5 text-laut-700" />
                <p className="mt-3 font-semibold">Batal karena cuaca</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">Gelombang tinggi atau cuaca buruk: jadwal ulang gratis atau DP kembali penuh.</p>
              </div>
              <div className="rounded-2xl bg-surface p-5">
                <CalendarX className="size-5 text-laut-700" />
                <p className="mt-3 font-semibold">Batal oleh wisatawan</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Lebih dari 7 hari sebelum keberangkatan: DP kembali. Kurang dari itu, sesuai kesepakatan desa.
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={<div className="h-[640px] rounded-3xl border border-line bg-white" />}>
            <BookingCard paket={paket} waPengelola={pengelola.wa[0] ?? ""} />
          </Suspense>
          {produkDesa.length > 0 && (
            <Link href="/produk" className="mt-4 flex gap-3 rounded-2xl bg-surface p-4 text-sm leading-relaxed hover:bg-laut-50">
              <ShoppingBag className="mt-0.5 size-5 shrink-0 text-laut-700" />
              {produkDesa.length} produk UMKM {lintas ? "dari desa singgah" : desaUtama.nama} bisa di-pre-order dan diambil saat kunjungan.
            </Link>
          )}
        </aside>
      </div>

      <section className="bg-surface py-14 sm:py-16">
        <div className="container-page">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-semibold">{lain.length ? `Paket lain di ${kecUtama.nama}` : "Paket lainnya"}</h2>
            <Link href={`/kecamatan/${kecUtama.slug}`} className="flex items-center gap-1.5 font-medium text-link">
              Halaman Kecamatan {kecUtama.nama} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lainFallback.map((p) => (
              <PaketCard key={p.slug} paket={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PengelolaCard({
  paket,
  pengelola,
  kecNama,
  kecSlug,
}: {
  paket: Paket;
  pengelola: ReturnType<typeof pengelolaPaket>;
  kecNama: string;
  kecSlug: string;
}) {
  const inisial = paket.penyelenggara.nama
    .split(" ")
    .slice(-1)[0]
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-line p-5 sm:flex-row sm:items-center">
      <span className="grid size-16 shrink-0 place-items-center rounded-full bg-laut-100 text-lg font-semibold text-laut-700">{inisial}</span>
      <div className="flex-1">
        <p className="text-lg font-medium">{paket.penyelenggara.nama}</p>
        <p className="mt-0.5 text-sm text-muted">
          {pengelola.operator ? `Operator: ${pengelola.operator} · ` : ""}
          {paket.penyelenggara.tipe === "kabupaten" ? "Koordinator tingkat kabupaten" : `Desa ${pengelola.desa?.nama}, Kec. ${kecNama}`}
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
          <li className="flex items-center gap-1.5">
            <MessageCircle className="size-3.5 text-wa" /> Balas ≤ 24 jam
          </li>
          {pengelola.wa.length > 1 && (
            <li className="flex items-center gap-1.5">
              <Phone className="size-3.5 text-wa" /> {pengelola.wa.length} nomor WhatsApp
            </li>
          )}
          {pengelola.terverifikasi && (
            <li className="flex items-center gap-1.5">
              <CircleCheck className="size-3.5 text-ok" /> Terverifikasi kecamatan
            </li>
          )}
        </ul>
      </div>
      <Link href={`/kecamatan/${kecSlug}`} className="self-start rounded-full border border-line px-4 py-2.5 text-sm font-medium hover:bg-surface sm:self-auto">
        Profil desa
      </Link>
    </div>
  );
}
