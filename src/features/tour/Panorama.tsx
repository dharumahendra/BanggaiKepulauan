"use client";

// Viewer panorama berbasis Photo Sphere Viewer v5. File ini HANYA dimuat lewat
// dynamic import di halaman Virtual Tour (PRD V4), jadi three.js tidak ikut
// bundle halaman lain.
import { useEffect, useRef, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { GyroscopePlugin } from "@photo-sphere-viewer/gyroscope-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "./tour.css";
import { buatMarker, deg, normal, rad, type DataMarker } from "./marker";
import type { Scene } from "./types";

export type KontrolPanorama = {
  zoomMasuk: () => void;
  zoomKeluar: () => void;
  putar: (yaw: number, pitch?: number) => void;
  gyroDidukung: () => Promise<boolean>;
  gyro: () => Promise<boolean>; // toggle, mengembalikan status baru
};

type Props = {
  scene: Scene;
  yaw?: number; // arah awal scene ini (dari URL atau yawAwal)
  namaScene: Record<string, string>;
  hotspotAktif: string | null;
  polos: boolean; // HP: marker tanpa label
  onPindah: (ke: string) => void;
  onHotspot: (id: string) => void;
  onPosisi: (yaw: number, pitch: number) => void;
  onProgress: (persen: number) => void;
  onMuat: (sceneId: string) => void;
  onGagal: () => void;
  onKontrol: (k: KontrolPanorama) => void;
};

const zoomAwal = (el: HTMLElement) => (el.clientHeight > el.clientWidth ? 20 : 55);

export default function Panorama(props: Props) {
  const el = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const cb = useRef(props);
  const [dimuat, setDimuat] = useState<string | null>(null);
  const pertama = useRef(props.scene);

  useEffect(() => {
    cb.current = props;
  });

  // Inisialisasi sekali. Ditunda satu tick: di dev, StrictMode langsung
  // unmount-mount ulang; tanpa penundaan viewer pertama dihancurkan saat
  // panorama masih dimuat dan viewer kedua menunggu muatan yang dibatalkan.
  useEffect(() => {
    const wadah = el.current;
    if (!wadah) return;
    let aktif: Viewer | null = null;
    const t = setTimeout(() => {
      const s = pertama.current;
      let viewer: Viewer;
      try {
        viewer = new Viewer({
          container: wadah,
          panorama: s.panorama,
          defaultYaw: rad(cb.current.yaw ?? s.yawAwal),
          defaultPitch: rad(s.pitchAwal ?? 0),
          defaultZoomLvl: zoomAwal(wadah),
          minFov: 30,
          maxFov: 100,
          navbar: false,
          loadingTxt: "",
          keyboard: "always",
          mousewheelCtrlKey: false,
          defaultTransition: { speed: 900, rotation: false, effect: "fade" },
          plugins: [[MarkersPlugin, {}], [GyroscopePlugin, { touchmove: true }]],
        });
      } catch {
        cb.current.onGagal();
        return;
      }
      aktif = viewer;
      viewerRef.current = viewer;
      const markers = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
      const gyro = viewer.getPlugin<GyroscopePlugin>(GyroscopePlugin);

      viewer.addEventListener("load-progress", (e) => cb.current.onProgress(e.progress));
      viewer.addEventListener("panorama-error", () => cb.current.onGagal());
      viewer.addEventListener("ready", () => {
        setDimuat(s.id);
        cb.current.onProgress(100);
        cb.current.onMuat(s.id);
      });
      viewer.addEventListener("position-updated", (e) => cb.current.onPosisi(normal(deg(e.position.yaw)), deg(e.position.pitch)));
      markers.addEventListener("select-marker", (e) => {
        const d = e.marker.data as DataMarker | undefined;
        if (!d) return;
        if (d.jenis === "tautan") cb.current.onPindah(d.ke);
        else cb.current.onHotspot(d.id);
      });

      cb.current.onKontrol({
        zoomMasuk: () => viewer.zoomIn(),
        zoomKeluar: () => viewer.zoomOut(),
        putar: (yaw, pitch) => {
          viewer.animate({ yaw: rad(yaw), pitch: pitch === undefined ? viewer.getPosition().pitch : rad(pitch), speed: 700 });
        },
        gyroDidukung: () => gyro.isSupported(),
        gyro: async () => {
          if (gyro.isEnabled()) {
            gyro.stop();
            return false;
          }
          await gyro.start(); // izin iOS diminta dari klik tombol (PRD)
          return gyro.isEnabled();
        },
      });
    }, 0);

    return () => {
      clearTimeout(t);
      viewerRef.current = null;
      aktif?.destroy();
    };
  }, []);

  // Ganti scene
  const sceneId = props.scene.id;
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || sceneId === pertama.current.id && dimuat === null) return;
    if (dimuat === sceneId) return;
    const s = cb.current.scene;
    viewer.getPlugin<MarkersPlugin>(MarkersPlugin).clearMarkers();
    let batal = false;
    viewer
      .setPanorama(s.panorama, {
        position: { yaw: rad(cb.current.yaw ?? s.yawAwal), pitch: rad(s.pitchAwal ?? 0) },
        showLoader: false,
      })
      .then((ok) => {
        if (batal || !ok) return;
        setDimuat(s.id);
        cb.current.onMuat(s.id);
      })
      .catch(() => !batal && cb.current.onGagal());
    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hanya bereaksi pada pergantian scene
  }, [sceneId]);

  // Marker untuk scene yang sudah tampil
  const { hotspotAktif, polos, namaScene, scene } = props;
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || dimuat !== scene.id) return;
    viewer.getPlugin<MarkersPlugin>(MarkersPlugin).setMarkers(buatMarker(scene, namaScene, { aktif: hotspotAktif, polos }));
  }, [dimuat, scene, namaScene, hotspotAktif, polos]);

  return <div ref={el} className={`absolute inset-0 ${polos ? "vt-polos" : ""}`} role="application" aria-label={`Panorama 360°: ${scene.nama}`} />;
}
