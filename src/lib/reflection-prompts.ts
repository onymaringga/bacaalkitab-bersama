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
