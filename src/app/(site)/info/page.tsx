import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { CaraMemesan } from "@/components/CaraMemesan";

export const metadata: Metadata = { title: "Info & bantuan", description: "Cara memesan, syarat dan pembatalan, FAQ cuaca dan musim, serta kebijakan privasi." };

// Isi kebijakan di bawah adalah draf; nominal DP dan aturan refund menunggu musyawarah desa (lihat pertanyaan terbuka PRD).
const FAQ = [
  { q: "Kapan musim terbaik berkunjung?", a: "Laut umumnya lebih tenang di luar puncak musim angin timur. Pengelola desa akan mengabari H-1 bila gelombang tinggi." },
  { q: "Apa yang terjadi bila kapal Luwuk–Salakan batal?", a: "Hubungi pengelola desa; jadwal paket bisa digeser tanpa biaya bila pembatalan transportasi disebabkan cuaca." },
  { q: "Apakah ada sinyal dan ATM di desa?", a: "Sinyal terbatas di beberapa titik dan ATM hanya ada di kota kecamatan besar. Siapkan uang tunai untuk sisa pembayaran." },
  { q: "Apakah anak-anak boleh ikut snorkeling?", a: "Boleh, dengan pelampung dan pendampingan pemandu. Tulis usia anak di catatan saat reservasi." },
];

export default function InfoPage() {
  return (
    <>
      <section className="bg-surface">
        <div className="container-page py-10 sm:py-12">
          <Breadcrumb items={[{ href: "/", label: "Beranda" }, { label: "Info & bantuan" }]} />
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Info &amp; bantuan</h1>
        </div>
      </section>
      <CaraMemesan />
      <div className="container-page max-w-3xl space-y-14 py-16 text-[16px] leading-relaxed">
        <section id="syarat" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold">Syarat &amp; pembatalan</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-ink/85">
            <li>Harga di website adalah estimasi; harga final dikonfirmasi pengelola desa lewat WhatsApp.</li>
            <li>DP dibayar setelah reservasi dikonfirmasi, ke rekening/QRIS lembaga desa (BUMDes/Pokdarwis), bukan rekening pribadi.</li>
            <li>Batal karena cuaca atau gelombang tinggi: jadwal ulang gratis atau DP kembali penuh.</li>
            <li>Batal oleh wisatawan lebih dari 7 hari sebelum keberangkatan: DP kembali. Kurang dari itu, sesuai kesepakatan desa.</li>
            <li>Pengelola membalas paling lambat 24 jam. Setiap desa memiliki dua nomor WhatsApp.</li>
          </ul>
        </section>
        <section id="faq" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold">FAQ cuaca &amp; musim</h2>
          <div className="mt-4 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="rounded-2xl border border-line px-5 py-4">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-2 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section id="etika" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold">Etika wisata bahari</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-ink/85">
            <li>Jangan menyentuh, memberi makan, atau mengambil capungan Banggai dan bulu babi.</li>
            <li>Gunakan sunscreen ramah karang dan jangan berdiri di atas karang.</li>
            <li>Bawa pulang sampah plastik Anda.</li>
          </ul>
        </section>
        <section id="privasi" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold">Kebijakan privasi</h2>
          <p className="mt-4 text-ink/85">
            Data pemesan (nama, nomor WhatsApp, email) hanya dipakai untuk memproses reservasi dan pesanan, tidak ditampilkan di publik, dan tidak dibagikan
            ke pihak lain selain pengelola desa terkait. Data reservasi yang lebih dari 12 bulan dapat dihapus atas permintaan.
          </p>
        </section>
        <section id="panduan" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold">Panduan untuk pengelola &amp; UMKM</h2>
          <p className="mt-4 text-ink/85">
            Panduan pengelola (PDF dan video singkat) sedang disusun. Sementara itu, pelaku UMKM dapat menghubungi operator desa atau Pokdarwis dengan
            membawa foto produk dan daftar harga.
          </p>
        </section>
      </div>
    </>
  );
}
