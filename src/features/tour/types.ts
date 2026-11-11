// Model data Virtual Tour (lihat PRD: Tur, Scene, TautanScene, Hotspot, AturanBerkunjung).
// Semua sudut dalam DERAJAT; yaw 0 = tengah panorama, pitch positif = ke atas.

export type TipeHotspot = "info" | "aturan" | "spesies" | "zona";

export type Hotspot = {
  id: string;
  tipe: TipeHotspot;
  yaw: number;
  pitch: number;
  judul: string;
  subjudul?: string; // mis. "Endemik telaga air payau Pulau Peleng"
  isi: string; // 2–3 kalimat
  tips?: string;
  foto?: string;
  sumber?: string;
  validasi?: { oleh: string; tanggal: string };
};

export type Zona = {
  id: string;
  jenis: "boleh" | "dilindungi";
  label: string;
  labelPendek?: string;
  poligon: [number, number][]; // [yaw, pitch]
  labelPos: { yaw: number; pitch: number };
};

export type TautanScene = { ke: string; yaw: number; pitch: number };

export type Scene = {
  id: string;
  nama: string; // "Tepi barat telaga"
  namaPendek: string; // "Tepi barat" untuk strip thumbnail
  tipe: "udara" | "darat";
  panorama: string; // equirectangular 2:1, versi ringan (±4096 px)
  thumb: string;
  deskripsi: string;
  yawAwal: number;
  pitchAwal?: number;
  utara: number; // yaw tempat arah utara berada (untuk kompas & minimap)
  peta?: { x: number; y: number }; // posisi di minimap, persen
  tautan: TautanScene[];
  hotspot: Hotspot[];
  zona?: Zona[];
};

export type AturanBerkunjung = {
  ikon: "tangan" | "tetes" | "sampah" | "pemandu" | "kamera";
  judul: string;
  teks: string;
};

export type Tur = {
  atraksi: string; // slug destinasi
  status: "draf" | "ditinjau" | "tayang";
  judulPreview: string; // "Jalan-jalan virtual di tepi telaga"
  sorotan: string; // kalimat di layar etika
  ukuranPreviewKB: number;
  sceneAwal: string;
  sceneDarat: string; // tujuan tombol "Turun ke lokasi"
  peta: string; // gambar minimap (foto udara)
  disusunBersama: string;
  aturan: AturanBerkunjung[];
  scene: Scene[];
};
