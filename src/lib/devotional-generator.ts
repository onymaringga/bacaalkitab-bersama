import type { BiblePassageResult, BibleVerse } from "./bible-api";
import { OLD_TESTAMENT_SIZE, BIBLE_BOOKS } from "./bible-books";
import {
  getReadingDevotionalSeed,
  getReadingKeyVerse,
  polishDevotionalApplication,
  type ReadingDevotionalSeed,
  type ReadingThemeId,
} from "./reading-key-verse";

export type DevotionalContent = {
  title: string;
  opening: string;
  body: string;
  keyVerse: {
    reference: string;
    text: string;
  };
  reflectionQuestions: string[];
  prayer: string;
  source: "generated";
};

type ThemeProfile = {
  id: ReadingThemeId;
  label: string;
  keywords: string[];
};

const THEMES: ThemeProfile[] = [
  {
    id: "presence",
    label: "penyertaan Tuhan",
    keywords: [
      "menyertai",
      "besertamu",
      "janganlah takut",
      "jangan takut",
      "Aku menyertai",
      "melindungi",
      "digembalakan",
    ],
  },
  {
    id: "promise",
    label: "janji Tuhan",
    keywords: [
      "perjanjian",
      "janji",
      "dijanjikan",
      "keturunan",
      "berkat",
      "busur",
    ],
  },
  {
    id: "faith",
    label: "iman dan percaya",
    keywords: ["percaya", "iman", "mempercayakan", "bergantung"],
  },
  {
    id: "forgiveness",
    label: "pengampunan",
    keywords: [
      "ampuni",
      "mengampuni",
      "belas kasihan",
      "pengampunan",
      "berdamai",
    ],
  },
  {
    id: "obedience",
    label: "ketaatan",
    keywords: ["taat", "dengarkan", "pergilah", "lakukanlah", "ikutlah"],
  },
  {
    id: "provision",
    label: "pemeliharaan Tuhan",
    keywords: [
      "menyediakan",
      "memelihara",
      "mengingat",
      "memberi",
      "berhasil",
    ],
  },
  {
    id: "courage",
    label: "keberanian dalam ujian",
    keywords: ["bergumul", "kesesakan", "penjara", "ujian", "menderita"],
  },
  {
    id: "calling",
    label: "panggilan Tuhan",
    keywords: ["panggil", "utusan", "bangsa", "berkat bagi"],
  },
  {
    id: "family",
    label: "keluarga dan rekonsiliasi",
    keywords: ["saudara", "ayah", "ibu", "anak", "isteri", "keluarga", "damai"],
  },
];

const THEME_BY_ID = Object.fromEntries(
  THEMES.map((theme) => [theme.id, theme]),
) as Record<ReadingThemeId, ThemeProfile>;

function truncate(text: string, max: number) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  const slice = cleaned.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trim()}…`;
}

function contentVerses(passage: BiblePassageResult): BibleVerse[] {
  return passage.verses.filter((verse) => verse.type !== "title");
}

function isOldTestament(bookName: string) {
  const index = BIBLE_BOOKS.findIndex((book) => book.name === bookName);
  return index >= 0 && index < OLD_TESTAMENT_SIZE;
}

function passageCorpus(passage: BiblePassageResult) {
  const sectionTitles =
    passage.sections?.map((section) => section.title).join(" ") ?? "";
  return [
    passage.subtitle ?? "",
    sectionTitles,
    ...contentVerses(passage).map((verse) => verse.content),
  ]
    .join(" ")
    .toLowerCase();
}

function themeFromId(id: ReadingThemeId): ThemeProfile {
  if (id === "general") {
    return { id: "general", label: "Firman Tuhan hari ini", keywords: [] };
  }
  return (
    THEME_BY_ID[id] ?? {
      id: "general",
      label: "Firman Tuhan hari ini",
      keywords: [],
    }
  );
}

/** Utamakan ayat kunci; corpus pasal hanya pendukung ringan. */
function detectTheme(
  passage: BiblePassageResult,
  keyText: string,
): ThemeProfile {
  const keyLower = keyText.toLowerCase();
  const corpus = passageCorpus(passage);
  let best: ThemeProfile = {
    id: "general",
    label: passage.subtitle?.trim()
      ? `pesan dalam “${passage.subtitle.trim()}”`
      : "Firman Tuhan hari ini",
    keywords: [],
  };
  let bestScore = 0;

  for (const theme of THEMES) {
    let score = 0;
    for (const keyword of theme.keywords) {
      const needle = keyword.toLowerCase();
      if (keyLower.includes(needle)) score += 4;
      else if (corpus.includes(needle)) score += 1;
    }
    if (score > bestScore) {
      best = theme;
      bestScore = score;
    }
  }

  return bestScore === 0 ? best : best;
}

function scoreVerse(verse: BibleVerse, theme: ThemeProfile) {
  const text = verse.content;
  const lower = text.toLowerCase();
  let score = 0;

  const len = text.length;
  if (len >= 60 && len <= 280) score += 3;
  else if (len >= 40) score += 1;

  if (
    /["»«]/.test(text) ||
    text.includes("berfirman") ||
    text.includes("firman")
  ) {
    score += 2;
  }
  if (text.includes("Tuhan") || text.includes("Allah")) score += 2;

  for (const keyword of theme.keywords) {
    if (lower.includes(keyword.toLowerCase())) score += 2;
  }

  if (/^Inilah keturunan|^Inilah daftar|^Umur /i.test(text)) score -= 4;

  return score;
}

function pickGeneratedKeyVerse(
  passage: BiblePassageResult,
  theme: ThemeProfile,
) {
  const verses = contentVerses(passage);
  if (verses.length === 0) {
    return { reference: passage.reference, text: "" };
  }

  let best = verses[0]!;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const verse of verses) {
    const score = scoreVerse(verse, theme);
    if (score > bestScore) {
      best = verse;
      bestScore = score;
    }
  }

  return {
    reference: `${passage.book} ${passage.chapter}:${best.verse}`,
    text: truncate(best.content, 260),
  };
}

function resolveKeyVerse(
  passage: BiblePassageResult,
  theme: ThemeProfile,
  schedulePassage?: string,
) {
  const curated =
    getReadingKeyVerse(schedulePassage) ??
    getReadingKeyVerse(passage.reference);
  if (curated?.text) {
    return {
      reference: curated.reference,
      text: truncate(curated.text, 280),
    };
  }
  return pickGeneratedKeyVerse(passage, theme);
}

function buildApplication(
  theme: ThemeProfile,
  seed?: Pick<ReadingDevotionalSeed, "title" | "reference">,
) {
  const about = seed?.title
    ? `mengingat “${seed.title}”`
    : `mengingat ${theme.label}`;

  switch (theme.id) {
    case "presence":
      return `Sebutkan satu ketakutan yang sedang kamu bawa, lalu doakan singkat—“Tuhan, sertai aku di tempat ini, bukan di tempat yang aku bayangkan lebih aman.”`;
    case "promise":
      return `Tulis satu janji Tuhan yang ingin kamu pegang minggu ini. Baca lagi saat ragu datang, supaya perasaan tidak menjadi hakim atas firman-Nya.`;
    case "faith":
      return `Pilih satu perkara atau orang yang kamu genggam terlalu erat karena takut. Serahkan dalam doa—bukan karena berhenti peduli, tetapi karena Tuhan lebih setia daripada genggamanmu.`;
    case "forgiveness":
      return `Doakan satu orang yang sulit kamu maafkan, atau mintalah Tuhan menolongmu menerima pengampunan-Nya lebih dalam—supaya luka tidak menjadi identitasmu.`;
    case "obedience":
      return `Tanyakan, “Apa satu langkah taat yang Engkau minta hari ini?” Kerjakan yang sederhana dan jelas, tanpa menunggu perasaan “siap total”.`;
    case "provision":
      return `Sebutkan dua pemeliharaan Tuhan yang sering kamu anggap biasa. Ucapkan syukur konkret, lalu lepaskan satu kekhawatiran yang membuatmu lupa Ia memelihara.`;
    case "courage":
      return `Hadapi satu situasi sulit dengan doa dulu, lalu bertindak tenang. Jangan biarkan keluhan menjadi langkah pertama.`;
    case "calling":
      return `Tanyakan, “Untuk siapa karunia atau posisiku bisa menjadi berkat?” Lakukan satu tindakan kecil yang menjawab pertanyaan itu.`;
    case "family":
      return `Hubungi atau doakan seorang anggota keluarga / saudara dalam iman—khususnya yang sedang tegang atau menjauh.`;
    default:
      return `Pilih satu kalimat dari bacaan ini untuk diingat, lalu hidupi dalam satu tindakan kasih yang sederhana dan konkret.`;
  }
}

function buildPrayer(
  theme: ThemeProfile,
  passageLabel: string,
  seed?: Pick<ReadingDevotionalSeed, "title">,
) {
  const titleBit = seed?.title ? ` dalam “${seed.title}”` : "";

  switch (theme.id) {
    case "presence":
      return `Tuhan, di tengah ketakutan, ajar aku percaya bahwa Engkau menyertai—seperti yang Kauingatkan lewat ${passageLabel}${titleBit}. Amin.`;
    case "promise":
      return `Bapa, tolong aku berpegang pada janji-Mu, bukan pada perasaan yang naik-turun. Kuatkan imanku lewat ${passageLabel}. Amin.`;
    case "faith":
      return `Ya Tuhan, tambahkan imanku. Ajar aku melepas kendali yang kupertahankan karena takut, dan percaya kepada-Mu dengan jujur hari ini. Amin.`;
    case "forgiveness":
      return `Allah yang penuh belas kasihan, lepaskan aku dari dendam dan malu. Bentuk hatiku supaya sanggup mengampuni dan dipulihkan. Amin.`;
    case "obedience":
      return `Tuhan, berikan keberanian untuk taat pada langkah yang Engkau minta hari ini, sekecil apa pun. Amin.`;
    case "provision":
      return `Bapa, buka mataku melihat pemeliharaan-Mu. Ajar aku bersyukur dan bergantung kepada-Mu saja. Amin.`;
    case "courage":
      return `Tuhan, kuatkan aku dalam ujian. Jangan biarkan aku menyerah sebelum melihat pekerjaan-Mu selesai. Amin.`;
    case "calling":
      return `Ya Tuhan, jelaskan panggilan-Mu bagiku, dan pakai hidupku menjadi berkat bagi orang lain. Amin.`;
    case "family":
      return `Allah pemulih, kerjakan damai dalam keluarga dan relasiku. Mulai dari hatiku hari ini. Amin.`;
    default:
      return `Tuhan, biar Firman dalam ${passageLabel} tidak hanya terbaca, tetapi mengubah caraku hidup hari ini. Amin.`;
  }
}

function buildQuestions(
  passageLabel: string,
  theme: ThemeProfile,
  keyRef: string,
  seed?: Pick<ReadingDevotionalSeed, "title">,
) {
  const title = seed?.title;
  return [
    keyRef
      ? `Dari ${keyRef}, kata atau pengakuan mana yang paling menyingkapkan hatimu saat ini? Mengapa?`
      : `Kalimat mana dalam ${passageLabel} yang paling menantang atau menghibur hatimu?`,
    title
      ? `Di bagian mana hidupmu sedang digugah oleh tema “${title}”?`
      : `Di mana kamu sedang diuji untuk hidup sesuai ${theme.label}?`,
    `Satu langkah konkret apa yang ingin kamu lakukan setelah merenungkan ${passageLabel}—bukan hanya yang “baik didengar”, tetapi yang bisa dikerjakan hari ini?`,
  ];
}

/**
 * Susun renungan kurasi jadi satu alur:
 * undangan → kisah → makna → langkah hidup → doa.
 */
function fromSeed(
  seed: ReadingDevotionalSeed,
  passageLabel: string,
): DevotionalContent {
  const theme = themeFromId(seed.themeId);
  const opening = seed.hook?.trim() || seed.title;

  const story = seed.focus.trim();
  const meaning = seed.angle.trim();
  const application = seed.application?.trim()
    ? polishDevotionalApplication(seed.application)
    : buildApplication(theme, seed);

  const body = [story, meaning, application]
    .filter((part) => part.length > 0)
    .join("\n\n");

  return {
    title: seed.title,
    opening,
    body,
    keyVerse: {
      reference: seed.reference,
      text: truncate(seed.text, 280),
    },
    reflectionQuestions:
      seed.questions && seed.questions.length > 0
        ? seed.questions
        : buildQuestions(passageLabel, theme, seed.reference, seed),
    prayer: seed.prayer?.trim() || buildPrayer(theme, passageLabel, seed),
    source: "generated",
  };
}

/** Fallback untuk pasal di luar jadwal kurasi — tanpa menempel potongan ayat acak. */
function fromPassageFallback(
  passage: BiblePassageResult,
  schedulePassage?: string,
): DevotionalContent {
  const seedTheme = detectTheme(passage, "");
  const keyVerse = resolveKeyVerse(passage, seedTheme, schedulePassage);
  const theme = detectTheme(passage, keyVerse.text);
  const testament = isOldTestament(passage.book)
    ? "Perjanjian Lama"
    : "Perjanjian Baru";

  const sectionTitles =
    passage.sections
      ?.map((section) => section.title.trim())
      .filter(Boolean)
      .slice(0, 3) ?? [];

  const opening = passage.subtitle?.trim()
    ? `Dalam ${passage.reference} (${testament}), kita diajak merenungkan “${passage.subtitle.trim()}”—bukan terburu-buru selesai baca, tetapi tinggal cukup lama sampai satu berita utama menembus hati.`
    : `Hari ini kita merenungkan ${passage.reference} (${testament}). Biarkan ${theme.label} menjadi lensa: Firman bukan sekadar informasi, melainkan undangan untuk berubah.`;

  const story =
    sectionTitles.length >= 2
      ? `Pasal ini bergerak lewat beberapa bagian: ${sectionTitles
          .map((title) => `“${title}”`)
          .join(", ")}. Ikuti alurnya: siapa yang berbicara, apa yang ditakutkan atau diharapkan, dan di mana Tuhan menyingkapkan diri-Nya di tengah situasi manusia yang konkret.`
      : `Bacalah ${passage.reference} sebagai satu kesatuan cerita. Perhatikan tekanan yang dihadapi tokohnya, lalu cari di mana Allah hadir—bukan di luar cerita, tetapi di dalamnya.`;

  const insight = keyVerse.text
    ? `Pegang ${keyVerse.reference} sebagai poros: di situ ${theme.label} tampak paling jernih. Biarkan ayat itu menafsirkan seluruh bacaan, lalu bertanya—di mana hidupku digugah oleh kebenaran yang sama?`
    : `Cari satu kalimat yang paling menohok atau menghibur. Jadikan itu poros untuk memahami ${theme.label} dalam pasal ini, lalu bawa ke dalam keputusanmu hari ini.`;

  return {
    title: passage.subtitle?.trim()
      ? passage.subtitle.trim()
      : `${theme.label.charAt(0).toUpperCase()}${theme.label.slice(1)} · ${passage.reference}`,
    opening,
    body: [story, insight, polishDevotionalApplication(buildApplication(theme))].join(
      "\n\n",
    ),
    keyVerse,
    reflectionQuestions: buildQuestions(
      passage.reference,
      theme,
      keyVerse.reference,
    ),
    prayer: buildPrayer(theme, passage.reference),
    source: "generated",
  };
}

/**
 * Renungan otomatis: pakai benang merah kurasi bila ada (jadwal Kejadian),
 * supaya opening–kisah–makna–langkah–doa satu cerita.
 */
export function generateDevotional(
  passage: BiblePassageResult,
  schedulePassage?: string,
): DevotionalContent {
  const seed =
    getReadingDevotionalSeed(schedulePassage) ??
    getReadingDevotionalSeed(passage.reference);

  if (seed) {
    return fromSeed(seed, schedulePassage?.trim() || passage.reference);
  }

  return fromPassageFallback(passage, schedulePassage);
}
