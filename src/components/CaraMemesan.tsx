import { BadgeCheck, Calculator, ClipboardList, MessageCircle } from "lucide-react";
import { SectionHead } from "./ui";

const LANGKAH = [
  { Icon: Calculator, judul: "Pilih paket & hitung harga", teks: "Atur tanggal, jumlah peserta, dan add-on. Total estimasi langsung muncul." },
  { Icon: ClipboardList, judul: "Isi data pemesan", teks: "Nama, nomor WhatsApp, dan catatan. Kode reservasi dibuat otomatis." },
  { Icon: MessageCircle, judul: "Konfirmasi via WhatsApp", teks: "Pesan berisi kode dan rincian terisi otomatis ke nomor pengelola desa." },
  { Icon: BadgeCheck, judul: "Bayar DP & pantau status", teks: "Transfer atau QRIS sesuai arahan pengelola, lalu cek status dengan kode reservasi." },
];

export function CaraMemesan() {
  return (
    <section id="cara-memesan" className="bg-surface py-16 sm:py-20">
      <div className="container-page">
        <SectionHead
          eyebrow="Cara memesan"
          judul="Empat langkah, tanpa akun"
          deskripsi="Website hanya mencatat pesanan. Pembayaran dan konfirmasi akhir dilakukan langsung dengan pengelola desa."
        />
        <ol className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LANGKAH.map(({ Icon, judul, teks }, i) => {
            const sorot = i === 2;
            return (
              <li key={judul} className={`rounded-2xl border p-5 ${sorot ? "border-laut-700 bg-laut-700 text-white" : "border-line bg-white"}`}>
                <div className="flex items-start justify-between">
                  <span className={`grid size-11 place-items-center rounded-xl ${sorot ? "bg-white/15" : "bg-laut-100 text-laut-700"}`}>
                    <Icon className="size-5" />
                  </span>
                  <span className={`text-2xl font-semibold ${sorot ? "text-white/40" : "text-line"}`}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-5 text-lg font-medium">{judul}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${sorot ? "text-white/80" : "text-muted"}`}>{teks}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
