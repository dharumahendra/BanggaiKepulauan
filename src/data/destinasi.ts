import type { Atraksi } from "@/lib/types";

// DATA CONTOH. Isi artikel, harga retribusi, dan waktu tempuh di bawah bersifat
// ilustratif dan WAJIB diganti hasil survei KKN, lalu ditinjau admin kecamatan
// sebelum tayang (status artikel: draf → ditinjau → tayang).

export const ATRAKSI: Atraksi[] = [
  {
    slug: "telaga-paisu-pok",
    nama: "Telaga Paisu Pok",
    desa: "bulagi-satu",
    kategori: "alam",
    tag: ["Telaga"],
    unggulan: true,
    statusArtikel: "tayang",
    ringkasan:
      "Telaga air payau berwarna toska di tengah hutan Peleng, rumah bagi ikan dan udang endemik. Lihat dulu jalurnya dari HP sebelum kamu menyewa perahu.",
    foto: "/images/telaga-paisu-pok.webp",
    galeri: ["/images/tur-dermaga.webp", "/images/telaga-paisu-pok.webp", "/images/pkt-danau.webp", "/images/pkt-telaga-pohon.webp"],
    artikel: [
      {
        judul: "Tentang telaga",
        paragraf: [
          "Paisu Pok berarti \"air yang biru\" dalam bahasa setempat. Telaga ini tersembunyi di balik hutan dan tebing kapur, dan airnya terhubung ke laut lewat celah batu, sehingga rasanya sedikit asin.",
          "Warga menjaga beberapa pantangan turun-temurun di sekitar telaga, termasuk larangan mandi di zona mata air. Karena itu airnya tetap jernih sampai sekarang.",
        ],
      },
      {
        judul: "Apa yang bisa dilakukan",
        paragraf: [
          "Berjalan di dermaga kayu ke tepi barat, mengamati udang merah dan ikan kecil dari atas air, lalu berfoto saat air paling jernih di pagi hari. Pemandu desa juga bisa menceritakan asal-usul nama telaga.",
        ],
      },
    ],
    aktivitas: ["Susur tepi telaga lewat dermaga kayu", "Mengamati udang merah dan ikan endemik", "Mendengar cerita asal-usul dari pemandu desa"],
    tips: [
      "Datang pukul 07.00–09.00, sebelum angin naik dan air beriak.",
      "Pakai sandal gunung; jalan setapak licin setelah hujan.",
      "Bawa uang tunai untuk retribusi dan sewa perahu.",
    ],
    etika: ["Jangan berenang di zona mata air", "Tanpa sabun dan tabir surya kimia", "Bawa pulang sampahmu"],
    info: {
      akses: "Perahu 40 mnt",
      caraMenuju:
        "Dari Salakan, jalan darat ke Bulagi ±3 jam. Dari dermaga desa, perahu ±40 menit lalu jalan kaki ±15 menit ke tepi telaga.",
      titikJemput: "Dermaga desa Bulagi Satu",
      estimasiWaktu: "Setengah hari",
      waktuTerbaik: "Pagi",
      waktuTerbaikDetail: "Pukul 07.00–09.00, musim kemarau (Agustus–November)",
      tiket: "Rp10.000",
      fasilitas: ["Dermaga kayu", "Pondok jaga", "Toilet sederhana di desa", "Parkir perahu"],
    },
  },
  {
    slug: "padang-lamun-capungan",
    nama: "Padang lamun capungan",
    desa: "lumbi-lumbia",
    kategori: "bahari",
    tag: ["Snorkeling"],
    unggulan: true,
    statusArtikel: "tayang",
    ringkasan: "Perairan dangkal tempat kawanan capungan Banggai berlindung di antara bulu babi dan lamun.",
    foto: "/images/capungan.webp",
    galeri: ["/images/capungan.webp", "/images/pkt-terumbu.webp", "/images/snorkel-setengah.webp"],
    artikel: [
      {
        judul: "Tentang lokasi",
        paragraf: [
          "Capungan Banggai (Banggai cardinalfish) adalah ikan endemik perairan Kepulauan Banggai. Di padang lamun depan desa, kawanan kecilnya mudah dilihat dari permukaan air.",
          "Kawasan ini termasuk perairan yang dijaga bersama warga dan mitra konservasi, jadi kunjungan selalu didampingi pemandu desa.",
        ],
      },
    ],
    aktivitas: ["Snorkeling bersama pemandu", "Mengamati capungan Banggai", "Belajar zonasi laut desa"],
    tips: ["Snorkeling terbaik saat air pasang pagi.", "Sewa alat tersedia di desa."],
    etika: ["Lihat tanpa menyentuh atau mengambil ikan", "Jangan berdiri di atas lamun dan karang"],
    info: {
      akses: "Jalan kaki 5 mnt",
      caraMenuju: "Dari Salakan ±2,5 jam jalan darat ke Lumbi-Lumbia. Lokasi snorkeling di depan desa.",
      titikJemput: "Rumah Pokdarwis Lumbi-Lumbia",
      estimasiWaktu: "2–3 jam",
      waktuTerbaik: "Pagi",
      tiket: "Rp15.000",
      fasilitas: ["Sewa alat snorkel", "Pemandu desa", "Homestay"],
    },
  },
  {
    slug: "pantai-sambulangan",
    nama: "Pantai Sambulangan",
    desa: "sambulangan",
    kategori: "bahari",
    tag: ["Pantai"],
    unggulan: true,
    statusArtikel: "tayang",
    ringkasan: "Pantai pasir putih berlatar bukit hijau di ibu kota Bulagi Utara, tenang untuk berenang sore.",
    foto: "/images/pantai-sambulangan.webp",
    galeri: ["/images/pantai-sambulangan.webp", "/images/pulau-senja.webp"],
    artikel: [
      {
        judul: "Tentang pantai",
        paragraf: [
          "Pantai ini menghadap teluk yang terlindung, sehingga ombaknya kecil. Sore hari warga berkumpul di tepi pantai sambil menunggu perahu nelayan pulang.",
        ],
      },
    ],
    aktivitas: ["Berenang dan bermain pasir", "Menunggu matahari terbenam", "Makan ikan bakar di warung warga"],
    tips: ["Datang sore untuk cahaya terbaik.", "Homestay bisa dipesan lewat paket."],
    etika: ["Bawa pulang sampahmu", "Hormati waktu salat warga"],
    info: {
      akses: "Mobil",
      caraMenuju: "Dari Salakan ±3,5 jam jalan darat ke Sambulangan.",
      waktuTerbaik: "Sore",
      tiket: "Gratis",
      fasilitas: ["Warung warga", "Homestay", "Toilet umum"],
    },
  },
  {
    slug: "kampung-tua-lolantang",
    nama: "Kampung tua Lolantang",
    desa: "lolantang",
    kategori: "budaya",
    tag: ["Kampung adat"],
    unggulan: true,
    statusArtikel: "tayang",
    ringkasan: "Kampung tua dengan rumah panggung kayu dan cerita leluhur yang masih dituturkan warga.",
    foto: "/images/kampung-lolantang.webp",
    galeri: ["/images/kampung-lolantang.webp", "/images/pkt-budaya.webp", "/images/tari-kampung.webp"],
    artikel: [
      {
        judul: "Tentang kampung",
        paragraf: [
          "Lolantang adalah ibu kota Kecamatan Bulagi Selatan. Di bagian kampung tuanya, rumah panggung kayu masih berdiri dan beberapa keluarga menyimpan benda pusaka.",
        ],
      },
    ],
    aktivitas: ["Jalan kaki keliling kampung", "Mencicipi kuliner rumahan", "Melihat latihan tari"],
    tips: ["Minta izin sebelum memotret rumah dan warga."],
    etika: ["Berpakaian sopan", "Minta izin sebelum memotret"],
    info: {
      akses: "Mobil",
      caraMenuju: "Dari Salakan ±4 jam jalan darat ke Lolantang.",
      waktuTerbaik: "Pagi",
      tiket: "Sukarela",
      fasilitas: ["Pemandu desa", "Warung warga"],
    },
  },
  { slug: "bukit-pandang-lumbi-lumbia", nama: "Bukit pandang Lumbi-Lumbia", desa: "lumbi-lumbia", kategori: "alam", unggulan: true, ringkasan: "Bukit pendek dengan pemandangan teluk dan pulau-pulau kecil saat matahari terbit.", foto: "/images/bukit-lumbia.webp" },
  { slug: "taman-laut-liang", nama: "Taman laut Liang", desa: "liang", kategori: "bahari", ringkasan: "Terumbu karang dangkal untuk snorkeling dan selam di sekitar gugusan pulau Liang.", foto: "/images/taman-laut-liang.webp" },
  { slug: "kampung-nelayan-lumbi-lumbia", nama: "Kampung nelayan Lumbi-Lumbia", desa: "lumbi-lumbia", kategori: "budaya", ringkasan: "Ikut nelayan memancing tradisional dan belajar mengolah hasil laut.", foto: "/images/rumah-nelayan.webp" },
  { slug: "air-terjun-bulagi", nama: "Air terjun Bulagi", desa: "bulagi-satu", kategori: "alam", ringkasan: "Air terjun bertingkat di hutan Bulagi, dicapai lewat trekking ringan.", foto: "/images/pkt-air-terjun.webp" },
  { slug: "rumah-adat-lolantang", nama: "Rumah adat Lolantang", desa: "lolantang", kategori: "budaya", ringkasan: "Rumah adat tempat musyawarah dan upacara kampung.", foto: "/images/pkt-budaya.webp" },
  { slug: "teluk-sambulangan", nama: "Teluk Sambulangan", desa: "sambulangan", kategori: "bahari", ringkasan: "Teluk tenang untuk naik perahu dan melihat senja.", foto: "/images/pulau-senja.webp" },
  { slug: "bangkai-kapal-liang", nama: "Bangkai kapal Liang", desa: "liang", kategori: "bahari", ringkasan: "Situs selam bangkai kapal yang kini ditumbuhi karang.", foto: "/images/pkt-karang.webp" },
  { slug: "gugusan-pulau-salakan", nama: "Gugusan pulau Salakan", desa: "salakan", kategori: "bahari", ringkasan: "Pulau-pulau kecil di depan ibu kota kabupaten, cocok untuk island hopping.", foto: "/images/pkt-perahu-pulau.webp" },
  { slug: "pulau-pulau-tabata", nama: "Pulau-pulau Tabata", desa: "tabata", kategori: "bahari", ringkasan: "Pulau berpasir putih dengan air dangkal di Kecamatan Buko.", foto: "/images/snorkel-setengah.webp" },
  { slug: "mangrove-batulombo", nama: "Mangrove Batulombo", desa: "batulombo", kategori: "alam", ringkasan: "Hutan mangrove yang bisa disusuri dengan perahu dayung.", foto: "/images/pkt-telaga-pohon.webp" },
  { slug: "pantai-sambiut", nama: "Pantai Sambiut", desa: "sambiut", kategori: "bahari", ringkasan: "Pantai nelayan dengan suasana sore yang ramai.", foto: "/images/sunset-mancing.webp" },
  { slug: "benteng-patukuki", nama: "Situs adat Patukuki", desa: "patukuki", kategori: "budaya", ringkasan: "Situs adat di Peling Tengah. Kunjungan hanya dengan izin tetua adat." },
  { slug: "pantai-mansamat", nama: "Pantai Mansamat", desa: "mansamat", kategori: "bahari", ringkasan: "Pantai sepi di Tinangkung Selatan dengan perahu-perahu warga.", foto: "/images/hero-perahu.webp" },
  { slug: "goa-kalumbatan", nama: "Goa Kalumbatan", desa: "kalumbatan", kategori: "alam", ringkasan: "Goa kapur di Totikum Selatan; jalur masih didata." },
];
