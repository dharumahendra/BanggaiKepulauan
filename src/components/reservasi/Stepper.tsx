import { Check } from "lucide-react";

const LANGKAH = ["Pilih paket", "Data pemesan", "Konfirmasi & bayar", "Selesai"];

/** Penunjuk langkah reservasi. `aktif` dimulai dari 1. */
export function Stepper({ aktif }: { aktif: 1 | 2 | 3 | 4 }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Langkah reservasi">
      {LANGKAH.map((l, i) => {
        const n = i + 1;
        const selesai = n < aktif;
        const kini = n === aktif;
        return (
          <li key={l} className={`flex items-center gap-2 sm:gap-3 ${i < LANGKAH.length - 1 ? "flex-1" : ""}`} aria-current={kini ? "step" : undefined}>
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-semibold sm:size-[30px] ${
                selesai ? "bg-ok text-white" : kini ? "bg-laut-700 text-white" : "border border-line bg-white text-muted"
              }`}
            >
              {selesai ? <Check className="size-4" /> : n}
            </span>
            <span className={`whitespace-nowrap text-sm ${kini ? "font-semibold text-ink" : selesai ? "text-ink" : "text-muted"} ${kini ? "" : "hidden md:inline"}`}>
              {l}
            </span>
            {i < LANGKAH.length - 1 && <span className={`h-0.5 flex-1 rounded ${selesai ? "bg-ok" : "bg-line"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
