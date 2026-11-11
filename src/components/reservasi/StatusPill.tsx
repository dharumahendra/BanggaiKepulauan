import type { StatusReservasi } from "@/lib/types";

export const STATUS_LABEL: Record<StatusReservasi, string> = {
  menunggu: "Menunggu konfirmasi",
  dikonfirmasi: "Dikonfirmasi",
  dp_diterima: "DP diterima",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

const WARNA: Record<StatusReservasi, string> = {
  menunggu: "bg-sun-100 text-sun-800",
  dikonfirmasi: "bg-laut-100 text-laut-800",
  dp_diterima: "bg-ok-50 text-ok",
  selesai: "bg-ok-50 text-ok",
  dibatalkan: "bg-bad-50 text-bad",
};

export function StatusPill({ status }: { status: StatusReservasi }) {
  return (
    <span className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${WARNA[status]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}
