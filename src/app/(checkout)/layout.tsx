import { Lock, MessageCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";
import { waLink } from "@/lib/whatsapp";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="no-print border-b border-line bg-white">
        <div className="container-page flex h-[70px] items-center justify-between gap-3">
          <Logo sub="Reservasi paket wisata" />
          <div className="flex items-center gap-5">
            <p className="hidden items-center gap-2 text-sm text-muted md:flex">
              <Lock className="size-4" /> Data hanya untuk transaksi
            </p>
            <a
              href={waLink(SITE.wa, "Halo, saya butuh bantuan saat reservasi paket wisata.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm font-medium hover:bg-surface"
            >
              <MessageCircle className="size-4 text-wa" />
              <span className="hidden sm:inline">Butuh bantuan? Chat pengelola</span>
              <span className="sm:hidden">Bantuan</span>
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
