import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { KecamatanCard } from "@/components/KecamatanCard";
import { semuaKecamatan } from "@/lib/data";

export const metadata: Metadata = { title: "Kecamatan", description: "12 kecamatan di Kabupaten Banggai Kepulauan: ibu kota, jumlah desa, paket, dan atraksi." };

export default function KecamatanPage() {
  const kec = semuaKecamatan();
  const total = kec.reduce(
    (s, k) => ({ penduduk: s.penduduk + k.penduduk, luas: s.luas + k.luasKm2, desa: s.desa + k.jumlahDesa }),
    { penduduk: 0, luas: 0, desa: 0 },
  );
  const fmt = (n: number, d = 0) => n.toLocaleString("id-ID", { maximumFractionDigits: d });

  return (
    <>
      <section className="bg-surface">
        <div className="container-page py-10 sm:py-12">
          <Breadcrumb items={[{ href: "/", label: "Beranda" }, { label: "Kecamatan" }]} />
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{kec.length} kecamatan Banggai Kepulauan</h1>
          <p className="mt-4 max-w-2xl text-[17px] text-muted">
            Pilih kecamatan untuk melihat wisata, desa, dan paket yang tersedia. Ibu kota kabupaten berada di Salakan, Kecamatan Tinangkung.
          </p>
        </div>
      </section>
      <section className="container-page py-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {kec.map((k) => (
            <KecamatanCard key={k.slug} k={k} />
          ))}
        </div>
      </section>
      <section id="statistik" className="container-page pb-16">
        <h2 className="text-2xl font-semibold">Statistik kabupaten</h2>
        <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { n: fmt(total.penduduk), l: "jiwa (estimasi 2025)" },
            { n: fmt(total.luas, 0), l: "km² luas daratan" },
            { n: fmt(total.desa), l: "desa & kelurahan" },
            { n: String(kec.length), l: "kecamatan" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-line p-5">
              <dt className="text-3xl font-semibold text-laut-700">{s.n}</dt>
              <dd className="mt-1 text-sm text-muted">{s.l}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                {["Kecamatan", "Kode", "Ibu kota", "Luas (km²)", "Penduduk 2025", "Desa/kel.", "Pulau"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {kec.map((k) => (
                <tr key={k.slug}>
                  <td className="px-4 py-3 font-medium">{k.nama}</td>
                  <td className="px-4 py-3 text-muted">{k.kode}</td>
                  <td className="px-4 py-3">{k.ibuKota}</td>
                  <td className="px-4 py-3">{fmt(k.luasKm2, 2)}</td>
                  <td className="px-4 py-3">{fmt(k.penduduk)}</td>
                  <td className="px-4 py-3">{k.jumlahDesa}</td>
                  <td className="px-4 py-3">{k.jumlahPulau ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">Sumber: BPS, Kabupaten Banggai Kepulauan Dalam Angka 2026 (estimasi pertengahan 2025). Perlu verifikasi ulang sebelum rilis.</p>
      </section>
    </>
  );
}
