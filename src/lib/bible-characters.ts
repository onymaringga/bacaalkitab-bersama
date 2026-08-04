/**
 * Katalog tokoh Alkitab — kisah, latar, momen kunci, pelajaran, dan ayat.
 */

import {
  EXTRA_BIBLE_CHARACTERS,
  applyCharacterProfileDepth,
} from "@/lib/bible-character-profiles";
import {
  matchesCharacterFilters,
  type CharacterFilterState,
} from "@/lib/bible-character-meta";

export type BibleCharacterCategoryId =
  | "patriarkh"
  | "nabi"
  | "raja"
  | "murid"
  | "perempuan"
  | "lainnya";

export type BibleCharacterEra = "pl" | "pb";

export type BibleCharacterVerse = {
  reference: string;
  passage: string;
  verse?: number;
  text: string;
};

export type BibleCharacterMoment = {
  title: string;
  summary: string;
  reference?: string;
  passage?: string;
  verse?: number;
};

export type BibleCharacter = {
  slug: string;
  name: string;
  alsoCalled?: string[];
  category: BibleCharacterCategoryId;
  era: BibleCharacterEra;
  /** Peran singkat, mis. "Bapa iman" */
  role: string;
  /** Satu kalimat ringkas */
  summary: string;
  /** Latar hidup & konteks zaman (opsional, mendalam) */
  background?: string;
  /** Kisah & penjelasan (beberapa paragraf, dipisah \\n\\n) */
  story: string;
  /** Momen penting dalam kisah tokoh */
  keyMoments?: BibleCharacterMoment[];
  /** Pelajaran praktis singkat */
  lessons?: string[];
  /** Renungan mendalam */
  reflection?: string;
  /** Doa singkat */
  prayer?: string;
  /** Beberapa ayat kunci */
  verses?: BibleCharacterVerse[];
  /** Ayat utama (kompatibel; jika kosong pakai verses[0]) */
  verse?: BibleCharacterVerse;
  /** Tokoh terkait (slug) */
  relatedSlugs?: string[];
  keywords: string[];
  featured?: boolean;
};

export type BibleCharacterCategory = {
  id: BibleCharacterCategoryId;
  label: string;
  description: string;
};

export const BIBLE_CHARACTER_CATEGORIES: BibleCharacterCategory[] = [
  {
    id: "patriarkh",
    label: "Patriarkh",
    description: "Bapa leluhur dan keluarga perjanjian",
  },
  {
    id: "nabi",
    label: "Nabi",
    description: "Penyambung suara Allah kepada umat",
  },
  {
    id: "raja",
    label: "Raja & pemimpin",
    description: "Raja, hakim, dan pemimpin bangsa",
  },
  {
    id: "murid",
    label: "Murid & rasul",
    description: "Pengikut Yesus dan pembangun jemaat",
  },
  {
    id: "perempuan",
    label: "Tokoh perempuan",
    description: "Perempuan yang berperan penting dalam kisah",
  },
  {
    id: "lainnya",
    label: "Lainnya",
    description: "Tokoh penting di luar kategori di atas",
  },
];

const BASE_BIBLE_CHARACTERS: BibleCharacter[] = [
  {
    slug: "abraham",
    name: "Abraham",
    alsoCalled: ["Abram", "bapa iman"],
    category: "patriarkh",
    era: "pl",
    role: "Bapa iman & perjanjian",
    summary:
      "Dipanggil meninggalkan tanah kelahirannya dan percaya janji Allah — menjadi bapa banyak bangsa.",
    story:
      "Allah memanggil Abram keluar dari Ur dan menjanjikan tanah, keturunan, dan berkat bagi segala bangsa. Ia percaya meski usia sudah tua dan Sara mandul — iman itu diperhitungkan sebagai kebenaran.\n\nNamanya diganti menjadi Abraham (“bapa banyak orang”). Kisahnya mengajarkan bahwa perjalanan iman sering dimulai dengan langkah yang belum jelas ujungnya, tetapi dipimpin janji Allah.",
    lessons: [
      "Iman berarti melangkah meski belum melihat seluruh hasilnya",
      "Janji Allah lebih besar dari keterbatasan kita",
    ],
    keywords: ["iman", "perjanjian", "janji", "keturunan"],
    featured: true,
    verse: {
      reference: "Kejadian 12:1",
      passage: "Kejadian 12",
      verse: 1,
      text: "Berfirmanlah TUHAN kepada Abram: “Pergilah dari negerimu dan dari sanak saudaramu dan dari rumah bapamu ini ke negeri yang akan Kutunjukkan kepadamu.”",
    },
  },
  {
    slug: "sara",
    name: "Sara",
    alsoCalled: ["Sarai"],
    category: "perempuan",
    era: "pl",
    role: "Istri Abraham · ibu Ishak",
    summary:
      "Istri Abraham yang mula-mula mandul, lalu melahirkan Ishak menurut janji Allah di usia tua.",
    story:
      "Sara menunggu lama tanpa anak. Ia pernah mencoba jalan sendiri lewat Hagar, tetapi Allah menegaskan janji-Nya tetap berlaku. Pada usia yang mustahil secara manusia, ia melahirkan Ishak.\n\nNamanya diganti dari Sarai menjadi Sara (“putri” / “nyonya”). Kisahnya mengingatkan bahwa janji Allah tidak gagal meski waktu terasa terlambat.",
    lessons: [
      "Menunggu janji Allah bisa panjang, tapi tidak sia-sia",
      "Solusi manusiawi sering menambah luka — percaya lebih aman",
    ],
    keywords: ["janji", "kesabaran", "Ishak", "keluarga"],
    featured: true,
    verse: {
      reference: "Kejadian 21:1-2",
      passage: "Kejadian 21",
      verse: 1,
      text: "TUHAN memperhatikan Sara, seperti yang difirmankan-Nya, dan TUHAN melakukan kepada Sara seperti yang dijanjikan-Nya.",
    },
  },
  {
    slug: "ishak",
    name: "Ishak",
    category: "patriarkh",
    era: "pl",
    role: "Anak perjanjian Abraham",
    summary:
      "Anak yang dijanjikan kepada Abraham dan Sara; menjadi penghubung perjanjian ke Yakub.",
    story:
      "Ishak lahir sebagai penggenapan janji. Ia juga tokoh dalam kisah pengikatan di Gunung Moria — gambaran ketaatan Abraham dan pemeliharaan Allah yang menyediakan pengganti.\n\nIa menikah dengan Ribka dan menjadi ayah Esau serta Yakub. Hidupnya relatif lebih tenang dibanding ayah dan anaknya, tetapi tetap menjadi mata rantai penting perjanjian.",
    lessons: [
      "Allah menyediakan jalan di saat yang mustahil",
      "Perjanjian Allah dilanjutkan lintas generasi",
    ],
    keywords: ["janji", "Moria", "Ribka", "perjanjian"],
    verse: {
      reference: "Kejadian 22:14",
      passage: "Kejadian 22",
      verse: 14,
      text: "Dan Abraham menamai tempat itu: “TUHAN menyediakan”; sebab itu orang berkata sampai sekarang: “Di atas gunung TUHAN, akan disediakan.”",
    },
  },
  {
    slug: "yakub",
    name: "Yakub",
    alsoCalled: ["Israel"],
    category: "patriarkh",
    era: "pl",
    role: "Bapa dua belas suku Israel",
    summary:
      "Anak Ishak yang bergumul dengan Allah; namanya diganti menjadi Israel — bapa dua belas suku.",
    story:
      "Yakub lahir memegang tumit Esau dan hidup dengan tipu daya: mengambil hak kesulungan dan berkat ayahnya. Ia melarikan diri, bekerja pada Laban, lalu kembali dengan keluarga besar.\n\nDi Peniel ia bergulat dengan Allah dan diberi nama Israel. Kisahnya menunjukkan bahwa Allah dapat membentuk orang yang penuh cacat menjadi saluran berkat — bukan karena mereka sempurna, melainkan karena anugerah.",
    lessons: [
      "Allah dapat mengubah penipu menjadi orang yang diberkati",
      "Pergumulan dengan Allah sering mendahului pembaruan identitas",
    ],
    keywords: ["Israel", "duabelas suku", "Peniel", "Esau"],
    featured: true,
    verse: {
      reference: "Kejadian 32:28",
      passage: "Kejadian 32",
      verse: 28,
      text: "Lalu firman-Nya: “Namamu bukan lagi Yakub, melainkan Israel, sebab engkau telah bergumul melawan Allah dan manusia, dan engkau menang.”",
    },
  },
  {
    slug: "yusuf",
    name: "Yusuf",
    category: "patriarkh",
    era: "pl",
    role: "Anak Yakub · pemimpin di Mesir",
    summary:
      "Dijual saudara-saudaranya sebagai budak, lalu diangkat Allah menjadi penyelamat keluarga di masa kelaparan.",
    story:
      "Yusuf digambarkan sebagai anak kesayangan yang mendapat mimpi besar. Saudara-saudaranya iri dan menjualnya ke Mesir. Di sana ia mengalami tuduhan palsu dan penjara, tetapi Allah menyertainya.\n\nAkhirnya ia menjadi pejabat tinggi yang menyimpan gandum bagi banyak bangsa. Saat berjumpa saudara-saudaranya, ia melihat tangan Allah di balik kejahatan manusia: “Kamu memang bermaksud jahat… tetapi Allah bermaksud baik.”",
    lessons: [
      "Allah dapat memutar kejahatan menjadi kebaikan",
      "Pengampunan memutus siklus dendam",
    ],
    keywords: ["Mesir", "pengampunan", "mimpi", "kelaparan"],
    featured: true,
    verse: {
      reference: "Kejadian 50:20",
      passage: "Kejadian 50",
      verse: 20,
      text: "Memang kamu telah mereka-rekakan yang jahat terhadap aku, tetapi Allah telah mereka-rekakannya untuk kebaikan…",
    },
  },
  {
    slug: "musa",
    name: "Musa",
    category: "nabi",
    era: "pl",
    role: "Pemimpin keluaran · pemberi Taurat",
    summary:
      "Dipakai Allah memimpin Israel keluar dari perbudakan Mesir dan menyampaikan hukum Taurat.",
    story:
      "Musa dibesarkan di istana Firaun, lalu melarikan diri setelah membunuh orang Mesir. Di semak yang menyala Allah memanggilnya kembali ke Mesir — meski Musa merasa tidak layak dan gagap bicara.\n\nMelalui tulah, Paskah, dan pembukaan Laut Teberau, umat dibebaskan. Di Sinai ia menerima Sepuluh Firman. Musa menjadi gambar pemimpin yang dekat dengan Allah, namun tetap manusia: marah, lelah, dan tidak masuk Tanah Perjanjian.",
    lessons: [
      "Allah memakai orang yang merasa tidak cukup",
      "Pemimpin yang baik membawa orang kepada Allah, bukan ke dirinya",
    ],
    keywords: ["Keluaran", "Taurat", "Sinai", "Paskah"],
    featured: true,
    verse: {
      reference: "Keluaran 3:14",
      passage: "Keluaran 3",
      verse: 14,
      text: "Firman Allah kepada Musa: “AKU ADALAH AKU.” Lagi firman-Nya: “Beginilah kaukatakan kepada orang Israel itu: AKULAH AKU telah mengutus aku kepadamu.”",
    },
  },
  {
    slug: "aaron",
    name: "Aaron",
    category: "lainnya",
    era: "pl",
    role: "Imam besar pertama",
    summary:
      "Saudara Musa yang menjadi juru bicara dan imam besar pertama Israel.",
    story:
      "Aaron mendampingi Musa menghadapi Firaun dan kemudian dilantik sebagai imam. Ia menjadi pengantara ritual antara Allah dan umat.\n\nNamun kisah anak lembu emas mengingatkan bahwa bahkan pemimpin rohani bisa goyah di bawah tekanan massa. Allah tetap memulihkan pelayanannya — anugerah dan tanggung jawab berjalan bersama.",
    lessons: [
      "Pelayanan imam adalah tentang mendekatkan umat kepada Allah",
      "Tekanan orang banyak bisa menggoda pemimpin berkompromi",
    ],
    keywords: ["imam", "Keluaran", "lembu emas"],
    verse: {
      reference: "Keluaran 28:1",
      passage: "Keluaran 28",
      verse: 1,
      text: "Engkau harus menyuruh abangmu Harun bersama-sama dengan anak-anaknya datang kepadamu… supaya mereka memegang jabatan imam bagi-Ku.",
    },
  },
  {
    slug: "yosua",
    name: "Yosua",
    category: "raja",
    era: "pl",
    role: "Penerus Musa · penakluk Kanaan",
    summary:
      "Asisten Musa yang memimpin Israel memasuki dan merebut Tanah Perjanjian.",
    story:
      "Yosua belajar kepemimpinan di sisi Musa, termasuk saat mengintai Kanaan. Setelah Musa wafat, Allah menegaskannya: “Kuatkan dan teguhkan hatimu.”\n\nDi bawah kepemimpinannya, Yerikho runtuh dan tanah dibagi kepada suku-suku. Yosua menutup hidupnya dengan seruan pilihan: “Pilihlah pada hari ini kepada siapa kamu akan beribadah… tetapi aku dan seisi rumahku, kami akan beribadah kepada TUHAN.”",
    lessons: [
      "Keberanian lahir dari janji Allah, bukan dari rasa percaya diri semata",
      "Kepemimpinan dilanjutkan lintas generasi dengan kesetiaan",
    ],
    keywords: ["Kanaan", "Yerikho", "keberanian", "pilihan"],
    featured: true,
    verse: {
      reference: "Yosua 1:9",
      passage: "Yosua 1",
      verse: 9,
      text: "Bukankah telah Kuperintahkan kepadamu: kuatkan dan teguhkanlah hatimu? Janganlah kecut dan tawar hati, sebab TUHAN, Allahmu, menyertai engkau, ke mana saja engkau pergi.”",
    },
  },
  {
    slug: "debora",
    name: "Debora",
    category: "perempuan",
    era: "pl",
    role: "Hakim & nabi perempuan",
    summary:
      "Hakim dan nabi yang memimpin Israel pada masa kekacauan — bersama Barak mengalahkan Sisera.",
    story:
      "Di zaman Hakim-hakim, Israel sering jatuh ke dalam siklus dosa dan penindasan. Debora menjadi pemimpin yang mendengar Allah dan memanggil Barak berperang.\n\nNyanyian Debora merayakan kemenangan Allah. Kisahnya menunjukkan bahwa Allah memakai perempuan maupun laki-laki untuk memimpin dan membebaskan umat-Nya.",
    lessons: [
      "Kepemimpinan rohani bukan soal gender, melainkan panggilan dan ketaatan",
      "Keberanian menular — satu orang yang taat bisa menggerakkan banyak orang",
    ],
    keywords: ["hakim", "Barak", "Sisera", "kepemimpinan"],
    featured: true,
    verse: {
      reference: "Hakim-hakim 4:4",
      passage: "Hakim-hakim 4",
      verse: 4,
      text: "Pada waktu itu Debora, seorang nabiah, istri Lapidot, memerintah sebagai hakim atas orang Israel.",
    },
  },
  {
    slug: "gideon",
    name: "Gideon",
    category: "raja",
    era: "pl",
    role: "Hakim yang takut menjadi berani",
    summary:
      "Hakim yang awalnya takut, lalu memimpin 300 orang mengalahkan Midian atas kuasa Allah.",
    story:
      "Gideon sedang mengirik gandum di tempat tersembunyi saat malaikat menyapanya sebagai “pahlawan yang gagah perkasa”. Ia merasa paling kecil di keluarganya yang paling lemah.\n\nAllah mengurangi pasukannya hingga 300 orang supaya jelas: kemenangan dari Tuhan, bukan dari jumlah. Kisah Gideon menghibur orang yang merasa tidak cukup — Allah cukup.",
    lessons: [
      "Allah melihat potensi yang belum kita lihat",
      "Kemenangan rohani tidak selalu lewat kekuatan yang kelihatan",
    ],
    keywords: ["Midian", "300", "takut", "hakim"],
    verse: {
      reference: "Hakim-hakim 6:12",
      passage: "Hakim-hakim 6",
      verse: 12,
      text: "Malaikat TUHAN menampakkan diri kepadanya dan berfirman kepadanya: “TUHAN menyertai engkau, ya pahlawan yang gagah perkasa.”",
    },
  },
  {
    slug: "rut",
    name: "Rut",
    category: "perempuan",
    era: "pl",
    role: "Orang Moab · nenek moyang Daud",
    summary:
      "Janda Moab yang setia menyertai Naomi dan menjadi bagian garis keturunan Mesias.",
    story:
      "Setelah suami meninggal, Rut memilih tetap bersama mertuanya Naomi: “Bangsamu bangsaku, Allahmu Allahku.” Di Betlehem ia bekerja di ladang Boas dan akhirnya menikah dengannya sebagai penebus keluarga.\n\nRut — orang asing — masuk dalam silsilah Daud dan Yesus. Kisahnya merayakan kesetiaan, kebaikan, dan inklusi anugerah Allah.",
    lessons: [
      "Kesetiaan sehari-hari bisa mengubah sejarah keluarga",
      "Allah menyambut orang “luar” ke dalam rencana-Nya",
    ],
    keywords: ["Naomi", "Boas", "kesetiaan", "Moab"],
    featured: true,
    verse: {
      reference: "Rut 1:16",
      passage: "Rut 1",
      verse: 16,
      text: "Janganlah desak aku meninggalkan engkau… sebab ke mana engkau pergi, ke situ jugalah aku pergi… bangsamu bangsaku dan Allahmu Allahku.",
    },
  },
  {
    slug: "samuel",
    name: "Samuel",
    category: "nabi",
    era: "pl",
    role: "Nabi · hakim terakhir · pengurap raja",
    summary:
      "Nabi yang mendengar suara Allah sejak kecil; mengurapi Saul lalu Daud sebagai raja.",
    story:
      "Samuel lahir sebagai jawaban doa Hana dan dipersembahkan untuk melayani di rumah Tuhan. Saat masih anak, ia belajar berkata: “Berbicaralah, TUHAN, sebab hamba-Mu ini mendengar.”\n\nIa menjadi jembatan dari zaman hakim ke zaman raja: mengurapi Saul, lalu Daud setelah Saul ditolak. Samuel dikenal sebagai nabi yang setia menyampaikan firman meski pahit.",
    lessons: [
      "Mendengar Allah lebih penting daripada sibuk melayani tanpa mendengar",
      "Kesetiaan pada firman lebih berharga daripada popularitas",
    ],
    keywords: ["Hana", "Saul", "Daud", "mendengar"],
    featured: true,
    verse: {
      reference: "1 Samuel 3:10",
      passage: "1 Samuel 3",
      verse: 10,
      text: "Datanglah TUHAN… dan memanggil seperti yang sudah-sudah: “Samuel! Samuel!” Maka jawab Samuel: “Berbicaralah, sebab hamba-Mu ini mendengar.”",
    },
  },
  {
    slug: "saul-raja",
    name: "Saul",
    alsoCalled: ["Raja Saul"],
    category: "raja",
    era: "pl",
    role: "Raja pertama Israel",
    summary:
      "Raja pertama yang dipilih Allah, lalu ditolak karena ketidaktaatan yang berulang.",
    story:
      "Saul awalnya rendah hati dan gagah. Namun seiring kekuasaan, ia mulai takut pada opini rakyat lebih daripada suara Allah — mempersembahkan korban sendiri, menyisakan jarahan, dan iri kepada Daud.\n\nKisahnya peringatan keras: bakat dan posisi tidak menggantikan ketaatan. “Pendengaran lebih baik dari pada korban sembelihan.”",
    lessons: [
      "Ketidaktaatan kecil yang diulang merusak panggilan besar",
      "Iri hati meracuni kepemimpinan",
    ],
    keywords: ["raja", "ketidaktaatan", "Daud", "iri"],
    verse: {
      reference: "1 Samuel 15:22",
      passage: "1 Samuel 15",
      verse: 22,
      text: "Apakah yang lebih berkenan kepada TUHAN: persembahan korban atau mendengarkan suara TUHAN? Sesungguhnya, mendengarkan lebih baik dari pada korban sembelihan…",
    },
  },
  {
    slug: "daud",
    name: "Daud",
    category: "raja",
    era: "pl",
    role: "Raja gembala · penulis Mazmur",
    summary:
      "Gembala yang diurapi menjadi raja; pejuang, pemazmur, dan manusia yang bertobat setelah jatuh.",
    story:
      "Daud dikenal mengalahkan Goliat dengan iman, bukan baju zirah. Ia diurapi Samuel, dianiaya Saul, lalu menjadi raja yang mempersatukan Israel dan membawa tabut ke Yerusalem.\n\nIa juga jatuh dalam dosa dengan Batsyeba, lalu dihadapkan Natan dan bertobat (Mazmur 51). Perjanjian dengan Daud menunjuk ke Raja Mesias. Daud digambarkan sebagai “manusia yang berkenan di hati Allah” — bukan tanpa dosa, tetapi dengan hati yang kembali.",
    lessons: [
      "Hati yang mengarah kepada Allah lebih berharga dari penampilan luar",
      "Pertobatan sejati mengakui dosa dan menerima pengampunan",
    ],
    keywords: ["Goliat", "Mazmur", "raja", "pertobatan"],
    featured: true,
    verse: {
      reference: "1 Samuel 16:7",
      passage: "1 Samuel 16",
      verse: 7,
      text: "Janganlah pandang rupa atau tinggi badannya… Sebab bukan yang dilihat manusia yang dilihat Allah; manusia melihat apa yang di depan mata, tetapi TUHAN melihat hati.”",
    },
  },
  {
    slug: "salomo",
    name: "Salomo",
    category: "raja",
    era: "pl",
    role: "Raja bijaksana · pembangun Bait Suci",
    summary:
      "Anak Daud yang meminta hikmat; membangun Bait Suci, tetapi kemudian terseret berhala.",
    story:
      "Salomo memulai dengan baik: meminta hati yang mendengar untuk memerintah umat. Allah memberi hikmat, kekayaan, dan damai. Ia membangun Bait Suci yang megah.\n\nNamun di masa tua, istri-istri asing menarik hatinya kepada allah lain. Amsal, Pengkhotbah, dan Kidung Agung terkait erat dengan tradisinya. Kisahnya mengingatkan: mulai baik tidak menjamin selesai baik tanpa menjaga hati.",
    lessons: [
      "Hikmat dimulai dari takut akan Tuhan",
      "Keberhasilan bisa menjadi jerat jika hati tidak dijaga",
    ],
    keywords: ["hikmat", "Bait Suci", "Amsal", "berhala"],
    verse: {
      reference: "1 Raja-raja 3:9",
      passage: "1 Raja-raja 3",
      verse: 9,
      text: "Maka berikanlah kepada hamba-Mu ini hati yang paham menimbang perkara untuk menghakimi umat-Mu…",
    },
  },
  {
    slug: "elias",
    name: "Elia",
    category: "nabi",
    era: "pl",
    role: "Nabi api · lawan Baal",
    summary:
      "Nabi yang berani menantang penyembahan Baal di Gunung Karmel dan mengalami kelelahan iman di padang gurun.",
    story:
      "Elia muncul di masa Ahab dan Izebel ketika Baal merajalela. Di Karmel ia berdoa dan api Tuhan turun — umat berseru: “TUHAN, Dialah Allah!”\n\nSetelah kemenangan besar, ia lari ketakutan dan ingin mati. Allah merawatnya dengan makanan, bisikan lembut, dan tugas baru. Elia mengingatkan bahwa bahkan nabi hebat bisa lelah — dan Allah merawat yang lelah.",
    lessons: [
      "Keberanian untuk kebenaran sering dilanjutkan dengan kelelahan — butuh pemulihan",
      "Allah hadir bukan hanya dalam gempa dan api, tetapi juga dalam bisikan lembut",
    ],
    keywords: ["Karmel", "Baal", "Ahab", "padang gurun"],
    featured: true,
    verse: {
      reference: "1 Raja-raja 18:39",
      passage: "1 Raja-raja 18",
      verse: 39,
      text: "Ketika seluruh bangsa itu melihat kejadian itu, sujudlah mereka serta berkata: “TUHAN, Dialah Allah! TUHAN, Dialah Allah!”",
    },
  },
  {
    slug: "elisa",
    name: "Elisa",
    category: "nabi",
    era: "pl",
    role: "Penerus Elia",
    summary:
      "Murid Elia yang menerima “dua bagian” roh; melayani dengan mukjizat belas kasihan.",
    story:
      "Elisa meninggalkan ladang saat Elia melempar jubah kepadanya. Ia meminta dua bagian roh Elia — bukan untuk prestise, melainkan untuk melanjutkan pelayanan.\n\nPelayanannya penuh belas kasihan: minyak janda, anak yang dihidupkan, Naaman yang disembuhkan. Elisa menunjukkan bahwa penerus bukan peniru — tetapi orang yang setia pada panggilan yang sama.",
    lessons: [
      "Estafet iman membutuhkan keputusan meninggalkan yang lama",
      "Kuasa Allah sering terlihat dalam belas kasihan sehari-hari",
    ],
    keywords: ["Elia", "jubah", "Naaman", "mukjizat"],
    verse: {
      reference: "2 Raja-raja 2:9",
      passage: "2 Raja-raja 2",
      verse: 9,
      text: "Ketika mereka sudah sampai di seberang, berkatalah Elia kepada Elisa: “Mintalah apa yang hendak kulakukan kepadamu…” Jawab Elisa: “Biarlah kiranya aku mendapat dua bagian dari rohmu.”",
    },
  },
  {
    slug: "yesaya",
    name: "Yesaya",
    category: "nabi",
    era: "pl",
    role: "Nabi penghiburan & Hamba Tuhan",
    summary:
      "Nabi yang melihat kekudusan Allah dan menubuatkan Immanuel serta Hamba yang menderita.",
    story:
      "Yesaya dipanggil dalam penglihatan bait: “Kudus, kudus, kuduslah TUHAN.” Ia mengakui kenajisan bibirnya, lalu diutus. Pesannya memuat penghakiman sekaligus penghiburan.\n\nKitabnya terkenal dengan nubuat Immanuel dan nyanyian Hamba Tuhan yang menanggung dosa banyak orang — dibaca gereja sebagai menunjuk kepada Kristus.",
    lessons: [
      "Melihat kekudusan Allah menghasilkan pertobatan dan pengutusan",
      "Penghiburan Allah datang setelah kejujuran tentang dosa",
    ],
    keywords: ["Immanuel", "Hamba Tuhan", "kudus", "nubuat"],
    featured: true,
    verse: {
      reference: "Yesaya 6:8",
      passage: "Yesaya 6",
      verse: 8,
      text: "Lalu aku mendengar suara Tuhan berkata: “Siapakah yang akan Kuutus, dan siapakah yang mau pergi untuk Aku?” Maka sahutku: “Ini aku, utuslah aku!”",
    },
  },
  {
    slug: "yeremia",
    name: "Yeremia",
    alsoCalled: ["nabi yang menangis"],
    category: "nabi",
    era: "pl",
    role: "Nabi sebelum pembuangan",
    summary:
      "Nabi yang dipanggil sejak dalam kandungan; menyampaikan peringatan sulit menjelang kejatuhan Yerusalem.",
    story:
      "Yeremia merasa terlalu muda, tetapi Allah menyentuh mulutnya. Ia memberitakan pertobatan di tengah perlawanan, kesepian, dan penderitaan.\n\nIa juga membawa janji perjanjian baru yang tertulis di hati. Kisahnya menguatkan orang yang taat meski pesan tidak populer.",
    lessons: [
      "Kesetiaan lebih penting daripada diterima orang banyak",
      "Allah membentuk hati baru, bukan sekadar aturan luar",
    ],
    keywords: ["pembuangan", "perjanjian baru", "Yerusalem"],
    verse: {
      reference: "Yeremia 1:5",
      passage: "Yeremia 1",
      verse: 5,
      text: "Sebelum Aku membentuk engkau dalam rahim ibumu, Aku telah mengenal engkau, dan sebelum engkau lahir… Aku telah menguduskan engkau…",
    },
  },
  {
    slug: "daniel",
    name: "Daniel",
    category: "nabi",
    era: "pl",
    role: "Nabi di pembuangan · setia di istana",
    summary:
      "Pemuda Yehuda yang setia di Babel; dikenal karena doa, hikmat, dan penglihatan akhir zaman.",
    story:
      "Daniel dibawa ke Babel namun menolak menajiskan diri. Allah memberi hikmat menafsir mimpi raja. Ia tetap berdoa meski ada larangan — lalu dilempar ke gua singa dan diselamatkan.\n\nHidupnya mengajarkan kesetiaan di tempat asing: tidak perlu kasar untuk tetap kudus, dan doa adalah napas orang percaya di bawah tekanan.",
    lessons: [
      "Kesetiaan kecil membentuk karakter untuk ujian besar",
      "Doa adalah keberanian yang tenang",
    ],
    keywords: ["Babel", "doa", "gua singa", "hikmat"],
    featured: true,
    verse: {
      reference: "Daniel 6:10",
      passage: "Daniel 6",
      verse: 10,
      text: "Ketika Daniel tahu, bahwa surat perintah itu telah dibuat… pergilah ia ke rumahnya… ia berlutut… dan berdoa serta memuji Allahnya…",
    },
  },
  {
    slug: "ester",
    name: "Ester",
    alsoCalled: ["Hadassa"],
    category: "perempuan",
    era: "pl",
    role: "Ratu yang menyelamatkan bangsanya",
    summary:
      "Gadis Yahudi yang menjadi ratu Persia dan berani berbicara demi keselamatan bangsanya.",
    story:
      "Ester diangkat menjadi ratu di istana Ahasyweros. Saat rencana pemusnahan orang Yahudi muncul, Mordekhai menantangnya: mungkin ia menjadi ratu “untuk saat yang seperti ini.”\n\nDengan puasa dan keberanian, Ester menghadap raja. Nama Allah tidak disebut eksplisit dalam kitab, tetapi pemeliharaan-Nya terasa di setiap “kebetulan.”",
    lessons: [
      "Posisi adalah kesempatan untuk melayani, bukan hanya kenyamanan",
      "Keberanian sering muncul setelah doa dan komunitas",
    ],
    keywords: ["Mordekhai", "Persia", "keberanian", "puasa"],
    featured: true,
    verse: {
      reference: "Ester 4:14",
      passage: "Ester 4",
      verse: 14,
      text: "Siapa tahu, mungkin justru untuk saat yang seperti ini engkau beroleh kedudukan sebagai ratu.”",
    },
  },
  {
    slug: "nehemia",
    name: "Nehemia",
    category: "raja",
    era: "pl",
    role: "Pembangun tembok Yerusalem",
    summary:
      "Pegawai istana yang menangis karena Yerusalem, lalu memimpin pembangunan tembok dengan doa dan kerja.",
    story:
      "Nehemia mendengar tembok Yerusalem runtuh dan berdoa lama sebelum bertindak. Ia meminta izin raja, lalu memimpin umat membangun sambil berjaga dari lawan.\n\nMotonya praktis: “Kami berdoa… dan memasang penjagaan.” Kepemimpinan Nehemia memadukan doa, perencanaan, dan kerja sama.",
    lessons: [
      "Kepedulian yang mendalam mendorong tindakan",
      "Doa dan kerja bukan lawan — keduanya saling menguatkan",
    ],
    keywords: ["tembok", "Yerusalem", "doa", "kepemimpinan"],
    verse: {
      reference: "Nehemia 2:17",
      passage: "Nehemia 2",
      verse: 17,
      text: "Kamu lihat kesusahan yang kita alami… Mari kita bangun kembali tembok Yerusalem…”",
    },
  },
  {
    slug: "maria",
    name: "Maria",
    alsoCalled: ["Maria ibu Yesus"],
    category: "perempuan",
    era: "pb",
    role: "Ibu Yesus",
    summary:
      "Gadis Nazaret yang menerima kabar kelahiran Mesias dengan iman: “Jadilah padaku menurut perkataan-Mu.”",
    story:
      "Maria menerima kabar dari malaikat Gabriel bahwa ia akan mengandung oleh Roh Kudus. Ia bertanya dengan rendah hati, lalu menyerahkan diri.\n\nNyanyian Magnificat memuji Allah yang meninggikan yang rendah. Maria menyimpan banyak perkara dalam hati, menyertai Yesus sampai salib, dan ada di antara murid yang berdoa sebelum Pentakosta.",
    lessons: [
      "Iman menjawab panggilan Allah dengan penyerahan",
      "Melayani Kristus bisa berarti menyimpan perkara dalam hati dan tetap setia",
    ],
    keywords: ["Inkarnasi", "Magnificat", "Nazaret", "iman"],
    featured: true,
    verse: {
      reference: "Lukas 1:38",
      passage: "Lukas 1",
      verse: 38,
      text: "Kata Maria: “Sesungguhnya aku ini adalah hamba Tuhan; jadilah padaku menurut perkataanmu itu.”",
    },
  },
  {
    slug: "yusuf-suami-maria",
    name: "Yusuf (suami Maria)",
    category: "lainnya",
    era: "pb",
    role: "Ayah angkat Yesus · orang benar",
    summary:
      "Tukang kayu yang adil; taat pada petunjuk Tuhan melindungi Maria dan Yesus.",
    story:
      "Yusuf bermaksud menceraikan Maria secara diam-diam saat mengetahui kehamilan yang membingungkan. Malaikat menjelaskan, dan ia mengambil Maria sebagai istri.\n\nIa membawa keluarga melarikan diri ke Mesir, lalu kembali ke Nazaret. Yusuf jarang berbicara dalam teks — tetapi ketaatannya melindungi Sang Mesias di masa paling rentan.",
    lessons: [
      "Keadilan yang lembut melindungi orang lain",
      "Ketaatan diam-diam bisa menyelamatkan banyak orang",
    ],
    keywords: ["Nazaret", "Mesir", "taat", "adil"],
    verse: {
      reference: "Matius 1:24",
      passage: "Matius 1",
      verse: 24,
      text: "Sesudah bangun dari tidurnya, Yusuf berbuat seperti yang diperintahkan malaikat Tuhan itu kepadanya…",
    },
  },
  {
    slug: "yohanes-pembaptis",
    name: "Yohanes Pembaptis",
    category: "nabi",
    era: "pb",
    role: "Perintis jalan Tuhan",
    summary:
      "Nabi yang mempersiapkan jalan bagi Yesus; memanggil orang bertobat dan menunjuk kepada Anak Domba Allah.",
    story:
      "Yohanes lahir secara ajaib dari Zakharia dan Elisabet. Di padang gurun ia memberitakan pertobatan dan membaptis di Sungai Yordan.\n\nKetika Yesus datang, ia berkata: “Lihatlah Anak Domba Allah.” Ia menegaskan: “Ia harus makin besar, tetapi aku harus makin kecil.” Pelayanannya berakhir di penjara dan kematian — namun misinya selesai: menunjuk kepada Kristus.",
    lessons: [
      "Pelayanan sejati mengarahkan orang kepada Yesus, bukan kepada diri",
      "Pertobatan adalah pintu masuk menyambut kerajaan Allah",
    ],
    keywords: ["pertobatan", "baptisan", "Anak Domba", "perintis"],
    featured: true,
    verse: {
      reference: "Yohanes 1:29",
      passage: "Yohanes 1",
      verse: 29,
      text: "Lihatlah Anak Domba Allah, yang menghapus dosa dunia.”",
    },
  },
  {
    slug: "petrus",
    name: "Petrus",
    alsoCalled: ["Simon Petrus", "Kefas"],
    category: "murid",
    era: "pb",
    role: "Murid · juru bicara · pemimpin jemaat mula-mula",
    summary:
      "Nelayan yang dipanggil Yesus; sering impulsif, pernah menyangkal, lalu dipulihkan menjadi gembala.",
    story:
      "Simon dipanggil meninggalkan jala dan diberi nama Petrus (“batu karang”). Ia mengakui Yesus sebagai Mesias, berjalan di atas air, lalu jatuh; di malam pengadilan ia menyangkal tiga kali.\n\nSetelah kebangkitan, Yesus memulihkannya: “Gembalakanlah domba-domba-Ku.” Di Pentakosta Petrus berkhotbah berani. Kisahnya adalah harapan bagi yang gagal — pemulihan dimungkinkan.",
    lessons: [
      "Kegagalan bukan akhir jika ada pertobatan dan pemulihan",
      "Keberanian sejati lahir setelah bertemu Tuhan yang bangkit",
    ],
    keywords: ["murid", "penyangkalan", "Pentakosta", "gembala"],
    featured: true,
    verse: {
      reference: "Matius 16:16",
      passage: "Matius 16",
      verse: 16,
      text: "Jawab Simon Petrus: “Engkau adalah Mesias, Anak Allah yang hidup!”",
    },
  },
  {
    slug: "yohanes-rasul",
    name: "Yohanes",
    alsoCalled: ["Yohanes anak Zebedeus", "murid yang dikasihi"],
    category: "murid",
    era: "pb",
    role: "Murid terkasih · penulis Injil",
    summary:
      "Murid yang dekat dengan Yesus; menulis tentang kasih dan identitas Anak Allah.",
    story:
      "Yohanes bersama Yakobus dipanggil dari perahu. Ia ada di lingkaran dalam: di gunung pemuliaan, di Getsemani, di kaki salib — tempat Yesus mempercayakan Maria kepadanya.\n\nInjil Yohanes, surat-surat, dan Wahyu terkait dengan tradisinya. Tekanannya: percaya kepada Anak, saling mengasihi, dan menantikan penggenapan akhir.",
    lessons: [
      "Kedekatan dengan Yesus membentuk cara kita melihat dunia",
      "Kasih adalah tanda murid yang sejati",
    ],
    keywords: ["kasih", "Injil Yohanes", "salib", "murid"],
    verse: {
      reference: "Yohanes 13:23",
      passage: "Yohanes 13",
      verse: 23,
      text: "Seorang di antara murid Yesus, yaitu murid yang dikasihi-Nya, bersandar dekat kepada-Nya…",
    },
  },
  {
    slug: "paulus",
    name: "Paulus",
    alsoCalled: ["Saulus", "rasul bangsa-bangsa"],
    category: "murid",
    era: "pb",
    role: "Rasul bagi bangsa-bangsa",
    summary:
      "Penganiaya jemaat yang diubah Kristus menjadi rasul dan penulis sebagian besar surat PB.",
    story:
      "Saulus adalah Farisi yang giat menganiaya pengikut Yesus. Di jalan ke Damsyik ia bertemu Kristus yang bangkit — hidupnya berbalik total.\n\nSebagai Paulus ia bermisi ke dunia non-Yahudi, menanam jemaat, dan menulis surat yang membentuk teologi anugerah, iman, dan tubuh Kristus. Ia menderita banyak, tetapi berkata: “Bagiku adalah Kristus.”",
    lessons: [
      "Tidak ada orang yang terlalu jauh untuk diubah anugerah",
      "Panggilan mengikuti perjumpaan dengan Kristus, bukan sekadar ambisi",
    ],
    keywords: ["Damsyik", "misi", "anugerah", "surat"],
    featured: true,
    verse: {
      reference: "Kisah Para Rasul 9:15",
      passage: "Kisah Para Rasul 9",
      verse: 15,
      text: "Sebab orang ini adalah alat yang Kupilih untuk memberitakan nama-Ku kepada bangsa-bangsa lain…",
    },
  },
  {
    slug: "barnabas",
    name: "Barnabas",
    alsoCalled: ["Yusuf Barnabas", "anak penghiburan"],
    category: "murid",
    era: "pb",
    role: "Penghibur · mentor Paulus",
    summary:
      "Murid yang menjual tanah untuk jemaat; mempercayai Paulus saat orang lain takut, dan membela Markus.",
    story:
      "Barnabas berarti “anak penghiburan”. Ia menjembatani Paulus dengan jemaat Yerusalem, lalu bersama-sama bermisi. Saat Paulus menolak Markus, Barnabas memilih memberi kesempatan kedua.\n\nIa tipikal pemimpin yang membangun orang lain — jarang mencari panggung, tetapi sangat dibutuhkan komunitas.",
    lessons: [
      "Penghiburan dan kepercayaan membuka jalan bagi banyak panggilan",
      "Memberi kesempatan kedua adalah bentuk kasih yang berani",
    ],
    keywords: ["penghiburan", "Paulus", "Markus", "misi"],
    verse: {
      reference: "Kisah Para Rasul 11:24",
      passage: "Kisah Para Rasul 11",
      verse: 24,
      text: "Sebab ia adalah orang baik, penuh dengan Roh Kudus dan iman…",
    },
  },
  {
    slug: "maria-magdalena",
    name: "Maria Magdalena",
    category: "perempuan",
    era: "pb",
    role: "Saksi kebangkitan",
    summary:
      "Pengikut Yesus yang dibebaskan dari roh jahat; menjadi saksi pertama kebangkitan.",
    story:
      "Maria Magdalena disebutkan sebagai orang yang disembuhkan Yesus dan kemudian menyertai pelayanan-Nya. Ia ada di dekat salib dan di kubur pagi Paskah.\n\nYesus menampakkan diri kepadanya lebih dulu dan mengutusnya memberitakan kebangkitan kepada murid-murid. Ia menjadi “rasul bagi para rasul” dalam kesaksian pagi itu.",
    lessons: [
      "Pemulihan mengarah kepada kesaksian",
      "Allah memilih saksi yang sering diremehkan dunia",
    ],
    keywords: ["kebangkitan", "Paskah", "saksi", "pemulihan"],
    featured: true,
    verse: {
      reference: "Yohanes 20:18",
      passage: "Yohanes 20",
      verse: 18,
      text: "Maria Magdalena pergi dan berkata kepada murid-murid: “Aku telah melihat Tuhan!”…",
    },
  },
  {
    slug: "stefanus",
    name: "Stefanus",
    category: "lainnya",
    era: "pb",
    role: "Diaken · martir pertama",
    summary:
      "Penuh Roh dan hikmat; diakon yang menjadi martir pertama jemaat, mengampuni saat dirajam.",
    story:
      "Stefanus dipilih melayani meja agar rasul fokus pada firman, tetapi ia juga berkhotbah dengan kuasa. Tuduhan palsu membawanya ke Sanhedrin.\n\nDalam khotbahnya ia menelusuri sejarah Israel dan menuding penolakan terhadap Yang Kudus. Saat dirajam, ia berdoa seperti Yesus: “Tuhan, janganlah tanggungkan dosa ini kepada mereka.” Saulus menyaksikan — benih yang kelak berbuah.",
    lessons: [
      "Kesaksian sejati bisa berharga mahal",
      "Pengampunan di tengah penderitaan meneladan Kristus",
    ],
    keywords: ["martir", "diaken", "pengampunan", "Sanhedrin"],
    verse: {
      reference: "Kisah Para Rasul 7:60",
      passage: "Kisah Para Rasul 7",
      verse: 60,
      text: "Berlututlah ia dan berseru dengan suara nyaring: “Tuhan, janganlah dosa ini ditanggungkan kepada mereka!”…",
    },
  },
  {
    slug: "timotius",
    name: "Timotius",
    category: "murid",
    era: "pb",
    role: "Anak rohani Paulus · gembala muda",
    summary:
      "Pemuda yang dididik iman oleh ibu dan neneknya; dipercaya Paulus menggembalakan jemaat.",
    story:
      "Timotius dikenal dari Listra; ibunya Yahudi yang percaya, ayahnya Yunani. Paulus melihat potensi dan mengajaknya bermisi.\n\nSurat 1–2 Timotius penuh nasihat pastoral: jangan malu akan Injil, pelihara karunia, ajar dengan sabar. Timotius adalah model generasi penerus yang dibentuk dalam komunitas dan keteladanan.",
    lessons: [
      "Iman di rumah tangga membentuk pejuang Injil",
      "Usia muda bukan alasan menunda panggilan yang setia",
    ],
    keywords: ["gembala", "Paulus", "generasi", "karunia"],
    verse: {
      reference: "1 Timotius 4:12",
      passage: "1 Timotius 4",
      verse: 12,
      text: "Jangan seorangpun menganggap engkau rendah karena engkau muda. Jadilah teladan…",
    },
  },
  {
    slug: "lidia",
    name: "Lidia",
    category: "perempuan",
    era: "pb",
    role: "Pedagang · tuan rumah jemaat",
    summary:
      "Penjual kain ungu di Filipi yang hatinya dibuka Tuhan; rumahnya menjadi basis jemaat.",
    story:
      "Lidia mendengar pemberitaan Paulus di tepi sungai. Tuhan membuka hatinya; ia dibaptis beserta seisi rumahnya, lalu mendesak para rasul menumpang di rumahnya.\n\nIa contoh orang percaya yang memakai sumber daya dan rumah untuk Injil — hospitality sebagai pelayanan.",
    lessons: [
      "Pertobatan membuka rumah bagi misi",
      "Pekerjaan sehari-hari bisa menjadi saluran berkat",
    ],
    keywords: ["Filipi", "baptisan", "keramahtamahan", "misi"],
    verse: {
      reference: "Kisah Para Rasul 16:14",
      passage: "Kisah Para Rasul 16",
      verse: 14,
      text: "Seorang dari perempuan-perempuan itu yang bernama Lidia… mendengarkan… dan Tuhan membuka hatinya…",
    },
  },
];

export const BIBLE_CHARACTERS: BibleCharacter[] = [
  ...BASE_BIBLE_CHARACTERS,
  ...EXTRA_BIBLE_CHARACTERS,
].map(applyCharacterProfileDepth);

export function getCharacterCategory(id: BibleCharacterCategoryId) {
  return (
    BIBLE_CHARACTER_CATEGORIES.find((item) => item.id === id) ??
    BIBLE_CHARACTER_CATEGORIES[0]!
  );
}

export function getBibleCharacter(slug: string) {
  return BIBLE_CHARACTERS.find((item) => item.slug === slug) ?? null;
}

export function getFeaturedCharacters() {
  return BIBLE_CHARACTERS.filter((item) => item.featured);
}

export function getCharacterCount() {
  return BIBLE_CHARACTERS.length;
}

export function getCharacterVerses(character: BibleCharacter): BibleCharacterVerse[] {
  if (character.verses && character.verses.length > 0) {
    return character.verses;
  }
  return character.verse ? [character.verse] : [];
}

export function searchBibleCharacters(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...BIBLE_CHARACTERS].sort((a, b) =>
      a.name.localeCompare(b.name, "id"),
    );
  }
  return BIBLE_CHARACTERS.filter((item) => {
    const haystack = [
      item.name,
      item.role,
      item.summary,
      item.background ?? "",
      item.story,
      item.reflection ?? "",
      item.prayer ?? "",
      item.slug,
      item.era,
      ...(item.alsoCalled ?? []),
      ...item.keywords,
      ...(item.lessons ?? []),
      ...(item.keyMoments ?? []).flatMap((moment) => [
        moment.title,
        moment.summary,
        moment.reference ?? "",
      ]),
      ...getCharacterVerses(item).flatMap((verse) => [
        verse.reference,
        verse.text,
      ]),
      getCharacterCategory(item.category).label,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  }).sort((a, b) => a.name.localeCompare(b.name, "id"));
}

export function filterAndSearchBibleCharacters(
  query: string,
  filters: CharacterFilterState,
) {
  return searchBibleCharacters(query).filter((item) =>
    matchesCharacterFilters(item.slug, filters),
  );
}

export function characterVerseHref(verse: BibleCharacterVerse) {
  const params = new URLSearchParams();
  params.set("browse", "1");
  params.set("passage", verse.passage);
  if (verse.verse) params.set("verse", String(verse.verse));
  return `/baca?${params.toString()}`;
}

export function characterIndexLetter(name: string) {
  const letter = name.trim().charAt(0).toLocaleUpperCase("id-ID");
  return /[A-ZÀ-ÖØ-Þ]/.test(letter) ? letter : "#";
}

export function characterEraLabel(era: BibleCharacterEra) {
  return era === "pl" ? "Perjanjian Lama" : "Perjanjian Baru";
}
