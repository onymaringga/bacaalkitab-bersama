/**
 * Fakta singkat seputar kisah Alkitab — satu dipilih per hari kalender.
 */

export type BibleDailyFact = {
  id: string;
  title: string;
  body: string;
  /** Referensi opsional, mis. "Kejadian 6–9" */
  reference?: string;
};

export const BIBLE_DAILY_FACTS: BibleDailyFact[] = [
  {
    id: "nuh-bahtera",
    title: "Bahtera Nuh",
    body: "Nuh membangun bahtera bertahun-tahun sebelum air bah datang — iman yang taat sebelum bukti kelihatan.",
    reference: "Kejadian 6–9",
  },
  {
    id: "abraham-bintang",
    title: "Janji sebanyak bintang",
    body: "Allah menyuruh Abraham memandang bintang di langit sebagai gambaran keturunan yang dijanjikan — meski saat itu ia belum punya anak perjanjian.",
    reference: "Kejadian 15",
  },
  {
    id: "yusuf-penjara",
    title: "Dari penjara ke istana",
    body: "Yusuf sempat dilupakan di penjara Mesir, lalu diangkat menjadi penguasa — Allah memakai jalan yang tidak terduga untuk menyelamatkan banyak orang.",
    reference: "Kejadian 41",
  },
  {
    id: "musa-semak",
    title: "Semak yang menyala",
    body: "Allah memanggil Musa dari semak yang menyala tetapi tidak hangus — tanda bahwa Ia hadir tanpa menghancurkan.",
    reference: "Keluaran 3",
  },
  {
    id: "laut-terbelah",
    title: "Laut terbelah",
    body: "Ketika Israel terjepit di tepi laut, TUHAN membelah air Teberau — jalan keluar muncul di tempat yang tampak buntu.",
    reference: "Keluaran 14",
  },
  {
    id: "manah",
    title: "Roti dari langit",
    body: "Di padang gurun Allah memberi manna setiap hari — cukup untuk hari itu, melatih percaya yang harian.",
    reference: "Keluaran 16",
  },
  {
    id: "yosua-yerikho",
    title: "Tembok Yerikho",
    body: "Yerikho runtuh setelah umat mengelilingi kota dengan iman, bukan dengan mesin perang — kemenangan dari ketaatan.",
    reference: "Yosua 6",
  },
  {
    id: "rahab-tali",
    title: "Tali merah Rahab",
    body: "Rahab, perempuan dari Yerikho, diselamatkan karena iman; tali merah di jendelanya menjadi tanda pemeliharaan.",
    reference: "Yosua 2",
  },
  {
    id: "debora",
    title: "Debora sang hakim",
    body: "Debora memimpin Israel sebagai nabi dan hakim — Allah memakai perempuan untuk meneguhkan bangsa yang takut.",
    reference: "Hakim-hakim 4–5",
  },
  {
    id: "gideon",
    title: "300 orang Gideon",
    body: "Allah mengurangi tentara Gideon menjadi 300 orang supaya Israel tahu kemenangan itu dari TUHAN, bukan dari jumlah.",
    reference: "Hakim-hakim 7",
  },
  {
    id: "rut-boas",
    title: "Rut di ladang Boas",
    body: "Rut, janda dari Moab, menemukan kasih karunia di Betlehem — kisah kesetiaan yang masuk ke garis Daud dan Yesus.",
    reference: "Rut 1–4",
  },
  {
    id: "daud-goliat",
    title: "Daud dan Goliat",
    body: "Anak gembala mengalahkan raksasa Filistin dengan ketapel dan kepercayaan bahwa pertempuran adalah milik TUHAN.",
    reference: "1 Samuel 17",
  },
  {
    id: "daud-mezmur",
    title: "Mazmur dari gua",
    body: "Banyak mazmur Daud lahir dari tekanan dan pengejaran — doa jujur di tengah ketakutan tetap diterima Allah.",
    reference: "Mazmur 57",
  },
  {
    id: "salomo-hikmat",
    title: "Permintaan Salomo",
    body: "Salomo tidak meminta kekayaan dulu, melainkan hati yang mendengar untuk memerintah — dan Allah menambah berkat lain.",
    reference: "1 Raja-raja 3",
  },
  {
    id: "elias-karmel",
    title: "Api di Gunung Karmel",
    body: "Elia menantang nabi Baal; api dari langit menghanguskan korban — TUHAN menyatakan diri-Nya sebagai Allah yang hidup.",
    reference: "1 Raja-raja 18",
  },
  {
    id: "elisa-minyak",
    title: "Minyak yang tidak habis",
    body: "Seorang janda mengisi banyak kendi dengan minyak ajaib — pemeliharaan Allah cukup untuk melunasi utang dan hidup.",
    reference: "2 Raja-raja 4",
  },
  {
    id: "yunus-ikan",
    title: "Yunus dan ikan besar",
    body: "Yunus melarikan diri dari panggilan ke Ninewe, lalu ditelan ikan besar — kasih Allah mengejar nabi yang enggan sekalipun.",
    reference: "Yunus 1–2",
  },
  {
    id: "daniel-singa",
    title: "Gua singa",
    body: "Daniel tetap berdoa meski ada larangan raja; ia dilempar ke gua singa dan keluar hidup — kesetiaan dijaga Allah.",
    reference: "Daniel 6",
  },
  {
    id: "ester",
    title: "Ester untuk waktu ini",
    body: "Ester menjadi ratu 'tepat pada waktu ini' untuk menyelamatkan bangsanya — keberanian yang lahir dari puasa dan iman.",
    reference: "Ester 4",
  },
  {
    id: "nehemia-tembok",
    title: "Membangun kembali tembok",
    body: "Nehemia membangun tembok Yerusalem sambil berdoa dan berjaga — pekerjaan Tuhan dikerjakan dengan tangan dan lutut.",
    reference: "Nehemia 4",
  },
  {
    id: "yesaya-anak",
    title: "Seorang Anak dijanjikan",
    body: "Yesaya menubuatkan Anak yang disebut Penasihat Ajaib, Allah yang Perkasa — pengharapan yang menunjuk kepada Yesus.",
    reference: "Yesaya 9",
  },
  {
    id: "yeremia-sumur",
    title: "Yeremia di sumur",
    body: "Nabi Yeremia dilempar ke dalam sumur berlumpur karena firman yang tidak disukai — setia berbicara tetap ada harganya.",
    reference: "Yeremia 38",
  },
  {
    id: "kelahiran-betlehem",
    title: "Lahir di Betlehem",
    body: "Yesus lahir di kota kecil Daud, dibaringkan dalam palungan — Raja datang dalam kerendahan, bukan kemewahan istana.",
    reference: "Lukas 2",
  },
  {
    id: "yohanes-baptis",
    title: "Suara di padang gurun",
    body: "Yohanes Pembaptis menyiapkan jalan bagi Tuhan dengan menyerukan pertobatan — nabi terakhir sebelum Mesias tampil.",
    reference: "Matius 3",
  },
  {
    id: "air-anggur",
    title: "Air menjadi anggur",
    body: "Mukjizat pertama Yesus di Kana mengubah air menjadi anggur — tanda sukacita Kerajaan yang dimulai diam-diam.",
    reference: "Yohanes 2",
  },
  {
    id: "roti-lima",
    title: "Lima roti dua ikan",
    body: "Yesus memberi makan ribuan orang dari bekal kecil seorang anak — yang diserahkan kepada-Nya bisa cukup untuk banyak orang.",
    reference: "Yohanes 6",
  },
  {
    id: "berjalan-air",
    title: "Berjalan di atas air",
    body: "Petrus berjalan di atas danau saat memandang Yesus; ia mulai tenggelam ketika takut — iman bergantung pada arah pandang.",
    reference: "Matius 14",
  },
  {
    id: "anak-hilang",
    title: "Anak yang hilang",
    body: "Dalam perumpamaan Yesus, bapa berlari menyongsong anak yang pulang — gambaran Allah yang menyambut pertobatan dengan sukacita.",
    reference: "Lukas 15",
  },
  {
    id: "zakheus",
    title: "Zakheus di pohon",
    body: "Pemungut cukai yang pendek naik pohon untuk melihat Yesus; hari itu keselamatan datang ke rumahnya.",
    reference: "Lukas 19",
  },
  {
    id: "getsembani",
    title: "Doa di Getsemani",
    body: "Yesus berdoa dengan pergulatan jiwa: 'Bukan kehendak-Ku, melainkan kehendak-Mu' — ketaatan di tengah penderitaan.",
    reference: "Matius 26",
  },
  {
    id: "salib",
    title: "Di kayu salib",
    body: "Yesus disalibkan di Golgota dan berkata 'Sudah selesai' — karya penebusan dituntaskan, bukan ditunda.",
    reference: "Yohanes 19",
  },
  {
    id: "kebangkitan",
    title: "Kubur kosong",
    body: "Pada hari ketiga kubur kosong; Maria Magdalena menjadi saksi pertama — pengharapan Kristen berdiri di atas kebangkitan.",
    reference: "Yohanes 20",
  },
  {
    id: "pentakosta",
    title: "Roh Kudus turun",
    body: "Di hari Pentakosta murid-murid dipenuhi Roh Kudus dan berbicara tentang karya Allah — gereja lahir dengan kuasa, bukan tipu daya.",
    reference: "Kisah Para Rasul 2",
  },
  {
    id: "saulus-bertobat",
    title: "Saulus di jalan Damsyik",
    body: "Penganiaya jemaat bertemu Yesus yang bangkit; Saulus menjadi Paulus — tidak ada yang terlalu jauh untuk diubahkan.",
    reference: "Kisah Para Rasul 9",
  },
  {
    id: "paulus-penjara",
    title: "Nyanyian di penjara",
    body: "Paulus dan Silas menyanyi di penjara Filipi; gempa membuka pintu — sukacita iman tidak menunggu keadaan nyaman.",
    reference: "Kisah Para Rasul 16",
  },
  {
    id: "kasih-korintus",
    title: "Kasih yang terbesar",
    body: "Paulus menulis bahwa iman, pengharapan, dan kasih tinggal tetap, dan yang terbesar adalah kasih.",
    reference: "1 Korintus 13",
  },
  {
    id: "buah-roh",
    title: "Buah Roh",
    body: "Kasih, sukacita, damai sejahtera, dan lainnya disebut buah Roh — karakter yang ditumbuhkan Allah, bukan sekadar usaha sendiri.",
    reference: "Galatia 5",
  },
  {
    id: "baju-zirah",
    title: "Perlengkapan senjata Allah",
    body: "Paulus menggambarkan iman sebagai perisai dan firman sebagai pedang Roh — hidup Kristen adalah peperangan rohani yang waspada.",
    reference: "Efesus 6",
  },
  {
    id: "sukacita-filipi",
    title: "Sukacita di surat penjara",
    body: "Dari penjara Paulus menulis 'Bersukacitalah senantiasa' kepada jemaat Filipi — sukacita yang tidak digantungkan pada rantai.",
    reference: "Filipi 4",
  },
  {
    id: "iman-ibrani",
    title: "Awan saksi",
    body: "Ibrani 11 menyebut banyak tokoh yang hidup oleh iman — kita berlari dengan mata tertuju kepada Yesus, bukan kepada keramaian.",
    reference: "Ibrani 12",
  },
  {
    id: "wahyu-akhir",
    title: "Langit yang baru",
    body: "Wahyu menutup Alkitab dengan pengharapan: Allah akan menghapus segala air mata — cerita tidak berakhir di kekacauan.",
    reference: "Wahyu 21",
  },
];

/** Indeks hari sejak epoch UTC, stabil untuk tanggal kalender lokal YYYY-MM-DD. */
export function getDailyFactIndex(dateKey?: string) {
  const key = dateKey ?? new Date().toISOString().slice(0, 10);
  const [y, m, d] = key.split("-").map(Number);
  const utc = Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1);
  const dayNumber = Math.floor(utc / 86_400_000);
  return ((dayNumber % BIBLE_DAILY_FACTS.length) + BIBLE_DAILY_FACTS.length) %
    BIBLE_DAILY_FACTS.length;
}

export function getDailyBibleFact(dateKey?: string): BibleDailyFact {
  return BIBLE_DAILY_FACTS[getDailyFactIndex(dateKey)]!;
}
