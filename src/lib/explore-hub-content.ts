import {
  BIBLE_CHARACTERS,
  getBibleCharacter,
  getCharacterVerses,
  type BibleCharacter,
  type BibleCharacterMoment,
  type BibleCharacterVerse,
} from "@/lib/bible-characters";
import {
  BIBLE_DAILY_FACTS,
  getDailyBibleFact,
  getDailyFactIndex,
  type BibleDailyFact,
} from "@/lib/bible-daily-facts";
import { BIBLE_STORIES, type BibleStory } from "@/lib/bible-stories";
import { getTodayKey } from "@/lib/reading-status";

/** Tokoh paling sering dicari / populer di Explore. */
export const TOP_CHARACTER_SLUGS = [
  "abraham",
  "musa",
  "daud",
  "yusuf",
  "petrus",
  "paulus",
  "ester",
  "rut",
  "maria",
  "yohanes-rasul",
] as const;

const SPOTLIGHT_POOL = BIBLE_CHARACTERS.filter(
  (character) => character.featured || character.story.trim().length > 80,
);

export type ExploreSpotlightContent = {
  character: BibleCharacter;
  storyParagraphs: string[];
  whyItMatters: string;
  keyVerse: BibleCharacterVerse | null;
  extraVerses: BibleCharacterVerse[];
  lessons: string[];
  keyMoments: BibleCharacterMoment[];
  relatedStory: Pick<BibleStory, "slug" | "title" | "summary"> | null;
};

export type ExploreDidYouKnowBundle = {
  primary: BibleDailyFact;
  /** Konteks tambahan dari kisah terkait atau fakta tematik. */
  deeperContext: string;
  /** Fakta pendamping — buku atau tema yang sama jika memungkinkan. */
  relatedFact: BibleDailyFact;
  relatedStory: Pick<BibleStory, "slug" | "title"> | null;
};

function dayIndex(dateKey: string, modulo: number) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const utc = Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1);
  const dayNumber = Math.floor(utc / 86_400_000);
  return ((dayNumber % modulo) + modulo) % modulo;
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  const slice = text.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > maxLength * 0.55 ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

function splitStoryParagraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function passagePrefixFromReference(reference?: string) {
  if (!reference) return null;
  return reference.split(/[–—-]/)[0]!.trim().split(":")[0]!.trim();
}

function findStoryForReference(reference?: string) {
  const prefix = passagePrefixFromReference(reference);
  if (!prefix) return null;

  return (
    BIBLE_STORIES.find((story) =>
      story.keyPassages.some((passage) => passage.passage.startsWith(prefix)),
    ) ??
    BIBLE_STORIES.find((story) =>
      story.keyMoments?.some((moment) => moment.passage?.startsWith(prefix)),
    ) ??
    null
  );
}

function findStoryForCharacter(character: BibleCharacter) {
  const linked = BIBLE_STORIES.filter((story) =>
    story.relatedCharacterSlugs?.includes(character.slug),
  );
  return linked.find((story) => story.featured) ?? linked[0] ?? null;
}

function findRelatedDailyFact(primary: BibleDailyFact, dateKey: string) {
  const primaryPrefix = passagePrefixFromReference(primary.reference);
  const byBook = BIBLE_DAILY_FACTS.find(
    (fact) =>
      fact.id !== primary.id &&
      primaryPrefix &&
      fact.reference?.startsWith(primaryPrefix),
  );
  if (byBook) return byBook;

  const index = getDailyFactIndex(dateKey);
  const offset = 11;
  return BIBLE_DAILY_FACTS[(index + offset) % BIBLE_DAILY_FACTS.length]!;
}

/** @deprecated Prefer getExploreSpotlightContent for richer previews. */
export function getCharacterStoryPreview(character: BibleCharacter, maxLength = 320) {
  const firstParagraph =
    splitStoryParagraphs(character.story)[0] ?? character.summary;

  if (firstParagraph.length <= maxLength) return firstParagraph;
  return truncateText(firstParagraph, maxLength);
}

export function getCharacterSpotlightStory(
  character: BibleCharacter,
  maxParagraphs = 2,
  maxTotalLength = 620,
) {
  const paragraphs = splitStoryParagraphs(character.story).slice(0, maxParagraphs);
  if (paragraphs.length === 0) return [character.summary];

  const combined = paragraphs.join("\n\n");
  if (combined.length <= maxTotalLength) return paragraphs;

  if (paragraphs.length === 1) {
    return [truncateText(paragraphs[0]!, maxTotalLength)];
  }

  const first = paragraphs[0]!;
  const remaining = maxTotalLength - first.length - 2;
  const second =
    remaining > 120 ? truncateText(paragraphs[1]!, remaining) : null;

  return second ? [first, second] : [truncateText(first, maxTotalLength)];
}

export function getCharacterWhyItMatters(character: BibleCharacter) {
  if (character.reflection) {
    const firstParagraph = splitStoryParagraphs(character.reflection)[0];
    if (firstParagraph) return truncateText(firstParagraph, 200);
  }

  if (character.lessons?.[0]) return character.lessons[0];
  return character.summary;
}

export function getCharacterOneLineInsight(character: BibleCharacter) {
  return character.lessons?.[0] ?? character.summary;
}

export function getExploreSpotlightContent(
  character: BibleCharacter,
): ExploreSpotlightContent {
  const verses = getCharacterVerses(character);
  const relatedStory = findStoryForCharacter(character);

  return {
    character,
    storyParagraphs: getCharacterSpotlightStory(character),
    whyItMatters: getCharacterWhyItMatters(character),
    keyVerse: verses[0] ?? null,
    extraVerses: verses.slice(1, 2),
    lessons: (character.lessons ?? []).slice(0, 2),
    keyMoments: (character.keyMoments ?? []).slice(0, 2),
    relatedStory: relatedStory
      ? {
          slug: relatedStory.slug,
          title: relatedStory.title,
          summary: truncateText(relatedStory.summary, 140),
        }
      : null,
  };
}

export function getExploreCharacterSpotlight(dateKey = getTodayKey()) {
  if (SPOTLIGHT_POOL.length === 0) return null;
  const index = dayIndex(dateKey, SPOTLIGHT_POOL.length);
  return SPOTLIGHT_POOL[index] ?? null;
}

export function getTopExploreCharacters(limit = 8) {
  const picked: BibleCharacter[] = [];

  for (const slug of TOP_CHARACTER_SLUGS) {
    const character = getBibleCharacter(slug);
    if (character) picked.push(character);
    if (picked.length >= limit) break;
  }

  return picked;
}

export function getExploreDidYouKnow(dateKey = getTodayKey()) {
  return getDailyBibleFact(dateKey);
}

export function getExploreDidYouKnowBundle(
  dateKey = getTodayKey(),
): ExploreDidYouKnowBundle {
  const primary = getDailyBibleFact(dateKey);
  const relatedStory = findStoryForReference(primary.reference);
  const relatedFact = findRelatedDailyFact(primary, dateKey);

  const deeperContext =
    relatedStory?.lessons?.[0] ??
    relatedStory?.summary ??
    relatedFact.body;

  return {
    primary,
    deeperContext: truncateText(deeperContext, 220),
    relatedFact,
    relatedStory: relatedStory
      ? { slug: relatedStory.slug, title: relatedStory.title }
      : null,
  };
}
