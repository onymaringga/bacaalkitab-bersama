/**
 * Pertanyaan renungan harian — berbeda tiap hari.
 * Untuk jadwal yang sudah diisi: disesuaikan isi pasal.
 * Untuk hari lain: diputar dari kumpulan pertanyaan umum.
 */

const ASSIGNED_REFLECTION_PROMPTS: Record<string, string> = {
  "2026-07-01":
    "Dari penciptaan di Kejadian 1–2, bagian mana yang paling menggerakkanmu untuk memuji Tuhan hari ini?",
  "2026-07-02":
    "Setelah membaca Kejadian 3–4, di mana kamu cenderung bersembunyi dari Tuhan — dan apa yang ingin Dia pulihkan?",
  "2026-07-03":
    "Dari garis keturunan dan panggilan Nuh (Kejadian 5–6), apa artinya hidup benar di tengah dunia yang rusak bagimu?",
  "2026-07-04":
    "Saat membaca air bah (Kejadian 7–8), di mana kamu butuh “bahtera” perlindungan Tuhan minggu ini?",
  "2026-07-05":
    "Dari perjanjian pelangi (Kejadian 9–10), janji Tuhan mana yang ingin kamu pegang hari ini?",
  "2026-07-06":
    "Menara Babel vs panggilan Abram (Kejadian 11–12): di mana kamu masih membangun nama sendiri, dan di mana Tuhan memanggilmu keluar?",
  "2026-07-07":
    "Dari pilihan Lot dan kemenangan Abram (Kejadian 13–14), keputusan apa yang sedang Tuhan minta kamu serahkan kepada-Nya?",
  "2026-07-08":
    "Dalam perjanjian dan kisah Hagar (Kejadian 15–16), bagaimana Tuhan menampakkan diri di musim menunggumu?",
  "2026-07-09":
    "Dari perjanjian sunat dan kunjungan Tuhan (Kejadian 17–18), apa yang sulit kamu percayai dari janji-Nya saat ini?",
  "2026-07-10":
    "Setelah membaca Kejadian 19, apa yang Tuhan ingatkan tentang keadilan-Nya dan belas kasihan-Nya dalam hidupmu?",
  "2026-07-11":
    "Dari Kejadian 20–21, bagaimana Tuhan tetap setia meski ada kelemahan manusia — termasuk milikmu?",
  "2026-07-12":
    "Saat Abraham dipanggil menyerahkan Ishak (Kejadian 22–23), apa yang paling sulit kamu lepaskan kepada Tuhan?",
  "2026-07-13":
    "Dari pencarian istri bagi Ishak (Kejadian 24), di mana kamu melihat bimbingan Tuhan dalam detail hidup sehari-hari?",
  "2026-07-14":
    "Setelah membaca Kejadian 25, apa yang sedang kamu “pertukarkan” dengan berkat Tuhan — seperti Esau?",
  "2026-07-15":
    "Dari perjalanan Ishak (Kejadian 26), sumur mana dalam hidupmu yang perlu digali ulang bersama Tuhan?",
  "2026-07-16":
    "Dalam tipu daya Yakub (Kejadian 27), di mana kamu tergoda mengambil jalan pintas — dan apa yang Tuhan ingin ubah?",
  "2026-07-17":
    "Dari mimpi Yakub dan pelayanannya (Kejadian 28–29), bagaimana Tuhan hadir di tempat yang kamu anggap “biasa”?",
  "2026-07-18":
    "Setelah membaca Kejadian 30, apa yang sedang kamu kejar dengan hati cemburu — dan bagaimana Tuhan mengajakmu beristirahat?",
  "2026-07-19":
    "Dari kepergian Yakub (Kejadian 31), apa yang perlu kamu tinggalkan agar bisa taat kepada panggilan baru?",
  "2026-07-20":
    "Saat Yakub bergumul dan berdamai dengan Esau (Kejadian 32–33), dengan siapa atau dengan apa kamu perlu berdamai?",
  "2026-07-21":
    "Dari Kejadian 34–35, bagaimana Tuhan memanggilmu kembali ke “Betel” — tempat perjumpaan yang murni dengan-Nya?",
  "2026-07-22":
    "Setelah membaca Kejadian 36, apa yang Tuhan ingatkan tentang warisan dan jejak yang ingin kamu tinggalkan?",
  "2026-07-23":
    "Dari mimpi Yusuf dan kejatuhan (Kejadian 37–38), di mana luka atau pengkhianatan masih perlu diserahkan kepada Tuhan?",
  "2026-07-24":
    "Dalam kesetiaan Yusuf di penjara (Kejadian 39–40), bagaimana kamu dipanggil tetap setia di tempat yang tidak nyaman?",
  "2026-07-25":
    "Dari kenaikan Yusuf (Kejadian 41), karunia apa yang Tuhan berikan untuk diberkati orang lain, bukan hanya dirimu?",
  "2026-07-26":
    "Saat saudara-saudara Yusuf datang (Kejadian 42), perasaan apa yang muncul jika Tuhan menguji hatimu lewat masa lalu?",
  "2026-07-27":
    "Dari Kejadian 43, bagaimana kamu belajar percaya Tuhan saat menghadapi ketakutan dan ketidakpastian?",
  "2026-07-28":
    "Dalam ujian cawan (Kejadian 44), apa artinya tanggung jawab dan pertobatan sejati bagimu hari ini?",
  "2026-07-29":
    "Dari pengungkapan Yusuf (Kejadian 45–46), di mana kamu melihat Tuhan merangkai yang jahat menjadi kebaikan?",
  "2026-07-30":
    "Setelah membaca Kejadian 47–48, berkat apa yang ingin kamu wariskan kepada generasi berikutnya?",
  "2026-07-31":
    "Di akhir Kejadian (49–50), kata-kata Yusuf mana yang paling menantangmu untuk mengampuni dan percaya providensia Tuhan?",
  "2026-08-01":
    "Dari Keluaran 1–2, di mana kamu melihat Allah mendengar dan mengingat meski tekanan terasa tidak berujung?",
  "2026-08-02":
    "Saat Musa ragu menerima panggilan (Keluaran 3–4), keberatan apa yang paling mirip dengan hatimu saat ini?",
  "2026-08-03":
    "Setelah Keluaran 5–6, pernahkah taat justru membuat beban sementara terasa lebih berat? Bagaimana janji Keluaran 6:6 menolongmu?",
  "2026-08-04":
    "Dari plagen awal (Keluaran 7–8), ketidakadilan apa yang kamu serahkan kepada kedaulatan Tuhan hari ini?",
  "2026-08-05":
    "Keluaran 9 menunjukkan hati yang keras. Di mana kamu tergoda menolak sungguh-sungguh bertobat?",
  "2026-08-06":
    "Sebelum pembebasan (Keluaran 10–11), kisah pertolongan Tuhan apa yang perlu kamu wariskan kepada generasi berikutnya?",
  "2026-08-07":
    "Dari Paskah (Keluaran 12), apa artinya hidup diselamatkan oleh anugerah yang ditandai, bukan oleh prestasi?",
  "2026-08-08":
    "Di tepi laut (Keluaran 13–14), situasi apa yang membuatmu ingin mengambil alih dengan kepanikan?",
  "2026-08-09":
    "Setelah nyanyian kemenangan dan keluhan di padang (Keluaran 15–16), di mana imanmu naik-turun antara syukur dan keraguan?",
  "2026-08-10":
    "Dari Keluaran 17–18, siapa “Yitro” dalam hidupmu—teman yang menolongmu melihat jalan yang lebih bijaksana?",
  "2026-08-11":
    "Dari hukum Sinai (Keluaran 19–20), bagaimana janji pembebasan menjadi fondasi ketaatan, bukan sebaliknya?",
  "2026-08-12":
    "Keluaran 21–22 menghubungkan iman dengan keadilan sehari-hari. Siapa yang perlu kamu lindungi atau bayar kembali?",
  "2026-08-13":
    "Dari perjanjian dan darah (Keluaran 23–24), komitmen apa yang perlu kamu hidupi, bukan hanya setuju secara emosional?",
  "2026-08-14":
    "Keluaran 25 mengajarkan bahwa Allah ingin tinggal di tengah umat-Nya. Apakah kehadiran-Nya terasa dekat atau jauh bagimu?",
  "2026-08-15":
    "Detail Kemah (Keluaran 26–27) menunjukkan ibadah yang terarah. Di mana kamu tergoda “ibadah seenaknya”?",
  "2026-08-16":
    "Dari pakaian imam (Keluaran 28), pelayananmu perlu disiapkan seperti apa supaya layak Tuhan yang kudus?",
  "2026-08-17":
    "Keluaran 29 mengarah pada kedekatan melalui korban. Apa artinya datang kepada Tuhan dengan jujur tentang dosa?",
  "2026-08-18":
    "Dari Keluaran 30, di mana kamu butuh tempat pertemuan dengan Tuhan yang penuh pendamaian?",
  "2026-08-19":
    "Setelah berhala emas (Keluaran 31–32), apa “berhala cepat” yang paling menggoda hatimu saat menunggu Tuhan?",
  "2026-08-20":
    "Dari kemurahan Allah setelah kemurtadan (Keluaran 33–34), di mana kamu perlu kembali dekat setelah jatuh?",
  "2026-08-21":
    "Keluaran 35 menunjukkan kemurahan hati umat. Apa yang bisa kamu berikan sukarela untuk pekerjaan Tuhan?",
  "2026-08-22":
    "Dari Keluaran 36, pernahkah kamu merasakan “sudah cukup, bahkan kelebihan” dalam kemurahan?",
  "2026-08-23":
    "Keluaran 37–38 mengajarkan ibadah terarah. Apakah cara mendekat Tuhanmu selaras dengan firman-Nya?",
  "2026-08-24":
    "Di penutup pembangunan Kemah (Keluaran 39), pekerjaan apa yang perlu kamu selesaikan dengan ketaatan detail?",
  "2026-08-25":
    "Keluaran 40: kemuliaan Tuhan memenuhi Kemah. Apakah hidupmu terasa penuh kehadiran-Nya?",
  "2026-08-26":
    "Imamat 1–3: apa artinya “meletakkan tangan” secara rohani atas kebutuhan pendamaian atau syukur?",
  "2026-08-27":
    "Dari Imamat 4, dosa apa yang masih kamu tunda bawa kepada Tuhan dengan jujur?",
  "2026-08-28":
    "Imamat 5–6 menghubungkan pendamaian dengan restitusi. Kepada siapa kamu perlu memperbaiki kesalahan?",
  "2026-08-29":
    "Dari Imamat 7, hatimu lebih dekat ke syukur, pengakuan, atau kerinduan bersekutu dengan Tuhan?",
  "2026-08-30":
    "Imamat 8: apakah kamu melayani dengan persiapan rohani, atau “langsung saja”?",
  "2026-08-31":
    "Setelah Nadab dan Abihu (Imamat 9–10), kebiasaan ibadah apa yang perlu kamu evaluasi ulang?",
  "2026-09-01":
    "Imamat 11–12: apa artinya “kudus, sebab Akulah TUHAN” dalam makan, kebersihan, dan kehidupan sehari-hari?",
  "2026-09-02":
    "Dari Imamat 13, siapa yang terisolasi di sekitarmu dan butuh harapan pemulihan?",
  "2026-09-03":
    "Imamat 14 menunjukkan jalan kembali. Siapa atau apa yang perlu proses pemulihan di hidupmu?",
  "2026-09-04":
    "Dari Hari Raya Pendamaian (Imamat 15–16), dosa apa yang perlu kamu bawa kepada Tuhan yang menyediakan pendamaian?",
  "2026-09-05":
    "Imamat 17–18: di mana kamu diajak hidup berbeda dari “Mesir” atau “Kanaan” budaya sekitarmu?",
  "2026-09-06":
    "Dari Imamat 19:18, siapa “sesamamu” yang paling sulit kamu kasihi hari ini?",
  "2026-09-07":
    "Imamat 21–22: apakah kamu memberi Tuhan “korban cacat”—sisa waktu atau perhatian?",
  "2026-09-08":
    "Imamat 23–24: apakah ritme syukurmu disertai kepedulian pada miskin dan asing?",
  "2026-09-09":
    "Imamat 25: apakah kamu hidup seperti pemilik absolut atau penjaga yang setia atas milik Tuhan?",
  "2026-09-10":
    "Dari Imamat 26, janji “berjalan bersama” Tuhan—di mana pemberontakan masih perlu diserahkan?",
  "2026-09-11":
    "Penutup Imamat 27: nazar sukarela apa yang ingin kamu persembahkan sebagai respons kasih, bukan utang?",
};

const ROTATING_PROMPTS = [
  "Apa satu hal dari bacaan hari ini yang Tuhan ingin kamu praktikkan minggu ini?",
  "Siapa tokoh dalam bacaan ini yang paling mendekati kondisi hatimu saat ini? Mengapa?",
  "Kalimat atau peristiwa mana yang paling menghibur atau menegurmu hari ini?",
  "Apa yang bacaan ini ungkapkan tentang karakter Tuhan bagimu?",
  "Di mana kamu diajak taat, meski langkahnya terasa sulit?",
  "Doa singkat apa yang muncul setelah membaca pasal hari ini?",
  "Apa yang perlu kamu lepaskan agar lebih bebas mengikuti Tuhan?",
  "Siapa yang bisa kamu kasihi atau dorong setelah merenungkan bacaan ini?",
  "Di bagian mana Tuhan sedang membentuk kesabaran atau imanmu?",
  "Jika bacaan ini jadi surat pribadi untukmu, apa pesan utamanya?",
  "Apa yang membuatmu bersyukur setelah membaca hari ini?",
  "Di mana kamu melihat kasih setia Tuhan dalam kisah ini — dan dalam hidupmu?",
];

export function getReflectionPromptForDay(input: {
  dateKey: string;
  dayNumber: number;
  hasPassage: boolean;
}): string {
  if (!input.hasPassage) {
    return "Tunggu jadwal bacaan resmi, lalu kembalilah di sini untuk merenung.";
  }

  const assigned = ASSIGNED_REFLECTION_PROMPTS[input.dateKey];
  if (assigned) return assigned;

  const index = (input.dayNumber - 1) % ROTATING_PROMPTS.length;
  return ROTATING_PROMPTS[index] ?? ROTATING_PROMPTS[0]!;
}
