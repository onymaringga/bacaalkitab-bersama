/**
 * Jelajahi Alkitab berdasarkan topik — kurasi Topical Index.
 * Ayat: Terjemahan Baru (TB), pintu masuk ke konteks pasal.
 */

export type BibleTopicCategoryId =
  | "faith"
  | "emotion"
  | "relationship"
  | "life"
  | "promise";

export type BibleTopicVerse = {
  reference: string;
  /** Pasal untuk deep-link, contoh: "Yohanes 3" */
  passage: string;
  /** Ayat fokus (opsional) */
  verse?: number;
  text: string;
};

export type BibleTopic = {
  slug: string;
  title: string;
  summary: string;
  category: BibleTopicCategoryId;
  /** Kata kunci pencarian */
  keywords: string[];
  featured?: boolean;
  /** Renungan singkat */
  reflection?: string;
  /** Ajakan doa singkat */
  prayer?: string;
  /** Topik terkait (slug) */
  relatedSlugs?: string[];
  verses: BibleTopicVerse[];
};

export type BibleTopicCategory = {
  id: BibleTopicCategoryId;
  label: string;
  description: string;
};

export const BIBLE_TOPIC_CATEGORIES: BibleTopicCategory[] = [
  {
    id: "faith",
    label: "Iman & karakter",
    description: "Percaya, taat, dan bertumbuh di hadapan Tuhan",
  },
  {
    id: "emotion",
    label: "Emosi & hati",
    description: "Takut, sedih, damai, sukacita — Firman yang menemani",
  },
  {
    id: "relationship",
    label: "Relasi",
    description: "Kasih, keluarga, pengampunan, dan komunitas",
  },
  {
    id: "life",
    label: "Hidup sehari-hari",
    description: "Doa, kerja, uang, keputusan, dan kebijaksanaan",
  },
  {
    id: "promise",
    label: "Janji Tuhan",
    description: "Harapan, pemeliharaan, dan kesetiaan Allah",
  },
];

function v(
  reference: string,
  passage: string,
  verse: number,
  text: string,
): BibleTopicVerse {
  return { reference, passage, verse, text };
}

export const BIBLE_TOPICS: BibleTopic[] = [
  // ─── Featured / core ───────────────────────────────────────────
  {
    slug: "kasih",
    title: "Kasih",
    summary:
      "Kasih Allah yang memberi, dan panggilan mengasihi sesama tanpa syarat.",
    category: "relationship",
    keywords: ["love", "mengasihi", "agape", "kasih karunia"],
    featured: true,
    reflection:
      "Kasih Kristen bukan sekadar perasaan — ia bertindak, sabar, dan berakar pada kasih Allah yang lebih dulu datang.",
    prayer:
      "Tuhan, ajar aku mengasihi seperti Engkau mengasihi — mulai dari orang terdekatku hari ini.",
    relatedSlugs: ["pengampunan", "persahabatan", "pernikahan", "kesabaran"],
    verses: [
      v(
        "Yohanes 3:16",
        "Yohanes 3",
        16,
        "Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.",
      ),
      v(
        "1 Korintus 13:4–5",
        "1 Korintus 13",
        4,
        "Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri.",
      ),
      v(
        "1 Yohanes 4:19",
        "1 Yohanes 4",
        19,
        "Kita mengasihi, karena Allah lebih dahulu mengasihi kita.",
      ),
      v(
        "Yohanes 13:34–35",
        "Yohanes 13",
        34,
        "Aku memberikan perintah baru kepada kamu, yaitu supaya kamu saling mengasihi; sama seperti Aku telah mengasihi kamu demikian pula kamu harus saling mengasihi. Dengan demikian semua orang akan tahu, bahwa kamu adalah murid-murid-Ku, yaitu jikalau kamu saling mengasihi.",
      ),
    ],
  },
  {
    slug: "iman",
    title: "Iman",
    summary:
      "Percaya kepada Tuhan meski belum melihat seluruh jalannya — iman yang hidup.",
    category: "faith",
    keywords: ["percaya", "faith", "bergantung", "yakin"],
    featured: true,
    reflection:
      "Iman bukan kabut; ia berpijak pada karakter Allah yang berjanji — lalu melangkah.",
    prayer:
      "Tuhan, tambahkan imanku. Ajar aku percaya kepada-Mu lebih dari pengertianku sendiri.",
    relatedSlugs: ["pengharapan", "ketaatan", "kesabaran", "doa"],
    verses: [
      v(
        "Ibrani 11:1",
        "Ibrani 11",
        1,
        "Iman adalah dasar dari segala sesuatu yang kita harapkan dan bukti dari segala sesuatu yang tidak kita lihat.",
      ),
      v(
        "Amsal 3:5–6",
        "Amsal 3",
        5,
        "Percayalah kepada Tuhan dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri. Akuilah Dia dalam segala lakumu, maka Ia akan meluruskan jalanmu.",
      ),
      v(
        "Roma 10:17",
        "Roma 10",
        17,
        "Jadi, iman timbul dari pendengaran, dan pendengaran oleh firman Kristus.",
      ),
      v(
        "Markus 9:23",
        "Markus 9",
        23,
        "Yesus berkata kepadanya: »Katamu: jika Engkau dapat? Tidak ada yang mustahil bagi orang yang percaya!«",
      ),
    ],
  },
  {
    slug: "pengampunan",
    title: "Pengampunan",
    summary:
      "Dilepaskan dari salah, dan belajar mengampuni seperti kita diampuni.",
    category: "relationship",
    keywords: ["ampun", "maaf", "rekonsiliasi", "dosa"],
    featured: true,
    reflection:
      "Mengampuni bukan menyangkal luka — melainkan melepaskan dendam karena Kristus lebih dulu melepaskan kita.",
    prayer:
      "Tuhan, tolong aku mengampuni seperti Engkau mengampuni. Sembuhkan hatiku yang terluka.",
    relatedSlugs: ["kasih", "rasa-bersalah", "pertobatan", "damai"],
    verses: [
      v(
        "Efesus 4:32",
        "Efesus 4",
        32,
        "Berbuat baiklah kamu seorang terhadap yang lain, penuh kasih mesra dan saling mengampuni, sebagaimana Allah di dalam Kristus telah mengampuni kamu.",
      ),
      v(
        "Kolose 3:13",
        "Kolose 3",
        13,
        "Sabarlah kamu seorang terhadap yang lain, dan ampunilah seorang akan yang lain apabila yang seorang menaruh dendam terhadap yang lain, sama seperti Tuhan telah mengampuni kamu, kamu perbuat jugalah demikian.",
      ),
      v(
        "1 Yohanes 1:9",
        "1 Yohanes 1",
        9,
        "Jika kita mengaku dosa kita, maka Ia adalah setia dan adil, sehingga Ia akan mengampuni segala dosa kita dan menyucikan kita dari segala kejahatan.",
      ),
      v(
        "Matius 6:14–15",
        "Matius 6",
        14,
        "Karena jikalau kamu mengampuni orang atas kesalahan mereka, Bapamu yang di sorga akan mengampuni kamu juga. Tetapi jikalau kamu tidak mengampuni orang, Bapamu juga tidak akan mengampuni kesalahanmu.",
      ),
    ],
  },
  {
    slug: "damai",
    title: "Damai sejahtera",
    summary:
      "Damai yang Kristus berikan — bukan seperti dunia, tapi yang menenangkan hati.",
    category: "emotion",
    keywords: ["peace", "tenang", "legah", "damai"],
    featured: true,
    reflection:
      "Damai Kristus tidak menunggu keadaan sempurna. Ia menjaga hati di tengah badai.",
    prayer:
      "Tuhan, berikan damai-Mu yang melampaui akal. Jaga hati dan pikiranku hari ini.",
    relatedSlugs: ["ketakutan", "doa", "pengharapan", "kekuatan"],
    verses: [
      v(
        "Yohanes 14:27",
        "Yohanes 14",
        27,
        "Damai sejahtera Kutinggalkan bagimu. Damai sejahtera-Ku Kuberikan kepadamu, dan apa yang Kuberikan tidak seperti yang diberikan dunia kepadamu. Janganlah gelisah hatimu dan janganlah takut!",
      ),
      v(
        "Filipi 4:6–7",
        "Filipi 4",
        6,
        "Janganlah kuatir tentang apa pun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan syukur. Damai sejahtera Allah, yang melampaui segala akal, akan memelihara hati dan pikiranmu dalam Kristus Yesus.",
      ),
      v(
        "Yesaya 26:3",
        "Yesaya 26",
        3,
        "Yang hatinya teguh Kaujaga dalam damai sejahtera, sebab kepada-Mulah ia percaya.",
      ),
      v(
        "Kolose 3:15",
        "Kolose 3",
        15,
        "Hendaklah damai sejahtera Kristus memerintah dalam hatimu, karena kepada damai sejahtera itu kamu telah dipanggil dalam satu tubuh. Dan bersyukurlah.",
      ),
    ],
  },
  {
    slug: "ketakutan",
    title: "Ketakutan & kecemasan",
    summary:
      "Saat hati gelisah, Firman mengingatkan: Tuhan menyertai dan memegang.",
    category: "emotion",
    keywords: ["takut", "cemas", "khawatir", "anxiety", "kuatir"],
    featured: true,
    reflection:
      "Ketakutan sering membesar di dalam sunyi. Firman mengajak kita membawa kekhawatiran kepada Tuhan yang hadir.",
    prayer:
      "Tuhan, saat aku takut, ajar aku percaya. Genggam tanganku dan tenangkan hatiku.",
    relatedSlugs: ["damai", "penyertaan", "kekuatan", "doa"],
    verses: [
      v(
        "Yesaya 41:10",
        "Yesaya 41",
        10,
        "Janganlah takut, sebab Aku menyertai engkau, janganlah bimbang, sebab Aku ini Allahmu; Aku akan meneguhkan, bahkan akan menolong engkau, Aku akan memegang engkau dengan tangan kanan-Ku yang membawa kemenangan.",
      ),
      v(
        "Mazmur 56:4",
        "Mazmur 56",
        4,
        "Pada waktu aku takut, aku percaya kepada-Mu.",
      ),
      v(
        "2 Timotius 1:7",
        "2 Timotius 1",
        7,
        "Sebab Allah memberikan kepada kita bukan roh ketakutan, melainkan roh yang membangkitkan kekuatan, kasih dan ketertiban.",
      ),
      v(
        "1 Petrus 5:7",
        "1 Petrus 5",
        7,
        "Serahkanlah segala kekhawatiranmu kepada-Nya, sebab Ia yang memelihara kamu.",
      ),
    ],
  },
  {
    slug: "pengharapan",
    title: "Pengharapan",
    summary:
      "Harapan yang berakar pada janji Tuhan — bukan pada keadaan yang berubah-ubah.",
    category: "promise",
    keywords: ["harapan", "hope", "masa depan", "pengharapan"],
    featured: true,
    reflection:
      "Pengharapan Kristen bukan optimisme kosong — ia menunggu Allah yang setia menepati janji-Nya.",
    prayer:
      "Allah sumber pengharapan, isi hatiku dengan sukacita dan damai dalam iman.",
    relatedSlugs: ["kesetiaan-tuhan", "kebangkitan-harapan", "kesabaran", "iman"],
    verses: [
      v(
        "Yeremia 29:11",
        "Yeremia 29",
        11,
        "Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman Tuhan, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan.",
      ),
      v(
        "Roma 15:13",
        "Roma 15",
        13,
        "Semoga Allah, sumber pengharapan, memenuhi kamu dengan segala sukacita dan damai sejahtera dalam iman kamu, supaya kamu berlimpah-limpah dalam pengharapan oleh kekuatan Roh Kudus.",
      ),
      v(
        "Ratapan 3:22–23",
        "Ratapan 3",
        22,
        "Tak berkesudahan kasih setia Tuhan, tak habis-habisnya belas kasihan-Nya, selalu baru tiap pagi; besar kesetiaan-Mu!",
      ),
      v(
        "Roma 5:5",
        "Roma 5",
        5,
        "Dan pengharapan tidak mengecewakan, karena kasih Allah telah dicurahkan di dalam hati kita oleh Roh Kudus yang telah dikaruniakan kepada kita.",
      ),
    ],
  },
  {
    slug: "doa",
    title: "Doa",
    summary:
      "Berbicara dengan Allah — permohonan, syukur, dan keheningan di hadapan-Nya.",
    category: "life",
    keywords: ["berdoa", "pray", "permohonan", "ibadah"],
    featured: true,
    reflection:
      "Doa bukan daftar belanja rohani. Ia adalah hubungan — datang kepada Bapa yang mendengar.",
    prayer:
      "Bapa, ajar aku berdoa. Buat hatiku jujur, bersyukur, dan bergantung pada-Mu.",
    relatedSlugs: ["syukur", "keputusan", "damai", "iman"],
    verses: [
      v(
        "Matius 6:6",
        "Matius 6",
        6,
        "Tetapi jika engkau berdoa, masuklah ke dalam kamarmu, tutuplah pintu dan berdoalah kepada Bapamu yang ada di tempat tersembunyi. Maka Bapamu yang melihat yang tersembunyi akan membalasnya kepadamu.",
      ),
      v(
        "1 Tesalonika 5:17",
        "1 Tesalonika 5",
        17,
        "Tetaplah berdoa.",
      ),
      v(
        "Yakobus 5:16",
        "Yakobus 5",
        16,
        "Karena itu saling mengakuilah dosamu dan saling doakanlah, supaya kamu sembuh. Doa orang yang benar, bila dengan yakin didoakan, sangat besar kuasanya.",
      ),
      v(
        "Filipi 4:6",
        "Filipi 4",
        6,
        "Janganlah kuatir tentang apa pun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan syukur.",
      ),
    ],
  },
  {
    slug: "keselamatan",
    title: "Keselamatan",
    summary:
      "Injil yang membebaskan: diselamatkan oleh kasih karunia melalui iman dalam Kristus.",
    category: "promise",
    keywords: ["selamat", "injil", "anugerah", "salvation", "dibenarkan"],
    featured: true,
    reflection:
      "Keselamatan bukan gaji yang kita hasilkan — melainkan karunia Allah di dalam Kristus.",
    prayer:
      "Tuhan Yesus, terima kasih atas salib dan kebangkitan-Mu. Tolong aku hidup dari anugerah-Mu.",
    relatedSlugs: ["iman", "pertobatan", "pengampunan", "kebangkitan-harapan"],
    verses: [
      v(
        "Efesus 2:8–9",
        "Efesus 2",
        8,
        "Sebab karena kasih karunia kamu diselamatkan oleh iman; itu bukan hasil usahamu, tetapi pemberian Allah, itu bukan hasil pekerjaanmu: jangan ada orang yang memegahkan diri.",
      ),
      v(
        "Roma 10:9",
        "Roma 10",
        9,
        "Sebab jika kamu mengaku dengan mulutmu, bahwa Yesus adalah Tuhan, dan percaya dalam hatimu, bahwa Allah telah membangkitkan Dia dari antara orang mati, maka kamu akan diselamatkan.",
      ),
      v(
        "Yohanes 14:6",
        "Yohanes 14",
        6,
        "Kata Yesus kepadanya: »Akulah jalan dan kebenaran dan hidup. Tidak ada seorang pun yang datang kepada Bapa, kalau tidak melalui Aku.«",
      ),
      v(
        "Kisah Para Rasul 4:12",
        "Kisah Para Rasul 4",
        12,
        "Dan keselamatan tidak ada di dalam siapa pun juga selain di dalam Dia, sebab di bawah kolong langit ini tidak ada nama lain yang diberikan kepada manusia yang olehnya kita dapat diselamatkan.",
      ),
    ],
  },
  {
    slug: "syukur",
    title: "Syukur",
    summary:
      "Bersyukur dalam segala keadaan — hati yang mengingat kebaikan Tuhan.",
    category: "emotion",
    keywords: ["bersyukur", "ucapan syukur", "thankful", "pujian"],
    featured: true,
    reflection:
      "Syukur membuka mata pada pemberian Tuhan yang sering kita anggap biasa.",
    prayer:
      "Tuhan, buat hatiku bersyukur — bukan hanya saat mudah, tapi juga saat sulit.",
    relatedSlugs: ["sukacita", "doa", "damai", "pemeliharaan"],
    verses: [
      v(
        "1 Tesalonika 5:18",
        "1 Tesalonika 5",
        18,
        "Mengucap syukurlah dalam segala hal, sebab itulah yang dikehendaki Allah di dalam Kristus Yesus bagi kamu.",
      ),
      v(
        "Mazmur 100:4",
        "Mazmur 100",
        4,
        "Masuklah melalui pintu gerbang-Nya dengan nyanyian syukur, ke dalam pelataran-Nya dengan puji-pujian, bersyukurlah kepada-Nya dan pujilah nama-Nya!",
      ),
      v(
        "Kolose 3:17",
        "Kolose 3",
        17,
        "Dan segala sesuatu yang kamu lakukan dengan perkataan atau perbuatan, lakukanlah semuanya itu dalam nama Tuhan Yesus, sambil mengucap syukur oleh Dia kepada Allah, Bapa kita.",
      ),
      v(
        "Filipi 4:6",
        "Filipi 4",
        6,
        "Janganlah kuatir tentang apa pun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan syukur.",
      ),
    ],
  },

  // ─── Faith & character ─────────────────────────────────────────
  {
    slug: "kekuatan",
    title: "Kekuatan dalam kelemahan",
    summary:
      "Saat tenaga habis, Tuhan menjadi kekuatan — cukup untuk hari ini.",
    category: "promise",
    keywords: ["kuat", "lelah", "strength", "kelemahan"],
    reflection:
      "Kelemahan bukan akhir cerita. Di situ kasih karunia Kristus dinyatakan sempurna.",
    prayer: "Tuhan, saat aku lemah, jadilah kekuatanku. Cukupkan kasih karunia-Mu.",
    relatedSlugs: ["ketakutan", "penyertaan", "kesabaran", "doa"],
    verses: [
      v(
        "Filipi 4:13",
        "Filipi 4",
        13,
        "Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.",
      ),
      v(
        "Yesaya 40:31",
        "Yesaya 40",
        31,
        "Tetapi orang-orang yang menanti-nantikan Tuhan mendapat kekuatan baru: mereka seumpama rajawali yang naik terbang dengan kekuatan sayapnya; mereka berlari dan tidak menjadi lesu, mereka berjalan dan tidak menjadi lelah.",
      ),
      v(
        "2 Korintus 12:9",
        "2 Korintus 12",
        9,
        "Tetapi jawab Tuhan kepadaku: »Cukuplah kasih karunia-Ku bagimu, sebab justru dalam kelemahanlah kuasa-Ku menjadi sempurna.«",
      ),
      v(
        "Mazmur 73:26",
        "Mazmur 73",
        26,
        "Sekalipun dagingku dan hatiku hancur, gunung batuku dan bagianku tetaplah Allah selama-lamanya.",
      ),
    ],
  },
  {
    slug: "kesabaran",
    title: "Kesabaran",
    summary:
      "Menunggu dengan hati yang tenang — buah Roh yang membentuk karakter.",
    category: "faith",
    keywords: ["sabar", "menanti", "ketekunan", "tekun"],
    reflection:
      "Kesabaran bukan pasif. Ia adalah iman yang tetap berdiri sementara Tuhan bekerja.",
    prayer: "Roh Kudus, tumbuhkan kesabaran dalam diriku — terutama saat aku ingin buru-buru.",
    relatedSlugs: ["buah-roh", "pengharapan", "pencobaan", "iman"],
    verses: [
      v(
        "Roma 12:12",
        "Roma 12",
        12,
        "Bersukacitalah dalam pengharapan, sabarlah dalam kesesakan, dan bertekunlah dalam doa!",
      ),
      v(
        "Galatia 5:22–23",
        "Galatia 5",
        22,
        "Tetapi buah Roh ialah: kasih, sukacita, damai sejahtera, kesabaran, kemurahan, kebaikan, kesetiaan, kelemahlembutan, penguasaan diri.",
      ),
      v(
        "Yakobus 1:4",
        "Yakobus 1",
        4,
        "Dan biarkanlah ketekunan itu memperoleh buah yang matang, supaya kamu menjadi sempurna dan utuh dan tak kekurangan suatu apa pun.",
      ),
      v(
        "Pengkhotbah 7:8",
        "Pengkhotbah 7",
        8,
        "Lebih baik akhir suatu perkara dari pada mulanya, dan lebih baik orang panjang sabar dari pada orang tinggi hati.",
      ),
    ],
  },
  {
    slug: "pertobatan",
    title: "Pertobatan",
    summary:
      "Berbalik dari dosa kepada Tuhan — hati yang diubah, jalan yang dibarui.",
    category: "faith",
    keywords: ["bertobat", "berbalik", "repent", "mengaku"],
    reflection:
      "Pertobatan bukan hanya menyesal — melainkan kembali kepada Tuhan yang menyambut.",
    prayer:
      "Tuhan, periksa hatiku. Tunjukkan yang harus kutinggalkan, dan tarik aku kembali kepada-Mu.",
    relatedSlugs: ["pengampunan", "keselamatan", "rasa-bersalah", "kesucian"],
    verses: [
      v(
        "Kisah Para Rasul 3:19",
        "Kisah Para Rasul 3",
        19,
        "Karena itu sadarlah dan bertobatlah, supaya dosamu dihapuskan, agar Tuhan mendatangkan waktu kelegaan.",
      ),
      v(
        "2 Korintus 7:10",
        "2 Korintus 7",
        10,
        "Sebab dukacita menurut kehendak Allah menghasilkan pertobatan yang membawa keselamatan dan yang tidak akan disesalkan, tetapi dukacita yang dari dunia ini menghasilkan kematian.",
      ),
      v(
        "Yesaya 55:7",
        "Yesaya 55",
        7,
        "Baiklah orang fasik meninggalkan jalannya, dan orang durhaka meninggalkan rancangannya; baiklah ia kembali kepada Tuhan, maka Dia akan mengasihaninya, dan kepada Allah kita, sebab Ia memberi pengampunan dengan limpahnya.",
      ),
      v(
        "Lukas 15:20",
        "Lukas 15",
        20,
        "Maka bangkitlah ia dan pergi kepada bapanya. Ketika ia masih jauh, ayahnya melihatnya dan tergeraklah hatinya oleh belas kasihan. Lalu ia berlari berjumpa dengan anaknya itu dan memeluk serta menciumnya.",
      ),
    ],
  },
  {
    slug: "kerendahan-hati",
    title: "Kerendahan hati",
    summary:
      "Tidak memegahkan diri — meneladani Kristus yang merendahkan diri-Nya.",
    category: "faith",
    keywords: ["rendah hati", "humble", "sombong", "kelemahlembutan"],
    reflection:
      "Kerendahan hati membuka ruang bagi kasih karunia; kesombongan menutupnya.",
    prayer: "Tuhan, buang kesombonganku. Bentuk aku seperti Kristus yang lembut dan rendah hati.",
    relatedSlugs: ["ketaatan", "buah-roh", "kasih", "pelayanan"],
    verses: [
      v(
        "Filipi 2:3–4",
        "Filipi 2",
        3,
        "Dengan tidak mencari kepentingan sendiri atau puji-pujian yang sia-sia. Sebaliknya hendaklah dengan rendah hati yang seorang menganggap yang lain lebih utama dari pada dirinya sendiri; dan janganlah tiap-tiap orang hanya memperhatikan kepentingannya sendiri, tetapi kepentingan orang lain juga.",
      ),
      v(
        "Yakobus 4:6",
        "Yakobus 4",
        6,
        "Tetapi kasih karunia, yang dianugerahkan-Nya kepada kita, lebih besar dari pada itu. Karena itu ia kata: »Allah menentang orang yang congkak, tetapi mengasihani orang yang rendah hati.«",
      ),
      v(
        "Matius 11:29",
        "Matius 11",
        29,
        "Pikullah kuk yang Kupasang dan belajarlah pada-Ku, karena Aku lemah lembut dan rendah hati dan jiwamu akan mendapat ketenangan.",
      ),
      v(
        "1 Petrus 5:5",
        "1 Petrus 5",
        5,
        "Demikian jugalah kamu, hai orang-orang muda, tunduklah kepada orang-orang yang tua. Dan kamu semua, rendahkanlah dirimu seorang terhadap yang lain, sebab: »Allah menentang orang yang congkak, tetapi mengasihani orang yang rendah hati.«",
      ),
    ],
  },
  {
    slug: "ketaatan",
    title: "Ketaatan",
    summary:
      "Mendengar dan melakukan firman — kasih yang dinyatakan dalam ketaatan.",
    category: "faith",
    keywords: ["taat", "patuh", "obedience", "perintah"],
    reflection:
      "Ketaatan lahir dari kasih, bukan dari takut belaka. Yesus berkata: Jika kamu mengasihi Aku, turutilah perintah-Ku.",
    prayer: "Tuhan, buat aku bukan hanya mendengar Firman, tapi melakukannya dengan sukacita.",
    relatedSlugs: ["iman", "kerendahan-hati", "buah-roh", "keputusan"],
    verses: [
      v(
        "Yohanes 14:15",
        "Yohanes 14",
        15,
        "Jikalau kamu mengasihi Aku, kamu akan menuruti segala perintah-Ku.",
      ),
      v(
        "Yakobus 1:22",
        "Yakobus 1",
        22,
        "Tetapi hendaklah kamu menjadi pelaku firman dan bukan hanya pendengar saja; sebab jika tidak demikian kamu menipu diri sendiri.",
      ),
      v(
        "1 Samuel 15:22",
        "1 Samuel 15",
        22,
        "Tetapi jawab Samuel: »Apakah Tuhan itu berkenan kepada korban bakaran dan korban sembelihan sama seperti kepada mendengarkan suara Tuhan? Sesungguhnya, mendengarkan lebih baik dari pada korban sembelihan, memperhatikan lebih baik dari pada lemak domba-domba jantan.«",
      ),
      v(
        "Ulangan 6:5",
        "Ulangan 6",
        5,
        "Kasihilah Tuhan, Allahmu, dengan segenap hatimu dan dengan segenap jiwamu dan dengan segenap kekuatanmu.",
      ),
    ],
  },
  {
    slug: "buah-roh",
    title: "Buah Roh",
    summary:
      "Karakter yang ditumbuhkan Roh Kudus — kasih, sukacita, damai, dan lainnya.",
    category: "faith",
    keywords: ["buah roh", "roh kudus", "karakter", "spirit"],
    reflection:
      "Buah Roh bukan daftar prestasi — melainkan hasil tinggal dalam Kristus.",
    prayer:
      "Roh Kudus, kerjakan buah-Mu dalam hidupku. Mulai dari kasih dan penguasaan diri.",
    relatedSlugs: ["kasih", "kesabaran", "sukacita", "damai"],
    verses: [
      v(
        "Galatia 5:22–23",
        "Galatia 5",
        22,
        "Tetapi buah Roh ialah: kasih, sukacita, damai sejahtera, kesabaran, kemurahan, kebaikan, kesetiaan, kelemahlembutan, penguasaan diri. Tidak ada hukum yang menentang perkara-perkara itu.",
      ),
      v(
        "Yohanes 15:5",
        "Yohanes 15",
        5,
        "Akulah pokok anggur dan kamulah ranting-rantingnya. Barangsiapa tinggal di dalam Aku dan Aku di dalam dia, ia berbuah banyak, sebab di luar Aku kamu tidak dapat berbuat apa-apa.",
      ),
      v(
        "Efesus 5:9",
        "Efesus 5",
        9,
        "Karena terang hanya berbuahkan kebaikan saja, dan keadilan dan kebenaran.",
      ),
      v(
        "2 Petrus 1:5–7",
        "2 Petrus 1",
        5,
        "Justru karena itu kamu harus dengan sungguh-sungguh berusaha untuk menambahkan kepada imanmu kebajikan, dan kepada kebajikan pengetahuan, dan kepada pengetahuan penguasaan diri, kepada penguasaan diri ketekunan, dan kepada ketekunan kesalehan, dan kepada kesalehan kasih akan saudara-saudara, dan kepada kasih akan saudara-saudara kasih akan semua orang.",
      ),
    ],
  },
  {
    slug: "kesucian",
    title: "Kekudusan",
    summary:
      "Dipanggil hidup kudus — bukan sempurna sendiri, tapi dikuduskan oleh Tuhan.",
    category: "faith",
    keywords: ["kudus", "suci", "holiness", "kemurnian"],
    reflection:
      "Kekudusan adalah undangan bersekutu dengan Allah yang kudus — dibentuk oleh kasih karunia.",
    prayer: "Tuhan yang kudus, kuduskan hatiku. Jauhkan aku dari yang mencemarkan.",
    relatedSlugs: ["pertobatan", "ketaatan", "pencobaan", "buah-roh"],
    verses: [
      v(
        "1 Petrus 1:15–16",
        "1 Petrus 1",
        15,
        "Tetapi hendaklah kamu menjadi kudus di dalam seluruh hidupmu sama seperti Dia yang kudus, yang telah memanggil kamu, sebab ada tertulis: Kuduslah kamu, sebab Aku kudus.",
      ),
      v(
        "Ibrani 12:14",
        "Ibrani 12",
        14,
        "Berusahalah hidup damai dengan semua orang dan kejarlah kekudusan, sebab tanpa kekudusan tidak seorang pun akan melihat Tuhan.",
      ),
      v(
        "Roma 12:1",
        "Roma 12",
        1,
        "Karena itu, saudara-saudara, demi kemurahan Allah aku menasihatkan kamu, supaya kamu mempersembahkan tubuhmu sebagai persembahan yang hidup, yang kudus dan yang berkenan kepada Allah: itu adalah ibadahmu yang sejati.",
      ),
      v(
        "2 Korintus 7:1",
        "2 Korintus 7",
        1,
        "Karena kita mempunyai janji-janji itu, saudara-saudaraku yang kekasih, maka marilah kita menyucikan diri kita dari semua pencemaran jasmani dan rohani, dan dengan demikian menyempurnakan kekudusan kita dalam takut akan Allah.",
      ),
    ],
  },

  // ─── Emotion ───────────────────────────────────────────────────
  {
    slug: "kesedihan",
    title: "Kesedihan & penghiburan",
    summary:
      "Allah dekat pada yang patah hati — Dia menghibur dan menopang.",
    category: "emotion",
    keywords: ["sedih", "duka", "menangis", "grief", "penghiburan"],
    reflection:
      "Kesedihan tidak membuat Tuhan menjauh. Ia dekat pada yang patah hati.",
    prayer: "Tuhan, dekatilah hatiku yang sedih. Hiburlah aku dengan kehadiran-Mu.",
    relatedSlugs: ["pengharapan", "penyertaan", "kesepian", "damai"],
    verses: [
      v(
        "Mazmur 34:19",
        "Mazmur 34",
        19,
        "Tuhan itu dekat kepada orang-orang yang patah hati, dan Ia menyelamatkan orang-orang yang remuk jiwanya.",
      ),
      v(
        "Matius 5:4",
        "Matius 5",
        4,
        "Berbahagialah orang yang berdukacita, karena mereka akan dihibur.",
      ),
      v(
        "2 Korintus 1:3–4",
        "2 Korintus 1",
        3,
        "Terpujilah Allah, Bapa Tuhan kita Yesus Kristus, Bapa yang penuh belas kasihan, Allah sumber segala penghiburan, yang menghibur kami dalam segala penderitaan kami, sehingga kami sanggup menghibur mereka yang berada dalam pelbagai penderitaan dengan penghiburan yang kami terima sendiri dari Allah.",
      ),
      v(
        "Wahyu 21:4",
        "Wahyu 21",
        4,
        "Dan Ia akan menghapus segala air mata dari mata mereka, dan maut tidak akan ada lagi; tidak akan ada lagi perkabungan, atau ratap tangis, atau dukacita, sebab segala sesuatu yang lama itu telah berlalu.",
      ),
    ],
  },
  {
    slug: "sukacita",
    title: "Sukacita",
    summary:
      "Sukacita yang bertahan — bukan karena semua mudah, tapi karena Tuhan dekat.",
    category: "emotion",
    keywords: ["joy", "bahagia", "bersukacita", "gembira"],
    reflection:
      "Sukacita dalam Tuhan adalah kekuatan — ia tidak bergantung pada cuaca hati.",
    prayer: "Tuhan, pulihkan sukacitaku. Ajar aku bersukacita dalam Engkau hari ini.",
    relatedSlugs: ["syukur", "pengharapan", "buah-roh", "damai"],
    verses: [
      v(
        "Nehemia 8:10",
        "Nehemia 8",
        10,
        "Lalu berkatalah Nehemia kepada mereka: »Pergilah kamu, makanlah sedap-sedapan dan minumlah minuman manis dan kirimlah sebagian kepada mereka yang tidak sedia apa-apa, sebab hari ini kudus bagi Tuhan kita! Jangan kamu bersusah hati, sebab sukacita karena Tuhan itulah perlindunganmu!«",
      ),
      v(
        "Mazmur 16:11",
        "Mazmur 16",
        11,
        "Engkau memberitahukan kepadaku jalan kehidupan; di hadapan-Mu ada sukacita berlimpah-limpah, di tangan kanan-Mu kekelapan yang menyenangkan.",
      ),
      v(
        "Filipi 4:4",
        "Filipi 4",
        4,
        "Bersukacitalah senantiasa dalam Tuhan! Sekali lagi kukatakan: Bersukacitalah!",
      ),
      v(
        "Yohanes 15:11",
        "Yohanes 15",
        11,
        "Semuanya itu Kukatakan kepadamu, supaya sukacita-Ku ada di dalam kamu dan sukacitamu menjadi penuh.",
      ),
    ],
  },
  {
    slug: "marah",
    title: "Marah",
    summary:
      "Mengelola amarah dengan bijak — cepat mendengar, lambat marah, siap berdamai.",
    category: "emotion",
    keywords: ["amarah", "emosi", "anger", "dendam"],
    reflection:
      "Alkitab tidak menyangkal marah, tapi memperingatkan: jangan biarkan matahari terbenam sebelum beres.",
    prayer:
      "Tuhan, kuasai lidah dan hatiku saat marah. Buat aku cepat mendengar dan lambat membalas.",
    relatedSlugs: ["pengampunan", "lidah", "buah-roh", "damai"],
    verses: [
      v(
        "Efesus 4:26–27",
        "Efesus 4",
        26,
        "Apabila kamu menjadi marah, janganlah kamu berbuat dosa: janganlah matahari terbenam, sebelum padam amarahmu dan janganlah beri kesempatan kepada Iblis.",
      ),
      v(
        "Yakobus 1:19–20",
        "Yakobus 1",
        19,
        "Hai saudara-saudaraku yang kekasih, ingatlah hal ini: setiap orang hendaklah cepat untuk mendengar, lambat untuk berkata-kata dan lambat untuk marah; sebab marah manusia tidak mengerjakan kebenaran di hadapan Allah.",
      ),
      v(
        "Amsal 15:1",
        "Amsal 15",
        1,
        "Jawaban yang lemah lembut meredakan kegeraman, tetapi perkataan yang pedas membangkitkan marah.",
      ),
      v(
        "Amsal 29:11",
        "Amsal 29",
        11,
        "Orang bebal melampiaskan seluruh amarahnya, tetapi orang bijak menahannya sampai kemudian.",
      ),
    ],
  },
  {
    slug: "kesepian",
    title: "Kesepian",
    summary:
      "Saat merasa sendiri — mengingat Tuhan yang menyertai dan komunitas yang dipanggil-Nya.",
    category: "emotion",
    keywords: ["sendiri", "sepi", "lonely", "terasing"],
    reflection:
      "Kesepian nyata, tapi bukan kata terakhir. Tuhan menyertai, dan Ia menempatkan kita dalam tubuh Kristus.",
    prayer:
      "Tuhan, saat aku merasa sendiri, ingatkan aku bahwa Engkau dekat. Bukalah juga pintu persahabatan yang sehat.",
    relatedSlugs: ["penyertaan", "persahabatan", "gereja-komunitas", "kesedihan"],
    verses: [
      v(
        "Mazmur 25:16",
        "Mazmur 25",
        16,
        "Berpalinglah kepadaku dan kasihanilah aku, sebab aku sunyi dan tertindas.",
      ),
      v(
        "Ulangan 31:8",
        "Ulangan 31",
        8,
        "Tuhan, Dialah yang berjalan di depanmu; Ia akan ada bersama-sama dengan engkau, Ia tidak akan membiarkan engkau dan tidak akan meninggalkan engkau; janganlah takut dan janganlah patah hati.",
      ),
      v(
        "Yesaya 43:2",
        "Yesaya 43",
        2,
        "Apabila engkau menyeberang melalui air, Aku akan menyertai engkau, atau melalui sungai-sungai, engkau tidak akan dihanyutkan; apabila engkau berjalan melalui api, engkau tidak akan dihanguskan, dan nyala api tidak akan membakar engkau.",
      ),
      v(
        "Ibrani 13:5",
        "Ibrani 13",
        5,
        "Janganlah kamu menjadi hamba uang dan cukupkanlah dirimu dengan apa yang ada padamu. Karena Allah telah berfirman: »Aku sekali-kali tidak akan membiarkan engkau dan Aku sekali-kali tidak akan meninggalkan engkau.«",
      ),
    ],
  },
  {
    slug: "rasa-bersalah",
    title: "Rasa bersalah",
    summary:
      "Dari tuduhan menuju pengampunan — Kristus membebaskan hati yang terbeban.",
    category: "emotion",
    keywords: ["bersalah", "malu", "guilt", "tuduhan", "shame"],
    reflection:
      "Rasa bersalah yang sehat membawa kita kepada pertobatan; rasa bersalah yang menindas menolak anugerah.",
    prayer:
      "Tuhan, lepaskan aku dari tuduhan yang sudah Engkau ampuni. Ajar aku berjalan dalam kebebasan-Mu.",
    relatedSlugs: ["pengampunan", "pertobatan", "keselamatan", "damai"],
    verses: [
      v(
        "Roma 8:1",
        "Roma 8",
        1,
        "Demikianlah sekarang tidak ada penghukuman bagi mereka yang ada di dalam Kristus Yesus.",
      ),
      v(
        "Mazmur 32:5",
        "Mazmur 32",
        5,
        "Dosaku kuberi tahukan kepada-Mu dan kesalahanku tidaklah kusembunyikan; aku berkata: »Aku akan mengaku pelanggaran-pelanggaranku kepada Tuhan.« Maka Engkau mengampuni kesalahan karena dosaku.",
      ),
      v(
        "1 Yohanes 1:9",
        "1 Yohanes 1",
        9,
        "Jika kita mengaku dosa kita, maka Ia adalah setia dan adil, sehingga Ia akan mengampuni segala dosa kita dan menyucikan kita dari segala kejahatan.",
      ),
      v(
        "Yesaya 1:18",
        "Yesaya 1",
        18,
        "Marilah, baiklah kita berperkara! — firman Tuhan — Sekalipun dosamu merah seperti kirmizi, akan menjadi putih seperti salju; sekalipun berwarna merah seperti kain kesumba, akan menjadi putih seperti bulu domba.",
      ),
    ],
  },

  // ─── Relationship ──────────────────────────────────────────────
  {
    slug: "keluarga",
    title: "Keluarga",
    summary:
      "Rumah tangga dan relasi dekat — dikasihi, dihormati, dan dipulihkan Tuhan.",
    category: "relationship",
    keywords: ["rumah", "anak", "orangtua", "family", "rumah tangga"],
    reflection:
      "Keluarga adalah tempat pertama kita belajar kasih, pengampunan, dan ibadah bersama.",
    prayer:
      "Tuhan, berkati keluargaku. Buat rumah kami tempat Engkau dihormati dan kasih bertumbuh.",
    relatedSlugs: ["pernikahan", "kasih", "pengampunan", "ketaatan"],
    verses: [
      v(
        "Yosua 24:15",
        "Yosua 24",
        15,
        "Butalah kamu sendiri memilih kepada siapa kamu akan beribadah pada hari ini: kepada allah yang disembah nenek moyangmu di seberang sungai Efrat, atau kepada allah orang Amori yang negerinya kamu diami ini. Tetapi aku dan seisi rumahku, kami akan beribadah kepada Tuhan!",
      ),
      v(
        "Efesus 6:1–2",
        "Efesus 6",
        1,
        "Hai anak-anak, taatilah orang tuamu di dalam Tuhan, karena haruslah demikian. Hormatilah ayahmu dan ibumu — ini adalah suatu perintah yang penting, seperti yang nyata dari janji ini.",
      ),
      v(
        "Kolose 3:14",
        "Kolose 3",
        14,
        "Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.",
      ),
      v(
        "Mazmur 127:3",
        "Mazmur 127",
        3,
        "Sesungguhnya, anak-anak lelaki adalah milik pusaka dari Tuhan, dan buah kandungan adalah suatu upah.",
      ),
    ],
  },
  {
    slug: "pernikahan",
    title: "Pernikahan",
    summary:
      "Perjanjian kasih suami-istri — saling mengasihi seperti Kristus mengasihi jemaat.",
    category: "relationship",
    keywords: ["nikah", "suami", "istri", "marriage", "pasangan"],
    reflection:
      "Pernikahan bukan hanya romansa — melainkan perjanjian yang menampilkan kasih Kristus.",
    prayer:
      "Tuhan, berkati pernikahan kami / pasangan yang Engkau siapkan. Tanamkan kasih yang setia.",
    relatedSlugs: ["kasih", "keluarga", "pengampunan", "kesabaran"],
    verses: [
      v(
        "Kejadian 2:24",
        "Kejadian 2",
        24,
        "Sebab itu seorang laki-laki akan meninggalkan ayahnya dan ibunya dan bersatu dengan istrinya, sehingga keduanya menjadi satu daging.",
      ),
      v(
        "Efesus 5:25",
        "Efesus 5",
        25,
        "Hai suami, kasihilah istrimu sebagaimana Kristus telah mengasihi jemaat dan telah menyerahkan diri-Nya baginya.",
      ),
      v(
        "Efesus 5:33",
        "Efesus 5",
        33,
        "Bagaimanapun juga, bagi kamu masing-masing berlaku: kasihilah istrimu seperti dirimu sendiri dan istri hendaklah hormat kepada suaminya.",
      ),
      v(
        "1 Korintus 13:7",
        "1 Korintus 13",
        7,
        "Ia menutupi segala sesuatu, percaya segala sesuatu, mengharapkan segala sesuatu, sabar menanggung segala sesuatu.",
      ),
    ],
  },
  {
    slug: "persahabatan",
    title: "Persahabatan",
    summary:
      "Sahabat yang menguatkan — berjalan bersama dalam kasih dan kejujuran.",
    category: "relationship",
    keywords: ["sahabat", "teman", "friendship", "komunitas"],
    reflection:
      "Persahabatan yang baik mempertajam dan menopang — seperti besi menajamkan besi.",
    prayer:
      "Tuhan, berikan sahabat yang menolongku lebih dekat kepada-Mu, dan jadikan aku sahabat yang setia.",
    relatedSlugs: ["kasih", "gereja-komunitas", "kesepian", "lidah"],
    verses: [
      v(
        "Amsal 17:17",
        "Amsal 17",
        17,
        "Seorang sahabat menunjukan kasihnya setiap waktu, dan menjadi seorang saudara dalam kesukaran.",
      ),
      v(
        "Amsal 27:17",
        "Amsal 27",
        17,
        "Besi menajamkan besi, orang menajamkan sesamanya.",
      ),
      v(
        "Pengkhotbah 4:9–10",
        "Pengkhotbah 4",
        9,
        "Berdua lebih baik dari pada seorang diri, karena mereka menerima upah yang baik dalam jerih payah mereka. Karena kalau mereka jatuh, yang seorang mengangkat temannya.",
      ),
      v(
        "Yohanes 15:13",
        "Yohanes 15",
        13,
        "Tidak ada kasih yang lebih besar dari pada kasih seorang yang memberikan nyawanya untuk sahabat-sahabatnya.",
      ),
    ],
  },
  {
    slug: "gereja-komunitas",
    title: "Gereja & komunitas",
    summary:
      "Tubuh Kristus — saling membangun, saling menanggung, dan bertumbuh bersama.",
    category: "relationship",
    keywords: ["jemaat", "gereja", "komunitas", "church", "persekutuan"],
    reflection:
      "Iman Kristen bukan perjalanan solo. Kita dipanggil menjadi anggota tubuh yang saling membutuhkan.",
    prayer:
      "Tuhan, ajar aku mengasihi jemaat-Mu. Buat aku menjadi berkat di komunitasku.",
    relatedSlugs: ["persahabatan", "kasih", "pelayanan", "kesabaran"],
    verses: [
      v(
        "Ibrani 10:24–25",
        "Ibrani 10",
        24,
        "Dan marilah kita saling memperhatikan supaya kita saling mendorong dalam kasih dan dalam pekerjaan baik. Janganlah kita menjauhkan diri dari pertemuan-pertemuan ibadah kita, seperti dibiasakan oleh beberapa orang, tetapi marilah kita saling menasihati, dan semakin giat melakukannya menjelang hari Tuhan yang mendekat.",
      ),
      v(
        "Roma 12:4–5",
        "Roma 12",
        4,
        "Sebab sama seperti pada tubuh kita mempunyai banyak anggota, dan tidak semua anggota itu mempunyai tugas yang sama, demikian juga kita, walaupun banyak, adalah satu tubuh di dalam Kristus; tetapi kita masing-masing adalah anggota yang seorang terhadap yang lain.",
      ),
      v(
        "Kisah Para Rasul 2:42",
        "Kisah Para Rasul 2",
        42,
        "Mereka bertekun dalam pengajaran rasul-rasul dan dalam persekutuan. Dan mereka selalu berkumpul untuk memecahkan roti dan berdoa.",
      ),
      v(
        "Galatia 6:2",
        "Galatia 6",
        2,
        "Bertolong-tolonganlah menanggung bebanmu! Demikianlah kamu memenuhi hukum Kristus.",
      ),
    ],
  },

  // ─── Life ──────────────────────────────────────────────────────
  {
    slug: "kebijaksanaan",
    title: "Kebijaksanaan",
    summary:
      "Hikmat dari Tuhan untuk memilih, berbicara, dan menata hidup.",
    category: "life",
    keywords: ["hikmat", "bijak", "wisdom", "pengertian"],
    reflection:
      "Hikmat dimulai dengan takut akan Tuhan — lalu meminta kepada-Nya dengan iman.",
    prayer: "Tuhan, beri aku hikmat untuk keputusan hari ini. Ajar aku takut akan Engkau.",
    relatedSlugs: ["keputusan", "doa", "lidah", "ketaatan"],
    verses: [
      v(
        "Yakobus 1:5",
        "Yakobus 1",
        5,
        "Apabila di antara kamu ada yang kekurangan hikmat, hendaklah ia memintakannya kepada Allah, yang memberikan kepada semua orang dengan murah hati dan dengan tidak membangkit-bangkit, maka hal itu akan diberikan kepadanya.",
      ),
      v(
        "Amsal 9:10",
        "Amsal 9",
        10,
        "Permulaan hikmat adalah takut akan Tuhan, dan mengenal Yang Mahakudus adalah pengertian.",
      ),
      v(
        "Amsal 4:7",
        "Amsal 4",
        7,
        "Permulaan hikmat ialah: perolehlah hikmat dan dengan segala yang kauperoleh perolehlah pengertian.",
      ),
      v(
        "Kolose 1:9",
        "Kolose 1",
        9,
        "Sebab itu sejak hari kami mendengarnya, kami tidak berhenti berdoa untuk kamu. Kami meminta, supaya kamu menerima segala hikmat dan pengertian yang benar, untuk mengetahui kehendak Tuhan dengan sempurna.",
      ),
    ],
  },
  {
    slug: "uang",
    title: "Uang & berkat",
    summary:
      "Hartamu dan hatimu — Tuhan memanggil kita setia, murah hati, dan bergantung pada-Nya.",
    category: "life",
    keywords: ["harta", "kekayaan", "berkat", "persembahan", "money"],
    reflection:
      "Uang adalah alat, bukan tuan. Di mana hartamu berada, di situ hatimu berada.",
    prayer:
      "Tuhan, ajar aku setia mengelola berkat. Jauhkan aku dari cinta uang.",
    relatedSlugs: ["kerja", "syukur", "pemeliharaan", "keputusan"],
    verses: [
      v(
        "Matius 6:21",
        "Matius 6",
        21,
        "Karena di mana hartamu berada, di situ juga hatimu berada.",
      ),
      v(
        "Matius 6:33",
        "Matius 6",
        33,
        "Tetapi carilah dahulu Kerajaan Allah dan kebenarannya, maka semuanya itu akan ditambahkan kepadamu.",
      ),
      v(
        "1 Timotius 6:10",
        "1 Timotius 6",
        10,
        "Karena akar segala kejahatan ialah cinta uang. Sebab oleh memburu uanglah beberapa orang telah menyimpang dari iman dan menyiksa dirinya dengan berbagai-bagai duka.",
      ),
      v(
        "2 Korintus 9:7",
        "2 Korintus 9",
        7,
        "Hendaklah masing-masing memberikan menurut kerelaan hatinya, jangan dengan sedih hati atau karena paksaan, sebab Allah mengasihi orang yang memberi dengan sukacita.",
      ),
    ],
  },
  {
    slug: "kerja",
    title: "Kerja & panggilan",
    summary:
      "Bekerja sebagai untuk Tuhan — tekun, jujur, dan bermakna.",
    category: "life",
    keywords: ["pekerjaan", "panggilan", "kerja", "work", "pelayanan"],
    reflection:
      "Kerja bukan kutuk belaka — di dalam Kristus ia menjadi ibadah ketika dilakukan untuk Tuhan.",
    prayer:
      "Tuhan, berkati pekerjaanku hari ini. Buat aku tekun dan jujur sebagai untuk-Mu.",
    relatedSlugs: ["uang", "pelayanan", "kebijaksanaan", "kesabaran"],
    verses: [
      v(
        "Kolose 3:23–24",
        "Kolose 3",
        23,
        "Apa pun juga yang kamu perbuat, perbuatlah dengan segenap hatimu seperti untuk Tuhan dan bukan untuk manusia. Kamu tahu, bahwa dari Tuhanlah kamu akan menerima bagian yang ditentukan bagimu sebagai upah. Kristus adalah tuan dan kepadanyalah kamu berhambaan.",
      ),
      v(
        "Amsal 16:3",
        "Amsal 16",
        3,
        "Serahkanlah perbuatanmu kepada Tuhan, maka terlaksanalah rencanamu.",
      ),
      v(
        "Pengkhotbah 9:10",
        "Pengkhotbah 9",
        10,
        "Segala sesuatu yang dijumpai tanganmu untuk dikerjakan, kerjakanlah itu dengan sekuat tenaga.",
      ),
      v(
        "1 Korintus 15:58",
        "1 Korintus 15",
        58,
        "Karena itu, saudara-saudaraku yang kekasih, berdirilah teguh, jangan goyah, dan giatlah selalu dalam pekerjaan Tuhan! Sebab kamu tahu, bahwa dalam persekutuan dengan Tuhan jerih payahmu tidak sia-sia.",
      ),
    ],
  },
  {
    slug: "keputusan",
    title: "Keputusan",
    summary:
      "Memilih jalan yang benar — meminta hikmat dan percaya Tuhan meluruskan.",
    category: "life",
    keywords: ["memilih", "rencana", "decision", "arah", "masa depan"],
    reflection:
      "Keputusan besar dan kecil bisa dibawa dalam doa. Tuhan senang memberi hikmat.",
    prayer:
      "Tuhan, tunjukkan jalan-Mu. Aku tidak mau bersandar hanya pada pengertianku.",
    relatedSlugs: ["kebijaksanaan", "doa", "iman", "ketaatan"],
    verses: [
      v(
        "Amsal 3:5–6",
        "Amsal 3",
        5,
        "Percayalah kepada Tuhan dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri. Akuilah Dia dalam segala lakumu, maka Ia akan meluruskan jalanmu.",
      ),
      v(
        "Yakobus 1:5",
        "Yakobus 1",
        5,
        "Apabila di antara kamu ada yang kekurangan hikmat, hendaklah ia memintakannya kepada Allah, yang memberikan kepada semua orang dengan murah hati dan dengan tidak membangkit-bangkit, maka hal itu akan diberikan kepadanya.",
      ),
      v(
        "Mazmur 32:8",
        "Mazmur 32",
        8,
        "Aku hendak mengajar engkau, dan menunjukkan jalan yang harus kautempuh; Aku hendak memberi nasihat, mata-Ku tertuju kepadamu.",
      ),
      v(
        "Yeremia 6:16",
        "Yeremia 6",
        16,
        "Beginilah firman Tuhan: Berdirilah di jalan-jalan dan lihatlah, tanyakanlah jalan-jalan yang dahulu kala, di manakah jalan yang baik itu, dan berjalanlah di situ, maka kamu akan mendapat ketenangan bagi jiwamu.",
      ),
    ],
  },
  {
    slug: "pencobaan",
    title: "Pencobaan",
    summary:
      "Saat diuji — Tuhan memberi jalan keluar dan membentuk ketekunan.",
    category: "life",
    keywords: ["godaan", "ujian", "temptation", "dicobai"],
    reflection:
      "Pencobaan datang, tapi bukan tanpa jalan keluar. Tuhan setia menolong yang berseru.",
    prayer:
      "Tuhan, jangan biarkan aku jatuh dalam pencobaan. Berikan kekuatan untuk memilih yang benar.",
    relatedSlugs: ["kesucian", "kesabaran", "kekuatan", "doa"],
    verses: [
      v(
        "1 Korintus 10:13",
        "1 Korintus 10",
        13,
        "Pencobaan-pencobaan yang kamu alami ialah pencobaan biasa, yang tidak melebihi kekuatan manusia. Sebab Allah setia dan karena itu Ia tidak akan membiarkan kamu dicobai melampaui kekuatanmu. Pada waktu kamu dicobai Ia akan memberikan kepadamu jalan keluar, sehingga kamu dapat menanggungnya.",
      ),
      v(
        "Yakobus 1:2–3",
        "Yakobus 1",
        2,
        "Saudara-saudaraku, anggaplah sebagai suatu kebahagiaan, apabila kamu jatuh ke dalam berbagai-bagai pencobaan, sebab kamu tahu, bahwa ujian terhadap imanmu itu menghasilkan ketekunan.",
      ),
      v(
        "Yakobus 4:7",
        "Yakobus 4",
        7,
        "Karena itu tunduklah kepada Allah, dan lawanlah Iblis, maka ia akan lari dari padamu!",
      ),
      v(
        "Ibrani 2:18",
        "Ibrani 2",
        18,
        "Sebab oleh karena Ia sendiri telah menderita karena pencobaan, Ia dapat menolong mereka yang dicobai.",
      ),
    ],
  },
  {
    slug: "lidah",
    title: "Lidah & perkataan",
    summary:
      "Perkataan yang membangun — lidah yang dikuasai, bukan yang melukai.",
    category: "life",
    keywords: ["bicara", "perkataan", "lidah", "words", "gosip"],
    reflection:
      "Lidah kecil, dampaknya besar. Firman memanggil kita berkata-kata yang menguatkan.",
    prayer:
      "Tuhan, jaga mulutku. Buat perkataanku menjadi berkat, bukan luka.",
    relatedSlugs: ["marah", "persahabatan", "buah-roh", "kebijaksanaan"],
    verses: [
      v(
        "Amsal 18:21",
        "Amsal 18",
        21,
        "Hidup dan mati berada dalam kekuasaan lidah, siapa yang suka menggunakannya, akan memakan buahnya.",
      ),
      v(
        "Efesus 4:29",
        "Efesus 4",
        29,
        "Janganlah ada perkataan kotor keluar dari mulutmu, tetapi pakailah perkataan yang baik untuk membangun, di mana perlu, supaya mereka yang mendengarnya, beroleh kasih karunia.",
      ),
      v(
        "Yakobus 1:26",
        "Yakobus 1",
        26,
        "Jikalau ada seorang menganggap dirinya beribadah, tetapi tidak mengekang lidahnya, ia menipu dirinya sendiri, maka sia-sialah ibadahnya.",
      ),
      v(
        "Amsal 15:4",
        "Amsal 15",
        4,
        "Lidah yang lembut adalah pohon kehidupan, tetapi lidah yang curang menghancurkan semangat.",
      ),
    ],
  },
  {
    slug: "pelayanan",
    title: "Pelayanan",
    summary:
      "Melayani seperti Kristus — bukan untuk dilihat, tapi untuk mengasihi.",
    category: "life",
    keywords: ["melayani", "hamba", "service", "ministry", "melayani"],
    reflection:
      "Yang terbesar dalam Kerajaan Allah adalah yang melayani — meneladani Anak Manusia.",
    prayer:
      "Tuhan, buat aku hamba yang rendah hati. Tunjukkan di mana aku bisa melayani hari ini.",
    relatedSlugs: ["kerendahan-hati", "gereja-komunitas", "kasih", "kerja"],
    verses: [
      v(
        "Markus 10:45",
        "Markus 10",
        45,
        "Karena Anak Manusia juga datang bukan untuk dilayani, melainkan untuk melayani dan untuk memberikan nyawa-Nya menjadi tebusan bagi banyak orang.",
      ),
      v(
        "1 Petrus 4:10",
        "1 Petrus 4",
        10,
        "Layanilah seorang akan yang lain, sesuai dengan karunia yang telah diperoleh tiap-tiap orang sebagai pengurus yang baik dari kasih karunia Allah.",
      ),
      v(
        "Galatia 5:13",
        "Galatia 5",
        13,
        "Sebab kamu telah dipanggil kepada kemerdekaan, saudara-saudara. Hanya janganlah kamu mempergunakan kemerdekaan itu sebagai kesempatan untuk hidup dalam dosa, melainkan layanilah seorang akan yang lain oleh kasih.",
      ),
      v(
        "Yohanes 13:14–15",
        "Yohanes 13",
        14,
        "Jadi jikalau Aku membasuh kakimu, Aku yang adalah Tuhan dan Gurumu, maka kamupun wajib saling membasuh kaki; sebab Aku telah memberikan suatu teladan kepada kamu, supaya kamu juga berbuat sama seperti yang telah Kuperbuat kepadamu.",
      ),
    ],
  },

  // ─── Promise ───────────────────────────────────────────────────
  {
    slug: "kesetiaan-tuhan",
    title: "Kesetiaan Tuhan",
    summary:
      "Allah tidak berubah — janji-Nya teguh dari generasi ke generasi.",
    category: "promise",
    keywords: ["setia", "janji", "pemeliharaan", "faithful"],
    reflection:
      "Kesetiaan Tuhan baru tiap pagi. Ia tidak berubah meski kita goyah.",
    prayer:
      "Tuhan yang setia, terima kasih Engkau tidak meninggalkan aku. Teguhkan hatiku pada janji-Mu.",
    relatedSlugs: ["pengharapan", "pemeliharaan", "penyertaan", "keselamatan"],
    verses: [
      v(
        "Ulangan 7:9",
        "Ulangan 7",
        9,
        "Sebab itu haruslah kauketahui, bahwa Tuhan, Allahmu, Dialah Allah, Allah yang setia, yang tetap mengingat perjanjian dan kasih setia-Nya terhadap orang yang mengasihi Dia dan berpegang pada perintah-Nya, sampai kepada beribu-ribu keturunan.",
      ),
      v(
        "Ratapan 3:22–23",
        "Ratapan 3",
        22,
        "Tak berkesudahan kasih setia Tuhan, tak habis-habisnya belas kasihan-Nya, selalu baru tiap pagi; besar kesetiaan-Mu!",
      ),
      v(
        "Ibrani 10:23",
        "Ibrani 10",
        23,
        "Marilah kita teguh berpegang pada pengakuan tentang pengharapan kita, sebab Ia yang menjanjikannya adalah setia.",
      ),
      v(
        "2 Timotius 2:13",
        "2 Timotius 2",
        13,
        "Jika kita tidak setia, Dia tetap setia, karena Dia tidak dapat menyangkal diri-Nya.",
      ),
    ],
  },
  {
    slug: "penyertaan",
    title: "Penyertaan Tuhan",
    summary:
      "Engkau tidak sendirian — Aku menyertai engkau ke mana pun engkau pergi.",
    category: "promise",
    keywords: ["menyertai", "hadir", "beserta", "presence"],
    reflection:
      "Janji penyertaan Tuhan menenangkan langkah — bahkan di lembah kekelaman.",
    prayer:
      "Tuhan, sadarkan aku akan kehadiran-Mu hari ini. Aku tidak berjalan sendiri.",
    relatedSlugs: ["ketakutan", "kesepian", "pemeliharaan", "perlindungan"],
    verses: [
      v(
        "Yosua 1:9",
        "Yosua 1",
        9,
        "Bukankah telah Kuperintahkan kepadamu: kuatkan dan teguhkanlah hatimu? Janganlah kecut dan tawar hati, sebab Tuhan, Allahmu, menyertai engkau, ke mana pun engkau pergi.",
      ),
      v(
        "Matius 28:20",
        "Matius 28",
        20,
        "Dan ajarlah mereka melakukan segala sesuatu yang telah Kuperintahkan kepadamu. Dan ketahuilah, Aku menyertai kamu senantiasa sampai kepada akhir zaman.",
      ),
      v(
        "Mazmur 23:4",
        "Mazmur 23",
        4,
        "Sekalipun aku berjalan dalam lembah kekelaman, aku tidak takut bahaya, sebab Engkau besertaku; gada-Mu dan tongkat-Mu, itulah yang menghibur aku.",
      ),
      v(
        "Yesaya 41:10",
        "Yesaya 41",
        10,
        "Janganlah takut, sebab Aku menyertai engkau, janganlah bimbang, sebab Aku ini Allahmu; Aku akan meneguhkan, bahkan akan menolong engkau, Aku akan memegang engkau dengan tangan kanan-Ku yang membawa kemenangan.",
      ),
    ],
  },
  {
    slug: "pemeliharaan",
    title: "Pemeliharaan Tuhan",
    summary:
      "Allah yang mencukupi — merawat, memberi, dan tidak meninggalkan anak-anak-Nya.",
    category: "promise",
    keywords: ["mencukupi", "rejeki", "providence", "berkat", "memelihara"],
    reflection:
      "Pemeliharaan Tuhan lebih luas dari rekening. Ia peduli pada kebutuhanmu yang sejati.",
    prayer:
      "Bapa, ajar aku percaya bahwa Engkau memelihara. Buat aku cukup dan bersyukur.",
    relatedSlugs: ["uang", "syukur", "penyertaan", "kesetiaan-tuhan"],
    verses: [
      v(
        "Mazmur 23:1",
        "Mazmur 23",
        1,
        "Tuhan adalah gembalaku, sekurang-kurangnya aku tidak kekurangan.",
      ),
      v(
        "Matius 6:26",
        "Matius 6",
        26,
        "Pandanglah burung-burung di langit, yang tidak menabur dan tidak menuai dan tidak mengumpulkan bekal dalam lumbung, namun diberi makan oleh Bapamu yang di sorga. Bukankah kamu jauh melebihi burung-burung itu?",
      ),
      v(
        "Filipi 4:19",
        "Filipi 4",
        19,
        "Allahku akan memenuhi segala keperluanmu menurut kekayaan dan kemuliaan-Nya dalam Kristus Yesus.",
      ),
      v(
        "Mazmur 37:25",
        "Mazmur 37",
        25,
        "Dahulu aku muda, sekarang telah menjadi tua, tetapi tidak pernah kulihat orang benar ditinggalkan, atau anak cucunya meminta-minta roti.",
      ),
    ],
  },
  {
    slug: "perlindungan",
    title: "Perlindungan Tuhan",
    summary:
      "Allah sebagai tempat perlindungan — benteng bagi yang berlindung pada-Nya.",
    category: "promise",
    keywords: ["lindungi", "benteng", "protection", "aman", "pertolongan"],
    reflection:
      "Perlindungan Tuhan tidak selalu berarti bebas dari bahaya — tapi tidak pernah tanpa Dia.",
    prayer:
      "Tuhan, Engkaulah tempat perlindunganku. Jagalah aku dan keluargaku hari ini.",
    relatedSlugs: ["penyertaan", "ketakutan", "pemeliharaan", "kekuatan"],
    verses: [
      v(
        "Mazmur 91:1–2",
        "Mazmur 91",
        1,
        "Orang yang duduk dalam lindungan Yang Mahatinggi dan bermalam dalam naungan Yang Mahakuasa akan berkata kepada Tuhan: »Tempat perlindunganku dan kubu pertahananku, Allahku, yang kupercayai.«",
      ),
      v(
        "Mazmur 46:2",
        "Mazmur 46",
        2,
        "Allah itu bagi kita tempat perlindungan dan kekuatan, sebagai penolong dalam kesesakan sangat terbukti.",
      ),
      v(
        "2 Tesalonika 3:3",
        "2 Tesalonika 3",
        3,
        "Tetapi Tuhan adalah setia. Ia akan menguatkan hatimu dan memelihara kamu terhadap yang jahat.",
      ),
      v(
        "Amsal 18:10",
        "Amsal 18",
        10,
        "Nama Tuhan adalah menara yang kuat, ke sanalah orang benar berlari dan ia menjadi selamat.",
      ),
    ],
  },
  {
    slug: "kebangkitan-harapan",
    title: "Kebangkitan & pengharapan kekal",
    summary:
      "Kristus bangkit — jaminan hidup kekal dan pengharapan yang tidak sia-sia.",
    category: "promise",
    keywords: ["bangkit", "kebangkitan", "kekal", "surga", "resurrection"],
    reflection:
      "Karena Kristus bangkit, air mata dan maut bukan kata terakhir bagi orang percaya.",
    prayer:
      "Tuhan Yesus yang bangkit, teguhkan pengharapanku pada hidup kekal bersama-Mu.",
    relatedSlugs: ["keselamatan", "pengharapan", "kesedihan", "iman"],
    verses: [
      v(
        "1 Korintus 15:20",
        "1 Korintus 15",
        20,
        "Tetapi yang benar ialah, bahwa Kristus telah dibangkitkan dari antara orang mati, sebagai yang sulung dari orang-orang yang telah meninggal.",
      ),
      v(
        "Yohanes 11:25–26",
        "Yohanes 11",
        25,
        "Jawab Yesus: »Akulah kebangkitan dan hidup; barangsiapa percaya kepada-Ku, ia akan hidup walaupun ia sudah mati, dan setiap orang yang hidup dan yang percaya kepada-Ku, tidak akan mati selama-lamanya. Percayakah engkau akan hal ini?«",
      ),
      v(
        "1 Tesalonika 4:14",
        "1 Tesalonika 4",
        14,
        "Karena jikalau kita percaya, bahwa Yesus telah mati dan telah bangkit, maka kita percaya juga bahwa Allah akan membawa pula mereka yang sudah tidur dalam Yesus bersama-sama dengan Dia.",
      ),
      v(
        "1 Petrus 1:3",
        "1 Petrus 1",
        3,
        "Terpujilah Allah dan Bapa Tuhan kita Yesus Kristus, yang karena belas kasihan-Nya yang besar telah melahirkan kita kembali oleh kebangkitan Yesus Kristus dari antara orang mati, kepada suatu hidup yang penuh pengharapan.",
      ),
    ],
  },
];

export function getTopicCategory(id: BibleTopicCategoryId) {
  return BIBLE_TOPIC_CATEGORIES.find((item) => item.id === id)!;
}

export function getBibleTopic(slug: string): BibleTopic | null {
  return BIBLE_TOPICS.find((topic) => topic.slug === slug) ?? null;
}

export function getFeaturedTopics() {
  return BIBLE_TOPICS.filter((topic) => topic.featured);
}

export function getTopicsByCategory(category: BibleTopicCategoryId | "all") {
  if (category === "all") return BIBLE_TOPICS;
  return BIBLE_TOPICS.filter((topic) => topic.category === category);
}

export function getRelatedTopics(topic: BibleTopic, limit = 4): BibleTopic[] {
  const fromSlugs = (topic.relatedSlugs ?? [])
    .map((slug) => getBibleTopic(slug))
    .filter((item): item is BibleTopic => Boolean(item));

  if (fromSlugs.length >= limit) return fromSlugs.slice(0, limit);

  const seen = new Set(fromSlugs.map((item) => item.slug).concat(topic.slug));
  const sameCategory = BIBLE_TOPICS.filter(
    (item) => item.category === topic.category && !seen.has(item.slug),
  );

  return [...fromSlugs, ...sameCategory].slice(0, limit);
}

export function searchBibleTopics(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return BIBLE_TOPICS;
  return BIBLE_TOPICS.filter((topic) => {
    const haystack = [
      topic.title,
      topic.summary,
      topic.slug,
      topic.reflection ?? "",
      topic.prayer ?? "",
      ...topic.keywords,
      ...topic.verses.map((verse) => verse.reference),
      getTopicCategory(topic.category).label,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

/** Deep-link ke reader dengan fokus ayat. */
export function topicVerseHref(verse: BibleTopicVerse) {
  const params = new URLSearchParams();
  params.set("browse", "1");
  params.set("passage", verse.passage);
  if (verse.verse) params.set("verse", String(verse.verse));
  return `/baca?${params.toString()}`;
}

export function getTopicCount() {
  return BIBLE_TOPICS.length;
}
