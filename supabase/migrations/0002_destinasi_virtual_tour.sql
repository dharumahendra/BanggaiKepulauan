-- PRD Jelajah Banggai: artikel destinasi + Virtual Tour 360°.
-- Field tambahan di `atraksi` dan `paket_singgah`, lalu tabel tur, scene, tautan, hotspot, aturan.

create extension if not exists pgcrypto; -- gen_random_bytes untuk preview_token

-- ---------- Destinasi (atraksi) ----------
alter table atraksi
  add column ringkasan text,
  add column artikel jsonb not null default '[]',        -- [{judul, paragraf[]}]
  add column foto_sampul text,
  add column cara_menuju text,
  add column waktu_terbaik text,
  add column tiket text,
  add column fasilitas text[] not null default '{}',
  add column unggulan boolean not null default false,
  add column status_artikel text not null default 'draf' check (status_artikel in ('draf', 'ditinjau', 'tayang'));

drop policy if exists "publik baca" on atraksi;
-- Kartu minimal (foto + ringkasan) boleh tayang sebelum artikel lengkap (mitigasi risiko PRD).
create policy "publik baca" on atraksi for select using (true);

alter table paket_singgah add column atraksi_id uuid[] not null default '{}';

-- ---------- Virtual Tour ----------
create table tur (
  id uuid primary key default gen_random_uuid(),
  atraksi_id uuid not null unique references atraksi(id) on delete cascade,
  scene_awal_id uuid,
  status text not null default 'draf' check (status in ('draf', 'ditinjau', 'tayang')),
  validator_mitra text,
  divalidasi_pada date,
  preview_token text unique default encode(gen_random_bytes(16), 'hex')
);

create table scene (
  id uuid primary key default gen_random_uuid(),
  tur_id uuid not null references tur(id) on delete cascade,
  nama text not null,
  nama_pendek text,
  urutan int not null,
  tipe text not null check (tipe in ('darat', 'udara')),
  tiles_url text,                -- tiles resolusi tinggi (Cloudflare R2)
  preview_url text not null,     -- panorama ringan ±2048–4096 px
  foto_datar_url text,           -- untuk strip & mode foto
  deskripsi text,
  yaw_awal real not null default 0,
  pitch_awal real not null default 0,
  koreksi_utara real not null default 0,
  lokasi geometry(Point, 4326),
  diambil_pada date
);

alter table tur add constraint tur_scene_awal_fk foreign key (scene_awal_id) references scene(id) on delete set null;

create table tautan_scene (
  id uuid primary key default gen_random_uuid(),
  dari_scene_id uuid not null references scene(id) on delete cascade,
  ke_scene_id uuid not null references scene(id) on delete cascade,
  yaw real not null,
  pitch real not null,
  unique (dari_scene_id, ke_scene_id)
);

create table hotspot (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references scene(id) on delete cascade,
  tipe text not null check (tipe in ('info', 'aturan', 'spesies', 'zona')),
  yaw real not null,
  pitch real not null,
  judul text not null,
  subjudul text,
  isi text not null,
  tips text,
  foto_url text,
  sumber text,
  poligon jsonb                   -- [[yaw, pitch], ...] untuk zona di scene udara
);

create table aturan_berkunjung (
  id uuid primary key default gen_random_uuid(),
  tur_id uuid references tur(id) on delete cascade, -- null = berlaku untuk semua tur
  urutan int not null default 0,
  ikon text not null,
  judul text not null,
  teks text not null
);

alter table tur enable row level security;
alter table scene enable row level security;
alter table tautan_scene enable row level security;
alter table hotspot enable row level security;
alter table aturan_berkunjung enable row level security;

-- Publik hanya melihat tur Tayang. Pratinjau mitra (status ditinjau) lewat API route + preview_token.
create policy "publik baca tayang" on tur for select using (status = 'tayang');
create policy "publik baca" on scene for select using (exists (select 1 from tur t where t.id = tur_id and t.status = 'tayang'));
create policy "publik baca" on tautan_scene for select using (true);
create policy "publik baca" on hotspot for select using (true);
create policy "publik baca" on aturan_berkunjung for select using (true);

create or replace function desa_tur(t uuid) returns uuid language sql stable as $$
  select a.desa_id from tur join atraksi a on a.id = tur.atraksi_id where tur.id = t;
$$;

create policy "pengelola kelola" on tur for all
  using (berwenang_desa((select desa_id from atraksi where atraksi.id = atraksi_id)))
  with check (berwenang_desa((select desa_id from atraksi where atraksi.id = atraksi_id)));
create policy "pengelola kelola" on scene for all using (berwenang_desa(desa_tur(tur_id))) with check (berwenang_desa(desa_tur(tur_id)));
create policy "pengelola kelola" on hotspot for all
  using (berwenang_desa(desa_tur((select tur_id from scene where scene.id = scene_id))))
  with check (berwenang_desa(desa_tur((select tur_id from scene where scene.id = scene_id))));

create index on scene (tur_id, urutan);
create index on hotspot (scene_id);
create index on tautan_scene (dari_scene_id);
