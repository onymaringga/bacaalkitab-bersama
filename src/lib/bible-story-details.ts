import type {
  BibleStory,
  BibleStoryMoment,
  BibleStoryPassage,
} from "@/lib/bible-stories";

function passage(
  reference: string,
  passageId: string,
  verse: number,
  text: string,
): BibleStoryPassage {
  return { reference, passage: passageId, verse, text };
}

export const STORY_DETAILS: Record<string, Partial<BibleStory>> = {
  penciptaan: {
    background:
      "Kisah penciptaan dalam Kejadian 1–2 bukan laporan ilmiah modern, melainkan pengakuan iman: langit dan bumi punya Asal yang pribadi, baik, dan berkuasa. Di tengah mitos-mitos kuno yang menggambarkan dunia sebagai arena pertarungan dewa-dewa, Alkitab membuka dengan kalimat sederhana namun revolusioner: \"Pada mulanya Allah menciptakan langit dan bumi.\"\n\nDalam konteks Israel kuno, kisah ini menegaskan bahwa satu Allah — bukan Firaun, bukan Baal, bukan dewa-dewa bangsa — adalah Pencipta segala sesuatu. Enam hari penciptaan disusun dengan irama liturgis yang mengajarkan keteraturan, kebaikan, dan perhentian (Sabat). Dunia tidak kebetulan; ia diucapkan, dibentuk, dan dinyatakan \"baik\".\n\nTeologi penciptaan menjadi fondasi seluruh Alkitab: manusia diciptakan menurut gambar Allah, dipanggil mengelola bumi, dan hidup dalam persekutuan dengan Pencipta. Ketika dosa masuk, ciptaan rusak — tetapi janji pemulihan tetap berakar pada kebaikan asal penciptaan.",
    narrative:
      "Allah menciptakan langit dan bumi ketika belum ada bentuk dan kekosongan. Roh Allah bergerak di atas permukaan air; kemudian firman-Nya memecah kegelapan. \"Jadilah terang\" — dan terang pun ada. Allah memisahkan terang dan gelap, langit dan laut, daratan dan tumbuhan. Setiap langkah diikuti pengulangan yang penuh makna: Allah melihat, dan hal itu baik.\n\nPada hari keempat, bintang-bintang, matahari, dan bulan ditetapkan sebagai penanda waktu dan musim. Hari kelima, ikan dan burung memenuhi laut dan langit. Hari keenam, Allah menciptakan binatang darat — lalu manusia, laki-laki dan perempuan, menurut gambar-Nya. Mereka diberi mandat menguasai dan mengelola bumi, bukan untuk eksploitasi sembarangan, melainkan sebagai wakil yang bertanggung jawab.\n\nKejadian 2 memperdalam potret manusia pertama: Adam dibentuk dari debu tanah, hidup dikehembuskan ke dalam hidungnya. Hawa diciptakan sebagai penolong sejajar, bukan sekunder. Mereka hidup di Taman Eden, bebas menikmati buah-buahan — kecuali pohon pengetahuan baik dan jahat. Perintah itu bukan ujian kejam, melainkan batas yang mengajarkan ketergantungan dan kepercayaan.\n\nAllah melihat segala yang dijadikan-Nya, sungguh-sungguh baik. Hari ketujuh, Ia berhenti — bukan karena lelah, melainkan untuk menikmati ciptaan dan mengundang manusia masuk ke dalam perhentian-Nya. Sabat menjadi tanda bahwa hidup bukan hanya produktivitas, melainkan persekutuan.\n\nKisah penciptaan mengajarkan bahwa setiap manusia — tanpa memandang suku, status, atau kemampuan — membawa martabat ilahi. Dunia bukan tempat kosong yang harus kita taklukkan dengan kekerasan, melainkan rumah yang dipercayakan. Dari sini mengalir tanggung jawab moral: bagaimana kita memperlakukan sesama, merawat bumi, dan hidup di bawah otoritas Allah yang baik.",
    keyMoments: [
      {
        title: "Firman menciptakan terang",
        summary:
          "Allah berfirman dan terang pun ada; Ia memisahkan terang dari gelap sebagai awal kosmos yang teratur.",
        reference: "Kejadian 1:3-4",
        passage: "Kejadian 1",
        verse: 3,
      },
      {
        title: "Manusia menurut gambar Allah",
        summary:
          "Allah menciptakan manusia laki-laki dan perempuan menurut gambar-Nya, memberi mandat mengelola bumi.",
        reference: "Kejadian 1:27",
        passage: "Kejadian 1",
        verse: 27,
      },
      {
        title: "Adam dan nafas hidup",
        summary:
          "Tuhan membentuk manusia dari debu tanah dan menghembuskan nafas hidup ke dalam hidungnya.",
        reference: "Kejadian 2:7",
        passage: "Kejadian 2",
        verse: 7,
      },
      {
        title: "Hawa, penolong sejajar",
        summary:
          "Allah membentuk perempuan dari rusuk Adam sebagai teman setara dalam tugas dan persekutuan.",
        reference: "Kejadian 2:22",
        passage: "Kejadian 2",
        verse: 22,
      },
      {
        title: "Sabat, perhentian yang baik",
        summary:
          "Allah memberkati hari ketujuh dan menguduskannya — tanda perhentian dan persekutuan dengan Pencipta.",
        reference: "Kejadian 2:3",
        passage: "Kejadian 2",
        verse: 3,
      },
    ],
    lessons: [
      "Setiap manusia membawa martabat karena diciptakan menurut gambar Allah",
      "Dunia bukan kebetulan; kehidupan punya Asal yang baik dan penuh tujuan",
      "Mengelola bumi berarti merawat, bukan mengeksploitasi sembarangan",
      "Perhentian (Sabat) adalah bagian dari desain Allah, bukan kemalasan",
      "Persekutuan dengan Allah adalah tujuan awal dan akhir kehidupan manusia",
    ],
    reflection:
      "Kisah penciptaan mengajak kita melihat diri sendiri dan orang lain dengan mata yang berbeda. Bukan sebagai kompetitor dalam perjuangan hidup, melainkan sebagai makhluk yang dihargai Allah. Ketika kita merasa tidak berguna atau terlalu kecil, kita perlu kembali ke kebenaran dasar: Engkau diciptakan, bukan kebetulan.\n\nHari ini, bagaimana kita memperlakukan tubuh, waktu, dan lingkungan sekitar? Apakah hidup kita mencerminkan bahwa kita hidup di bawah tangan Pencipta yang baik — atau kita hidup seolah dunia milik kita sendiri?",
    prayer:
      "Tuhan Pencipta, terima kasih karena Engkau memanggil langit dan bumi ke dalam ada, dan memanggilku hidup dalam persekutuan dengan-Mu. Ajar aku menghargai diri sendiri dan sesama sebagai ciptaan-Mu. Bimbing langkahku agar merawat dunia yang Kaupercayakan. Amin.",
    keyPassages: [
      passage(
        "Kejadian 1:1",
        "Kejadian 1",
        1,
        "Pada mulanya Allah menciptakan langit dan bumi.",
      ),
      passage(
        "Kejadian 1:27",
        "Kejadian 1",
        27,
        "Maka Allah menciptakan manusia itu menurut gambar-Nya, menurut gambar Allah diciptakan-Nya dia; laki-laki dan perempuan diciptakan-Nya.",
      ),
      passage(
        "Kejadian 2:7",
        "Kejadian 2",
        7,
        "Maka Tuhan Allah membentuk manusia itu dari debu tanah dan menghembuskan nafas hidup ke dalam hidungnya; demikianlah manusia itu menjadi makhluk yang hidup.",
      ),
      passage(
        "Kejadian 1:31",
        "Kejadian 1",
        31,
        "Maka Allah melihat segala yang dijadikan-Nya itu, sungguh amat baik adanya…",
      ),
      passage(
        "Kejadian 2:3",
        "Kejadian 2",
        3,
        "Lalu Allah memberkati hari ketujuh itu dan menguduskannya, karena pada hari itulah Ia berhenti dari segala pekerjaan penciptaan yang telah dibuat-Nya itu.",
      ),
    ],
  },
  "air-bah": {
    background:
      "Setelah kejatuhan manusia, kejahatan memenuhi bumi. Kejadian 6 menggambarkan kondisi yang mengerikan: hati manusia cenderung jahat sejak kecil. Di tengah kegelapan moral itu, Nuh disebut \"orang yang benar, yang tidak bercela di antara orang sezamannya; Nuh hidup bergaul dengan Allah.\"\n\nKisah air bah terjadi dalam konteks peradaban kuno yang sudah berkembang — kota, kerajinan, dan kekerasan. Allah tidak acuh; Ia \"mengambil keputusan\" untuk menghakimi, namun sekaligus menyediakan jalan keluar. Bahtera bukan sekadar kapal, melainkan simbol anugerah: satu keluarga dan satu pasang setiap jenis hewan diselamatkan.\n\nSetelah air surut, Allah meneguhkan perjanjian dengan Nuh dan seluruh ciptaan. Pelangi menjadi tanda visual bahwa keadilan dan anugerah Allah berjalan bersama. Kisah ini mengingatkan generasi berikutnya bahwa dosa punya konsekuensi, tetapi Allah selalu menyediakan jalan untuk hidup.",
    narrative:
      "Allah melihat kejahatan manusia memenuhi bumi. Setiap rencana hatinya cenderung jahat sejak kecil. Namun Nuh mendapat kasih karunia di mata Tuhan. Allah memerintahkan Nuh membuat bahtera dari kayu gofer — panjangnya tiga ratus hasta, lebar lima puluh hasta, tinggi tiga puluh hasta — dengan tiga lantai dan atap. Nuh taat, meski belum pernah hujan deras; ia percaya firman Allah.\n\nNuh, istri, tiga anak laki-laki beserta istri mereka masuk ke bahtera. Pasangan setiap jenis hewan — jantan dan betina — ikut masuk. Allah menutup pintu bahtera. Hujan turun empat puluh hari empat puluh malam; air naik menutupi gunung-gunung. Segala yang bernafas di darat mati, kecuali yang ada di bahtera.\n\nSetelah seratus lima puluh hari, air surut. Bahtera berhenti di pegunungan Ararat. Nuh mengeluarkan burung gagak, lalu merpati — yang kembali dengan daun zaitun. Akhirnya Nuh keluar, membangun mezbah, dan mempersembahkan korban. Allah mencium bau yang harum dan berjanji tidak akan lagi memusnahkan bumi dengan air bah.\n\nAllah memberkati Nuh dan anak-anaknya: \"Berkembangbiaklah dan penuhilah bumi.\" Ia meneguhkan perjanjian dengan tanda pelangi — tanda kasih setia Allah kepada seluruh ciptaan. Nuh menjadi bapak umat manusia pascabah; dari keturunannya bangsa-bangsa tersebar.\n\nKisah ini bukan dongeng tentang hewan lucu di kapal. Ia mengajarkan bahwa Allah serius terhadap dosa, namun lebih besar lagi kasih karunia-Nya. Bahtera mengarahkan iman kepada Kristus — satu tempat perlindungan di tengah penghakiman — dan pelangi mengingatkan bahwa setelah badai, Allah tetap setia.",
    keyMoments: [
      {
        title: "Nuh, orang benar",
        summary:
          "Allah menemukan Nuh sebagai orang benar di tengah generasi yang jahat; ia hidup bergaul dengan Allah.",
        reference: "Kejadian 6:9",
        passage: "Kejadian 6",
        verse: 9,
      },
      {
        title: "Perintah membuat bahtera",
        summary:
          "Allah memberi Nuh ukuran dan rencana bahtera yang spesifik; Nuh taat meski belum pernah melihat hujan besar.",
        reference: "Kejadian 6:14-16",
        passage: "Kejadian 6",
        verse: 14,
      },
      {
        title: "Air bah menutupi bumi",
        summary:
          "Hujan empat puluh hari; air naik menutupi gunung-gunung. Hanya yang ada di bahtera selamat.",
        reference: "Kejadian 7:17-24",
        passage: "Kejadian 7",
        verse: 17,
      },
      {
        title: "Merpati dan daun zaitun",
        summary:
          "Nuh mengeluarkan merpati; ia kembali dengan daun zaitun — tanda bahwa air sudah surut.",
        reference: "Kejadian 8:11",
        passage: "Kejadian 8",
        verse: 11,
      },
      {
        title: "Perjanjian dan pelangi",
        summary:
          "Allah meneguhkan perjanjian dengan tanda pelangi: Ia tidak akan lagi memusnahkan bumi dengan air bah.",
        reference: "Kejadian 9:13-15",
        passage: "Kejadian 9",
        verse: 13,
      },
    ],
    lessons: [
      "Allah serius terhadap dosa, tetapi selalu menyediakan jalan keluar bagi yang taat",
      "Ketaatan pada firman Allah terasa aneh di mata dunia, tetapi itulah jalan keselamatan",
      "Perjanjian Allah memberi harapan stabil setelah masa penghakiman",
      "Pelangi mengingatkan bahwa anugerah lebih besar dari kejahatan manusia",
      "Satu keluarga yang setia bisa menjadi benih pemulihan bagi banyak orang",
    ],
    reflection:
      "Nuh hidup di zaman ketika kejahatan terasa \"normal.\" Ia tidak mengikuti arus, melainkan berjalan dengan Allah. Mungkin kita juga hidup di lingkungan yang meremehkan kebenaran — dan Allah memanggil kita untuk setia, meski terlihat sendirian.\n\nDi tengah badai hidup — kehilangan, kegagalan, atau tekanan moral — apakah kita berlindung pada firman Allah seperti bahtera? Pelangi mengingatkan: badai akan berlalu, dan Allah tetap setia.",
    prayer:
      "Tuhan yang adil dan penyayang, ajar aku hidup benar seperti Nuh di tengah dunia yang jahat. Ketika badai datang, bimbing aku masuk ke perlindungan-Mu. Perkuat imanku agar taat pada firman-Mu meski orang lain mengejek. Amin.",
    keyPassages: [
      passage(
        "Kejadian 6:9",
        "Kejadian 6",
        9,
        "Inilah riwayat Nuh. Nuh adalah seorang yang benar, yang tidak bercela di antara orang sezamannya; Nuh hidup bergaul dengan Allah.",
      ),
      passage(
        "Kejadian 7:1",
        "Kejadian 7",
        1,
        "Berfirmanlah TUHAN kepada Nuh: \"Masuklah ke dalam bahtera itu, engkau dan segenap keluargamu, sebab engkaulah yang Kulihat benar di hadapan-Ku di antara orang-orang zaman ini.\"",
      ),
      passage(
        "Kejadian 8:11",
        "Kejadian 8",
        11,
        "Lalu merpati itu kembali kepadanya waktu petang, dan ternyata pada paruhnya dibawa sehelai daun zaitun…",
      ),
      passage(
        "Kejadian 9:13",
        "Kejadian 9",
        13,
        "Aku telah menaruh busur-Ku awan-awan, dan busur itu akan menjadi tanda perjanjian antara-Ku dan bumi.",
      ),
      passage(
        "Kejadian 9:15",
        "Kejadian 9",
        15,
        "Maka Aku akan ingat akan perjanjian-Ku, yang ada antara-Ku dan kamu… sehingga air tidak lagi menjadi banjir untuk memusnahkan segala yang hidup.",
      ),
    ],
  },
  "panggilan-abraham": {
    background:
      "Abraham (mula-mula Abram) hidup di Ur-Kasdim, pusat peradaban Mesopotamia dengan penyembahan banyak dewa. Sekitar milenium kedua sebelum Masehi, Allah memanggilnya keluar — bukan hanya dari negeri, melainkan dari sistem keamanan sosial, suku bangsa, dan kepercayaan yang sudah mapan.\n\nPanggilan Abraham menjadi titik awal sejarah perjanjian Israel. Janji yang diberikan — tanah, keturunan, berkat bagi segala bangsa — terdengar mustahil: Abram sudah tua, Sarai mandul, dan ia orang asing. Namun iman Abram \"diperhitungkan sebagai kebenaran\" — frase yang kemudian menjadi fondasi teologi Paulus.\n\nKisah Abraham bukan kisah pahlawan sempurna. Ia pernah takut, berdusta, dan mengambil jalan pintas melalui Hagar. Tetapi Allah tetap meneguhkan perjanjian. Pengikatan Ishak di Moria menjadi puncak ujian iman: apakah Abraham rela menyerahkan yang paling berharga?",
    narrative:
      "Allah berfirman kepada Abram: \"Pergilah dari negerimu, dari sanak saudaramu, dan dari rumah bapamu, ke negeri yang akan Kutunjukkan kepadamu.\" Janji diberikan: Abram akan menjadi nabi bangsa besar, namanya akan menjadi berkat, dan segala bangsa di bumi akan mendapat berkat karena dia. Abram berangkat — berumur tujuh puluh lima tahun — tanpa tahu tujuan akhir.\n\nDi Kanaan, Allah menegaskan janji tanah. Abram membangun mezbah di tempat-tempat penting. Namun perjalanan penuh ujian: kelaparan memaksa ke Mesir, di mana Abram berdusta tentang Sara; konflik dengan Lot; janji keturunan terasa mustahil karena usia. Allah menegaskan perjanjian di malam yang gelap, dengan bintang-bintang sebagai metafora keturunan yang tak terhitung.\n\nSara menawarkan Hagar sebagai jalan pintas; Ishmael lahir. Tetapi janji tetap melalui Sara. Ishak lahir ketika Abram sembilan puluh sembilan tahun dan Sara sembilan puluh — penggenapan yang mustahil secara manusia. Allah mengubah nama Abram menjadi Abraham, \"bapa banyak bangsa\", dan Sarai menjadi Sara.\n\nUjian terberat datang: Allah memerintahkan Abraham mengorbankan Ishak di Gunung Moria. Abraham berangkat pagi-pagi, membawa anak, kayu, dan api. Di puncak, Ishak bertanya: \"Di mana anak domba untuk korban?\" Abraham menjawab: \"Allah yang akan menyediakan.\" Ketika pedang hampir turun, malaikat menahan; domba jantan terjebak tanduknya disediakan. Abraham menamai tempat itu \"TUHAN menyediakan\".\n\nDari Abraham mengalir garis perjanjian menuju Israel, Daud, dan akhirnya Kristus. Berkat bagi segala bangsa bukan slogan — melainkan janji yang Allah kerjakan lintas ribuan tahun. Abraham diajar sebagai bapa semua orang yang percaya.",
    keyMoments: [
      {
        title: "Panggilan meninggalkan Ur",
        summary:
          "Allah memanggil Abram keluar dengan janji tanah, keturunan, dan berkat bagi segala bangsa.",
        reference: "Kejadian 12:1-4",
        passage: "Kejadian 12",
        verse: 1,
      },
      {
        title: "Iman diperhitungkan sebagai kebenaran",
        summary:
          "Abram percaya janji Allah; imannya diperhitungkan sebagai kebenaran.",
        reference: "Kejadian 15:6",
        passage: "Kejadian 15",
        verse: 6,
      },
      {
        title: "Kelahiran Ishak",
        summary:
          "Pada usia tua, Sara melahirkan Ishak — penggenapan janji yang lama ditunggu.",
        reference: "Kejadian 21:1-3",
        passage: "Kejadian 21",
        verse: 1,
      },
      {
        title: "Pengikatan di Moria",
        summary:
          "Abraham taat membawa Ishak; Allah menyediakan domba pengganti.",
        reference: "Kejadian 22:1-14",
        passage: "Kejadian 22",
        verse: 14,
      },
      {
        title: "Perjanjian disahkan",
        summary:
          "Allah meneguhkan sumpah berkat kepada Abraham karena ketaatannya.",
        reference: "Kejadian 22:15-18",
        passage: "Kejadian 22",
        verse: 16,
      },
    ],
    lessons: [
      "Iman berarti melangkah sebelum peta lengkap diberikan",
      "Janji Allah lebih kuat dari keterbatasan usia, tubuh, dan logika manusia",
      "Jalan pintas manusiawi sering menambah luka; percaya lebih aman walau lebih lambat",
      "Yang paling kita sayangi pun boleh diserahkan karena Allah menyediakan",
      "Kegagalan dalam perjalanan iman tidak membatalkan kesetiaan Allah",
    ],
    reflection:
      "Abraham diajar taat dulu, baru melihat Allah menuntun. Banyak dari kita ingin kepastian dulu, baru bergerak. Menunggu janji bisa terasa panjang dan memicu jalan pintas — tetapi jalan pintas sering melukai.\n\nDi mana Allah memanggilmu keluar dari zona aman? Apakah ada \"Ishak\" — sesuatu yang paling kau cintai — yang perlu kau lepaskan ke tangan-Nya dengan percaya bahwa TUHAN menyediakan?",
    prayer:
      "Tuhan, ajar aku berjalan seperti Abraham: percaya janji-Mu meski belum melihat seluruhnya. Ampuni jalan pintas yang kulakukan karena takut. Bentuk hatiku agar rela menyerahkan yang paling kucintai kepada-Mu, karena Engkau setia menyediakan. Amin.",
    keyPassages: [
      passage(
        "Kejadian 12:1",
        "Kejadian 12",
        1,
        "Berfirmanlah TUHAN kepada Abram: \"Pergilah dari negerimu dan dari sanak saudaramu dan dari rumah bapamu ini ke negeri yang akan Kutunjukkan kepadamu.\"",
      ),
      passage(
        "Kejadian 15:6",
        "Kejadian 15",
        6,
        "Lalu percayalah Abram kepada TUHAN, maka TUHAN memperhitungkan hal itu kepadanya sebagai kebenaran.",
      ),
      passage(
        "Kejadian 21:1",
        "Kejadian 21",
        1,
        "TUHAN memperhatikan Sara, seperti yang difirmankan-Nya, dan TUHAN melakukan kepada Sara seperti yang dijanjikan-Nya.",
      ),
      passage(
        "Kejadian 22:14",
        "Kejadian 22",
        14,
        "Dan Abraham menamai tempat itu: \"TUHAN menyediakan\"; sebab itu orang berkata sampai sekarang: \"Di atas gunung TUHAN, akan disediakan.\"",
      ),
      passage(
        "Kejadian 12:3",
        "Kejadian 12",
        3,
        "Aku akan memberkati orang yang memberkati engkau, dan mengutuk orang yang mengutuk engkau…",
      ),
    ],
  },
  "yusuf-mesir": {
    background:
      "Yusuf hidup di akhir masa patriarkh, ketika keluarga Yakub masih hidup sebagai orang asing di Kanaan. Ia adalah anak kesayangan Yakub — putra Rahel — sehingga memicu kecemburuan saudara-saudaranya. Mimpi-mimpi Yusuf tentang dominasi di atas keluarga menambah api permusuhan.\n\nKisah Yusuf terjadi di persimpangan dua dunia: pastoral Kanaan dan kekuasaan Mesir. Mesir pada masa itu adalah superpower dengan sistem birokrasi canggih, kemampuan menyimpan gandum, dan kepercayaan pada mimpi sebagai wahyu. Allah bekerja justru di tengah sistem manusiawi itu.\n\nKejadian 50:20 menjadi kunci teologi kisah ini: \"Memang kamu bermaksud jahat kepadaku, tetapi Allah bermaksud baik…\" Kisah Yusuf mengajarkan providensi — Allah bekerja di balik kejadian yang tampak hancur untuk membawa pemulihan.",
    narrative:
      "Saudara-saudara Yusuf membencinya karena ia kesayangan ayah dan karena mimpi-mimpi yang mengangkat dirinya. Suatu hari, mereka menjualnya ke pedagang Ismael yang membawanya ke Mesir. Di Mesir, Yusuf dijual ke Potifar, pegawai istana Firaun. Ia setia, dipercaya mengelola rumah — hingga difitnah oleh istri Potifar dan dipenjarakan.\n\nDi penjara, Yusuf menafsirkan mimpi pelayan minuman dan juru roti Firaun. Dua tahun kemudian, Firaun bermimpi tentang tujuh sapi gemuk dan tujuh sapi kurus, tujuh bulir penuh dan tujuh bulir layu. Tidak ada yang bisa menafsirkan. Juru minuman Firaun ingat Yusuf. Yusuf dibawa, menafsirkan: tujuh tahun kelimpahan diikuti tujuh tahun kelaparan. Firaun mengangkatnya menjadi pembesar kedua, mengelola persediaan gandum seluruh Mesir.\n\nKetika kelaparan melanda, saudara-saudara Yusuf datang ke Mesir membeli gandum — tanpa mengenali adik mereka. Yusuf menguji mereka: apakah hati mereka sudah berubah? Ia mempertahankan Benyamin, memicu tangis Yehuda yang rela menggantikan adiknya. Yusuf tidak tahan lagi; ia menangis dan mengungkap identitasnya.\n\n\"Aku Yusuf, adikmu!\" Ia memaafkan: \"Janganlah sedih… sebab kamu bermaksud jahat kepadaku, tetapi Allah bermaksud baik, untuk melakukan seperti yang terjadi sekarang ini, yaitu untuk memelihara hidup banyak orang.\" Yakub dan seluruh keluarga pindah ke Mesir, diselamatkan dari kelaparan.\n\nYusuf hidup seratus sepuluh tahun. Sebelum mati, ia meminta tulangnya dibawa kembali ke Kanaan — tanda bahwa janji tanah perjanjian belum dilupakan. Dari garis Yusuf, bangsa Israel tumbuh di Mesir, persiapan untuk kisah Keluaran yang akan datang.",
    keyMoments: [
      {
        title: "Dijual ke Mesir",
        summary:
          "Saudara-saudara Yusuf menjualnya ke pedagang Ismael; ia dibawa ke Mesir sebagai budak.",
        reference: "Kejadian 37:28",
        passage: "Kejadian 37",
        verse: 28,
      },
      {
        title: "Dipenjarakan karena setia",
        summary:
          "Yusuf menolak godaan istri Potifar dan dipenjarakan — tetapi Allah tetap bersama-sama dengannya.",
        reference: "Kejadian 39:20-21",
        passage: "Kejadian 39",
        verse: 20,
      },
      {
        title: "Menafsirkan mimpi Firaun",
        summary:
          "Yusuf menafsirkan mimpi tujuh tahun kelimpahan dan tujuh tahun kelaparan; Firaun mengangkatnya pembesar.",
        reference: "Kejadian 41:41",
        passage: "Kejadian 41",
        verse: 41,
      },
      {
        title: "Pengungkapan identitas",
        summary:
          "Yusuf menangis dan berkata: \"Aku Yusuf, adikmu!\" — saudara-saudaranya terkejut dan takut.",
        reference: "Kejadian 45:3-4",
        passage: "Kejadian 45",
        verse: 3,
      },
      {
        title: "Allah bermaksud baik",
        summary:
          "Yusuf memaafkan: rencana jahat manusia Allah balikkan untuk pemeliharaan banyak orang.",
        reference: "Kejadian 50:20",
        passage: "Kejadian 50",
        verse: 20,
      },
    ],
    lessons: [
      "Allah bekerja bahkan di tempat yang tidak kita pilih — penjara, pengasingan, kegagalan",
      "Kesetiaan kecil yang konsisten membuka pintu besar di waktu Allah",
      "Pengampunan memulihkan relasi yang rusak dan melepaskan belenggu masa lalu",
      "Providensi Allah sering baru terlihat jelas setelah bertahun-tahun",
      "Posisi kekuasaan seharusnya dipakai untuk melindungi, bukan membalas dendam",
    ],
    reflection:
      "Yusuf dijual oleh saudaranya sendiri, difitnah, dan dipenjarakan — padahal ia setia. Mungkin kita juga pernah merasa diperlakukan tidak adil meski berusaha benar. Kisah Yusuf mengingatkan: Allah belum selesai menulis.\n\nApakah ada luka masa lalu yang masih kita pegang? Yusuf memaafkan bukan karena lupa, melainkan karena melihat tangan Allah di baliknya. Pengampunan bukan membenarkan kejahatan — melainkan melepaskan diri dari belenggunya.",
    prayer:
      "Tuhan yang bekerja di balik segala kejadian, ajar aku setia seperti Yusuf di tempat yang sulit. Bantu aku memaafkan mereka yang pernah menyakiti, dan percaya bahwa Engkau dapat membalikkan yang jahat menjadi kebaikan. Amin.",
    keyPassages: [
      passage(
        "Kejadian 37:28",
        "Kejadian 37",
        28,
        "…Maka saudara-saudaranya menjual Yusuf… dengan harga dua puluh syikal perak.",
      ),
      passage(
        "Kejadian 39:21",
        "Kejadian 39",
        21,
        "Tetapi TUHAN beserta Yusuf, sehingga ia mendapat kasih karunia di mata kepala penjara itu.",
      ),
      passage(
        "Kejadian 41:41",
        "Kejadian 41",
        41,
        "Lalu Firaun berkata kepada Yusuf: \"Lihat, kuketahui engkau, bahwa engkau lebih pandai… Kuberikan engkau kuasa atas seluruh tanah Mesir.\"",
      ),
      passage(
        "Kejadian 45:5",
        "Kejadian 45",
        5,
        "Janganlah sedih dan janganlah marah karena telah menjual aku ke mari, sebab untuk memelihara hidup Allah mengutus aku…",
      ),
      passage(
        "Kejadian 50:20",
        "Kejadian 50",
        20,
        "Memang kamu bermaksud jahat kepadaku, tetapi Allah bermaksud baik, untuk melakukan seperti yang terjadi sekarang ini…",
      ),
    ],
  },
  "keluaran-mesir": {
    background:
      "Setelah Yusuf mati, bangsa Israel bertambah banyak di Mesir. Raja baru bangkit \"yang tidak mengenal Yusuf\" — Israel dijadikan budak, dipaksa kerja paksa membuat batu bata. Jeritan mereka naik ke hadirat Allah, dan Ia \"ingat akan perjanjian-Nya dengan Abraham, Ishak, dan Yakub.\"\n\nKeluaran adalah kisah identitas Israel. Allah bukan hanya Pencipta langit dan bumi, melainkan Pembebas umat-Nya. Pola ini mengalir ke seluruh Alkitab: Allah mendengar, Allah turun, Allah membebaskan. Perayaan Paskah mengingat malam ketika malang-malang melewati rumah-rumah yang berlumuran darah domba.\n\nKeluaran juga menjadi bayangan keselamatan dalam Kristus — \"Anak Domba Allah yang menghapus dosa dunia.\" Musa, sang pemimpin yang ragu-ragu, menjadi instrumen Allah meski awalnya berkata \"Siapakah aku?\" Penyeberangan Laut Teberau menjadi ikon kemenangan Allah atas kekuatan manusia.",
    narrative:
      "Allah memanggil Musa dari semak yang menyala di Horeb. \"Aku turun untuk melepaskan umat-Ku… pergilah, Aku mengutus engkau kepada Firaun.\" Musa ragu — siapa aku? apa nama-Mu? Firaun tidak akan mendengar. Allah memberi tanda-tanda: tongkat menjadi ular, tangan kena kusta lalu sembuh. Musa dan Aaron menghadapi Firaun.\n\nFiraun menolak melepaskan Israel. Allah mengirim sepuluh tulah: air jadi darah, katak, nyamuk, lalat, penyakit ternak, borok, hujan es, belalang, kegelapan, dan kematian anak sulung. Tulah-tulah menunjukkan keunggulan Allah atas dewa-dewa Mesir. Tulah kesepuluh — kematian anak sulung — menjadi malam Paskah.\n\nSetiap keluarga Israel menyembelih domba jantan, menaruh darahnya di tiang pintu. Malam itu, malang-malang melewati Mesir, tetapi rumah-rumah berlumuran darah dilindungi. Firaun akhirnya melepaskan Israel — lalu menyesal dan mengejar dengan pasukan kereta.\n\nDi Laut Teberau, Israel terjepit: laut di depan, Firaun di belakang. Musa mengangkat tongkat; Allah membelah laut dengan angin timur. Israel menyeberang di tanah kering; Firaun dan tentaranya tenggelam. Miriam memimpin nyanyian kemenangan: \"Nyanyikanlah bagi TUHAN, sebab Ia tinggi luhur!\"\n\nKeluaran membentuk identitas Israel sebagai umat yang dibebaskan. Perintah Paskah diperingati setiap tahun: \"Hari ini kamu pergi…\" Allah bukan hanya Pencipta, melainkan Pembebas yang mendengar jeritan umat-Nya.",
    keyMoments: [
      {
        title: "Semak yang menyala",
        summary:
          "Allah memanggil Musa dari semak yang menyala: \"Aku turun untuk melepaskan umat-Ku dari Mesir.\"",
        reference: "Keluaran 3:7-10",
        passage: "Keluaran 3",
        verse: 10,
      },
      {
        title: "Sepuluh tulah",
        summary:
          "Allah mengirim tulah-tulah atas Mesir; setiap tulah menunjukkan keunggulan-Nya atas dewa-dewa Firaun.",
        reference: "Keluaran 7-12",
        passage: "Keluaran 7",
        verse: 1,
      },
      {
        title: "Malam Paskah",
        summary:
          "Darah domba di tiang pintu melindungi Israel; malang-malang melewati Mesir.",
        reference: "Keluaran 12:13",
        passage: "Keluaran 12",
        verse: 13,
      },
      {
        title: "Penyeberangan Laut Teberau",
        summary:
          "Allah membelah laut; Israel menyeberang di tanah kering, Firaun tenggelam.",
        reference: "Keluaran 14:21-22",
        passage: "Keluaran 14",
        verse: 21,
      },
      {
        title: "Nyanyian Miriam",
        summary:
          "Miriam dan perempuan-perempuan Israel menyanyikan pujian kemenangan Allah.",
        reference: "Keluaran 15:20-21",
        passage: "Keluaran 15",
        verse: 20,
      },
    ],
    lessons: [
      "Allah mendengar jeritan umat-Nya yang tertindas dan bertindak untuk membebaskan",
      "Pembebasan sejati datang dari tangan Tuhan, bukan kekuatan manusia semata",
      "Paskah mengajarkan bahwa perlindungan Allah datang melalui darah korban",
      "Kemenangan Allah sering datang ketika kita terjepit — laut di depan, musuh di belakang",
      "Umat yang dibebaskan dipanggil mengingat dan menceritakan karya Allah",
    ],
    reflection:
      "Israel merintih di bawah beban Mesir — dan Allah tidak acuh. Mungkin kita juga merasa terjebak: tekanan pekerjaan, relasi yang toxic, atau ikatan dosa. Keluaran mengingatkan: Allah mendengar, dan Ia mampu membuka jalan.\n\nApakah kita hidup sebagai orang yang \"sudah dibebaskan\" — atau kita masih hidup seperti budak, takut pada Firaun-Firaun dalam hidup kita? Paskah mengajak kita beristirahat dalam perlindungan darah Anak Domba.",
    prayer:
      "Tuhan Pembebas, terima kasih karena Engkau mendengar jeritanku dan membuka jalan keluar. Bebaskan aku dari ikatan yang menahanku. Ajar aku hidup sebagai orang yang sudah dibebaskan, penuh syukur dan penuh harapan. Amin.",
    keyPassages: [
      passage(
        "Keluaran 3:10",
        "Keluaran 3",
        10,
        "Maka sekarang, pergilah, Aku mengutus engkau kepada Firaun; bawalah keluar umat-Ku, orang Israel, dari Mesir.",
      ),
      passage(
        "Keluaran 12:13",
        "Keluaran 12",
        13,
        "Dan darah itu akan menjadi tanda bagimu pada rumah-rumah… dan apabila Aku melihat darah itu, maka Aku akan lewat dari pada kamu…",
      ),
      passage(
        "Keluaran 14:21",
        "Keluaran 14",
        21,
        "Lalu Musa mengacungkan tangannya ke atas laut, maka TUHAN menerbangkan laut itu…",
      ),
      passage(
        "Keluaran 15:2",
        "Keluaran 15",
        2,
        "Kegagahan dan mazmurku ialah TUHAN, sebab Ia telah menjadi keselamatanku…",
      ),
      passage(
        "Keluaran 6:6",
        "Keluaran 6",
        6,
        "…Aku akan membebaskan kamu dari kerja paksa orang Mesir…",
      ),
    ],
  },
  "sepuluh-firman": {
    background:
      "Tiga bulan setelah keluar dari Mesir, Israel tiba di padang gurun Sinai. Allah memanggil Musa naik ke gunung dan berfirman: \"Kamu sendiri telah melihat… bagaimana Aku memikul kamu seperti rajawali memikul anak-anaknya.\" Di sinilah perjanjian Sinai ditetapkan — Israel dipanggil menjadi \"kerajaan imam dan bangsa yang kudus.\"\n\nSepuluh Firman (Keluaran 20) bukan daftar aturan dingin, melainkan fondasi hubungan: empat firman pertama tentang Allah (tidak ada allah lain, tidak ada patung, jangan menyebut nama TUHAN sia-sia, kuduskan hari Sabat); enam firman berikutnya tentang sesama (hormat orang tua, jangan bunuh, jangan zinah, jangan curi, jalan bersaksi bohong, jangan iri).\n\nDalam konteks Perjanjian Baru, Yesus merangkum hukum: \"Kasihilah Tuhan… dan kasihilah sesamamu manusia.\" Paulus mengajarkan bahwa hukum adalah pendidik menuju Kristus. Roh Kudus menulis hukum di hati umat baru. Sepuluh Firman tetap relevan sebagai cermin moral dan bingkai kehidupan yang berkenan kepada Allah.",
    narrative:
      "Gunung Sinai diselimuti awan, guntur, dan kilat. Israel takut; mereka berkata kepada Musa: \"Engkau berbicaralah dengan kami, supaya kami dengar; tetapi janganlah Allah berbicara kepada kami, nanti kami mati.\" Musa menjadi perantara. Allah memulai dengan pengingat pembebasan: \"Akulah TUHAN, Allahmu, yang membawa engkau keluar dari tanah Mesir.\"\n\nFirman pertama menegaskan monoteisme radikal: \"Janganlah ada bagimu allah lain di hadapan-Ku.\" Firman kedua melarang patung — Allah tidak bisa direduksi menjadi benda. Firman ketiga melindungi nama Allah dari penyalahgunaan. Firman keempat memerintahkan Sabat — peringatan penciptaan dan pembebasan.\n\nFirman kelima mengajarkan hormat kepada orang tua — fondasi masyarakat. Firman keenam sampai kesepuluh melindungi kehidupan, pernikahan, harta, kebenaran, dan hati. \"Jangan iri hati\" menutup daftar — karena iri adalah akar banyak dosa.\n\nIsrael mendengar suara Allah; mereka gemetar. Musa naik ke gunung selama empat puluh hari, menerima loh-loh batu ditulis tangan Allah. Sementara itu, Israel membuat anak lembu emas — pelanggaran pertama. Musa memecahkan loh-loh, lalu naik lagi; Allah menulis ulang.\n\nSepuluh Firman bukan jalan menuju keselamatan by works — Israel sudah dibebaskan dulu, baru menerima hukum. Hukum adalah respons umat yang sudah ditebus: \"Inilah cara hidup umat perjanjian.\" Yesus memenuhi hukum dan mengajarkan bahwa kebenaran sejati melampaui kepatuhan luar — ia dimulai dari hati.",
    keyMoments: [
      {
        title: "Israel tiba di Sinai",
        summary:
          "Tiga bulan setelah Keluaran, Israel tiba di padang gurun Sinai; Allah meneguhkan perjanjian.",
        reference: "Keluaran 19:1-6",
        passage: "Keluaran 19",
        verse: 1,
      },
      {
        title: "Akulah TUHAN, Allahmu",
        summary:
          "Allah memulai Sepuluh Firman dengan pengingat pembebasan dari Mesir.",
        reference: "Keluaran 20:2",
        passage: "Keluaran 20",
        verse: 2,
      },
      {
        title: "Firman pertama: tidak ada allah lain",
        summary:
          "Allah menegaskan monoteisme: jangan ada allah lain di hadapan-Nya.",
        reference: "Keluaran 20:3",
        passage: "Keluaran 20",
        verse: 3,
      },
      {
        title: "Kuduskan hari Sabat",
        summary:
          "Allah memerintahkan peringatan Sabat — tanda penciptaan dan pembebasan.",
        reference: "Keluaran 20:8-11",
        passage: "Keluaran 20",
        verse: 8,
      },
      {
        title: "Loh-loh batu",
        summary:
          "Allah menulis Sepuluh Firman di loh-loh batu; Musa menerimanya di puncak gunung.",
        reference: "Keluaran 31:18",
        passage: "Keluaran 31",
        verse: 18,
      },
    ],
    lessons: [
      "Allah peduli bagaimana kita hidup bersama Dia dan sesama manusia",
      "Hukum dimulai dengan pengingat pembebasan — kita taat karena sudah ditebus",
      "Kebenaran sejati melampaui kepatuhan luar; ia dimulai dari hati",
      "Menghormati orang tua, kehidupan, dan kebenaran adalah fondasi masyarakat",
      "Sabat mengajarkan perhentian dan peringatan karya Allah",
    ],
    reflection:
      "Sepuluh Firman sering terasa seperti daftar larangan — padahal ia adalah undangan hidup dalam kebebasan sejati. \"Jangan curi\" melindungi kepercayaan; \"jangan iri\" melindungi damai hati.\n\nFirman mana yang paling menantang hidupmu hari ini? Bukan untuk merasa bersalah semata, melainkan untuk membiarkan Roh Kudus menulis hukum Allah di hatimu — dari dalam, bukan dari luar saja.",
    prayer:
      "Tuhan, terima kasih karena Engkau sudah membebaskanku sebelum aku sempurna. Tulislah hukum-Mu di hatiku. Ajar aku kasih akan-Mu dan kasih kepada sesama — bukan sebagai beban, melainkan sebagai jalan kebebasan sejati. Amin.",
    keyPassages: [
      passage(
        "Keluaran 20:1-3",
        "Keluaran 20",
        1,
        "Allah mengucapkan segala firman ini: \"Akulah TUHAN, Allahmu… Janganlah ada bagimu allah lain di hadapan-Ku.\"",
      ),
      passage(
        "Keluaran 20:12",
        "Keluaran 20",
        12,
        "Hormatilah ayahmu dan ibumu, supaya lanjut umurmu di negeri yang diberikan TUHAN, Allahmu, kepadamu.",
      ),
      passage(
        "Keluaran 20:13",
        "Keluaran 20",
        13,
        "Janganlah membunuh.",
      ),
      passage(
        "Ulangan 6:5",
        "Ulangan 6",
        5,
        "Kasihilah TUHAN, Allahmu, dengan segenap hatimu dan dengan segenap jiwamu dan dengan segenap kekuatanmu.",
      ),
      passage(
        "Keluaran 19:5",
        "Keluaran 19",
        5,
        "…Maka kamu akan menjadi harta bag-Ku dari antara segala bangsa…",
      ),
    ],
  },
  yerikho: {
    background:
      "Setelah empat puluh tahun mengembara di padang gurun, generasi baru Israel siap masuk tanah perjanjian. Musa telah meninggal; Yosua diurapi sebagai pemimpin. Allah berulang kali menegaskan: \"Kuatkan dan teguhkan hatimu… Aku akan menyertai engkau.\"\n\nYerikho adalah kota berbenteng pertama di Kanaan — gerbang masuk ke tanah perjanjian. Temboknya tebal, gerbangnya tertutup rapat. Secara militer, Yerikho tampak mustahil ditaklukkan. Namun Allah tidak memanggil Israel untuk strategi manusia, melainkan ketaatan pada firman yang tampak aneh.\n\nKisah Yerikho mengajarkan bahwa kemenangan umat Allah bukan dari kekuatan sendiri, melainkan dari kepercayaan pada Allah yang berperang untuk mereka. Yosua 6 menjadi ikon iman — bukan iman kosong, melainkan iman yang taat meski instruksi tidak masuk akal.",
    narrative:
      "Yosua mengirim mata-mata ke Yerikho; mereka singgah di rumah Rahab, pelacur yang percaya Allah akan memberikan tanah itu. Rahab menyembunyikan mereka dan meminta perlindungan ketika Israel menyerang. Mata-mata berjanji: \"Tali kirmizi ini… siapa saja yang ada di dalam rumah ini, ia akan terlindung.\"\n\nAllah memberi instruksi unik: seluruh tentara Israel harus berputar mengelilingi Yerikho sekali sehari selama enam hari. Tujuh imam membawa tujuh sangkakala dari domba jantan di depan tabut perjanjian. Hari ketujuh, mereka berputar tujuh kali. Imamat tiup sangkakala; rakyat berteriak — dan tembok Yerikho runtuh.\n\nIsrael menyerbu; hanya Rahab dan keluarganya selamat, karena tali merah di jendelanya. Yohanes 6:25-26 mengingatkan: \"Karena imam…\" — iman Rahab diakui dalam kitab Ibrani. Yerikho dihancurkan total; harta dikutuk ke perbendaharaan Tuhan.\n\nKejadian Achan kemudian mengingatkan bahwa kemenangan bukan lisensi untuk serakah. Satu orang mengambil harta terlarang; Israel kalah di Ai. Setelah diadili, Israel menaklukkan Ai dan terus masuk ke tanah.\n\nYosua menegaskan: \"Kuatkan dan teguhkan hatimu… TUHAN, Allahmu, Dialah yang berperang untukmu.\" Yerikho bukan tentang kekuatan manusia — melainkan tentang Allah yang memberikan kemenangan kepada umat yang taat.",
    keyMoments: [
      {
        title: "Yosua diurapi pemimpin",
        summary:
          "Allah memerintahkan Yosua: \"Kuatkan dan teguhkan hatimu\" — Ia akan menyertai seperti menyertai Musa.",
        reference: "Yosua 1:9",
        passage: "Yosua 1",
        verse: 9,
      },
      {
        title: "Rahab dan tali merah",
        summary:
          "Rahab percaya Allah akan memberikan Kanaan; ia menyelamatkan mata-mata dan meminta perlindungan.",
        reference: "Yosua 2:12-14",
        passage: "Yosua 2",
        verse: 12,
      },
      {
        title: "Berputar mengelilingi Yerikho",
        summary:
          "Enam hari Israel berputar sekali; hari ketujuh tujuh kali — imam tiup sangkakala.",
        reference: "Yosua 6:3-4",
        passage: "Yosua 6",
        verse: 3,
      },
      {
        title: "Tembok runtuh",
        summary:
          "Rakyat berteriak; tembok Yerikho runtuh. Israel masuk dan menaklukkan kota.",
        reference: "Yosua 6:20",
        passage: "Yosua 6",
        verse: 20,
      },
      {
        title: "Rahab dan keluarganya selamat",
        summary:
          "Rahab, keluarga, dan harta miliknya diselamatkan karena imannya.",
        reference: "Yosua 6:25",
        passage: "Yosua 6",
        verse: 25,
      },
    ],
    lessons: [
      "Kemenangan sejati datang dari ketaatan pada firman Allah, bukan sombong diri",
      "Allah sering bekerja dengan cara yang melampaui logika dan strategi manusia",
      "Iman orang \"luar\" seperti Rahab diterima Allah — kasih setia-Nya melampaui batas suku",
      "Kemenangan spiritual bukan jaminan hidup mudah — tetap ada ujian seperti Achan",
      "Allah berperang untuk umat-Nya; tugas kita taat dan percaya",
    ],
    reflection:
      "Instruksi Allah untuk Yerikho terdengar aneh: berputar, tiup sangkakala, berteriak — bukan panah dan pedang. Mungkin Allah juga memanggil kita melakukan sesuatu yang tampak tidak masuk akal di mata dunia.\n\nDi mana kita perlu berhenti mengandalkan strategi sendiri dan mulai taat pada firman — meski belum melihat hasilnya? Rahab mengingatkan: iman bisa tumbuh di tempat yang paling tidak kita duga.",
    prayer:
      "Tuhan, kuatkan dan teguhkan hatiku seperti Yosua. Ajar aku taat pada firman-Mu meski jalan-Mu tampak aneh. Percayakan kemenangan hidupku kepada-Mu, bukan kepada kekuatanku sendiri. Amin.",
    keyPassages: [
      passage(
        "Yosua 1:9",
        "Yosua 1",
        9,
        "Bukankah telah Kuperintahkan kepadamu: kuatkan dan teguhkan hatimu? Janganlah kecut dan tawar hati, sebab TUHAN, Allahmu, menyertai engkau…",
      ),
      passage(
        "Yosua 6:20",
        "Yosua 6",
        20,
        "Lalu berteriaklah rakyat, sementara sangkakala ditiup. Segera sesudah rakyat mendengar bunyi sangkakala, berteriaklah mereka… maka runtuhlah tembok itu…",
      ),
      passage(
        "Yosua 2:11",
        "Yosua 2",
        11,
        "…Sebab TUHAN, Allahmu, Dialah Allah di langit di atas dan di bumi di bawah.",
      ),
      passage(
        "Yosua 6:25",
        "Yosua 6",
        25,
        "Tetapi Rahab, pelacur itu, dengan seisi rumahnya, dibiarkan hidup…",
      ),
      passage(
        "Yosua 1:5",
        "Yosua 1",
        5,
        "…Aku akan menyertai engkau, seperti Aku menyertai Musa; Aku tidak akan membiarkan engkau…",
      ),
    ],
  },
  "rut-boas": {
    background:
      "Kisah Rut terjadi \"pada zaman hakim-hakim\" — masa ketika \"setiap orang berbuat apa yang benar menurut pandangannya sendiri.\" Kelaparan melanda Betlehem; Naomi, Elimelekh, dan dua anak laki-laki pergi ke Moab. Di sana kedua menantu Naomi — Orpa dan Rut — menikah dengan anak-anak Naomi. Satu per satu, pria-pria itu mati. Naomi kehilangan suami dan anak.\n\nMoab adalah musuh tradisional Israel; Rut adalah perempuan asing. Namun justru dari kisah kecil inilah garis Daud — dan akhirnya Mesias — terungkap. Konsep hesed (kasih setia) menjadi benang merah: Rut menolak meninggalkan Naomi; Boas bertindak sebagai penebus (goel); Allah menulis kisah besar dari langkah-langkah setia yang kecil.\n\nKisah Rut adalah salah satu kisah paling hangat dalam Alkitab — tanpa milag besar, tanpa nabi, tanpa raja — hanya kesetiaan, kerendahan hati, dan providensi Allah di ladang gandum Betlehem.",
    narrative:
      "Naomi mendengar bahwa TUHAN telah memperhatikan umat-Nya; ia pulang ke Betlehem. Rut menolak kembali: \"Janganlah desak aku meninggalkan engkau… ke mana engkau pergi, ke situ jugalah aku pergi; bangsamu bangsaku, Allahmu Allahku.\" Mereka tiba di Betlehem pada awal musim menuai.\n\nRut pergi memungut jelai di ladang — hak miskin menurut hukum Israel. Ladang itu milik Boas, kerabat Elimelekh. Boas memperhatikan Rut, mendengar tentang kesetiaannya kepada Naomi. Ia memerintahkan pekerja membiarkan Rut memungut dengan aman dan mengisi berkat.\n\nNaomi mengajarkan Rut: pergi ke tempat pengirikan malam hari, berbaring di kaki Boas — tindakan risiko yang dalam budaya itu adalah permintaan perlindungan dan pernikahan. Boas memuji: \"Engkau lebih baik hati… karena engkau tidak pergi mengejar orang-orang muda.\" Ia berjanji menjadi penebus jika kerabat yang lebih dekat menolak.\n\nKerabat lebih dekat menolak — takut merusak warisannya. Boas menikahi Rut di depan saksi; umat memberkati: \"Semoga TUHAN membuat perempuan ini seperti Rahel dan Lea… dari keturunanmu kiranya bangkit keturunan untuk Boas.\" Rut melahirkan Obed; Naomi menggendong cucu. Obed menjadi bapa Yishai, bapa Daud.\n\nDari garis Rut dan Boas lahir Daud — dan akhirnya Yesus. Kisah kecil di tengah masa hakim mengungkap kasih setia Allah yang besar: Ia memakai perempuan Moab, janda miskin, untuk menulis garis Mesias.",
    keyMoments: [
      {
        title: "Rut menolak meninggalkan Naomi",
        summary:
          "Rut berkata: \"Bangsa-Mu bangsaku, Allah-Mu Allahku\" — kesetiaan yang melampaui batas suku.",
        reference: "Rut 1:16",
        passage: "Rut 1",
        verse: 16,
      },
      {
        title: "Memungut jelai di ladang Boas",
        summary:
          "Rut memungut jelai; Boas memperhatikan dan memberi perlindungan serta berkat.",
        reference: "Rut 2:8-12",
        passage: "Rut 2",
        verse: 8,
      },
      {
        title: "Naomi mengarahkan Rut",
        summary:
          "Naomi mengajarkan Rut mendekati Boas malam hari — langkah risiko demi perlindungan.",
        reference: "Rut 3:1-4",
        passage: "Rut 3",
        verse: 1,
      },
      {
        title: "Boas menjadi penebus",
        summary:
          "Boas menikahi Rut; ia bertindak sebagai goel (penebus) keluarga Elimelekh.",
        reference: "Rut 4:9-10",
        passage: "Rut 4",
        verse: 9,
      },
      {
        title: "Kelahiran Obed, nenek moyang Daud",
        summary:
          "Rut melahirkan Obed; Naomi menggendong cucu. Obed menjadi bapa Yishai, bapa Daud.",
        reference: "Rut 4:17",
        passage: "Rut 4",
        verse: 17,
      },
    ],
    lessons: [
      "Kasih setia (hesed) lebih kuat dari batas suku bangsa dan situasi sulit",
      "Allah menulis kisah besar dari langkah-langkah setia yang kecil dan kerendahan hati",
      "Kerendahan hati membuka pintu berkat — Rut memungut jelai, bukan mengejar status",
      "Keluarga dan komunitas adalah tempat Allah bekerja — bukan hanya di panggung besar",
      "Providensi Allah sering terlihat jelas hanya setelah kita melihat garis besar sejarah",
    ],
    reflection:
      "Rut kehilangan suami, tanah air, dan masa depan — namun ia memilih setia kepada Naomi. Boas memilih menjadi penebus meski Rut perempuan asing. Kasih setia kecil mereka mengubah sejarah.\n\nDi tengah kesulitan, apakah kita tetap setia pada orang-orang yang Allah tempatkan di hidup kita? Allah sering bekerja di ladang gandum — di tempat kerja biasa, di keluarga, di langkah-langkah rendah hati.",
    prayer:
      "Tuhan yang setia, ajar aku hesed seperti Rut — setia meski situasi sulit. Buka mataku melihat providensi-Mu di hal-hal kecil. Pakailah hidupku, sekecil apapun, untuk rencana-Mu yang besar. Amin.",
    keyPassages: [
      passage(
        "Rut 1:16",
        "Rut 1",
        16,
        "…Janganlah desak aku meninggalkan engkau… ke mana engkau pergi, ke situ jugalah aku pergi;… bangsamu bangsaku, Allahmu Allahku.",
      ),
      passage(
        "Rut 2:12",
        "Rut 2",
        12,
        "…TUHAN membalas perbuatanmu, dan upahmu kepadamu dibayar penuh oleh TUHAN, Allah Israel…",
      ),
      passage(
        "Rut 3:11",
        "Rut 3",
        11,
        "…Janganlah takut, hai anak perempuan, segala yang kaukatakan akan kulakukan kepadamu…",
      ),
      passage(
        "Rut 4:17",
        "Rut 4",
        17,
        "…Mereka memberi nama Obed kepada anak laki-laki itu. Dialah bapa Yishai, bapa Daud.",
      ),
      passage(
        "Rut 4:14",
        "Rut 4",
        14,
        "…TUHAN yang tidak menarik kembali kasih setia-Nya…",
      ),
    ],
  },
  "daud-goliat": {
    background:
      "Kisah Daud dan Goliat terjadi di masa Saul, raja pertama Israel. Filistin dan Israel berhadapan di Lembah Ela — dua tentara, satu raksasa. Goliat dari Gat tingginya enam hasta sejengkal — sekitar tiga meter — dengan baju zirah dan tombak besar. Setiap hari ia menantang: \"Berikanlah kepadaku seorang, supaya kita berperang melawan satu sama lain!\"\n\nTentara Israel gentar. Saul — yang tinggi dan gagah — tidak berani. Daud datang membawa roti untuk saudaranya, mendengar tantangan, dan bertanya: \"Siapakah orang Filistin yang tidak sunat itu…?\" Bagi Daud, ini bukan tentang ukuran tubuh, melainkan tentang nama Allah Israel.\n\nKisah ini menjadi ikon iman: Allah memakai yang lemah agar kuasa-Nya terlihat. Daud menolak baju zirah Saul — ia sudah terbiasa dengan alat gembala. Lima batu smooth, satu umban, dan keyakinan: \"Aku datang kepadamu dalam nama TUHAN.\"",
    narrative:
      "Filistin berkumpul di Sokho; Israel di Lembah Ela. Goliat keluar pagi dan sore selama empat puluh hari, menantang Israel. Saul dan seluruh tentara ketakutan. Yesse, ayah Daud, mengirim Daud membawa roti dan keju untuk saudara-saudaranya di medan perang.\n\nDaud mendengar Goliat menghina tentara Allah hidup. Ia bertanya: \"Apakah akan dibiarkan orang Filistin… terus menghina tentara Allah hidup?\" Saul mendengar; Daud menawarkan diri. Saul ragu: \"Engkau masih muda…\" Daud menceritakan: seekor singa dan seekor beruang ia bunuh saat menjaga kambing — \"TUHAN yang melepaskan aku… Ia pun melepaskan aku dari tangan Filistin ini.\"\n\nSaul memakaikan baju zirah; Daud tidak bisa bergerak. Ia melepasnya, mengambil tongkat, memilih lima batu smooth dari sungai, dan maju. Goliat menghina: \"Apakah aku anjing, ha, sehingga engkau mendatangi aku dengan tongkat?\" Daud menjawab: \"Engkau datang kepadaku dengan pedang, tombak, dan lembing, tetapi aku datang kepadamu dalam nama TUHAN semesta alam… Hari ini TUHAN akan menyerahkan engkau ke dalam tanganku.\"\n\nDaud mengumban batu; batu itu mengenai dahi Goliat. Raksasa jatuh; Daud mengambil pedang Goliat dan memenggal kepalanya. Tentara Filistin lari; Israel mengejar. Daud membawa kepala Goliat ke Yerusalem.\n\nKisah ini bukan tentang keberanian semu — melainkan tentang siapa yang kita percayai. Daud tidak sombong; ia menunjuk ke Allah. \"TUHAN tidak selamatkan dengan pedang dan lembing\" — kemenangan datang dari tangan Tuhan.",
    keyMoments: [
      {
        title: "Goliat menantang Israel",
        summary:
          "Goliat keluar empat puluh hari, menantang satu lawan satu; seluruh tentara Israel gentar.",
        reference: "1 Samuel 17:4-11",
        passage: "1 Samuel 17",
        verse: 4,
      },
      {
        title: "Daud mendengar dan menawarkan diri",
        summary:
          "Daud bertanya siapa orang Filistin yang menghina tentara Allah hidup; ia menawarkan diri kepada Saul.",
        reference: "1 Samuel 17:26-32",
        passage: "1 Samuel 17",
        verse: 26,
      },
      {
        title: "Lima batu smooth",
        summary:
          "Daud menolak baju zirah Saul; ia mengambil tongkat, umban, dan lima batu dari sungai.",
        reference: "1 Samuel 17:40",
        passage: "1 Samuel 17",
        verse: 40,
      },
      {
        title: "Dalam nama TUHAN",
        summary:
          "Daud: \"Aku datang kepadamu dalam nama TUHAN semesta alam… Hari ini TUHAN akan menyerahkan engkau ke dalam tanganku.\"",
        reference: "1 Samuel 17:45-46",
        passage: "1 Samuel 17",
        verse: 45,
      },
      {
        title: "Goliat jatuh",
        summary:
          "Batu mengenai dahi Goliat; raksasa jatuh. Daud memenggal kepalanya; Filistin lari.",
        reference: "1 Samuel 17:49-51",
        passage: "1 Samuel 17",
        verse: 49,
      },
    ],
    lessons: [
      "Allah memakai yang lemah agar kuasa-Nya yang terlihat, bukan kekuatan manusia",
      "Keberanian sejati lahir dari percaya pada Allah, bukan dari ukuran tubuh atau senjata",
      "Menghina umat Allah sama dengan menghina Allah — Daud membela nama TUHAN",
      "Pengalaman setia di tempat kecil (gembala) mempersiapkan kita untuk tantangan besar",
      "Kemenangan militer Israel selalu ditujukan untuk kemuliaan Allah, bukan diri sendiri",
    ],
    reflection:
      "Goliat tampak mustahil — tentara Israel melihat raksasa, Daud melihat Allah yang dihina. Apa \"Goliat\" dalam hidupmu: situasi, orang, atau ketakutan yang tampak terlalu besar?\n\nDaud tidak mengejek Saul yang takut — ia menawarkan diri. Kadang kita dipanggil menjadi Daud: percaya bahwa Allah cukup, meski kita hanya punya \"lima batu smooth.\"",
    prayer:
      "Tuhan semesta alam, ketika aku menghadapi Goliat dalam hidupku, ajar aku datang dalam nama-Mu — bukan dengan kekuatanku sendiri. Percayakan kemenanganku kepada-Mu. Amin.",
    keyPassages: [
      passage(
        "1 Samuel 17:45",
        "1 Samuel 17",
        45,
        "…Aku datang kepadamu dalam nama TUHAN semesta alam, Allah tentara Israel…",
      ),
      passage(
        "1 Samuel 17:49",
        "1 Samuel 17",
        49,
        "Lalu Daud mengulurkan tangannya ke dalam kantongnya, diambilnyalah sebutir batu…",
      ),
      passage(
        "1 Samuel 17:26",
        "1 Samuel 17",
        26,
        "…Siapakah orang Filistin yang tidak sunat itu, sehingga ia berani menghina tentara Allah yang hidup?",
      ),
      passage(
        "1 Samuel 17:37",
        "1 Samuel 17",
        37,
        "…TUHAN yang melepaskan aku dari cengkeraman singa… Ia pun melepaskan aku dari tangan Filistin ini.",
      ),
      passage(
        "1 Samuel 17:47",
        "1 Samuel 17",
        47,
        "…Sebab perang ini adalah urusan TUHAN…",
      ),
    ],
  },
  "elia-karmel": {
    background:
      "Elia muncul di masa Raja Ahab dan Izebel — salah satu pasangan terburuk dalam sejarah Israel. Ahab menikahi Izebel, putri raja Sidon; ia memperkenalkan penyembahan Baal dan Asyera. Nabi-nabi Baal mendapat dukungan istana; nabi-nabi TUHAN dibunuh. Elia tiba-tiba muncul di hadapan Ahab: \"Demi TUHAN… sungguh tidak akan ada embun dan hujan… kecuali atas firman-Ku.\"\n\nTiga tahun kemarau — tanda bahwa Baal, \"dewa\" hujan, tidak mampu. Elia kemudian menantang 450 nabi Baal di Gunung Karmel: \"Beribadahlah kepada Allah yang menjawab dengan api.\" Konteksnya adalah pertarungan teologis: siapa Allah yang hidup dan layak disembah?\n\nKisah Elia di Karmel adalah puncak dramatis, tetapi bukan akhir cerita. Elia juga lelah, takut, dan butuh pemulihan di bawah pohon juniper. Nabi yang kuat di Karmel juga manusia yang rapuh — mengingatkan bahwa kuasa Allah bekerja melalui hamba yang lemah.",
    narrative:
      "Setelah tiga tahun kemarau, Elia diperintahkan menemui Ahab. Obaja, pegawai istana yang takut akan TUHAN, membantu Elia. Ahab menuduh: \"Engkau, pengacau Israel!\" Elia membalas: \"Bukan aku, melainkan engkau… sebab engkau telah meninggalkan TUHAN.\" Ia mengajak pertemuan di Karmel: seluruh Israel, 450 nabi Baal, 400 nabi Asyera.\n\nElia berkata: \"Berapa lama lagi kamu berlompatan di antara dua pihak? Jika TUHAN itu Allah, ikutlah Dia; jika Baal, ikutlah Baal.\" Dua korban disiapkan; siapa pun yang menjawab dengan api, dialah Allah. Nabi Baal berteriak sejak pagi hingga siang: \"Hai Baal, jawablah kami!\" Mereka menari, melukai diri — Baal diam.\n\nElia mengejek: \"Mungkin Baal sedang berbicara… atau sedang tidur!\" Ia memperbaiki mezbah TUHAN yang runtuh, membasahi korban tiga kali dengan air hingga parit penuh. Pada waktu korban petang, Elia berdoa singkat: \"TUHAN, Allah Abraham… biarlah kiranya diketahui… bahwa Engkaulah Allah.\" Api turun — membakar korban, kayu, batu, tanah, bahkan air di parit.\n\nRakyat jatuh tersungkur: \"TUHAN, Dialah Allah! TUHAN, Dialah Allah!\" Nabi-nabi Baal dibunuh di sungai Kisyon. Elia berdoa; awan kecil muncul; hujan turun. Ahab menceritakan kepada Izebel; ia bersumpah membunuh Elia. Elia lari ke padang gurun, lelah dan putus asa — tetapi Allah menyuapinya, memberi kekuatan untuk perjalanan empat puluh hari ke Horeb.\n\nKarmel menegaskan: hanya Allah yang hidup. Tetapi Elia juga diajar bahwa Allah tidak selalu berada dalam angin, gempa, atau api — kadang dalam bisikan lembut.",
    keyMoments: [
      {
        title: "Janji kemarau tiga tahun",
        summary:
          "Elia memberitahu Ahab: tidak akan ada hujan kecuali atas firman Elia — ujian atas Baal.",
        reference: "1 Raja-raja 17:1",
        passage: "1 Raja-raja 17",
        verse: 1,
      },
      {
        title: "Berapa lama kamu berlompatan?",
        summary:
          "Elia menantang Israel memilih: TUHAN atau Baal — pertemuan di Gunung Karmel.",
        reference: "1 Raja-raja 18:21",
        passage: "1 Raja-raja 18",
        verse: 21,
      },
      {
        title: "Baal diam",
        summary:
          "450 nabi Baal berteriak sejak pagi; Baal tidak menjawab — meski mereka melukai diri.",
        reference: "1 Raja-raja 18:26-29",
        passage: "1 Raja-raja 18",
        verse: 26,
      },
      {
        title: "Api turun dari langit",
        summary:
          "Elia berdoa; api TUHAN turun membakar korban, kayu, batu, tanah, dan air.",
        reference: "1 Raja-raja 18:38",
        passage: "1 Raja-raja 18",
        verse: 38,
      },
      {
        title: "TUHAN, Dialah Allah!",
        summary:
          "Rakyat jatuh tersungkur dan berseru: TUHAN, Dialah Allah — kemenangan teologis.",
        reference: "1 Raja-raja 18:39",
        passage: "1 Raja-raja 18",
        verse: 39,
      },
    ],
    lessons: [
      "Allah hidup dan menjawab doa umat-Nya — Baal dan dewa-dewa palsu tidak mampu",
      "Kebenaran kadang perlu diperjuangkan di tengah mayoritas yang salah",
      "Kemenangan spiritual tidak menjamin hidup mudah — Elia juga lelah dan takut",
      "Allah bekerja melalui hamba yang taat, bukan melalui spektakel kosong",
      "Doa singkat dan percaya lebih kuat dari ritual panjang yang kosong",
    ],
    reflection:
      "Israel \"berlompatan di antara dua pihak\" — ingin Allah, tapi juga Baal. Mungkin kita juga membagi hati: mengaku percaya, tapi mengandalkan keamanan dunia.\n\nDi Karmel, Elia memanggil keputusan. Siapa Allah yang kita sembah sungguh-sungguh — bukan hanya di gereja, melainkan di keputusan harian?",
    prayer:
      "Tuhan yang hidup, bebaskan aku dari beribadah kepada \"Baal\" zaman ini — uang, pengakuan, atau keamanan palsu. Kuatkan imanku seperti Elia. Aku percaya: TUHAN, Engkaulah Allah. Amin.",
    keyPassages: [
      passage(
        "1 Raja-raja 18:21",
        "1 Raja-raja 18",
        21,
        "Lalu Elia tampil ke depan… berkata: \"Berapa lama lagi kamu berlompatan di antara dua pihak?…\"",
      ),
      passage(
        "1 Raja-raja 18:38",
        "1 Raja-raja 18",
        38,
        "Lalu turunlah api TUHAN… sehingga habis dimakan api itu…",
      ),
      passage(
        "1 Raja-raja 18:39",
        "1 Raja-raja 18",
        39,
        "Serta melihatnya hal itu, jatuhlah… seluruh rakyat itu dengan mukanya ke tanah, lalu berseru: \"TUHAN, Dialah Allah! TUHAN, Dialah Allah!\"",
      ),
      passage(
        "1 Raja-raja 18:37",
        "1 Raja-raja 18",
        37,
        "…Jawablah aku, ya TUHAN, jawablah aku, supaya… diketahui… bahwa Engkaulah TUHAN…",
      ),
      passage(
        "1 Raja-raja 19:12",
        "1 Raja-raja 19",
        12,
        "…Setelah angin ribut itu… ada suatu suara… yaitu suara lirih dan lembut.",
      ),
    ],
  },
  "daniel-singa": {
    background:
      "Daniel adalah salah satu dari bangsa Yahudi yang diangkut ke Babel setelah Yerusalem jatuh (605 SM). Ia dan tiga kawannya — Sadrakh, Mesakh, Abednego — dipilih melayani di istana raja karena kecerdasan dan penampilan. Daniel hidup di persimpangan: setia kepada Allah di tengah kekuasaan Babel yang absolut.\n\nDaniel 6 terjadi di bawah Darius Media — setelah Babel jatuh. Daniel diangkat menjadi salah satu dari tiga wakil raja; ia unggul sehingga raja bermaksud mengangkatnya mengatur seluruh kerajaan. Rekan-rekan bupati iri; mereka mencari celah — dan menemukan bahwa Daniel taat pada Allah.\n\nDecree raja melarang doa kepada siapa pun selain raja selama tiga puluh hari. Daniel tetap berlutut tiga kali sehari menghadap Yerusalem — kebiasaan doa yang konsisten. Kisah ini mengajarkan bahwa kesetiaan harian lebih kuat dari heroisme sesaat.",
    narrative:
      "Bupati-bupati dan satrap berencana jahat. Mereka datang kepada Darius: \"Raja hidup selama-lamanya!… buatlah perintah… barangsiapa dalam tiga puluh hari… berdoa kepada siapa pun kecuali kepada raja…\" Darius menandatangani — menurut hukum Media-Persia yang tidak bisa diubah.\n\nDaniel mendengar decree itu, tetapi ia pergi ke kamarnya — jendela terbuka ke Yerusalem — dan berlutut tiga kali sehari, berdoa dan mengucap syukur, seperti biasa. Para bupati menemukannya sedang berdoa. Mereka melapor kepada raja: \"Daniel… tidak peduli… perintah raja.\"\n\nDarius sedih; ia berusaha melepaskan Daniel hingga matahari terbenam. Tetapi hukum Media-Persia tidak bisa diubah. Daniel dilempar ke liang singa. Raja berkata: \"Allahmu, yang kaulayani dengan setia, Dialah yang akan melepaskan engkau!\" Batu ditutup; raja bermalam tanpa makan.\n\nPagi-pagi buta, Darius berlari ke liang singa: \"Daniel, hamba Allah yang hidup! Mampukah Allahmu… melepaskan engkau dari singa-singa?\" Daniel menjawab: \"Ya raja, hidup selama-lamanya! Allahku… mengutus malaikat-Nya… menutup mulut singa-singa itu.\"\n\nDaniel dibangkitkan tanpa cedera — \"karena ia percaya kepada Allahnya.\" Penuduh Daniel dan keluarganya dilempar ke liang; singa langsung mengalahkan mereka. Darius mengeluarkan decree: \"…di seluruh kerajaanku… Allah Daniel… Dialah Allah yang hidup…\" Kesetiaan kecil yang konsisten mengalahkan tekanan kekuasaan.",
    keyMoments: [
      {
        title: "Daniel diangkat wakil raja",
        summary:
          "Daniel unggul di antara bupati; raja bermaksud mengangkatnya mengatur seluruh kerajaan.",
        reference: "Daniel 6:3",
        passage: "Daniel 6",
        verse: 3,
      },
      {
        title: "Decree melarang doa",
        summary:
          "Bupati iri membuat raja menandatangani decree: dilarang berdoa kepada siapa pun selain raja.",
        reference: "Daniel 6:7-9",
        passage: "Daniel 6",
        verse: 7,
      },
      {
        title: "Berdoa seperti biasa",
        summary:
          "Daniel tetap berlutut tiga kali sehari menghadap Yerusalem — doa dan syukur seperti biasa.",
        reference: "Daniel 6:10",
        passage: "Daniel 6",
        verse: 10,
      },
      {
        title: "Dilempar ke liang singa",
        summary:
          "Daniel dilempar ke liang singa; raja berkata: Allahmu akan melepaskan engkau.",
        reference: "Daniel 6:16-17",
        passage: "Daniel 6",
        verse: 16,
      },
      {
        title: "Malaikat menutup mulut singa",
        summary:
          "Daniel selamat; Allah mengutus malaikat menutup mulut singa karena ia percaya.",
        reference: "Daniel 6:22-23",
        passage: "Daniel 6",
        verse: 22,
      },
    ],
    lessons: [
      "Kesetiaan harian lebih kuat dari heroisme sesaat — Daniel berdoa \"seperti biasa\"",
      "Allah melindungi hamba-Nya yang takut akan Dia, meski sistem berusaha menekan",
      "Integritas spiritual tidak boleh ditukar demi promosi atau keamanan jabatan",
      "Doa bukan tindakan pribadi semata — ia menegaskan siapa Raja sejati hidup kita",
      "Allah dapat membalikkan rencana jahat manusia untuk kemuliaan-Nya",
    ],
    reflection:
      "Daniel tidak sengaja provokasi — ia hanya tetap taat pada kebiasaan doa. Decree raja tidak mengubah rutinitas spiritualnya. Di tengah tekanan \"dilarang berdoa\" (secara metaforis: sibuk, takut, atau malu), apakah kita tetap berlutut?\n\nKesetiaan kecil setiap hari membentuk karakter yang kuat ketika ujian besar datang.",
    prayer:
      "Tuhan, ajar aku berdoa \"seperti biasa\" — setia setiap hari meski tekanan datang. Lindungi integritasku; jangan biarkan aku takut akan manusia lebih dari takut akan-Mu. Amin.",
    keyPassages: [
      passage(
        "Daniel 6:10",
        "Daniel 6",
        10,
        "Sedang Daniel mengetahui… perintah… ia pergi ke… kamarnya… lalu… berlutut tiga kali sehari…",
      ),
      passage(
        "Daniel 6:22",
        "Daniel 6",
        22,
        "Allahku… mengutus malaikat-Nya… menutup mulut singa-singa itu…",
      ),
      passage(
        "Daniel 6:16",
        "Daniel 6",
        16,
        "…Allahmu, yang kaulayani dengan setia, Dialah yang akan melepaskan engkau!",
      ),
      passage(
        "Daniel 6:23",
        "Daniel 6",
        23,
        "…Tidak… ditemukan… cedera… karena ia percaya kepada Allahnya.",
      ),
      passage(
        "Daniel 6:26",
        "Daniel 6",
        26,
        "…Aku… memerintahkan… bahwa… di seluruh… kerajaanku… Allah Daniel… Dialah Allah yang hidup…",
      ),
    ],
  },
  ester: {
    background:
      "Kisah Ester terjadi di Persia pada masa Raja Ahasyveros (Xerxes I, sekitar 486–465 SM). Yahudi tersebar di seluruh kekaisaran — hasil deportasi dan diaspora. Mordekhai, kerabat Ester, duduk di pintu gerbang istana. Ester — mula-mula Hadasa — dipilih menjadi ratu setelah Vashti dipecat.\n\nAlkitab tidak pernah menyebut nama Allah secara eksplisit dalam kitab Ester — namun providensi-Nya terasa di setiap kejadian: Vashti dipecat, Ester terpilih, Mordekhai mendengar rencana jahat, Ester berani menghadapi raja. Haman, Agagit, membenci Mordekhai karena ia tidak sujud; ia merencanakan pemusnahan seluruh bangsa Yahudi.\n\nPurim — perayaan Yahudi — lahir dari kisah ini. Ester mengingatkan bahwa posisi kita, sekecil apapun, bisa jadi alat Allah untuk orang lain. \"Mungkin justru karena inilah engkau menjadi ratu.\"",
    narrative:
      "Haman naik menjadi pembesar; semua sujud kepadanya kecuali Mordekhai. Haman marah — bukan hanya pada Mordekhai, melainkan seluruh bangsa Yahudi. Ia meminta decree pemusnahan; raja menandatangani. Mordekhai berkabung, berpakaian kain buruk, berteriak di depan pintu istana.\n\nEster mendengar; Mordekhai mengirim pesan: \"Janganlah kiranya engkau mengira… bahwa engkau akan terluput… Mungkin justru karena inilah engkau menjadi ratu.\" Ester meminta puasa tiga hari; ia berkata: \"Jika aku binasa, biarlah aku binasa.\"\n\nEster masuk ke halaman istana tanpa dipanggil — bisa dihukum mati. Raja mengulurkan tongkat emas. \"Apa keinginanmu?\" Ester mengundang raja dan Haman ke perjamuan. Malam pertama ia menunda; malam kedua ia mengungkap: \"Adalah aku dan bangsaku dijual untuk dimusnahkan.\"\n\nRaja marah: \"Siapa dia?\" \"Haman!\" Haman memohon belas kasihan di ranjang Ester — raja salah paham. Haman digantung di tiang yang ia siapkan untuk Mordekhai. Mordekhai diangkat menggantikan Haman. Decree pemusnahan tidak bisa dicabut — tetapi raja mengizinkan Yahudi membela diri. Bangsa selamat; Purim dirayakan.\n\nAllah tidak disebut, tetapi tangan-Nya jelas: kebetulan-kebetulan \"sial\" (pur) Haman terbalik; Ester di tempat yang tepat; Mordekhai yang mendengar rencana jahat. Providensi Allah bekerja di balik layar sejarah.",
    keyMoments: [
      {
        title: "Ester menjadi ratu",
        summary:
          "Hadasa — Ester — dipilih menjadi ratu; Mordekhai duduk di pintu gerbang istana.",
        reference: "Ester 2:17",
        passage: "Ester 2",
        verse: 17,
      },
      {
        title: "Haman merencanakan pemusnahan",
        summary:
          "Haman membenci Mordekhai; ia merencanakan pemusnahan seluruh bangsa Yahudi.",
        reference: "Ester 3:5-6",
        passage: "Ester 3",
        verse: 5,
      },
      {
        title: "Mungkin justru karena inilah",
        summary:
          "Mordekhai: \"Mungkin justru karena inilah engkau menjadi ratu\" — panggilan untuk saat ini.",
        reference: "Ester 4:14",
        passage: "Ester 4",
        verse: 14,
      },
      {
        title: "Jika aku binasa, biarlah aku binasa",
        summary:
          "Ester meminta puasa tiga hari; ia berani masuk ke hadapan raja tanpa dipanggil.",
        reference: "Ester 4:16",
        passage: "Ester 4",
        verse: 16,
      },
      {
        title: "Haman terbalik, bangsa selamat",
        summary:
          "Haman digantung; Yahudi membela diri dan selamat — Purim dirayakan.",
        reference: "Ester 7:10",
        passage: "Ester 7",
        verse: 10,
      },
    ],
    lessons: [
      "Posisi kita — sekecil apapun — bisa jadi alat Allah untuk menyelamatkan orang lain",
      "Keberanian sering dimulai dari \"jika aku binasa, biarlah aku binasa\"",
      "Allah bekerja meski nama-Nya tidak disebut — providensi-Nya di balik kejadian",
      "Puasa dan doa komunitas mempersiapkan langkah berani",
      "Rencana jahat manusia dapat terbalik oleh tangan Allah",
    ],
    reflection:
      "Ester awalnya diam — mungkin takut kehilangan posisi. Mordekhai membangunkannya: mungkin justru untuk inilah engkau ada. Apakah ada situasi di mana Allah memanggil kita berbicara, bertindak, atau membela — meski berisiko?\n\nProvidensi Allah sering terlihat jelas hanya setelah kita melihat ke belakang. Percayalah: Ia bekerja meski kita tidak melihat nama-Nya tertulis.",
    prayer:
      "Tuhan yang bekerja di balik layar, berikan aku keberanian Ester untuk saat ini. Pakailah posisiku — sekecil apapun — untuk kebaikan orang lain. Jika aku harus binasa demi kebenaran, biarlah aku taat. Amin.",
    keyPassages: [
      passage(
        "Ester 4:14",
        "Ester 4",
        14,
        "…Mungkin justru karena inilah engkau memperoleh kedudukan…",
      ),
      passage(
        "Ester 4:16",
        "Ester 4",
        16,
        "…Jika aku binasa, biarlah aku binasa.",
      ),
      passage(
        "Ester 8:16",
        "Ester 8",
        16,
        "…Bagi orang Yahudi… ada sukacita dan kegembiraan…",
      ),
      passage(
        "Ester 2:17",
        "Ester 2",
        17,
        "…Raja… mengangkat Ester… dan… mengangkatnya menjadi ratu…",
      ),
      passage(
        "Ester 7:10",
        "Ester 7",
        10,
        "…Maka Haman… digantung… tiang… lima puluh hasta…",
      ),
    ],
  },
  yunus: {
    background:
      "Yunus melayani sebagai nabi di Israel (Kerajaan Utara) sekitar abad ke-8 SM — kontemporan dengan Amos. Ninewe adalah ibu kota Asyur, kekaisaran yang kejam dan musuh Israel. Allah memanggil Yunus: \"Bangunlah, pergilah ke Ninewe… serulah… sebab kejahatan mereka telah… naik ke hadapan-Ku.\"\n\nYunus lari — bukan karena takut gagal, melainkan karena takut berhasil. Ia tahu Allah \"anugerah dan belas kasihan… dan yang menyesal…\" (Yunus 4:2). Ia tidak ingin Ninewe selamat. Kisah Yunus mengungkap hati manusia yang sempit dan anugerah Allah yang luas.\n\nKitab Yunus unik: fokus bukan pada bangsa Ninewe saja, melainkan pada transformasi nabi yang lari. Ikan besar, pohon jarak, dan cacing — semua alat Allah mengajar Yunus tentang belas kasihan.",
    narrative:
      "Yunus turun ke Yafo; ia naik kapal ke Tarsis — arah berlawanan dari Ninewe. Allah menurunkan badai; kapal hampir hancur. Yunus tidur di buritan; nakhoda membangunkannya. Yunus mengaku: \"Aku… lari… dari hadirat TUHAN.\" Mereka melemparkan Yunus ke laut; laut tenang.\n\nAllah menyiapkan ikan besar menelan Yunus. Tiga hari tiga malam di perut ikan — Yunus berdoa dari \"dalam kerongkongan maut.\" Ia mengucap syukur; ikan memuntahkannya ke darat.\n\nAllah memanggil lagi: \"Bangunlah, pergilah ke Ninewe.\" Yunus berjalan sehari penuh ke kota besar — tiga hari perjalanan. Ia memberitakan singkat: \"Empat puluh hari lagi Ninewe akan ditunggangbalikkan!\" Raja, bangsawan, dan rakyat — termasuk hewan — berpuasa, berkabung, bertobat. Allah menyesal dan tidak menjatuhkan malapetaka.\n\nYunus marah — sangat marah. \"Bukankah… inilah… sebab aku… lari…?\" Ia duduk di timur kota, menunggu melihat kota hancur. Allah menyiapkan pohon jarak memberi naungan; keesokan harinya cacing memakan pohon; angin panas membakar. Yunus ingin mati.\n\nAllah berkata: \"Engkau sayang… tumbuh… dalam semalam… padahal… tidak… bekerja… Aku… sayang… Ninewe…\" Kisah berakhir dengan pertanyaan terbuka — mengundang pembaca merenungkan belas kasihan Allah yang melampaui batas suku dan bangsa.",
    keyMoments: [
      {
        title: "Yunus lari ke Tarsis",
        summary:
          "Allah memanggil Yunus ke Ninewe; ia lari naik kapal ke Tarsis — arah berlawanan.",
        reference: "Yunus 1:3",
        passage: "Yunus 1",
        verse: 3,
      },
      {
        title: "Ditelan ikan besar",
        summary:
          "Yunus dilempar ke laut; Allah menyiapkan ikan besar menelannya — tiga hari tiga malam.",
        reference: "Yunus 1:17",
        passage: "Yunus 1",
        verse: 17,
      },
      {
        title: "Doa dari perut ikan",
        summary:
          "Yunus berdoa dari \"dalam kerongkongan maut\"; ia mengucap syukur dan ikan memuntahkannya.",
        reference: "Yunus 2:2",
        passage: "Yunus 2",
        verse: 2,
      },
      {
        title: "Ninewe bertobat",
        summary:
          "Yunus memberitakan; raja, rakyat, dan hewan berpuasa. Allah menyesal dan tidak menjatuhkan malapetaka.",
        reference: "Yunus 3:10",
        passage: "Yunus 3",
        verse: 10,
      },
      {
        title: "Allah sayang Ninewe",
        summary:
          "Allah tegur Yunus: Ia sayang Ninewe — kota besar dengan lebih dari 120.000 orang.",
        reference: "Yunus 4:11",
        passage: "Yunus 4",
        verse: 11,
      },
    ],
    lessons: [
      "Tidak ada tempat lari dari panggilan Allah — Ia mengejar hamba-Nya",
      "Allah peduli pada bangsa yang jauh dari-Nya — anugerah melampaui batas suku",
      "Hati manusia sering sempit; anugerah Allah jauh lebih luas",
      "Pertobatan bangsa musuh mengungkap belas kasihan Allah yang mengejutkan",
      "Allah mengajar nabi-Nya melalui pengalaman — bahkan kegagalan dan pelarian",
    ],
    reflection:
      "Yunus bukan pahlawan sempurna — ia lari, marah, dan egois. Mungkin kita juga sulit menerima bahwa Allah sayang pada \"Ninewe\" dalam hidup kita: orang yang kita anggap tidak layak.\n\nAllah mengejar Yunus bukan untuk menghukum, melainkan untuk memperluas hatinya. Apakah ada seseorang yang kita anggap \"di luar jangkauan\" anugerah Allah?",
    prayer:
      "Tuhan yang sayang Ninewe, lebarkan hatiku yang sempit. Ampuni ketika aku lari dari panggilan-Mu. Ajar aku bergembira ketika orang bertobat — bukan marah karena \"mereka tidak layak.\" Amin.",
    keyPassages: [
      passage(
        "Yunus 1:3",
        "Yunus 1",
        3,
        "…Ia… naik kapal… untuk pergi ke Tarsis… jauh dari hadirat TUHAN.",
      ),
      passage(
        "Yunus 2:2",
        "Yunus 2",
        2,
        "…Aku… berseru… dari dalam kerongkongan maut…",
      ),
      passage(
        "Yunus 3:10",
        "Yunus 3",
        10,
        "Ketika Allah melihat perbuatan mereka… menyesallah… dan tidak… menjatuhkan… malapetaka…",
      ),
      passage(
        "Yunus 4:2",
        "Yunus 4",
        2,
        "…Bukankah… inilah… sebab aku… lari…?… Engkau… anugerah dan belas kasihan…",
      ),
      passage(
        "Yunus 4:11",
        "Yunus 4",
        11,
        "…Aku… sayang… Ninewe… yang… besar…",
      ),
    ],
  },
  "kelahiran-yesus": {
    background:
      "Kelahiran Yesus terjadi di bawah kekuasaan Roma — Kaisar Augustus mengeluarkan sensus; Yehuda di bawah Herodes. Bangsa Israel menunggu Mesias yang akan membebaskan dari penjajah. Namun cara Allah menggenapi janji jauh berbeda dari harapan politis: bukan istana, melainkan palungan; bukan kerumunan, melainkan gembala.\n\nInjil Lukas dan Matius menceritakan kelahiran dengan sudut berbeda: Lukas menekankan kerendahan hati dan gembala; Matius menekankan garis Daud dan Majus dari Timur. Keduanya menegaskan: Yesus adalah Emmanuel — \"Allah beserta kita\" — inkarnasi Allah menjadi manusia.\n\nYohanes 1:14 merangkum: \"Firman itu telah menjadi manusia, dan diam di antara kita.\" Kelahiran Natal bukan dongeng manis, melainkan pusat kisah keselamatan: Allah datang dekat, hidup di dunia kita, dan membuka jalan menuju rekonsiliasi.",
    narrative:
      "Malaikat Gabriel datang kepada Maria di Nazaret: \"Engkau akan mengandung… Anak Suci… anak Allah.\" Maria bertanya: \"Bagaimana mungkin?\" \"Roh Kudus… akan turun ke atas engkau.\" Maria menjawab: \"Jadilah kepadaku…\" Yusuf, tunangannya, bermaksud menceraikannya secara diam-diam — malaikat menampakkan diri: \"Anak… dari Roh Kudus… engkau akan menamainya Yesus.\"\n\nAugustus sensus; setiap orang ke kota asalnya. Yusuf dan Maria pergi ke Betlehem — kota Daud. Di sana tidak ada tempat di penginapan; Anak lahir, dibungkus kain, dibaringkan di palungan. Di padang, malaikat memberitakan kepada gembala: \"Aku memberitakan… sukacita besar… Hari ini… lahir… Juruselamat… Kristus, Tuhan.\"\n\nGembala bergegas; mereka menemukan Maria, Yusuf, dan bayi di palungan. Mereka memberitakan; semua heran. Maria \"menyimpan… segala perkara itu… dan merenungkannya di dalam hatinya.\"\n\nMatius menceritakan Majus dari Timur — mereka melihat bintang, datang ke Yerusalem, lalu Betlehem. Mereka sujud, membawa emas, kemenyan, dan mur. Malaikat memperingatkan Yusuf; keluarga lari ke Mesir — Herodes membunuh anak-anak di Betlehem.\n\nKelahiran Yesus menggenapi nubuat: Betlehem (Mikha 5:2), anak perawan (Yesaya 7:14), dan garis Daud. \"Allah beserta kita\" — bukan slogan Natal, melainkan realitas: Pencipta langit dan bumi datang dalam kerendahan, agar kita bisa dekat dengan Allah.",
    keyMoments: [
      {
        title: "Malaikat memberitakan kepada Maria",
        summary:
          "Gabriel: Maria akan mengandung Anak Suci; Maria menjawab \"Jadilah kepadaku\".",
        reference: "Lukas 1:31-38",
        passage: "Lukas 1",
        verse: 31,
      },
      {
        title: "Yusuf dan sensus ke Betlehem",
        summary:
          "Augustus sensus; Yusuf dan Maria pergi ke Betlehem — kota Daud.",
        reference: "Lukas 2:1-5",
        passage: "Lukas 2",
        verse: 1,
      },
      {
        title: "Lahir di palungan",
        summary:
          "Tidak ada tempat di penginapan; Anak lahir, dibungkus kain, dibaringkan di palungan.",
        reference: "Lukas 2:7",
        passage: "Lukas 2",
        verse: 7,
      },
      {
        title: "Kabar gembira bagi gembala",
        summary:
          "Malaikat memberitakan: \"Hari ini… lahir… Juruselamat… Kristus, Tuhan.\"",
        reference: "Lukas 2:11",
        passage: "Lukas 2",
        verse: 11,
      },
      {
        title: "Majus dari Timur",
        summary:
          "Majus datang, sujud, membawa emas, kemenyan, dan mur — menyembah Raja yang lahir.",
        reference: "Matius 2:11",
        passage: "Matius 2",
        verse: 11,
      },
    ],
    lessons: [
      "Allah dekat — Ia datang ke dunia kita, bukan menunggu kita naik kepada-Nya",
      "Kerendahan hati adalah cara Allah menyatakan kemuliaan-Nya",
      "Kabar baik pertama datang kepada gembala — orang sederhana, bukan elite",
      "Maria dan Yusuf diajar taat meski jalan yang sulit dan tidak terduga",
      "Emmanuel — Allah beserta kita — adalah janji yang mengubah hidup",
    ],
    reflection:
      "Palungan bukan tempat yang kita bayangkan untuk Raja — tetapi justru di situlah Allah memilih hadir. Mungkin Allah juga bekerja di tempat-tempat \"palungan\" dalam hidup kita: situasi rendah, tidak glamor, tapi penuh makna.\n\nNatal mengajak kita melihat dekat — bukan hanya tradisi atau dekorasi, melainkan kebenaran: Allah datang untuk kita. Apakah kita hidup seolah Allah benar-benar \"beserta kita\"?",
    prayer:
      "Tuhan Yesus, terima kasih karena Engkau rela lahir rendah agar aku bisa dekat dengan Allah. Buka hatiku menerima Emmanuel — Allah beserta aku — setiap hari, bukan hanya saat Natal. Amin.",
    keyPassages: [
      passage(
        "Lukas 2:11",
        "Lukas 2",
        11,
        "…Hari ini… lahir… Juruselamat… Kristus, Tuhan…",
      ),
      passage(
        "Matius 1:23",
        "Matius 1",
        23,
        "…Mereka… menamainya… Yesus… \"Allah beserta kita.\"",
      ),
      passage(
        "Yohanes 1:14",
        "Yohanes 1",
        14,
        "Firman itu telah menjadi manusia, dan diam di antara kita…",
      ),
      passage(
        "Lukas 2:7",
        "Lukas 2",
        7,
        "…Ia melahirkan anak laki-laki… dibungkus… kain… dibaringkan… palungan…",
      ),
      passage(
        "Lukas 1:38",
        "Lukas 1",
        38,
        "…Kata Maria: \"…Jadilah kepadaku…\"",
      ),
    ],
  },
  "khotbah-bukit": {
    background:
      "Khotbah di Bukit (Matius 5–7) adalah pengajaran Yesus paling terkenal — disampaikan di Galilea, kemungkinan dekat Kapernaum. Yesus \"duduk\" — posisi guru Rabbinik —; murid-murid dan orang banyak mendengar. Matius mengatur khotbah ini sebagai \"Torah baru\" — penggenapan dan perluasan hukum Musa.\n\nBeatitudes (Matius 5:3–12) membuka dengan membalikkan logika dunia: berbahagialah yang miskin di hadapan Allah, yang lemah lembut, yang berduk cita, yang lapar dan haus akan kebenaran. Kerajaan surga punya nilai yang berbeda dari kerajaan dunia.\n\nKhotbah ini bukan daftar aturan untuk \"masuk surga\" — melainkan deskripsi kehidupan umat kerajaan: garam dan terang, kasih kepada musuh, doa Bapa kami, dan fondasi batu versus pasir.",
    narrative:
      "Yesus melihat orang banyak; Ia naik ke bukit, duduk. Murid-murid mendekat. Ia membuka: \"Berbahagialah…\" — bukan \"beruntung\", melainkan blessed: hidup yang benar di hadapan Allah. Yang miskin di hadapan Allah, yang lemah lembut, yang lapar akan kebenaran — mereka yang masuk kerajaan.\n\nYesus mengajarkan: \"Kamu adalah garam dunia… terang dunia.\" Murid dipanggil hidup berbeda — terlihat, tapi bukan untuk pamer. Ia memperluas hukum: marah setara membunuh; lust setara zinah; sumpah setia; balas yang jahat dengan kebaikan; kasihi musuh.\n\n\"Berdoalah demikian: Bapa kami…\" — doa yang mengajarkan ketergantungan, pengampunan, dan kerajaan Allah. \"Janganlah kamu khawatir… carilah dahulu kerajaan Allah.\" \"Janganlah kamu menghakimi… supaya kamu tidak dihakimi.\"\n\n\"Masuklah melalui pintu yang sesempit…\" \"Demi buahnya… kamu akan mengenal pohonnya.\" \"Setiap orang… yang mendengar… dan melakukannya… seperti orang… yang… membangun rumah… atas batu.\" Badai datang; rumah di batu tegak.\n\nKhotbah di Bukit menggambarkan etika kerajaan: bukan legalisme, melainkan transformasi hati. Yesus bukan mencabut hukum — \"Aku datang… menggenapkan\" — melainkan menunjukkan makna sejati: kebenaran dari dalam, bukan sekadar kepatuhan luar.",
    keyMoments: [
      {
        title: "Beatitudes",
        summary:
          "Yesus membuka: \"Berbahagialah yang miskin di hadapan Allah…\" — kerajaan surga milik mereka.",
        reference: "Matius 5:3",
        passage: "Matius 5",
        verse: 3,
      },
      {
        title: "Garam dan terang",
        summary:
          "Murid adalah garam dan terang dunia — hidup yang terlihat, memuliakan Bapa.",
        reference: "Matius 5:14",
        passage: "Matius 5",
        verse: 14,
      },
      {
        title: "Kasihi musuhmu",
        summary:
          "Yesus memerintahkan kasih kepada musuh — supaya kamu menjadi anak-anak Bapamu.",
        reference: "Matius 5:44",
        passage: "Matius 5",
        verse: 44,
      },
      {
        title: "Doa Bapa kami",
        summary:
          "Yesus mengajarkan doa: \"Bapa kami… datanglah kerajaan-Mu…\"",
        reference: "Matius 6:9",
        passage: "Matius 6",
        verse: 9,
      },
      {
        title: "Rumah di atas batu",
        summary:
          "Orang yang mendengar dan melakukan firman seperti rumah di batu — tegak saat badai.",
        reference: "Matius 7:24-25",
        passage: "Matius 7",
        verse: 24,
      },
    ],
    lessons: [
      "Kerajaan Allah membalikkan prioritas dunia — yang rendah hati ditinggikan",
      "Murid dipanggil hidup berbeda — garam dan terang, bukan menyatu dengan kegelapan",
      "Kebenaran sejati dimulai dari hati, bukan sekadar kepatuhan luar",
      "Doa Bapa kami mengajarkan ketergantungan dan kerajaan Allah sebagai prioritas",
      "Mendengar firman tanpa melakukannya seperti rumah di pasir — runtuh saat ujian",
    ],
    reflection:
      "Beatitudes mengguncang: yang \"berbahagia\" menurut Yesus bukan yang kaya atau terkenal, melainkan yang miskin di hadapan Allah, yang lemah lembut, yang berduk cita. Apakah kita hidup menurut standar dunia atau standar kerajaan?\n\nKhotbah di Bukit bukan untuk dibaca sekali — melainkan untuk dihayati. Firman mana yang paling menantang hidupmu hari ini?",
    prayer:
      "Tuhan Yesus, ajar aku hidup menurut Khotbah di Bukit — rendah hati, garam dan terang, kasih kepada musuh. Bangunkan hidupku di atas batu firman-Mu, bukan pasir keinginan dunia. Amin.",
    keyPassages: [
      passage(
        "Matius 5:3",
        "Matius 5",
        3,
        "\"Berbahagialah… yang miskin di hadapan Allah, karena… kerajaan… surga…\"",
      ),
      passage(
        "Matius 5:14",
        "Matius 5",
        14,
        "\"Kamu adalah terang dunia…\"",
      ),
      passage(
        "Matius 6:9",
        "Matius 6",
        9,
        "\"…Berdoalah demikian: Bapa kami… datanglah kerajaan-Mu…\"",
      ),
      passage(
        "Matius 5:44",
        "Matius 5",
        44,
        "\"…Kasihilah musuhmu…\"",
      ),
      passage(
        "Matius 7:24",
        "Matius 7",
        24,
        "\"…Setiap orang… yang mendengar… dan melakukannya… seperti orang… yang… membangun rumah… atas batu.\"",
      ),
    ],
  },
  "anak-hilang": {
    background:
      "Perumpamaan Anak yang Hilang (Lukas 15:11–32) adalah bagian dari trio perumpamaan \"yang hilang\" — domba, drachma, dan anak. Yesus menceritakan ketika Farisi dan ahli Taurat menggerutu: \"Ia menerima orang berdosa…\" Konteksnya: Yesus makan dengan pendosa; Farisi merasa superior.\n\nPerumpamaan ini sering disebut \"Anak Prodigal\" — anak yang boros. Tetapi fokus sebenarnya adalah Bapa: kasih yang menerima kembali, berlari menyambut, memakaikan jubah terbaik. Anak yang tinggal di rumah (kakak) juga diajar: iri hati, merasa \"layak\" — hati yang sama-sama perlu pertobatan.\n\nLukas 15 menggambarkan sukacita surga atas satu orang berdosa yang bertobat — bukan atas ninety-nine yang merasa tidak perlu.",
    narrative:
      "Seorang bapa punya dua anak laki-laki. Anak bungsu berkata: \"Berikan bagian… warisan…\" — seolah ingin ayah mati. Ia pergi jauh, menghamburkan harta dengan hidup bejat. Ketika habis, kelaparan melanda; ia bekerja memberi makan babi — pekerjaan haram bagi Yahudi — dan ingin makan pod babi.\n\nIa sadar: \"Di rumah ayahku… pegawai… kelebihan makanan… Aku akan bangkit… pergi… berkata: Bapa, aku berdosa… tak layak…\" Ia bangkit — \"sedang ia jauh… ayahnya melihat… merasa… kasihan… berlari… memeluk… mencium.\"\n\nAnak hendak jadi hamba; ayah memerintahkan: \"Bawa… jubah… terbaik… cincin… kasut… sembelih… anak… gemuk… Pesta!\" \"Anakku ini mati, tetapi hidup kembali; hilang, tetapi didapat kembali.\"\n\nKakak pulang dari ladang; mendengar musik. Marah — tidak mau masuk. Ayah keluar memohon. \"Aku… melayani… engkau… tak pernah… kambing… Tetapi… anakmu… pesta!\" Ayah: \"Anakku… selalu… bersama… segala… milikku… Adalah patut… bersukacita… adikmu… mati… hidup…\"\n\nPerumpamaan berakhir terbuka — kakak belum masuk. Yesus mengundang Farisi (dan kita) merenung: apakah kita Bapa yang menerima, anak yang kembali, atau kakak yang iri?",
    keyMoments: [
      {
        title: "Anak minta warisan",
        summary:
          "Anak bungsu meminta bagian warisan dan pergi jauh — menghamburkan harta dengan hidup bejat.",
        reference: "Lukas 15:12-13",
        passage: "Lukas 15",
        verse: 12,
      },
      {
        title: "Kelaparan dan kesadaran",
        summary:
          "Harta habis; ia memberi makan babi. Ia sadar: pegawai ayahnya kelebihan makanan.",
        reference: "Lukas 15:14-17",
        passage: "Lukas 15",
        verse: 14,
      },
      {
        title: "Ayah berlari menyambut",
        summary:
          "Ayah melihat dari jauh, berlari, memeluk, mencium — sebelum anak selesai bicara.",
        reference: "Lukas 15:20",
        passage: "Lukas 15",
        verse: 20,
      },
      {
        title: "Pesta pemulihan",
        summary:
          "\"Anakku ini mati, tetapi hidup kembali; hilang, tetapi didapat kembali.\" — pesta besar.",
        reference: "Lukas 15:24",
        passage: "Lukas 15",
        verse: 24,
      },
      {
        title: "Kakak yang marah",
        summary:
          "Kakak iri; ayah keluar memohon: \"Adikmu mati dan hidup kembali — patut bersukacita.\"",
        reference: "Lukas 15:28-32",
        passage: "Lukas 15",
        verse: 28,
      },
    ],
    lessons: [
      "Allah menerima kita kembali sebelum kita \"layak\" — ayah berlari sebelum anak selesai bicara",
      "Pertobatan sejati dimulai dari kerendahan hati: \"Aku berdosa… tak layak…\"",
      "Anugerah bukan hadiah untuk yang sempurna, melainkan untuk yang kembali",
      "Sukacita surga atas satu orang berdosa yang bertobat — bukan atas yang merasa layak",
      "Hati \"kakak\" — iri, merasa lebih layak — juga perlu pertobatan",
    ],
    reflection:
      "Di mana kita dalam perumpamaan ini? Anak yang jauh — merasa jauh dari Allah? Kakak yang tinggal — taat di luar, iri di dalam? Atau kita diajak melihat wajah Bapa yang berlari?\n\nAllah tidak menunggu kita \"bersih\" dulu. Ia menerima saat kita masih jauh — berlari, memeluk, mengadakan pesta. Apakah kita percaya anugerah semacam itu?",
    prayer:
      "Bapa, aku kembali — meski tak layak. Terima aku seperti anak yang hilang. Bebaskan aku dari hati kakak yang iri; ajar aku bersukacita atas pertobatan orang lain. Amin.",
    keyPassages: [
      passage(
        "Lukas 15:20",
        "Lukas 15",
        20,
        "…Ayahnya… berlari… memeluk… mencium dia.",
      ),
      passage(
        "Lukas 15:24",
        "Lukas 15",
        24,
        "\"…Anakku ini mati, tetapi hidup kembali; hilang, tetapi didapat kembali.\"",
      ),
      passage(
        "Lukas 15:18",
        "Lukas 15",
        18,
        "\"…Bapa, aku berdosa… tak layak… disebut anakmu…\"",
      ),
      passage(
        "Lukas 15:7",
        "Lukas 15",
        7,
        "…Sukacita… surga… atas… satu… berdosa… bertobat…",
      ),
      passage(
        "Lukas 15:32",
        "Lukas 15",
        32,
        "\"…Adikmu… mati… hidup… patut… bersukacita…\"",
      ),
    ],
  },
  "salib-kebangkitan": {
    background:
      "Salib dan kebangkitan adalah pusat iman Kristen — \"Injil berdiri atau jatuh di sini\" (1 Korintus 15). Yesus memprediksi kematian dan kebangkitan-Nya; murid-murid tidak mengerti. Minggu Palma, Ia masuk Yerusalem; Kamis, Perjamuan Terakhir; Jumat, salib di Golgota.\n\nKonteks politis: Yehuda di bawah Roma; Sanhedrin takut kerusuhan; Pilatus pragmatis. Yesus diadili — bukan karena kejahatan, melainkan karena klaim-Nya: Anak Allah, Raja. Salib adalah hukuman kriminal terhina — bukan simbol agung pada masa itu.\n\nKebangkitan pada hari ketiga mengubah segalanya. Kubur kosong; malaikat memberitakan; Yesus menampakkan diri — lebih dari 500 saksi (1 Korintus 15:6). Kemenangan atas dosa dan maut membuka jalan hidup kekal.",
    narrative:
      "Yesus ditangkap di Getsemani — Yudas menyerahkan dengan ciuman. Diadili di Sanhedrin: \"Engkau Kristus, Anak Allah?\" \"Engkau yang mengatakan.\" Diserahkan kepada Pilatus. Pilatus: \"Apakah Engkau Raja Yahudi?\" Yesus: \"Engkau yang mengatakan.\" Pilatus mencuci tangan; Yesus dicambuk, duri dimahkotai, disalibkan.\n\nDi Golgota — \"tempat tengkorak\" — Yesus disalibkan antara dua penjahat. \"Bapa, ampunilah… sebab mereka tidak tahu.\" \"Hari ini engkau… bersama-Ku… dalam Firdaus.\" \"Ibu, inilah… anakmu.\" \"Allah-Ku, Allah-Ku, mengapa Engkau meninggalkan Aku?\" \"Sudahlah!\" — lalu menyerahkan roh.\n\nTubuh dibaringkan di kubur — batu digulung. Hari ketiga, perempuan-perempuan datang; batu sudah digulingkan. Malaikat: \"Ia telah bangkit!\" Petrus dan Yohanes berlari; kubur kosong. Yesus menampakkan diri — kepada Maria Magdalena, kepada murid di Emmaus, kepada sebelas murid.\n\n\"Lihat tangan-Ku… kaki-Ku… Roh… hati… yang teguh…\" \"Pergilah… jadikan… murid…\" Paulus merangkum: \"Kristus… mati… dosa… menurut… Kitab… dikuburkan… bangkit… hari… ketiga… menurut… Kitab.\"\n\nSalib — alat kehinaan — menjadi simbol kemenangan. Kebangkitan bukan metafora; ia realitas historis yang mengubah sejarah. \"Karena Aku hidup, kamu pun akan hidup.\"",
    keyMoments: [
      {
        title: "Penangkapan di Getsemani",
        summary:
          "Yesus ditangkap; Yudas menyerahkan dengan ciuman. \"Bapa, ampunilah mereka.\"",
        reference: "Lukas 22:47-48",
        passage: "Lukas 22",
        verse: 47,
      },
      {
        title: "Disalibkan di Golgota",
        summary:
          "Yesus disalibkan; \"Sudahlah!\" — menyerahkan roh. Tubuh dibaringkan di kubur.",
        reference: "Yohanes 19:30",
        passage: "Yohanes 19",
        verse: 30,
      },
      {
        title: "Kubur kosong",
        summary:
          "Hari ketiga; batu digulingkan. Malaikat: \"Ia telah bangkit!\"",
        reference: "Markus 16:6",
        passage: "Markus 16",
        verse: 6,
      },
      {
        title: "Yesus menampakkan diri",
        summary:
          "Yesus menampakkan diri kepada murid — \"Lihat tangan-Ku dan kaki-Ku.\"",
        reference: "Lukas 24:39",
        passage: "Lukas 24",
        verse: 39,
      },
      {
        title: "Injil dalam ringkas",
        summary:
          "Paulus: Kristus mati untuk dosa kita, dikuburkan, bangkit hari ketiga — menurut Kitab.",
        reference: "1 Korintus 15:3-4",
        passage: "1 Korintus 15",
        verse: 3,
      },
    ],
    lessons: [
      "Keselamatan adalah anugerah — Yesus mati untuk dosa kita, bukan prestasi kita",
      "Kebangkitan memberi harapan hidup kekal — maut tidak kata terakhir",
      "Salib mengubah alat kehinaan menjadi simbol kemenangan",
      "Injil harus diberitakan — \"Pergilah, jadikan murid\"",
      "Iman Kristen berdiri pada fakta kebangkitan, bukan hanya ajaran moral",
    ],
    reflection:
      "Salib mengajarkan bahwa Allah masuk ke penderitaan — bukan menghindarinya. Kebangkitan mengajarkan bahwa penderitaan bukan akhir. Apakah kita hidup seolah kebangkitan benar — penuh harapan, penuh misi?\n\n\"Sudahlah\" — tebusan selesai. \"Ia telah bangkit\" — kemenangan dimulai. Di antara keduanya, iman kita berdiri.",
    prayer:
      "Tuhan Yesus, terima kasih karena Engkau mati untuk dosa-ku dan bangkit memberi harapan. Kuatkan imanku pada salib dan kebangkitan — bukan hanya sebagai sejarah, melainkan sebagai kekuatan hidup hari ini. Amin.",
    keyPassages: [
      passage(
        "Yohanes 19:30",
        "Yohanes 19",
        30,
        "…Yesus… berkata: \"Sudahlah!\" Lalu… menyerahkan roh-Nya.",
      ),
      passage(
        "1 Korintus 15:3-4",
        "1 Korintus 15",
        3,
        "…Kristus… mati… dosa… menurut… Kitab… dikuburkan… bangkit… hari… ketiga…",
      ),
      passage(
        "Markus 16:6",
        "Markus 16",
        6,
        "…Ia… bangkit!…",
      ),
      passage(
        "Lukas 24:39",
        "Lukas 24",
        39,
        "…Lihat tangan-Ku… kaki-Ku…",
      ),
      passage(
        "Yohanes 11:25",
        "Yohanes 11",
        25,
        "…Aku… kebangkitan… dan… hidup…",
      ),
    ],
  },
  "pentakosta": {
    background:
      "Pentakosta (Shavuot) adalah perayaan Yahudi — 50 hari setelah Paskah — memperingati pemberian Torah di Sinai. Murid-murid berkumpul di Yerusalem menunggu janji Yesus: \"Engkau akan menerima kuasa… menjadi saksi.\" Yesus naik ke surga; mereka berdoa dengan tekun.\n\nKisah Para Rasul 2 menceritakan kelahiran gereja: Roh Kudus turun seperti angin kencang dan lidah api; murid berkata-kata dalam bahasa lain. Petrus berkhotbah — pertama kali dengan berani —; tiga ribu orang percaya. Jemaat mula-mula berbagi, berdoa, memecahkan roti.\n\nPentakosta menggenapi nubuat Yoel: \"Aku akan curahkan Roh-Ku…\" Gereja bukan organisasi manusia semata — melainkan tubuh Kristus yang dilahirkan oleh Roh Kudus.",
    narrative:
      "Murid-murid, perempuan-perempuan, dan Maria berkumpul di ruang atas — sekitar 120 orang. Mereka berdoa dengan tekun. Tiba-tiba angin kencang dari langit; seluruh rumah bergetar. Lidah api menetap di atas setiap orang; mereka penuh Roh Kudus, berkata-kata dalam bahasa lain.\n\nOrang banyak berkumpul — dari setiap bangsa. Heran: \"Bagaimana kita… dengar… bahasa… sendiri?\" Ada yang mengejek: \"Mabuk!\" Petrus bangkit: \"Baru-baru ini Yesus… disalibkan… tetapi Allah… membangkitkan-Nya…\"\n\n\"Baru-baru ini… Yoel… Aku akan curahkan Roh-Ku…\" \"Baru-baru ini… David…\" \"Baru-baru ini… Yesus… disalibkan… Allah… membangkitkan… duduk… kanan… Tuhan… Roh… yang… dijanjikan… dicurahkan…\"\n\n\"Tobatlah… baptisan… dalam… nama… Yesus… Kristus…\" \"Orang… menerima… firman… dibaptis… tiga ribu…\" \"Mereka… bertekun… pengajaran… persekutuan… memecahkan… roti… doa…\" \"Semua… percaya… bersama… memiliki… segala… sesuatu…\"\n\nPentakosta adalah titik balik: dari ketakutan ke berani, dari sedikit ke ribuan, dari Yerusalem ke \"ujung bumi.\" Kuasa kebangkitan Kristus terus bekerja melalui Roh Kudus.",
    keyMoments: [
      {
        title: "Murid berkumpul berdoa",
        summary:
          "Sekitar 120 orang berkumpul di ruang atas, berdoa dengan tekun menunggu janji Yesus.",
        reference: "Kisah Para Rasul 1:14",
        passage: "Kisah Para Rasul 1",
        verse: 14,
      },
      {
        title: "Roh Kudus turun",
        summary:
          "Angin kencang, lidah api; mereka penuh Roh Kudus, berkata-kata dalam bahasa lain.",
        reference: "Kisah Para Rasul 2:4",
        passage: "Kisah Para Rasul 2",
        verse: 4,
      },
      {
        title: "Khotbah Petrus",
        summary:
          "Petrus berkhotbah: Yesus disalibkan, Allah membangkitkan-Nya — \"Tobatlah!\"",
        reference: "Kisah Para Rasul 2:38",
        passage: "Kisah Para Rasul 2",
        verse: 38,
      },
      {
        title: "Tiga ribu percaya",
        summary:
          "Orang menerima firman, dibaptis — sekitar tiga ribu jiwa.",
        reference: "Kisah Para Rasul 2:41",
        passage: "Kisah Para Rasul 2",
        verse: 41,
      },
      {
        title: "Jemaat mula-mula",
        summary:
          "Mereka bertekun dalam pengajaran, persekutuan, memecahkan roti, dan doa.",
        reference: "Kisah Para Rasul 2:42",
        passage: "Kisah Para Rasul 2",
        verse: 42,
      },
    ],
    lessons: [
      "Roh Kudus memberi kuasa untuk menjadi saksi — bukan hanya keberanian manusia",
      "Gereja lahir dari karya Allah, bukan rencana manusia semata",
      "Doa perseveran mempersiapkan outpouring Roh Kudus",
      "Injil untuk semua bangsa — dari Yerusalem ke \"ujung bumi\"",
      "Jemaat sejati ditandai persekutuan, pengajaran, dan kepedulian sesama",
    ],
    reflection:
      "Sebelum Pentakosta, murid ketakutan — Petrus menyangkal Yesus. Setelah Roh Kudus, ia berkhotbah di depan ribuan. Apakah kita hidup seolah Roh Kudus hadir — berani, penuh kasih, menjadi saksi?\n\nPentakosta bukan hanya sejarah — janji Roh Kudus untuk setiap orang percaya. \"Kamu akan menerima kuasa…\"",
    prayer:
      "Roh Kudus, curahkan kuasa-Mu seperti di Pentakosta. Buat aku saksi yang berani — bukan dengan kekuatanku, melainkan dengan kuasa-Mu. Satukan jemaat-Mu dalam kasih dan kebenaran. Amin.",
    keyPassages: [
      passage(
        "Kisah Para Rasul 2:4",
        "Kisah Para Rasul 2",
        4,
        "…Mereka… penuh… Roh Kudus, lalu… berkata-kata… bahasa… lain…",
      ),
      passage(
        "Kisah Para Rasul 2:38",
        "Kisah Para Rasul 2",
        38,
        "…Tobatlah… baptisan… nama… Yesus… Kristus…",
      ),
      passage(
        "Kisah Para Rasul 2:41",
        "Kisah Para Rasul 2",
        41,
        "…Sekitar… tiga ribu… jiwa…",
      ),
      passage(
        "Kisah Para Rasul 2:42",
        "Kisah Para Rasul 2",
        42,
        "…Mereka… bertekun… pengajaran… persekutuan… memecahkan… roti… doa…",
      ),
      passage(
        "Kisah Para Rasul 1:8",
        "Kisah Para Rasul 1",
        8,
        "…Kamu… menerima… kuasa… Roh Kudus… menjadi… saksi…",
      ),
    ],
  },
  "paulus-damaskus": {
    background:
      "Saulus (Paulus) adalah Farisi yang taat — \"demi hukum Taurat… tidak bercacat\" (Filipi 3:6). Ia percaya jalan Allah adalah menindas \"jalan\" pengikut Yesus — sect yang mengancam iman Yahudi. Ia mendapat surat dari imam besar untuk menangkap pengikut Yesus di sinagog-sinagog Damaskus.\n\nDamaskus — kota kuno di Syria — punya komunitas Yahudi dan pengikut Yesus. Perjalanan Saulus sekitar 220 km dari Yerusalem. Di tengah jalan, cahaya dari langit; suara: \"Saulus, Saulus, mengapa engkau mengejar Aku?\" Pertemuan ini mengubah sejarah: musuh terbesar menjadi pemberita terbesar.\n\nKisah Paulus di Damaskus mengajarkan bahwa pertobatan sejati mengubah arah hidup — bukan sekadar emosi, melainkan panggilan baru. Ia buta tiga hari, dibaptis, lalu \"segera… memberitakan… Yesus… Anak Allah.\"",
    narrative:
      "Saulus bernafas ancaman dan pembunuhan menuju Damaskus. Tiba-tiba cahaya dari langit; Saulus jatuh. \"Saulus, Saulus, mengapa engkau mengejar Aku?\" \"Siapa Engkau, Tuhan?\" \"Aku Yesus, yang kauaniaya. Bangkitlah, masuklah ke kota; akan dikatakan kepadamu apa yang harus kaulakukan.\"\n\nTeman-temannya membawa Saulus — matanya terbuka, tapi ia buta. Tiga hari ia tidak makan dan minum. Di Damaskus, Ananias — murid yang Saulus datang untuk tangkap — mendapat visi: \"Pergilah… Saulus… doa… supaya… melihat…\" Ananias ragu: \"Aku dengar… banyak… kerugian…\" Tuhan: \"Pergilah… alat… pilihan… memberitakan… bangsa-bangsa…\"\n\nAnanias datang: \"Saulus… saudara… Yesus… datang… supaya… melihat… penuh… Roh Kudus.\" Saulus bangkit, dibaptis, makan — kuat kembali. \"Segera… memberitakan… di sinagog… Yesus… Anak Allah.\" Orang heran: \"Bukankah… yang… menindas…?\"\n\nSaulus semakin kuat; Yahudi merencanakan membunuhnya. Murid menurunkannya dalam keranjang melalui tembok. Saulus pergi ke Arabia, kembali ke Damaskus, lalu Yerusalem — Barnabas memperkenalkannya. Dari musuh menjadi rasul; dari penindas menjadi misi kepada bangsa-bangsa.\n\nPaulus menulis kemudian: \"Kristus… menampakkan… diri… agar… memberitakan… bangsa-bangsa…\" Damaskus adalah titik balik — bukan hanya pertobatan pribadi, melainkan pembukaan Injil untuk seluruh dunia.",
    keyMoments: [
      {
        title: "Saulus menuju Damaskus",
        summary:
          "Saulus dengan surat penangkapan menuju Damaskus untuk menindas pengikut Yesus.",
        reference: "Kisah Para Rasul 9:1-2",
        passage: "Kisah Para Rasul 9",
        verse: 1,
      },
      {
        title: "Cahaya dan suara dari langit",
        summary:
          "\"Saulus, Saulus, mengapa engkau mengejar Aku?\" — \"Aku Yesus, yang kauaniaya.\"",
        reference: "Kisah Para Rasul 9:4-5",
        passage: "Kisah Para Rasul 9",
        verse: 4,
      },
      {
        title: "Buta tiga hari",
        summary:
          "Saulus buta; tiga hari tidak makan dan minum — menunggu instruksi Allah.",
        reference: "Kisah Para Rasul 9:9",
        passage: "Kisah Para Rasul 9",
        verse: 9,
      },
      {
        title: "Ananias membaptis Saulus",
        summary:
          "Ananias datang; Saulus bangkit, dibaptis, menerima Roh Kudus — penglihatan pulih.",
        reference: "Kisah Para Rasul 9:17-18",
        passage: "Kisah Para Rasul 9",
        verse: 17,
      },
      {
        title: "Memberitakan Yesus",
        summary:
          "Saulus segera memberitakan di sinagog: Yesus adalah Anak Allah.",
        reference: "Kisah Para Rasul 9:20",
        passage: "Kisah Para Rasul 9",
        verse: 20,
      },
    ],
    lessons: [
      "Allah dapat mengubah musuh terbesar menjadi pemberita — tidak ada yang \"terlalu jauh\"",
      "Pertobatan sejati mengubah arah hidup, bukan sekadar emosi sementara",
      "Allah memanggil orang yang tidak kita duga — Ananias ke Saulus, Barnabas memperkenalkan",
      "Panggilan Paulus membuka misi kepada bangsa-bangsa — Injil untuk semua",
      "Kuatnya oposisi terhadap Paulus membuktikan transformasi yang nyata",
    ],
    reflection:
      "Saulus yakin ia benar — menindas pengikut Yesus demi Allah. Ia perlu dihentikan paksa oleh cahaya. Apakah ada \"Saulus\" dalam hidup kita — keyakinan salah yang perlu ditantang?\n\nAtau kita dipanggil menjadi Ananias — pergi kepada orang yang kita takuti, dengan pesan Allah. Transformasi Paulus mengingatkan: jangan menyerah pada siapapun.",
    prayer:
      "Tuhan, Engkau mengubah Saulus — ubah juga aku. Hentikan aku jika aku mengejar yang salah. Pakailah aku seperti Paulus untuk memberitakan Yesus. Berikan keberanian Ananias untuk pergi kepada yang kita takuti. Amin.",
    keyPassages: [
      passage(
        "Kisah Para Rasul 9:4",
        "Kisah Para Rasul 9",
        4,
        "…\"Saulus, Saulus, mengapa engkau mengejar Aku?\"",
      ),
      passage(
        "Kisah Para Rasul 9:5",
        "Kisah Para Rasul 9",
        5,
        "…\"Aku Yesus, yang kauaniaya…\"",
      ),
      passage(
        "Kisah Para Rasul 9:17",
        "Kisah Para Rasul 9",
        17,
        "…Ananias… meletakkan… tangannya… Saulus… \"Saulus… saudara…\"",
      ),
      passage(
        "Kisah Para Rasul 9:20",
        "Kisah Para Rasul 9",
        20,
        "…Segera… memberitakan… Yesus… Anak Allah.",
      ),
      passage(
        "Galatia 1:15-16",
        "Galatia 1",
        15,
        "…Allah… memisahkan… dari… rahim… ibu… dan… memanggil… oleh… anugerah-Nya…",
      ),
    ],
  },
};

export function applyStoryDepth(story: BibleStory): BibleStory {
  const extra = STORY_DETAILS[story.slug];
  return extra ? { ...story, ...extra } : story;
}
