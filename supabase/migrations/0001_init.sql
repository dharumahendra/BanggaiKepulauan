-- Skema awal Portal Wisata & UMKM Banggai Kepulauan (lihat "Model data inti" di PRD).
-- Jalankan di Supabase SQL editor atau `supabase db push`.

create extension if not exists postgis;

-- ---------- Wilayah ----------
create table kecamatan (
  id uuid primary key default gen_random_uuid(),
  kode_kemendagri text unique not null,          -- mis. 72.07.18
  nama text not null,
  slug text unique not null,
  ibu_kota text not null,
  deskripsi text,
  cara_menuju text,
  kontak text,
  foto_sampul text,
  geom geometry(MultiPolygon, 4326)
);

create table desa (
  id uuid primary key default gen_random_uuid(),
  kecamatan_id uuid not null references kecamatan(id),
  kode_kemendagri text unique,
  nama text not null,
  slug text unique not null,
  tipe text not null check (tipe in ('desa', 'kelurahan')),
  desa_wisata boolean not null default false,
  fokus_kkn boolean not null default false,
  deskripsi text,
  pengelola_nama text,
  operator_nama text,
  kontak_wa text[] not null default '{}',        -- minimal 2 nomor (mitigasi risiko PRD)
  foto text,
  geom geometry(MultiPolygon, 4326),
  titik_pusat geometry(Point, 4326)
);

create table statistik (
  id uuid primary key default gen_random_uuid(),
  kecamatan_id uuid references kecamatan(id),
  desa_id uuid references desa(id),
  indikator text not null,                        -- penduduk, luas_km2, jumlah_pulau, ...
  tahun int not null,
  nilai numeric not null,
  satuan text,
  sumber text not null,
  check (kecamatan_id is not null or desa_id is not null)
);

create table layer_peta (
  id uuid primary key default gen_random_uuid(),
  kecamatan_id uuid references kecamatan(id),     -- null = tingkat kabupaten
  nama text not null,
  tipe text not null check (tipe in ('poligon', 'garis', 'titik')),
  geojson_url text not null,
  style jsonb,
  urutan int not null default 0,
  aktif_default boolean not null default true
);

-- ---------- Wisata ----------
create table atraksi (
  id uuid primary key default gen_random_uuid(),
  desa_id uuid not null references desa(id),
  nama text not null,
  slug text unique not null,
  kategori text not null check (kategori in ('alam', 'budaya', 'bahari')),
  deskripsi text,
  foto text[] not null default '{}',
  lokasi geometry(Point, 4326)
);

create table paket (
  id uuid primary key default gen_random_uuid(),
  penyelenggara_tipe text not null check (penyelenggara_tipe in ('desa', 'kecamatan', 'kabupaten')),
  penyelenggara_id uuid not null,
  nama text not null,
  slug text unique not null,
  kategori text not null check (kategori in ('alam', 'budaya', 'bahari')),
  durasi_hari int not null,
  durasi_label text not null,
  ringkasan text,
  itinerary jsonb not null default '[]',
  termasuk text[] not null default '{}',
  tidak_termasuk text[] not null default '{}',
  tipe_harga text not null default 'orang' check (tipe_harga in ('orang', 'grup')),
  harga int not null,
  min_peserta int not null,
  max_peserta int not null,
  titik_kumpul text,
  cover text,
  galeri text[] not null default '{}',
  status text not null default 'draf' check (status in ('draf', 'menunggu_persetujuan', 'tayang')),
  created_at timestamptz not null default now()
);

create table paket_singgah (
  id uuid primary key default gen_random_uuid(),
  paket_id uuid not null references paket(id) on delete cascade,
  desa_id uuid not null references desa(id),
  hari_ke int not null,
  urutan int not null,
  komponen text[] not null default '{}',
  harga_komponen int not null default 0,
  status_persetujuan text not null default 'menunggu' check (status_persetujuan in ('menunggu', 'setuju', 'tolak'))
);

create table add_on (
  id uuid primary key default gen_random_uuid(),
  paket_id uuid references paket(id) on delete cascade, -- null = global
  nama text not null,
  harga int not null,
  satuan text not null check (satuan in ('orang', 'hari', 'malam', 'unit'))
);

create table homestay (
  id uuid primary key default gen_random_uuid(),
  desa_id uuid not null references desa(id),
  nama text not null,
  harga_per_malam int not null default 0,
  kapasitas int,
  fasilitas text[] not null default '{}',
  lokasi geometry(Point, 4326)
);

create table blokir_tanggal (
  id uuid primary key default gen_random_uuid(),
  paket_id uuid references paket(id) on delete cascade, -- null = semua paket di desa
  desa_id uuid references desa(id),
  tanggal date not null,
  alasan text not null                               -- cuaca, perahu penuh, acara adat
);

create table reservasi (
  id uuid primary key default gen_random_uuid(),
  kode text unique not null,
  paket_id uuid not null references paket(id),
  nama text not null,
  no_wa text not null,
  email text,
  tanggal date not null,
  jumlah_peserta int not null,
  jumlah_anak int not null default 0,
  addon jsonb not null default '[]',                 -- harga disalin saat transaksi
  homestay_id uuid references homestay(id),
  rincian jsonb not null default '[]',
  total_estimasi int not null,
  status text not null default 'menunggu'
    check (status in ('menunggu', 'dikonfirmasi', 'dp_diterima', 'selesai', 'dibatalkan')),
  dp_nominal int,
  dp_metode text,
  bukti_bayar_url text,
  catatan text,
  created_at timestamptz not null default now()
);

create table reservasi_riwayat (
  id bigserial primary key,
  reservasi_id uuid not null references reservasi(id) on delete cascade,
  status text not null,
  waktu timestamptz not null default now(),
  oleh uuid
);

create table alokasi_reservasi (
  id uuid primary key default gen_random_uuid(),
  reservasi_id uuid not null references reservasi(id) on delete cascade,
  paket_singgah_id uuid not null references paket_singgah(id),
  desa_id uuid not null references desa(id),
  tanggal date not null,
  jumlah_peserta int not null,
  nominal_bagian int not null default 0,
  status text not null default 'menunggu' check (status in ('menunggu', 'siap', 'tidak_bisa')),
  catatan text
);

-- ---------- UMKM ----------
create table umkm (
  id uuid primary key default gen_random_uuid(),
  desa_id uuid not null references desa(id),
  nama_usaha text not null,
  slug text unique not null,
  nama_pemilik text,
  no_wa text,
  cerita text,
  foto text,
  lokasi geometry(Point, 4326)
);

create table produk (
  id uuid primary key default gen_random_uuid(),
  umkm_id uuid not null references umkm(id),
  nama text not null,
  slug text unique not null,
  kategori text not null check (kategori in ('olahan-ikan', 'kuliner', 'kerajinan', 'hasil-kebun')),
  harga int not null,
  satuan text not null,
  stok int,
  tipe text not null check (tipe in ('ready', 'preorder')),
  lead_time_hari int,
  foto text[] not null default '{}',
  aktif boolean not null default true
);

create table pesanan (
  id uuid primary key default gen_random_uuid(),
  kode text unique not null,
  desa_id uuid not null references desa(id),        -- satu pesanan per desa
  nama text not null,
  no_wa text not null,
  item jsonb not null,                               -- [{produk_id, qty, harga}]
  metode text not null check (metode in ('ambil', 'kirim')),
  reservasi_id uuid references reservasi(id),
  alamat text,
  ongkir int,
  total int not null,
  status text not null default 'menunggu'
    check (status in ('menunggu', 'dikonfirmasi', 'siap', 'selesai', 'dibatalkan')),
  created_at timestamptz not null default now()
);

-- ---------- Pengguna & akses ----------
create table pengguna (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null,
  peran text not null check (peran in ('admin_kabupaten', 'admin_kecamatan', 'operator_desa')),
  kecamatan_id uuid references kecamatan(id),
  desa_id uuid references desa(id)
);

create table log_aktivitas (
  id bigserial primary key,
  pengguna_id uuid references pengguna(id),
  aksi text not null,
  entitas text not null,
  entitas_id uuid,
  waktu timestamptz not null default now()
);

-- ---------- Row Level Security ----------
-- Publik hanya membaca konten tayang. Data transaksi tidak bisa dibaca publik;
-- form reservasi/pesanan & cek status lewat API route (service role) dengan kode + no WA.
alter table kecamatan enable row level security;
alter table desa enable row level security;
alter table statistik enable row level security;
alter table layer_peta enable row level security;
alter table atraksi enable row level security;
alter table paket enable row level security;
alter table paket_singgah enable row level security;
alter table add_on enable row level security;
alter table homestay enable row level security;
alter table blokir_tanggal enable row level security;
alter table umkm enable row level security;
alter table produk enable row level security;
alter table reservasi enable row level security;
alter table reservasi_riwayat enable row level security;
alter table alokasi_reservasi enable row level security;
alter table pesanan enable row level security;
alter table pengguna enable row level security;
alter table log_aktivitas enable row level security;

create policy "publik baca" on kecamatan for select using (true);
create policy "publik baca" on desa for select using (true);
create policy "publik baca" on statistik for select using (true);
create policy "publik baca" on layer_peta for select using (true);
create policy "publik baca" on atraksi for select using (true);
create policy "publik baca tayang" on paket for select using (status = 'tayang');
create policy "publik baca" on paket_singgah for select using (true);
create policy "publik baca" on add_on for select using (true);
create policy "publik baca" on homestay for select using (true);
create policy "publik baca" on blokir_tanggal for select using (true);
create policy "publik baca" on umkm for select using (true);
create policy "publik baca aktif" on produk for select using (aktif);

-- Helper: apakah pengguna login berwenang atas desa tertentu (berjenjang kabupaten > kecamatan > desa).
create or replace function berwenang_desa(target_desa uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from pengguna p
    join desa d on d.id = target_desa
    where p.id = auth.uid()
      and (
        p.peran = 'admin_kabupaten'
        or (p.peran = 'admin_kecamatan' and p.kecamatan_id = d.kecamatan_id)
        or (p.peran = 'operator_desa' and p.desa_id = d.id)
      )
  );
$$;

create policy "pengelola kelola" on atraksi for all using (berwenang_desa(desa_id)) with check (berwenang_desa(desa_id));
create policy "pengelola kelola" on homestay for all using (berwenang_desa(desa_id)) with check (berwenang_desa(desa_id));
create policy "pengelola kelola" on umkm for all using (berwenang_desa(desa_id)) with check (berwenang_desa(desa_id));
create policy "pengelola kelola" on produk for all
  using (berwenang_desa((select desa_id from umkm where umkm.id = umkm_id)))
  with check (berwenang_desa((select desa_id from umkm where umkm.id = umkm_id)));
create policy "pengelola kelola" on pesanan for all using (berwenang_desa(desa_id)) with check (berwenang_desa(desa_id));
create policy "pengelola alokasi" on alokasi_reservasi for all using (berwenang_desa(desa_id)) with check (berwenang_desa(desa_id));
create policy "diri sendiri" on pengguna for select using (id = auth.uid());

create index on desa (kecamatan_id);
create index on atraksi (desa_id);
create index on paket_singgah (paket_id);
create index on paket_singgah (desa_id);
create index on reservasi (paket_id, tanggal);
create index on pesanan (desa_id, status);
create index on desa using gist (geom);
create index on kecamatan using gist (geom);
