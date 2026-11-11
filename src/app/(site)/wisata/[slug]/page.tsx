import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowRight,
  Clock,
  Eye,
  Lightbulb,
  MapPin,
  MessageCircle,
  Rotate3d,
  Ship,
  ShieldCheck,
  Sun,
  Ticket,
  Wifi,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui";
import { DestinasiCard } from "@/components/DestinasiCard";
import { KATEGORI_LABEL, PaketCard } from "@/components/PaketCard";
import { BagikanButton } from "@/components/paket/BagikanButton";
import { LacakTampil, LinkLacak } from "@/components/wisata/Lacak";
import { IkonHotspot } from "@/features/tour/ikon";
import { destinasiKartu, getDesa, getDestinasi, getKecamatan, getTur, paketDiDestinasi, semuaDestinasi } from "@/lib/data";
import { rupiah } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";

export function generateStaticParams() {
  return semuaDestinasi().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/wisata/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getDestinasi(slug);
  if (!d) return {};
  const k = destinasiKartu(d);
  return {
    title: d.nama,
    description: d.ringkasan ?? `${d.nama}, destinasi wisata ${KATEGORI_LABEL[d.kategori].toLowerCase()} di ${k.lokasi}.`,
    openGraph: { title: d.nama, description: d.ringkasan, images: d.foto ? [d.foto] : undefined, type: "article" },
  };
}

export default function ArtikelDestinasiPage({ params }: PageProps<"/wisata/[slug]">) {
  return (
    <Suspense fallback={<div className="container-page h-[70vh] py-10" aria-busy="true" />}>
      <ArtikelDestinasi params={params} />
    </Suspense>
  );
}

async function ArtikelDestinasi({ params }: { params: PageProps<"/wisata/[slug]">["params"] }) {
  const { slug } = await params;
  const a = getDestinasi(slug);
  if (!a) notFound();
  const d = destinasiKartu(a);
  const desa = getDesa(a.desa);
  const kec = getKecamatan(d.kecamatanSlug);
  const tur = getTur(a.slug);
  const { paket, sumber } = paketDiDestinasi(a.slug);
  const termurah = paket.length ? Math.min(...paket.map((p) => p.harga)) : 0;
  const lain = semuaDestinasi()
    .filter((x) => x.slug !== a.slug && getDesa(x.desa)?.kecamatan === d.kecamatanSlug)
    .map(destinasiKartu)
    .slice(0, 4);
  const hotspot = tur?.scene.flatMap((s) => s.hotspot) ?? [];
  const jumlahDarat = tur?.scene.filter((s) => s.tipe === "darat").length ?? 0;
  const jumlahUdara = tur?.scene.filter((s) => s.tipe === "udara").length ?? 0;
  const tanyaWA = desa?.pengelola?.wa[0];
  const hrefTur = `/wisata/${a.slug}/virtual-tour`;

  return (
    <>
      <LacakTampil event="artikel_view" data={{ destinasi: a.slug, tur: tur ? "ya" : "tidak" }} />
      <div className="container-page grid gap-10 pb-28 pt-6 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 lg:pb-16">
        <article className="min-w-0">
          <Breadcrumb items={[{ href: "/wisata", label: "Wisata" }, { href: `/kecamatan/${d.kecamatanSlug}`, label: d.kecamatanNama }, { label: a.nama }]} />
          <div className="mt-5 flex flex-wrap gap-2">
            {[KATEGORI_LABEL[a.kategori], ...(a.tag ?? [])].map((t) => (
              <span key={t} className="rounded-full bg-laut-50 px-3.5 py-1.5 text-sm font-medium text-laut-800">
                {t}
              </span>
            ))}
          </div>
          <h1 className="mt-3 text-[34px] font-semibold leading-tight tracking-tight sm:text-5xl">{a.nama}</h1>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <Link href={`/kecamatan/${d.kecamatanSlug}`} className="flex items-center gap-1.5 text-[17px] text-link hover:underline">
              <MapPin className="size-[18px]" /> Desa {d.desaNama} · {d.kecamatanNama}
            </Link>
            <BagikanButton judul={a.nama} />
          </div>

          {/* Tombol Virtual Tour + thumbnail (PRD A7). Hanya tampil bila tur Tayang. */}
          {tur ? (
            <div className="relative isolate mt-5 overflow-hidden rounded-3xl bg-deep">
              {a.foto && <Image src={a.foto} alt="" fill priority sizes="(min-width: 1024px) 700px, 100vw" className="-z-10 object-cover" />}
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-deep/10 via-deep/20 to-deep/75" />
              <div className="flex min-h-[300px] flex-col justify-between p-4 sm:min-h-[340px] sm:p-6">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-sun-400 px-3.5 py-2 text-[15px] font-semibold text-ink">
                    <Rotate3d className="size-5" /> 360°
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-deep/55 px-3 py-1.5 text-[13px] text-white backdrop-blur">
                    <Wifi className="size-3.5" /> Ringan · ±{tur.ukuranPreviewKB} KB
                  </span>
                </div>
                <div className="text-white">
                  <p className="text-xl font-semibold sm:text-2xl">{tur.judulPreview}</p>
                  <p className="mt-1 text-sm text-white/80">
                    {jumlahDarat} titik · {jumlahUdara} pandangan drone · {hotspot.length} info konservasi
                  </p>
                  <LinkLacak
                    href={hrefTur}
                    prefetch={false}
                    event="tour_open"
                    data={{ destinasi: a.slug, sumber: "artikel" }}
                    className="mt-4 flex min-h-14 items-center justify-center gap-2.5 rounded-2xl bg-white text-lg font-semibold text-laut-800 hover:bg-laut-50 sm:max-w-sm"
                  >
                    <Eye className="size-6" /> Jelajahi 360°
                  </LinkLacak>
                </div>
              </div>
            </div>
          ) : (
            a.foto && (
              <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-3xl bg-surface">
                <Image src={a.foto} alt={a.nama} fill priority sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
              </div>
            )
          )}

          {a.ringkasan && <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">{a.ringkasan}</p>}

          {a.info && (
            <dl className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-line p-4 sm:p-5">
              {[
                { Ikon: Ship, l: "Akses", v: a.info.akses },
                { Ikon: Sun, l: "Terbaik", v: a.info.waktuTerbaik },
                { Ikon: Ticket, l: "Retribusi", v: a.info.tiket },
              ].map((x) => (
                <div key={x.l}>
                  <x.Ikon className="size-5 text-laut-700" />
                  <dt className="mt-2 text-sm text-muted">{x.l}</dt>
                  <dd className="text-[15px] font-semibold sm:text-base">{x.v}</dd>
                </div>
              ))}
            </dl>
          )}

          {hotspot.length > 0 && (
            <section className="mt-9">
              <h2 className="text-2xl font-semibold">Yang kamu temui di tur ini</h2>
              <ul className="mt-4 space-y-3">
                {hotspot.map((h) => (
                  <li key={h.id} className="flex items-center gap-4 text-[17px]">
                    <IkonHotspot tipe={h.tipe} className="size-11" />
                    {h.judul}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {a.artikel?.map((b) => (
            <section key={b.judul} className="mt-10">
              <h2 className="text-2xl font-semibold">{b.judul}</h2>
              {b.paragraf.map((p, i) => (
                <p key={i} className="mt-3 text-[17px] leading-relaxed text-ink/85">
                  {p}
                </p>
              ))}
            </section>
          ))}

          {a.aktivitas && (
            <section className="mt-10">
              <h2 className="text-2xl font-semibold">Yang bisa dilakukan</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[17px] leading-relaxed text-ink/85 marker:text-laut-700">
                {a.aktivitas.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
          )}

          {(a.tips || a.etika) && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {a.tips && (
                <section className="rounded-2xl bg-sun-100 p-5">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
                    <Lightbulb className="size-5 text-sun-800" /> Tips berkunjung
                  </h2>
                  <ul className="mt-3 space-y-2 text-[15px] leading-relaxed">
                    {a.tips.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </section>
              )}
              {a.etika && (
                <section className="rounded-2xl bg-laut-50 p-5">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
                    <ShieldCheck className="size-5 text-laut-700" /> Etika berkunjung
                  </h2>
                  <ul className="mt-3 space-y-2 text-[15px] leading-relaxed">
                    {a.etika.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {/* Info praktis versi HP (desktop di kolom samping) */}
          {a.info && (
            <div className="mt-10 lg:hidden">
              <InfoPraktis info={a.info} />
            </div>
          )}

          {a.galeri && a.galeri.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-semibold">Galeri</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                {a.galeri.map((g, i) => (
                  <div key={g} className={`relative overflow-hidden rounded-2xl bg-surface ${i === 0 ? "col-span-2 aspect-[16/8]" : "aspect-[4/3]"}`}>
                    <Image src={g} alt={`${a.nama}, foto ${i + 1}`} fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10">
            <h2 className="text-2xl font-semibold">Lokasi</h2>
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-dashed border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2.5 text-[15px]">
                <MapPin className="mt-0.5 size-5 shrink-0 text-laut-700" />
                <span>
                  Desa {d.desaNama}, Kecamatan {d.kecamatanNama}
                  <span className="block text-[13px] text-muted">Peta lokasi mini menyusul bersama Peta GIS kecamatan.</span>
                </span>
              </p>
              <Link href="/peta" className="self-start rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-laut-800 sm:self-auto">
                Buka peta
              </Link>
            </div>
          </section>

          <section id="paket" className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-semibold">{sumber === "desa" ? `Paket di Desa ${d.desaNama}` : "Paket yang singgah di sini"}</h2>
            {paket.length > 0 ? (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {paket.map((p) => (
                  <PaketCard key={p.slug} paket={p} />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-surface p-5">
                <p className="text-[15px] text-muted">Belum ada paket yang singgah di sini. Tanyakan langsung ke pengelola desa.</p>
                {tanyaWA && (
                  <a
                    href={waLink(tanyaWA, `Halo ${desa?.pengelola?.nama}, saya ingin bertanya tentang kunjungan ke ${a.nama}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-wa px-5 py-3 text-[15px] font-medium text-white hover:bg-wa-dark"
                  >
                    <MessageCircle className="size-5" /> Tanya pengelola via WhatsApp
                  </a>
                )}
              </div>
            )}
          </section>

          {lain.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold">Destinasi lain di {d.kecamatanNama}</h2>
              <div className="mt-5 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
                {lain.map((x) => (
                  <DestinasiCard key={x.slug} d={x} />
                ))}
              </div>
            </section>
          )}
          {kec && (
            <p className="mt-8 text-sm text-muted">
              Lihat semua tentang{" "}
              <Link href={`/kecamatan/${kec.slug}`} className="font-medium text-link">
                Kecamatan {kec.nama}
              </Link>
              .
            </p>
          )}
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            {paket.length > 0 && (
              <div className="rounded-3xl border border-line bg-white p-5 shadow-sm">
                <p className="text-sm text-muted">{paket.length} paket singgah di sini</p>
                <p className="text-2xl font-semibold">Mulai {rupiah(termurah)}</p>
                <LinkLacak
                  href="#paket"
                  event="cta_paket_click"
                  data={{ destinasi: a.slug, sumber: "artikel" }}
                  className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-full bg-laut-700 font-medium text-white hover:bg-laut-800"
                >
                  Lihat paket <ArrowRight className="size-4" />
                </LinkLacak>
                {tur && (
                  <LinkLacak
                    href={hrefTur}
                    prefetch={false}
                    event="tour_open"
                    data={{ destinasi: a.slug, sumber: "artikel_samping" }}
                    className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-full border border-line font-medium text-laut-800 hover:bg-surface"
                  >
                    <Rotate3d className="size-4" /> Virtual Tour 360°
                  </LinkLacak>
                )}
              </div>
            )}
            {a.info && <InfoPraktis info={a.info} />}
          </div>
        </aside>
      </div>

      {/* Bar bawah HP: paket + tombol 360° menempel saat artikel digulir */}
      <div data-bar-bawah className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden">
        <div className="container-page flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            {paket.length > 0 ? (
              <>
                <p className="truncate text-[13px] text-muted">{paket.length} paket singgah di sini</p>
                <p className="whitespace-nowrap text-[17px] font-semibold leading-tight">Mulai {rupiah(termurah)}</p>
              </>
            ) : (
              <p className="text-sm text-muted">Belum ada paket</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {tur && (
              <LinkLacak
                href={hrefTur}
                prefetch={false}
                event="tour_open"
                data={{ destinasi: a.slug, sumber: "bar_bawah" }}
                aria-label="Buka Virtual Tour 360°"
                className="grid size-12 place-items-center rounded-full bg-sun-400 text-ink"
              >
                <Rotate3d className="size-5" />
              </LinkLacak>
            )}
            <LinkLacak
              href="#paket"
              event="cta_paket_click"
              data={{ destinasi: a.slug, sumber: "artikel" }}
              className="flex min-h-12 items-center gap-2 whitespace-nowrap rounded-full bg-laut-700 px-4 text-[15px] font-medium text-white min-[400px]:px-5"
            >
              {paket.length > 0 ? "Lihat paket" : "Tanya desa"} <ArrowRight className="size-4" />
            </LinkLacak>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoPraktis({ info }: { info: NonNullable<ReturnType<typeof getDestinasi>>["info"] & object }) {
  const baris = [
    { l: "Cara menuju", v: info.caraMenuju },
    { l: "Titik penjemputan", v: info.titikJemput },
    { l: "Estimasi waktu", v: info.estimasiWaktu },
    { l: "Waktu terbaik", v: info.waktuTerbaikDetail ?? info.waktuTerbaik },
    { l: "Tiket / retribusi", v: info.tiket },
  ].filter((b) => b.v);
  return (
    <section className="rounded-3xl bg-surface p-5">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Clock className="size-5 text-laut-700" /> Info praktis
      </h2>
      <dl className="mt-3 divide-y divide-line">
        {baris.map((b) => (
          <div key={b.l} className="py-3">
            <dt className="text-[13px] text-muted">{b.l}</dt>
            <dd className="mt-0.5 text-[15px] leading-relaxed">{b.v}</dd>
          </div>
        ))}
        <div className="py-3">
          <dt className="text-[13px] text-muted">Fasilitas</dt>
          <dd className="mt-1.5 flex flex-wrap gap-1.5">
            {info.fasilitas.map((f) => (
              <span key={f} className="rounded-full bg-white px-2.5 py-1 text-[13px]">
                {f}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </section>
  );
}
