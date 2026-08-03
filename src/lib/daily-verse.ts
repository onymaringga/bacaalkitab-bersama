import { getTodayKey } from "@/lib/reading-status";

export type DailyVerse = {
  reference: string;
  text: string;
};

/** Kutipan TB (ringkas) — dipilih stabil per hari kalender. */
const DAILY_VERSES: DailyVerse[] = [
  {
    reference: "Mazmur 119:105",
    text: "Firman-Mu itu pelita bagi kakiku dan terang bagi jalanku.",
  },
  {
    reference: "Yeremia 29:11",
    text: "Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman Tuhan, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan.",
  },
  {
    reference: "Amsal 3:5-6",
    text: "Percayalah kepada Tuhan dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri. Akuilah Dia dalam segala lakumu, maka Ia akan meluruskan jalanmu.",
  },
  {
    reference: "Yesaya 41:10",
    text: "Janganlah takut, sebab Aku menyertai engkau, janganlah bimbang, sebab Aku ini Allahmu; Aku akan meneguhkan, bahkan akan menolong engkau.",
  },
  {
    reference: "Filipi 4:13",
    text: "Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.",
  },
  {
    reference: "Yohanes 14:27",
    text: "Damai sejahtera Kutinggalkan bagimu. Damai sejahtera-Ku Kuberikan kepadamu, dan apa yang Kuberikan tidak seperti yang diberikan dunia kepadamu. Janganlah gelisah hatimu dan janganlah takut!",
  },
  {
    reference: "Mazmur 46:2",
    text: "Allah itu bagi kita tempat perlindungan dan kekuatan, sebagai penolong dalam kesesakan sangat terbukti.",
  },
  {
    reference: "Matius 11:28",
    text: "Marilah kepada-Ku, semua yang letih lesu dan berbeban berat, Aku akan memberi kelegaan kepadamu.",
  },
  {
    reference: "Roma 8:28",
    text: "Kita tahu sekarang, bahwa Allah turut bekerja dalam segala sesuatu untuk mendatangkan kebaikan bagi mereka yang mengasihi Dia, yaitu bagi mereka yang terpanggil sesuai dengan rencana Allah.",
  },
  {
    reference: "2 Korintus 5:7",
    text: "Sebab hidup kami ini adalah hidup karena percaya, bukan karena melihat.",
  },
  {
    reference: "Mazmur 23:1",
    text: "Tuhan adalah gembalaku, takkan kekurangan aku.",
  },
  {
    reference: "Yohanes 3:16",
    text: "Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.",
  },
  {
    reference: "Yosua 1:9",
    text: "Bukankah telah Kuperintahkan kepadamu: kuatkan dan teguhkanlah hatimu? Janganlah kecut dan tawar hati, sebab Tuhan, Allahmu, menyertai engkau, ke mana pun engkau pergi.",
  },
  {
    reference: "Mazmur 37:5",
    text: "Serahkanlah hidupmu kepada Tuhan dan percayalah kepada-Nya, dan Ia akan bertindak.",
  },
  {
    reference: "Yesaya 40:31",
    text: "Tetapi orang-orang yang menanti-nantikan Tuhan mendapat kekuatan baru: mereka seumpama rajawali yang naik terbang dengan kekuatan sayapnya; mereka berlari dan tidak menjadi lesu, mereka berjalan dan tidak menjadi payah.",
  },
  {
    reference: "Kolose 3:23",
    text: "Apa pun juga yang kamu perbuat, perbuatlah dengan segenap hatimu seperti untuk Tuhan dan bukan untuk manusia.",
  },
  {
    reference: "Mazmur 34:9",
    text: "Cobalah dan lihatlah, betapa baiknya Tuhan itu! Berbahagialah orang yang berlindung pada-Nya!",
  },
  {
    reference: "1 Petrus 5:7",
    text: "Serahkanlah segala kekhawatiranmu kepada-Nya, sebab Ia yang memelihara kamu.",
  },
  {
    reference: "Yohanes 16:33",
    text: "Semuanya itu Kukatakan kepadamu, supaya kamu beroleh damai sejahtera dalam Aku. Dalam dunia kamu menderita penganiayaan, tetapi kuatkanlah hatimu: Aku telah mengalahkan dunia!",
  },
  {
    reference: "Mazmur 27:1",
    text: "Tuhan adalah terangku dan keselamatanku, kepada siapakah aku harus takut? Tuhan adalah benteng hidupku, terhadap siapakah aku harus gentar?",
  },
  {
    reference: "Galatia 6:9",
    text: "Janganlah kita jemu-jemu berbuat baik, karena apabila sudah datang waktunya, kita akan menuai, jika kita tidak menjadi lemah.",
  },
  {
    reference: "Mazmur 121:1-2",
    text: "Aku melayangkan mataku ke gunung-gunung; dari manakah akan datang pertolonganku? Pertolonganku ialah dari Tuhan, yang menjadikan langit dan bumi.",
  },
  {
    reference: "Roma 15:13",
    text: "Semoga Allah, sumber pengharapan, memenuhi kamu dengan segala sukacita dan damai sejahtera dalam iman kamu, supaya oleh kekuatan Roh Kudus kamu berlimpah-limpah dalam pengharapan.",
  },
  {
    reference: "Mazmur 139:14",
    text: "Aku bersyukur kepada-Mu oleh karena kejadianku dahsyat dan ajaib; ajaib apa yang Kaubuat, dan jiwaku benar-benar menyadarinya.",
  },
  {
    reference: "Ibrani 13:8",
    text: "Yesus Kristus tetap sama, baik kemarin maupun hari ini dan sampai selama-lamanya.",
  },
  {
    reference: "Mazmur 91:1-2",
    text: "Orang yang diam dalam lindungan Yang Mahatinggi dan bernaung di bawah naungan Yang Mahakuasa akan berkata kepada Tuhan: »Tempat perlindungan dan kubu pertahananku, Allahku, yang kupercayai.«",
  },
  {
    reference: "Efesus 2:8",
    text: "Sebab karena kasih karunia kamu diselamatkan oleh iman; itu bukan hasil usahamu, tetapi pemberian Allah.",
  },
  {
    reference: "Mazmur 100:5",
    text: "Sebab Tuhan itu baik, kasih setia-Nya untuk selama-lamanya, dan kesetiaan-Nya tetap turun-temurun.",
  },
  {
    reference: "Matius 6:33",
    text: "Tetapi carilah dahulu Kerajaan Allah dan kebenarannya, maka semuanya itu akan ditambahkan kepadamu.",
  },
  {
    reference: "Mazmur 51:12",
    text: "Jadikanlah hatiku tahir, ya Allah, dan baharuilah semangat yang teguh di dalam batinku.",
  },
  {
    reference: "Yesaya 26:3",
    text: "Yang hatinya teguh Kaujaga dalam damai sejahtera, karena kepada-Mulah ia percaya.",
  },
];

function hashDateKey(dateKey: string) {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i += 1) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Kutipan yang sama sepanjang hari, berganti setiap tanggal baru. */
export function getDailyVerse(dateKey = getTodayKey()): DailyVerse {
  const index = hashDateKey(dateKey) % DAILY_VERSES.length;
  return DAILY_VERSES[index] ?? DAILY_VERSES[0];
}
