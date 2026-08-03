import type { BibleVersionCode } from "./bible-books";
import { BIBLE_VERSIONS } from "./bible-books";
import { normalizePassageKey, type ParsedPassage } from "./passage-parser";

export type BibleVerse = {
  verse: number;
  /** Jika BIS menggabungkan beberapa ayat, nomor akhir rentang (mis. 1–2). */
  endVerse?: number;
  content: string;
  type: "content" | "title";
};

export type BiblePassageResult = {
  reference: string;
  version: BibleVersionCode;
  versionName: string;
  book: string;
  chapter: number;
  subtitle?: string;
  sections?: PassageSection[];
  verses: BibleVerse[];
  source: "api" | "fallback";
};

export type PassageSection = {
  title: string;
  verses: BibleVerse[];
};

type BeebleVerse = {
  verse: number;
  type: "content" | "title";
  content: string;
};

type BeebleResponse = {
  data?: {
    book: { name: string; chapter: number };
    verses: BeebleVerse[];
  };
};

/** Fallback lokal untuk bacaan demo saat API eksternal lambat/tidak tersedia. */
const FALLBACK_PASSAGES: Record<string, BiblePassageResult> = {
  [normalizePassageKey("Matius 18:21-35")]: {
    reference: "Matius 18:21-35",
    version: "tb",
    versionName: BIBLE_VERSIONS.tb,
    book: "Matius",
    chapter: 18,
    subtitle: "Perumpamaan tentang pengampunan",
    source: "fallback",
    verses: [
      {
        verse: 21,
        type: "content",
        content:
          'Kemudian datanglah Petrus dan berkata kepada Yesus: "Tuhan, sampai berapa kali aku harus mengampuni saudaraku jika ia berbuat dosa terhadap aku? Sampai tujuh kali?"',
      },
      {
        verse: 22,
        type: "content",
        content:
          'Yesus berkata kepadanya: "Bukan! Aku berkata kepadamu: Bukan sampai tujuh kali, melainkan sampai tujuh puluh kali tujuh kali.',
      },
      {
        verse: 23,
        type: "content",
        content:
          "Sebab hal Kerajaan Sorga seumpama seorang raja yang hendak mengadakan perhitungan dengan hamba-hambanya.",
      },
      {
        verse: 24,
        type: "content",
        content:
          "Setelah ia mulai mengadakan perhitungan itu, dihadapkanlah kepadanya seorang yang berhutang sepuluh ribu talenta.",
      },
      {
        verse: 25,
        type: "content",
        content:
          "Tetapi karena orang itu tidak mampu melunaskan hutangnya, raja itu memerintahkan supaya ia dijual beserta anak isterinya dan segala miliknya untuk pembayar hutangnya.",
      },
      {
        verse: 26,
        type: "content",
        content:
          "Maka sujudlah hamba itu menyembah dia, katanya: Sabarlah dahulu, segala hutangku akan kulunaskan.",
      },
      {
        verse: 27,
        type: "content",
        content:
          "Lalu tergeraklah hati raja itu oleh belas kasihan akan hamba itu, sehingga ia membebaskannya dan menghapuskan hutangnya.",
      },
      {
        verse: 28,
        type: "content",
        content:
          "Tetapi ketika hamba itu keluar, ia bertemu dengan seorang hamba lain yang berhutang seratus dinar kepadanya. Ia menangkap dan mencekik kawannya itu, katanya: Bayar hutangmu!",
      },
      {
        verse: 29,
        type: "content",
        content:
          "Maka sujudlah kawannya itu dan memohon kepadanya: Sabarlah dahulu, hutangku itu akan kulunaskan.",
      },
      {
        verse: 30,
        type: "content",
        content:
          "Tetapi ia menolak dan menyerahkan kawannya itu ke dalam penjara sampai dilunaskannya hutangnya.",
      },
      {
        verse: 31,
        type: "content",
        content:
          "Melihat itu kawan-kawannya yang lain sangat sedih lalu menyampaikan segala yang terjadi kepada tuan mereka.",
      },
      {
        verse: 32,
        type: "content",
        content:
          "Raja itu menyuruh memanggil orang itu dan berkata kepadanya: Hai hamba yang jahat, seluruh hutangmu telah kuhapuskan karena engkau memohonkannya kepadaku.",
      },
      {
        verse: 33,
        type: "content",
        content:
          "Bukankah engkaupun harus mengasihani kawanmu seperti aku telah mengasihani engkau?",
      },
      {
        verse: 34,
        type: "content",
        content:
          "Maka marahlah tuannya itu dan menyerahkannya kepada algojo-algojo, sampai ia melunaskan seluruh hutangnya.",
      },
      {
        verse: 35,
        type: "content",
        content:
          "Maka Bapa-Ku yang di sorga akan berbuat demikian juga terhadap kamu, apabila kamu masing-masing tidak mengampuni saudaramu dengan segenap hatimu.\"",
      },
    ],
  },
  [normalizePassageKey("Matius 5:13-16")]: {
    reference: "Matius 5:13-16",
    version: "tb",
    versionName: BIBLE_VERSIONS.tb,
    book: "Matius",
    chapter: 5,
    source: "fallback",
    verses: [
      {
        verse: 13,
        type: "content",
        content:
          "Kamu adalah garam dunia. Tetapi jika garam itu menjadi tawar, bagaimanakah ia diasinkan kembali? Tidak ada lagi gunanya selain dibuang dan diinjak-injak orang.",
      },
      {
        verse: 14,
        type: "content",
        content:
          "Kamu adalah terang dunia. Kota yang terletak di atas gunung tidak mungkin tersembunyi.",
      },
      {
        verse: 15,
        type: "content",
        content:
          "Jugalah orang tidak menyalakan pelita dan meletakkannya di bawah gantang, melainkan di atas kandil, maka bercahayalah ia bagi semua yang ada di rumah itu.",
      },
      {
        verse: 16,
        type: "content",
        content:
          "Demikian hendaknya terangmu bercahaya di depan orang, supaya mereka melihat perbuatanmu yang baik dan memuliakan Bapaamu yang di sorga.",
      },
    ],
  },
  [normalizePassageKey("Matius 6:5-15")]: {
    reference: "Matius 6:5-15",
    version: "tb",
    versionName: BIBLE_VERSIONS.tb,
    book: "Matius",
    chapter: 6,
    subtitle: "Petunjuk tentang berdoa",
    source: "fallback",
    verses: [
      {
        verse: 5,
        type: "content",
        content:
          "Dan apabila kamu berdoa, janganlah berdoa seperti orang munafik. Mereka suka mengulurkan tangannya dan berdoa di ruang-ruang pertemuan dan di persimpangan-persimpangan jalan raya, supaya dilihat orang. Aku berkata kepadamu: Sesungguhnya mereka sudah menerima pahalanya.",
      },
      {
        verse: 6,
        type: "content",
        content:
          "Tetapi jika kamu berdoa, masuk ke dalam kamarmu, tutup pintu kamarmu dan berdoa kepada Bapamu yang ada di tempat tersembunyi. Maka Bapamu yang melihat yang tersembunyi akan membalasmu.",
      },
      {
        verse: 7,
        type: "content",
        content:
          "Dan dalam berdoa janganlah kamu bertele-tele, sebab Tuhan mengetahui apa yang kamu perlu, sebelum kamu minta kepada-Nya.",
      },
      {
        verse: 8,
        type: "content",
        content:
          "Karena itu berdoalah demikian: Bapa kami yang di sorga, Dikuduskanlah Namamu,",
      },
      {
        verse: 9,
        type: "content",
        content: "datanglah Kerajaan-Mu, jadilah kehendak-Mu di bumi seperti di sorga.",
      },
      {
        verse: 10,
        type: "content",
        content: "Berikanlah kami pada hari ini makanan kami yang secukupnya,",
      },
      {
        verse: 11,
        type: "content",
        content:
          "dan ampunilah kami akan kesalahan kami, seperti kami pun mengampuni orang yang bersalah kepada kami;",
      },
      {
        verse: 12,
        type: "content",
        content:
          "dan janganlah membawa kami ke dalam pencobaan, melainkan lepaskanlah kami dari pada yang jahat.",
      },
      {
        verse: 13,
        type: "content",
        content:
          "(Karena Engkaulah yang empunya Kerajaan dan kuasa dan kemuliaan sampai selama-lamanya. Amin.)",
      },
      {
        verse: 14,
        type: "content",
        content:
          "Karena jika kamu mengampuni kesalahan orang, Bapamu yang di sorga akan mengampuni kamu juga.",
      },
      {
        verse: 15,
        type: "content",
        content:
          "Tetapi jika kamu tidak mengampuni orang, Bapamu juga tidak akan mengampuni kesalahanmu.",
      },
    ],
  },
};

function getFallback(reference: string): BiblePassageResult | null {
  return FALLBACK_PASSAGES[normalizePassageKey(reference)] ?? null;
}

/**
 * BIS (dan beberapa terjemahan) menggabungkan beberapa ayat jadi satu,
 * lalu mengisi nomor ayat berikutnya dengan penunjuk seperti "(43:1)".
 * Itu bukan teks ayat — jangan ditampilkan; rentangkan label ayat target.
 */
export function parseMergedVersePlaceholder(content: string): {
  verse: number;
  endVerse?: number;
} | null {
  const match = content
    .trim()
    .match(/^\((\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?\)$/);
  if (!match) return null;
  const verse = Number(match[2]);
  const end = match[3] ? Number(match[3]) : undefined;
  if (!Number.isFinite(verse) || verse < 1) return null;
  return {
    verse,
    endVerse: end && Number.isFinite(end) && end > verse ? end : undefined,
  };
}

export function isMergedVersePlaceholder(content: string) {
  return parseMergedVersePlaceholder(content) !== null;
}

export function formatVerseNumberLabel(verse: number, endVerse?: number) {
  if (endVerse && endVerse > verse) return `${verse}–${endVerse}`;
  return String(verse);
}

export function sanitizePassageVerses(verses: BibleVerse[]): BibleVerse[] {
  const endByTarget = new Map<number, number>();

  for (const item of verses) {
    if (item.type !== "content") continue;
    const target = parseMergedVersePlaceholder(item.content);
    if (!target) continue;
    // Placeholder ada di nomor ayat yang “kosong”; teks ada di target.verse
    const absorbed = Math.max(item.verse, target.endVerse ?? target.verse);
    const prev = endByTarget.get(target.verse) ?? target.verse;
    endByTarget.set(target.verse, Math.max(prev, absorbed));
  }

  const withoutPlaceholders = verses.filter(
    (item) =>
      item.type === "title" ||
      (item.content.trim().length > 0 &&
        !isMergedVersePlaceholder(item.content)),
  );

  const withPlaceholderRanges = withoutPlaceholders.map((item) => {
    if (item.type === "title") return item;
    const fromPlaceholder = endByTarget.get(item.verse);
    const endVerse = Math.max(
      item.endVerse ?? item.verse,
      fromPlaceholder ?? item.verse,
    );
    return endVerse > item.verse ? { ...item, endVerse } : { ...item, endVerse: undefined };
  });

  // Cadangan untuk cache lama (placeholder sudah dihapus): isi celah nomor.
  const content = withPlaceholderRanges.filter((item) => item.type === "content");
  const endFromGaps = new Map<number, number>();
  for (let i = 0; i < content.length - 1; i += 1) {
    const cur = content[i]!;
    const next = content[i + 1]!;
    if (next.verse > cur.verse + 1) {
      const inferred = next.verse - 1;
      const existing = Math.max(
        cur.endVerse ?? cur.verse,
        endFromGaps.get(cur.verse) ?? cur.verse,
      );
      if (inferred > existing) endFromGaps.set(cur.verse, inferred);
    }
  }

  return withPlaceholderRanges.map((item) => {
    if (item.type === "title") return item;
    const endVerse = Math.max(
      item.endVerse ?? item.verse,
      endFromGaps.get(item.verse) ?? item.verse,
    );
    if (endVerse > item.verse) return { ...item, endVerse };
    return {
      verse: item.verse,
      content: item.content,
      type: item.type,
    };
  });
}

export function sanitizePassageResult(
  result: BiblePassageResult,
): BiblePassageResult {
  const verses = sanitizePassageVerses(result.verses);
  const sections = result.sections
    ?.map((section) => ({
      ...section,
      verses: sanitizePassageVerses(section.verses),
    }))
    .filter((section) => section.verses.length > 0 || Boolean(section.title));

  return {
    ...result,
    verses,
    sections: sections && sections.length > 0 ? sections : undefined,
  };
}

function extractPassageFromChapter(
  parsed: ParsedPassage,
  version: BibleVersionCode,
  rawVerses: BeebleVerse[],
  source: "api" | "fallback",
): BiblePassageResult {
  let subtitle: string | undefined;
  const verses: BibleVerse[] = [];
  const sections: PassageSection[] = [];
  let currentSection: PassageSection | null = null;

  function pushCurrentSection() {
    if (currentSection && currentSection.verses.length > 0) {
      sections.push(currentSection);
    }
  }

  for (const item of rawVerses) {
    if (item.type === "title" && item.content) {
      pushCurrentSection();
      // Judul pertama = ringkasan pasal; judul berikutnya = per bagian
      if (!subtitle) subtitle = item.content;
      currentSection = { title: item.content, verses: [] };
      continue;
    }

    if (
      item.type === "content" &&
      item.verse >= parsed.startVerse &&
      (parsed.wholeChapter || item.verse <= parsed.endVerse) &&
      item.content?.trim()
    ) {
      const verse: BibleVerse = {
        verse: item.verse,
        content: item.content,
        type: "content",
      };
      verses.push(verse);

      if (!currentSection) {
        currentSection = { title: "", verses: [] };
      }
      currentSection.verses.push(verse);
    }
  }

  pushCurrentSection();

  return sanitizePassageResult({
    reference: parsed.reference,
    version,
    versionName: BIBLE_VERSIONS[version],
    book: parsed.bookName,
    chapter: parsed.chapter,
    subtitle,
    sections: sections.length > 0 ? sections : undefined,
    verses,
    source,
  });
}

async function fetchFromBeeble(
  parsed: ParsedPassage,
  version: BibleVersionCode,
): Promise<BiblePassageResult | null> {
  const url = `https://beeble.vercel.app/api/v1/passage/${parsed.bookAbbr}/${parsed.chapter}?ver=${version}`;

  // API eksternal kadang lambat; beri timeout lebih longgar + satu retry.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7_000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        next: { revalidate: 60 * 60 * 24 },
      });

      if (!response.ok) continue;

      const payload = (await response.json()) as BeebleResponse;
      const rawVerses = payload.data?.verses;
      if (!rawVerses?.length) continue;

      const result = extractPassageFromChapter(
        parsed,
        version,
        rawVerses,
        "api",
      );
      if (result.verses.length > 0) return result;
    } catch {
      // Lanjut retry.
    } finally {
      clearTimeout(timeout);
    }
  }

  return null;
}

const serverPassageCache = new Map<string, BiblePassageResult>();

export async function getBiblePassage(
  parsed: ParsedPassage,
  version: BibleVersionCode = "tb",
): Promise<BiblePassageResult> {
  const cacheKey = `${version}:${parsed.reference}`;
  const cached = serverPassageCache.get(cacheKey);
  if (cached) return cached;

  const endChapter = parsed.endChapter ?? parsed.chapter;

  if (endChapter > parsed.chapter) {
    const mergedVerses: BibleVerse[] = [];
    const mergedSections: PassageSection[] = [];
    let source: "api" | "fallback" = "api";

    for (let chapter = parsed.chapter; chapter <= endChapter; chapter += 1) {
      const chapterParsed: ParsedPassage = {
        ...parsed,
        chapter,
        endChapter: undefined,
        wholeChapter: true,
        startVerse: 1,
        endVerse: Number.MAX_SAFE_INTEGER,
        reference: `${parsed.bookName} ${chapter}`,
      };

      const chapterResult =
        (await fetchFromBeeble(chapterParsed, version)) ??
        getFallback(chapterParsed.reference);

      if (!chapterResult) {
        throw new Error(
          `Ayat untuk "${parsed.bookName} ${chapter}" belum tersedia. Coba lagi nanti.`,
        );
      }

      if (chapterResult.source === "fallback") source = "fallback";

      const cleaned = sanitizePassageResult(chapterResult);
      mergedSections.push({
        title: `${parsed.bookName} ${chapter}`,
        verses: cleaned.verses,
      });
      mergedVerses.push(...cleaned.verses);
    }

    const merged: BiblePassageResult = {
      reference: parsed.reference,
      version,
      versionName: BIBLE_VERSIONS[version],
      book: parsed.bookName,
      chapter: parsed.chapter,
      sections: mergedSections,
      verses: mergedVerses,
      source,
    };
    serverPassageCache.set(cacheKey, merged);
    return merged;
  }

  const fromApi = await fetchFromBeeble(parsed, version);
  if (fromApi) {
    const cleaned = sanitizePassageResult(fromApi);
    serverPassageCache.set(cacheKey, cleaned);
    return cleaned;
  }

  const fallback = getFallback(parsed.reference);
  if (fallback) {
    const cleaned = sanitizePassageResult(fallback);
    serverPassageCache.set(cacheKey, cleaned);
    return cleaned;
  }

  throw new Error(
    `Ayat untuk "${parsed.reference}" belum tersedia. Coba lagi nanti.`,
  );
}
