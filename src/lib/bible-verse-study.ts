/**
 * Cross-reference & tafsiran ringkas per ayat.
 * Dipakai panel studi in-page (tanpa pindah halaman).
 */

import { BIBLE_BOOKS, resolveBook } from "@/lib/bible-books";
import { getBibleBookIntro } from "@/lib/bible-book-intros";
import { getDevotionalStudyResources } from "@/lib/devotional-study-links";
import { formatPassageReference } from "@/lib/passage-parser";

export type StudyVerseRef = {
  bookAbbr: string;
  chapter: number;
  /** Ayat awal */
  verse: number;
  /** Ayat akhir (inklusif); default = verse */
  endVerse?: number;
};

export type CrossRefItem = {
  /** Referensi terkait */
  ref: StudyVerseRef;
  /** Label tema singkat */
  theme: string;
};

export type VerseCommentary = {
  /** Ringkasan tafsiran awam (Indonesia) */
  summary: string;
  /** Poin singkat tambahan */
  points?: string[];
};

function v(
  bookAbbr: string,
  chapter: number,
  verse: number,
  endVerse?: number,
): StudyVerseRef {
  return endVerse && endVerse !== verse
    ? { bookAbbr, chapter, verse, endVerse }
    : { bookAbbr, chapter, verse };
}

export function verseStudyKey(
  bookAbbr: string,
  chapter: number,
  verse: number,
) {
  return `${bookAbbr}.${chapter}:${verse}`;
}

export function chapterStudyKey(bookAbbr: string, chapter: number) {
  return `${bookAbbr}.${chapter}`;
}

/** Cross-ref per ayat (kunci: Abbr.pasal:ayat). */
const CROSS_REFS: Record<string, CrossRefItem[]> = {
  // —— Kejadian ——
  "Kej.1:1": [
    { ref: v("Yoh", 1, 1, 3), theme: "Firman & penciptaan" },
    { ref: v("Kol", 1, 16), theme: "Segala sesuatu oleh Kristus" },
    { ref: v("Ibr", 11, 3), theme: "Dunia dijadikan oleh firman" },
  ],
  "Kej.1:27": [
    { ref: v("Maz", 8, 4, 8), theme: "Manusia dimahkotai kemuliaan" },
    { ref: v("Mat", 19, 4), theme: "Yesus mengutip penciptaan" },
    { ref: v("Yaa", 3, 9), theme: "Gambar Allah" },
  ],
  "Kej.3:15": [
    { ref: v("Rom", 16, 20), theme: "Iblis akan dihancurkan" },
    { ref: v("Ibr", 2, 14), theme: "Kristus mengalahkan yang berkuasa atas maut" },
    { ref: v("Why", 12, 9), theme: "Naga si ular tua" },
  ],
  "Kej.12:1": [
    { ref: v("Ibr", 11, 8), theme: "Abraham berangkat dengan iman" },
    { ref: v("Kis", 7, 2, 3), theme: "Stefanus mengingat panggilan" },
    { ref: v("Gal", 3, 8), theme: "Injil diberitakan kepada Abraham" },
  ],
  "Kej.15:6": [
    { ref: v("Rom", 4, 3), theme: "Diperhitungkan sebagai kebenaran" },
    { ref: v("Gal", 3, 6), theme: "Anak-anak Abraham karena iman" },
    { ref: v("Yaa", 2, 23), theme: "Iman yang bekerja" },
  ],
  "Kej.22:8": [
    { ref: v("Yoh", 1, 29), theme: "Anak domba Allah" },
    { ref: v("Ibr", 11, 17, 19), theme: "Abraham mempersembahkan Ishak" },
    { ref: v("Rom", 8, 32), theme: "Allah menyerahkan Anak-Nya" },
  ],

  // —— Keluaran ——
  "Kel.3:14": [
    { ref: v("Yoh", 8, 58), theme: "Yesus: Aku ada" },
    { ref: v("Why", 1, 8), theme: "Yang Ada dan yang Sudah Ada" },
  ],
  "Kel.12:13": [
    { ref: v("1Ko", 5, 7), theme: "Kristus, Paskah kita" },
    { ref: v("Yoh", 1, 29), theme: "Anak domba Allah" },
    { ref: v("Ibr", 11, 28), theme: "Iman Musa soal Paskah" },
  ],
  "Kel.20:3": [
    { ref: v("Ul", 6, 4, 5), theme: "TUHAN itu esa" },
    { ref: v("Mat", 22, 37), theme: "Hukum yang terutama" },
    { ref: v("1Yo", 5, 21), theme: "Jauhkanlah dirimu dari berhala" },
  ],

  // —— Mazmur ——
  "Maz.1:1": [
    { ref: v("Yos", 1, 8), theme: "Renungkan Taurat siang malam" },
    { ref: v("Yer", 17, 7, 8), theme: "Seperti pohon di tepi air" },
    { ref: v("Mat", 7, 24), theme: "Mendirikan rumah di atas batu" },
  ],
  "Maz.23:1": [
    { ref: v("Yoh", 10, 11), theme: "Gembala yang baik" },
    { ref: v("Yeh", 34, 11, 16), theme: "Allah menggembalakan umat" },
    { ref: v("Ibr", 13, 20), theme: "Gembala Agung" },
  ],
  "Maz.51:10": [
    { ref: v("Yeh", 36, 26), theme: "Hati yang baru" },
    { ref: v("2Ko", 5, 17), theme: "Ciptaan baru" },
    { ref: v("1Yo", 1, 9), theme: "Pengampunan dosa" },
  ],
  "Maz.110:1": [
    { ref: v("Mat", 22, 44), theme: "Yesus mengutip mazmur ini" },
    { ref: v("Kis", 2, 34, 35), theme: "Petrus di Pentakosta" },
    { ref: v("Ibr", 1, 13), theme: "Lebih tinggi dari malaikat" },
  ],

  // —— Yesaya ——
  "Yes.7:14": [
    { ref: v("Mat", 1, 22, 23), theme: "Penggenapan Imanuel" },
    { ref: v("Luk", 1, 31), theme: "Kelahiran dari perawan" },
  ],
  "Yes.9:6": [
    { ref: v("Luk", 2, 11), theme: "Juruselamat dilahirkan" },
    { ref: v("Yoh", 1, 14), theme: "Firman menjadi manusia" },
  ],
  "Yes.40:31": [
    { ref: v("2Ko", 4, 16), theme: "Manusia batiniah dibaharui" },
    { ref: v("Fil", 4, 13), theme: "Segala perkara dalam Kristus" },
    { ref: v("Maz", 27, 14), theme: "Nantikanlah TUHAN" },
  ],
  "Yes.53:5": [
    { ref: v("1Pe", 2, 24), theme: "Oleh bilur-Nya kamu sembuh" },
    { ref: v("Mat", 8, 17), theme: "Ia menanggung kelemahan kita" },
    { ref: v("2Ko", 5, 21), theme: "Ia yang tidak mengenal dosa" },
    { ref: v("Rom", 5, 8), theme: "Kristus mati bagi kita" },
  ],

  // —— Yeremia ——
  "Yer.29:11": [
    { ref: v("Rom", 8, 28), theme: "Segala sesuatu untuk kebaikan" },
    { ref: v("Ams", 19, 21), theme: "Rancangan Tuhan yang tetap" },
    { ref: v("Fil", 1, 6), theme: "Ia yang memulai pekerjaan baik" },
  ],
  "Yer.31:31": [
    { ref: v("Luk", 22, 20), theme: "Perjanjian baru dalam darah-Nya" },
    { ref: v("Ibr", 8, 8, 12), theme: "Penggenapan perjanjian baru" },
    { ref: v("2Ko", 3, 6), theme: "Pelayan perjanjian baru" },
  ],

  // —— Matius ——
  "Mat.5:3": [
    { ref: v("Luk", 6, 20), theme: "Ucapan bahagia paralel" },
    { ref: v("Yes", 61, 1), theme: "Kabar baik bagi orang papa" },
    { ref: v("Yaa", 2, 5), theme: "Allah memilih orang miskin" },
  ],
  "Mat.5:44": [
    { ref: v("Luk", 6, 27, 28), theme: "Kasihilah musuhmu" },
    { ref: v("Rom", 12, 14, 21), theme: "Kalahkan kejahatan dengan kebaikan" },
    { ref: v("1Pe", 3, 9), theme: "Jangan membalas kejahatan" },
  ],
  "Mat.6:9": [
    { ref: v("Luk", 11, 2), theme: "Doa Bapa Kami (Lukas)" },
    { ref: v("Rom", 8, 15), theme: "Abba, ya Bapa" },
    { ref: v("Yoh", 17, 1), theme: "Yesus berdoa kepada Bapa" },
  ],
  "Mat.6:33": [
    { ref: v("Luk", 12, 31), theme: "Carilah Kerajaan-Nya" },
    { ref: v("Fil", 4, 6, 7), theme: "Janganlah kuatir" },
    { ref: v("1Pe", 5, 7), theme: "Serahkanlah kekhawatiranmu" },
  ],
  "Mat.11:28": [
    { ref: v("Yer", 6, 16), theme: "Temukan ketenangan bagi jiwamu" },
    { ref: v("Yoh", 7, 37), theme: "Siapa haus hendaklah datang" },
    { ref: v("Ibr", 4, 9, 11), theme: "Masuk ke perhentian Allah" },
  ],
  "Mat.16:16": [
    { ref: v("Yoh", 6, 68, 69), theme: "Pengakuan Petrus (Yohanes)" },
    { ref: v("Kis", 2, 36), theme: "Yesus adalah Tuhan dan Kristus" },
    { ref: v("1Yo", 4, 15), theme: "Mengaku Yesus Anak Allah" },
  ],
  "Mat.22:37": [
    { ref: v("Ul", 6, 5), theme: "Kasih kepada Tuhan" },
    { ref: v("Mrk", 12, 30), theme: "Paralel Markus" },
    { ref: v("1Yo", 4, 19), theme: "Kita mengasihi karena Ia lebih dulu" },
  ],
  "Mat.28:18": [
    { ref: v("Dan", 7, 14), theme: "Kuasa dan kerajaan diberikan" },
    { ref: v("Ef", 1, 20, 22), theme: "Kristus di atas segala sesuatu" },
    { ref: v("Fil", 2, 9, 11), theme: "Nama di atas segala nama" },
  ],
  "Mat.28:19": [
    { ref: v("Mrk", 16, 15), theme: "Pergilah ke seluruh dunia" },
    { ref: v("Kis", 1, 8), theme: "Kamu akan menjadi saksi-Ku" },
    { ref: v("2Ko", 5, 20), theme: "Utusan-utusan Kristus" },
  ],

  // —— Markus ——
  "Mrk.8:34": [
    { ref: v("Mat", 16, 24), theme: "Menyangkal diri" },
    { ref: v("Luk", 9, 23), theme: "Memikul salib setiap hari" },
    { ref: v("Gal", 2, 20), theme: "Aku telah disalibkan dengan Kristus" },
  ],
  "Mrk.10:45": [
    { ref: v("Mat", 20, 28), theme: "Datang untuk melayani" },
    { ref: v("Fil", 2, 5, 8), theme: "Kristus merendahkan diri" },
    { ref: v("1Ti", 2, 5, 6), theme: "Yang menyerahkan diri-Nya" },
  ],

  // —— Lukas ——
  "Luk.4:18": [
    { ref: v("Yes", 61, 1, 2), theme: "Nubuat yang dibaca Yesus" },
    { ref: v("Mat", 11, 5), theme: "Kabar baik bagi orang miskin" },
  ],
  "Luk.15:20": [
    { ref: v("Ef", 2, 4, 5), theme: "Kasih karunia yang besar" },
    { ref: v("2Ko", 5, 18, 19), theme: "Pelayanan pendamaian" },
    { ref: v("1Yo", 4, 9, 10), theme: "Kasih Allah dinyatakan" },
  ],
  "Luk.19:10": [
    { ref: v("Yeh", 34, 16), theme: "Mencari yang hilang" },
    { ref: v("1Ti", 1, 15), theme: "Kristus datang menyelamatkan orang berdosa" },
    { ref: v("Yoh", 3, 17), theme: "Bukan untuk menghakimi, melainkan menyelamatkan" },
  ],
  "Luk.24:27": [
    { ref: v("Yoh", 5, 39), theme: "Kitab Suci bersaksi tentang Aku" },
    { ref: v("Kis", 8, 35), theme: "Filipus memberitakan Yesus dari Kitab Suci" },
    { ref: v("1Ko", 15, 3, 4), theme: "Menurut Kitab Suci" },
  ],

  // —— Yohanes ——
  "Yoh.1:1": [
    { ref: v("Kej", 1, 1), theme: "Pada mulanya" },
    { ref: v("Kol", 1, 15, 17), theme: "Gambar Allah yang tidak kelihatan" },
    { ref: v("Ibr", 1, 1, 3), theme: "Allah berbicara oleh Anak" },
  ],
  "Yoh.1:14": [
    { ref: v("Fil", 2, 6, 8), theme: "Menjadi sama dengan manusia" },
    { ref: v("Ibr", 2, 14), theme: "Mengambil bagian dalam darah dan daging" },
    { ref: v("1Yo", 1, 1, 2), theme: "Firman hidup yang kami dengar" },
  ],
  "Yoh.3:3": [
    { ref: v("Yeh", 36, 26, 27), theme: "Hati baru & Roh" },
    { ref: v("Tit", 3, 5), theme: "Permandian kelahiran kembali" },
    { ref: v("1Pe", 1, 3), theme: "Dilahirkan kembali" },
  ],
  "Yoh.3:16": [
    { ref: v("Rom", 5, 8), theme: "Kasih Allah dinyatakan" },
    { ref: v("1Yo", 4, 9, 10), theme: "Allah mengutus Anak-Nya" },
    { ref: v("Ef", 2, 8, 9), theme: "Selamat oleh iman" },
    { ref: v("Yoh", 1, 12), theme: "Menjadi anak-anak Allah" },
  ],
  "Yoh.3:17": [
    { ref: v("Luk", 19, 10), theme: "Mencari dan menyelamatkan" },
    { ref: v("2Pe", 3, 9), theme: "Tidak menghendaki ada yang binasa" },
  ],
  "Yoh.8:12": [
    { ref: v("Yes", 9, 2), theme: "Terang bagi yang duduk dalam gelap" },
    { ref: v("Mat", 5, 14), theme: "Kamu adalah terang dunia" },
    { ref: v("1Yo", 1, 5, 7), theme: "Allah adalah terang" },
  ],
  "Yoh.10:10": [
    { ref: v("Yoh", 10, 11), theme: "Gembala yang baik" },
    { ref: v("Maz", 23, 1), theme: "TUHAN adalah gembalaku" },
    { ref: v("Kol", 3, 3, 4), theme: "Hidupmu tersembunyi bersama Kristus" },
  ],
  "Yoh.11:25": [
    { ref: v("1Ko", 15, 20, 22), theme: "Buah sulung kebangkitan" },
    { ref: v("1Te", 4, 14), theme: "Allah akan membawa bersama Dia" },
    { ref: v("Rom", 6, 4, 5), theme: "Dibangkitkan bersama Kristus" },
  ],
  "Yoh.14:1": [
    { ref: v("Yoh", 14, 27), theme: "Damai-Ku Kuberikan kepadamu" },
    { ref: v("Fil", 4, 6, 7), theme: "Damai Allah yang melampaui akal" },
    { ref: v("Yes", 26, 3), theme: "Damai bagi yang tetap hati" },
  ],
  "Yoh.14:6": [
    { ref: v("Kis", 4, 12), theme: "Tidak ada nama lain" },
    { ref: v("1Ti", 2, 5), theme: "Satu Pengantara" },
    { ref: v("Ibr", 10, 19, 20), theme: "Jalan yang baru dan yang hidup" },
  ],
  "Yoh.15:5": [
    { ref: v("Gal", 5, 22, 23), theme: "Buah Roh" },
    { ref: v("Maz", 1, 3), theme: "Berbuah pada musimnya" },
    { ref: v("Fil", 4, 13), theme: "Segala perkara dalam Dia" },
  ],
  "Yoh.20:21": [
    { ref: v("Mat", 28, 19), theme: "Amanat Agung" },
    { ref: v("Kis", 1, 8), theme: "Kuasa Roh Kudus" },
    { ref: v("2Ko", 5, 20), theme: "Menjadi utusan" },
  ],

  // —— Kisah ——
  "Kis.1:8": [
    { ref: v("Mat", 28, 19, 20), theme: "Amanat Agung" },
    { ref: v("Luk", 24, 48, 49), theme: "Saksi & kuasa dari atas" },
    { ref: v("Yoh", 15, 26, 27), theme: "Roh Kudus bersaksi" },
  ],
  "Kis.2:38": [
    { ref: v("Luk", 24, 47), theme: "Pertobatan dan pengampunan" },
    { ref: v("Rom", 6, 3, 4), theme: "Dibaptis dalam kematian-Nya" },
    { ref: v("Tit", 3, 5), theme: "Pembaharuan oleh Roh Kudus" },
  ],
  "Kis.4:12": [
    { ref: v("Yoh", 14, 6), theme: "Akulah jalan" },
    { ref: v("1Ti", 2, 5), theme: "Satu Pengantara" },
    { ref: v("Fil", 2, 9, 11), theme: "Nama di atas segala nama" },
  ],

  // —— Roma ——
  "Rom.1:16": [
    { ref: v("1Ko", 1, 18), theme: "Firman salib adalah kekuatan Allah" },
    { ref: v("2Ti", 1, 8), theme: "Jangan malu akan kesaksian" },
    { ref: v("Mrk", 8, 38), theme: "Jangan malu akan Aku" },
  ],
  "Rom.3:23": [
    { ref: v("Rom", 3, 24), theme: "Dibenarkan dengan cuma-cuma" },
    { ref: v("Pkh", 7, 20), theme: "Tidak ada orang benar" },
    { ref: v("1Yo", 1, 8), theme: "Jika kita berkata tidak berdosa" },
  ],
  "Rom.5:8": [
    { ref: v("Yoh", 3, 16), theme: "Allah mengasihi dunia" },
    { ref: v("Ef", 2, 4, 5), theme: "Karena kasih-Nya yang besar" },
    { ref: v("1Yo", 4, 10), theme: "Pendamaian bagi dosa kita" },
  ],
  "Rom.6:23": [
    { ref: v("Yeh", 18, 4), theme: "Jiwa yang berbuat dosa akan mati" },
    { ref: v("Yoh", 3, 16), theme: "Hidup yang kekal" },
    { ref: v("Ef", 2, 8, 9), theme: "Karunia Allah" },
  ],
  "Rom.8:1": [
    { ref: v("Yoh", 3, 18), theme: "Tidak dihukum" },
    { ref: v("Yoh", 5, 24), theme: "Telah berpindah dari maut ke hidup" },
    { ref: v("2Ko", 5, 17), theme: "Ciptaan baru" },
  ],
  "Rom.8:28": [
    { ref: v("Yer", 29, 11), theme: "Rancangan damai sejahtera" },
    { ref: v("Kej", 50, 20), theme: "Allah menjadikannya baik" },
    { ref: v("Yaa", 1, 2, 4), theme: "Pencobaan menghasilkan ketekunan" },
  ],
  "Rom.8:38": [
    { ref: v("Yoh", 10, 28, 29), theme: "Tidak ada yang merebut dari tangan Bapa" },
    { ref: v("Yud", 1, 24), theme: "Berkuasa menjaga kamu jangan jatuh" },
    { ref: v("2Ti", 1, 12), theme: "Ia berkuasa memelihara" },
  ],
  "Rom.12:1": [
    { ref: v("1Pe", 2, 5), theme: "Imamat kudus" },
    { ref: v("Ibr", 13, 15, 16), theme: "Persembahan pujian" },
    { ref: v("Fil", 1, 20, 21), theme: "Hidup yang berpadanan dengan Injil" },
  ],
  "Rom.12:2": [
    { ref: v("Ef", 4, 22, 24), theme: "Manusia baru" },
    { ref: v("Kol", 3, 1, 2), theme: "Pikirkanlah yang di atas" },
    { ref: v("2Ko", 3, 18), theme: "Diubah menjadi serupa dengan Dia" },
  ],

  // —— Korintus ——
  "1Ko.13:4": [
    { ref: v("1Yo", 4, 7, 8), theme: "Allah adalah kasih" },
    { ref: v("Gal", 5, 22), theme: "Buah Roh: kasih" },
    { ref: v("Kol", 3, 14), theme: "Kasih sebagai pengikat kesatuan" },
  ],
  "1Ko.15:3": [
    { ref: v("Yes", 53, 5, 6), theme: "Ia menanggung pelanggaran kita" },
    { ref: v("1Pe", 2, 24), theme: "Ia sendiri telah memikul dosa" },
    { ref: v("Rom", 5, 6, 8), theme: "Kristus mati bagi orang fasik" },
  ],
  "1Ko.15:58": [
    { ref: v("Gal", 6, 9), theme: "Jangan jemu berbuat baik" },
    { ref: v("Ibr", 6, 10), theme: "Allah tidak tidak adil" },
    { ref: v("2Ko", 4, 16, 18), theme: "Pandangan pada yang tidak kelihatan" },
  ],
  "2Ko.5:17": [
    { ref: v("Yoh", 3, 3), theme: "Lahir baru" },
    { ref: v("Ef", 4, 22, 24), theme: "Manusia baru" },
    { ref: v("Gal", 6, 15), theme: "Ciptaan baru" },
  ],
  "2Ko.12:9": [
    { ref: v("Fil", 4, 13), theme: "Kuasa Kristus" },
    { ref: v("Yes", 40, 29), theme: "Ia memberi kekuatan kepada yang lelah" },
    { ref: v("Ibr", 4, 16), theme: "Mendapat belas kasihan dan kasih karunia" },
  ],

  // —— Galatia / Efesus / Filipi ——
  "Gal.2:20": [
    { ref: v("Rom", 6, 6), theme: "Manusia lama disalibkan" },
    { ref: v("Kol", 3, 3), theme: "Hidup tersembunyi bersama Kristus" },
    { ref: v("Fil", 1, 21), theme: "Hidup adalah Kristus" },
  ],
  "Gal.5:22": [
    { ref: v("Yoh", 15, 5), theme: "Berbuah dalam Kristus" },
    { ref: v("Ef", 5, 9), theme: "Buah terang" },
    { ref: v("2Pe", 1, 5, 7), theme: "Tambahkan pada imanmu" },
  ],
  "Ef.2:8": [
    { ref: v("Rom", 3, 24), theme: "Kasih karunia" },
    { ref: v("Tit", 3, 5), theme: "Bukan karena perbuatan" },
    { ref: v("Yoh", 1, 12, 13), theme: "Dilahirkan dari Allah" },
  ],
  "Ef.6:11": [
    { ref: v("2Ko", 10, 4), theme: "Senjata peperangan rohani" },
    { ref: v("1Pe", 5, 8, 9), theme: "Lawannya dengan iman" },
    { ref: v("Yaa", 4, 7), theme: "Tunduk kepada Allah, lawan Iblis" },
  ],
  "Fil.4:6": [
    { ref: v("Mat", 6, 25, 34), theme: "Janganlah kuatir" },
    { ref: v("1Pe", 5, 7), theme: "Serahkan kekhawatiran" },
    { ref: v("Maz", 55, 22), theme: "Serahkanlah kepada TUHAN" },
  ],
  "Fil.4:13": [
    { ref: v("2Ko", 12, 9), theme: "Kuasa dalam kelemahan" },
    { ref: v("Yoh", 15, 5), theme: "Di luar Aku kamu tidak dapat berbuat apa-apa" },
    { ref: v("Yes", 41, 10), theme: "Jangan takut, Aku menyertai engkau" },
  ],

  // —— Ibrani / Yakobus / Petrus / Yohanes ——
  "Ibr.4:12": [
    { ref: v("Yes", 55, 11), theme: "Firman tidak kembali dengan sia-sia" },
    { ref: v("2Ti", 3, 16, 17), theme: "Seluruh tulisan diilhamkan" },
    { ref: v("Yer", 23, 29), theme: "Firman seperti api" },
  ],
  "Ibr.11:1": [
    { ref: v("2Ko", 5, 7), theme: "Hidup berdasarkan iman" },
    { ref: v("Rom", 8, 24, 25), theme: "Pengharapan" },
    { ref: v("Yaa", 2, 17), theme: "Iman tanpa perbuatan adalah mati" },
  ],
  "Ibr.12:1": [
    { ref: v("1Ko", 9, 24, 27), theme: "Berlari dalam pertandingan" },
    { ref: v("Fil", 3, 13, 14), theme: "Menuju tujuan" },
    { ref: v("2Ti", 4, 7), theme: "Pertandingan yang baik" },
  ],
  "Yaa.1:2": [
    { ref: v("Rom", 5, 3, 5), theme: "Kesengsaraan menghasilkan ketekunan" },
    { ref: v("1Pe", 1, 6, 7), theme: "Ujian iman" },
    { ref: v("Ibr", 12, 11), theme: "Didikan menghasilkan damai" },
  ],
  "Yaa.1:5": [
    { ref: v("Pnh", 2, 6), theme: "TUHAN memberi hikmat" },
    { ref: v("Mat", 7, 7), theme: "Mintalah, maka akan diberikan" },
    { ref: v("Kol", 1, 9), theme: "Penuh dengan pengetahuan kehendak-Nya" },
  ],
  "1Pe.5:7": [
    { ref: v("Maz", 55, 22), theme: "Serahkanlah kepada TUHAN" },
    { ref: v("Mat", 6, 25), theme: "Jangan kuatir" },
    { ref: v("Fil", 4, 6), theme: "Sampaikan dalam doa" },
  ],
  "1Yo.1:9": [
    { ref: v("Maz", 32, 5), theme: "Mengaku dosa" },
    { ref: v("Pnh", 28, 13), theme: "Yang mengakui akan beroleh belas kasihan" },
    { ref: v("Yaa", 5, 16), theme: "Mengaku dosa seorang kepada yang lain" },
  ],
  "1Yo.4:7": [
    { ref: v("Yoh", 13, 34, 35), theme: "Saling mengasihi" },
    { ref: v("1Ko", 13, 1, 7), theme: "Kasih yang terbesar" },
    { ref: v("Yoh", 15, 12), theme: "Kasihilah kamu akan sesamamu" },
  ],

  // —— Wahyu ——
  "Why.3:20": [
    { ref: v("Yoh", 14, 23), theme: "Kami akan datang kepadanya" },
    { ref: v("Kid", 5, 2), theme: "Suara kekasih yang mengetuk" },
    { ref: v("Luk", 12, 36), theme: "Menanti tuan yang pulang" },
  ],
  "Why.21:4": [
    { ref: v("Yes", 25, 8), theme: "Ia akan menghapus air mata" },
    { ref: v("Yes", 35, 10), theme: "Kesedihan dan keluh kesah melarikan diri" },
    { ref: v("1Ko", 15, 54), theme: "Maut ditelan dalam kemenangan" },
  ],
};

/** Tafsiran ringkas per ayat. */
const COMMENTARY: Record<string, VerseCommentary> = {
  "Kej.1:1": {
    summary:
      "Alkitab dibuka dengan Allah sebagai Pencipta — bukan alam yang kekal, melainkan Allah yang berfirman. Segala sesuatu bermula dari-Nya, sehingga hidup manusia punya asal, makna, dan tujuan di hadapan-Nya.",
    points: [
      "Allah ada sebelum segala sesuatu.",
      "Penciptaan adalah karya firman, bukan kebetulan.",
    ],
  },
  "Kej.12:1": {
    summary:
      "Panggilan Abraham menandai awal sejarah keselamatan yang khusus: Allah memilih satu keluarga agar berkat-Nya sampai ke semua bangsa. Iman dimulai dengan ketaatan yang keluar dari zona nyaman.",
  },
  "Kej.15:6": {
    summary:
      "Kebenaran Abraham bukan dari prestasi, melainkan dari percaya kepada janji Allah. Ayat ini menjadi fondasi Paulus soal pembenaran oleh iman.",
  },
  "Maz.23:1": {
    summary:
      "Gambar gembala mengungkapkan pemeliharaan pribadi: Tuhan bukan hanya “ada”, melainkan memimpin, melindungi, dan mencukupi. Ketenangan umat lahir dari siapa yang menggembalakan, bukan dari keadaan.",
  },
  "Yes.53:5": {
    summary:
      "Hamba Tuhan menanggung hukuman yang seharusnya menimpa kita. Penderitaan-Nya bersifat menggantikan — bilur-Nya menjadi jalan kesembuhan dan pendamaian.",
    points: [
      "Dosa punya upah; Kristus menanggungnya.",
      "Penggenapan penuh tampak di salib.",
    ],
  },
  "Yer.29:11": {
    summary:
      "Janji ini diberikan kepada umat dalam pembuangan: masa depan ada di tangan Allah, bukan di tangan keadaan. Rancangan-Nya membawa pengharapan, tetapi tetap menuntut kesetiaan di tempat pengasingan.",
  },
  "Mat.5:3": {
    summary:
      "Ucapan bahagia membalik nilai dunia: yang “berbahagia” adalah yang miskin di hadapan Allah — sadar butuh anugerah. Kerajaan Surga terbuka bagi yang kosong tangan, bukan bagi yang merasa cukup.",
  },
  "Mat.6:33": {
    summary:
      "Yesus mengalihkan pusat kekhawatiran: carilah dulu pemerintahan Allah dan kebenaran-Nya. Prioritas ini bukan mengabaikan kebutuhan, melainkan menempatkannya di bawah pemeliharaan Bapa.",
  },
  "Mat.11:28": {
    summary:
      "Undangan Yesus ditujukan kepada yang lelah dan berbeban berat. Perhentian yang Ia tawarkan bukan pelarian dari tanggung jawab, melainkan kelegaan karena belajar dari-Nya yang lemah lembut.",
  },
  "Mat.28:19": {
    summary:
      "Amanat Agung lahir dari otoritas Yesus yang bangkit. Murid-murid diutus membuat murid dari segala bangsa — bukan sekadar “mengajak ke acara”, melainkan membaptis dan mengajar ketaatan.",
  },
  "Yoh.1:1": {
    summary:
      "Yohanes menempatkan Yesus dalam kekekalan Allah: Firman itu bersama Allah dan adalah Allah. Iman Kristen bukan hanya soal guru moral, melainkan soal Allah yang datang dalam sejarah.",
  },
  "Yoh.1:14": {
    summary:
      "Inkarnasi: Firman yang kekal “menjadi daging” dan berdiam di antara kita. Kemuliaan Allah sekarang terlihat dalam manusia Yesus — penuh kasih karunia dan kebenaran.",
  },
  "Yoh.3:16": {
    summary:
      "Inti Injil dalam satu kalimat: kasih Allah yang memberi, Anak yang dikorbankan, dan hidup kekal bagi yang percaya. Keselamatan bersifat personal (siapa pun yang percaya) dan sekaligus universal dalam tawaran-Nya.",
    points: [
      "Motif: kasih Allah.",
      "Cara: pemberian Anak.",
      "Hasil: hidup kekal, bukan kebinasaan.",
    ],
  },
  "Yoh.3:3": {
    summary:
      "Masuk Kerajaan Allah membutuhkan kelahiran baru — karya Roh, bukan perbaikan moral semata. Nikodemus diajak melihat bahwa status agama tidak cukup tanpa pembaharuan dari atas.",
  },
  "Yoh.10:10": {
    summary:
      "Yesus membedakan pencuri yang merampas dengan Gembala yang memberi hidup. Hidup yang dimaksud bukan sekadar “bernapas”, melainkan hidup yang penuh dalam persekutuan dengan-Nya.",
  },
  "Yoh.14:6": {
    summary:
      "Yesus tidak hanya menunjukkan jalan; Ia adalah jalan, kebenaran, dan hidup. Akses kepada Bapa bersifat eksklusif melalui Dia — bukan karena kesempitan, melainkan karena hanya Dia yang mendamaikan.",
  },
  "Yoh.15:5": {
    summary:
      "Gambar pokok anggur menekankan ketergantungan: buah rohani lahir dari tinggal dalam Kristus. Tanpa Dia, usaha rohani kehilangan sumber hidupnya.",
  },
  "Kis.1:8": {
    summary:
      "Misi gereja ditopang kuasa Roh Kudus. Kesaksian bergerak dari Yerusalem ke ujung bumi — pola yang tetap relevan: mulai dari tempatmu, lalu meluas.",
  },
  "Kis.2:38": {
    summary:
      "Petrus memanggil pertobatan dan baptisan sebagai respons terhadap Injil. Pengampunan dosa dan karunia Roh Kudus adalah janji bagi yang merespons panggilan itu.",
  },
  "Rom.3:23": {
    summary:
      "Paulus meratakan semua manusia di bawah dosa: tidak ada yang terkecuali. Kebutuhan akan anugerah bersifat universal, sehingga Injil menjadi kabar baik bagi semua.",
  },
  "Rom.5:8": {
    summary:
      "Kasih Allah tidak menunggu kita layak. Kristus mati bagi kita ketika kita masih berdosa — itulah ukuran kasih yang aktif dan mengorbankan diri.",
  },
  "Rom.6:23": {
    summary:
      "Kontras tajam: upah dosa adalah maut; karunia Allah adalah hidup kekal dalam Kristus. Keselamatan adalah pemberian, bukan gaji yang kita hasilkan.",
  },
  "Rom.8:1": {
    summary:
      "Bagi yang ada di dalam Kristus tidak ada penghukuman. Status baru ini membebaskan orang percaya dari tuduhan dosa, sekaligus membuka hidup menurut Roh.",
  },
  "Rom.8:28": {
    summary:
      "Allah bekerja dalam segala sesuatu bagi mereka yang mengasihi Dia — bukan berarti semua kejadian baik, melainkan bahwa Ia mampu mengarahkan bahkan yang pahit menuju maksud-Nya yang baik.",
  },
  "Rom.12:1": {
    summary:
      "Ibadah yang sejati adalah mempersembahkan tubuh — seluruh hidup — sebagai respons atas belas kasihan Allah. Teologi di pasal sebelumnya menjadi etika yang hidup.",
  },
  "Rom.12:2": {
    summary:
      "Pembaharuan akal budi menolak dicetak oleh dunia. Kehendak Allah dikenali semakin jelas ketika pikiran diubah oleh Injil.",
  },
  "1Ko.13:4": {
    summary:
      "Kasih digambarkan bukan sebagai perasaan semata, melainkan karakter yang sabar dan murah hati. Tanpa kasih, karunia rohani kehilangan nilainya.",
  },
  "1Ko.15:3": {
    summary:
      "Inti Injil yang Paulus terima dan sampaikan: Kristus mati karena dosa-dosa kita menurut Kitab Suci. Ini fondasi iman yang tidak boleh digeser.",
  },
  "2Ko.5:17": {
    summary:
      "Dalam Kristus seseorang menjadi ciptaan baru. Identitas lama diganti; hidup yang baru adalah karya Allah, bukan sekadar resolusi manusia.",
  },
  "2Ko.12:9": {
    summary:
      "Jawaban Tuhan atas kelemahan Paulus: kasih karunia cukup, dan kuasa menjadi sempurna dalam kelemahan. Boasting Kristen bukan pada kekuatan sendiri.",
  },
  "Gal.2:20": {
    summary:
      "Hidup orang percaya adalah hidup Kristus di dalam kita. Salib mengakhiri pemerintahan ego; iman membuka ruang bagi Anak Allah yang mengasihi kita.",
  },
  "Gal.5:22": {
    summary:
      "Buah Roh adalah karakter yang ditumbuhkan Roh Kudus — bukan daftar prestasi. Kasih menjadi yang pertama karena merangkum semuanya.",
  },
  "Ef.2:8": {
    summary:
      "Keselamatan adalah kasih karunia melalui iman — pemberian Allah, bukan hasil usaha. Karena itu tidak ada tempat bagi kesombongan rohani.",
  },
  "Ef.6:11": {
    summary:
      "Peperangan orang percaya bersifat rohani. Perlengkapan senjata Allah menekankan ketergantungan pada kebenaran, iman, dan firman — bukan pada tipu daya manusia.",
  },
  "Fil.4:6": {
    summary:
      "Kekhawatiran diganti dengan doa yang bersyukur. Damai Allah menjaga hati dan pikiran ketika beban diserahkan kepada-Nya.",
  },
  "Fil.4:13": {
    summary:
      "“Segala perkara” di sini bukan janji sukses duniawi, melainkan kemampuan bertahan dan taat dalam segala keadaan oleh kekuatan Kristus.",
  },
  "Ibr.4:12": {
    summary:
      "Firman Allah hidup dan tajam — menembus motivasi terdalam. Membaca Alkitab bukan hanya menambah informasi, melainkan diperiksa oleh Allah.",
  },
  "Ibr.11:1": {
    summary:
      "Iman memberi kepastian tentang apa yang diharapkan dan keyakinan tentang yang tidak kelihatan. Iman bukan kabut; iman berpijak pada karakter Allah yang berjanji.",
  },
  "Yaa.1:2": {
    summary:
      "Sukacita di tengah pencobaan bukan menyangkal rasa sakit, melainkan melihat hasilnya: ketekunan yang membentuk kedewasaan iman.",
  },
  "Yaa.1:5": {
    summary:
      "Allah memberi hikmat dengan murah hati kepada yang meminta dengan iman. Kekurangan pengertian boleh dibawa kepada-Nya dalam doa.",
  },
  "1Pe.5:7": {
    summary:
      "Serahkan kekhawatiran karena Ia peduli. Kepercayaan ini personal: Allah bukan penonton dingin, melainkan Bapa yang memperhatikan.",
  },
  "1Yo.1:9": {
    summary:
      "Pengakuan dosa membuka pintu pengampunan dan penyucian. Kesetiaan Allah menjadi dasar, bukan perasaan kita yang naik-turun.",
  },
  "1Yo.4:7": {
    summary:
      "Mengasihi sesama adalah tanda kelahiran dari Allah, karena kasih berasal dari diri-Nya. Teologi “Allah adalah kasih” menjadi etika komunitas.",
  },
  "Why.3:20": {
    summary:
      "Yesus mengetuk pintu jemaat yang suam-suam kuku. Persekutuan dipulihkan ketika pintu dibuka — undangan yang personal dan mendesak.",
  },
  "Why.21:4": {
    summary:
      "Pengharapan akhir: Allah menghapus air mata, maut, dan penderitaan. Sejarah tidak berakhir dalam kekacauan, melainkan dalam pemulihan total bersama Allah.",
  },
};

/** Catatan pasal (fallback jika ayat belum punya tafsiran khusus). */
const CHAPTER_NOTES: Record<string, string> = {
  "Kej.1":
    "Pasal penciptaan menekankan Allah yang berfirman dan menyatakan yang baik. Manusia ditempatkan sebagai gambar Allah dengan tanggung jawab merawat ciptaan.",
  "Kej.3":
    "Kejatuhan menjelaskan masuknya dosa, rasa malu, dan keterputusan. Namun janji di 3:15 sudah menunjuk harapan pemulihan.",
  "Kel.20":
    "Sepuluh Hukum membentuk kehidupan umat perjanjian: mengasihi Allah dan sesama dalam kerangka kekudusan.",
  "Maz.23":
    "Mazmur gembala menenangkan jiwa dengan pemeliharaan Tuhan di padang rumput maupun di lembah kekelaman.",
  "Yes.53":
    "Nyanyian Hamba yang menderita: kebenaran diganti, yang bersalah dipulihkan melalui pengorbanan Hamba Tuhan.",
  "Mat.5":
    "Khotbah di Bukit membuka karakter warga Kerajaan: rendah hati, lapar akan kebenaran, dan kasih yang melampaui pembalasan.",
  "Mat.6":
    "Yesus mengajar soal doa, puasa, dan kekhawatiran — hidup di hadapan Bapa yang melihat yang tersembunyi.",
  "Mat.28":
    "Kebangkitan mengutus murid: otoritas Kristus menjadi dasar misi ke segala bangsa.",
  "Yoh.1":
    "Prolog Yohanes menyatakan identitas Yesus sebagai Firman, terang, dan Anak Tunggal yang menyatakan Bapa.",
  "Yoh.3":
    "Percakapan dengan Nikodemus: lahir baru, percaya kepada Anak, dan kasih Allah yang menyelamatkan dunia.",
  "Yoh.14":
    "Penghiburan menjelang salib: Yesus adalah jalan kepada Bapa, dan Ia menjanjikan Roh Kudus serta damai.",
  "Yoh.15":
    "Pokok anggur yang benar: tinggal dalam Kristus menghasilkan buah; di luar Dia tidak ada kehidupan rohani yang sejati.",
  "Kis.2":
    "Pentakosta: Roh Kudus dicurahkan, Injil diberitakan, dan jemaat mula-mula lahir dalam pertobatan serta persekutuan.",
  "Rom.3":
    "Semua orang berdosa dan kehilangan kemuliaan Allah; pembenaran diberikan melalui iman dalam Kristus.",
  "Rom.5":
    "Damai dengan Allah, kasih yang dicurahkan, dan Kristus sebagai Adam terakhir yang membawa hidup.",
  "Rom.8":
    "Hidup oleh Roh: tidak ada penghukuman, anak-anak Allah, dan kasih Kristus yang tidak terpisahkan.",
  "Rom.12":
    "Dari doktrin ke praktik: persembahan tubuh, pembaharuan pikiran, dan hidup saling mengasihi dalam tubuh Kristus.",
  "1Ko.13":
    "Kasih adalah jalan yang lebih utama daripada karunia yang mengesankan tanpa karakter.",
  "1Ko.15":
    "Kebangkitan Kristus adalah pusat Injil dan jaminan kebangkitan orang percaya.",
  "Ef.2":
    "Dari mati dalam dosa kepada hidup bersama Kristus — keselamatan anugerah yang menciptakan umat baru.",
  "Fil.4":
    "Sukacita, doa menggantikan kuatir, dan kekuatan Kristus dalam segala keadaan.",
  "Ibr.11":
    "Daftar saksi iman: orang-orang yang percaya kepada janji Allah meski belum melihat penggenapannya sepenuhnya.",
  "Why.21":
    "Langit dan bumi yang baru: Allah diam bersama manusia; air mata dan maut lenyap.",
};

export type ResolvedCrossRef = CrossRefItem & {
  id: string;
  label: string;
  passageLabel: string;
};

export type ResolvedCommentary = {
  summary: string;
  points: string[];
  source: "verse" | "chapter" | "book";
  citation: string;
};

function bookNameFromAbbr(abbr: string) {
  return BIBLE_BOOKS.find((book) => book.abbr === abbr)?.name ?? abbr;
}

export function formatStudyRefLabel(ref: StudyVerseRef) {
  const name = bookNameFromAbbr(ref.bookAbbr);
  const end = ref.endVerse ?? ref.verse;
  return formatPassageReference(name, ref.chapter, ref.verse, end);
}

export function formatStudyPassageLabel(ref: StudyVerseRef) {
  return `${bookNameFromAbbr(ref.bookAbbr)} ${ref.chapter}`;
}

function sameRef(a: StudyVerseRef, b: StudyVerseRef) {
  const aEnd = a.endVerse ?? a.verse;
  const bEnd = b.endVerse ?? b.verse;
  return (
    a.bookAbbr === b.bookAbbr &&
    a.chapter === b.chapter &&
    a.verse === b.verse &&
    aEnd === bEnd
  );
}

function overlapsSelection(ref: StudyVerseRef, selected: StudyVerseRef[]) {
  return selected.some((item) => {
    if (item.bookAbbr !== ref.bookAbbr || item.chapter !== ref.chapter) {
      return false;
    }
    const refEnd = ref.endVerse ?? ref.verse;
    const itemEnd = item.endVerse ?? item.verse;
    return ref.verse <= itemEnd && refEnd >= item.verse;
  });
}

/** Ambil cross-ref untuk satu atau beberapa ayat yang dipilih. */
export function getCrossRefsForSelection(
  bookAbbr: string,
  selected: Array<{ chapter: number; verse: number }>,
  limit = 12,
): ResolvedCrossRef[] {
  if (!bookAbbr || selected.length === 0) return [];

  const selectedRefs: StudyVerseRef[] = selected.map((item) =>
    v(bookAbbr, item.chapter, item.verse),
  );

  const seen = new Set<string>();
  const out: ResolvedCrossRef[] = [];

  const pushItems = (items: CrossRefItem[] | undefined) => {
    if (!items) return;
    for (const item of items) {
      if (overlapsSelection(item.ref, selectedRefs)) continue;
      const id = `${item.ref.bookAbbr}.${item.ref.chapter}:${item.ref.verse}-${item.ref.endVerse ?? item.ref.verse}:${item.theme}`;
      if (seen.has(id)) continue;
      seen.add(id);
      out.push({
        ...item,
        id,
        label: formatStudyRefLabel(item.ref),
        passageLabel: formatStudyPassageLabel(item.ref),
      });
      if (out.length >= limit) return;
    }
  };

  for (const item of selected) {
    pushItems(CROSS_REFS[verseStudyKey(bookAbbr, item.chapter, item.verse)]);
    if (out.length >= limit) break;
  }

  // Perluas ±1 ayat di pasal yang sama bila masih jarang
  if (out.length < 4) {
    for (const item of selected) {
      for (const offset of [-1, 1, -2, 2]) {
        const verse = item.verse + offset;
        if (verse < 1) continue;
        pushItems(CROSS_REFS[verseStudyKey(bookAbbr, item.chapter, verse)]);
        if (out.length >= limit) break;
      }
      if (out.length >= limit) break;
    }
  }

  return out;
}

export function getCommentaryForSelection(
  bookAbbr: string,
  selected: Array<{ chapter: number; verse: number }>,
): ResolvedCommentary | null {
  if (!bookAbbr || selected.length === 0) return null;

  const sorted = [...selected].sort((a, b) =>
    a.chapter === b.chapter ? a.verse - b.verse : a.chapter - b.chapter,
  );
  const primary = sorted[0]!;

  for (const item of sorted) {
    const hit = COMMENTARY[verseStudyKey(bookAbbr, item.chapter, item.verse)];
    if (hit) {
      return {
        summary: hit.summary,
        points: hit.points ?? [],
        source: "verse",
        citation: formatStudyRefLabel(v(bookAbbr, item.chapter, item.verse)),
      };
    }
  }

  // Coba ayat tetangga dekat
  for (const offset of [-1, 1, -2, 2]) {
    const verse = primary.verse + offset;
    if (verse < 1) continue;
    const hit = COMMENTARY[verseStudyKey(bookAbbr, primary.chapter, verse)];
    if (hit) {
      return {
        summary: hit.summary,
        points: hit.points ?? [],
        source: "verse",
        citation: formatStudyRefLabel(v(bookAbbr, primary.chapter, verse)),
      };
    }
  }

  const chapterNote =
    CHAPTER_NOTES[chapterStudyKey(bookAbbr, primary.chapter)];
  if (chapterNote) {
    return {
      summary: chapterNote,
      points: [],
      source: "chapter",
      citation: `${bookNameFromAbbr(bookAbbr)} ${primary.chapter}`,
    };
  }

  const intro = getBibleBookIntro(bookAbbr);
  if (intro) {
    return {
      summary: `${intro.summary} Baca ayat ini dalam terang tema kitab: ${intro.why}`,
      points: [],
      source: "book",
      citation: bookNameFromAbbr(bookAbbr),
    };
  }

  return null;
}

export function getStudyExternalLinks(passageLabel: string) {
  return getDevotionalStudyResources(passageLabel);
}

export function resolveBookAbbrFromName(bookName: string | undefined) {
  if (!bookName?.trim()) return null;
  return resolveBook(bookName)?.abbr ?? null;
}

export function refsEqual(a: StudyVerseRef, b: StudyVerseRef) {
  return sameRef(a, b);
}
