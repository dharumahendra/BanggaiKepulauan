import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE.domain}`),
  title: {
    default: `${SITE.nama} · Wisata & UMKM Banggai Kepulauan`,
    template: `%s · ${SITE.nama}`,
  },
  description: SITE.deskripsi,
  openGraph: {
    title: `${SITE.nama} · Wisata & UMKM Banggai Kepulauan`,
    description: SITE.deskripsi,
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c2831",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${dmSans.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
