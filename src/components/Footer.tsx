import Link from "next/link";
import { Logo } from "./Logo";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./icons";
import { SITE } from "@/lib/site";

const JELAJAH = [
  { href: "/kecamatan", label: "Kecamatan" },
  { href: "/paket", label: "Paket wisata" },
  { href: "/produk", label: "Oleh-oleh UMKM" },
  { href: "/peta", label: "Peta GIS" },
  { href: "/kecamatan#statistik", label: "Statistik kabupaten" },
];
const BANTUAN = [
  { href: "/cek", label: "Cek pesanan" },
  { href: "/info#cara-memesan", label: "Cara memesan" },
  { href: "/info#syarat", label: "Syarat & pembatalan" },
  { href: "/info#faq", label: "FAQ cuaca & musim" },
  { href: "/info#privasi", label: "Kebijakan privasi" },
];

export function Footer() {
  const tahun = 2027; // TODO: ganti ke tahun berjalan saat rilis
  return (
    <footer className="no-print mt-auto bg-deep text-white/85">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-16">
        <div>
          <Logo tile inverse />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">{SITE.deskripsi}</p>
          <div className="mt-5 flex gap-2">
            {[
              { href: SITE.sosial.instagram, label: "Instagram", Icon: InstagramIcon },
              { href: SITE.sosial.facebook, label: "Facebook", Icon: FacebookIcon },
              { href: SITE.sosial.youtube, label: "YouTube", Icon: YoutubeIcon },
            ].map(({ href, label, Icon }) => (
              <a key={label} href={href} aria-label={label} className="grid size-9 place-items-center rounded-full border border-white/20 hover:bg-white/10">
                <Icon />
              </a>
            ))}
          </div>
        </div>
        <FooterCol judul="Jelajah" items={JELAJAH} />
        <FooterCol judul="Bantuan" items={BANTUAN} />
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-laut-100/60 uppercase">Hubungi</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>{SITE.pemilik}</li>
            <li>{SITE.alamat}</li>
            <li>
              <a href={`https://wa.me/${SITE.wa}`} className="hover:text-white">
                {SITE.waLabel} (WhatsApp)
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-white">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/55 sm:flex-row sm:justify-between">
        <p>© {tahun} Pemerintah Kabupaten Banggai Kepulauan · Dinas Pariwisata</p>
        <p>Data wilayah: BPS Banggai Kepulauan &amp; Badan Informasi Geospasial</p>
      </div>
    </footer>
  );
}

function FooterCol({ judul, items }: { judul: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.14em] text-laut-100/60 uppercase">{judul}</p>
      <ul className="mt-4 space-y-3 text-sm">
        {items.map((i) => (
          <li key={i.label}>
            <Link href={i.href} className="hover:text-white">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
