/**
 * Kebiasaan, ritual, dan adat istiadat yang tercatat dalam Alkitab.
 */

export type BibleCustomCategoryId =
  | "perayaan"
  | "perjanjian"
  | "kesucian"
  | "ibadah"
  | "simbol";

export type BibleCustomVerse = {
  reference: string;
  passage: string;
  verse?: number;
  text: string;
};

export type BibleCustom = {
  slug: string;
  title: string;
  summary: string;
  category: BibleCustomCategoryId;
  era: "pl" | "pb" | "keduanya";
  keywords: string[];
  featured?: boolean;
  /** Latar: mengapa adat ini ada */
  background: string;
  /** Apa yang dilakukan — praktiknya */
  practice: string;
  /** Makna rohani / teologis */
  meaning: string;
  /** Bagaimana gereja/perjanjian baru membacanya (opsional) */
  today?: string;
  relatedSlugs?: string[];
  verses: BibleCustomVerse[];
};

export type BibleCustomCategory = {
  id: BibleCustomCategoryId;
  label: string;
  description: string;
};

export const BIBLE_CUSTOM_CATEGORIES: BibleCustomCategory[] = [
  {
    id: "perayaan",
    label: "Perayaan & hari raya",
    description: "Paskah, Sabat, Pentakosta, dan hari kudus Israel",
  },
  {
    id: "perjanjian",
    label: "Tanda perjanjian",
    description: "Sunat, darah, dan tanda kesetiaan Allah",
  },
  {
    id: "kesucian",
    label: "Kesucian & kebersihan",
    description: "Aturan niddah, pembasuhan, dan makanan halal",
  },
  {
    id: "ibadah",
    label: "Ibadah & korban",
    description: "Korban, nazir, puasa, dan etika di tempat kudus",
  },
  {
    id: "simbol",
    label: "Simbol & tanda",
    description: "Sandals, darah di pintu, mezuzah, dan lambang iman",
  },
];

function v(
  reference: string,
  passage: string,
  verse: number,
  text: string,
): BibleCustomVerse {
  return { reference, passage, verse, text };
}

export const BIBLE_CUSTOMS: BibleCustom[] = [
  {
    slug: "paskah",
    title: "Paskah (Pesach)",
    summary:
      "Perayaan keluaran dari Mesir — domba sembelihan, darah di ambang pintu, roti tidak beragi, dan pembebasan oleh tangan Tuhan.",
    category: "perayaan",
    era: "pl",
    keywords: ["pesach", "domba", "keluaran", "roti tidak beragi", "malam"],
    featured: true,
    background:
      "Paskah adalah perayaan terbesar Israel — mengingat malam ketika Tuhan \"melintas\" di Mesir dan membunuh anak sulung bangsa, tetapi melindungi rumah-rumah Israel yang ambang pintunya ditandai darah domba.\n\nPerayaan ini sudah diperintahkan sebelum kejadian itu, sebagai persiapan iman: domba pilih, darah, tidak beragi, siap berangkat.",
    practice:
      "Setiap keluarga memilih domba jantan sempurna, disembelih pada senja tanggal 14 Abib. Darahnya di oles ke ambang pintu atas dan kedua tiang pintu. Daging dimakan malam itu — panggang api, dengan roti tidak beragi dan sayur pahit. Tidak boleh ada sisa sampai pagi; mereka makan dengan sandal terikat, tongkat di tangan, siap keluar.",
    meaning:
      "Paskah mengajarkan bahwa keselamatan adalah anugerah yang ditandai — bukan karena Israel lebih layak, melainkan karena darah pengganti. Domba Paskah menjadi bayangan Kristus, Anak Domba Allah, yang darah-Nya melindungi dari penghakiman.",
    today:
      "Perjanjian Baru: Perjamuan Tuhan (Eucharist) mengambil unsur roti dan cawan dari Paskah. Gereja merayakan kemenangan Kristus atas dosa dan maut — keluaran rohani yang lebih besar dari Mesir.",
    relatedSlugs: ["darah-ambang-pintu", "sunat", "sabat", "pentakosta"],
    verses: [
      v(
        "Keluaran 12:13",
        "Keluaran 12",
        13,
        "Darahlah yang menjadi tanda bagimu di rumah-rumah tempat engkau diam. Apabila Aku melihat darah itu, maka Aku akan lewat dari padamu, sehingga kamu tidak akan ditimpa tulah pemusnahan, apabila Aku menghukum tanah Mesir.",
      ),
      v(
        "Keluaran 12:11",
        "Keluaran 12",
        11,
        "Demikianlah harus kamu makan: dengan pinggang berikat, dengan kasut di kaki dan tongkat di tangan. Kamu harus memakannya dengan tergesa-gesa. Itulah Paskah bagi TUHAN.",
      ),
      v(
        "1 Korintus 5:7",
        "1 Korintus 5",
        7,
        "… Kristus, anak domba Paskah kita, telah disembelih.",
      ),
    ],
  },
  {
    slug: "darah-ambang-pintu",
    title: "Darah di ambang pintu",
    summary:
      "Tanda perlindungan pada malam Paskah — darah domba di ambang pintu menyelamatkan dari tulah pemusnahan.",
    category: "simbol",
    era: "pl",
    keywords: ["pintu", "ambang", "darah", "paskah", "lambang"],
    featured: true,
    background:
      "Pada malam tulah terakhir di Mesir, perbedaan bukan dari etnisitas semata, melainkan dari tanda yang Tuhan tetapkan: darah di pintu. Rumah tanpa tanda menghadapi kematian anak sulung; rumah bertanda dilindungi.\n\nIni bukan magic — melainkan respons iman terhadap perintah Allah.",
    practice:
      "Ambil seikat hisop, celupkan ke darah domba Paskah yang ada dalam mangkuk, dan oleskan ke ambang pintu atas dan ke kedua tiang pintu. Tidak boleh keluar rumah sampai pagi (Keluaran 12:22).",
    meaning:
      "Darah di pintu mengajarkan bahwa perlindungan datang dari lambang yang Allah tetapkan, bukan dari usaha manusia. Pintu rumah menjadi altar — tempat iman bertemu dengan anugerah.",
    today:
      "Kisah ini membayangkan salib: darah Kristus melindungi mereka yang percaya. \"Darah Yesus… membersihkan kita dari segala dosa\" (1 Yohanes 1:7).",
    relatedSlugs: ["paskah", "sunat"],
    verses: [
      v(
        "Keluaran 12:7",
        "Keluaran 12",
        7,
        "Lalu mereka harus mengambil darah domba-domba itu dan memasukkannya ke ambang pintu atas dan ke tiang pintu rumah, di mana mereka memakan daging domba-domba itu.",
      ),
      v(
        "Keluaran 12:23",
        "Keluaran 12",
        23,
        "Sebab TUHAN akan lewat untuk menulahi orang Mesir, tetapi apabila Ia melihat darah di ambang pintu atas dan tiang pintu itu, maka TUHAN akan lewat dari pintu rumah itu, dan tidak membiarkan pemusnah masuk ke rumahmu untuk menulahi.",
      ),
    ],
  },
  {
    slug: "sunat",
    title: "Sunat",
    summary:
      "Tanda perjanjian pada laki-laki Israel — dari Abraham hingga bayi delapan hari, tanda milik umat Allah.",
    category: "perjanjian",
    era: "keduanya",
    keywords: ["perjanjian", "Abraham", "tanda", "delapan hari"],
    featured: true,
    background:
      "Allah memberi Abraham sunat sebagai tanda perjanjian antara Dia dan keturunan Abraham. Setiap laki-laki harus disunat — termasuk hamba dan orang asing dalam rumah tangga.\n\nSunat bukan sekadar ritual medis; ia menandai identitas umat perjanjian.",
    practice:
      "Setiap laki-laki di antara kamu harus disunat. Sunatilah kulit khatanmu, dan itulah tanda perjanjian antara Aku dan kamu. Anak laki-laki delapan hari harus disunat, termasuk yang lahir di rumah atau dibeli (Kejadian 17:10-13).",
    meaning:
      "Sunat melambangkan pemotongan daging — penyerahan diri kepada Allah. Dalam Perjanjian Baru, Paulus menegaskan: \"Bukan sunat lahiriah… melainkan sunat hati\" (Roma 2:29). Yang penting adalah hati yang baru.",
    today:
      "Gereja tidak mewajibkan sunat untuk keselamatan (Kisah Para Rasul 15). Baptisan menjadi tanda masuk umat Allah — \"sunat Kristus\" rohani (Kolose 2:11-12).",
    relatedSlugs: ["paskah", "darah-ambang-pintu"],
    verses: [
      v(
        "Kejadian 17:10",
        "Kejadian 17",
        10,
        "Inilah perjanjian-Ku, yang harus kamu pelihara, yaitu perjanjian antara Aku dan kamu serta keturunanmu: Sunatlah kiranya kulit khatanmu.",
      ),
      v(
        "Kejadian 17:11",
        "Kejadian 17",
        11,
        "Sunat itulah tanda perjanjian antara Aku dan kamu.",
      ),
    ],
  },
  {
    slug: "menstruasi-niddah",
    title: "Aturan menstruasi (Niddah)",
    summary:
      "Hukum kebersihan ritual perempuan — masa niddah, pemisahan sementara, dan pembasuhan sebelum kembali ke kekudusan komunal.",
    category: "kesucian",
    era: "pl",
    keywords: ["niddah", "haid", "kebersihan", "Imamat 15", "perempuan"],
    featured: true,
    background:
      "Imamat 15 memberi aturan tentang aliran tubuh — termasuk menstruasi. Dalam konteks Israel kuno, kesucian ritual memungkinkan umat dekat dengan kehadiran Allah di kemah suci.\n\nAturan ini bukan penghinaan terhadap perempuan; ia bagian dari sistem holistik tentang kehidupan, darah, dan kekudusan.",
    practice:
      "Apabila perempuan mendapat aliran darah, niddah-nya tujuh hari lamanya. Barang siapa menyentuhnya, najislah ia sampai petang. Perempuan itu najis selama masa haid; siapa menyentuh tempat tidurnya harus membasuh pakaian dan mandi (Imamat 15:19-24).\n\nSetelah haid selesai, ia menunggu tujuh hari lagi, lalu membawa korban untuk disucikan.",
    meaning:
      "Sistem ini mengajarkan bahwa tubuh dan darah milik Tuhan — kehidupan dan kekudusan saling terkait. Najis ritual bukan \"dosa moral\" melainkan status sementara yang menunggu pembasuhan.",
    today:
      "Perjanjian Baru menegaskan bahwa Kristus menyucikan sepenuhnya (Ibrani 10). Aturan niddah tidak lagi mengikat gereja, tetapi prinsip penghormatan tubuh dan kekudusan tetap relevan.",
    relatedSlugs: ["pembasuhan-ritual", "makanan-halal"],
    verses: [
      v(
        "Imamat 15:19",
        "Imamat 15",
        19,
        "Apabila perempuan mendapat aliran darah, niddah-nya tujuh hari lamanya. Barangsiapa menyentuh perempuan itu, najislah ia sampai petang.",
      ),
      v(
        "Imamat 15:28",
        "Imamat 15",
        28,
        "Apabila perempuan itu sudah bersih dari alirannya, haruslah ia menghitung tujuh hari, barulah ia disucikan.",
      ),
    ],
  },
  {
    slug: "lepas-sandal",
    title: "Lepas sandal di tempat kudus",
    summary:
      "Perintah Tuhan kepada Musa di semak berapi: \"Lepaslah kasutmu, sebab tempat engkau berdiri itu tanah yang kudus.\"",
    category: "simbol",
    era: "pl",
    keywords: ["Musa", "Horeb", "semak", "kasut", "kudus"],
    featured: true,
    background:
      "Musa sedang menggembalakan kambing domba Jitro ketika ia melihat semak yang menyala tetapi tidak habis. Ketika ia mendekat, Allah berfirman dari tengah semak itu.\n\nSebelum Musa menerima panggilan, ia diajar etika kehadiran: tempat di mana Allah hadir adalah kudus — dan tubuh harus merespons.",
    practice:
      "Allah berfirman: \"Jangan datang ke mari! Lepaslah kasutmu dari kakimu, sebab tempat engkau berdiri itu tanah yang kudus\" (Keluaran 3:5). Musa menuruti — dan baru kemudian menerima misi membebaskan Israel.",
    meaning:
      "Melepas sandal adalah tanda kerendahan hati, penghormatan, dan kesadaran: kita berdiri di hadapan Yang Mahakudus. Bukan tanah geografis yang suci, melainkan kehadiran Allah yang menuntut respons.",
    today:
      "Tradisi gereja: doa berlutut, melepas topi, atau hening sebelum ibadah — ekspresi serupa. Yohanes Pembaptis menyebut Yesus: \"Ia yang sandal-Nya tidak layak kujanjalkan\" (Yohanes 1:27).",
    relatedSlugs: ["paskah", "korban-bakaran"],
    verses: [
      v(
        "Keluaran 3:5",
        "Keluaran 3",
        5,
        "Firman-Nya: \"Jangan datang ke mari! Lepaslah kasutmu dari kakimu, sebab tempat engkau berdiri itu tanah yang kudus.\"",
      ),
      v(
        "Yosua 5:15",
        "Yosua 5",
        15,
        "Lalu Panglima bala tentara TUHAN berfirman kepada Yosua: \"Tanggalkan kasutmu dari kakimu, sebab tempat engkau berdiri itu kudus.\" Lalu Yosua pun berbuat demikian.",
      ),
    ],
  },
  {
    slug: "sabat",
    title: "Sabat (Shabbat)",
    summary:
      "Hari ketujuh perhentian — peringatan penciptaan dan perjanjian, dihormati dengan berhenti dari pekerjaan.",
    category: "perayaan",
    era: "keduanya",
    keywords: ["shabbat", "hari ketujuh", "perhentian", "istirahat"],
    featured: true,
    background:
      "Allah berhenti pada hari ketujuh setelah penciptaan — dan memberkati hari itu. Sabat menjadi tanda perjanjian antara Tuhan dan Israel (Keluaran 31:13).\n\nIa bukan hanya istirahat fisik, melainkan pengakuan bahwa hidup bergantung pada Allah, bukan produktivitas manusia.",
    practice:
      "Ingatlah dan kuduskanlah hari Sabat. Enam hari lamanya engkau harus bekerja, tetapi pada hari ketujuh haruslah hari perhentian penuh bagi TUHAN. Jangan kerjakan pekerjaan apa pun — engkau, anak-anakmu, hamba, bahkan hewan (Keluaran 20:8-10).",
    meaning:
      "Sabat mengajarkan kepercayaan: dunia tidak runtuh jika kita berhenti. Allah cukup. Israel diingatkan bahwa mereka pernah hamba di Mesir — dan Tuhan yang membebaskan.",
    today:
      "Kebanyakan gereja merayakan hari Tuhan (Minggu) sebagai peringatan kebangkitan. Prinsip Sabat tetap: istirahat rohani, persekutuan, dan mengingat keselamatan Allah.",
    relatedSlugs: ["paskah", "pentakosta"],
    verses: [
      v(
        "Keluaran 20:8",
        "Keluaran 20",
        8,
        "Ingatlah dan kuduskanlah hari Sabat.",
      ),
      v(
        "Keluaran 31:13",
        "Keluaran 31",
        13,
        "… supaya kamu ingat, bahwa Akulah TUHAN, yang menguduskan kamu.",
      ),
    ],
  },
  {
    slug: "pentakosta",
    title: "Pentakosta (Shavuot)",
    summary:
      "Hari raya tujuh minggu setelah Paskah — perayaan roti baru, pemberian Taurat, dan di PB: pencurahan Roh Kudus.",
    category: "perayaan",
    era: "keduanya",
    keywords: ["shavuot", "roti baru", "Roh Kudus", "tujuh minggu"],
    featured: true,
    background:
      "Shavuot awalnya perayaan panen gandum — \"hari mempersembahkan roti baru\" (Imamat 23:16). Tradisi Yahudi mengaitkannya dengan pemberian Taurat di Sinai.\n\nDalam Perjanjian Baru, Pentakosta menjadi momen Roh Kudus dicurahkan — gereja dilahirkan.",
    practice:
      "Hitunglah tujuh minggu penuh mulai hari following Sabat… lalu persembahkan korban roti new kepada TUHAN (Imamat 23:15-17). Orang Israel berkumpul di Yerusalem dari segala bangsa.",
    meaning:
      "Pentakosta menghubungkan panen fisik dengan panen rohani: Taurat menulis firman di batu; Roh menulis firman di hati. Tiga ribu jiwa bertobat — buah pertama dari misi global.",
    today:
      "Gereja merayakan Pentakosta sebagai kelahiran gereja dan pencurahan Roh. Warna merah/putih sering dipakai — api, angin, lidah api.",
    relatedSlugs: ["paskah", "sabat"],
    verses: [
      v(
        "Kisah Para Rasul 2:1-4",
        "Kisah Para Rasul 2",
        1,
        "Ketika tiba hari Pentakosta, mereka semua berkumpul di satu tempat. Tiba-tiba datanglah bunyi… dan tampaklah lidah-lidah api… lalu mereka semua penuh dengan Roh Kudus.",
      ),
      v(
        "Imamat 23:16",
        "Imamat 23",
        16,
        "… sampai hari sesudah Sabat yang ketujuh haruslah kamu hitung lima puluh hari, lalu kamu harus mempersembahkan korban sajian yang baru kepada TUHAN.",
      ),
    ],
  },
  {
    slug: "pembasuhan-ritual",
    title: "Pembasuhan ritual (Mikveh)",
    summary:
      "Mandi dan basuh pakaian untuk kembali dari najis ritual — simbol penyucian sebelum mendekati kekudusan.",
    category: "kesucian",
    era: "pl",
    keywords: ["mikveh", "mandi", "najis", "sucikan", "basuh"],
    background:
      "Imamat dan Bilangan penuh dengan aturan: sentuh mayat, lepra, aliran tubuh — semua menuntun ke pembasuhan. Air bukan magic; ia tanda transisi dari najis ke tahor (suci ritual).\n\nKolam mikveh di arkeologi Israel menunjukkan praktik ini hidup di masyarakat Yahudi.",
    practice:
      "Barangsiapa menyentuh bangkai manusia najislah tujuh hari. Harus disucikan dengan air pada hari ketiga dan hari ketujuh (Bilangan 19:11-12). Basuh pakaian, mandi dengan air — barulah ia tahor.",
    meaning:
      "Pembasuhan mengajarkan bahwa dosa dan kematian meninggalkan jejak — dan Allah menyediakan jalan kembali. Air menjadi simbol pembaruan.",
    today:
      "Baptisan mengambil unsur pembasuhan — \"Baptisan… yang sekarang menyelamatkan kamu… bukan perbuatan menjauhkan kotoran tubuh, melainkan permohonan kepada Allah\" (1 Petrus 3:21).",
    relatedSlugs: ["menstruasi-niddah", "makanan-halal"],
    verses: [
      v(
        "Bilangan 19:19",
        "Bilangan 19",
        19,
        "… disucikannya orang itu pada hari ketiga dan pada hari ketujuh; demikianlah orang itu disucikan.",
      ),
      v(
        "Imamat 15:13",
        "Imamat 15",
        13,
        "Apabila laki-laki itu sudah bersih dari lelehannya, haruslah ia menghitung tujuh hari untuk disucikan; kemudian haruslah ia membasuh pakaiannya, membasuh tubuhnya dengan air spring, barulah ia tahor.",
      ),
    ],
  },
  {
    slug: "makanan-halal",
    title: "Makanan halal (Kashrut)",
    summary:
      "Aturan makanan Israel — hewan yang boleh dimakan, darah dilarang, daging dan susu tidak dicampur.",
    category: "kesucian",
    era: "pl",
    keywords: ["kosher", "kashrut", "babi", "darah", "Imamat 11"],
    background:
      "Imamat 11 dan Ulangan 14 membedah hewan yang \"tahor\" (boleh dimakan) dan \"tame\" (tidak). Babi, udang, dan hewan tertentu dilarang. Darah dilarang keras — \"sebab darah itulah yang membawa nyawa\" (Imamat 17:11).",
    practice:
      "Binatang yang membelah kuku, mamalia yang memamah biak, ikan bersirip dan sisik — boleh. Jangan makan darah. Jangan masak anak kambing dalam susu induknya (Imamat 11; Ulangan 14:21).",
    meaning:
      "Makanan sehari-hari menjadi pengingat kudus: Israel beda, hidup untuk Allah. Setiap hidangan bisa jadi doa syukur.",
    today:
      "Yesus menegaskan bahwa bukan yang masuk ke mulut menajiskan, melainkan yang keluar dari hati (Markus 7). Paulus: \"segala sesuatu halal, tetapi tidak semua berguna\" (1 Korintus 10:23).",
    relatedSlugs: ["pembasuhan-ritual", "korban-bakaran"],
    verses: [
      v(
        "Imamat 11:3",
        "Imamat 11",
        3,
        "Semua binatang yang berkuku belah, yang memamah biak, boleh kamu makan.",
      ),
      v(
        "Imamat 17:10",
        "Imamat 17",
        10,
        "Setiap orang… yang makan darah, Aku akan berhenti memusnahkannya.",
      ),
    ],
  },
  {
    slug: "korban-bakaran",
    title: "Korban bakaran (Olah)",
    summary:
      "Persembahan hewan yang seluruhnya dibakar di mezbah — simbol penyerahan total dan pengganti.",
    category: "ibadah",
    era: "pl",
    keywords: ["korban", "mezbah", "bakaran", "pengganti"],
    background:
      "Sistem korban Israel bukan \"membeli\" berkat Allah — melainkan cara umat merespons dosa, syukur, dan perjanjian. Korban bakaran: hewan sempurna, seluruhnya naik sebagai bau yang menyenangkan.",
    practice:
      "Taruh tanganmu di atas kepala hewan korban, lalu sembelih… dan bakarlah seluruhnya di mezbah (Imamat 1:4-9). Imam mempersembahkan darah; lemak dibakar; daging habis untuk Allah.",
    meaning:
      "Korban mengajarkan bahwa dosa membutuhkan pengganti — darah dan nyawa. Tanpa penumpahan darah, tidak ada pengampunan (Ibrani 9:22). Kristus adalah korban sekali untuk selama-lamanya.",
    today:
      "Ibadah Kristen: persembahan diri sebagai korban yang hidup (Roma 12:1). Perjamuan Tuhan — anggur dan roti — mengingat korban Kristus.",
    relatedSlugs: ["paskah", "lepas-sandal"],
    verses: [
      v(
        "Imamat 1:4",
        "Imamat 1",
        4,
        "Lalu haruslah ia meletakkan tangannya dengan tekan di atas kepala korban bakaran itu, supaya korban itu dapat diterima baginya, untuk mengadakan propisiasi baginya.",
      ),
      v(
        "Ibrani 10:12",
        "Ibrani 10",
        12,
        "Tetapi Ia, setelah mempersembahkan hanya satu korban saja karena dosa, Ia duduk untuk selama-lamanya…",
      ),
    ],
  },
  {
    slug: "nazir",
    title: "Nazar (Nazir)",
    summary:
      "Janji khusus untuk menguduskan diri — tidak minum anggur, tidak potong rambut, dan tidak dekat mayat.",
    category: "ibadah",
    era: "pl",
    keywords: ["Samson", "Samuel", "Yohanes Pembaptis", "rambut", "anggur"],
    background:
      "Nazir adalah laki-laki atau perempuan yang mengambil janji khusus kepada Tuhan — biasanya sementara, kadang seumur hidup (Samson, Samuel, Yohanes Pembaptis).\n\nMereka \"dikuduskan\" untuk misi atau permohonan khusus.",
    practice:
      "Jika seseorang… mengucapkan nazar nazir… ia harus menjauhi anggur… guntingan rambut kepalanya tidak boleh disentuh pisau cukur… tidak boleh dekat mayat (Bilangan 6:2-8). Pada akhir nazarnya, ia membawa korban dan mencukur rambut di pintu kemah pertemuan.",
    meaning:
      "Nazir menunjukkan bahwa hidup biasa bisa dipersembahkan secara ekstra — bukan karena hukum wajib, melainkan respons sukarela kepada Allah.",
    today:
      "Paulus mengambil nazar sementara (Kisah Para Rasul 18:18; 21:23-26) — contoh fleksibilitas budaya demi misi. Prinsip: kuduskan hidup untuk panggilan.",
    relatedSlugs: ["korban-bakaran", "puasa"],
    verses: [
      v(
        "Bilangan 6:5",
        "Bilangan 6",
        5,
        "Sepanjang nazarnya sebagai nazir, pisau cukur tidak boleh menyentuh kepalanya… haruslah ia kudus, dan harus dibiarkannya rambut kepalanya tumbuh.",
      ),
      v(
        "Hakim-Hakim 13:5",
        "Hakim-Hakim 13",
        5,
        "… sebab anak itu akan menjadi nazir Allah dari rahim ibunya.",
      ),
    ],
  },
  {
    slug: "puasa",
    title: "Puasa",
    summary:
      "Berpuasa sebagai ungkapan duka, tobat, permohonan, atau persiapan — Yom Kippur dan puasa pribadi.",
    category: "ibadah",
    era: "keduanya",
    keywords: ["puasa", "Yom Kippur", "berpuasa", "lapar"],
    featured: true,
    background:
      "Puasa muncul di seluruh Alkitab: Musa 40 hari di Sinai, Daud berpuasa untuk anaknya, Daniel berpuasa, Yesus 40 hari di padang gurun.\n\nHari Raya Pendamaian (Yom Kippur) adalah puasa wajib satu-satunya dalam Taurat.",
    practice:
      "Pada hari kesepuluh bulan ketujuh haruslah kamu merendahkan diri… janganlah kamu melakukan pekerjaan apapun, sebab itulah hari pengampunan dosa (Imamat 23:27-32). Puasa = afflicting the soul — menahan makan dan minum.",
    meaning:
      "Puasa mengosongkan diri agar ruang untuk Allah. Bukan pamer — Yesus mengajarkan puasa diam-diam di hadapan Bapa (Matius 6:16-18).",
    today:
      "Gereja: puasa Advent, Lent, atau puasa pribadi. Prinsip: bergantung pada Allah lebih dari makanan.",
    relatedSlugs: ["nazir", "sabat"],
    verses: [
      v(
        "Imamat 23:27",
        "Imamat 23",
        27,
        "… hari pendamaan… kamu harus merendahkan diri…",
      ),
      v(
        "Matius 6:16",
        "Matius 6",
        16,
        "Apabila kamu berpuasa, janganlah muram mukamu…",
      ),
    ],
  },
  {
    slug: "yom-kippur",
    title: "Yom Kippur (Hari Raya Pendamaian)",
    summary:
      "Hari paling kudus Israel — puasa, imam besar masuk Bait Suci, dan pengampunan dosa umat.",
    category: "perayaan",
    era: "pl",
    keywords: ["pendamaian", "kafarat", "imam besar", "puasa"],
    background:
      "Satu hari setiap tahun imam besar masuk Ruang Mahakudus — dengan darah korban — untuk mengadakan pendamaian bagi umat. Dua kambing: satu disembelih, satu \"azazel\" dibuang ke padang gurun.",
    practice:
      "Hari kesepuluh bulan ketujuh… kamu harus merendahkan diri… imam besar masuk ke dalam tabernakel… membawa darah ke dalam… untuk mengadakan pendamaian (Imamat 16).",
    meaning:
      "Yom Kippur menggarisbawahi: dosa tidak hilang begitu saja — butuh pengganti dan intersesi. Ibrani 9-10: Kristus masuk Bait Suci surgawi sekali untuk selamanya.",
    today:
      "Gereja tidak merayakan Yom Kippur secara liturgis, tetapi tema pendamaian adalah inti Injil.",
    relatedSlugs: ["puasa", "korban-bakaran", "paskah"],
    verses: [
      v(
        "Imamat 16:30",
        "Imamat 16",
        30,
        "… sebab pada hari ini akan diadakan pendamaian bagimu, untuk mentahirkan kamu; dari segala dosamu kamu akan ditahirkan di hadapan TUHAN.",
      ),
      v(
        "Ibrani 9:12",
        "Ibrani 9",
        12,
        "… dengan darah-Nya sendiri, dan bukan dengan darah kambing jantan dan anak lembu, Ia masuk ke dalam… Bait Suci…",
      ),
    ],
  },
  {
    slug: "sukkot",
    title: "Sukkot (Hari Raya Pondok-Daun)",
    summary:
      "Perayaan tujuh hari — tinggal di pondok-daun mengingat perjalanan padang gurun dan panen.",
    category: "perayaan",
    era: "pl",
    keywords: ["pondok", "tabernakel", "panen", "gurun"],
    background:
      "Sukkot adalah perayaan musim panen akhir — dan mengingat when Israel tinggal dalam pondok-daun selama 40 tahun di padang gurun.\n\nSukkot masih dirayakan oleh Yahudi hingga hari ini dengan membangun sukkah.",
    practice:
      "Mulai hari lima belas… haruslah kamu merayakan hari raya TUHAN tujuh hari… kamu harus tinggal dalam pondok-pondok tujuh hari (Imamat 23:34-43).",
    meaning:
      "Sukkot mengajarkan kerentanan dan pergantungan: rumah sementara, Allah pelindung. Sukacita — \"haruslah kamu bersukacita di hadapan TUHAN\" (Imamat 23:40).",
    today:
      "Yohanes 1:14 — \"Firman itu… dan berdiam di antara kita\" — kata \"berdiam\" (skenoo) terkait sukkah. Kristus \"pondok\" di antara manusia.",
    relatedSlugs: ["paskah", "pentakosta"],
    verses: [
      v(
        "Imamat 23:42",
        "Imamat 23",
        42,
        "Kamu harus tinggal dalam pondok-pondok tujuh hari…",
      ),
    ],
  },
  {
    slug: "mezuzah",
    title: "Mezuzah & tulisan di ambang pintu",
    summary:
      "Perintah mengikat firman di tangan, di dahi, dan di ambang pintu — mengingatkan kasih akan Allah sehari-hari.",
    category: "simbol",
    era: "pl",
    keywords: ["Ulangan 6", "tefillin", "ambang pintu", "firman"],
    background:
      "Shema Israel (Ulangan 6:4-9) memerintahkan Israel mengikat firman sebagai tanda — tradisi berkembang menjadi mezuzah (kotak kecil berisi ayat di ambang pintu) dan tefillin (filakteri).",
    practice:
      "Firman ini… haruslah termaterikan pada hatimu… ikatlah… sebagai tanda di tanganmu… tuliskan… di ambang pintu rumahmu dan di pintu-pintu gerbangmu (Ulangan 6:6-9).",
    meaning:
      "Rumah dan tubuh menjadi tempat firman — iman tidak hanya di bait suci, melainkan di pintu masuk kehidupan sehari-hari.",
    today:
      "Prinsip: firman Allah di hati dan rumah. \"Hendaklah firman Kristus diam dengan segala kekayaannya di antara kamu\" (Kolose 3:16).",
    relatedSlugs: ["darah-ambang-pintu", "sabat"],
    verses: [
      v(
        "Ulangan 6:9",
        "Ulangan 6",
        9,
        "… dan haruslah engkau menuliskannya pada tiang pintu rumahmu dan pada pintu gerbang-gerbangmu.",
      ),
    ],
  },
  {
    slug: "persembahan-persepuluhan",
    title: "Persembahan persepuluhan",
    summary:
      "Membawa sepersepuluh hasil tanah dan ternak — mengakui bahwa segala milik Tuhan.",
    category: "ibadah",
    era: "pl",
    keywords: ["sepuluh persen", "persepuluhan", "Levi", "Malakhias"],
    background:
      "Persepuluhan mendukung suku Lewi dan ibadah di bait suci. Abraham memberi persepuluhan kepada Melkisedek (Kejadian 14). Israel diperintahkan membawa sepersepuluh ke tempat yang Tuhan pilih.",
    practice:
      "Haruslah engkau selalu memisahkan sepersepuluh dari… gandummu… dan hasil anggur… dan membawanya ke tempat yang akan dipilih TUHAN (Ulangan 14:22-23).",
    meaning:
      "Persepuluhan bukan \"bayar\" Tuhan — melainkan pengakuan: \"Milik-Mu lah segala yang ada padaku.\" Malakhias 3:10 — \"Ujilah Aku… apakah Aku tidak akan membukakan tingkap-tingkap langit.\"",
    today:
      "Gereja: persembahan sukarela, bukan hukum Taurat. Prinsip kemurahan dan sistematis tetap diajarkan (1 Korintus 16:2).",
    relatedSlugs: ["korban-bakaran", "sabat"],
    verses: [
      v(
        "Malakhias 3:10",
        "Malakhias 3",
        10,
        "Bawalah seluruh persembahan persepuluhan itu ke dalam rumah perbendaharaan…",
      ),
    ],
  },
  {
    slug: "basuh-tangan-kaki",
    title: "Membasuh tangan & kaki",
    summary:
      "Kebersihan ritual imam — dan di PB, Yesus membasuh kaki murid sebagai teladan kerendahan hati.",
    category: "ibadah",
    era: "keduanya",
    keywords: ["basuh kaki", "Perjamuan", "imam", "pelayanan"],
    background:
      "Imamat 30:18-21 — bejana tembaga untuk basuh tangan dan kaki imam sebelum masuk kemah suci. Di Perjanjian Baru, tradisi tuan rumah basuh kaki tamu — pekerjaan hamba.",
    practice:
      "Aaron dan anak-anaknya harus membasuh tangan dan kaki… apabila masuk ke kemah pertemuan… supaya jangan mati (Keluaran 30:19-20).",
    meaning:
      "Yesus membalik simbol: Ia yang Tuhan, membasuh kaki murid. \"Aku memberi kamu teladan… kamu harus saling membasuh kaki\" (Yohanes 13:14-15).",
    today:
      "Pelayanan rendah hati — bukan ritual wajib, melainkan teladan Kristus untuk jemaat.",
    relatedSlugs: ["lepas-sandal", "pembasuhan-ritual"],
    verses: [
      v(
        "Yohanes 13:14",
        "Yohanes 13",
        14,
        "… Aku memberi kamu teladan, supaya kamu… berbuat sama seperti yang Aku berbuat kepadamu.",
      ),
      v(
        "Keluaran 30:19",
        "Keluaran 30",
        19,
        "… Aaron dan anak-anaknya harus membasuh tangan dan kaki…",
      ),
    ],
  },
  {
    slug: "pernikahan-perjanjian",
    title: "Pernikahan & mahar",
    summary:
      "Perkawinan sebagai perjanjian — mahar, kesetiaan, dan simbol hubungan Allah dengan Israel.",
    category: "perjanjian",
    era: "keduanya",
    keywords: ["mahar", "kawin", "pengantin", "setia"],
    background:
      "Perkawinan dalam Alkitab bukan kontrak bisnis semata — melainkan perjanjian (berit). Hosea dan Yehezkiel memakai metafora pernikahan untuk Allah-Israel. Mahar (mohar) adalah pemberian pengantin pria kepada keluarga pengantin perempuan.",
    practice:
      "Abraham mengirimkan hamba untuk mencari istri bagi Ishak — dengan mahar dan berkat. Ulangan 22:13-29 mengatur tanggung jawab dan perlindungan. Malam pengantin dan perjanjian kesetiaan.",
    meaning:
      "Pernikahan menggambarkan kasih setia Allah — dan di PB, Kristus dan jemaat (Efesus 5). Kesetiaan, pengorbanan, dan perjanjian seumur hidup.",
    today:
      "Gereja: pernikahan sebagai sakramen/perjanjian suci — cermin kasih Kristus.",
    relatedSlugs: ["sunat", "paskah"],
    verses: [
      v(
        "Kejadian 2:24",
        "Kejadian 2",
        24,
        "Sebab itu seorang laki-laki akan meninggalkan ayahnya dan ibunya dan bersatu dengan isterinya…",
      ),
      v(
        "Efesus 5:25",
        "Efesus 5",
        25,
        "… suami harus mengasihi isterinya… sama seperti Kristus mengasihi jemaat…",
      ),
    ],
  },
];

export function getCustomCategory(id: BibleCustomCategoryId) {
  return (
    BIBLE_CUSTOM_CATEGORIES.find((item) => item.id === id) ??
    BIBLE_CUSTOM_CATEGORIES[0]!
  );
}

export function getBibleCustom(slug: string) {
  return BIBLE_CUSTOMS.find((item) => item.slug === slug) ?? null;
}

export function getCustomCount() {
  return BIBLE_CUSTOMS.length;
}

export function getFeaturedCustoms() {
  return BIBLE_CUSTOMS.filter((item) => item.featured);
}

export function searchBibleCustoms(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return BIBLE_CUSTOMS;
  return BIBLE_CUSTOMS.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(q)),
  );
}

export function getRelatedCustoms(custom: BibleCustom, limit = 4) {
  const slugs = custom.relatedSlugs ?? [];
  return slugs
    .map((slug) => getBibleCustom(slug))
    .filter((item): item is BibleCustom => Boolean(item))
    .slice(0, limit);
}

export function customEraLabel(era: BibleCustom["era"]) {
  if (era === "pl") return "Perjanjian Lama";
  if (era === "pb") return "Perjanjian Baru";
  return "PL & PB";
}

export function customVerseHref(verse: BibleCustomVerse) {
  const params = new URLSearchParams({ browse: "1", passage: verse.passage });
  if (verse.verse != null) params.set("verse", String(verse.verse));
  return `/baca?${params.toString()}`;
}
