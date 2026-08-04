/**
 * Kisah-kisah penting Alkitab — narasi, pelajaran, dan pintu masuk bacaan.
 */

import { applyStoryDepth } from "@/lib/bible-story-details";

export type BibleStoryCategoryId =
  | "creation"
  | "patriarchs"
  | "exodus"
  | "kingdom"
  | "prophets"
  | "gospel"
  | "church";

export type BibleStoryPassage = {
  reference: string;
  passage: string;
  verse?: number;
  text?: string;
};

export type BibleStoryMoment = {
  title: string;
  summary: string;
  reference?: string;
  passage?: string;
  verse?: number;
};

export type BibleStory = {
  slug: string;
  title: string;
  summary: string;
  category: BibleStoryCategoryId;
  era: "pl" | "pb";
  keywords: string[];
  featured?: boolean;
  /** Latar & konteks kisah */
  background?: string;
  narrative: string;
  /** Urutan peristiwa penting */
  keyMoments?: BibleStoryMoment[];
  lessons?: string[];
  reflection?: string;
  prayer?: string;
  keyPassages: BibleStoryPassage[];
  relatedCharacterSlugs?: string[];
  relatedPlaceSlugs?: string[];
};

export type BibleStoryCategory = {
  id: BibleStoryCategoryId;
  label: string;
  description: string;
};

export const BIBLE_STORY_CATEGORIES: BibleStoryCategory[] = [
  {
    id: "creation",
    label: "Penciptaan & awal",
    description: "Asal langit dan bumi, manusia, dan perjanjian awal",
  },
  {
    id: "patriarchs",
    label: "Patriarkh",
    description: "Abraham, Yusuf, Rut — iman dan pemeliharaan Allah",
  },
  {
    id: "exodus",
    label: "Keluaran & negeri",
    description: "Pembebasan, hukum, dan masuk ke tanah perjanjian",
  },
  {
    id: "kingdom",
    label: "Kerajaan",
    description: "Raja, peperangan, dan kesetiaan kepada Allah",
  },
  {
    id: "prophets",
    label: "Nabi",
    description: "Panggilan, teguran, dan harapan pemulihan",
  },
  {
    id: "gospel",
    label: "Injil",
    description: "Kelahiran, pelayanan, salib, dan kebangkitan Yesus",
  },
  {
    id: "church",
    label: "Gereja mula-mula",
    description: "Roh Kudus, misi, dan pertumbuhan jemaat",
  },
];

function p(
  reference: string,
  passage: string,
  verse?: number,
): BibleStoryPassage {
  return { reference, passage, verse };
}

const BASE_BIBLE_STORIES = ([
  {
    slug: "penciptaan",
    title: "Penciptaan dunia",
    summary: "Allah menciptakan langit dan bumi, lalu manusia menurut gambar-Nya.",
    category: "creation",
    era: "pl",
    keywords: ["cipta", "adam", "hawa", "genesis", "awal"],
    featured: true,
    narrative:
      "Dalam enam hari Allah membentuk cahaya, langit, daratan, tumbuhan, bintang, ikan, burung, dan binatang. Manusia — Adam dan Hawa — diciptakan untuk mengelola bumi dan bersekutu dengan Pencipta.\n\nKisah penciptaan bukan sekadar prolog kosmologi; ia menegaskan bahwa dunia punya Asal yang baik, manusia punya martabat, dan hidup berada di bawah tangan Allah yang berkuasa.",
    lessons: [
      "Setiap manusia diciptakan dengan martabat dan tujuan",
      "Allah adalah Pencipta yang baik — ciptaan-Nya pada mulanya baik",
    ],
    keyPassages: [
      p("Kejadian 1:1", "Kejadian 1", 1),
      p("Kejadian 1:27", "Kejadian 1", 27),
      p("Kejadian 2:7", "Kejadian 2", 7),
    ],
    relatedCharacterSlugs: ["adam", "hawa"],
  },
  {
    slug: "air-bah",
    title: "Air bah & perjanjian Nuh",
    summary: "Allah menghakimi kejahatan dunia, tetapi menyelamatkan Nuh dan keluarganya.",
    category: "creation",
    era: "pl",
    keywords: ["nuh", "bah", "bahtera", "pelangi", "perjanjian"],
    narrative:
      "Kejahatan manusia memenuhi bumi. Allah memutuskan air bah, tetapi Nuh — orang benar — diperintahkan membuat bahtera. Keluarganya dan pasangan setiap jenis hewan selamat.\n\nSetelah air surut, Allah meneguhkan perjanjian dengan tanda pelangi: Ia tidak akan lagi memusnahkan bumi dengan air bah. Kisah ini mengingatkan bahwa keadilan dan anugerah Allah berjalan bersama.",
    lessons: [
      "Allah serius terhadap dosa, tetapi juga menyediakan jalan keluar",
      "Perjanjian Allah memberi harapan setelah penghakiman",
    ],
    keyPassages: [
      p("Kejadian 6:9", "Kejadian 6", 9),
      p("Kejadian 7:1", "Kejadian 7", 1),
      p("Kejadian 9:13", "Kejadian 9", 13),
    ],
    relatedCharacterSlugs: ["nuh"],
  },
  {
    slug: "panggilan-abraham",
    title: "Panggilan Abraham",
    summary: "Allah memanggil Abram keluar dan menjanjikan berkat bagi segala bangsa.",
    category: "patriarchs",
    era: "pl",
    keywords: ["abraham", "abram", "panggilan", "janji", "iman"],
    featured: true,
    narrative:
      "Allah memanggil Abram meninggalkan Ur menuju negeri yang akan ditunjukkan. Janji diberikan: tanah, keturunan, dan berkat bagi segala bangsa.\n\nAbraham berangkat meski belum melihat tujuan akhir. Perjalanannya penuh ujian — termasuk pengikatan Ishak — namun iman dan kesetiaan Allah terus diteguhkan.",
    lessons: [
      "Iman sering berarti melangkah sebelum semuanya jelas",
      "Allah menepati janji-Nya meski prosesnya panjang",
    ],
    keyPassages: [
      p("Kejadian 12:1–3", "Kejadian 12", 1),
      p("Kejadian 15:6", "Kejadian 15", 6),
      p("Kejadian 22:14", "Kejadian 22", 14),
    ],
    relatedCharacterSlugs: ["abraham", "sara", "ishak"],
  },
  {
    slug: "yusuf-mesir",
    title: "Yusuf di Mesir",
    summary: "Dijual saudaranya, Yusuf naik menjadi pembesar dan memaafkan keluarganya.",
    category: "patriarchs",
    era: "pl",
    keywords: ["yusuf", "mesir", "mimpi", "pengampunan", "pemuliharaan"],
    narrative:
      "Yusuf dijual ke Mesir oleh saudara-saudaranya. Di sana ia setia meski dianiaya, dipenjarakan, lalu dipakai Allah untuk menafsirkan mimpi Firaun.\n\nKetika kelaparan melanda, saudara-saudaranya datang kepadanya tanpa tahu siapa dia. Yusuf mengungkap identitasnya dan berkata: \"Allah merancangnya untuk kebaikan.\" Keluarga Yakub dipulihkan.",
    lessons: [
      "Allah bekerja bahkan di tempat yang tidak kita pilih",
      "Pengampunan memulihkan relasi yang rusak",
    ],
    keyPassages: [
      p("Kejadian 37:28", "Kejadian 37", 28),
      p("Kejadian 41:41", "Kejadian 41", 41),
      p("Kejadian 50:20", "Kejadian 50", 20),
    ],
    relatedCharacterSlugs: ["yusuf", "yakub"],
  },
  {
    slug: "keluaran-mesir",
    title: "Keluaran dari Mesir",
    summary: "Allah membebaskan Israel dari perbudakan melalui Musa, Paskah, dan Laut Teberau.",
    category: "exodus",
    era: "pl",
    keywords: ["musa", "mesir", "paskah", "keluaran", "pembebasan"],
    featured: true,
    narrative:
      "Bangsa Israel merintih di bawah beban Mesir. Allah memanggil Musa menghadapi Firaun. Melalui tulah-tulah, Paskah, dan penyeberangan Laut Teberau, umat dibebaskan.\n\nKeluaran menjadi pola besar pembebasan: Allah mendengar, bertindak, dan membentuk umat-Nya. Perayaan Paskah mengingatkan anugerah itu dari generasi ke generasi.",
    lessons: [
      "Allah mendengar jeritan umat-Nya yang tertindas",
      "Pembebasan sejati datang dari tangan Tuhan, bukan kekuatan manusia",
    ],
    keyPassages: [
      p("Keluaran 3:10", "Keluaran 3", 10),
      p("Keluaran 12:13", "Keluaran 12", 13),
      p("Keluaran 14:21", "Keluaran 14", 21),
    ],
    relatedCharacterSlugs: ["musa", "aaron"],
    relatedPlaceSlugs: ["mesir"],
  },
  {
    slug: "sepuluh-firman",
    title: "Sepuluh Firman",
    summary: "Allah memberikan hukum-Nya di Sinai sebagai pedoman perjanjian.",
    category: "exodus",
    era: "pl",
    keywords: ["sinai", "hukum", "firman", "perjanjian", "moses"],
    narrative:
      "Di Gunung Sinai, Israel menerima Sepuluh Firman — fondasi hubungan dengan Allah dan sesama. Hukum bukan beban kosong, melainkan bingkai kehidupan umat pilihan.\n\nFirman menunjukkan kekudusan Allah sekaligus kebutuhan manusia akan bimbingan. Perjanjian Baru melihat hukum dipenuhi dalam Kristus dan ditulis di hati oleh Roh Kudus.",
    lessons: [
      "Allah peduli bagaimana kita hidup bersama Dia dan sesama",
      "Hukum mengarahkan, bukan sekadar menghukum",
    ],
    keyPassages: [
      p("Keluaran 20:1–3", "Keluaran 20", 1),
      p("Keluaran 20:12", "Keluaran 20", 12),
      p("Ulangan 6:5", "Ulangan 6", 5),
    ],
    relatedCharacterSlugs: ["musa"],
  },
  {
    slug: "yerikho",
    title: "Yosua & Yerikho",
    summary: "Allah memberikan kemenangan kepada Israel dengan cara yang mustahil secara manusia.",
    category: "exodus",
    era: "pl",
    keywords: ["yosua", "yerikho", "kanaan", "iman", "kemenangan"],
    narrative:
      "Setelah Musa, Yosua memimpin umat menyeberangi Yordan dan menghadapi Yerikho — kota berbenteng kuat. Allah memerintahkan langkah-langkah yang aneh: berputar, tiup sangkakala, lalu berteriak.\n\nTembok jatuh bukan karena strategi militer, melainkan karena ketaatan pada firman Tuhan. Yosua menegaskan: kuatkan dan teguhkan hatimu.",
    lessons: [
      "Kemenangan sejati datang dari ketaatan, bukan sombong diri",
      "Allah sering bekerja dengan cara yang melampaui logika kita",
    ],
    keyPassages: [
      p("Yosua 1:9", "Yosua 1", 9),
      p("Yosua 6:20", "Yosua 6", 20),
    ],
    relatedCharacterSlugs: ["yosua"],
  },
  {
    slug: "rut-boas",
    title: "Rut & Boas",
    summary: "Kasih setia Rut kepada Naomi dan pemulihan melalui penebus keluarga.",
    category: "patriarchs",
    era: "pl",
    keywords: ["rut", "boas", "naomi", "hesed", "garis daud"],
    narrative:
      "Rut, perempuan Moab, menolak meninggalkan Naomi. Ia berkata: \"Ke mana engkau pergi, ke situ jugalah aku pergi… Allahmu Allahku.\" Di Betlehem ia bekerja di ladang Boas.\n\nBoas bertindak sebagai penebus; dari garis mereka lahir Daud — dan akhirnya Mesias. Kisah kecil di tengah masa hakim mengungkap kasih setia Allah yang besar.",
    lessons: [
      "Kasih setia (hesed) lebih kuat dari batas suku bangsa",
      "Allah menulis kisah besar dari langkah-langkah setia yang kecil",
    ],
    keyPassages: [
      p("Rut 1:16", "Rut 1", 16),
      p("Rut 2:12", "Rut 2", 12),
      p("Rut 4:17", "Rut 4", 17),
    ],
    relatedCharacterSlugs: ["rut", "boas", "naomi"],
  },
  {
    slug: "daud-goliat",
    title: "Daud & Goliat",
    summary: "Daud yang muda mengalahkan raksasa dengan iman kepada Allah Israel.",
    category: "kingdom",
    era: "pl",
    keywords: ["daud", "goliat", "filistin", "iman", "kemenangan"],
    featured: true,
    narrative:
      "Tentara Israel gentar menghadapi Goliat. Daud — gembala muda — datang membawa roti untuk saudaranya, lalu menawarkan diri. Ia menolak baju zirah Saul dan memilih lima batu smooth.\n\n\"Engkau datang kepadaku dengan pedang… tetapi aku datang kepadamu dalam nama TUHAN.\" Satu batu, satu kemenangan. Bukan karena Daud kuat, melainkan karena Allah berperang.",
    lessons: [
      "Allah memakai yang lemah agar kuasa-Nya yang terlihat",
      "Keberanian sejati lahir dari percaya, bukan dari ukuran tubuh",
    ],
    keyPassages: [
      p("1 Samuel 17:45", "1 Samuel 17", 45),
      p("1 Samuel 17:49", "1 Samuel 17", 49),
    ],
    relatedCharacterSlugs: ["daud", "saul-raja"],
  },
  {
    slug: "elia-karmel",
    title: "Elia di Gunung Karmel",
    summary: "Elia menantang Baal dan api dari langit membuktikan Allah yang hidup.",
    category: "prophets",
    era: "pl",
    keywords: ["elia", "karmel", "baal", "api", "nabi"],
    narrative:
      "Israel bercampur baur ibadah kepada Baal. Elia menantang 450 nabi Baal di Karmel: \"Beribadahlah kepada Allah yang menjawab dengan api.\" Baal diam; Allah menjawab — api turun, rakyat berseru: \"TUHAN, Dialah Allah!\"\n\nKemenangan itu bukan akhir cerita — Elia juga lelah dan butuh pemulihan — tetapi menegaskan bahwa hanya Allah yang layak disembah.",
    lessons: [
      "Allah hidup dan menjawab doa umat-Nya",
      "Kebenaran kadang perlu diperjuangkan di tengah mayoritas yang salah",
    ],
    keyPassages: [
      p("1 Raja-raja 18:21", "1 Raja-raja 18", 21),
      p("1 Raja-raja 18:38", "1 Raja-raja 18", 38),
    ],
    relatedCharacterSlugs: ["elias"],
  },
  {
    slug: "daniel-singa",
    title: "Daniel di liang singa",
    summary: "Daniel tetap berdoa meski dilarang, dan Allah menutup mulut singa.",
    category: "prophets",
    era: "pl",
    keywords: ["daniel", "singa", "doa", "kesetiaan", "babylon"],
    narrative:
      "Daniel diangkat di Babel karena hikmatnya. Decree raja melarang doa kepada siapa pun selain raja. Daniel tetap berlutut tiga kali sehari menghadap Yerusalem.\n\nIa dilempar ke liang singa, tetapi malaikat menutup mulutnya. Raja Darius bangun pagi-pagi: \"Allah Daniel hidup!\" Kesetiaan kecil yang konsisten mengalahkan tekanan kekuasaan.",
    lessons: [
      "Kesetiaan harian lebih kuat dari heroisme sesaat",
      "Allah melindungi hamba-Nya yang takut akan Dia",
    ],
    keyPassages: [
      p("Daniel 6:10", "Daniel 6", 10),
      p("Daniel 6:22", "Daniel 6", 22),
    ],
    relatedCharacterSlugs: ["daniel"],
  },
  {
    slug: "ester",
    title: "Ester menyelamatkan bangsanya",
    summary: "Ester berani menghadapi raja demi menyelamatkan Yahudi dari rencana jahat Haman.",
    category: "kingdom",
    era: "pl",
    keywords: ["ester", "haman", "mordekhai", "berani", "providence"],
    narrative:
      "Di Persia, Haman merencanakan pemusnahan Yahudi. Ester — ratu yang awalnya diam — diingatkan Mordekhai: \"Mungkin justru karena inilah engkau menjadi ratu.\"\n\nIa berani masuk ke hadapan raja tanpa dipanggil. Rencana jahat Haman terbalik; bangsa Yahudi selamat. Kisah ini menunjukkan providensi Allah di balik keputusan manusia.",
    lessons: [
      "Posisi kita bisa jadi alat Allah untuk orang lain",
      "Keberanian sering dimulai dari \"jika aku binasa, biarlah aku binasa\"",
    ],
    keyPassages: [
      p("Ester 4:14", "Ester 4", 14),
      p("Ester 4:16", "Ester 4", 16),
      p("Ester 8:16", "Ester 8", 16),
    ],
    relatedCharacterSlugs: ["ester"],
  },
  {
    slug: "yunus",
    title: "Yunus & ikan besar",
    summary: "Yunus lari dari panggilan, tetapi Allah mengarahkannya kembali ke Ninewe.",
    category: "prophets",
    era: "pl",
    keywords: ["yunus", "ninewe", "ikan", "tobat", "anugerah"],
    narrative:
      "Allah memanggil Yunus memberitakan kepada Ninewe. Ia melarikan diri ke Tarsis, dibuang ke laut, ditelan ikan besar. Dari perut ikan ia berdoa dan disembuhkan.\n\nIa akhirnya memberitakan; Ninewe bertobat. Yunus marah karena Allah belas kasihan — kisah ini mengungkap hati manusia yang sempit dan anugerah Allah yang luas.",
    lessons: [
      "Tidak ada tempat lari dari panggilan Allah",
      "Allah peduli pada bangsa yang jauh dari-Nya",
    ],
    keyPassages: [
      p("Yunus 1:3", "Yunus 1", 3),
      p("Yunus 2:2", "Yunus 2", 2),
      p("Yunus 3:10", "Yunus 3", 10),
    ],
    relatedCharacterSlugs: ["yunus"],
  },
  {
    slug: "kelahiran-yesus",
    title: "Kelahiran Yesus",
    summary: "Allah menjadi manusia — Yesus lahir di Betlehem, Emmanuel, Allah beserta kita.",
    category: "gospel",
    era: "pb",
    keywords: ["yesus", "betlehem", "maria", "natal", "inkarnasi"],
    featured: true,
    narrative:
      "Malaikat memberitakan kepada Maria: Anak Suci akan lahir. Yusuf dan Maria pergi ke Betlehem; tidak ada tempat di penginapan. Anak itu lahir, dibungkus kain, dan dibaringkan di palungan.\n\nGembala datang mendengar kabar; Majus dari Timur membawa persembahan. \"Allah beserta kita\" — inkarnasi adalah pusat kisah keselamatan.",
    lessons: [
      "Allah dekat — Ia datang ke dunia kita",
      "Kerendahan hati adalah cara Allah menyatakan kemuliaan-Nya",
    ],
    keyPassages: [
      p("Lukas 2:11", "Lukas 2", 11),
      p("Matius 1:23", "Matius 1", 23),
      p("Yohanes 1:14", "Yohanes 1", 14),
    ],
    relatedCharacterSlugs: ["maria", "yusuf-suami-maria"],
    relatedPlaceSlugs: ["betlehem"],
  },
  {
    slug: "khotbah-bukit",
    title: "Khotbah di Bukit",
    summary: "Yesus mengajarkan kerajaan surga — Beatitudes dan etika Injil.",
    category: "gospel",
    era: "pb",
    keywords: ["khotbah", "beatitudes", "murmidi", "kerajaan", "yesus"],
    narrative:
      "Yesus duduk di bukit; murid-murid dan orang banyak mendengar. Ia membuka dengan Beatitudes — berbahagialah yang miskin di hadapan Allah, yang lemah lembut, yang lapar dan haus akan kebenaran.\n\nKhotbah ini membalikkan logika dunia: kerajaan surga punya nilai yang berbeda. Murid dipanggil menjadi garam dan terang, mengasihi musuh, dan berdoa \"Bapa kami.\"",
    lessons: [
      "Kerajaan Allah membalikkan prioritas dunia",
      "Murid dipanggil hidup berbeda — garam dan terang",
    ],
    keyPassages: [
      p("Matius 5:3", "Matius 5", 3),
      p("Matius 5:14", "Matius 5", 14),
      p("Matius 6:9", "Matius 6", 9),
    ],
  },
  {
    slug: "anak-hilang",
    title: "Anak yang hilang",
    summary: "Perumpamaan tentang anak yang boros dan kasih Bapa yang menerima kembali.",
    category: "gospel",
    era: "pb",
    keywords: ["perumpamaan", "anak", "boros", "pengampunan", "bapa"],
    narrative:
      "Seorang anak meminta bagian warisan lalu pergi jauh dan menghamburkan harta. Dalam kelaparan ia kembali ke ayahnya, siap menjadi hamba. Tetapi ayah berlari menyambut, memakaikan jubah terbaik, dan mengadakan pesta.\n\n\"Anakku ini mati, tetapi hidup kembali.\" Perumpamaan ini menggambarkan anugerah Allah yang menerima orang berdosa yang bertobat — bukan karena layak, melainkan karena kasih.",
    lessons: [
      "Allah menerima kita kembali sebelum kita \"layak\"",
      "Pertobatan sejati dimulai dari kerendahan hati",
    ],
    keyPassages: [
      p("Lukas 15:20", "Lukas 15", 20),
      p("Lukas 15:24", "Lukas 15", 24),
    ],
  },
  {
    slug: "salib-kebangkitan",
    title: "Salib & kebangkitan",
    summary: "Yesus mati untuk dosa kita dan bangkit — kemenangan atas maut.",
    category: "gospel",
    era: "pb",
    keywords: ["salib", "golgota", "kebangkitan", "paskah", "keselamatan"],
    featured: true,
    narrative:
      "Yesus ditangkap, diadili, dicambuk, dan disalibkan di Golgota. \"Sudahlah!\" — darah-Nya ditumpahkan sebagai tebusan. Tubuh-Nya dibaringkan di kubur.\n\nPada hari ketiga kubur kosong; malaikat memberitakan: \"Ia telah bangkit!\" Kemenangan Kristus atas dosa dan maut adalah pusat iman Kristen. Injil berdiri atau jatuh di sini.",
    lessons: [
      "Keselamatan adalah anugerah, bukan prestasi manusia",
      "Kebangkitan memberi harapan hidup kekal",
    ],
    keyPassages: [
      p("Yohanes 19:30", "Yohanes 19", 30),
      p("1 Korintus 15:3–4", "1 Korintus 15", 3),
      p("Markus 16:6", "Markus 16", 6),
    ],
    relatedPlaceSlugs: ["yerusalem"],
  },
  {
    slug: "pentakosta",
    title: "Pentakosta",
    summary: "Roh Kudus turun; jemaat lahir dan Injil berkobar dari Yerusalem.",
    category: "church",
    era: "pb",
    keywords: ["pentakosta", "roh kudus", "gereja", "petrus", "misí"],
    featured: true,
    narrative:
      "Murid-murid berkumpul di Yerusalem. Angin kencang, lidah api, dan mereka berkata-kata dalam bahasa lain. Petrus berkhotbah: \"Baru-baru ini Yesus disalibkan… tetapi Allah membangkitkan-Nya.\"\n\nTiga ribu orang percaya. Jemaat mula-mula berbagi, berdoa, dan memberitakan. Pentakosta adalah kelahiran gereja dan bukti bahwa kuasa kebangkitan Kristus terus bekerja.",
    lessons: [
      "Roh Kudus memberi kuasa untuk menjadi saksi",
      "Gereja lahir dari karya Allah, bukan rencana manusia semata",
    ],
    keyPassages: [
      p("Kisah Para Rasul 2:4", "Kisah Para Rasul 2", 4),
      p("Kisah Para Rasul 2:38", "Kisah Para Rasul 2", 38),
      p("Kisah Para Rasul 2:41", "Kisah Para Rasul 2", 41),
    ],
    relatedCharacterSlugs: ["petrus"],
    relatedPlaceSlugs: ["yerusalem"],
  },
  {
    slug: "paulus-damaskus",
    title: "Paulus di jalan Damaskus",
    summary: "Saulus, pengejar jemaat, bertemu Kristus yang bangkit dan hidupnya berubah.",
    category: "church",
    era: "pb",
    keywords: ["paulus", "saulus", "damaskus", "pertobatan", "panggilan"],
    narrative:
      "Saulus dengan surat penangkapan menuju Damaskus untuk menindas pengikut Yesus. Tiba-tiba cahaya dari langit; suara: \"Saulus, Saulus, mengapa engkau mengejar Aku?\"\n\nIa buta tiga hari, lalu Ananias datang. Saulus bangkit, dibaptis, dan mulai memberitakan Yesus yang dulu ia aniaya. Pertobatan radikal ini membuka jalan misi kepada bangsa-bangsa.",
    lessons: [
      "Allah dapat mengubah musuh menjadi pemberita",
      "Pertobatan sejati mengubah arah hidup, bukan sekadar emosi",
    ],
    keyPassages: [
      p("Kisah Para Rasul 9:4", "Kisah Para Rasul 9", 4),
      p("Kisah Para Rasul 9:17", "Kisah Para Rasul 9", 17),
      p("Kisah Para Rasul 9:20", "Kisah Para Rasul 9", 20),
    ],
    relatedCharacterSlugs: ["paulus"],
  },
] as BibleStory[]).map(applyStoryDepth);

export const BIBLE_STORIES: BibleStory[] = BASE_BIBLE_STORIES;

export function getStoryCategory(id: BibleStoryCategoryId) {
  return (
    BIBLE_STORY_CATEGORIES.find((item) => item.id === id) ??
    BIBLE_STORY_CATEGORIES[0]!
  );
}

export function getBibleStory(slug: string) {
  return BIBLE_STORIES.find((item) => item.slug === slug) ?? null;
}

export function getFeaturedStories() {
  return BIBLE_STORIES.filter((item) => item.featured);
}

export function getStoryCount() {
  return BIBLE_STORIES.length;
}

export function searchBibleStories(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...BIBLE_STORIES].sort((a, b) =>
      a.title.localeCompare(b.title, "id"),
    );
  }
  return BIBLE_STORIES.filter((item) => {
    const haystack = [
      item.title,
      item.summary,
      item.background ?? "",
      item.narrative,
      item.reflection ?? "",
      item.prayer ?? "",
      item.slug,
      item.era,
      ...(item.lessons ?? []),
      ...(item.keyMoments ?? []).flatMap((moment) => [
        moment.title,
        moment.summary,
        moment.reference ?? "",
      ]),
      ...item.keywords,
      getStoryCategory(item.category).label,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  }).sort((a, b) => a.title.localeCompare(b.title, "id"));
}

export function storyPassageHref(passage: BibleStoryPassage) {
  const params = new URLSearchParams();
  params.set("browse", "1");
  params.set("passage", passage.passage);
  if (passage.verse) params.set("verse", String(passage.verse));
  return `/baca?${params.toString()}`;
}

export function storyEraLabel(era: "pl" | "pb") {
  return era === "pl" ? "Perjanjian Lama" : "Perjanjian Baru";
}
