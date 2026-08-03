/**
 * Latar belakang kitab Alkitab — ringkasan pengantar tradisional
 * (siapa, kapan, bagaimana, mengapa, untuk siapa).
 * Ditulis untuk pembaca awam; mencatat tradisi gereja dan catatan singkat
 * bila ada perdebatan akademis. Detail & sumber: lihat bible-book-intro-details
 * dan bible-intro-sources.
 */

import {
  BIBLE_BOOKS,
  OLD_TESTAMENT_SIZE,
  type BibleBook,
} from "@/lib/bible-books";
import { BIBLE_BOOK_INTRO_DETAILS } from "@/lib/bible-book-intro-details";
import { BIBLE_BOOK_ABOUT } from "@/lib/bible-book-about";
import {
  BIBLE_BOOK_CHARACTERS,
  type BibleBookCharacter,
} from "@/lib/bible-book-characters";
import {
  DEFAULT_NT_SOURCE_IDS,
  DEFAULT_OT_SOURCE_IDS,
  resolveBibleIntroSources,
  type BibleIntroSource,
  type BibleIntroSourceId,
} from "@/lib/bible-intro-sources";

export type BibleBookIntro = {
  abbr: string;
  /** Genre / jenis tulisan singkat */
  genre: string;
  /** Siapa yang menulis (tradisi + catatan bila relevan) */
  author: string;
  /** Kapan ditulis / latar waktu peristiwa */
  when: string;
  /** Bagaimana ditulis — bahasa, bentuk, proses */
  how: string;
  /** Mengapa ditulis — tujuan utama */
  why: string;
  /** Untuk siapa — audiens awal */
  audience: string;
  /** Ringkasan isi / pesan */
  summary: string;
};

export type EnrichedBibleBookIntro = BibleBookIntro & {
  chapters: number;
  /** Kitab ini menceritakan tentang apa */
  about: string;
  themes: string[];
  /** Tokoh Alkitab yang terlibat dalam kitab */
  characters: BibleBookCharacter[];
  outline: string[];
  notes: string;
  deeper: string;
  sourceIds: BibleIntroSourceId[];
  sources: BibleIntroSource[];
};

export const BIBLE_BOOK_INTROS: BibleBookIntro[] = [
  {
    abbr: "Kej",
    genre: "Narasi / sejarah keselamatan",
    author:
      "Tradisi Yahudi–Kristen mengaitkannya dengan Musa. Banyak penafsir modern melihat bentuk akhir yang disusun dari sumber-sumber yang lebih tua.",
    when:
      "Latar peristiwa dari penciptaan sampai Yusuf di Mesir. Bentuk yang kita baca biasanya dikaitkan dengan masa Musa (abad ke-15/13 SM) atau penyusunan akhir sekitar zaman kerajaan/pembuangan.",
    how:
      "Ditulis dalam bahasa Ibrani sebagai rangkaian narasi, silsilah, dan janji Allah. Lima kitab pertama (Pentateukh) membentuk satu kesatuan.",
    why:
      "Menjelaskan asal dunia, manusia, dosa, dan panggilan Allah kepada Abraham serta keturunannya — fondasi perjanjian.",
    audience:
      "Umat Israel yang perlu tahu siapa mereka di hadapan Allah dan dari mana asal perjanjian itu.",
    summary:
      "Dari penciptaan hingga keluarga Yakub di Mesir: Allah menciptakan, manusia jatuh, lalu Allah memilih Abraham untuk memberkati bangsa-bangsa.",
  },
  {
    abbr: "Kel",
    genre: "Narasi & hukum perjanjian",
    author: "Tradisi: Musa. Bentuk akhir Pentateukh disusun untuk umat Israel.",
    when:
      "Peristiwa keluaran dari Mesir sekitar abad ke-15 atau ke-13 SM (penanggalan diperdebatkan). Teks menjadi pedoman hidup umat sesudah itu.",
    how:
      "Bahasa Ibrani; campuran kisah pembebasan, perjanjian di Sinai, dan petunjuk mengenai Kemah Suci.",
    why:
      "Menceritakan bagaimana Allah membebaskan Israel dari perbudakan dan membentuk mereka menjadi bangsa perjanjian.",
    audience: "Umat Israel yang dipanggil mengingat penebusan dan hidup menurut Torat.",
    summary:
      "Allah membebaskan Israel dari Mesir, memberi hukum di Sinai, dan hadir di tengah mereka melalui Kemah Suci.",
  },
  {
    abbr: "Im",
    genre: "Hukum & ibadah",
    author: "Tradisi: Musa, terutama untuk para imam dan umat.",
    when: "Latar setelah keluaran, di sekitar Gunung Sinai; disusun sebagai pedoman ibadah Israel.",
    how:
      "Bahasa Ibrani; aturan korban, kekudusan, imamat, dan kalender raya — sering dalam bentuk perintah langsung dari Tuhan.",
    why:
      "Mengajar bagaimana umat yang ditebus boleh mendekati Allah yang kudus dalam ibadah dan kehidupan sehari-hari.",
    audience: "Imam Lewi dan seluruh jemaat Israel.",
    summary:
      "Pedoman kekudusan: korban, imamat, kemurnian, dan hidup yang mencerminkan Tuhan yang kudus.",
  },
  {
    abbr: "Bil",
    genre: "Narasi & census / hukum",
    author: "Tradisi: Musa.",
    when:
      "Mencakup hampir 40 tahun pengembaraan di padang gurun, dari Sinai menuju perbatasan Kanaan.",
    how:
      "Bahasa Ibrani; sensus, kisah pemberontakan, perjalanan, dan beberapa hukum tambahan.",
    why:
      "Mencatat perjalanan, kegagalan, dan kesetiaan Allah — serta mempersiapkan generasi baru memasuki tanah perjanjian.",
    audience: "Generasi Israel di padang gurun dan keturunan mereka yang akan mewarisi tanah itu.",
    summary:
      "Dari Sinai ke Moab: pemberontakan, penghakiman, dan pemeliharaan Allah di padang gurun.",
  },
  {
    abbr: "Ul",
    genre: "Khotbah perjanjian / hukum",
    author: "Tradisi: khotbah Musa di akhir hidupnya; dicatat untuk generasi berikutnya.",
    when: "Menjelang masuk Kanaan, di dataran Moab (akhir pengembaraan).",
    how:
      "Bahasa Ibrani; gaya khotbah dan pembaruan perjanjian — mengulang serta menjelaskan hukum bagi generasi baru.",
    why:
      "Mengingatkan kasih dan kesetiaan Allah, serta memanggil umat memilih hidup dalam ketaatan sebelum memasuki tanah.",
    audience: "Generasi kedua Israel yang akan menaklukkan dan mendiami Kanaan.",
    summary:
      "Musa mengulang perjanjian: kasihilah Tuhan, taatilah firman-Nya, dan pilihlah kehidupan.",
  },
  {
    abbr: "Jos",
    genre: "Sejarah / narasi penaklukan",
    author:
      "Tradisi sering mengaitkan dengan Yosua atau sumber sezaman; bentuk akhir dikumpulkan dalam sejarah Deuteronomis.",
    when: "Peristiwa penaklukan Kanaan setelah Musa; penulisan/pengumpulan mungkin berabad-abad kemudian.",
    how: "Bahasa Ibrani; narasi perang, pembagian tanah, dan pembaruan perjanjian.",
    why: "Menunjukkan Allah menepati janji tanah kepada Israel melalui kepemimpinan Yosua.",
    audience: "Umat Israel yang perlu mengingat bahwa tanah itu anugerah Tuhan, bukan hasil kekuatan sendiri.",
    summary: "Yosua memimpin Israel memasuki, menaklukkan, dan membagi tanah Kanaan.",
  },
  {
    abbr: "Hk",
    genre: "Sejarah / siklus hakim",
    author: "Penulis anonim dalam tradisi sejarah Deuteronomis (sering dikaitkan dengan zaman Samuel atau kemudian).",
    when: "Zaman antara Yosua dan kerajaan Saul — kurang lebih abad ke-12–11 SM.",
    how: "Bahasa Ibrani; pola berulang: dosa → penindasan → seruan → hakim → damai → dosa lagi.",
    why: "Menunjukkan akibat ketidaktaatan dan kebutuhan akan kepemimpinan yang benar di bawah Allah.",
    audience: "Umat yang belajar dari kekacauan zaman hakim: «setiap orang berbuat menurut pandangannya sendiri».",
    summary: "Siklus kejatuhan dan pembebasan lewat hakim-hakim, hingga kerinduan akan raja yang adil.",
  },
  {
    abbr: "Rut",
    genre: "Narasi pendek / kisah kasih setia",
    author: "Anonim; tradisi lama kadang mengaitkan dengan Samuel.",
    when: "Latar zaman hakim; kemungkinan ditulis pada zaman kerajaan awal atau kemudian.",
    how: "Bahasa Ibrani; cerita indah tentang kesetiaan, penebusan keluarga, dan pemeliharaan Allah.",
    why: "Menunjukkan kasih setia Allah melalui orang luar (Rut orang Moab) yang masuk dalam garis Daud — bahkan Mesias.",
    audience: "Umat Israel (dan kemudian gereja) yang belajar bahwa iman dan kesetiaan melampaui batas suku.",
    summary: "Rut setia kepada Naomi; Boas menebus; lahir Obed — nenek moyang Daud.",
  },
  {
    abbr: "1Sa",
    genre: "Sejarah kerajaan",
    author: "Anonim; tradisi mengaitkan sumber dari Samuel, Natan, dan Gad (lih. 1 Taw 29:29).",
    when: "Transisi dari hakim ke kerajaan: Samuel, Saul, dan awal Daud (abad ke-11 SM).",
    how: "Bahasa Ibrani; narasi biografi dan politik yang menekankan kedaulatan Tuhan atas raja.",
    why: "Menceritakan lahirnya kerajaan Israel dan kontras antara Saul yang ditolak dengan Daud yang dipilih.",
    audience: "Umat yang perlu memahami bahwa raja sejati harus tunduk pada firman Tuhan.",
    summary: "Samuel, Saul, dan bangkitnya Daud — Allah mencari hati yang taat.",
  },
  {
    abbr: "2Sa",
    genre: "Sejarah kerajaan",
    author: "Anonim; kelanjutan sumber sejarah yang sama dengan 1 Samuel.",
    when: "Pemerintahan Daud di Yerusalem (sekitar abad ke-10 SM).",
    how: "Bahasa Ibrani; kisah kemenangan, perjanjian Daud, dosa, dan akibatnya dalam keluarga kerajaan.",
    why: "Menunjukkan janji Allah kepada Daud sekaligus realitas dosa dan penghakiman dalam istana.",
    audience: "Umat yang menaruh harapan pada garis Daud dan belajar dari kejatuhan serta pertobatan.",
    summary: "Kerajaan Daud diteguhkan; dosa dengan Batsyeba membawa luka; namun perjanjian Allah tetap berdiri.",
  },
  {
    abbr: "1Ra",
    genre: "Sejarah kerajaan",
    author: "Anonim dalam tradisi Deuteronomis; memakai arsip kerajaan dan kisah nabi.",
    when: "Dari Salomo sampai awal kerajaan terpecah dan nabi Elia (abad ke-10–9 SM).",
    how: "Bahasa Ibrani; penilaian raja menurut kesetiaan kepada perjanjian, dengan fokus Bait Suci dan nabi.",
    why: "Menjelaskan kejayaan Salomo, perpecahan kerajaan, dan mengapa ketidaktaatan membawa kehancuran.",
    audience: "Umat (terutama di pembuangan atau sesudahnya) yang bertanya: mengapa kerajaan jatuh?",
    summary: "Salomo membangun Bait; kerajaan pecah; Elia melawan Baal di Israel Utara.",
  },
  {
    abbr: "2Ra",
    genre: "Sejarah kerajaan",
    author: "Anonim; kelanjutan 1 Raja-raja dalam sejarah Deuteronomis.",
    when: "Dari Elisa sampai kejatuhan Samaria (722 SM) dan Yerusalem (586 SM).",
    how: "Bahasa Ibrani; kronik raja-raja diuji oleh ketaatan kepada Torat, dengan Elisa dan pembaruan Yosia.",
    why: "Menunjukkan bahwa pembuangan adalah akibat pelanggaran perjanjian — bukan karena Allah lemah.",
    audience: "Umat dalam atau setelah pembuangan yang perlu menafsir sejarah dengan iman.",
    summary: "Israel dan Yehuda jatuh; namun kisah Hizkia dan Yosia mengingatkan kemungkinan pertobatan.",
  },
  {
    abbr: "1Ta",
    genre: "Sejarah / silsilah & ibadah",
    author: "Tradisi: «Penulis Tawarikh» (sering dikaitkan dengan Ezra atau kalangan imam pasca-pembuangan).",
    when: "Disusun sekitar abad ke-5–4 SM, meninjau ulang sejarah dari Adam sampai Daud.",
    how: "Bahasa Ibrani; penekanan silsilah, Bait Suci, Lewi, dan Daud sebagai model ibadah.",
    why: "Memberi identitas dan harapan bagi komunitas pasca-pembuangan: mereka masih umat perjanjian.",
    audience: "Umat yang kembali ke Yehuda dan membangun kembali ibadah di Yerusalem.",
    summary: "Silsilah dan pemerintahan Daud — fondasi ibadah dan harapan mesianis.",
  },
  {
    abbr: "2Ta",
    genre: "Sejarah / Bait Suci & raja Yehuda",
    author: "Penulis Tawarikh yang sama dengan 1 Tawarikh.",
    when: "Dari Salomo sampai pembuangan dan dekrit Koresh; ditulis pasca-pembuangan.",
    how: "Bahasa Ibrani; fokus Yehuda, Bait Suci, dan raja yang mencari Tuhan.",
    why: "Mengajar bahwa pencarian Tuhan membawa pemulihan; pengabaian membawa hukuman — dan ada harapan kembali.",
    audience: "Komunitas pasca-pembuangan yang membangun kembali Bait dan kehidupan rohani.",
    summary: "Salomo hingga pembuangan: Bait Suci sebagai pusat, dan undangan untuk bertobat.",
  },
  {
    abbr: "Ezr",
    genre: "Sejarah pemulihan",
    author: "Tradisi sering mengaitkan dengan Ezra; mungkin digabung dengan Nehemia dari sumber yang sama.",
    when: "Kembali dari pembuangan: sekitar 538–450 SM (zaman Koresh, Darius, Artahsasta).",
    how: "Bahasa Ibrani dan sebagian Aram; dekrit, daftar, dan pembaruan Torat.",
    why: "Mencatat pemulihan Bait Suci dan pembaruan hidup menurut firman setelah pembuangan.",
    audience: "Umat yang kembali dan mereka yang belajar bagaimana hidup sebagai umat kudus di tanah itu.",
    summary: "Kembali ke Yerusalem, membangun Bait, dan Ezra mengajar Torat.",
  },
  {
    abbr: "Ne",
    genre: "Sejarah pemulihan / memoir",
    author: "Sebagian besar memoir Nehemia; digabung dalam kesatuan dengan Ezra.",
    when: "Sekitar 445–430 SM di Yerusalem di bawah Persia.",
    how: "Bahasa Ibrani; catatan orang pertama Nehemia tentang tembok, reformasi, dan pembaruan perjanjian.",
    why: "Menunjukkan kepemimpinan yang berdoa, bekerja, dan menegakkan kekudusan komunitas.",
    audience: "Umat yang membangun kembali kota dan identitas perjanjian di tengah tekanan.",
    summary: "Nehemia membangun tembok Yerusalem dan memperbarui komitmen umat kepada Tuhan.",
  },
  {
    abbr: "Est",
    genre: "Narasi / providensia",
    author: "Anonim; kemungkinan orang Yahudi di diaspora Persia.",
    when: "Latar istana Ahasyweros (Xerxes I, abad ke-5 SM).",
    how: "Bahasa Ibrani; cerita tanpa menyebut nama Allah secara langsung, namun penuh pemeliharaan tersembunyi.",
    why: "Menjelaskan asal Purim dan menegaskan bahwa Allah melindungi umat-Nya bahkan di tanah asing.",
    audience: "Orang Yahudi di pembuangan/diaspora — dan semua yang merasa Allah «tersembunyi».",
    summary: "Ester dan Mordekhai dipakai Allah menyelamatkan umat dari rencana Haman.",
  },
  {
    abbr: "Ay",
    genre: "Hikmat / puisi penderitaan",
    author: "Anonim; tradisi beragam (beberapa mengaitkan dengan Musa atau zaman patriark).",
    when: "Latar patriarkal (kaya akan ternak, tanpa hukum Sinai); penulisan mungkin zaman kerajaan atau pembuangan.",
    how: "Bahasa Ibrani puitis yang sangat kaya; dialog Ayub dengan sahabat, lalu jawaban Tuhan dari badai.",
    why: "Menghadapi pertanyaan penderitaan orang benar — bukan jawaban mudah, melainkan pertemuan dengan Allah yang berdaulat.",
    audience: "Setiap orang yang menderita dan mencari makna di hadapan Allah.",
    summary: "Ayub diuji; sahabat keliru; Tuhan menjawab; iman dan kerendahan hati dipulihkan.",
  },
  {
    abbr: "Maz",
    genre: "Nyanyian / doa / liturgi",
    author:
      "Banyak mazmur bertulisan Daud; juga Asaf, anak-anak Korah, Salomo, Musa, dan anonim — dikumpulkan sepanjang sejarah Israel.",
    when: "Dari Musa hingga pasca-pembuangan; kumpulan final mungkin abad ke-5–4 SM atau lebih awal.",
    how: "Bahasa Ibrani puisi; mazmur pujian, ratapan, ucapan syukur, kerajaan, hikmat — untuk dinyanyikan dan didoakan.",
    why: "Memberi kata-kata bagi seluruh rentang hidup di hadapan Allah: sukacita, takut, tobat, harapan.",
    audience: "Umat yang beribadah di Bait Suci, dan setiap orang percaya yang berdoa.",
    summary: "150 nyanyian iman: Tuhan adalah Gembala, Raja, dan tempat perlindungan.",
  },
  {
    abbr: "Pnh",
    genre: "Hikmat / pepatah",
    author:
      "Inti tradisi Salomo; juga Agur, Lemuel, dan kumpulan orang bijak (lih. Ams 1:1; 25:1; 30–31).",
    when: "Zaman Salomo (abad ke-10 SM) dan pengumpulan lebih lanjut di zaman Hizkia serta kemudian.",
    how: "Bahasa Ibrani; pepatah pendek, pidato hikmat, dan puisi (termasuk istri yang cakap).",
    why: "Mengajar takut akan Tuhan sebagai awal hikmat — untuk hidup bijak di rumah, kerja, dan masyarakat.",
    audience: "Orang muda dan umat yang ingin hidup bijaksana dalam perjanjian.",
    summary: "Hikmat praktis: takut akan Tuhan, kejujuran, kerja keras, dan lidah yang dijaga.",
  },
  {
    abbr: "Pkh",
    genre: "Hikmat / renungan",
    author: "«Pengkhotbah» (Qohelet); tradisi mengaitkan dengan Salomo, meski gaya bahasa memicu diskusi penanggalan.",
    when: "Tradisi: zaman Salomo; banyak penafsir menempatkan penulisan kemudian (zaman Persia/Helenistik).",
    how: "Bahasa Ibrani; renungan filosofis tentang kesia-siaan «di bawah matahari» dan takut akan Allah.",
    why: "Menguji makna hidup tanpa Allah, lalu mengarahkan hati kepada takut akan Tuhan dan menikmati anugerah-Nya.",
    audience: "Pembaca yang digoda sukses duniawi dan mencari arti yang tahan lama.",
    summary: "Segala sesuatu sia-sia tanpa Tuhan; takutlah akan Allah dan pegang perintah-Nya.",
  },
  {
    abbr: "Kid",
    genre: "Puisi kasih",
    author: "Tradisi: Salomo; beberapa bagian mungkin kumpulan nyanyian kasih yang digubah kemudian.",
    when: "Tradisi zaman Salomo; penggunaan liturgis dan tafsir alegoris berkembang belakangan.",
    how: "Bahasa Ibrani puisi dialog antara kekasih; indah, indrawi, dan penuh metafora.",
    why:
      "Merayakan kasih setia dalam pernikahan; tradisi Yahudi–Kristen juga membacanya sebagai kasih Allah dan umat / Kristus dan gereja.",
    audience: "Pasangan dan umat yang merenungkan kasih perjanjian yang kudus.",
    summary: "Nyanyian kasih yang kudus — indahnya komitmen dan kerinduan yang saling menjaga.",
  },
  {
    abbr: "Yes",
    genre: "Nubuat",
    author:
      "Yesaya bin Amos (abad ke-8 SM). Banyak penafsir melihat pasal 40–66 berkaitan dengan murid/tradisi Yesaya di zaman pembuangan dan sesudahnya.",
    when: "Inti: Yehuda di bawah Uzia hingga Hizkia; juga visi penghiburan pembuangan dan pemulihan.",
    how: "Bahasa Ibrani; nubuat, puisi, dan narasi — tentang penghakiman, Immanuel, Hamba Tuhan, dan kerajaan baru.",
    why: "Memanggil Yehuda bertobat, menguatkan iman di tengah ancaman Asyur, dan menubuatkan penghiburan serta Mesias.",
    audience: "Yehuda abad ke-8 SM, lalu umat dalam pembuangan dan semua yang menantikan keselamatan Allah.",
    summary: "Kudus, kudus, kudus; penghakiman dan penghiburan; Hamba yang menderita membawa keselamatan.",
  },
  {
    abbr: "Yer",
    genre: "Nubuat",
    author: "Yeremia, dengan bantuan juru tulis Barukh (Yer 36).",
    when: "Dari Yosia hingga kejatuhan Yerusalem (sekitar 627–586 SM) dan sesudahnya.",
    how: "Bahasa Ibrani (sedikit Aram); khotbah, ratapan, simbol, dan surat kepada buangan.",
    why: "Memperingatkan Yehuda tentang penghakiman, memanggil pertobatan, dan memberi harapan perjanjian baru.",
    audience: "Yehuda yang keras kepala, orang buangan di Babel, dan generasi yang menunggu pemulihan.",
    summary: "Nabi air mata: Bait akan jatuh, namun Allah membuat perjanjian baru di hati.",
  },
  {
    abbr: "Rat",
    genre: "Ratapan / puisi",
    author: "Tradisi: Yeremia; anonim dalam teks Ibrani.",
    when: "Segera setelah kehancuran Yerusalem (586 SM).",
    how: "Bahasa Ibrani; puisi akrostik yang meratap kota, Bait, dan penderitaan umat.",
    why: "Memberi kata bagi duka nasional sekaligus pengakuan bahwa kasih setia Tuhan tidak berakhir.",
    audience: "Umat yang berkabung di pembuangan — dan siapa pun yang berduka mendalam.",
    summary: "Yerusalem runtuh; namun «kebaikan Tuhan tiada habisnya; kasih setia-Nya tidak berkesudahan».",
  },
  {
    abbr: "Yeh",
    genre: "Nubuat / penglihatan",
    author: "Yehezkiel, imam yang menjadi nabi di pembuangan Babel.",
    when: "Sekitar 593–571 SM di antara orang buangan di tepi sungai Kebar.",
    how: "Bahasa Ibrani; penglihatan dramatis, tindakan simbolik, dan nubuat penghakiman serta pemulihan.",
    why: "Menjelaskan mengapa Yerusalem jatuh, dan memberi harapan: hati baru, gembala baru, Bait baru.",
    audience: "Orang Yahudi buangan di Babel yang kehilangan tanah dan Bait.",
    summary: "Kemuliaan Tuhan pergi, lalu kembali; tulang-tulang kering hidup; umat mendapat hati baru.",
  },
  {
    abbr: "Dan",
    genre: "Nubuat / hikmat di istana",
    author: "Tradisi: Daniel; sebagian dalam bentuk narasi tentang dia dan teman-temannya.",
    when: "Latar pembuangan Babel dan Persia (abad ke-6 SM); diskusi akademis tentang bentuk akhir abad ke-2 SM.",
    how: "Ibrani dan Aram; kisah setia di istana plus penglihatan tentang kerajaan-kerajaan dan Anak Manusia.",
    why: "Menguatkan umat agar setia di bawah kekuasaan asing: Allah memerintah sejarah.",
    audience: "Umat dalam tekanan politik/agama — dulu dan sekarang.",
    summary: "Setia di perapian dan gua singa; penglihatan kerajaan Allah yang kekal.",
  },
  {
    abbr: "Ho",
    genre: "Nubuat",
    author: "Hosea bin Beeri, nabi di Israel Utara.",
    when: "Abad ke-8 SM, menjelang kejatuhan Samaria.",
    how: "Bahasa Ibrani; pernikahan Hosea menjadi perumpamaan kasih Allah kepada umat yang tidak setia.",
    why: "Memanggil Israel bertobat dari penyembahan berhala dan ketidaksetiaan perjanjian.",
    audience: "Kerajaan Utara (dan Yehuda yang mendengar peringatan yang sama).",
    summary: "Allah tetap mengasihi istri yang tidak setia — undangan pulang kepada Tuhan.",
  },
  {
    abbr: "Yo",
    genre: "Nubuat",
    author: "Yoel bin Petuel.",
    when: "Penanggalan diperdebatkan (mungkin abad ke-9 hingga pasca-pembuangan); fokus Yehuda dan Yerusalem.",
    how: "Bahasa Ibrani; bencana belalang sebagai bayangan hari Tuhan, lalu janji Roh.",
    why: "Memanggil pertobatan nasional dan menjanjikan pencurahan Roh Kudus.",
    audience: "Umat Yehuda yang menghadapi bencana dan menantikan hari Tuhan.",
    summary: "Belalang, pertobatan, dan janji: «Aku akan mencurahkan Roh-Ku ke atas semua manusia».",
  },
  {
    abbr: "Am",
    genre: "Nubuat",
    author: "Amos, peternak dari Tekoa yang diutus ke Israel Utara.",
    when: "Abad ke-8 SM, zaman kemakmuran Yerobeam II.",
    how: "Bahasa Ibrani; orakel penghakiman terhadap bangsa-bangsa dan terhadap ketidakadilan sosial Israel.",
    why: "Menegaskan bahwa ibadah tanpa keadilan adalah kosong; Allah membela yang tertindas.",
    audience: "Israel yang kaya namun menindas orang miskin — peringatan juga bagi setiap masyarakat.",
    summary: "Biarkan keadilan bergulung-gulung seperti air; hari Tuhan datang bagi yang sombong.",
  },
  {
    abbr: "Ob",
    genre: "Nubuat",
    author: "Obaja.",
    when: "Setelah kehancuran Yerusalem, ketika Edom bergembira atas kejatuhan Yehuda (sekitar 586 SM atau dekat itu).",
    how: "Bahasa Ibrani; nubuat singkat tentang penghakiman Edom dan pemulihan Sion.",
    why: "Menegaskan bahwa kesombongan dan kekerasan terhadap saudara akan dihukum Allah.",
    audience: "Yehuda yang terluka, dan peringatan bagi bangsa yang menindas.",
    summary: "Edom akan jatuh; kerajaan akan menjadi milik Tuhan.",
  },
  {
    abbr: "Yun",
    genre: "Narasi nabi / misi",
    author: "Anonim; tentang nabi Yunus bin Amitai (disebut juga di 2 Raj 14:25).",
    when: "Latar abad ke-8 SM (Asyur); penulisan mungkin kemudian sebagai pengajaran.",
    how: "Bahasa Ibrani; cerita ironis tentang nabi yang lari dari misi Allah kepada Niniwe.",
    why: "Menunjukkan belas kasihan Allah bahkan kepada musuh — dan menantang hati yang sempit.",
    audience: "Umat yang enggan melihat belas kasihan Allah meluas ke bangsa lain.",
    summary: "Yunus lari; Niniwe bertobat; Allah berbelas kasihan — pertanyaan untuk kita.",
  },
  {
    abbr: "Mi",
    genre: "Nubuat",
    author: "Mikha dari Moresyet, sezaman Yesaya.",
    when: "Abad ke-8 SM, ancaman Asyur terhadap Yehuda.",
    how: "Bahasa Ibrani; penghakiman atas ketidakadilan, janji Raja dari Betlehem, dan panggilan hidup benar.",
    why: "Memanggil pemimpin dan umat bertobat; menubuatkan Mesias dan kerajaan damai.",
    audience: "Yehuda dan para pemukanya yang menindas rakyat.",
    summary: "Berbuat adil, mencintai kesetiaan, dan hidup dengan rendah hati di hadapan Allah.",
  },
  {
    abbr: "Na",
    genre: "Nubuat",
    author: "Nahum dari Elkosh.",
    when: "Menjelang kejatuhan Niniwe (612 SM).",
    how: "Bahasa Ibrani puisi yang kuat tentang penghakiman atas Asyur yang kejam.",
    why: "Menghibur Yehuda: penindas tidak akan menang selamanya; Tuhan adalah benteng.",
    audience: "Yehuda yang lama tertindas Asyur.",
    summary: "Niniwe jatuh; Tuhan membalas kejahatan dan melindungi umat-Nya.",
  },
  {
    abbr: "Hab",
    genre: "Nubuat / dialog dengan Allah",
    author: "Habakuk.",
    when: "Menjelang kebangkitan Babel (akhir abad ke-7 SM).",
    how: "Bahasa Ibrani; keluhan nabi, jawaban Tuhan, dan mazmur iman («orang benar akan hidup oleh imanannya»).",
    why: "Mengajar iman di tengah ketidakadilan: Allah tetap bekerja meski caranya membingungkan.",
    audience: "Orang percaya yang bertanya «mengapa orang jahat menang?»",
    summary: "Dari keluhan menuju iman: bersukacita di Tuhan sekalipun pohon ara tidak berbuah.",
  },
  {
    abbr: "Zef",
    genre: "Nubuat",
    author: "Zefanya, sezaman Yosia.",
    when: "Abad ke-7 SM, sebelum/ selama pembaruan Yosia.",
    how: "Bahasa Ibrani; hari Tuhan yang menggemparkan, lalu janji sisa yang rendah hati.",
    why: "Memanggil Yehuda bertobat dari sinkretisme dan kesombongan sebelum hari penghakiman.",
    audience: "Yehuda yang berkutat dengan berhala dan ketidakpedulian.",
    summary: "Hari Tuhan dekat; namun Ia bersukacita atas umat yang Ia pulihkan.",
  },
  {
    abbr: "Hag",
    genre: "Nubuat",
    author: "Hagai.",
    when: "520 SM, tahun kedua Darius, saat pembangunan Bait terhenti.",
    how: "Bahasa Ibrani; pesan singkat bertanggal yang mendorong pembangunan kembali Bait Suci.",
    why: "Membangkitkan prioritas rohani: bangunkan rumah Tuhan, maka berkat menyusul.",
    audience: "Umat yang kembali dari pembuangan namun fokus pada rumah sendiri.",
    summary: "«Perhatikanlah jalanmu» — bangun Bait, dan Tuhan menyertai.",
  },
  {
    abbr: "Za",
    genre: "Nubuat / penglihatan",
    author: "Zakharia bin Berekhya.",
    when: "Mulai 520 SM, sezaman Hagai; penglihatan dan nubuat mesianis.",
    how: "Bahasa Ibrani; delapan penglihatan, khotbah, dan nubuat tentang Raja yang rendah hati di atas keledai.",
    why: "Menguatkan pembangunan Bait dan menumbuhkan harapan akan Mesias serta Yerusalem baru.",
    audience: "Komunitas pasca-pembuangan yang lemah semangat.",
    summary: "Bukan dengan keperkasaan, melainkan dengan Roh-Ku; Raja damai datang ke Sion.",
  },
  {
    abbr: "Mal",
    genre: "Nubuat",
    author: "Maleakhi («utusan-Ku»).",
    when: "Sekitar abad ke-5 SM, setelah Bait dibangun kembali (zaman Ezra/Nehemia atau dekat itu).",
    how: "Bahasa Ibrani; gaya tanya–jawab antara Tuhan dan umat yang lesu iman.",
    why: "Menegur ibadah asal-asalan, ketidaksetiaan, dan menunjuk ke utusan yang mempersiapkan jalan Tuhan.",
    audience: "Umat pasca-pembuangan yang meragukan kasih Tuhan.",
    summary: "Kembalilah kepada-Ku; utusan akan datang sebelum hari Tuhan yang besar.",
  },
  {
    abbr: "Mat",
    genre: "Injil",
    author: "Tradisi gereja: Matius (Lewi), salah satu dari dua belas. Bentuk Yunani yang kita miliki memakai Markus dan sumber lain.",
    when: "Sekitar tahun 70–90 M (banyak penafsir: 80-an), kemungkinan di lingkungan Antiokhia/Suriah.",
    how: "Bahasa Yunani; struktur khotbah (mis. Khotbah di Bukit), penggenapan nubuat PL, dan silsilah Yesus.",
    why: "Menunjukkan Yesus sebagai Mesias Raja yang dijanjikan — penggenapan Kitab Suci bagi orang Yahudi dan murid-murid.",
    audience: "Jemaat berlatar Yahudi dan petobat baru yang perlu paham bahwa Yesus menggenapi Torat dan para nabi.",
    summary: "Raja Mesias datang: ajar, mati, bangkit — «Aku menyertai kamu senantiasa».",
  },
  {
    abbr: "Mrk",
    genre: "Injil",
    author: "Tradisi: Yohanes Markus, mencatat pemberitaan Petrus.",
    when: "Sering dianggap Injil paling awal, sekitar 65–75 M, mungkin di Roma.",
    how: "Bahasa Yunani yang ringkas dan cepat («segera»); fokus tindakan Yesus dan jalan salib.",
    why: "Memberitakan Injil Yesus Kristus kepada orang percaya di bawah tekanan: ikut Dia berarti memanggul salib.",
    audience: "Jemaat non-Yahudi (banyak istilah dijelaskan) yang mengalami penganiayaan.",
    summary: "Anak Allah yang melayani, menderita, dan bangkit — panggilan menjadi murid.",
  },
  {
    abbr: "Luk",
    genre: "Injil",
    author: "Lukas, sahabat Paulus; dokter dan sejarawan yang teliti (Luk 1:1–4).",
    when: "Sekitar 70–90 M; jilid pertama sebelum Kisah Para Rasul.",
    how: "Bahasa Yunani yang baik; penelitian sumber, penekanan doa, Roh, orang miskin, dan perempuan.",
    why: "Memberi kisah teratur supaya Teofilus (dan pembaca) yakin akan kebenaran ajaran yang diterima.",
    audience: "Teofilus dan jemaat yang lebih luas, terutama berlatar non-Yahudi.",
    summary: "Anak Manusia datang mencari dan menyelamatkan yang hilang.",
  },
  {
    abbr: "Yoh",
    genre: "Injil",
    author: "Tradisi: Yohanes Rasul (atau lingkaran muridnya). Saksi yang «dikasihi Yesus».",
    when: "Sekitar 80–95 M, sering dikaitkan dengan Efesus.",
    how: "Bahasa Yunani; tanda-tanda, percakapan panjang, «Aku adalah», dan teologi inkarnasi yang dalam.",
    why: "Supaya kamu percaya bahwa Yesus adalah Mesias, Anak Allah, dan oleh iman memperoleh hidup (Yoh 20:31).",
    audience: "Jemaat yang menghadapi tantangan iman dan pertanyaan tentang identitas Yesus.",
    summary: "Firman menjadi manusia; percaya kepada-Nya berarti hidup yang kekal.",
  },
  {
    abbr: "Kis",
    genre: "Sejarah gereja mula-mula",
    author: "Lukas, kelanjutan Injil Lukas.",
    when: "Mencakup ~30–62 M; ditulis sekitar waktu yang sama dengan Lukas (70–90 M).",
    how: "Bahasa Yunani; narasi dari Yerusalem ke Roma, dengan khotbah dan perjalanan misi Paulus.",
    why: "Menunjukkan karya Roh Kudus menyebarkan Injil dari Yerusalem sampai ke ujung bumi.",
    audience: "Teofilus dan jemaat yang ingin paham asal-usul misi dan kesatuan gereja Yahudi–non-Yahudi.",
    summary: "Roh Kudus menggerakkan rasul; Injil menjangkau bangsa-bangsa hingga Roma.",
  },
  {
    abbr: "Rom",
    genre: "Surat rasuli",
    author: "Paulus.",
    when: "Sekitar 56–58 M, kemungkinan dari Korintus, sebelum ke Yerusalem.",
    how: "Bahasa Yunani; surat teologis terpanjang Paulus — dosa, pembenaran, Israel, dan hidup baru.",
    why: "Menjelaskan Injil dengan jelas dan mempersiapkan kunjungan ke Roma serta misi ke Spanyol.",
    audience: "Jemaat di Roma (Yahudi dan non-Yahudi) yang perlu kesatuan dalam Injil.",
    summary: "Dibenarkan oleh iman; hidup oleh Roh; kasih yang tidak pura-pura.",
  },
  {
    abbr: "1Ko",
    genre: "Surat rasuli",
    author: "Paulus (bersama Sostenes).",
    when: "Sekitar 54–55 M, dari Efesus.",
    how: "Bahasa Yunani; menjawab laporan dan pertanyaan jemaat tentang perpecahan, moral, ibadah, dan kebangkitan.",
    why: "Memperbaiki kekacauan di jemaat dan memanggil mereka hidup sebagai tubuh Kristus yang kudus.",
    audience: "Jemaat di Korintus yang hidup di kota kosmopolitan dan penuh godaan.",
    summary: "Satu tubuh, kasih yang terbesar, dan kebangkitan Kristus sebagai fondasi.",
  },
  {
    abbr: "2Ko",
    genre: "Surat rasuli",
    author: "Paulus (bersama Timotius).",
    when: "Sekitar 55–56 M, setelah surat yang pedih / kunjungan yang sulit.",
    how: "Bahasa Yunani; sangat pribadi — pembelaan pelayanan, kemuliaan dalam kelemahan, dan kolekte.",
    why: "Memulihkan hubungan dengan jemaat dan membela kerasulan Paulus yang sejati.",
    audience: "Jemaat Korintus dan «seluruh orang kudus di seluruh Akhaya».",
    summary: "Kuasa Allah dalam bejana tanah liat; rekonsiliasi dan kemurahan hati.",
  },
  {
    abbr: "Gal",
    genre: "Surat rasuli",
    author: "Paulus.",
    when: "Sekitar 48–55 M (penanggalan awal atau sesudah Konsili Yerusalem diperdebatkan).",
    how: "Bahasa Yunani; surat yang tajam membela Injil anugerah melawan tuntutan sunat bagi non-Yahudi.",
    why: "Menjaga kemerdekaan dalam Kristus: dibenarkan oleh iman, bukan oleh melakukan hukum Taurat.",
    audience: "Jemaat-jemaat di Galatia yang digoda «injil lain».",
    summary: "Kemerdekaan Kristus; buah Roh; salib sebagai kebanggaan satu-satunya.",
  },
  {
    abbr: "Ef",
    genre: "Surat rasuli",
    author: "Paulus (tradisi kuat; sebagian penafsir modern mendiskusikan penulis lewat murid Paulus).",
    when: "Sekitar 60–62 M, dari penjara (sering dikaitkan dengan Roma).",
    how: "Bahasa Yunani yang kaya; doktrin (pasal 1–3) lalu etika komunitas (4–6).",
    why: "Menyingkapkan rencana Allah menyatukan segala sesuatu dalam Kristus — Yahudi dan non-Yahudi satu tubuh.",
    audience: "Jemaat di Efesus / Asia Kecil (mungkin surat edaran).",
    summary: "Keselamatan oleh anugerah; hidup baru; penuh senjata Allah.",
  },
  {
    abbr: "Fil",
    genre: "Surat rasuli",
    author: "Paulus (bersama Timotius).",
    when: "Sekitar 60–62 M, dari penjara.",
    how: "Bahasa Yunani; surat persahabatan penuh sukacita, dengan nyanyian Kristus yang merendahkan diri (Fil 2).",
    why: "Mengucap syukur, mendorong kesatuan, dan mencontohkan sukacita di tengah penderitaan.",
    audience: "Jemaat di Filipi yang mendukung Paulus dengan setia.",
    summary: "Sukacita dalam Tuhan; Kristus adalah hidup; damai Allah menjaga hati.",
  },
  {
    abbr: "Kol",
    genre: "Surat rasuli",
    author: "Paulus (bersama Timotius).",
    when: "Sekitar 60–62 M, dari penjara; sezaman dengan Filemon dan Efesus.",
    how: "Bahasa Yunani; Kristus di atas segala kuasa; peringatan terhadap ajaran palsu.",
    why: "Meneguhkan bahwa Kristus cukup — jangan ditambah filsafat atau ritual yang menggeser Dia.",
    audience: "Jemaat di Kolose (yang tidak Paulus dirikan langsung) dan Laodikia.",
    summary: "Kristus yang sulung dan lengkap; hiduplah di dalam Dia.",
  },
  {
    abbr: "1Te",
    genre: "Surat rasuli",
    author: "Paulus, Silwanus, dan Timotius.",
    when: "Sekitar 50–51 M, dari Korintus — salah satu surat Paulus paling awal.",
    how: "Bahasa Yunani; penguatan iman muda, kekudusan, dan pengajaran tentang kedatangan Tuhan.",
    why: "Menghibur jemaat yang menderita dan menjawab kebingungan tentang orang percaya yang meninggal.",
    audience: "Jemaat baru di Tesalonika.",
    summary: "Iman, kasih, pengharapan; hidup kudus sambil menantikan Kristus.",
  },
  {
    abbr: "2Te",
    genre: "Surat rasuli",
    author: "Paulus, Silwanus, dan Timotius.",
    when: "Tidak lama setelah 1 Tesalonika (sekitar 50–52 M).",
    how: "Bahasa Yunani; klarifikasi tentang hari Tuhan dan peringatan terhadap kemalasan.",
    why: "Menenangkan spekulasi akhir zaman dan mendorong kerja serta ketekunan.",
    audience: "Jemaat Tesalonika yang gelisah soal kedatangan Kristus.",
    summary: "Hari Tuhan belum tiba; berdirilah teguh dan bekerjalah dengan tenang.",
  },
  {
    abbr: "1Ti",
    genre: "Surat penggembalaan",
    author: "Paulus (tradisi; diskusi akademis ada tentang keaslian surat-surat Pastoral).",
    when: "Sekitar 62–67 M, setelah pembebasan dari penjara Roma (menurut rekonstruksi tradisional).",
    how: "Bahasa Yunani; pedoman bagi Timotius tentang ibadah, kepemimpinan, dan ajaran sehat.",
    why: "Menjaga jemaat Efesus dari ajaran sesat dan menata kehidupan jemaat.",
    audience: "Timotius sebagai pemimpin muda, dan jemaat yang ia gembalakan.",
    summary: "Ajaran sehat, doa, teladan; pelihara apa yang dipercayakan.",
  },
  {
    abbr: "2Ti",
    genre: "Surat penggembalaan",
    author: "Paulus — surat terakhir menurut tradisi, dari penjara menjelang kematian.",
    when: "Sekitar 66–67 M, di Roma.",
    how: "Bahasa Yunani; sangat pribadi: warisan iman, penderitaan, dan Kitab Suci yang diilhamkan.",
    why: "Menguatkan Timotius agar memberitakan firman dengan setia sampai akhir.",
    audience: "Timotius — dan setiap pelayan yang lelah namun dipanggil bertahan.",
    summary: "Beritakan firman; perjuangkan perjuangan yang baik; Tuhan akan membawa ke kerajaan-Nya.",
  },
  {
    abbr: "Tit",
    genre: "Surat penggembalaan",
    author: "Paulus.",
    when: "Sekitar 62–67 M, sezaman dengan 1 Timotius.",
    how: "Bahasa Yunani; penunjukan penatua dan hidup yang sehat di tengah budaya Kreta.",
    why: "Menata jemaat di Kreta dan menekankan bahwa anugerah mendidik kita hidup saleh.",
    audience: "Titus di Kreta, dan jemaat di pulau itu.",
    summary: "Anugerah yang menyelamatkan juga mendidik; lakukan yang baik.",
  },
  {
    abbr: "Flm",
    genre: "Surat pribadi / rekonsiliasi",
    author: "Paulus (bersama Timotius).",
    when: "Sekitar 60–62 M, dari penjara, bersama Kolose.",
    how: "Bahasa Yunani; surat singkat penuh hikmat pastoral kepada Filemon tentang Onesimus.",
    why: "Memohon penerimaan budak yang bertobat sebagai saudara kekasih — Injil mengubah relasi.",
    audience: "Filemon, Aphia, Arkhipus, dan jemaat di rumah mereka.",
    summary: "Dari budak menjadi saudara; kasih Kristus merombak status sosial.",
  },
  {
    abbr: "Ibr",
    genre: "Khotbah / surat",
    author: "Anonim. Gereja mula-mula mengusulkan Paulus, Barnabas, Apolos, dan lain-lain — pasti tokoh yang mengenal PL mendalam.",
    when: "Sebelum 70 M (Bait masih dibahas sebagai relevan) atau dekat masa itu; sering 60–90 M.",
    how: "Bahasa Yunani yang sangat baik; eksposisi PL yang menunjukkan superioritas Kristus.",
    why: "Mencegah kemunduran iman — Kristus lebih tinggi dari malaikat, Musa, dan imamat lama.",
    audience: "Orang percaya berlatar Yahudi yang tergoda kembali ke sistem lama di bawah tekanan.",
    summary: "Yesus Imam Besar yang agung; bertekunlah; iman adalah dasar dari segala yang kita harapkan.",
  },
  {
    abbr: "Yaa",
    genre: "Surat umum / hikmat",
    author: "Yakobus, saudara Tuhan Yesus, pemimpin jemaat Yerusalem.",
    when: "Sekitar 40–62 M (sering dianggap surat PB paling awal).",
    how: "Bahasa Yunani; gaya hikmat Yahudi — singkat, tajam, praktis.",
    why: "Iman yang hidup harus terlihat dalam perbuatan, lidah, dan kepedulian kepada yang miskin.",
    audience: "«Kedua belas suku di perantauan» — orang percaya di diaspora.",
    summary: "Iman tanpa perbuatan adalah mati; mintalah hikmat; tundukkan lidah.",
  },
  {
    abbr: "1Pe",
    genre: "Surat umum",
    author: "Petrus (dengan bantuan Silwanus menurut 1Ptr 5:12).",
    when: "Sekitar 60–64 M, dari «Babel» (sering dipahami Roma).",
    how: "Bahasa Yunani yang indah; penghiburan bagi orang percaya yang menderita sebagai orang asing.",
    why: "Menguatkan harapan kudus di tengah penganiayaan ringan maupun tekanan sosial.",
    audience: "Jemaat di wilayah Asia Kecil (Pontus, Galatia, Kapadokia, Asia, Bitinia).",
    summary: "Kamu adalah umat kepunyaan Allah; ikutlah jejak Kristus yang menderita.",
  },
  {
    abbr: "2Pe",
    genre: "Surat umum",
    author: "Petrus (tradisi; beberapa penafsir modern mendiskusikan keaslian).",
    when: "Sekitar 64–68 M, menjelang kematian Petrus.",
    how: "Bahasa Yunani; peringatan terhadap guru palsu dan penundaan penghakiman yang disepelekan.",
    why: "Meneguhkan pengajaran rasuli dan menantikan langit serta bumi yang baru.",
    audience: "Orang percaya yang sama seperti di 1 Petrus / jemaat yang digoda ajaran sesat.",
    summary: "Bertumbuh dalam pengenalan Kristus; hari Tuhan pasti datang.",
  },
  {
    abbr: "1Yo",
    genre: "Surat umum",
    author: "Yohanes Rasul (tradisi yang sama dengan Injil Yohanes).",
    when: "Sekitar 85–95 M.",
    how: "Bahasa Yunani sederhana namun dalam; ujian: kebenaran tentang Kristus, kasih, dan ketaatan.",
    why: "Melawan ajaran yang menyangkal inkarnasi dan memulihkan keyakinan anak-anak Allah.",
    audience: "Jemaat di sekitar Efesus yang diguncang perpecahan dan ajaran palsu.",
    summary: "Allah adalah kasih; barangsiapa tinggal di dalam kasih, tinggal di dalam Allah.",
  },
  {
    abbr: "2Yo",
    genre: "Surat singkat",
    author: "Yohanes («penatua»).",
    when: "Sekitar 85–95 M.",
    how: "Bahasa Yunani; surat pendek kepada «ibu yang terpilih» (jemaat atau tokoh perempuan).",
    why: "Mendorong kasih dalam kebenaran dan menolak menyambut guru yang menyangkal Kristus.",
    audience: "Jemaat / rumah tangga yang dituju surat itu.",
    summary: "Kasih dan kebenaran berjalan bersama; waspadalah terhadap penyesat.",
  },
  {
    abbr: "3Yo",
    genre: "Surat singkat",
    author: "Yohanes («penatua»).",
    when: "Sekitar 85–95 M.",
    how: "Bahasa Yunani; surat pribadi kepada Gayus tentang keramahtamahan misi.",
    why: "Memuji dukungan bagi para pekerja Injil dan menegur Diotrefes yang suka menjadi orang terkemuka.",
    audience: "Gayus, dan jemaat yang melihat contoh baik serta buruk dalam kepemimpinan.",
    summary: "Ikatkan diri pada yang baik; dukung mereka yang pergi demi Nama.",
  },
  {
    abbr: "Yud",
    genre: "Surat umum",
    author: "Yudas, saudara Yakobus (dan saudara Tuhan Yesus).",
    when: "Sekitar 65–80 M.",
    how: "Bahasa Yunani; tajam, memakai contoh PL dan tradisi Yahudi untuk mengecam guru palsu.",
    why: "Mendesak jemaat berjuang untuk iman yang telah disampaikan kepada orang-orang kudus.",
    audience: "Orang percaya yang disusupi orang-orang yang menyalahgunakan anugerah.",
    summary: "Pertahankan iman; Allah sanggup menjaga kamu jangan sampai tergelincir.",
  },
  {
    abbr: "Why",
    genre: "Apokalips / nubuat",
    author: "Yohanes (tradisi: rasul Yohanes) di Pulau Patmos.",
    when: "Sekitar 90–95 M (zaman Domitianus), atau alternatif ~68–70 M.",
    how: "Bahasa Yunani; surat kepada tujuh jemaat + penglihatan simbolik tentang penghakiman dan kemenangan Anak Domba.",
    why: "Menguatkan jemaat tertindas: Kristus menang; tetaplah setia sampai akhir.",
    audience: "Tujuh jemaat di Asia Kecil — dan seluruh gereja di sepanjang zaman.",
    summary: "Anak Domba menang; langit baru dan bumi baru; Allah menyeka segala air mata.",
  },
];

const introByAbbr = new Map(
  BIBLE_BOOK_INTROS.map((intro) => [intro.abbr, intro] as const),
);

export function getBibleBookIntro(abbr: string): BibleBookIntro | null {
  return introByAbbr.get(abbr) ?? null;
}

export function getEnrichedBibleBookIntro(
  abbr: string,
): EnrichedBibleBookIntro | null {
  const base = getBibleBookIntro(abbr);
  if (!base) return null;

  const detail = BIBLE_BOOK_INTRO_DETAILS[abbr];
  const isOt = isOldTestamentAbbr(abbr);
  const sourceIds =
    detail?.sourceIds ??
    (isOt ? DEFAULT_OT_SOURCE_IDS : DEFAULT_NT_SOURCE_IDS);

  return {
    ...base,
    chapters: detail?.chapters ?? 0,
    about: BIBLE_BOOK_ABOUT[abbr] ?? base.summary,
    themes: detail?.themes ?? [],
    characters: BIBLE_BOOK_CHARACTERS[abbr] ?? [],
    outline: detail?.outline ?? [],
    notes:
      detail?.notes ??
      "Pengantar ini merangkum tradisi baca gereja dan kesepakatan umum dalam literatur pengantar Alkitab untuk pembaca awam.",
    deeper:
      detail?.deeper ??
      "Baca kitab ini perlahan: perhatikan ulang janji Allah, respons manusia, dan bagaimana kisahnya mengalir menuju Kristus.",
    sourceIds,
    sources: resolveBibleIntroSources(sourceIds),
  };
}

export function getBookWithIntro(abbr: string): {
  book: BibleBook;
  intro: BibleBookIntro;
} | null {
  const book = BIBLE_BOOKS.find((item) => item.abbr === abbr) ?? null;
  const intro = getBibleBookIntro(abbr);
  if (!book || !intro) return null;
  return { book, intro };
}

export function getBookWithEnrichedIntro(abbr: string): {
  book: BibleBook;
  intro: EnrichedBibleBookIntro;
} | null {
  const book = BIBLE_BOOKS.find((item) => item.abbr === abbr) ?? null;
  const intro = getEnrichedBibleBookIntro(abbr);
  if (!book || !intro) return null;
  return { book, intro };
}

export function isOldTestamentAbbr(abbr: string) {
  const index = BIBLE_BOOKS.findIndex((book) => book.abbr === abbr);
  return index >= 0 && index < OLD_TESTAMENT_SIZE;
}

export function searchBibleBookIntros(query: string) {
  const q = query.trim().toLowerCase();
  const books = BIBLE_BOOKS;
  if (!q) {
    return books
      .map((book) => {
        const intro = getBibleBookIntro(book.abbr);
        return intro ? { book, intro } : null;
      })
      .filter(Boolean) as { book: BibleBook; intro: BibleBookIntro }[];
  }

  return books
    .map((book) => {
      const intro = getBibleBookIntro(book.abbr);
      if (!intro) return null;
      const detail = BIBLE_BOOK_INTRO_DETAILS[book.abbr];
      const haystack = [
        book.name,
        book.abbr,
        ...book.aliases,
        intro.genre,
        intro.author,
        intro.summary,
        intro.audience,
        intro.why,
        BIBLE_BOOK_ABOUT[book.abbr] ?? "",
        ...(detail?.themes ?? []),
        ...(detail?.outline ?? []),
        ...(BIBLE_BOOK_CHARACTERS[book.abbr] ?? []).flatMap((c) => [
          c.name,
          c.role,
        ]),
        detail?.notes ?? "",
        detail?.deeper ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q) ? { book, intro } : null;
    })
    .filter(Boolean) as { book: BibleBook; intro: BibleBookIntro }[];
}

export function bookIntroHref(abbr: string) {
  return `/baca/kitab/${encodeURIComponent(abbr)}`;
}

export function bookReadHref(bookName: string, chapter = 1) {
  const params = new URLSearchParams();
  params.set("browse", "1");
  params.set("passage", `${bookName} ${chapter}`);
  return `/baca?${params.toString()}`;
}
