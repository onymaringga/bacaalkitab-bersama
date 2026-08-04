import type { BiblePassageResult, BibleVerse } from "@/lib/bible-api";
import { BIBLE_BOOKS } from "@/lib/bible-books";
import { expandPassageToChapterRefs, loadPassageClient } from "@/lib/bible-passage-cache";
import { readPreferredBibleVersion } from "@/lib/bible-version-preference";
import {
  createJournalElement,
  createJournalPage,
  createJournalSheet,
  type JournalPage,
} from "@/lib/journal-entries";
import { buildPassageReference, formatPassageReference, parsePassage } from "@/lib/passage-parser";
import type { ReadingSchedule } from "@/lib/types";

function collectVerses(data: BiblePassageResult): BibleVerse[] {
  if (data.sections?.length) {
    return data.sections.flatMap((section) =>
      section.verses.filter((verse) => verse.type !== "title"),
    );
  }
  return data.verses.filter((verse) => verse.type !== "title");
}

function verseInRange(
  verse: BibleVerse,
  startVerse?: number,
  endVerse?: number,
) {
  const start = verse.verse;
  const end = verse.endVerse ?? verse.verse;
  if (startVerse != null && end < startVerse) return false;
  if (endVerse != null && start > endVerse) return false;
  return true;
}

function formatVerseBlock(
  book: string,
  chapter: number,
  verse: BibleVerse,
) {
  const end = verse.endVerse ?? verse.verse;
  const label =
    end === verse.verse
      ? formatPassageReference(book, chapter, verse.verse)
      : formatPassageReference(book, chapter, verse.verse, end);
  return `${label}\n${verse.content.trim()}`;
}

export function buildManualVersePassage(
  bookAbbr: string,
  chapter: number,
  startVerse: number,
  endVerse: number,
) {
  const book = BIBLE_BOOKS.find((item) => item.abbr === bookAbbr);
  if (!book) return null;
  if (startVerse < 1 || endVerse < startVerse) return null;

  return buildPassageReference({
    bookName: book.name,
    bookAbbr: book.abbr,
    chapter,
    startVerse,
    endVerse,
    wholeChapter: false,
  }).reference;
}

export async function loadJournalVerseText(
  passage: string,
  options?: {
    startVerse?: number;
    endVerse?: number;
    maxVerses?: number;
  },
): Promise<string | null> {
  const trimmed = passage.trim();
  if (!trimmed || trimmed === "Belum dijadwalkan") return null;

  const version = readPreferredBibleVersion();
  const refs = expandPassageToChapterRefs(trimmed.replace(/[–—]/g, "-"));
  const lines: string[] = [];
  const maxVerses = options?.maxVerses ?? 48;
  let count = 0;

  for (const ref of refs) {
    const data = await loadPassageClient(ref, version);
    if (!data) continue;

    for (const verse of collectVerses(data)) {
      if (!verseInRange(verse, options?.startVerse, options?.endVerse)) continue;
      lines.push(formatVerseBlock(data.book, data.chapter, verse));
      count += 1;
      if (count >= maxVerses) break;
    }
    if (count >= maxVerses) break;
  }

  return lines.length > 0 ? lines.join("\n\n") : null;
}

export function buildScheduleJournalTitle(reading: ReadingSchedule) {
  return reading.passage;
}

export function createJournalPageFromSchedule(reading: ReadingSchedule): JournalPage {
  const { header, reflectionContent, passage } = buildScheduleJournalElements(reading);
  return createJournalPage({
    title: buildScheduleJournalTitle(reading),
    scheduleDate: reading.scheduledDate,
    passage,
    sheets: [
      createJournalSheet({
        elements: [
          createJournalElement({
            type: "text",
            x: 8,
            y: 6,
            width: 84,
            height: 12,
            rotation: 0,
            zIndex: 0,
            content: header,
            passageRef: passage,
            fontSize: 16,
            color: "#0f172a",
          }),
          createJournalElement({
            type: "text",
            x: 8,
            y: 20,
            width: 84,
            height: 70,
            rotation: 0,
            zIndex: 1,
            content: reflectionContent,
            fontSize: 15,
            color: "#334155",
          }),
        ],
      }),
      createJournalSheet(),
    ],
  });
}

export function buildScheduleJournalElements(reading: ReadingSchedule) {
  const header = `📖 ${reading.passage}`;
  const promptBlock = reading.reflectionPrompt.trim();
  const devotional = reading.devotional.trim();

  const reflectionContent = promptBlock
    ? `${promptBlock}${devotional ? `\n\n—\n${devotional}` : ""}`
    : devotional || "";

  return {
    header,
    reflectionContent,
    passage: reading.passage,
  };
}

export function passageSupportsVersePicker(passage: string) {
  const parsed = parsePassage(passage.replace(/[–—]/g, "-"));
  return Boolean(parsed && !parsed.endChapter);
}
