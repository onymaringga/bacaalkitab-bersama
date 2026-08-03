/**
 * Peta tempat Alkitab — lokasi zaman dulu + kisah yang terjadi di sana.
 * Koordinat lat/lng untuk Google Maps; x/y skematik disimpan sebagai cadangan.
 */

export type BiblePlaceRegionId =
  | "mesopotamia"
  | "mesir"
  | "kanaan"
  | "galilea"
  | "mediterania"
  | "lainnya";

export type BiblePlaceKindId =
  | "kota"
  | "negara"
  | "gunung"
  | "bukit"
  | "danau"
  | "laut"
  | "sungai"
  | "lembah"
  | "pulau"
  | "taman";

export type BiblePlaceStory = {
  title: string;
  summary: string;
  /** Referensi tampilan, mis. "Kejadian 12" */
  reference: string;
  passage: string;
  verse?: number;
  era: "pl" | "pb";
};

export type BiblePlace = {
  slug: string;
  name: string;
  alsoCalled?: string[];
  region: BiblePlaceRegionId;
  /** Jenis lokasi: kota, danau, gunung, dll. */
  kind: BiblePlaceKindId;
  /** Deskripsi singkat tempat */
  blurb: string;
  /** Latitude (Google Maps) */
  lat: number;
  /** Longitude (Google Maps) */
  lng: number;
  /** Posisi cadangan di peta skematik (persen) */
  x: number;
  y: number;
  featured?: boolean;
  keywords: string[];
  stories: BiblePlaceStory[];
};

export type BiblePlaceRegion = {
  id: BiblePlaceRegionId;
  label: string;
  description: string;
};

export type BiblePlaceKind = {
  id: BiblePlaceKindId;
  label: string;
  description: string;
};

export const BIBLE_PLACE_KINDS: BiblePlaceKind[] = [
  { id: "kota", label: "Kota", description: "Kota dan pemukiman" },
  { id: "negara", label: "Negara / wilayah", description: "Negara atau kawasan besar" },
  { id: "gunung", label: "Gunung", description: "Gunung dan puncak" },
  { id: "bukit", label: "Bukit", description: "Bukit dan tempat tinggi" },
  { id: "danau", label: "Danau", description: "Danau dan perairan tertutup" },
  { id: "laut", label: "Laut", description: "Laut dan teluk" },
  { id: "sungai", label: "Sungai", description: "Sungai dan aliran air" },
  { id: "lembah", label: "Lembah", description: "Lembah dan dataran rendah" },
  { id: "pulau", label: "Pulau", description: "Pulau dan kepulauan" },
  { id: "taman", label: "Taman", description: "Taman, kebun, dan kebun zaitun" },
];

export const BIBLE_PLACE_REGIONS: BiblePlaceRegion[] = [
  {
    id: "kanaan",
    label: "Kanaan / Yehuda",
    description: "Yerusalem, Betlehem, dan sekitar Tanah Perjanjian",
  },
  {
    id: "galilea",
    label: "Galilea & Utara",
    description: "Nazaret, Kapernaum, dan danau",
  },
  {
    id: "mesir",
    label: "Mesir & Sinai",
    description: "Keluaran, padang gurun, dan pelarian",
  },
  {
    id: "mesopotamia",
    label: "Mesopotamia",
    description: "Ur, Babel, dan tanah sungai",
  },
  {
    id: "mediterania",
    label: "Pesisir & seberang laut",
    description: "Pelabuhan, pulau, dan kota misi",
  },
  {
    id: "lainnya",
    label: "Lainnya",
    description: "Tempat penting di luar peta inti",
  },
];

export const BIBLE_PLACES: BiblePlace[] = [
  {
    slug: "betlehem",
    name: "Betlehem",
    alsoCalled: ["Betlehem Efata", "Kota Daud"],
    region: "kanaan",
    kind: "kota",
    blurb: "Kota kecil di Yehuda — tempat Daud diurapi dan Yesus lahir.",
    x: 48,
    y: 58,
    lat: 31.7054,
    lng: 35.2024,
    featured: true,
    keywords: ["kelahiran", "Daud", "Yesus", "Rut"],
    stories: [
      {
        title: "Rut dan Boas",
        summary:
          "Rut, janda Moab, bekerja di ladang Boas di Betlehem dan menjadi nenek moyang Daud.",
        reference: "Rut 1–4",
        passage: "Rut 1",
        era: "pl",
      },
      {
        title: "Daud diurapi",
        summary:
          "Samuel datang ke Betlehem dan mengurapi Daud, anak bungsu Isai, menjadi raja.",
        reference: "1 Samuel 16",
        passage: "1 Samuel 16",
        era: "pl",
      },
      {
        title: "Kelahiran Yesus",
        summary:
          "Yesus lahir di Betlehem sesuai nubuat — dibaringkan dalam palungan.",
        reference: "Lukas 2",
        passage: "Lukas 2",
        verse: 4,
        era: "pb",
      },
    ],
  },
  {
    slug: "yerusalem",
    name: "Yerusalem",
    alsoCalled: ["Sion", "Kota Daud"],
    region: "kanaan",
    kind: "kota",
    blurb: "Ibu kota rohani Israel — Bait Suci, raja-raja, dan pusat kisah Yesus.",
    x: 49,
    y: 54,
    lat: 31.7683,
    lng: 35.2137,
    featured: true,
    keywords: ["bait", "salib", "Daud", "Paskah"],
    stories: [
      {
        title: "Daud membawa tabut",
        summary:
          "Daud menjadikan Yerusalem ibu kota dan membawa tabut perjanjian ke kota.",
        reference: "2 Samuel 6",
        passage: "2 Samuel 6",
        era: "pl",
      },
      {
        title: "Salomo membangun Bait",
        summary:
          "Salomo membangun Bait Suci sebagai rumah ibadah bagi nama TUHAN.",
        reference: "1 Raja-raja 6",
        passage: "1 Raja-raja 6",
        era: "pl",
      },
      {
        title: "Yesus di Bait Suci",
        summary:
          "Yesus mengajar di Bait, membersihkan pelataran, dan merayakan Paskah di kota ini.",
        reference: "Yohanes 2",
        passage: "Yohanes 2",
        verse: 13,
        era: "pb",
      },
      {
        title: "Penyaliban & kebangkitan",
        summary:
          "Di luar tembok kota Yesus disalibkan; pada hari ketiga Ia bangkit — pusat iman Kristen.",
        reference: "Lukas 23–24",
        passage: "Lukas 23",
        era: "pb",
      },
      {
        title: "Pentakosta",
        summary:
          "Roh Kudus turun atas murid-murid di Yerusalem; jemaat mula-mula lahir.",
        reference: "Kisah 2",
        passage: "Kisah Para Rasul 2",
        era: "pb",
      },
    ],
  },
  {
    slug: "nazaret",
    name: "Nazaret",
    region: "galilea",
    kind: "kota",
    blurb: "Desa di Galilea tempat Yesus dibesarkan.",
    x: 52,
    y: 38,
    lat: 32.6996,
    lng: 35.3035,
    featured: true,
    keywords: ["Yesus", "Maria", "Galilea"],
    stories: [
      {
        title: "Kabari kepada Maria",
        summary:
          "Malaikat Gabriel memberitahu Maria di Nazaret bahwa ia akan mengandung Anak Allah.",
        reference: "Lukas 1",
        passage: "Lukas 1",
        verse: 26,
        era: "pb",
      },
      {
        title: "Yesus dibesarkan",
        summary:
          "Keluarga kudus menetap di Nazaret; Yesus dikenal sebagai “Yesus orang Nazaret”.",
        reference: "Matius 2",
        passage: "Matius 2",
        verse: 23,
        era: "pb",
      },
      {
        title: "Ditolak di sinagoge",
        summary:
          "Yesus membaca Yesaya di sinagoge kampung halaman-Nya dan ditolak orang sekampung.",
        reference: "Lukas 4",
        passage: "Lukas 4",
        verse: 16,
        era: "pb",
      },
    ],
  },
  {
    slug: "kapernaum",
    name: "Kapernaum",
    region: "galilea",
    kind: "kota",
    blurb: "Kota di tepi Danau Galilea — “markas” pelayanan Yesus.",
    x: 56,
    y: 34,
    lat: 32.8803,
    lng: 35.5744,
    featured: true,
    keywords: ["Galilea", "mukjizat", "Petrus"],
    stories: [
      {
        title: "Panggilan murid",
        summary:
          "Di sekitar danau dekat Kapernaum, Yesus memanggil Petrus, Andreas, Yakobus, dan Yohanes.",
        reference: "Matius 4",
        passage: "Matius 4",
        verse: 18,
        era: "pb",
      },
      {
        title: "Penyembuhan di Kapernaum",
        summary:
          "Banyak orang disembuhkan; rumah Petrus menjadi tempat pelayanan.",
        reference: "Markus 1",
        passage: "Markus 1",
        verse: 21,
        era: "pb",
      },
      {
        title: "Roti hidup",
        summary:
          "Setelah memberi makan lima ribu orang, Yesus mengajar tentang roti hidup di sinagoge Kapernaum.",
        reference: "Yohanes 6",
        passage: "Yohanes 6",
        verse: 24,
        era: "pb",
      },
    ],
  },
  {
    slug: "danau-galilea",
    name: "Danau Galilea",
    alsoCalled: ["Danau Genesaret", "Laut Tiberias"],
    region: "galilea",
    kind: "danau",
    blurb: "Danau air tawar di utara — latar banyak mukjizat dan pengajaran Yesus.",
    x: 55,
    y: 36,
    lat: 32.8244,
    lng: 35.5828,
    keywords: ["badai", "ikan", "berjalan di atas air"],
    stories: [
      {
        title: "Meredakan badai",
        summary:
          "Murid-murid ketakutan di perahu; Yesus menegur angin dan danau menjadi teduh.",
        reference: "Markus 4",
        passage: "Markus 4",
        verse: 35,
        era: "pb",
      },
      {
        title: "Berjalan di atas air",
        summary:
          "Yesus datang kepada murid-murid dengan berjalan di atas danau; Petrus sempat mencoba.",
        reference: "Matius 14",
        passage: "Matius 14",
        verse: 22,
        era: "pb",
      },
      {
        title: "Penangkapan ikan ajaib",
        summary:
          "Setelah kebangkitan, Yesus menampakkan diri di pantai danau dan menyediakan sarapan ikan.",
        reference: "Yohanes 21",
        passage: "Yohanes 21",
        era: "pb",
      },
    ],
  },
  {
    slug: "yerikho",
    name: "Yerikho",
    region: "kanaan",
    kind: "kota",
    blurb: "Kota oasis di lembah Yordan — tembok runtuh dan perjumpaan dengan Zakheus.",
    x: 54,
    y: 52,
    lat: 31.855,
    lng: 35.4618,
    featured: true,
    keywords: ["Yosua", "Rahab", "Zakheus"],
    stories: [
      {
        title: "Tembok Yerikho runtuh",
        summary:
          "Israel mengelilingi kota; tembok runtuh dan Rahab diselamatkan karena imannya.",
        reference: "Yosua 6",
        passage: "Yosua 6",
        era: "pl",
      },
      {
        title: "Zakheus di pohon ara",
        summary:
          "Pemungut cukai kecil naik pohon untuk melihat Yesus; rumahnya menerima keselamatan.",
        reference: "Lukas 19",
        passage: "Lukas 19",
        era: "pb",
      },
      {
        title: "Orang buta di jalan",
        summary:
          "Bartimeus berseru di pinggir jalan Yerikho dan menerima penglihatannya kembali.",
        reference: "Markus 10",
        passage: "Markus 10",
        verse: 46,
        era: "pb",
      },
    ],
  },
  {
    slug: "hebron",
    name: "Hebron",
    region: "kanaan",
    kind: "kota",
    blurb: "Kota kuno di perbukitan Yehuda — terkait Abraham dan makam para bapa.",
    x: 46,
    y: 62,
    lat: 31.5326,
    lng: 35.0998,
    keywords: ["Abraham", "Sara", "patriarkh"],
    stories: [
      {
        title: "Abraham membeli gua Makhpela",
        summary:
          "Abraham membeli tanah pekuburan di Hebron untuk Sara — tanda iman akan janji tanah.",
        reference: "Kejadian 23",
        passage: "Kejadian 23",
        era: "pl",
      },
      {
        title: "Daud diurapi di Hebron",
        summary:
          "Daud mula-mula memerintah dari Hebron sebelum memindahkan ibu kota ke Yerusalem.",
        reference: "2 Samuel 2",
        passage: "2 Samuel 2",
        era: "pl",
      },
    ],
  },
  {
    slug: "betel",
    name: "Betel",
    alsoCalled: ["Rumah Allah"],
    region: "kanaan",
    kind: "kota",
    blurb: "Tempat Yakub bermimpi tentang tangga ke langit.",
    x: 50,
    y: 50,
    lat: 31.942,
    lng: 35.22,
    keywords: ["Yakub", "mimpi", "janji"],
    stories: [
      {
        title: "Mimpi Yakub",
        summary:
          "Yakub bermimpi melihat tangga dan malaikat; ia menamai tempat itu Betel — rumah Allah.",
        reference: "Kejadian 28",
        passage: "Kejadian 28",
        verse: 10,
        era: "pl",
      },
      {
        title: "Yakub kembali ke Betel",
        summary:
          "Allah memanggil Yakub kembali ke Betel untuk mendirikan mezbah dan memperbarui janji.",
        reference: "Kejadian 35",
        passage: "Kejadian 35",
        era: "pl",
      },
    ],
  },
  {
    slug: "gunung-karmel",
    name: "Gunung Karmel",
    region: "galilea",
    kind: "gunung",
    blurb: "Pegunungan di pesisir utara — arena Elia melawan nabi Baal.",
    x: 44,
    y: 36,
    lat: 32.7394,
    lng: 35.0483,
    keywords: ["Elia", "Baal", "api"],
    stories: [
      {
        title: "Elia vs nabi Baal",
        summary:
          "Elia menantang nabi Baal; api TUHAN turun dan umat berseru: TUHAN, Dialah Allah.",
        reference: "1 Raja-raja 18",
        passage: "1 Raja-raja 18",
        era: "pl",
      },
    ],
  },
  {
    slug: "samaria",
    name: "Samaria",
    region: "kanaan",
    kind: "kota",
    blurb: "Ibu kota kerajaan utara — lalu wilayah di antara Yehuda dan Galilea.",
    x: 50,
    y: 44,
    lat: 32.2764,
    lng: 35.1958,
    keywords: ["perempuan Samaria", "sumur", "Ahab"],
    stories: [
      {
        title: "Kerajaan Ahab",
        summary:
          "Samaria menjadi pusat kerajaan Israel utara di masa raja-raja seperti Ahab.",
        reference: "1 Raja-raja 16",
        passage: "1 Raja-raja 16",
        verse: 24,
        era: "pl",
      },
      {
        title: "Perempuan di sumur",
        summary:
          "Yesus berbicara dengan perempuan Samaria di sumur Yakub tentang air hidup.",
        reference: "Yohanes 4",
        passage: "Yohanes 4",
        era: "pb",
      },
    ],
  },
  {
    slug: "sungai-yordan",
    name: "Sungai Yordan",
    region: "kanaan",
    kind: "sungai",
    blurb: "Sungai yang membelah tanah — penyeberangan Israel dan baptisan Yesus.",
    x: 58,
    y: 48,
    lat: 31.75,
    lng: 35.55,
    featured: true,
    keywords: ["baptisan", "Yosua", "Yohanes"],
    stories: [
      {
        title: "Israel menyeberang",
        summary:
          "Air Yordan terhenti; umat masuk Tanah Perjanjian di belakang tabut.",
        reference: "Yosua 3",
        passage: "Yosua 3",
        era: "pl",
      },
      {
        title: "Naaman dicuci",
        summary:
          "Panglima Aram dicuci tujuh kali di Yordan dan kudapanya sembuh.",
        reference: "2 Raja-raja 5",
        passage: "2 Raja-raja 5",
        era: "pl",
      },
      {
        title: "Yesus dibaptis",
        summary:
          "Yohanes membaptis Yesus di Yordan; langit terbuka dan Roh turun seperti burung merpati.",
        reference: "Matius 3",
        passage: "Matius 3",
        verse: 13,
        era: "pb",
      },
    ],
  },
  {
    slug: "mesir",
    name: "Mesir",
    alsoCalled: ["Tanah Nil", "Mizraim"],
    region: "mesir",
    kind: "negara",
    blurb: "Negeri sungai Nil — tempat Yusuf berkuasa, Israel diperbudak, dan Keluaran dimulai.",
    x: 28,
    y: 72,
    lat: 29.849,
    lng: 31.25,
    featured: true,
    keywords: ["Yusuf", "Musa", "Keluaran", "Firaun"],
    stories: [
      {
        title: "Yusuf di Mesir",
        summary:
          "Yusuf dijual ke Mesir, lalu diangkat menjadi pejabat yang menyelamatkan banyak bangsa dari kelaparan.",
        reference: "Kejadian 41",
        passage: "Kejadian 41",
        era: "pl",
      },
      {
        title: "Israel diperbudak",
        summary:
          "Keturunan Yakub tinggal di Mesir; generasi kemudian ditindas Firaun.",
        reference: "Keluaran 1",
        passage: "Keluaran 1",
        era: "pl",
      },
      {
        title: "Keluaran dari Mesir",
        summary:
          "Allah membebaskan Israel melalui Musa — tulah, Paskah, dan ke luar menuju Sinai.",
        reference: "Keluaran 12",
        passage: "Keluaran 12",
        era: "pl",
      },
      {
        title: "Keluarga kudus melarikan diri",
        summary:
          "Yusuf membawa Maria dan Yesus ke Mesir untuk menghindari Herodes, lalu kembali.",
        reference: "Matius 2",
        passage: "Matius 2",
        verse: 13,
        era: "pb",
      },
    ],
  },
  {
    slug: "laut-teberau",
    name: "Laut Teberau",
    alsoCalled: ["Laut Merah", "Yam Suf"],
    region: "mesir",
    kind: "laut",
    blurb: "Perairan yang dibelah Allah saat Israel keluar dari Mesir.",
    x: 34,
    y: 78,
    lat: 29.9,
    lng: 32.55,
    keywords: ["Keluaran", "Musa", "Firaun"],
    stories: [
      {
        title: "Penyeberangan ajaib",
        summary:
          "Air terbelah; Israel berjalan di tanah kering, sementara tentara Firaun ditenggelamkan.",
        reference: "Keluaran 14",
        passage: "Keluaran 14",
        era: "pl",
      },
      {
        title: "Nyanyian Musa",
        summary:
          "Setelah diselamatkan, Musa dan umat menyanyikan pujian kepada TUHAN.",
        reference: "Keluaran 15",
        passage: "Keluaran 15",
        era: "pl",
      },
    ],
  },
  {
    slug: "gunung-sinai",
    name: "Gunung Sinai",
    alsoCalled: ["Horeb"],
    region: "mesir",
    kind: "gunung",
    blurb: "Gunung di padang gurun tempat Allah memberi Sepuluh Firman.",
    x: 38,
    y: 82,
    lat: 28.5392,
    lng: 33.9752,
    featured: true,
    keywords: ["Taurat", "Musa", "perjanjian"],
    stories: [
      {
        title: "Semak yang menyala",
        summary:
          "Di Horeb, Allah memanggil Musa dari semak yang menyala untuk membebaskan Israel.",
        reference: "Keluaran 3",
        passage: "Keluaran 3",
        era: "pl",
      },
      {
        title: "Sepuluh Firman",
        summary:
          "Allah berbicara di gunung; Musa menerima loh batu dan hukum perjanjian.",
        reference: "Keluaran 20",
        passage: "Keluaran 20",
        era: "pl",
      },
      {
        title: "Lembu emas",
        summary:
          "Sementara Musa di gunung, umat membuat berhala; Musa memohon pengampunan.",
        reference: "Keluaran 32",
        passage: "Keluaran 32",
        era: "pl",
      },
    ],
  },
  {
    slug: "ur",
    name: "Ur",
    alsoCalled: ["Ur-Kasdim"],
    region: "mesopotamia",
    kind: "kota",
    blurb: "Kota di Mesopotamia tempat Abraham dipanggil keluar.",
    x: 88,
    y: 58,
    lat: 30.962,
    lng: 46.105,
    keywords: ["Abraham", "panggilan", "janji"],
    stories: [
      {
        title: "Panggilan Abraham",
        summary:
          "Allah memanggil Abram meninggalkan negeri dan kaum keluarganya menuju tanah yang akan ditunjukkan.",
        reference: "Kejadian 12",
        passage: "Kejadian 12",
        era: "pl",
      },
    ],
  },
  {
    slug: "babel",
    name: "Babel",
    alsoCalled: ["Babelon", "Babylon"],
    region: "mesopotamia",
    kind: "kota",
    blurb: "Kota besar di tepi Efrat — pembuangan Yehuda dan kisah Daniel.",
    x: 84,
    y: 48,
    lat: 32.5422,
    lng: 44.4209,
    featured: true,
    keywords: ["pembuangan", "Daniel", "Nebukadnezar"],
    stories: [
      {
        title: "Menara Babel",
        summary:
          "Manusia membangun menara; Allah mengacaubalaukan bahasa mereka.",
        reference: "Kejadian 11",
        passage: "Kejadian 11",
        era: "pl",
      },
      {
        title: "Pembuangan ke Babel",
        summary:
          "Yerusalem runtuh; banyak orang Yehuda dibawa ke Babel selama tujuh puluh tahun.",
        reference: "2 Raja-raja 25",
        passage: "2 Raja-raja 25",
        era: "pl",
      },
      {
        title: "Daniel di istana",
        summary:
          "Daniel setia di Babel — menafsir mimpi, bertahan dalam doa, dan diselamatkan dari gua singa.",
        reference: "Daniel 6",
        passage: "Daniel 6",
        era: "pl",
      },
    ],
  },
  {
    slug: "ninewe",
    name: "Ninewe",
    region: "mesopotamia",
    kind: "kota",
    blurb: "Ibu kota Asyur — kota yang dikhotbahi Yunus.",
    x: 78,
    y: 28,
    lat: 36.3594,
    lng: 43.1531,
    keywords: ["Yunus", "pertobatan", "Asyur"],
    stories: [
      {
        title: "Yunus di Ninewe",
        summary:
          "Setelah melarikan diri, Yunus memberitakan penghakiman; kota itu bertobat.",
        reference: "Yunus 3",
        passage: "Yunus 3",
        era: "pl",
      },
    ],
  },
  {
    slug: "damsyik",
    name: "Damsyik",
    alsoCalled: ["Damaskus"],
    region: "lainnya",
    kind: "kota",
    blurb: "Kota kuno di utara — tempat Saulus bertobat menjadi Paulus.",
    x: 62,
    y: 26,
    lat: 33.5138,
    lng: 36.2765,
    featured: true,
    keywords: ["Paulus", "pertobatan", "Ananias"],
    stories: [
      {
        title: "Pertobatan Saulus",
        summary:
          "Di jalan ke Damsyik, Saulus bertemu Kristus yang bangkit; hidupnya berbalik total.",
        reference: "Kisah 9",
        passage: "Kisah Para Rasul 9",
        era: "pb",
      },
    ],
  },
  {
    slug: "filipi",
    name: "Filipi",
    region: "mediterania",
    kind: "kota",
    blurb: "Kota di Makedonia — jemaat pertama di Eropa dalam misi Paulus.",
    x: 18,
    y: 22,
    lat: 41.012,
    lng: 24.284,
    keywords: ["Lidia", "Paulus", "penjara"],
    stories: [
      {
        title: "Lidia percaya",
        summary:
          "Paulus memberitakan Injil di tepi sungai; Lidia dan seisi rumahnya dibaptis.",
        reference: "Kisah 16",
        passage: "Kisah Para Rasul 16",
        verse: 11,
        era: "pb",
      },
      {
        title: "Nyanyian di penjara",
        summary:
          "Paulus dan Silas dipenjara; mereka berdoa dan menyanyi — lalu pintu penjara terbuka.",
        reference: "Kisah 16",
        passage: "Kisah Para Rasul 16",
        verse: 25,
        era: "pb",
      },
    ],
  },
  {
    slug: "efesus",
    name: "Efesus",
    region: "mediterania",
    kind: "kota",
    blurb: "Kota besar di Asia Kecil — pusat penyembahan Artemis dan pelayanan Paulus.",
    x: 22,
    y: 34,
    lat: 37.9397,
    lng: 27.3408,
    keywords: ["Paulus", "Artemis", "jemaat"],
    stories: [
      {
        title: "Kekacauan di Efesus",
        summary:
          "Pelayanan Paulus menggoncang industri berhala; terjadi huru-hara di teater kota.",
        reference: "Kisah 19",
        passage: "Kisah Para Rasul 19",
        era: "pb",
      },
      {
        title: "Surat kepada Efesus",
        summary:
          "Paulus menulis tentang tubuh Kristus, anugerah, dan perlengkapan senjata Allah.",
        reference: "Efesus 1",
        passage: "Efesus 1",
        era: "pb",
      },
    ],
  },
  {
    slug: "patmos",
    name: "Patmos",
    region: "mediterania",
    kind: "pulau",
    blurb: "Pulau kecil di Laut Aegea tempat Yohanes menerima penglihatan Wahyu.",
    x: 20,
    y: 42,
    lat: 37.325,
    lng: 26.543,
    keywords: ["Wahyu", "Yohanes", "penglihatan"],
    stories: [
      {
        title: "Penglihatan di Patmos",
        summary:
          "Yohanes dibuang ke Patmos dan menerima wahyu tentang Kristus dan zaman akhir.",
        reference: "Wahyu 1",
        passage: "Wahyu 1",
        verse: 9,
        era: "pb",
      },
    ],
  },
  {
    slug: "getsembani",
    name: "Getsemani",
    alsoCalled: ["Taman Zaitun"],
    region: "kanaan",
    kind: "taman",
    blurb: "Taman di kaki Bukit Zaitun — tempat Yesus berdoa sebelum ditangkap.",
    x: 51,
    y: 55,
    lat: 31.7794,
    lng: 35.2394,
    keywords: ["doa", "penangkapan", "Paskah"],
    stories: [
      {
        title: "Doa di Getsemani",
        summary:
          "Yesus berdoa dengan pergulatan jiwa: “Bukan kehendak-Ku, melainkan kehendak-Mu.”",
        reference: "Matius 26",
        passage: "Matius 26",
        verse: 36,
        era: "pb",
      },
    ],
  },
  {
    slug: "golgota",
    name: "Golgota",
    alsoCalled: ["Tempat Tengkorak", "Kalvari"],
    region: "kanaan",
    kind: "bukit",
    blurb: "Bukit di luar Yerusalem tempat Yesus disalibkan.",
    x: 47,
    y: 53,
    lat: 31.7784,
    lng: 35.2294,
    featured: true,
    keywords: ["salib", "penyaliban", "keselamatan"],
    stories: [
      {
        title: "Penyaliban Yesus",
        summary:
          "Yesus disalibkan di Golgota; Ia mengampuni, menyelesaikan karya penebusan, dan menyerahkan nyawa-Nya.",
        reference: "Yohanes 19",
        passage: "Yohanes 19",
        verse: 17,
        era: "pb",
      },
    ],
  },
];

export function getPlaceRegion(id: BiblePlaceRegionId) {
  return (
    BIBLE_PLACE_REGIONS.find((item) => item.id === id) ??
    BIBLE_PLACE_REGIONS[0]!
  );
}

export function getPlaceKind(id: BiblePlaceKindId) {
  return (
    BIBLE_PLACE_KINDS.find((item) => item.id === id) ??
    BIBLE_PLACE_KINDS[0]!
  );
}

export function getUsedPlaceKinds() {
  const used = new Set(BIBLE_PLACES.map((place) => place.kind));
  return BIBLE_PLACE_KINDS.filter((kind) => used.has(kind.id));
}

export function getBiblePlace(slug: string) {
  return BIBLE_PLACES.find((item) => item.slug === slug) ?? null;
}

export function getFeaturedPlaces() {
  return BIBLE_PLACES.filter((item) => item.featured);
}

export function getPlaceCount() {
  return BIBLE_PLACES.length;
}

export function getStoryCount() {
  return BIBLE_PLACES.reduce((sum, place) => sum + place.stories.length, 0);
}

export function searchBiblePlaces(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...BIBLE_PLACES].sort((a, b) => a.name.localeCompare(b.name, "id"));
  }
  return BIBLE_PLACES.filter((item) => {
    const storyText = item.stories
      .map((story) => `${story.title} ${story.summary} ${story.reference}`)
      .join(" ");
    const haystack = [
      item.name,
      item.blurb,
      item.slug,
      storyText,
      ...(item.alsoCalled ?? []),
      ...item.keywords,
      getPlaceRegion(item.region).label,
      getPlaceKind(item.kind).label,
      item.kind,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  }).sort((a, b) => a.name.localeCompare(b.name, "id"));
}

export function placeStoryHref(story: BiblePlaceStory) {
  const params = new URLSearchParams();
  params.set("browse", "1");
  params.set("passage", story.passage);
  if (story.verse) params.set("verse", String(story.verse));
  return `/baca?${params.toString()}`;
}

export function placeEraLabel(era: "pl" | "pb") {
  return era === "pl" ? "Perjanjian Lama" : "Perjanjian Baru";
}
