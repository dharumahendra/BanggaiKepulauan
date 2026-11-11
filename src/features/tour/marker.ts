import type { MarkerConfig } from "@photo-sphere-viewer/markers-plugin";
import { GAYA_HOTSPOT } from "./ikon";
import type { Scene, TipeHotspot } from "./types";

export const rad = (deg: number) => (deg * Math.PI) / 180;
export const deg = (r: number) => (r * 180) / Math.PI;
/** Normalisasi sudut ke rentang -180..180 */
export const normal = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180;

const svg = (isi: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${isi}</svg>`;

// Path ikon mengikuti Lucide (ISC), disalin agar marker bisa berupa HTML biasa.
const IKON: Record<TipeHotspot | "jejak" | "perisai", string> = {
  info: svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
  aturan: svg(
    '<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
  ),
  spesies: svg('<path d="M2 16s9-15 20-4C11 23 2 8 2 8"/><path d="M5 12.5h.01"/><path d="M16.47 11.25c-1 .27-2.5 1.62-2.5 1.62"/>'),
  zona: svg(
    '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  ),
  jejak: svg(
    '<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/>',
  ),
  perisai: svg('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>'),
};

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export type DataMarker = { jenis: "tautan"; ke: string } | { jenis: "hotspot"; id: string };

export function buatMarker(scene: Scene, namaScene: Record<string, string>, opsi: { aktif?: string | null; polos: boolean }): MarkerConfig[] {
  const out: MarkerConfig[] = [];

  for (const z of scene.zona ?? []) {
    const boleh = z.jenis === "boleh";
    out.push({
      id: `zona-${z.id}`,
      polygon: z.poligon.map(([y, p]) => [rad(y), rad(p)] as [number, number]),
      svgStyle: {
        fill: boleh ? "rgba(46,139,62,0.22)" : "rgba(214,69,61,0.38)",
        stroke: boleh ? "#86e08f" : "#f28b82",
        strokeWidth: "3px",
      },
      zIndex: 1,
    });
    out.push({
      id: `zona-label-${z.id}`,
      position: { yaw: rad(z.labelPos.yaw), pitch: rad(z.labelPos.pitch) },
      html: `<span class="vt-zona-label" style="--c:${boleh ? "#2e8b3e" : "#d92d2d"}">${boleh ? IKON.jejak : IKON.perisai}${esc(
        opsi.polos ? (z.labelPendek ?? z.label) : z.label,
      )}</span>`,
      anchor: "center center",
      zIndex: 2,
    });
  }

  for (const t of scene.tautan) {
    const dx = normal(t.yaw - scene.yawAwal);
    const kiri = dx < -15;
    const kanan = dx > 15;
    const nama = esc(namaScene[t.ke] ?? t.ke);
    out.push({
      id: `tautan-${t.ke}`,
      position: { yaw: rad(t.yaw), pitch: rad(t.pitch) },
      html: `<button type="button" class="vt-arrow" aria-label="Pindah ke ${nama}" style="--rot:${kiri ? -38 : kanan ? 38 : 0}deg">
        <svg class="vt-chevron" viewBox="0 0 108 64" aria-hidden="true"><path d="M10 54 L54 12 L98 54 L80 54 L54 30 L28 54 Z" fill="#fff" stroke="#0e4c68" stroke-width="3" stroke-linejoin="round"/></svg>
        <span class="vt-arrow-label">${kiri ? "← " : ""}${nama}${kanan ? " →" : ""}</span></button>`,
      anchor: "center center",
      data: { jenis: "tautan", ke: t.ke } satisfies DataMarker,
      zIndex: 5,
    });
  }

  for (const h of scene.hotspot) {
    const g = GAYA_HOTSPOT[h.tipe];
    out.push({
      id: `hs-${h.id}`,
      position: { yaw: rad(h.yaw), pitch: rad(h.pitch) },
      html: `<button type="button" class="vt-hs${opsi.aktif === h.id ? " aktif" : ""}" aria-label="${g.label}: ${esc(h.judul)}">
        <span class="vt-hs-dot" style="--c:${g.warna}">${IKON[h.tipe]}</span>
        <span class="vt-hs-label">${esc(h.judul)}</span></button>`,
      anchor: "center center", // label diposisikan absolut, jadi titik = tengah lingkaran
      data: { jenis: "hotspot", id: h.id } satisfies DataMarker,
      zIndex: 10,
    });
  }
  return out;
}
