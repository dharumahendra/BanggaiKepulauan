import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingAssist } from "@/components/FloatingAssist";
import { kecamatanUrutAbjad } from "@/lib/data";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar kecamatan={kecamatanUrutAbjad()} />
      <main className="flex-1">{children}</main>
      <FloatingAssist />
      <Footer />
    </>
  );
}
