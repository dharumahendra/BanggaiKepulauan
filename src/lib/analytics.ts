// Event analytics (PRD I3): artikel_view, tour_open, scene_view, hotspot_open, cta_paket_click.
// Dikirim ke Umami atau GA4 bila skripnya dipasang; tanpa itu hanya dicatat di konsol saat dev.

type DataEvent = Record<string, string | number | boolean>;
type WinAnalytics = Window & {
  umami?: { track: (nama: string, data?: DataEvent) => void };
  gtag?: (cmd: "event", nama: string, data?: DataEvent) => void;
};

export function lacak(nama: string, data?: DataEvent) {
  if (typeof window === "undefined") return;
  const w = window as WinAnalytics;
  try {
    w.umami?.track(nama, data);
    w.gtag?.("event", nama, data);
  } catch {
    /* analytics tidak boleh mengganggu halaman */
  }
  if (process.env.NODE_ENV !== "production") console.debug("[analytics]", nama, data ?? {});
}
