/**
 * Perluasan pengantar kitab: tema, kerangka, catatan, dan sumber.
 * Digabung ke data dasar di bible-book-intros.ts.
 */

import type { BibleIntroSourceId } from "@/lib/bible-intro-sources";
import {
  DEFAULT_NT_SOURCE_IDS,
  DEFAULT_OT_SOURCE_IDS,
} from "@/lib/bible-intro-sources";

export type BibleBookIntroDetail = {
  /** Jumlah pasal (standar kanon Protestan) */
  chapters: number;
  themes: string[];
  /** Kerangka besar / bagian utama */
  outline: string[];
  /** Catatan tradisi vs penafsiran modern */
  notes: string;
  /** Paragraf pendalaman di bawah ringkasan */
  deeper: string;
  sourceIds?: BibleIntroSourceId[];
};

export const BIBLE_BOOK_INTRO_DETAILS: Record<string, BibleBookIntroDetail> = {
  Kej: {
    chapters: 50,
    themes: ["Penciptaan", "Kejatuhan", "Perjanjian", "Pemilihan", "Berkat bagi bangsa-bangsa"],
    outline: [
      "1–11: Dari penciptaan sampai Babel (awal umat manusia)",
      "12–25: Abraham dan perjanjian",
      "26–36: Ishak dan Yakub",
      "37–50: Yusuf dan pemeliharaan Allah di Mesir",
    ],
    notes:
      "Tradisi Yahudi–Kristen mengaitkan Pentateukh dengan Musa. Banyak sarjana modern berbicara tentang proses penyusunan yang panjang (sumber/redaksi), tanpa meniadakan kesatuan teologis kitab ini sebagai fondasi cerita Alkitab.",
    deeper:
      "Kejadian bukan sekadar “awal sejarah dunia”, melainkan awal sejarah keselamatan: Allah yang menciptakan, manusia yang memberontak, dan janji yang memelihara garis berkat sampai Abraham — benih berkat bagi semua bangsa.",
    sourceIds: [...DEFAULT_OT_SOURCE_IDS],
  },
  Kel: {
    chapters: 40,
    themes: ["Penebusan", "Perjanjian Sinai", "Kehadiran Allah", "Hukum", "Ibadah"],
    outline: [
      "1–15: Penindasan, panggilan Musa, tulah, dan keluaran",
      "16–24: Perjalanan ke Sinai dan perjanjian",
      "25–31: Petunjuk Kemah Suci",
      "32–34: Anak lembu emas dan pembaruan kasih karunia",
      "35–40: Pembangunan Kemah dan kemuliaan Tuhan",
    ],
    notes:
      "Penanggalan keluaran (abad ke-15 vs ke-13 SM) masih diperdebatkan. Yang lebih penting secara teologis: Allah membebaskan dengan kuasa-Nya dan membentuk umat perjanjian.",
    deeper:
      "Keluaran menjadi pola penebusan di seluruh Alkitab: dari perbudakan menuju ibadah, dari Firaun menuju raja sejati — Allah sendiri yang hadir di tengah umat.",
  },
  Im: {
    chapters: 27,
    themes: ["Kekudusan", "Korban", "Imamat", "Kemurnian", "Hidup bersama Allah"],
    outline: [
      "1–7: Peraturan korban",
      "8–10: Pentahbisan imam",
      "11–15: Kekudusan dan kemurnian",
      "16: Hari Pendamaian",
      "17–27: Hukum kekudusan dan nazar",
    ],
    notes:
      "Bagi pembaca modern, detail korban terasa asing. Dalam kanon Kristen, Imamat dibaca sebagai bayang-bayang yang menunjuk pada karya Imam Besar sejati — Kristus.",
    deeper:
      "Pesan inti Imamat: Allah kudus, dan umat yang ditebus dipanggil hidup kudus — bukan untuk menjauh dari dunia, melainkan agar layak bersekutu dengan Tuhan.",
  },
  Bil: {
    chapters: 36,
    themes: ["Pengembaraan", "Pemberontakan", "Pemeliharaan", "Persiapan tanah", "Generasi baru"],
    outline: [
      "1–10: Sensus dan keberangkatan dari Sinai",
      "11–21: Pemberontakan dan penghakiman di padang gurun",
      "22–25: Bileam dan Baal-Peor",
      "26–36: Sensus baru dan persiapan masuk Kanaan",
    ],
    notes:
      "Nama “Bilangan” merujuk pada dua sensus. Narasi menekankan bahwa ketidakpercayaan menunda berkat, tetapi janji Allah tetap berdiri bagi generasi berikutnya.",
    deeper:
      "Bilangan mengajak jemaat melihat diri: sering memberontak, namun tetap dipelihara — dan dipanggil maju dengan iman, bukan dengan keluhan.",
  },
  Ul: {
    chapters: 34,
    themes: ["Kasih kepada Tuhan", "Pembaruan perjanjian", "Ketaatan", "Berkat & kutuk", "Pemilihan hidup"],
    outline: [
      "1–4: Peninjauan sejarah",
      "5–11: Inti hukum dan panggilan mengasihi",
      "12–26: Aturan kehidupan di tanah perjanjian",
      "27–30: Berkat, kutuk, dan pilihan",
      "31–34: Suksesi Yosua dan kematian Musa",
    ],
    notes:
      "Ulangan sangat memengaruhi sejarah Israel kemudian (“sejarah Deuteronomis”). Yesus mengutip Ulangan saat dicobai — menegaskan bahwa hidup bergantung pada setiap firman Allah.",
    deeper:
      "Di ambang tanah perjanjian, Musa tidak memberi teknik perang terlebih dulu, melainkan hati: kasihilah Tuhan dengan segenap hati, jiwa, dan kekuatan.",
  },
  Jos: {
    chapters: 24,
    themes: ["Janji tanah", "Ketaatan", "Kekudusan perang", "Warisan", "Pilih Tuhan"],
    outline: [
      "1–5: Persiapan memasuki Kanaan",
      "6–12: Penaklukan",
      "13–22: Pembagian tanah",
      "23–24: Perjanjian di Sikhem",
    ],
    notes:
      "Narasi penaklukan menimbulkan pertanyaan etika modern. Teks sendiri menekankan kedaulatan Allah, penghakiman atas kejahatan bangsa, dan panggilan Israel untuk tidak meniru penyembahan berhala.",
    deeper:
      "Yosua menutup dengan tantangan yang abadi: pilihlah pada hari ini kepada siapa kamu akan beribadah — lalu hiduplah sesuai pilihan itu.",
  },
  Hk: {
    chapters: 21,
    themes: ["Siklus dosa", "Pembebasan", "Kepemimpinan", "Kekacauan moral", "Kebutuhan raja yang benar"],
    outline: [
      "1–3: Kegagalan menuntaskan panggilan",
      "3–16: Siklus hakim-hakim utama",
      "17–21: Kekacauan tanpa raja (dua lampiran gelap)",
    ],
    notes:
      "Hakim bukan “hakim pengadilan” modern, melainkan pembebas yang dibangkitkan Allah. Kitab ini jujur tentang kegagalan — bukan heroisme tanpa cela.",
    deeper:
      "Refrein “setiap orang berbuat menurut pandangannya sendiri” menjelaskan mengapa Injil kemudian menekankan Raja yang benar: Kristus.",
  },
  Rut: {
    chapters: 4,
    themes: ["Kesetiaan", "Penebusan keluarga", "Providensi", "Orang luar diterima", "Garis Daud"],
    outline: [
      "1: Kesedihan dan kesetiaan Rut",
      "2: Rut di ladang Boas",
      "3: Permohonan penebusan",
      "4: Pernikahan dan silsilah sampai Daud",
    ],
    notes:
      "Kisah singkat di zaman hakim ini menjadi jembatan ke Daud — dan dalam Matius, ke Mesias. Moab yang “luar” masuk dalam rencana berkat.",
    deeper:
      "Di tengah kekacauan Hakim-hakim, Rut menampilkan kasih setia diam-diam yang mengubah sejarah keluarga — dan sejarah keselamatan.",
  },
  "1Sa": {
    chapters: 31,
    themes: ["Kepemimpinan", "Ketaatan vs korban", "Raja yang ditolak/ dipilih", "Hati yang mencari Allah"],
    outline: [
      "1–7: Samuel dan krisis keimaman",
      "8–15: Saul diangkat dan ditolak",
      "16–31: Daud naik, Saul runtuh",
    ],
    notes:
      "1–2 Samuel awalnya satu karya. Tradisi menyebut sumber nabi (Samuel, Natan, Gad). Tema teologis: Tuhanlah yang mengangkat dan menurunkan raja.",
    deeper:
      "Yang dicari Allah bukan penampilan luar, melainkan hati. Kontras Saul–Daud menjadi pelajaran kepemimpinan rohani sepanjang zaman.",
  },
  "2Sa": {
    chapters: 24,
    themes: ["Perjanjian Daud", "Kuasa & dosa", "Penghakiman", "Anugerah", "Kerajaan"],
    outline: [
      "1–10: Daud ditegakkan di Yerusalem",
      "11–12: Dosa dengan Batsyeba",
      "13–20: Krisis dalam rumah tangga dan Absalom",
      "21–24: Lampiran — nyanyian, pahlawan, sensus",
    ],
    notes:
      "Perjanjian 2 Samuel 7 menjadi fondasi harapan Mesias dari garis Daud. Kitab tidak menutup-nutupi dosa Daud — anugerah dan akibat tetap nyata.",
    deeper:
      "Kerajaan Daud menunjuk ke depan: janji takhta yang kekal menemukan penggenapannya dalam Anak Daud, Yesus Kristus.",
  },
  "1Ra": {
    chapters: 22,
    themes: ["Kemegahan & kejatuhan", "Bait Suci", "Penyembahan berhala", "Firman nabi", "Perpecahan kerajaan"],
    outline: [
      "1–11: Salomo — hikmat, bait, lalu kemunduran",
      "12–16: Perpecahan Yehuda–Israel",
      "17–22: Elia melawan Baal di utara",
    ],
    notes:
      "1–2 Raja-raja menilai setiap raja menurut kesetiaan pada perjanjian, terutama soal ibadah yang benar di Yerusalem versus bukit pengorbanan/Baal.",
    deeper:
      "Kemegahan Salomo tidak menjamin hati. Ketika ibadah dicampur, kerajaan retak — peringatan bagi setiap generasi.",
  },
  "2Ra": {
    chapters: 25,
    themes: ["Penghakiman", "Pembuangan", "Nabi", "Reformasi singkat", "Harapan tersisa"],
    outline: [
      "1–17: Kerajaan Utara sampai jatuh ke Asyur",
      "18–25: Yehuda, reformasi Hizkia/Yosia, lalu Babel",
    ],
    notes:
      "Kitab berakhir dengan pembuangan, namun ada kilas harapan (raja Yehuda diangkat di Babel). Penghakiman bukan kata terakhir Allah.",
    deeper:
      "2 Raja-raja menjelaskan mengapa bait dan tanah hilang: bukan karena Allah lemah, melainkan karena umat mengkhianati perjanjian.",
  },
  "1Ta": {
    chapters: 29,
    themes: ["Silsilah", "Ibadah", "Daud & Bait", "Kekudusan", "Harapan pasca-pembuangan"],
    outline: [
      "1–9: Silsilah",
      "10–21: Daud dan persiapan ibadah",
      "22–29: Persiapan Bait dan suksesi Salomo",
    ],
    notes:
      "Tawarikh ditulis dari sudut pandang pasca-pembuangan, menekankan ibadah, Lewi, dan garis Daud — lebih “liturgis” daripada Raja-raja.",
    deeper:
      "Bagi komunitas yang kembali dari pembuangan, Tawarikh menjawab: siapakah kita, dan bagaimana kita menyembah lagi dengan benar?",
  },
  "2Ta": {
    chapters: 36,
    themes: ["Bait Suci", "Reformasi", "Kesombongan raja", "Pembuangan", "Dekrit Koresy"],
    outline: [
      "1–9: Salomo dan Bait",
      "10–36: Raja-raja Yehuda sampai pembuangan dan harapan pemulihan",
    ],
    notes:
      "Fokus pada Yehuda/Bait. Berakhir dengan undangan Koresy membangun kembali — jembatan ke Ezra.",
    deeper:
      "Sejarah diingat agar ibadah dipulihkan: bait boleh hancur, tetapi panggilan menyembah Allah yang hidup tetap ada.",
  },
  Ezr: {
    chapters: 10,
    themes: ["Pemulihan", "Bait Suci", "Torat", "Kekudusan umat", "Anugerah Allah dalam sejarah"],
    outline: [
      "1–6: Kembali dan membangun bait",
      "7–10: Ezra dan pembaruan menurut Torat",
    ],
    notes:
      "Ezra–Nehemia sering dibaca berpasangan. Ada ketegangan soal perkawinan campur — dibaca dalam konteks menjaga identitas perjanjian pasca-pembuangan.",
    deeper:
      "Pemulihan bukan hanya batu dan kayu, melainkan umat yang kembali tunduk pada Firman.",
  },
  Ne: {
    chapters: 13,
    themes: ["Tembok", "Doa", "Kepemimpinan", "Perjanjian", "Reformasi sosial"],
    outline: [
      "1–7: Pembangunan tembok Yerusalem",
      "8–10: Pembacaan Torat dan pembaruan perjanjian",
      "11–13: Penataan kota dan reformasi",
    ],
    notes:
      "Nehemia memadukan doa dan aksi. Kepemimpinan yang efektif di sini bersifat rohani sekaligus praktis.",
    deeper:
      "Tembok tanpa Torat kosong; Torat tanpa komunitas yang tertata juga rentan. Nehemia memegang keduanya.",
  },
  Est: {
    chapters: 10,
    themes: ["Providensi", "Keberanian", "Identitas", "Pembalikan nasib", "Hari Purim"],
    outline: [
      "1–2: Vasthi dan Ester",
      "3–7: Rencana Haman dan pembalikan",
      "8–10: Pembebasan dan Purim",
    ],
    notes:
      "Nama Allah tidak disebut secara eksplisit, namun pemeliharaan-Nya terasa di setiap “kebetulan”. Itu bagian dari seni narasi kitab ini.",
    deeper:
      "Ester mengajak umat di diaspora percaya: Allah bekerja bahkan ketika Ia tampak tersembunyi.",
  },
  Ay: {
    chapters: 42,
    themes: ["Penderitaan", "Kedaulatan", "Hikmat", "Iman yang diuji", "Perjumpaan dengan Allah"],
    outline: [
      "1–2: Prolog di bumi dan sorga",
      "3–31: Dialog Ayub dan teman-temannya",
      "32–37: Elihu",
      "38–42: Tuhan menjawab dan epilog",
    ],
    notes:
      "Ayub menolak jawaban murahan soal penderitaan. Allah tidak memberi rumus lengkap, melainkan kehadiran dan kedaulatan yang memulihkan iman.",
    deeper:
      "Kitab ini mengizinkan keluhan yang jujur, sekaligus menegur teologi yang terlalu rapi di hadapan penderitaan nyata.",
  },
  Maz: {
    chapters: 150,
    themes: ["Pujian", "Ratapan", "Kepercayaan", "Raja/Mesias", "Torat & hikmat"],
    outline: [
      "Mazmur 1–41: Kitab I",
      "42–72: Kitab II",
      "73–89: Kitab III",
      "90–106: Kitab IV",
      "107–150: Kitab V (puncak haleluya)",
    ],
    notes:
      "Mazmur adalah nyanyian/doa Israel sepanjang abad. Banyak mazmur “Daud”, tetapi koleksi final disusun untuk ibadah umat secara keseluruhan.",
    deeper:
      "Di sini kita belajar berbicara kepada Allah dengan bahasa jujur: dari jurang sampai puji-pujian — dan Kristus kemudian menimba Mazmur dalam doa-Nya.",
  },
  Pnh: {
    chapters: 31,
    themes: ["Hikmat", "Takut akan Tuhan", "Perkataan", "Keadilan", "Keluarga"],
    outline: [
      "1–9: Undangan hikmat",
      "10–29: Amsal Salomo dan koleksi lain",
      "30–31: Kata-kata Agur dan Lemuel; istri yang cakap",
    ],
    notes:
      "Amsal adalah prinsip umum, bukan jaminan mekanis. Dibaca bersama Ayub dan Pengkhotbah agar hikmat tidak menjadi dogma kesuksesan.",
    deeper:
      "Takut akan Tuhan adalah awal pengetahuan — hikmat dimulai dari relasi, bukan trik.",
  },
  Pkh: {
    chapters: 12,
    themes: ["Kesia-siaan", "Waktu", "Nikmati anugerah", "Takut akan Tuhan", "Batas hikmat"],
    outline: [
      "1–2: Pencarian makna",
      "3–8: Waktu, ketidakadilan, hikmat terbatas",
      "9–12: Hidup di bawah matahari dan kesimpulan",
    ],
    notes:
      "“Kesia-siaan” (hebel) menunjuk pada kelabilan hidup “di bawah matahari”. Kesimpulan kitab mengarahkan kembali kepada takut akan Allah.",
    deeper:
      "Pengkhotbah menolong orang modern yang jenuh sukses: tanpa Allah, bahkan pencapaian terasa asap.",
  },
  Kid: {
    chapters: 8,
    themes: ["Kasih", "Keindahan", "Hasrat kudus", "Perjanjian pernikahan", "Kerinduan"],
    outline: [
      "Dialog kasih dan pencarian",
      "Pujian akan kekasih",
      "Puncak komitmen: kasih kuat seperti maut",
    ],
    notes:
      "Ditafsirkan sebagai nyanyian kasih suami-istri, dan/atau alegori kasih Allah–umat. Kedua lapisan itu telah lama hidup dalam tradisi Yahudi dan Kristen.",
    deeper:
      "Kitab ini menguduskan kasih manusiawi sekaligus memberi bahasa bagi kerinduan akan Allah.",
  },
  Yes: {
    chapters: 66,
    themes: ["Kekudusan", "Penghakiman", "Penghiburan", "Hamba Tuhan", "Raja Mesias"],
    outline: [
      "1–39: Penghakiman dan janji di zaman Asyur",
      "40–55: Penghiburan dan Hamba yang menderita",
      "56–66: Pemulihan dan langit–bumi baru",
    ],
    notes:
      "Diskusi “Yesaya tunggal vs multi-penulis” penting secara akademis; gereja membaca kesatuan kanonis yang menunjuk kuat kepada Kristus.",
    deeper:
      "Dari tahta kudus (Yes 6) sampai Hamba yang tertikam (Yes 53), Yesaya menjadi peta besar pengharapan Mesias.",
    sourceIds: [...DEFAULT_OT_SOURCE_IDS],
  },
  Yer: {
    chapters: 52,
    themes: ["Firman yang membakar", "Perjanjian baru", "Penghakiman Babel", "Air mata nabi", "Harapan"],
    outline: [
      "1–25: Panggilan dan teguran",
      "26–45: Konflik, penderitaan Yeremia",
      "46–51: Ucapan terhadap bangsa",
      "52: Kejatuhan Yerusalem",
    ],
    notes:
      "Yeremia hidup di akhir Yehuda. Janji perjanjian baru (Yer 31) menjadi kunci PB (Ibrani 8).",
    deeper:
      "Nabi “menangis” karena kasih — bukan karena senang menghakimi. Firman Allah tetap teguh meski kota runtuh.",
  },
  Rat: {
    chapters: 5,
    themes: ["Duka", "Murka & belas kasihan", "Kesetiaan Tuhan", "Pengakuan dosa", "Doa pemulihan"],
    outline: [
      "1–2: Ratapan atas Yerusalem",
      "3: Harapan di tengah kegelapan",
      "4–5: Akibat dosa dan doa penutup",
    ],
    notes:
      "Puisi akrostik yang menolong umat meratapi secara teratur — duka yang dibentuk, bukan dibungkam.",
    deeper:
      "“Kesetiaan Tuhan tidak berkesudahan” (Rat 3) lahir dari reruntuhan, bukan dari kenyamanan.",
  },
  Yeh: {
    chapters: 48,
    themes: ["Kemuliaan Tuhan", "Penghakiman", "Hati baru", "Gembala", "Bait & pemulihan"],
    outline: [
      "1–24: Penghakiman atas Yehuda",
      "25–32: Bangsa-bangsa",
      "33–39: Pemulihan",
      "40–48: Bait dan tanah baru",
    ],
    notes:
      "Bahasa penglihatan Yehezkiel sangat simbolik. Inti teologis: kemuliaan Tuhan meninggalkan bait karena dosa, lalu berjanji kembali.",
    deeper:
      "Allah berjanji memberi hati yang baru dan roh yang baru — pemulihan yang lebih dalam daripada bangunan batu.",
  },
  Dan: {
    chapters: 12,
    themes: ["Kedaulatan Allah", "Kesetiaan di pembuangan", "Kerajaan yang kekal", "Penglihatan akhir"],
    outline: [
      "1–6: Narasi Daniel dan teman-temannya",
      "7–12: Penglihatan tentang kerajaan-kerajaan dan akhir",
    ],
    notes:
      "Penanggalan Daniel diperdebatkan (abad ke-6 vs ke-2 SM). Iman kanonis menegaskan: Allah memerintah sejarah, bahkan di bawah kekaisaran.",
    deeper:
      "Di tanah asing, Daniel menunjukkan bahwa kesetiaan mungkin — dan kerajaan Allah akan menghancurkan semua kesombongan manusia.",
  },
  Ho: {
    chapters: 14,
    themes: ["Kasih setia", "Perselingkuhan rohani", "Penghakiman", "Pemulihan", "Pengenalan Allah"],
    outline: [
      "1–3: Perkawinan Hosea sebagai tanda",
      "4–14: Teguran dan undangan kembali",
    ],
    notes:
      "Hosea memakai metafora perkawinan yang tajam. Kasih Allah bukan sentimental; Ia kudus dan setia sekaligus.",
    deeper:
      "“Aku menghendaki kasih setia, bukan persembahan” — ibadah tanpa kesetiaan adalah kosong.",
  },
  Yo: {
    chapters: 3,
    themes: ["Hari Tuhan", "Pertobatan", "Roh Kudus", "Penghakiman bangsa", "Pemulihan"],
    outline: [
      "1–2: Belalang, ratapan, pertobatan",
      "2–3: Janji Roh dan hari Tuhan",
    ],
    notes:
      "Yoel menjadi kunci khotbah Petrus di Pentakosta (Kis 2): janji Roh untuk semua daging.",
    deeper:
      "Bencana memanggil pertobatan; anugerah menjawab dengan Roh dan pengharapan.",
  },
  Am: {
    chapters: 9,
    themes: ["Keadilan sosial", "Ibadah kosong", "Hari Tuhan", "Penghakiman", "Pemulihan pondok Daud"],
    outline: [
      "1–2: Bangsa-bangsa dan Yehuda/Israel",
      "3–6: Teguran kepada kemakmuran yang menindas",
      "7–9: Penglihatan dan harapan",
    ],
    notes:
      "Amos menantang umat religius yang menindas miskin. Keadilan bukan tambahan opsional bagi perjanjian.",
    deeper:
      "Allah menolak nyanyian yang menutup telinga terhadap jeritan orang lemah.",
  },
  Ob: {
    chapters: 1,
    themes: ["Kesombongan Edom", "Hari Tuhan", "Pembalasan", "Kerajaan Tuhan"],
    outline: ["Penghakiman atas Edom dan pemulihan Sion"],
    notes:
      "Kitab terpendek PL. Konflik Israel–Edom menjadi panggung untuk menegaskan: Tuhanlah yang bertakhta.",
    deeper:
      "Kesombongan bangsa di gunung batu pun tidak aman dari penghakiman Allah.",
  },
  Yun: {
    chapters: 4,
    themes: ["Belas kasihan Allah", "Misi ke bangsa", "Kemarahan nabi", "Pertobatan", "Anugerah"],
    outline: [
      "1: Melarikan diri",
      "2: Doa dari perut ikan",
      "3: Niniwe bertobat",
      "4: Hati Yunus vs hati Allah",
    ],
    notes:
      "Fokus kitab bukan biologi ikan, melainkan teologi belas kasihan: Allah peduli pada bangsa yang dibenci Yunus.",
    deeper:
      "Yunus mengekspos hati kita: senang diampuni, sulit melihat musuh diampuni.",
  },
  Mi: {
    chapters: 7,
    themes: ["Keadilan", "Kerendahan", "Raja dari Betlehem", "Penghakiman", "Pengampunan"],
    outline: [
      "1–3: Penghakiman pemimpin",
      "4–5: Harapan Sion dan raja gembala",
      "6–7: Tuduhan perjanjian dan pengampunan",
    ],
    notes:
      "Mikha 5 dikutip dalam kisah kelahiran Yesus. Mikha 6:8 merangkum etika perjanjian dengan indah.",
    deeper:
      "Berlaku adil, mencintai kesetiaan, dan hidup dengan rendah hati di hadapan Allah — ringkasan yang tajam.",
  },
  Na: {
    chapters: 3,
    themes: ["Penghakiman Niniwe", "Kecongkakan kekaisaran", "Penghiburan Yehuda", "Allah yang cemburu"],
    outline: ["Kekalahan Niniwe sebagai kabar baik bagi yang tertindas"],
    notes:
      "Berbeda dari Yunus (belas kasihan), Nahum menekankan penghakiman atas kekejaman Asyur yang sudah genap.",
    deeper:
      "Allah panjang sabar, tetapi tidak buta terhadap kekerasan kekaisaran.",
  },
  Hab: {
    chapters: 3,
    themes: ["Keluhan nabi", "Iman", "Keadilan Allah", "Hidup oleh iman", "Nyanyian percaya"],
    outline: [
      "1: Keluhan tentang kejahatan",
      "2: Jawab Tuhan — orang benar hidup oleh iman",
      "3: Doa/nyanyian kepercayaan",
    ],
    notes:
      "Habakuk 2:4 menjadi pilar Paulus dan Reformasi: kebenaran karena iman.",
    deeper:
      "Dari “berapa lama, Tuhan?” sampai “aku akan bersorak” — iman belajar percaya di tengah ketidakmengertian.",
  },
  Zef: {
    chapters: 3,
    themes: ["Hari Tuhan", "Kerendahan hati", "Penghakiman", "Nyanyian sukacita", "Allah di tengahmu"],
    outline: [
      "1–2: Hari Tuhan atas Yehuda dan bangsa",
      "3: Pemulihan sisa umat yang rendah hati",
    ],
    notes:
      "Zefanya menjanjikan Allah yang berdiam di tengah umat dan bahkan “bersorak” karena mereka — gambar yang sangat personal.",
    deeper:
      "Penghakiman membersihkan; anugerah memulihkan sisa yang berlindung pada nama Tuhan.",
  },
  Hag: {
    chapters: 2,
    themes: ["Bangun bait", "Prioritas", "Kemuliaan kemudian", "Berkat", "Zerubabel"],
    outline: [
      "Teguran karena bait terbengkalai",
      "Janji kemuliaan yang lebih besar",
    ],
    notes:
      "Hagai mendorong komunitas pasca-pembuangan: jangan urus rumah sendiri sambil mengabaikan rumah Tuhan.",
    deeper:
      "Ketaatan praktis (membangun) menjadi saluran berkat — ibadah yang terlihat di prioritas.",
  },
  Za: {
    chapters: 14,
    themes: ["Penglihatan", "Mesias rendah hati", "Roh & pertobatan", "Hari Tuhan", "Raja atas bumi"],
    outline: [
      "1–8: Penglihatan malam",
      "9–14: Gembala, penusukan, dan kerajaan",
    ],
    notes:
      "Zakharia banyak dikutip di kisah Yesus (raja di atas keledai, tiga puluh keping, ditikam).",
    deeper:
      "Mesias datang bukan dengan kesombongan kekaisaran, melainkan dengan kerendahan yang menyelamatkan.",
  },
  Mal: {
    chapters: 4,
    themes: ["Ibadah asal-asalan", "Perjanjian", "Keadilan", "Elia yang akan datang", "Hari Tuhan"],
    outline: [
      "Tuduhan terhadap imam dan umat",
      "Janji utusan dan hari Tuhan",
    ],
    notes:
      "Malachi menutup PL dalam kanon Protestan dengan kerinduan akan Elia — dibaca PB sebagai Yohanes Pembaptis.",
    deeper:
      "Allah menuntut hati, bukan sisa-sisa korban. Pengharapan tetap: matahari keadilan akan terbit.",
  },
  Mat: {
    chapters: 28,
    themes: ["Kerajaan Surga", "Yesus Raja/Mesias", "Torat digenapi", "Murid", "Gereja"],
    outline: [
      "1–4: Kelahiran dan awal pelayanan",
      "5–7: Khotbah di Bukit",
      "8–20: Tanda, pengajaran, komunitas murid",
      "21–28: Minggu terakhir, salib, kebangkitan, amanat",
    ],
    notes:
      "Tradisi: Matius/Lewi. Ditulis dengan warna Yahudi yang kuat — Yesus sebagai penggenapan Kitab Suci.",
    deeper:
      "Injil ini membentuk murid: belajar, taat, dan pergi menjadikan segala bangsa murid.",
    sourceIds: [...DEFAULT_NT_SOURCE_IDS, "eusebius"],
  },
  Mrk: {
    chapters: 16,
    themes: ["Anak Allah", "Rahasia Mesias", "Jalan salib", "Pelayanan", "Percaya"],
    outline: [
      "1–8: Kuasa dan identitas Yesus",
      "8–10: Jalan menuju salib",
      "11–16: Yerusalem, kematian, kebangkitan",
    ],
    notes:
      "Tradisi: Markus dari Petrus. Injil terpendek, tempo cepat (“segera”), fokus pada salib.",
    deeper:
      "Mengikut Yesus berarti memikul salib — kemuliaan lewat penyerahan, bukan status.",
    sourceIds: [...DEFAULT_NT_SOURCE_IDS, "eusebius"],
  },
  Luk: {
    chapters: 24,
    themes: ["Keselamatan bagi semua", "Roh Kudus", "Orang miskin & tersisih", "Doa", "Sejarah keselamatan"],
    outline: [
      "1–2: Kelahiran",
      "3–9: Pelayanan di Galilea",
      "9–19: Perjalanan ke Yerusalem",
      "19–24: Salib dan kebangkitan",
    ],
    notes:
      "Lukas–Kisah satu karya. Lukas dokter/rekan Paulus menurut tradisi; menekankan kepastian sejarah (Luk 1:1–4).",
    deeper:
      "Yesus datang “mencari dan menyelamatkan yang hilang” — Injil yang luas dan penuh belas kasihan.",
    sourceIds: [...DEFAULT_NT_SOURCE_IDS, "eusebius"],
  },
  Yoh: {
    chapters: 21,
    themes: ["Firman jadi manusia", "Tanda", "Aku ada", "Percaya", "Hidup kekal"],
    outline: [
      "1–12: Kitab tanda",
      "13–17: Ruang atas",
      "18–21: Salib, kebangkitan, pemulihan Petrus",
    ],
    notes:
      "Tradisi: Yohanes rasul. Berbeda gaya dari sinoptik; teologi tinggi tentang inkarnasi dan iman.",
    deeper:
      "Ditulis “supaya kamu percaya… dan beroleh hidup” — Injil yang menggembala hati.",
    sourceIds: [...DEFAULT_NT_SOURCE_IDS, "eusebius"],
  },
  Kis: {
    chapters: 28,
    themes: ["Roh Kudus", "Kesaksian", "Gereja", "Misi ke bangsa", "Penolakan & pertumbuhan"],
    outline: [
      "1–7: Yerusalem",
      "8–12: Yudea–Samaria",
      "13–28: Sampai ujung bumi (Paulus)",
    ],
    notes:
      "Bukan biografi rasul lengkap, melainkan kisah Firman yang berjalan. Berakhir terbuka di Roma — misi belum selesai.",
    deeper:
      "Gereja lahir dari janji Roh: menjadi saksi, bukan oleh strategi manusia semata.",
  },
  Rom: {
    chapters: 16,
    themes: ["Injil", "Pembenaran", "Dosa", "Hidup baru", "Israel & bangsa-bangsa"],
    outline: [
      "1–4: Masalah dosa dan pembenaran karena iman",
      "5–8: Hasil pembenaran dan hidup dalam Roh",
      "9–11: Israel",
      "12–16: Hidup sebagai persembahan",
    ],
    notes:
      "Surat teologis Paulus yang paling sistematis. Sangat memengaruhi Agustinus, Reformasi, dan teologi injili.",
    deeper:
      "Dari “tidak ada yang benar” sampai “tidak ada penghukuman” — Injil yang membebaskan dan membentuk hidup.",
  },
  "1Ko": {
    chapters: 16,
    themes: ["Kesatuan", "Kekudusan", "Kasih", "Karunia", "Kebangkitan"],
    outline: [
      "1–4: Perpecahan dan hikmat salib",
      "5–11: Kekudusan jemaat & ibadah",
      "12–14: Karunia dan kasih",
      "15–16: Kebangkitan dan penutup",
    ],
    notes:
      "Jemaat urban yang berbakat namun kacau. Paulus menangani kasus konkret dengan teologi salib.",
    deeper:
      "Karunia tanpa kasih kosong; doktrin kebangkitan menopang seluruh pengharapan Kristen.",
  },
  "2Ko": {
    chapters: 13,
    themes: ["Pelayanan", "Kelemahan", "Penghiburan", "Kemurahan", "Otoritas rasuli"],
    outline: [
      "1–7: Pembelaan dan penghiburan",
      "8–9: Kolekte",
      "10–13: Otoritas dan kelemahan Paulus",
    ],
    notes:
      "Surat paling personal. Kekuatan Kristus sempurna dalam kelemahan — antitesis budaya status.",
    deeper:
      "Pelayanan sejati membawa kematian Yesus dalam tubuh, agar hidup Yesus tampak.",
  },
  Gal: {
    chapters: 6,
    themes: ["Injil murni", "Iman vs hukum", "Kebebasan", "Roh", "Salib"],
    outline: [
      "1–2: Injil Paulus dan konfrontasi",
      "3–4: Iman Abraham vs kutuk hukum",
      "5–6: Kebebasan yang melayani dalam kasih",
    ],
    notes:
      "Paulus marah karena Injil dicampur syarat sunat. Pembenaran karena iman adalah non-negotiable.",
    deeper:
      "Kristus membebaskan — jangan kembali ke perbudakan yang menyamar sebagai kesalehan.",
  },
  Ef: {
    chapters: 6,
    themes: ["Kesatuan dalam Kristus", "Anugerah", "Gereja", "Hidup baru", "Peperangan rohani"],
    outline: [
      "1–3: Identitas dan rencana Allah",
      "4–6: Hidup layak: gereja, rumah, peperangan",
    ],
    notes:
      "Apakah ditulis dari penjara untuk sirkulasi luas (“surat bundaran”) menjadi diskusi; isinya tetap megah secara kristologi dan eklesiologi.",
    deeper:
      "Dari pemilihan sorgawi sampai sepatu damai — Injil yang menata langit dan lantai dapur.",
  },
  Fil: {
    chapters: 4,
    themes: ["Sukacita", "Kerendahan Kristus", "Persekutuan", "Kepuasan", "Persatuan"],
    outline: [
      "1: Injil maju dalam penjara",
      "2: Nyanyian Kristus yang merendahkan diri",
      "3–4: Mengejar Kristus dan bersukacita",
    ],
    notes:
      "Ditulis dari penjara dengan nada sukacita. Filipi 2 menjadi pusat kristologi kerendahan.",
    deeper:
      "Sukacita Kristen bukan naif, melainkan berakar pada Kristus yang cukup.",
  },
  Kol: {
    chapters: 4,
    themes: ["Kristus yang unggul", "Penciptaan & penebusan", "Melawan syncretism", "Hidup baru"],
    outline: [
      "1–2: Keunggulan Kristus vs filsafat kosong",
      "3–4: Hidup yang dibangkitkan bersama Dia",
    ],
    notes:
      "Paulus menolak menambah Kristus dengan “aturan” dan kuasa-kuasa. Kristus cukup dan unggul.",
    deeper:
      "Jika Kristus adalah gambar Allah yang tidak kelihatan, jangan cari “plus-plus” di luar Dia.",
  },
  "1Te": {
    chapters: 5,
    themes: ["Kesucian", "Kasih", "Kedatangan Tuhan", "Penghiburan", "Kerja & hidup tenang"],
    outline: [
      "1–3: Syukur atas iman jemaat",
      "4–5: Hidup kudus dan pengharapan kedatangan",
    ],
    notes:
      "Termasuk surat paling awal. Menjawab kebingungan tentang orang percaya yang meninggal sebelum parousia.",
    deeper:
      "Pengharapan kedatangan Tuhan menghasilkan kekudusan dan penghiburan, bukan spekulasi takut-takutan.",
  },
  "2Te": {
    chapters: 3,
    themes: ["Hari Tuhan", "Penyesatan", "Ketekunan", "Kerja", "Damai"],
    outline: [
      "1: Penghakiman & kemuliaan",
      "2: Manusia durhaka",
      "3: Teguran bagi yang hidup tidak tertib",
    ],
    notes:
      "Meluruskan ajaran seolah hari Tuhan sudah tiba. Tetap bekerja dan jangan goyah.",
    deeper:
      "Ketenangan iman: tahu bahwa Tuhan menguasai akhir zaman, maka setialah hari ini.",
  },
  "1Ti": {
    chapters: 6,
    themes: ["Ajaran sehat", "Ibadah", "Kepemimpinan", "Kekudusan", "Harta"],
    outline: [
      "1: Lawan ajaran sesat",
      "2–3: Ibadah dan syarat penilik/diaken",
      "4–6: Pelayanan Timotius dan peringatan",
    ],
    notes:
      "Surat penggembalaan. Diskusi kepengarangan modern ada, tetapi gereja lama menerimanya sebagai Paulus kepada Timotius.",
    deeper:
      "Gereja butuh ajaran sehat dan karakter pemimpin — bukan hanya karisma.",
  },
  "2Ti": {
    chapters: 4,
    themes: ["Ketahanan", "Firman", "Warisan Injil", "Penderitaan", "Mahkota"],
    outline: [
      "1–2: Pelihara deposit Injil",
      "3–4: Firman di akhir zaman; pesan terakhir Paulus",
    ],
    notes:
      "Dianggap surat terakhir Paulus. Nada wasiat: setialah meski sendirian.",
    deeper:
      "Seluruh tulisan diilhamkan Allah — bekal bagi orang yang diperlengkapi untuk setiap perbuatan baik.",
  },
  Tit: {
    chapters: 3,
    themes: ["Ajaran sehat", "Perbuatan baik", "Anugerah", "Tata tertib jemaat"],
    outline: [
      "1: Penatua di Kreta",
      "2–3: Hidup yang menghias ajaran",
    ],
    notes:
      "Mirip 1 Timotius, lebih ringkas. Anugerah mendidik kita hidup bijak di dunia.",
    deeper:
      "Injil yang benar menghasilkan umat yang rajin berbuat baik — bukan legalisme, melainkan buah.",
  },
  Flm: {
    chapters: 1,
    themes: ["Pengampunan", "Persaudaraan", "Rekonsiliasi", "Kasih dalam praktik"],
    outline: ["Permohonan Paulus agar Onesimus diterima sebagai saudara"],
    notes:
      "Surat pribadi yang menantang struktur sosial dari dalam — melalui Injil, bukan manifesto politik.",
    deeper:
      "Di dalam Kristus, tuan dan budak bisa menjadi saudara — rekonsiliasi yang konkret.",
  },
  Ibr: {
    chapters: 13,
    themes: ["Kristus lebih unggul", "Imamat", "Perjanjian baru", "Iman", "Ketekunan"],
    outline: [
      "1–10: Kristus unggul atas nabi, malaikat, Musa, imamat, korban",
      "11–13: Iman para saksi dan hidup sebagai umat",
    ],
    notes:
      "Penulis anonim. Sangat mengandalkan PL untuk menjelaskan Yesus sebagai Imam/korban yang sempurna.",
    deeper:
      "Jangan kembali ke bayang-bayang; pegang Pengantara yang hidup — dan larilah dengan tekun.",
  },
  Yaa: {
    chapters: 5,
    themes: ["Iman & perbuatan", "Hikmat", "Lidah", "Kekayaan", "Doa"],
    outline: [
      "1: Cobaan dan firman",
      "2: Iman tanpa perbuatan",
      "3–4: Lidah dan kerendahan",
      "5: Kekayaan, sabar, doa",
    ],
    notes:
      "Yakobus “saudara Tuhan”. Bukan menolak Paulus, melainkan menolak iman yang hanya omongan.",
    deeper:
      "Iman yang menyelamatkan bekerja — seperti tubuh tanpa roh adalah mayat.",
  },
  "1Pe": {
    chapters: 5,
    themes: ["Pengharapan", "Penderitaan", "Kekudusan", "Gembala", "Identitas umat"],
    outline: [
      "1–2: Kelahiran baru dan hidup kudus",
      "3–4: Habis-habisan dalam kasih & penderitaan",
      "5: Gembala-gembala dan kerendahan",
    ],
    notes:
      "Ditulis kepada diaspora yang menderita. Identitas: “bangsa yang terpilih” di tanah asing.",
    deeper:
      "Penderitaan bukan kebetulan; itu jalur memurnikan pengharapan yang hidup.",
  },
  "2Pe": {
    chapters: 3,
    themes: ["Pengenalan Kristus", "Guru palsu", "Hari Tuhan", "Kekudusan menanti"],
    outline: [
      "1: Bertumbuh dalam pengenalan",
      "2: Penyesat",
      "3: Kedatangan hari Tuhan",
    ],
    notes:
      "Kepengarangan diperdebatkan lebih tajam di kalangan akademis; kanon gereja menerimanya sebagai peringatan akhir zaman yang pastoral.",
    deeper:
      "Sabar Tuhan adalah keselamatan — maka hiduplah kudus sambil menantikan langit dan bumi baru.",
  },
  "1Yo": {
    chapters: 5,
    themes: ["Persekutuan", "Terang", "Kasih", "Antikristus", "Kepastian"],
    outline: [
      "1–2: Terang dan pengakuan dosa",
      "3–4: Anak-anak Allah dan ujian roh",
      "5: Iman dan keyakinan",
    ],
    notes:
      "Melawan ajaran yang menyangkal inkarnasi. Tanda-tanda kehidupan: kebenaran, kasih, iman.",
    deeper:
      "Kita mengasihi karena Allah lebih dulu mengasihi — dan itu menjadi bukti kita tinggal di dalam Dia.",
  },
  "2Yo": {
    chapters: 1,
    themes: ["Kebenaran", "Kasih", "Waspada terhadap penyesat"],
    outline: ["Berjalan dalam kasih + kebenaran; jangan menyambut guru palsu"],
    notes:
      "Surat mini yang menyeimbangkan keramahtamahan dengan kewaspadaan doktrinal.",
    deeper:
      "Kasih Kristen tidak naif terhadap penyangkalan Kristus.",
  },
  "3Yo": {
    chapters: 1,
    themes: ["Keramahtamahan misi", "Keteladanan", "Otoritas yang sehat"],
    outline: ["Puji untuk Gayus; teguran untuk Diotrefes; Demetrius"],
    notes:
      "Potret konflik kepemimpinan lokal — relevan bagi gereja setiap zaman.",
    deeper:
      "Mendukung pekerja Injil adalah ikut serta dalam kebenaran.",
  },
  Yud: {
    chapters: 1,
    themes: ["Berjuang untuk iman", "Guru palsu", "Penghakiman", "Pemeliharaan Allah"],
    outline: ["Teguran tajam + doxology penutup yang indah"],
    notes:
      "Yudas memakai contoh PL dan tradisi Yahudi. Penutup: Allah sanggup menjaga kamu.",
    deeper:
      "Ketegasan terhadap penyesatan diimbangi keyakinan bahwa Allah memelihara orang kudus-Nya.",
  },
  Why: {
    chapters: 22,
    themes: ["Kemenangan Anak Domba", "Penyembahan", "Penghakiman", "Ketahanan", "Langit & bumi baru"],
    outline: [
      "1–3: Kristus di tengah tujuh jemaat",
      "4–16: Meterai, sangkakala, cawan — konflik kosmik",
      "17–22: Babel runtuh, pernikahan Anak Domba, ciptaan baru",
    ],
    notes:
      "Apokalips memakai simbol. Dibaca terutama sebagai pastoral untuk jemaat tertindas: tetap setia, Kristus menang — bukan spekulasi kalender.",
    deeper:
      "Dari Patmos sampai Yerusalem baru: sejarah menuju penyembahan, bukan kekacauan. Allah akan menyeka segala air mata.",
    sourceIds: [...DEFAULT_NT_SOURCE_IDS, "eusebius", "josephus"],
  },
};
