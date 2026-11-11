"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  List,
  Maximize,
  Minimize,
  Minus,
  MoveHorizontal,
  Navigation,
  PanelRight,
  Plane,
  Plus,
  Rotate3d,
  Share2,
  Smartphone,
  Undo2,
  X,
} from "lucide-react";
import { lacak } from "@/lib/analytics";
import { CtaPil, DaftarHotspot, KartuHotspot, LayarEtika, Minimap, PanelScene, type InfoDestinasi, type InfoPaket } from "./bagian";
import { FallbackGaleri } from "./FallbackGaleri";
import { normal } from "./marker";
import type { KontrolPanorama } from "./Panorama";
import type { Tur } from "./types";

// Kode viewer (three.js + Photo Sphere Viewer) baru diunduh di sini (PRD V4).
const Panorama = dynamic(() => import("./Panorama"), { ssr: false });

const KUNCI_ETIKA = "jb-etika-tur";
const noop = () => () => {};

function cekWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
let webglCache: boolean | null = null;
const snapWebGL = () => (webglCache ??= cekWebGL());

function useHP() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(max-width: 1023px)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia("(max-width: 1023px)").matches,
    () => false,
  );
}

const tombolBulat =
  "grid size-12 place-items-center rounded-full bg-deep/65 text-white ring-1 ring-white/15 backdrop-blur-md hover:bg-deep/85 lg:size-14";

export function TurApp({ tur, destinasi, paket }: { tur: Tur; destinasi: InfoDestinasi; paket: InfoPaket }) {
  const sp = useSearchParams();
  const sceneUrl = sp.get("scene");
  const yawUrl = sp.get("yaw");
  const awal = tur.scene.some((s) => s.id === sceneUrl) ? sceneUrl! : tur.sceneAwal;

  const [sceneId, setSceneId] = useState(awal);
  const [yawMasuk, setYawMasuk] = useState<number | undefined>(yawUrl !== null && !Number.isNaN(Number(yawUrl)) ? Number(yawUrl) : undefined);
  const [riwayat, setRiwayat] = useState<string[]>([]);
  const [hotspot, setHotspot] = useState<string | null>(null);
  const [panel, setPanel] = useState(true);
  const [sheet, setSheet] = useState(false);
  const [petaBesar, setPetaBesar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [siap, setSiap] = useState(false);
  const [posisi, setPosisi] = useState({ yaw: 0, pitch: 0 });
  const [disentuh, setDisentuh] = useState(false);
  const [gyroOn, setGyroOn] = useState(false);
  const [gyroAda, setGyroAda] = useState(false);
  const [layarPenuh, setLayarPenuh] = useState(false);
  const [toast, setToast] = useState("");
  const [menuBagi, setMenuBagi] = useState(false);
  const [gagal, setGagal] = useState(false);
  const [modeFoto, setModeFoto] = useState(sp.get("mode") === "foto");
  const [etikaTutup, setEtikaTutup] = useState(false);
  const [etikaPaksa, setEtikaPaksa] = useState(false);

  const webgl = useSyncExternalStore(noop, snapWebGL, () => true);
  const etikaDilihat = useSyncExternalStore(
    noop,
    () => {
      try {
        return sessionStorage.getItem(KUNCI_ETIKA) === "1";
      } catch {
        return false;
      }
    },
    () => true,
  );
  const hp = useHP();

  const root = useRef<HTMLDivElement>(null);
  const kontrol = useRef<KontrolPanorama | null>(null);
  const posRef = useRef({ yaw: 0, pitch: 0 });
  const raf = useRef(0);
  const yawPertama = useRef<number | null>(null);

  const scene = tur.scene.find((s) => s.id === sceneId) ?? tur.scene[0];
  const indeks = tur.scene.indexOf(scene);
  const sceneUdara = tur.scene.find((s) => s.tipe === "udara");
  const namaScene = useMemo(() => Object.fromEntries(tur.scene.map((s) => [s.id, s.nama])), [tur]);
  const hsAktif = scene.hotspot.find((h) => h.id === hotspot) ?? null;
  const hsIndex = hsAktif ? scene.hotspot.indexOf(hsAktif) : -1;
  const heading = normal(posisi.yaw - scene.utara);
  const etikaTampil = etikaPaksa || (!etikaDilihat && !etikaTutup);
  const jumlahHotspot = tur.scene.reduce((n, s) => n + s.hotspot.length, 0);
  const statistik = `${tur.scene.length} scene · ${tur.scene.filter((s) => s.tipe === "udara").length} pandangan drone · ${jumlahHotspot} info konservasi`;
  const kembaliHref = `/wisata/${destinasi.slug}`;

  // ---------- Navigasi scene ----------
  const pindah = useCallback(
    (ke: string, opsi?: { tanpaRiwayat?: boolean }) => {
      if (ke === sceneId) return;
      if (!opsi?.tanpaRiwayat) setRiwayat((r) => [...r, sceneId]);
      setYawMasuk(undefined);
      setHotspot(null);
      setSheet(false);
      setSceneId(ke);
      lacak("scene_view", { destinasi: destinasi.slug, scene: ke });
    },
    [sceneId, destinasi.slug],
  );
  const kembali = () => {
    const prev = riwayat.at(-1);
    if (!prev) return;
    setRiwayat((r) => r.slice(0, -1));
    pindah(prev, { tanpaRiwayat: true });
  };
  const bukaHotspot = useCallback(
    (id: string) => {
      setHotspot(id);
      setSheet(false);
      lacak("hotspot_open", { destinasi: destinasi.slug, hotspot: id });
      const h = scene.hotspot.find((x) => x.id === id);
      if (h) kontrol.current?.putar(h.yaw, h.pitch - (hp ? 12 : 0));
    },
    [destinasi.slug, scene, hp],
  );
  const geserHotspot = (arah: 1 | -1) => {
    const n = scene.hotspot.length;
    bukaHotspot(scene.hotspot[(hsIndex + arah + n) % n].id);
  };

  // ---------- Posisi pandang (di-throttle per frame) ----------
  const onPosisi = useCallback((yaw: number, pitch: number) => {
    posRef.current = { yaw, pitch };
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      setPosisi(posRef.current);
      if (yawPertama.current === null) yawPertama.current = posRef.current.yaw;
      else if (Math.abs(normal(posRef.current.yaw - yawPertama.current)) > 8) setDisentuh(true);
    });
  }, []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onMuat = useCallback(() => setSiap(true), []);
  const onGagal = useCallback(() => setGagal(true), []);
  const onKontrol = useCallback((k: KontrolPanorama) => {
    kontrol.current = k;
    k.gyroDidukung()
      .then(setGyroAda)
      .catch(() => setGyroAda(false));
  }, []);

  // ---------- Tautan per scene & arah pandang (V10) ----------
  useEffect(() => {
    if (!siap) return;
    const t = setTimeout(() => {
      const q = new URLSearchParams({ scene: sceneId, yaw: String(Math.round(posRef.current.yaw)) });
      window.history.replaceState(null, "", `?${q}`);
    }, 500);
    return () => clearTimeout(t);
  }, [sceneId, posisi.yaw, siap]);

  // Pramuat scene tetangga versi ringan, kecuali mode hemat data
  useEffect(() => {
    if (!siap) return;
    const hemat = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (hemat) return;
    const tetangga = [...scene.tautan.map((t) => t.ke), ...(scene.tipe === "udara" ? [tur.sceneDarat] : [])];
    for (const id of tetangga) {
      const s = tur.scene.find((x) => x.id === id);
      if (s) new window.Image().src = s.panorama;
    }
  }, [siap, scene, tur]);

  // Escape menutup kartu/sheet
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setHotspot(null);
      setSheet(false);
      setMenuBagi(false);
    };
    const onFs = () => setLayarPenuh(Boolean(document.fullscreenElement));
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const tutupEtika = () => {
    try {
      sessionStorage.setItem(KUNCI_ETIKA, "1");
    } catch {
      /* mode privat */
    }
    setEtikaTutup(true);
    setEtikaPaksa(false);
  };

  const urlScene = () =>
    `${window.location.origin}/wisata/${destinasi.slug}/virtual-tour?scene=${sceneId}&yaw=${Math.round(posRef.current.yaw)}`;
  const bagikan = async () => {
    const url = urlScene();
    if (navigator.share) {
      try {
        await navigator.share({ title: `${destinasi.nama} · ${scene.nama}`, url });
      } catch {
        /* dibatalkan */
      }
      return;
    }
    setMenuBagi((v) => !v);
  };
  const salinTautan = async () => {
    try {
      await navigator.clipboard.writeText(urlScene());
      setToast("Tautan scene disalin");
    } catch {
      setToast("Gagal menyalin tautan");
    }
    setMenuBagi(false);
  };

  const togglePenuh = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else root.current?.requestFullscreen?.().catch(() => setToast("Layar penuh tidak didukung"));
  };
  const toggleGyro = async () => {
    try {
      setGyroOn(Boolean(await kontrol.current?.gyro()));
    } catch {
      setToast("Izin sensor gerak ditolak");
    }
  };
  const ctaKlik = () => lacak("cta_paket_click", { destinasi: destinasi.slug, sumber: "tur", scene: sceneId });

  // ---------- Mode foto ----------
  if (modeFoto || gagal || !webgl) {
    return (
      <FallbackGaleri
        tur={tur}
        destinasi={destinasi}
        paket={paket}
        sceneAwal={sceneId}
        alasan={!webgl ? "webgl" : gagal ? "gagal" : "pilihan"}
        onCoba={() => {
          setGagal(false);
          setModeFoto(false);
          setSiap(false);
          setProgress(0);
        }}
        onCta={ctaKlik}
      />
    );
  }

  const udara = scene.tipe === "udara";
  const MAKS_STRIP = 8;
  const subjudul = `${udara ? "Pandangan udara" : scene.nama} · Scene ${indeks + 1} dari ${tur.scene.length} · ${destinasi.lokasi}`;

  const strip = (
    <ol className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] lg:gap-3 lg:overflow-visible" aria-label="Daftar scene">
      {tur.scene.slice(0, hp ? undefined : MAKS_STRIP).map((s, i) => {
        const aktif = s.id === sceneId;
        return (
          <li key={s.id} className="shrink-0">
            <button type="button" onClick={() => pindah(s.id)} aria-current={aktif ? "step" : undefined} className="group block text-left">
              <span
                className={`relative block h-[72px] w-[104px] overflow-hidden rounded-xl ring-2 lg:h-[88px] lg:w-[146px] ${
                  aktif ? "ring-sun-400" : "ring-white/20 group-hover:ring-white/60"
                }`}
              >
                <Image src={s.thumb} alt="" fill sizes="146px" className="object-cover" />
              </span>
              <span className={`mt-1.5 block text-[13px] lg:text-sm ${aktif ? "font-semibold text-sun-400" : "text-white/85"}`}>
                {hp ? s.namaPendek : `${i + 1} · ${s.namaPendek}`}
              </span>
            </button>
          </li>
        );
      })}
      {!hp && tur.scene.length > MAKS_STRIP && (
        <li className="shrink-0">
          <button type="button" onClick={() => setSheet(true)} className="grid h-[88px] w-[88px] place-items-center rounded-xl bg-deep/70 ring-2 ring-white/20">
            <span className="text-center">
              <span className="block text-xl font-semibold">+{tur.scene.length - MAKS_STRIP}</span>
              <span className="text-xs text-white/70">scene</span>
            </span>
          </button>
        </li>
      )}
    </ol>
  );

  // HP: tombol ikon saja supaya muat satu baris bersama tombol paket
  const pilGelap = "flex min-h-12 items-center gap-2 rounded-full bg-deep/65 text-[16px] font-medium ring-1 ring-white/15 backdrop-blur-md hover:bg-deep/85";
  const kembaliUdara = (
    <div className="pointer-events-auto flex gap-2.5">
      <button
        type="button"
        onClick={kembali}
        disabled={!riwayat.length}
        aria-label="Kembali ke scene sebelumnya"
        className={`${pilGelap} ${hp ? "w-12 justify-center" : "px-5"} disabled:opacity-50`}
      >
        <Undo2 className="size-5" /> {!hp && "Kembali"}
      </button>
      {sceneUdara && (
        <button type="button" onClick={() => pindah(sceneUdara.id)} aria-label="Lihat dari udara" className={`${pilGelap} ${hp ? "w-12 justify-center" : "px-5"}`}>
          <Plane className="size-5" /> {!hp && "Lihat dari udara"}
        </button>
      )}
    </div>
  );

  const kartuUdara = (
    <div className="pointer-events-auto lg:w-[560px] lg:rounded-3xl lg:bg-deep/75 lg:p-7 lg:ring-1 lg:ring-white/10 lg:backdrop-blur-md lg:[@media(max-height:760px)]:p-5">
      <p className="hidden text-xs font-semibold tracking-[0.16em] text-sun-400 uppercase lg:block">Pandangan udara</p>
      <h2 className="text-[28px] font-semibold leading-tight lg:mt-2 lg:text-[34px] lg:[@media(max-height:760px)]:text-[26px]">Lihat dari atas dulu</h2>
      <p className="mt-2 text-[16px] leading-relaxed text-white/80 lg:mt-3 lg:text-[17px]">{scene.deskripsi}</p>
      <div className="mt-5 flex gap-3 lg:[@media(max-height:760px)]:mt-4">
        <button
          type="button"
          onClick={() => pindah(tur.sceneDarat)}
          className="flex min-h-14 flex-1 items-center justify-center gap-2.5 rounded-2xl bg-sun-400 text-lg font-semibold text-ink hover:brightness-95"
        >
          <Download className="size-5" /> Turun ke lokasi
        </button>
        {hp ? (
          gyroAda && (
            <button type="button" onClick={toggleGyro} aria-pressed={gyroOn} aria-label="Mode giroskop" className="grid size-14 place-items-center rounded-2xl ring-1 ring-white/30">
              <Smartphone className={`size-6 ${gyroOn ? "text-sun-400" : ""}`} />
            </button>
          )
        ) : (
          <button type="button" onClick={() => setSheet(true)} className="min-h-14 rounded-2xl px-6 text-lg font-medium ring-1 ring-white/30 hover:bg-white/10">
            Pilih scene
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div ref={root} className="fixed inset-0 overflow-hidden bg-deep text-white">
      <Panorama
        scene={scene}
        yaw={yawMasuk}
        namaScene={namaScene}
        hotspotAktif={hotspot}
        polos={hp}
        onPindah={pindah}
        onHotspot={bukaHotspot}
        onPosisi={onPosisi}
        onProgress={setProgress}
        onMuat={onMuat}
        onGagal={onGagal}
        onKontrol={onKontrol}
      />

      {/* Gradasi agar teks overlay terbaca */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-deep/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-deep/85 via-deep/40 to-transparent" />

      {!siap && (
        <p className="absolute left-4 top-4 z-40 flex items-center gap-2.5 rounded-full bg-deep/75 px-4 py-2.5 text-[15px] ring-1 ring-white/15 backdrop-blur lg:left-8 lg:top-6" role="status">
          <span className="size-4 animate-spin rounded-full border-2 border-sun-400 border-t-transparent" />
          Menyiapkan panorama… {Math.round(progress)}%
        </p>
      )}

      {/* ===== Atas ===== */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 lg:p-8">
        {/* HP */}
        <Link href={kembaliHref} aria-label="Tutup tur, kembali ke artikel" className={`pointer-events-auto lg:hidden ${tombolBulat}`}>
          <X className="size-6" />
        </Link>
        <div className="pointer-events-none flex-1 pt-1 text-center lg:hidden">
          <h1 className="text-xl font-semibold leading-tight drop-shadow">{udara ? destinasi.nama : scene.nama}</h1>
          <p className="mt-0.5 text-[15px] text-white/80">
            {udara ? `Pandangan udara · ${indeks + 1}/${tur.scene.length}` : `Scene ${indeks + 1}/${tur.scene.length}`}
          </p>
        </div>
        {/* Desktop */}
        <div className="hidden min-w-0 items-start gap-6 lg:flex">
          <Link
            href={kembaliHref}
            className="pointer-events-auto flex min-h-14 shrink-0 items-center gap-2.5 rounded-full bg-deep/65 px-6 text-[17px] font-medium ring-1 ring-white/15 backdrop-blur-md hover:bg-deep/85"
          >
            <ArrowLeft className="size-5" /> Kembali ke artikel
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-[28px] font-semibold leading-tight drop-shadow">{destinasi.nama}</h1>
            <p className="mt-1 truncate text-[16px] text-white/80 drop-shadow">{subjudul}</p>
          </div>
        </div>

        <div className="pointer-events-auto flex shrink-0 flex-col items-end gap-3 lg:flex-row lg:items-center">
          {!hp && <CtaPil paket={paket} onKlik={ctaKlik} />}
          <span className="hidden items-center gap-1.5 rounded-full bg-sun-400 px-4 py-2 text-[15px] font-semibold text-ink 2xl:flex">
            <Rotate3d className="size-4.5" /> Tur 360°
          </span>
          <div className="relative">
            <button type="button" onClick={bagikan} aria-label="Bagikan scene" className={`${tombolBulat} 2xl:flex 2xl:w-auto 2xl:gap-2.5 2xl:px-6 2xl:text-[17px] 2xl:font-medium`}>
              <Share2 className="size-5" /> <span className="hidden 2xl:inline">Bagikan scene</span>
            </button>
            {menuBagi && (
              <div className="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-2xl bg-white text-ink shadow-2xl">
                <button type="button" onClick={salinTautan} className="block w-full px-4 py-3 text-left text-[15px] hover:bg-surface">
                  Salin tautan scene
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const teks = `${destinasi.nama} · ${scene.nama} (Tur 360°): ${urlScene()}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(teks)}`, "_blank", "noopener,noreferrer");
                    setMenuBagi(false);
                  }}
                  className="block w-full px-4 py-3 text-left text-[15px] hover:bg-surface"
                >
                  Kirim ke WhatsApp
                </button>
              </div>
            )}
          </div>
          {!(hp && udara) && (
            <button type="button" onClick={togglePenuh} aria-label={layarPenuh ? "Keluar layar penuh" : "Layar penuh"} className={tombolBulat}>
              {layarPenuh ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
            </button>
          )}
          {hp && udara && (
            <button type="button" onClick={() => kontrol.current?.putar(scene.utara)} aria-label="Hadap utara" className={tombolBulat}>
              <span className="flex flex-col items-center leading-none">
                <Navigation className="size-5 text-sun-400" style={{ transform: `rotate(${-heading}deg)` }} />
                <span className="mt-0.5 text-[11px] font-semibold">U</span>
              </span>
            </button>
          )}
          {hp && !udara && gyroAda && (
            <button type="button" onClick={toggleGyro} aria-pressed={gyroOn} aria-label="Mode giroskop: gerakkan HP untuk melihat sekeliling" className={tombolBulat}>
              <Smartphone className={`size-5 ${gyroOn ? "text-sun-400" : ""}`} />
            </button>
          )}
          {hp && !udara && (
            <button type="button" onClick={() => setSheet(true)} aria-label="Daftar scene & info konservasi" className={tombolBulat}>
              <List className="size-5" />
            </button>
          )}
          {!hp && (
            <button type="button" onClick={() => setPanel((v) => !v)} aria-pressed={panel} aria-label="Tampilkan panel info" className={tombolBulat}>
              <PanelRight className="size-5" />
            </button>
          )}
        </div>
      </div>

      {/* ===== Kiri: minimap + zoom ===== */}
      {hp ? (
        !udara && (
          <div className="absolute left-4 top-[84px] z-10 w-[120px] overflow-hidden rounded-2xl ring-2 ring-white/40 sm:w-[160px]">
            <Minimap tur={tur} scene={scene} heading={heading} besar={false} ringkas onPilih={pindah} />
          </div>
        )
      ) : (
        <div className={`absolute left-8 top-[124px] z-10 flex flex-col gap-4 ${udara ? "[@media(max-height:900px)]:hidden" : "[@media(max-height:700px)]:hidden"}`}>
          <Minimap tur={tur} scene={scene} heading={heading} besar={petaBesar} onBesar={() => setPetaBesar((v) => !v)} onPilih={pindah} />
          <div className="flex w-14 flex-col items-center rounded-full bg-deep/65 py-2 ring-1 ring-white/15 backdrop-blur-md">
            <button type="button" onClick={() => kontrol.current?.zoomMasuk()} aria-label="Perbesar" className="grid size-12 place-items-center rounded-full hover:bg-white/10">
              <Plus className="size-5" />
            </button>
            <button type="button" onClick={() => kontrol.current?.zoomKeluar()} aria-label="Perkecil" className="grid size-12 place-items-center rounded-full hover:bg-white/10">
              <Minus className="size-5" />
            </button>
            <span className="my-1 h-px w-8 bg-white/20" />
            <button type="button" onClick={() => kontrol.current?.putar(scene.utara)} aria-label="Hadap utara" className="grid size-12 place-items-center rounded-full hover:bg-white/10">
              <span className="flex flex-col items-center leading-none">
                <Navigation className="size-5" style={{ transform: `rotate(${-heading}deg)` }} />
                <span className="mt-1 text-[11px] font-semibold">U</span>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Petunjuk geser */}
      {siap && !disentuh && (!hp || udara) && (
        <p className="pointer-events-none absolute left-1/2 top-[24%] z-10 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full bg-deep/70 px-5 py-2.5 text-[16px] ring-1 ring-white/10 backdrop-blur lg:top-[108px]">
          <MoveHorizontal className="size-5" />
          {hp ? "Geser untuk melihat" : "Seret atau pakai ← → untuk melihat sekeliling"}
        </p>
      )}

      {/* ===== Kanan (desktop): panel scene / kartu hotspot ===== */}
      {!hp && (hsAktif || (panel && !udara)) && (
        <div className="absolute right-8 top-[124px] z-20 max-h-[calc(100dvh-124px-230px)] w-[440px] overflow-y-auto rounded-3xl">
          {hsAktif ? (
            <KartuHotspot
              h={hsAktif}
              urutan={hsIndex + 1}
              total={scene.hotspot.length}
              onSebelumnya={() => geserHotspot(-1)}
              onBerikutnya={() => geserHotspot(1)}
              onTutup={() => setHotspot(null)}
            />
          ) : (
            <PanelScene scene={scene} onHotspot={bukaHotspot} onEtika={() => setEtikaPaksa(true)} onTutup={() => setPanel(false)} />
          )}
        </div>
      )}

      {/* ===== Bawah ===== */}
      {hp ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 space-y-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {udara ? (
            kartuUdara
          ) : (
            <>
              <div className="flex items-center justify-between gap-2.5">
                {kembaliUdara}
                <CtaPil paket={paket} onKlik={ctaKlik} className="pointer-events-auto" />
              </div>
              <div className="pointer-events-auto -mx-4 px-4">{strip}</div>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="pointer-events-none absolute bottom-8 left-8 right-8 z-20 flex flex-col items-start gap-6">
            {udara ? kartuUdara : kembaliUdara}
            {!udara && disentuh && (
              <p className="pointer-events-none -mb-2 flex items-center gap-2 self-end text-sm text-white/70">
                <kbd className="rounded-md border border-white/30 px-1.5">←</kbd>
                <kbd className="rounded-md border border-white/30 px-1.5">→</kbd> menoleh · seret untuk melihat sekeliling
              </p>
            )}
            <div className="pointer-events-auto max-w-full">{strip}</div>
          </div>
        </>
      )}

      {/* ===== Sheet HP: kartu hotspot ===== */}
      {hp && hsAktif && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-deep/30" onClick={() => setHotspot(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <KartuHotspot
              h={hsAktif}
              urutan={hsIndex + 1}
              total={scene.hotspot.length}
              onSebelumnya={() => geserHotspot(-1)}
              onBerikutnya={() => geserHotspot(1)}
              onTutup={() => setHotspot(null)}
              sheet
            />
          </div>
        </div>
      )}

      {/* ===== Daftar scene + info (HP: sheet, desktop: "Pilih scene"/"+N") ===== */}
      {sheet && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-deep/40 lg:items-center lg:justify-center" onClick={() => setSheet(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Daftar scene"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[82vh] w-full overflow-y-auto rounded-t-[28px] bg-deep p-5 ring-1 ring-white/10 lg:max-w-3xl lg:rounded-[28px] lg:p-7"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-sun-400 uppercase">Di scene ini</p>
                <h2 className="mt-1 text-2xl font-semibold">{scene.nama}</h2>
              </div>
              <button type="button" onClick={() => setSheet(false)} aria-label="Tutup" className="grid size-11 place-items-center rounded-full bg-white/10">
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-white/75">{scene.deskripsi}</p>
            {scene.hotspot.length > 0 && (
              <div className="mt-4">
                <DaftarHotspot hotspot={scene.hotspot} onPilih={bukaHotspot} />
              </div>
            )}
            <h3 className="mt-6 text-lg font-semibold">Semua scene</h3>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {tur.scene.map((s, i) => (
                <li key={s.id}>
                  <button type="button" onClick={() => pindah(s.id)} className="block w-full text-left">
                    <span className={`relative block aspect-[16/10] overflow-hidden rounded-xl ring-2 ${s.id === sceneId ? "ring-sun-400" : "ring-white/10"}`}>
                      <Image src={s.thumb} alt="" fill sizes="240px" className="object-cover" />
                    </span>
                    <span className="mt-1.5 block text-sm">
                      {i + 1} · {s.nama}
                    </span>
                    <span className="block text-xs text-white/60">{s.hotspot.length ? `${s.hotspot.length} info konservasi` : s.tipe === "udara" ? "Drone" : "—"}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => { setSheet(false); setEtikaPaksa(true); }} className="min-h-12 rounded-2xl px-4 text-[15px] font-medium text-sun-400 ring-1 ring-sun-400/50">
                Lihat lagi etika berkunjung
              </button>
              <button type="button" onClick={() => setModeFoto(true)} className="min-h-12 rounded-2xl px-4 text-[15px] font-medium ring-1 ring-white/25">
                Mode foto (hemat kuota)
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <p role="status" className="absolute bottom-40 left-1/2 z-40 -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-[15px] font-medium text-ink shadow-xl">
          {toast}
        </p>
      )}

      {etikaTampil && (
        <LayarEtika tur={tur} destinasi={destinasi} statistik={statistik} onMulai={tutupEtika} onLewati={tutupEtika} kembaliHref={kembaliHref} />
      )}

      {/* Daftar teks untuk pembaca layar (K4) */}
      <div className="sr-only">
        <h2>Info konservasi di tur ini</h2>
        <ul>
          {tur.scene.flatMap((s) =>
            s.hotspot.map((h) => (
              <li key={h.id}>
                {s.nama}: {h.judul}. {h.isi}
              </li>
            )),
          )}
        </ul>
        <Link href={paket.href}>
          Lihat paket di lokasi ini <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
