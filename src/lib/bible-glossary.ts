/**
 * Glosarium istilah Alkitab — kata yang jarang terdengar di percakapan sehari-hari.
 * Penjelasan singkat, bahasa awam, dengan ayat pintu masuk opsional.
 */

export type BibleGlossaryCategoryId =
  | "iman"
  | "ibadah"
  | "gelar"
  | "tempat"
  | "sejarah";

export type BibleGlossaryVerse = {
  reference: string;
  passage: string;
  verse?: number;
  text: string;
};

export type BibleGlossaryTerm = {
  slug: string;
  term: string;
  /** Ejaan / nama lain yang sering muncul */
  alsoCalled?: string[];
  category: BibleGlossaryCategoryId;
  /** Arti singkat satu kalimat */
  plainMeaning: string;
  /** Penjelasan lebih dalam (1–3 paragraf pendek) */
  explanation: string;
  keywords: string[];
  featured?: boolean;
  verse?: BibleGlossaryVerse;
};

export type BibleGlossaryCategory = {
  id: BibleGlossaryCategoryId;
  label: string;
  description: string;
};

export const BIBLE_GLOSSARY_CATEGORIES: BibleGlossaryCategory[] = [
  {
    id: "iman",
    label: "Iman & keselamatan",
    description: "Istilah tentang hubungan kita dengan Allah",
  },
  {
    id: "ibadah",
    label: "Ibadah & ritual",
    description: "Korban, sakramen, dan praktik umat",
  },
  {
    id: "gelar",
    label: "Gelar & tokoh",
    description: "Nama, jabatan, dan sebutan khusus",
  },
  {
    id: "tempat",
    label: "Tempat & benda",
    description: "Lokasi suci, bangunan, dan benda ibadah",
  },
  {
    id: "sejarah",
    label: "Sejarah & budaya",
    description: "Latar zaman, kelompok, dan adat",
  },
];

export const BIBLE_GLOSSARY: BibleGlossaryTerm[] = [
  {
    slug: "anugerah",
    term: "Anugerah",
    alsoCalled: ["kasih karunia", "grace"],
    category: "iman",
    plainMeaning:
      "Pemberian Allah yang tidak kita peroleh karena jasa, melainkan karena kasih-Nya.",
    explanation:
      "Dalam Alkitab, anugerah (sering juga disebut kasih karunia) menekankan bahwa keselamatan dan berkat Allah datang sebagai hadiah, bukan upah. Kita tidak “membeli” pengampunan dengan kebaikan sendiri.\n\nIstilah ini membantu membedakan usaha manusia dari inisiatif Allah yang lebih dulu mengasihi.",
    keywords: ["grace", "kasih karunia", "pemberian"],
    featured: true,
    verse: {
      reference: "Efesus 2:8",
      passage: "Efesus 2",
      verse: 8,
      text: "Sebab karena kasih karunia kamu diselamatkan oleh iman; itu bukan hasil usahamu, tetapi pemberian Allah.",
    },
  },
  {
    slug: "penebusan",
    term: "Penebusan",
    alsoCalled: ["penebus", "ditebus"],
    category: "iman",
    plainMeaning:
      "Tindakan Allah membebaskan manusia dari perbudakan dosa — seperti menebus budak dengan harga.",
    explanation:
      "Di dunia kuno, “menebus” berarti membayar agar seseorang dilepaskan dari utang atau perbudakan. Alkitab memakai gambaran itu untuk karya Kristus: Ia membayar harga supaya kita bebas.\n\nPenebusan menekankan pembebasan yang nyata, bukan sekadar nasihat moral.",
    keywords: ["redeem", "tebusan", "bebas"],
    featured: true,
    verse: {
      reference: "Efesus 1:7",
      passage: "Efesus 1",
      verse: 7,
      text: "Sebab di dalam Dia dan oleh darah-Nya kita beroleh penebusan, yaitu pengampunan pelanggaran.",
    },
  },
  {
    slug: "pendamaian",
    term: "Pendamaian",
    alsoCalled: ["rekonsiliasi", "diperdamaikan"],
    category: "iman",
    plainMeaning:
      "Pemulihan hubungan yang retak antara Allah dan manusia karena dosa.",
    explanation:
      "Dosa merusak hubungan. Pendamaian berarti permusuhan diakhiri dan persahabatan dipulihkan. Dalam Perjanjian Baru, Kristus menjadi jalan pendamaian itu.\n\nBukan Allah yang “dibujuk” manusia, melainkan Allah sendiri yang mengambil inisiatif mendamaikan.",
    keywords: ["reconcile", "damai", "hubungan"],
    featured: true,
    verse: {
      reference: "2 Korintus 5:18",
      passage: "2 Korintus 5",
      verse: 18,
      text: "Sebab semuanya itu dari Allah, yang dengan perantaraan Kristus telah mendamaikan kita dengan diri-Nya.",
    },
  },
  {
    slug: "pertobatan",
    term: "Pertobatan",
    alsoCalled: ["bertobat", "metanoia"],
    category: "iman",
    plainMeaning:
      "Berbalik arah: meninggalkan dosa dan menghadap Allah dengan hati yang berubah.",
    explanation:
      "Pertobatan bukan hanya merasa bersalah. Intinya adalah perubahan pikiran dan arah hidup — dari menjauh dari Allah menjadi menuju kepada-Nya.\n\nDalam bahasa Yunani Perjanjian Baru, kata yang sering dipakai menggambarkan “perubahan pikiran” yang membawa buah nyata.",
    keywords: ["bertobat", "balik", "tobat"],
    verse: {
      reference: "Kisah Para Rasul 3:19",
      passage: "Kisah Para Rasul 3",
      verse: 19,
      text: "Karena itu sadarlah dan bertobatlah, supaya dosamu dihapuskan.",
    },
  },
  {
    slug: "pembenaran",
    term: "Pembenaran",
    alsoCalled: ["dibenarkan", "justifikasi"],
    category: "iman",
    plainMeaning:
      "Status “benar” di hadapan Allah yang diberikan karena iman kepada Kristus, bukan karena daftar amal kita.",
    explanation:
      "Dalam pengadilan, orang bisa dinyatakan bersalah atau tidak bersalah. Pembenaran adalah pernyataan Allah bahwa orang percaya diterima sebagai benar karena Kristus.\n\nIni beda dari “membenarkan diri sendiri”. Kita tidak mengarang alasan; Allah memberikan status yang baru.",
    keywords: ["justified", "benar", "status"],
    featured: true,
    verse: {
      reference: "Roma 5:1",
      passage: "Roma 5",
      verse: 1,
      text: "Sebab itu, kita yang dibenarkan karena iman, kita hidup dalam damai sejahtera dengan Allah oleh karena Tuhan kita, Yesus Kristus.",
    },
  },
  {
    slug: "pengudusan",
    term: "Pengudusan",
    alsoCalled: ["dikuduskan", "kekudusan"],
    category: "iman",
    plainMeaning:
      "Proses dijadikan milik Allah dan dibentuk semakin menyerupai Kristus.",
    explanation:
      "Kudus berarti “dipisahkan untuk Allah”. Pengudusan mencakup status (sudah menjadi milik Tuhan) dan perjalanan (tumbuh dalam karakter).\n\nBukan kesempurnaan instan, melainkan kehidupan yang terus dibentuk oleh Roh Kudus.",
    keywords: ["sanctify", "kudus", "suci"],
    verse: {
      reference: "1 Tesalonika 4:3",
      passage: "1 Tesalonika 4",
      verse: 3,
      text: "Karena inilah kehendak Allah: pengudusanmu.",
    },
  },
  {
    slug: "perjanjian",
    term: "Perjanjian",
    alsoCalled: ["covenant", "perjanjian lama/baru"],
    category: "iman",
    plainMeaning:
      "Ikatan kesetiaan antara Allah dan umat-Nya, dengan janji dan tanggung jawab.",
    explanation:
      "Bukan sekadar “kontrak bisnis”. Perjanjian Alkitab adalah hubungan yang diikat Allah — Ia berjanji, dan umat dipanggil menaati.\n\nPerjanjian Lama dan Perjanjian Baru menamai dua era besar dalam kisah keselamatan, dengan puncak pada Kristus.",
    keywords: ["covenant", "janji", "ikatan"],
    featured: true,
    verse: {
      reference: "Yeremia 31:33",
      passage: "Yeremia 31",
      verse: 33,
      text: "Aku akan menaruh Taurat-Ku dalam batin mereka dan menuliskannya dalam hati mereka; maka Aku akan menjadi Allah mereka dan mereka akan menjadi umat-Ku.",
    },
  },
  {
    slug: "kerajaan-allah",
    term: "Kerajaan Allah",
    alsoCalled: ["Kerajaan Surga"],
    category: "iman",
    plainMeaning:
      "Pemerintahan Allah yang sudah mulai hadir dalam Yesus dan akan sempurna di akhir zaman.",
    explanation:
      "Bukan hanya “tempat di langit”. Kerajaan Allah berarti Allah merajai — di hati, di jemaat, dan suatu hari di seluruh ciptaan.\n\nYesus memberitakan bahwa kerajaan itu sudah dekat: hadir sekarang, dan belum sepenuhnya genap.",
    keywords: ["kingdom", "raja", "surga"],
    featured: true,
    verse: {
      reference: "Markus 1:15",
      passage: "Markus 1",
      verse: 15,
      text: "Waktunya telah genap; Kerajaan Allah sudah dekat. Bertobatlah dan percayalah kepada Injil!",
    },
  },
  {
    slug: "injil",
    term: "Injil",
    alsoCalled: ["kabar baik", "gospel"],
    category: "iman",
    plainMeaning:
      "Kabar baik tentang Yesus Kristus: kematian dan kebangkitan-Nya untuk menyelamatkan.",
    explanation:
      "Kata “injil” berarti kabar baik. Isinya bukan tip sukses, melainkan berita bahwa Allah menyelamatkan orang berdosa melalui Kristus.\n\nEmpat kitab pertama Perjanjian Baru disebut Injil karena menceritakan hidup, kematian, dan kebangkitan Yesus.",
    keywords: ["gospel", "kabar baik", "yesus"],
    verse: {
      reference: "Roma 1:16",
      passage: "Roma 1",
      verse: 16,
      text: "Sebab aku mempunyai keyakinan yang kokoh dalam Injil, karena Injil adalah kekuatan Allah yang menyelamatkan setiap orang yang percaya.",
    },
  },
  {
    slug: "mesias",
    term: "Mesias",
    alsoCalled: ["Kristus", "Yang Diurapi"],
    category: "gelar",
    plainMeaning:
      "Yang diurapi Allah — Raja/Penyelamat yang dinanti Israel, dipenuhi dalam Yesus.",
    explanation:
      "“Mesias” (Ibrani) dan “Kristus” (Yunani) artinya sama: yang diurapi. Di Israel, raja, imam, dan nabi diurapi sebagai tanda panggilan Allah.\n\nYesus diakui sebagai Mesias yang dinubuatkan — bukan hanya pemimpin politik, melainkan penyelamat.",
    keywords: ["christ", "diurapi", "raja"],
    featured: true,
    verse: {
      reference: "Yohanes 1:41",
      passage: "Yohanes 1",
      verse: 41,
      text: "Ia menemukan terlebih dahulu saudaranya sendiri, Simon, dan berkata kepadanya: “Kami telah menemukan Mesias.”",
    },
  },
  {
    slug: "anak-manusia",
    term: "Anak Manusia",
    category: "gelar",
    plainMeaning:
      "Gelar yang sering dipakai Yesus untuk diri-Nya — menekankan kemanusiaan-Nya dan otoritas surgawi.",
    explanation:
      "Di Daniel 7, “Anak Manusia” digambarkan datang dengan kuasa dari Allah. Yesus memakai gelar ini untuk menyatakan identitas-Nya tanpa langsung memicu salah paham politik.\n\nGelar ini menghubungkan kerendahan-Nya sebagai manusia dengan kemuliaan-Nya sebagai Hakim.",
    keywords: ["son of man", "yesus", "daniel"],
    verse: {
      reference: "Markus 10:45",
      passage: "Markus 10",
      verse: 45,
      text: "Karena Anak Manusia datang bukan untuk dilayani, melainkan untuk melayani dan untuk memberikan nyawa-Nya menjadi tebusan bagi banyak orang.",
    },
  },
  {
    slug: "anak-domba",
    term: "Anak Domba Allah",
    alsoCalled: ["Anak Domba"],
    category: "gelar",
    plainMeaning:
      "Sebutan untuk Yesus sebagai korban yang menghapus dosa — mirip domba Paskah.",
    explanation:
      "Di Israel, domba dikorbankan dalam ibadah dan pada Paskah. Yohanes Pembaptis menunjuk Yesus sebagai “Anak Domba Allah”.\n\nGambarannya: Ia menanggung dosa, bukan karena lemah, melainkan karena mengasihi sampai mati.",
    keywords: ["lamb", "korban", "paskah"],
    verse: {
      reference: "Yohanes 1:29",
      passage: "Yohanes 1",
      verse: 29,
      text: "Pada keesokan harinya Yohanes melihat Yesus datang kepadanya dan ia berkata: “Lihatlah Anak Domba Allah, yang menghapus dosa dunia.”",
    },
  },
  {
    slug: "rasul",
    term: "Rasul",
    alsoCalled: ["apostel"],
    category: "gelar",
    plainMeaning:
      "Utusan yang diutus dengan otoritas — khususnya dua belas murid Yesus dan Paulus.",
    explanation:
      "Rasul berarti “yang diutus”. Dalam Perjanjian Baru, para rasul adalah saksi kebangkitan yang diutus membangun jemaat dan mengajarkan Injil.\n\nBukan sekadar “tokoh populer”, melainkan orang yang diutus dengan pesan dan otoritas dari Kristus.",
    keywords: ["apostle", "utusan", "murid"],
    verse: {
      reference: "Efesus 2:20",
      passage: "Efesus 2",
      verse: 20,
      text: "Yang dibangun di atas dasar para rasul dan para nabi, dengan Kristus Yesus sebagai batu penjuru.",
    },
  },
  {
    slug: "nabi",
    term: "Nabi",
    category: "gelar",
    plainMeaning:
      "Penyambung lidah Allah — menyampaikan firman-Nya, sering memanggil umat kembali kepada perjanjian.",
    explanation:
      "Nabi bukan peramal cuaca semata. Intinya: berbicara atas nama Allah. Kadang mereka menubuatkan masa depan; sering kali mereka menegur dosa dan memanggil pertobatan.\n\nYesus disebut lebih besar dari nabi: Ia adalah Firman itu sendiri.",
    keywords: ["prophet", "firman", "nubuat"],
    verse: {
      reference: "Ulangan 18:18",
      passage: "Ulangan 18",
      verse: 18,
      text: "Seorang nabi akan Kubangkitkan bagi mereka dari antara saudara mereka, seperti engkau ini; Aku akan menaruh firman-Ku dalam mulutnya.",
    },
  },
  {
    slug: "imam",
    term: "Imam",
    alsoCalled: ["imamat", "Imam Besar"],
    category: "gelar",
    plainMeaning:
      "Pelayan yang mewakili umat di hadapan Allah, terutama dalam ibadah dan korban di Bait Suci.",
    explanation:
      "Di Israel, imam (khususnya dari keturunan Harun) mempersembahkan korban dan mengajar hukum. Imam Besar masuk ruang maha kudus sekali setahun.\n\nPerjanjian Baru menyebut Yesus sebagai Imam Besar agung yang mempersembahkan diri-Nya sekali untuk selama-lamanya.",
    keywords: ["priest", "imamat", "korban"],
    verse: {
      reference: "Ibrani 4:14",
      passage: "Ibrani 4",
      verse: 14,
      text: "Karena kita sekarang mempunyai Imam Besar Agung, yang telah melintasi semua langit, yaitu Yesus, Anak Allah, baiklah kita teguh berpegang pada pengakuan iman kita.",
    },
  },
  {
    slug: "farisi",
    term: "Farisi",
    category: "sejarah",
    plainMeaning:
      "Kelompok Yahudi yang sangat menekankan ketaatan pada Taurat dan tradisi.",
    explanation:
      "Farisi ingin hidup kudus di tengah budaya asing. Banyak yang saleh; namun Injil juga mencatat kritik Yesus terhadap kemunafikan sebagian dari mereka.\n\nMemahami Farisi membantu membaca perdebatan Yesus tentang hukum, sabat, dan kemurnian.",
    keywords: ["pharisee", "taurat", "tradisi"],
    verse: {
      reference: "Matius 23:23",
      passage: "Matius 23",
      verse: 23,
      text: "Celakalah kamu, hai ahli-ahli Taurat dan orang-orang Farisi, hai kamu orang-orang munafik… yang satu harus dilakukan dan yang lain jangan diabaikan.",
    },
  },
  {
    slug: "saduki",
    term: "Saduki",
    category: "sejarah",
    plainMeaning:
      "Kelompok elite yang terkait dengan imamat Bait Suci; banyak yang menolak kebangkitan orang mati.",
    explanation:
      "Saduki berbeda dari Farisi. Mereka lebih dekat dengan kekuasaan Bait Suci dan cenderung menolak ajaran seperti kebangkitan dan malaikat.\n\nItulah sebabnya percakapan Yesus dengan mereka sering soal kebangkitan.",
    keywords: ["sadducee", "bait", "kebangkitan"],
    verse: {
      reference: "Matius 22:23",
      passage: "Matius 22",
      verse: 23,
      text: "Pada hari itu datanglah kepada Yesus beberapa orang Saduki, yang berpendapat bahwa tidak ada kebangkitan.",
    },
  },
  {
    slug: "sinagoge",
    term: "Sinagoge",
    alsoCalled: ["rumah ibadat"],
    category: "tempat",
    plainMeaning:
      "Tempat berkumpul umat Yahudi untuk doa, pembacaan Taurat, dan pengajaran — terutama di luar Yerusalem.",
    explanation:
      "Setelah pembuangan, sinagoge menjadi pusat kehidupan iman lokal. Yesus dan Paulus sering mengajar di sinagoge.\n\nBeda dari Bait Suci: sinagoge bukan tempat korban binatang, melainkan rumah doa dan Firman.",
    keywords: ["synagogue", "ibadah", "taurat"],
    verse: {
      reference: "Lukas 4:16",
      passage: "Lukas 4",
      verse: 16,
      text: "Ia datang ke Nazaret tempat Ia dibesarkan, dan menurut kebiasaan-Nya pada hari Sabat Ia masuk ke rumah ibadat, lalu berdiri hendak membacakan Kitab Suci.",
    },
  },
  {
    slug: "bait-suci",
    term: "Bait Suci",
    alsoCalled: ["Bait Allah", "rumah Tuhan"],
    category: "tempat",
    plainMeaning:
      "Bangunan kudus di Yerusalem tempat korban dan ibadah Israel dipusatkan.",
    explanation:
      "Bait Suci adalah pusat ibadah nasional. Di dalamnya ada ruang kudus dan ruang maha kudus. Yesus mengajar di pelatarannya dan menubuatkan kehancurannya.\n\nDalam Perjanjian Baru, tubuh orang percaya juga disebut bait Roh Kudus — Allah hadir di tengah umat-Nya.",
    keywords: ["temple", "yerusalem", "ibadah"],
    featured: true,
    verse: {
      reference: "1 Korintus 6:19",
      passage: "1 Korintus 6",
      verse: 19,
      text: "Atau tidak tahukah kamu, bahwa tubuhmu adalah bait Roh Kudus yang diam di dalam kamu…?",
    },
  },
  {
    slug: "kemah-suci",
    term: "Kemah Suci",
    alsoCalled: ["Tabernakel", "Kemah Pertemuan"],
    category: "tempat",
    plainMeaning:
      "Tenda ibadah portabel Israel di padang gurun — tempat Allah “berkemah” di tengah umat.",
    explanation:
      "Sebelum Bait Suci, ada Kemah Suci: struktur yang bisa dibongkar-pasang saat bangsa berjalan. Di situlah korban dan kehadiran Allah digambarkan.\n\nIbrani kemudian memakai gambaran kemah ini untuk menjelaskan karya Kristus.",
    keywords: ["tabernacle", "tenda", "padang gurun"],
    verse: {
      reference: "Keluaran 25:8",
      passage: "Keluaran 25",
      verse: 8,
      text: "Dan mereka harus membuat tempat kudus bagi-Ku, supaya Aku akan diam di tengah-tengah mereka.",
    },
  },
  {
    slug: "sabat",
    term: "Sabat",
    category: "ibadah",
    plainMeaning:
      "Hari perhentian kudus — berhenti dari kerja rutin untuk mengingat Allah sebagai Pencipta dan Penebus.",
    explanation:
      "Sabat mengingatkan Israel bahwa waktu milik Allah, dan manusia bukan budak produktivitas. Yesus menekankan bahwa Sabat dibuat untuk manusia, bukan sebaliknya.\n\nBagi banyak Kristen, makna Sabat dilanjutkan dalam istirahat dan ibadah Minggu, dengan fokus pada kebangkitan Kristus.",
    keywords: ["sabbath", "istirahat", "hari kudus"],
    featured: true,
    verse: {
      reference: "Keluaran 20:8",
      passage: "Keluaran 20",
      verse: 8,
      text: "Ingatlah dan kuduskanlah hari Sabat.",
    },
  },
  {
    slug: "korban",
    term: "Korban",
    alsoCalled: ["persembahan", "kurban"],
    category: "ibadah",
    plainMeaning:
      "Persembahan (binatang, gandum, dll.) kepada Allah sebagai ibadah, pengucapan syukur, atau pendamaian.",
    explanation:
      "Sistem korban mengajarkan bahwa dosa berakibat, dan mendekati Allah membutuhkan jalan yang ditetapkan-Nya. Banyak korban menunjuk tipa-tipa kepada Kristus.\n\nKorban bukan suap kepada Allah; itu respons taat dalam kerangka perjanjian.",
    keywords: ["sacrifice", "persembahan", "darah"],
    verse: {
      reference: "Ibrani 10:10",
      passage: "Ibrani 10",
      verse: 10,
      text: "Dan karena kehendak-Nya itulah kita telah dikuduskan satu kali untuk selama-lamanya oleh persembahan tubuh Yesus Kristus.",
    },
  },
  {
    slug: "baptisan",
    term: "Baptisan",
    alsoCalled: ["dibaptis", "baptis"],
    category: "ibadah",
    plainMeaning:
      "Tanda publik persekutuan dengan kematian dan kebangkitan Kristus — awal hidup baru dalam jemaat.",
    explanation:
      "Baptisan memakai air sebagai tanda. Alkitab menghubungkannya dengan pertobatan, pengampunan, dan penyatuan dengan Kristus.\n\nPraktik detail bisa berbeda antar gereja, tetapi makna intinya: milik Kristus secara terbuka.",
    keywords: ["baptism", "air", "tanda"],
    verse: {
      reference: "Roma 6:4",
      passage: "Roma 6",
      verse: 4,
      text: "Dengan demikian kita telah dikuburkan bersama-sama dengan Dia oleh baptisan dalam kematian, supaya… kita juga boleh hidup dalam hidup yang baru.",
    },
  },
  {
    slug: "perjamuan-kudus",
    term: "Perjamuan Kudus",
    alsoCalled: ["Perjamuan Tuhan", "Ekaristi", "roti dan anggur"],
    category: "ibadah",
    plainMeaning:
      "Ibadah mengenang kematian Kristus dengan roti dan anggur/jus buah anggur — persekutuan tubuh-Nya.",
    explanation:
      "Yesus menetapkan perjamuan pada malam sebelum disalibkan. Roti dan cawan mengarahkan hati kepada tubuh dan darah-Nya yang diberikan bagi kita.\n\nIni bukan sekadar “snack rohani”, melainkan peringatan, persekutuan, dan pengharapan akan kedatangan-Nya kembali.",
    keywords: ["communion", "roti", "anggur"],
    verse: {
      reference: "1 Korintus 11:26",
      passage: "1 Korintus 11",
      verse: 26,
      text: "Sebab setiap kali kamu makan roti ini dan minum cawan ini, kamu memberitakan kematian Tuhan sampai Ia datang.",
    },
  },
  {
    slug: "selah",
    term: "Selah",
    category: "ibadah",
    plainMeaning:
      "Tanda dalam Mazmur yang kemungkinan berarti jeda — berhenti sejenak untuk merenung atau bernapas dalam ibadah.",
    explanation:
      "Arti pastinya diperdebatkan, tetapi dalam praktik baca Mazmur, Selah sering dipahami sebagai “berhenti dulu”.\n\nIa mengajak pembaca tidak buru-buru: biarkan kata-kata itu mengendap.",
    keywords: ["mazmur", "jeda", "pause"],
    verse: {
      reference: "Mazmur 3:9",
      passage: "Mazmur 3",
      verse: 9,
      text: "Dari Tuhan datangnya pertolongan. Semoga berkat-Mu atas umat-Mu! Sela.",
    },
  },
  {
    slug: "amen",
    term: "Amin",
    alsoCalled: ["Amen"],
    category: "ibadah",
    plainMeaning:
      "“Sesungguhnya demikian” / “benar” — penegasan iman di akhir doa atau pernyataan.",
    explanation:
      "Amin berasal dari akar yang berarti kokoh/benar. Mengucapkannya berarti menyetujui apa yang didoakan atau dinyatakan.\n\nYesus kadang memakai “Aku berkata kepadamu…” dengan penekanan serupa: perkataan yang dapat dipercaya.",
    keywords: ["amen", "setuju", "doa"],
    verse: {
      reference: "Wahyu 3:14",
      passage: "Wahyu 3",
      verse: 14,
      text: "Dan tuliskanlah kepada malaikat jemaat di Laodikia: Inilah firman dari Amin, Saksi yang setia dan benar…",
    },
  },
  {
    slug: "haleluya",
    term: "Haleluya",
    alsoCalled: ["Hallelujah"],
    category: "ibadah",
    plainMeaning: "“Pujilah Tuhan!” — seruan pujian dalam bahasa Ibrani.",
    explanation:
      "Gabungan kata “puji” dan nama Tuhan. Muncul kuat di Mazmur dan di sorga yang digambarkan Wahyu.\n\nBukan sekadar kata indah; itu undangan aktif memuji Allah.",
    keywords: ["puji", "tuhan", "mazmur"],
    verse: {
      reference: "Wahyu 19:1",
      passage: "Wahyu 19",
      verse: 1,
      text: "Kemudian dari pada itu aku mendengar seperti suara yang nyaring dari sejumlah besar orang banyak di sorga, katanya: “Haleluya! Keselamatan dan kemuliaan dan kuasa adalah pada Allah kita.”",
    },
  },
  {
    slug: "hosana",
    term: "Hosana",
    alsoCalled: ["Hosanna"],
    category: "ibadah",
    plainMeaning:
      "Seruan “tolonglah, ya Tuhan” yang berkembang menjadi pujian selamat datang bagi Raja.",
    explanation:
      "Awalnya berdekatan dengan doa mohon pertolongan. Saat Yesus masuk Yerusalem, orang banyak meneriakkan Hosana — menyambut Dia sebagai yang datang dalam nama Tuhan.\n\nDalam ibadah Kristen, kata ini tetap dipakai sebagai pujian bagi Kristus Raja.",
    keywords: ["hosanna", "puji", "raja"],
    verse: {
      reference: "Matius 21:9",
      passage: "Matius 21",
      verse: 9,
      text: "Dan orang banyak yang berjalan di depan dan mereka yang mengikuti dari belakang berseru, katanya: “Hosana bagi Anak Daud!”",
    },
  },
  {
    slug: "imanuel",
    term: "Imanuel",
    alsoCalled: ["Emmanuel", "Allah menyertai kita"],
    category: "gelar",
    plainMeaning: "Nama yang berarti “Allah beserta kita”.",
    explanation:
      "Dinubuatkan dalam Yesaya dan dikenakan pada kelahiran Yesus di Matius. Intinya: Allah tidak jauh; Ia hadir dalam Kristus.\n\nNama ini merangkum Injil dalam tiga kata: Allah beserta kita.",
    keywords: ["emmanuel", "menyertai", "hadir"],
    featured: true,
    verse: {
      reference: "Matius 1:23",
      passage: "Matius 1",
      verse: 23,
      text: "Sesungguhnya, anak dara itu akan mengandung dan melahirkan seorang anak laki-laki, dan mereka akan menamakan Dia Imanuel” — yang berarti: Allah menyertai kita.",
    },
  },
  {
    slug: "sheol",
    term: "Sheol",
    alsoCalled: ["dunia orang mati"],
    category: "tempat",
    plainMeaning:
      "Istilah Ibrani untuk alam/keadaan orang mati — bukan selalu identik dengan “neraka” dalam bahasa modern.",
    explanation:
      "Dalam Perjanjian Lama, Sheol sering menggambarkan tempat orang mati secara umum. Nuansanya bisa suram, tetapi tidak selalu sama dengan gambaran neraka penghukuman di kemudian hari.\n\nMembaca dengan hati-hati membantu menghindari menyamakan semua kata “dunia orang mati” dengan satu konsep saja.",
    keywords: ["hades", "mati", "kubur"],
    verse: {
      reference: "Mazmur 16:10",
      passage: "Mazmur 16",
      verse: 10,
      text: "Sebab Engkau tidak menyerahkan aku ke dunia orang mati, dan tidak membiarkan Orang Kudus-Mu melihat kebinasaan.",
    },
  },
  {
    slug: "sion",
    term: "Sion",
    alsoCalled: ["Gunung Sion", "Yerusalem"],
    category: "tempat",
    plainMeaning:
      "Nama bukit/kota Yerusalem yang menjadi lambang kehadiran Allah dan umat-Nya.",
    explanation:
      "Secara geografis terkait Yerusalem. Secara teologis, Sion sering melambangkan tempat Allah bersemayam dan harapan pemulihan.\n\nDalam Perjanjian Baru, “Sion” juga dipakai untuk jemaat / kota sorgawi yang dinantikan.",
    keywords: ["zion", "yerusalem", "kota"],
    verse: {
      reference: "Mazmur 48:2–3",
      passage: "Mazmur 48",
      verse: 2,
      text: "Besarlah Tuhan dan sangat terpuji di kota Allah kita! Gunung-Nya yang kudus, yang menjulang permai, adalah kegirangan bagi seluruh bumi; gunung Sion…",
    },
  },
  {
    slug: "bangsa-bangsa",
    term: "Bangsa-bangsa",
    alsoCalled: ["non-Yahudi", "gentile"],
    category: "sejarah",
    plainMeaning:
      "Dalam konteks Alkitab sering berarti bangsa-bangsa di luar Israel — yang juga ikut dalam rencana berkat Allah.",
    explanation:
      "Janji kepada Abraham mencakup “semua kaum di muka bumi”. Injil kemudian diberitakan secara terbuka kepada bangsa-bangsa.\n\nIstilah ini penting agar pembaca tidak mengira keselamatan hanya untuk satu etnis.",
    keywords: ["gentile", "non-yahudi", "misi"],
    verse: {
      reference: "Kejadian 12:3",
      passage: "Kejadian 12",
      verse: 3,
      text: "Aku akan memberkati orang-orang yang memberkati engkau… dan olehmu semua kaum di muka bumi akan mendapat berkat.”",
    },
  },
  {
    slug: "sisa-umat",
    term: "Sisa umat",
    alsoCalled: ["remnant", "sisa Israel"],
    category: "sejarah",
    plainMeaning:
      "Bagian umat yang tetap setia kepada Allah meski banyak yang menyimpang atau mengalami penghakiman.",
    explanation:
      "Para nabi berbicara tentang “sisa” yang dipelihara Allah. Bukan elit sombong, melainkan tanda kemurahan Allah yang tidak membiarkan janji-Nya gugur.\n\nPaulus memakai gagasan ini saat membahas Israel dan iman.",
    keywords: ["remnant", "setia", "sisa"],
    verse: {
      reference: "Roma 11:5",
      passage: "Roma 11",
      verse: 5,
      text: "Demikian juga sekarang terdapat suatu sisa, menurut pilihan kasih karunia.",
    },
  },
  {
    slug: "alpha-omega",
    term: "Alfa dan Omega",
    alsoCalled: ["Yang Awal dan Yang Akhir"],
    category: "gelar",
    plainMeaning:
      "Gelar Allah/Kristus: Ia mencakup seluruh sejarah — dari awal sampai akhir.",
    explanation:
      "Alfa dan Omega adalah huruf pertama dan terakhir abjad Yunani. Artinya: tidak ada bagian hidup atau sejarah di luar kuasa-Nya.\n\nGelar ini menghibur orang yang takut masa depan: Allah memegang awal dan akhir.",
    keywords: ["awal", "akhir", "kekal"],
    verse: {
      reference: "Wahyu 22:13",
      passage: "Wahyu 22",
      verse: 13,
      text: "Aku adalah Alfa dan Omega, Yang Pertama dan Yang Terkemudian, Yang Awal dan Yang Akhir.”",
    },
  },
  {
    slug: "parousia",
    term: "Kedatangan Kristus",
    alsoCalled: ["parousia", "kedatangan kedua"],
    category: "iman",
    plainMeaning:
      "Pengharapan bahwa Yesus akan datang kembali secara nyata untuk menggenapi kerajaan-Nya.",
    explanation:
      "Orang Kristen menantikan bukan akhir yang kosong, melainkan kedatangan Raja. Istilah teknis “parousia” berarti kedatangan/kehadiran.\n\nPengharapan ini menumbuhkan kesetiaan hari ini, bukan spekulasi yang membuat takut.",
    keywords: ["kedatangan", "kembali", "pengharapan"],
    verse: {
      reference: "1 Tesalonika 4:16–17",
      passage: "1 Tesalonika 4",
      verse: 16,
      text: "Sebab pada waktu tanda diberi… Tuhan sendiri akan turun dari sorga… dan dengan demikian kita akan selalu bersama-sama dengan Tuhan.",
    },
  },
  {
    slug: "wahyu",
    term: "Wahyu",
    alsoCalled: ["penyataan", "Apokalips"],
    category: "iman",
    plainMeaning:
      "Allah menyatakan diri dan kehendak-Nya — bukan tebak-tebakan manusia.",
    explanation:
      "Wahyu berarti “membuka selubung”. Allah membuat diri-Nya dikenal lewat ciptaan, sejarah Israel, Firman, dan puncaknya dalam Kristus.\n\nKitab Wahyu adalah salah satu bentuk penyataan tentang kemenangan Allah, ditulis dengan bahasa lambang yang kuat.",
    keywords: ["revelation", "penyataan", "dibuka"],
    verse: {
      reference: "Ibrani 1:1–2",
      passage: "Ibrani 1",
      verse: 1,
      text: "Setelah pada zaman dahulu Allah… berbicara kepada nenek moyang kita dengan perantaraan nabi-nabi, maka pada zaman akhir ini Ia telah berbicara kepada kita dengan perantaraan Anak-Nya.",
    },
  },
  {
    slug: "mamon",
    term: "Mamon",
    alsoCalled: ["Mammon", "harta"],
    category: "sejarah",
    plainMeaning:
      "Harta/kekayaan yang dipersonifikasikan — bisa menjadi “tuan” yang menyaingi Allah.",
    explanation:
      "Yesus memperingatkan: tidak ada orang yang dapat mengabdi kepada Allah sekaligus kepada Mamon. Isunya bukan uang itu sendiri, melainkan hati yang diperbudak.\n\nIstilah ini mengajak memeriksa siapa yang benar-benar kita layani.",
    keywords: ["uang", "harta", "tuan"],
    verse: {
      reference: "Matius 6:24",
      passage: "Matius 6",
      verse: 24,
      text: "Tak seorang pun dapat mengabdi kepada dua tuan… Kamu tidak dapat mengabdi kepada Allah dan kepada Mamon.”",
    },
  },
  {
    slug: "sunat",
    term: "Sunat",
    category: "ibadah",
    plainMeaning:
      "Tanda perjanjian pada laki-laki Israel; dalam Perjanjian Baru diganti penekanan pada “sunat hati”.",
    explanation:
      "Sunat adalah tanda fisik perjanjian Abraham. Perdebatan di jemaat mula-mula muncul: apakah bangsa-bangsa harus disunat untuk diselamatkan?\n\nPara rasul menegaskan: keselamatan karena iman; yang dibutuhkan adalah hati yang diperbarui.",
    keywords: ["circumcision", "tanda", "perjanjian"],
    verse: {
      reference: "Roma 2:29",
      passage: "Roma 2",
      verse: 29,
      text: "Tetapi orang Yahudi sejati ialah dia yang tersembunyi, dan sunat ialah sunat hati, secara rohani, bukan secara hurufiah.",
    },
  },
  {
    slug: "levi",
    term: "Orang Lewi",
    alsoCalled: ["suku Lewi", "Lewi"],
    category: "sejarah",
    plainMeaning:
      "Suku yang ditugaskan melayani di Kemah/Bait Suci — membantu ibadah umat.",
    explanation:
      "Bukan semua Lewi adalah imam, tetapi suku Lewi dikhususkan untuk pelayanan kudus. Mereka tidak mendapat wilayah seperti suku lain; Tuhan sendirilah “bagian” mereka.\n\nMemahami Lewi membantu membaca kisah ibadah, persembahan, dan pembagian tugas di Israel.",
    keywords: ["levite", "pelayan", "suku"],
    verse: {
      reference: "Ulangan 18:1–2",
      passage: "Ulangan 18",
      verse: 1,
      text: "Imam-imam orang Lewi, yakni seluruh suku Lewi, janganlah mempunyai bagian milik… Tuhanlah milik pusakanya.",
    },
  },

  // ─── Perluasan katalog ─────────────────────────────────────────
  {
    slug: "dosa",
    term: "Dosa",
    category: "iman",
    plainMeaning:
      "Memberontak atau meleset dari kehendak Allah — merusak hubungan dengan Dia dan sesama.",
    explanation:
      "Dalam Alkitab, dosa bukan hanya “kesalahan kecil”, melainkan sikap hati dan perbuatan yang menentang Allah. Akibatnya adalah keterpisahan dan kematian rohani.\n\nKabar baik Injil: Kristus datang menyelamatkan orang berdosa, bukan orang yang merasa sudah cukup baik.",
    keywords: ["sin", "pelanggaran", "kesalahan"],
    featured: true,
    verse: {
      reference: "Roma 3:23",
      passage: "Roma 3",
      verse: 23,
      text: "Karena semua orang telah berbuat dosa dan telah kehilangan kemuliaan Allah.",
    },
  },
  {
    slug: "kelahiran-baru",
    term: "Kelahiran baru",
    alsoCalled: ["lahir kembali", "lahir dari atas"],
    category: "iman",
    plainMeaning:
      "Pembaharuan hidup oleh Roh Kudus — menjadi ciptaan baru di dalam Kristus.",
    explanation:
      "Yesus berkata kepada Nikodemus: orang harus dilahirkan kembali untuk melihat Kerajaan Allah. Ini bukan perbaikan moral semata, melainkan karya Allah yang memberi hidup baru.\n\nKelahiran baru menjelaskan mengapa orang percaya disebut “ciptaan baru”.",
    keywords: ["born again", "regeneration", "baru"],
    verse: {
      reference: "Yohanes 3:3",
      passage: "Yohanes 3",
      verse: 3,
      text: "Yesus menjawab, kata-Nya: »Aku berkata kepadamu, sesungguhnya jika seorang tidak dilahirkan kembali, ia tidak dapat melihat Kerajaan Allah.«",
    },
  },
  {
    slug: "iman",
    term: "Iman",
    alsoCalled: ["percaya", "faith"],
    category: "iman",
    plainMeaning:
      "Percaya dan bersandar kepada Allah serta janji-Nya — bukan sekadar “merasa yakin”.",
    explanation:
      "Iman Alkitabiah melibatkan pengetahuan, kepercayaan, dan komitmen. Iman timbul dari pendengaran firman, dan dinyatakan dalam ketaatan.\n\nIman bukan usaha membeli keselamatan, melainkan tangan yang menerima anugerah Allah.",
    keywords: ["faith", "percaya", "yakin"],
    featured: true,
    verse: {
      reference: "Ibrani 11:1",
      passage: "Ibrani 11",
      verse: 1,
      text: "Iman adalah dasar dari segala sesuatu yang kita harapkan dan bukti dari segala sesuatu yang tidak kita lihat.",
    },
  },
  {
    slug: "roh-kudus",
    term: "Roh Kudus",
    alsoCalled: ["Roh Allah", "Parakletos", "Penghibur"],
    category: "iman",
    plainMeaning:
      "Pribadi Allah yang tinggal dalam orang percaya — menghibur, membimbing, dan menguduskan.",
    explanation:
      "Roh Kudus bukan sekadar “kekuatan” tanpa wajah. Ia adalah Allah yang hadir: memberi hidup, menghasilkan buah, dan memperlengkapi untuk bersaksi.\n\nDi Kisah Para Rasul, pencurahan Roh menandai lahirnya jemaat dan kuasa misi.",
    keywords: ["holy spirit", "roh", "penghibur"],
    featured: true,
    verse: {
      reference: "Yohanes 14:26",
      passage: "Yohanes 14",
      verse: 26,
      text: "Tetapi Penghibur, yaitu Roh Kudus, yang akan dikirim oleh Bapa dalam nama-Ku, Dialah yang akan mengajarkan segala sesuatu kepadamu dan akan mengingatkan kamu akan semua yang telah Kukatakan kepadamu.",
    },
  },
  {
    slug: "inkarnasi",
    term: "Inkarnasi",
    alsoCalled: ["Firman menjadi manusia"],
    category: "iman",
    plainMeaning:
      "Allah Anak menjadi manusia sejati dalam diri Yesus — tanpa berhenti menjadi Allah.",
    explanation:
      "Inkarnasi adalah pusat iman Kristen: Firman yang kekal “menjadi daging” dan diam di antara kita. Yesus bukan setengah allah atau sekadar nabi hebat.\n\nTanpa inkarnasi, salib dan kebangkitan kehilangan artinya sebagai karya Allah sendiri.",
    keywords: ["incarnation", "manusia", "firman"],
    verse: {
      reference: "Yohanes 1:14",
      passage: "Yohanes 1",
      verse: 14,
      text: "Firman itu telah menjadi manusia, dan diam di antara kita, dan kita telah melihat kemuliaan-Nya, yaitu kemuliaan yang diberikan kepada-Nya sebagai Anak Tunggal Bapa, penuh kasih karunia dan kebenaran.",
    },
  },
  {
    slug: "kebangkitan",
    term: "Kebangkitan",
    alsoCalled: ["bangkit dari kematian"],
    category: "iman",
    plainMeaning:
      "Kristus bangkit dari kematian — bukti kemenangan atas dosa dan maut, serta jaminan hidup kekal.",
    explanation:
      "Kebangkitan Yesus adalah fondasi Injil. Tanpa kebangkitan, pemberitaan sia-sia. Karena Ia bangkit, orang percaya punya pengharapan kebangkitan tubuh kelak.\n\nPaskah Kristen merayakan peristiwa ini, bukan sekadar musim semi.",
    keywords: ["resurrection", "bangkit", "hidup"],
    featured: true,
    verse: {
      reference: "1 Korintus 15:20",
      passage: "1 Korintus 15",
      verse: 20,
      text: "Tetapi yang benar ialah, bahwa Kristus telah dibangkitkan dari antara orang mati, sebagai yang sulung dari orang-orang yang telah meninggal.",
    },
  },
  {
    slug: "syafaat",
    term: "Syafaat",
    alsoCalled: ["doa syafaat", "mengantarai"],
    category: "iman",
    plainMeaning:
      "Berdoa bagi orang lain; juga karya Kristus yang menjadi Pengantara di hadapan Bapa.",
    explanation:
      "Syafaat berarti berdiri di tengah: membawa kebutuhan orang lain kepada Allah. Yesus adalah Pengantara sejati; Roh Kudus juga berdoa bagi kita dengan keluhan yang tak terucapkan.\n\nJemaat dipanggil saling mendoakan — bukan karena Allah lupa, melainkan sebagai bentuk kasih.",
    keywords: ["intercession", "doa", "pengantara"],
    verse: {
      reference: "Ibrani 7:25",
      passage: "Ibrani 7",
      verse: 25,
      text: "Karena itu Ia sanggup juga menyelamatkan dengan sempurna semua orang yang oleh Dia datang kepada Allah. Sebab Ia hidup senantiasa untuk menjadi Pengantara mereka.",
    },
  },
  {
    slug: "penghakiman",
    term: "Penghakiman",
    alsoCalled: ["hari penghakiman", "hukuman"],
    category: "iman",
    plainMeaning:
      "Allah menilai dengan adil — baik sekarang maupun pada hari terakhir.",
    explanation:
      "Penghakiman menegaskan bahwa dosa serius dan Allah tidak menutup mata. Namun bagi yang ada di dalam Kristus, tidak ada penghukuman — Kristus sudah menanggung hukuman itu.\n\nTema ini mendorong hidup bertanggung jawab dan pengharapan akan keadilan final.",
    keywords: ["judgment", "adil", "hakim"],
    verse: {
      reference: "Roma 8:1",
      passage: "Roma 8",
      verse: 1,
      text: "Demikianlah sekarang tidak ada penghukuman bagi mereka yang ada di dalam Kristus Yesus.",
    },
  },
  {
    slug: "hidup-kekal",
    term: "Hidup kekal",
    alsoCalled: ["kehidupan abadi"],
    category: "iman",
    plainMeaning:
      "Hidup dalam persekutuan dengan Allah — dimulai sekarang dan berlanjut selamanya.",
    explanation:
      "Hidup kekal bukan hanya “lama sekali di surga”, melainkan mengenal Allah dan Yesus Kristus. Kualitas hubungan itu dimulai saat percaya, bukan baru setelah mati.\n\nJanji ini menopang pengharapan di tengah penderitaan dan kematian.",
    keywords: ["eternal life", "kekal", "surga"],
    verse: {
      reference: "Yohanes 17:3",
      passage: "Yohanes 17",
      verse: 3,
      text: "Inilah hidup yang kekal itu, yaitu bahwa mereka mengenal Engkau, satu-satunya Allah yang benar, dan mengenal Yesus Kristus yang telah Engkau utus.",
    },
  },
  {
    slug: "buah-roh",
    term: "Buah Roh",
    category: "iman",
    plainMeaning:
      "Karakter yang ditumbuhkan Roh Kudus dalam hidup orang percaya — kasih, sukacita, damai, dan lainnya.",
    explanation:
      "Berbeda dari “hasil usaha sendiri”, buah Roh adalah hasil tinggal dalam Kristus. Daftar di Galatia 5 menggambarkan kehidupan yang diubahkan, bukan sekadar karunia spektakuler.\n\nBuah terlihat dalam relasi sehari-hari: sabar, murah hati, menguasai diri.",
    keywords: ["fruit of the spirit", "karakter", "roh"],
    verse: {
      reference: "Galatia 5:22–23",
      passage: "Galatia 5",
      verse: 22,
      text: "Tetapi buah Roh ialah: kasih, sukacita, damai sejahtera, kesabaran, kemurahan, kebaikan, kesetiaan, kelemahlembutan, penguasaan diri.",
    },
  },
  {
    slug: "puasa",
    term: "Puasa",
    category: "ibadah",
    plainMeaning:
      "Menahan makan (atau kenikmatan lain) untuk fokus berdoa dan merendahkan diri di hadapan Allah.",
    explanation:
      "Puasa dalam Alkitab sering menyertai pertobatan, pencarian kehendak Tuhan, atau ratapan. Yesus berpuasa dan mengajar agar puasa tidak dipamerkan.\n\nIntinya bukan “membeli jawaban”, melainkan hati yang lapar akan Allah.",
    keywords: ["fasting", "berdoa", "menahan"],
    verse: {
      reference: "Matius 6:16–18",
      passage: "Matius 6",
      verse: 16,
      text: "Dan apabila kamu berpuasa, janganlah muram mukamu seperti orang munafik… supaya jangan dilihat oleh orang bahwa engkau sedang berpuasa, melainkan hanya oleh Bapamu yang ada di tempat tersembunyi.",
    },
  },
  {
    slug: "persepuluhan",
    term: "Persepuluhan",
    alsoCalled: ["perpuluhan", "sepersepuluh"],
    category: "ibadah",
    plainMeaning:
      "Memberikan sepersepuluh dari hasil/penghasilan sebagai persembahan kepada Tuhan.",
    explanation:
      "Di Israel, persepuluhan mendukung pelayanan Lewi dan ibadah, serta menolong yang berkekurangan. Dalam Perjanjian Baru penekanannya pada kemurahan hati yang sukarela dan sukacita memberi.\n\nPrinsipnya: mengakui bahwa segala berkat berasal dari Allah.",
    keywords: ["tithe", "persembahan", "memberi"],
    verse: {
      reference: "Maleakhi 3:10",
      passage: "Maleakhi 3",
      verse: 10,
      text: "Bawalah seluruh persembahan persepuluhan itu ke dalam rumah perbendaharaan… dan ujilah Aku, firman Tuhan semesta alam, apakah Aku tidak membukakan bagimu tingkap-tingkap langit.",
    },
  },
  {
    slug: "paskah",
    term: "Paskah",
    alsoCalled: ["Pesakh", "Passover"],
    category: "ibadah",
    plainMeaning:
      "Perayaan pembebasan Israel dari Mesir; dalam PB menunjuk pada Kristus sebagai Anak Domba Paskah.",
    explanation:
      "Pada malam Paskah, darah domba menyelamatkan Israel dari tulah. Yesus mati di sekitar Paskah — Paulus menyebut-Nya “Paskah kita”.\n\nMemahami Paskah membantu melihat kontinuitas pembebasan Allah dari Keluaran sampai salib.",
    keywords: ["passover", "domba", "pembebasan"],
    featured: true,
    verse: {
      reference: "1 Korintus 5:7",
      passage: "1 Korintus 5",
      verse: 7,
      text: "Buanglah ragi yang lama itu, supaya kamu menjadi adonan yang baru, sebab kamu memang tidak beragi. Sebab anak domba Paskah kita telah disembelih, yaitu Kristus.",
    },
  },
  {
    slug: "pentakosta",
    term: "Pentakosta",
    alsoCalled: ["Hari Raya Minggu", "Shavuot"],
    category: "ibadah",
    plainMeaning:
      "Hari raya Yahudi 50 hari setelah Paskah; dalam PB saat Roh Kudus dicurahkan atas jemaat.",
    explanation:
      "Pentakosta mula-mula merayakan panen dan pemberian Taurat. Di Kisah 2, Allah mencurahkan Roh Kudus — bahasa-bahasa, keberanian bersaksi, dan lahirnya jemaat.\n\nHari itu menandai era baru: Injil untuk segala bangsa.",
    keywords: ["pentecost", "roh kudus", "lima puluh"],
    verse: {
      reference: "Kisah Para Rasul 2:1–4",
      passage: "Kisah Para Rasul 2",
      verse: 1,
      text: "Ketika tiba hari Pentakosta, semua orang percaya berkumpul di satu tempat… dan mereka semua dipenuhi dengan Roh Kudus.",
    },
  },
  {
    slug: "hari-pendamaian",
    term: "Hari Pendamaian",
    alsoCalled: ["Yom Kippur"],
    category: "ibadah",
    plainMeaning:
      "Hari paling kudus di kalender Israel — imam besar masuk ruang maha kudus untuk mengadakan pendamaian bagi umat.",
    explanation:
      "Sekali setahun imam besar membawa darah korban ke belakang tabir. Surat Ibrani menjelaskan: Yesus adalah Imam Besar sejati yang masuk sekali untuk selama-lamanya.\n\nHari Pendamaian menunjuk pada kebutuhan pengampunan yang hanya Allah sediakan.",
    keywords: ["yom kippur", "pendamaian", "imam besar"],
    verse: {
      reference: "Ibrani 9:11–12",
      passage: "Ibrani 9",
      verse: 11,
      text: "Tetapi Kristus telah datang sebagai Imam Besar… dan Ia telah masuk satu kali untuk selama-lamanya ke dalam tempat yang kudus bukan dengan membawa darah domba jantan dan darah anak lembu, tetapi dengan membawa darah-Nya sendiri.",
    },
  },
  {
    slug: "mezbah",
    term: "Mezbah",
    alsoCalled: ["altar"],
    category: "tempat",
    plainMeaning:
      "Tempat mempersembahkan korban — pusat ibadah di Kemah Suci dan Bait Suci.",
    explanation:
      "Mezbah mengingatkan bahwa mendekati Allah kudus memerlukan pengorbanan. Ada mezbah korban bakaran dan mezbah dupa.\n\nDalam PB, Kristus menjadi korban sekali untuk selamanya; orang percaya mempersembahkan tubuh sebagai “persembahan yang hidup”.",
    keywords: ["altar", "korban", "persembahan"],
    verse: {
      reference: "Keluaran 27:1",
      passage: "Keluaran 27",
      verse: 1,
      text: "Haruslah engkau membuat mezbah dari kayu penaga, lima hasta panjangnya dan lima hasta lebarnya… dan tiga hasta tingginya.",
    },
  },
  {
    slug: "tabut-perjanjian",
    term: "Tabut Perjanjian",
    alsoCalled: ["tabut Allah", "ark"],
    category: "tempat",
    plainMeaning:
      "Peti kudus berisi loh hukum — tanda kehadiran dan perjanjian Allah di tengah Israel.",
    explanation:
      "Tabut ditempatkan di ruang maha kudus. Tutupnya disebut tutup pendamaian. Tabut bukan “jimat”, melainkan tanda bahwa Allah berjanji hadir di antara umat-Nya.\n\nKetika diperlakukan sembarangan, penghakiman menyusul — kekudusan Allah nyata.",
    keywords: ["ark", "perjanjian", "kehadiran"],
    verse: {
      reference: "Keluaran 25:21–22",
      passage: "Keluaran 25",
      verse: 21,
      text: "Dan haruslah engkau meletakkan tutup pendamaian itu di atas tabut dan dalam tabut itu haruslah kau tempatkan loh hukum… Di sanalah Aku akan bertemu dengan engkau.",
    },
  },
  {
    slug: "yerusalem",
    term: "Yerusalem",
    alsoCalled: ["Kota Daud", "Sion"],
    category: "tempat",
    plainMeaning:
      "Kota kudus Israel — pusat ibadah Bait Suci, dan tempat Yesus disalibkan serta bangkit.",
    explanation:
      "Yerusalem menjadi ibu kota Daud dan lokasi Bait Suci. Para nabi berbicara tentang penghakiman dan pemulihannya. Dalam PB, Injil dimulai dari Yerusalem lalu ke ujung bumi.\n\nWahyu menunjuk pada Yerusalem baru — pengharapan akhir umat Allah.",
    keywords: ["jerusalem", "kota", "bait"],
    verse: {
      reference: "Mazmur 122:1",
      passage: "Mazmur 122",
      verse: 1,
      text: "Aku bersukacita, ketika orang berkata kepadaku: »Mari kita pergi ke rumah Tuhan.«",
    },
  },
  {
    slug: "golgota",
    term: "Golgota",
    alsoCalled: ["Tempat Tengkorak", "Calvary"],
    category: "tempat",
    plainMeaning:
      "Bukit di luar tembok Yerusalem tempat Yesus disalibkan.",
    explanation:
      "Nama “Tempat Tengkorak” menggambarkan lokasi eksekusi. Di situlah Anak Domba Allah menanggung dosa dunia.\n\nSalib di Golgota adalah pusat sejarah keselamatan — kelemahan yang menjadi kuasa Allah.",
    keywords: ["calvary", "salib", "tengkorak"],
    verse: {
      reference: "Yohanes 19:17–18",
      passage: "Yohanes 19",
      verse: 17,
      text: "Sambil memikul salib-Nya Ia pergi ke luar ke tempat yang bernama Tempat Tengkorak, dalam bahasa Ibrani: Golgota. Dan di situ mereka menyalibkan Dia.",
    },
  },
  {
    slug: "getsemani",
    term: "Getsemani",
    alsoCalled: ["taman Getsemani", "Gethsemane", "Getsermani"],
    category: "tempat",
    plainMeaning:
      "Taman di Bukit Zaitun tempat Yesus berdoa menjelang penangkapan-Nya.",
    explanation:
      "Di Getsemani Yesus bergumul: “Jikalau boleh, biarlah cawan ini lalu…” namun tunduk pada kehendak Bapa. Murid-murid tertidur — kontras ketaatan Kristus.\n\nTempat ini mengingatkan bahwa penderitaan Yesus nyata secara manusiawi.",
    keywords: ["gethsemane", "doa", "cawan"],
    verse: {
      reference: "Matius 26:36",
      passage: "Matius 26",
      verse: 36,
      text: "Maka sampailah Yesus bersama-sama murid-murid-Nya ke suatu tempat yang bernama Getsemani…",
    },
  },
  {
    slug: "betlehem",
    term: "Betlehem",
    alsoCalled: ["Kota Daud"],
    category: "tempat",
    plainMeaning:
      "Kota kecil di Yehuda tempat Daud berasal dan tempat Yesus dilahirkan.",
    explanation:
      "Nabi Mikha menubuatkan raja dari Betlehem. Lukas mencatat kelahiran Yesus di kandang di sana.\n\nAllah memilih tempat yang sederhana untuk kedatangan Raja — pola Kerajaan yang berbeda dari dunia.",
    keywords: ["bethlehem", "kelahiran", "daud"],
    verse: {
      reference: "Mikha 5:1",
      passage: "Mikha 5",
      verse: 1,
      text: "Tetapi engkau, hai Betlehem Efrata, hai yang terkecil di antara kaum-kaum Yehuda, dari padamu akan bangkit bagi-Ku seorang yang akan memerintah Israel.",
    },
  },
  {
    slug: "yordan",
    term: "Sungai Yordan",
    category: "tempat",
    plainMeaning:
      "Sungai penting di Tanah Perjanjian — tempat Israel menyeberang dan Yesus dibaptis.",
    explanation:
      "Yordan menjadi batas masuk ke Kanaan. Elia dan Elisa terkait dengan sungai ini. Yohanes membaptis di Yordan, dan Yesus dibaptis di sana.\n\nAir Yordan sering menjadi gambar peralihan: dari padang gurun menuju janji.",
    keywords: ["jordan", "baptis", "sungai"],
    verse: {
      reference: "Matius 3:13",
      passage: "Matius 3",
      verse: 13,
      text: "Maka datanglah Yesus dari Galilea ke Yordan kepada Yohanes untuk dibaptis olehnya.",
    },
  },
  {
    slug: "kristus",
    term: "Kristus",
    alsoCalled: ["Mesias", "Yang Diurapi"],
    category: "gelar",
    plainMeaning:
      "Gelar “Yang Diurapi” — Raja, Imam, dan Nabi yang dijanjikan Allah; Yesus adalah Kristus.",
    explanation:
      "Kristus adalah terjemahan Yunani dari Mesias (Ibrani). Bukan nama belakang Yesus, melainkan pengakuan identitas: Dialah yang diurapi untuk menyelamatkan.\n\nMengaku “Yesus adalah Kristus” adalah inti iman Kristen.",
    keywords: ["christ", "mesias", "diurapi"],
    featured: true,
    verse: {
      reference: "Matius 16:16",
      passage: "Matius 16",
      verse: 16,
      text: "Jawab Simon Petrus: »Engkau adalah Mesias, Anak Allah yang hidup!«",
    },
  },
  {
    slug: "rabbi",
    term: "Rabi",
    alsoCalled: ["Guru", "Rabbi"],
    category: "gelar",
    plainMeaning:
      "Guru Taurat yang dihormati; murid-murid memanggil Yesus demikian.",
    explanation:
      "Rabi mengajar, menafsirkan hukum, dan membimbing murid. Yesus diterima sebagai Rabi, namun otoritas-Nya melampaui guru biasa — Ia berbicara sebagai yang punya kuasa.\n\nMemahami gelar ini membantu membaca dialog Yesus dengan ahli Taurat.",
    keywords: ["rabbi", "guru", "pengajar"],
    verse: {
      reference: "Yohanes 1:38",
      passage: "Yohanes 1",
      verse: 38,
      text: "Akan tetapi Yesus menoleh ke belakang. Ia melihat bahwa mereka mengikuti Dia lalu berkata kepada mereka: »Apakah yang kamu cari?« Kata mereka kepada-Nya: »Rabi, di manakah Engkau tinggal?«",
    },
  },
  {
    slug: "penatua",
    term: "Penatua",
    alsoCalled: ["presbiter", "elder"],
    category: "gelar",
    plainMeaning:
      "Pemimpin jemaat yang digembalakan untuk mengajar, menjaga, dan meneladani.",
    explanation:
      "Di jemaat PB, penatua (kadang disebut penilik/jemaat) bertanggung jawab atas kesehatan rohani umat. Syaratnya menekankan karakter lebih dari karisma.\n\nModel ini menekankan kepemimpinan yang melayani, bukan mendominasi.",
    keywords: ["elder", "pemimpin", "gembala"],
    verse: {
      reference: "1 Petrus 5:1–2",
      passage: "1 Petrus 5",
      verse: 1,
      text: "Aku menasihatkan para penatua di antara kamu… Gembalakanlah kawanan domba Allah yang ada padamu, jangan dengan paksa, tetapi dengan sukarela sesuai dengan kehendak Allah.",
    },
  },
  {
    slug: "diaken",
    term: "Diaken",
    alsoCalled: ["pelayan meja"],
    category: "gelar",
    plainMeaning:
      "Pelayan jemaat yang menolong kebutuhan praktis agar pelayanan firman tetap berjalan.",
    explanation:
      "Kisah 6 mencatat pemilihan tujuh orang untuk melayani pembagian makanan. Diaken bukan “kelas dua”; pelayanan mereka melindungi kesatuan dan keadilan jemaat.\n\nSyarat diaken menekankan hidup yang baik dan iman yang teguh.",
    keywords: ["deacon", "pelayan", "melayani"],
    verse: {
      reference: "1 Timotius 3:8–9",
      passage: "1 Timotius 3",
      verse: 8,
      text: "Demikian juga diaken-diaken haruslah orang yang terhormat, jangan bercabang lidah, jangan penggemar anggur, jangan serakah… dan berpegang pada rahasia iman dalam hati nurani yang suci.",
    },
  },
  {
    slug: "malaikat",
    term: "Malaikat",
    alsoCalled: ["utusan Allah"],
    category: "gelar",
    plainMeaning:
      "Makhluk roh ciptaan Allah yang melayani — membawa pesan, melindungi, dan menyembah.",
    explanation:
      "Malaikat muncul di seluruh Alkitab: mengumumkan kelahiran, menolong, atau melaksanakan penghakiman. Mereka bukan objek sembahan.\n\nFokus Alkitab tetap pada Allah; malaikat adalah pelayan-Nya bagi orang-orang yang akan mewarisi keselamatan.",
    keywords: ["angel", "utusan", "surga"],
    verse: {
      reference: "Ibrani 1:14",
      passage: "Ibrani 1",
      verse: 14,
      text: "Bukankah mereka semua adalah roh-roh yang melayani, yang diutus untuk melayani mereka yang harus memperoleh keselamatan?",
    },
  },
  {
    slug: "iblis",
    term: "Iblis",
    alsoCalled: ["Setan", "si jahat", "pencoba"],
    category: "gelar",
    plainMeaning:
      "Musuh Allah dan manusia — menggoda, menuduh, dan menentang kebenaran.",
    explanation:
      "Iblis digambarkan sebagai pencoba, pendusta, dan penuduh. Kuasa-Nya nyata tetapi terbatas; Kristus telah mengalahkannya di salib.\n\nOrang percaya dipanggil waspada dan melawan dengan iman, bukan takut berlebihan.",
    keywords: ["satan", "devil", "pencoba"],
    verse: {
      reference: "1 Petrus 5:8–9",
      passage: "1 Petrus 5",
      verse: 8,
      text: "Sadarlah dan berjaga-jagalah! Lawanmu, si Iblis, berjalan keliling sama seperti singa yang mengaum-aum dan mencari orang yang dapat ditelannya. Lawanlah dia dengan teguh dalam iman.",
    },
  },
  {
    slug: "hamba-tuhan",
    term: "Hamba Tuhan",
    alsoCalled: ["Abdi Tuhan", "servant of the Lord"],
    category: "gelar",
    plainMeaning:
      "Sebutan bagi orang yang melayani Allah dengan taat; dalam Yesaya menunjuk juga pada Hamba yang menderita.",
    explanation:
      "Musa, Daud, dan nabi disebut hamba Tuhan. Nyanyian Hamba di Yesaya menunjuk pada yang menanggung dosa banyak orang — digenapi dalam Yesus.\n\nGelar ini menekankan kehormatan melayani, bukan status rendah semata.",
    keywords: ["servant", "melayani", "hamba"],
    verse: {
      reference: "Yesaya 53:11",
      passage: "Yesaya 53",
      verse: 11,
      text: "Sesudah kesusahan jiwanya ia akan melihat terang dan menjadi puas… sedang ia menanggung dosa mereka.",
    },
  },
  {
    slug: "pembuangan",
    term: "Pembuangan",
    alsoCalled: ["eksile", "ke Babel"],
    category: "sejarah",
    plainMeaning:
      "Masa Israel/Yehuda diangkut dari tanah perjanjian karena ketidaktaatan — terutama ke Asyur dan Babel.",
    explanation:
      "Pembuangan adalah penghakiman, tetapi juga pembentukan ulang identitas umat. Dari situ muncul sinagoge, penekanan Taurat, dan pengharapan pemulihan.\n\nKitab seperti Yehezkiel, Daniel, dan Ratapan lahir dari konteks ini.",
    keywords: ["exile", "babel", "pembuangan"],
    verse: {
      reference: "2 Raja-raja 25:21",
      passage: "2 Raja-raja 25",
      verse: 21,
      text: "Lalu raja Babel menyuruh membunuh mereka di Ribla, di tanah Hamat. Demikianlah orang Yehuda diangkut ke dalam pembuangan dari tanahnya.",
    },
  },
  {
    slug: "keluaran",
    term: "Keluaran",
    alsoCalled: ["Eksodus"],
    category: "sejarah",
    plainMeaning:
      "Peristiwa Allah membebaskan Israel dari perbudakan Mesir menuju perjanjian di Sinai.",
    explanation:
      "Keluaran adalah pola penebusan besar di PL: Allah mendengar, bertindak dengan kuasa, dan membentuk umat. Paskah, Laut Teberau, dan manna menjadi bagian kisah itu.\n\nPB melihat keluaran sebagai bayang-bayang pembebasan di dalam Kristus.",
    keywords: ["exodus", "mesir", "bebas"],
    featured: true,
    verse: {
      reference: "Keluaran 20:2",
      passage: "Keluaran 20",
      verse: 2,
      text: "Akulah Tuhan, Allahmu, yang membawa engkau keluar dari tanah Mesir, dari tempat perbudakan.",
    },
  },
  {
    slug: "manna",
    term: "Manna",
    category: "sejarah",
    plainMeaning:
      "Roti dari langit yang Allah berikan kepada Israel di padang gurun setiap hari.",
    explanation:
      "Manna mengajarkan ketergantungan harian pada pemeliharaan Allah. Dikumpulkan tiap pagi; disimpan berlebih menjadi busuk — kecuali menjelang Sabat.\n\nYesus menyebut diri-Nya roti hidup, menggenapi makna manna secara lebih dalam.",
    keywords: ["manna", "roti", "padang gurun"],
    verse: {
      reference: "Keluaran 16:4",
      passage: "Keluaran 16",
      verse: 4,
      text: "Sebab itu firman Tuhan kepada Musa: »Sesungguhnya Aku akan menurunkan hujan roti dari langit bagimu… supaya Aku menguji apakah mereka hidup menurut hukum-Ku atau tidak.«",
    },
  },
  {
    slug: "sepuluh-hukum",
    term: "Sepuluh Hukum",
    alsoCalled: ["Dekalog", "Kesepuluh Firman"],
    category: "sejarah",
    plainMeaning:
      "Ringkasan kehendak Allah bagi Israel di Sinai — mengasihi Allah dan sesama.",
    explanation:
      "Sepuluh Hukum membentuk etika perjanjian: empat berkaitan dengan Allah, enam dengan sesama. Yesus merangkumnya dalam kasih kepada Allah dan sesama.\n\nBukan tangga ke surga, melainkan cermin yang menunjukkan dosa dan petunjuk hidup umat yang ditebus.",
    keywords: ["ten commandments", "hukum", "sinai"],
    verse: {
      reference: "Keluaran 20:3",
      passage: "Keluaran 20",
      verse: 3,
      text: "Jangan ada padamu allah lain di hadapan-Ku.",
    },
  },
  {
    slug: "herodes",
    term: "Herodes",
    category: "sejarah",
    plainMeaning:
      "Nama dinasti penguasa di Yudea pada zaman Yesus — beberapa tokoh berbeda memakai nama ini.",
    explanation:
      "Herodes Agung memerintah saat Yesus lahir (pembantaian di Betlehem). Herodes Antipas membunuh Yohanes Pembaptis. Herodes Agripa muncul di Kisah Para Rasul.\n\nMembaca “Herodes” perlu cek konteks — bukan selalu orang yang sama.",
    keywords: ["herod", "raja", "yudea"],
    verse: {
      reference: "Matius 2:1",
      passage: "Matius 2",
      verse: 1,
      text: "Sesudah Yesus dilahirkan di Betlehem di tanah Yudea pada zaman raja Herodes, datanglah orang-orang majus dari Timur ke Yerusalem.",
    },
  },
  {
    slug: "samaria",
    term: "Samaria",
    alsoCalled: ["orang Samaria"],
    category: "sejarah",
    plainMeaning:
      "Wilayah dan penduduk di utara Yehuda — sering berselisih dengan orang Yahudi; Yesus justru merangkul mereka.",
    explanation:
      "Setelah keruntuhan Kerajaan Utara, penduduk Samaria bercampur. Ketegangan dengan Yahudi kuat di zaman Yesus. Namun Yesus berbicara dengan perempuan Samaria dan menjadikan orang Samaria teladan belas kasihan.\n\nKisah ini mematahkan prasangka etnis dalam Kerajaan Allah.",
    keywords: ["samaritan", "utara", "prasangka"],
    verse: {
      reference: "Lukas 10:33",
      passage: "Lukas 10",
      verse: 33,
      text: "Lalu datang seorang Samaria, yang sedang dalam perjalanan, ke tempat itu; dan ketika ia melihat orang itu, tergeraklah hatinya oleh belas kasihan.",
    },
  },
  {
    slug: "diaspora",
    term: "Diaspora",
    alsoCalled: ["pencar"],
    category: "sejarah",
    plainMeaning:
      "Orang Yahudi yang tinggal tersebar di luar Tanah Israel.",
    explanation:
      "Karena perdagangan, pembuangan, dan migrasi, banyak Yahudi hidup di Antiokhia, Aleksandria, Roma, dan kota lain. Sinagoge menjadi pusat mereka.\n\nPaulus sering memulai pemberitaan di sinagoge diaspora — jalan Injil ke bangsa-bangsa.",
    keywords: ["diaspora", "tersebar", "yahudi"],
    verse: {
      reference: "Yakobus 1:1",
      passage: "Yakobus 1",
      verse: 1,
      text: "Salam dari Yakobus, hamba Allah dan Tuhan Yesus Kristus, kepada kedua belas suku di perantauan.",
    },
  },
  {
    slug: "gunung-sinai",
    term: "Gunung Sinai",
    alsoCalled: ["Horeb"],
    category: "tempat",
    plainMeaning:
      "Gunung tempat Allah memberi hukum dan mengikat perjanjian dengan Israel.",
    explanation:
      "Di Sinai Allah menampakkan kekudusan-Nya dengan guruh dan asap. Musa menerima Sepuluh Hukum. Perjanjian membentuk Israel sebagai umat kepunyaan Allah.\n\nIbrani membandingkan Sinai yang menakutkan dengan gunung Sion yang penuh anugerah — tanpa meniadakan kekudusan Allah.",
    keywords: ["sinai", "hukum", "perjanjian"],
    verse: {
      reference: "Keluaran 19:18",
      passage: "Keluaran 19",
      verse: 18,
      text: "Gunung Sinai ditutupi seluruhnya dengan asap, karena Tuhan turun ke atasnya dalam api… seluruh gunung itu gemetar hebat.",
    },
  },
  {
    slug: "nazaret",
    term: "Nazaret",
    category: "tempat",
    plainMeaning:
      "Desa di Galilea tempat Yesus dibesarkan — sehingga Ia disebut “Yesus orang Nazaret”.",
    explanation:
      "Nazaret tidak terkenal; Natanael bahkan bertanya, “Mungkinkah sesuatu yang baik datang dari Nazaret?” Allah memilih tempat yang dianggap rendah.\n\nDari Nazaret Yesus memulai pelayanan-Nya di Galilea.",
    keywords: ["nazareth", "galilea", "yesus"],
    verse: {
      reference: "Yohanes 1:46",
      passage: "Yohanes 1",
      verse: 46,
      text: "Kata Natanael kepadanya: »Mungkinkah sesuatu yang baik datang dari Nazaret?«",
    },
  },
  {
    slug: "dupa",
    term: "Dupa",
    category: "ibadah",
    plainMeaning:
      "Wangi-wangian yang dibakar di mezbah — lambang doa yang naik ke hadapan Allah.",
    explanation:
      "Di Kemah Suci, dupa dibakar setiap pagi dan petang. Mazmur menghubungkan dupa dengan doa. Di Wahyu, doa orang-orang kudus digambarkan seperti dupa.\n\nBukan magi, melainkan ibadah yang mengingatkan: doa berharga di hadapan Allah.",
    keywords: ["incense", "doa", "wangi"],
    verse: {
      reference: "Mazmur 141:2",
      passage: "Mazmur 141",
      verse: 2,
      text: "Biarlah doaku adalah bagi-Mu seperti persembahan ukupan, dan tanganku yang menengadah seperti persembahan korban pada waktu petang.",
    },
  },
  {
    slug: "nazar",
    term: "Nazar",
    alsoCalled: ["kaul"],
    category: "ibadah",
    plainMeaning:
      "Janji sukarela kepada Allah — sering disertai pantang tertentu untuk waktu yang ditetapkan.",
    explanation:
      "Nazar orang Nazir (misalnya Simson, Samuel, atau Paulus dalam Kisah) melibatkan pantang anggur dan tidak menyukur rambut. Nazar harus ditunaikan dengan serius.\n\nPengajaran Yesus menekankan kejujuran berkata-kata lebih dari sumpah yang berlebihan.",
    keywords: ["vow", "janji", "nazir"],
    verse: {
      reference: "Bilangan 6:2",
      passage: "Bilangan 6",
      verse: 2,
      text: "Berbicaralah kepada orang Israel dan katakan kepada mereka: Apabila seseorang, baik laki-laki maupun perempuan, mengucapkan nazar khusus, yakni nazar orang nazir, untuk mengkhususkan dirinya bagi Tuhan…",
    },
  },
  {
    slug: "tuhan",
    term: "TUHAN (YAHWEH)",
    alsoCalled: ["Yahweh", "Yehuwa", "Adonai"],
    category: "gelar",
    plainMeaning:
      "Nama perjanjian Allah Israel — “Aku adalah Aku”; dalam banyak terjemahan ditulis TUHAN.",
    explanation:
      "Ketika Musa bertanya nama-Nya, Allah menjawab dengan nama yang menyatakan keberadaan dan kesetiaan-Nya. Tradisi Yahudi sering mengganti pengucapan dengan “Adonai” (Tuhan).\n\nDalam TB, “TUHAN” (huruf kapital) biasanya menandai nama itu — berbeda dari “Tuhan” sebagai gelar.",
    keywords: ["yahweh", "tuhan", "nama"],
    verse: {
      reference: "Keluaran 3:14",
      passage: "Keluaran 3",
      verse: 14,
      text: "Firman Allah kepada Musa: »AKU ADALAH AKU.« Lagi firman-Nya: »Beginilah kaukatakan kepada orang Israel itu: AKULAH AKU telah mengutus aku kepadamu.«",
    },
  },
  {
    slug: "antikristus",
    term: "Antikristus",
    category: "gelar",
    plainMeaning:
      "Yang menentang atau menggantikan Kristus — menyangkal Yesus sebagai Kristus yang datang dalam daging.",
    explanation:
      "Surat Yohanes menyebut “antikristus” sudah ada dalam bentuk banyak penyesat. Bukan hanya figur masa depan, melainkan roh yang menolak inkarnasi dan Injil.\n\nUmat dipanggil menguji pengajaran, bukan panik.",
    keywords: ["antichrist", "penyesat", "menolak"],
    verse: {
      reference: "1 Yohanes 2:22",
      passage: "1 Yohanes 2",
      verse: 22,
      text: "Siapakah pendusta itu? Bukankah dia yang menyangkal bahwa Yesus adalah Kristus? Dia itu adalah antikristus, yaitu dia yang menyangkal baik Bapa maupun Anak.",
    },
  },
  {
    slug: "kerub",
    term: "Kerub",
    alsoCalled: ["kerubim"],
    category: "gelar",
    plainMeaning:
      "Makhluk surgawi yang digambarkan menjaga kekudusan Allah — misalnya pada tabut dan di Eden.",
    explanation:
      "Kerub tampak di Kejadian (menjaga jalan ke pohon kehidupan) dan di ruang maha kudus (patung di atas tutup pendamaian). Yehezkiel memberi penglihatan yang penuh simbol.\n\nIntinya: kekudusan Allah tidak didekati sembarangan.",
    keywords: ["cherub", "malaikat", "penjaga"],
    verse: {
      reference: "Kejadian 3:24",
      passage: "Kejadian 3",
      verse: 24,
      text: "Ia menghalau manusia itu dan di sebelah timur taman Eden ditempatkan-Nya beberapa kerub dengan pedang yang bernyala-nyala… untuk menjaga jalan ke pohon kehidupan.",
    },
  },
];

export function getGlossaryCategory(id: BibleGlossaryCategoryId) {
  return (
    BIBLE_GLOSSARY_CATEGORIES.find((item) => item.id === id) ??
    BIBLE_GLOSSARY_CATEGORIES[0]!
  );
}

export function getGlossaryTerm(slug: string): BibleGlossaryTerm | null {
  return BIBLE_GLOSSARY.find((item) => item.slug === slug) ?? null;
}

export function getFeaturedGlossaryTerms() {
  return BIBLE_GLOSSARY.filter((item) => item.featured);
}

export function getGlossaryCount() {
  return BIBLE_GLOSSARY.length;
}

export function searchBibleGlossary(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [...BIBLE_GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "id"));
  return BIBLE_GLOSSARY.filter((item) => {
    const haystack = [
      item.term,
      item.plainMeaning,
      item.explanation,
      item.slug,
      ...(item.alsoCalled ?? []),
      ...item.keywords,
      getGlossaryCategory(item.category).label,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  }).sort((a, b) => a.term.localeCompare(b.term, "id"));
}

export function glossaryVerseHref(verse: BibleGlossaryVerse) {
  const params = new URLSearchParams();
  params.set("browse", "1");
  params.set("passage", verse.passage);
  if (verse.verse) params.set("verse", String(verse.verse));
  return `/baca?${params.toString()}`;
}

/** Huruf awal untuk indeks A–Z (Ibrani/asing dinormalisasi ke Latin bila bisa). */
export function glossaryIndexLetter(term: string) {
  const letter = term.trim().charAt(0).toLocaleUpperCase("id-ID");
  return /[A-ZÀ-ÖØ-Þ]/.test(letter) ? letter : "#";
}
