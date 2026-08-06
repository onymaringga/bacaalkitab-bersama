import { BIBLE_BOOK_CHARACTERS } from "@/lib/bible-book-characters";
import { getCharacterImage } from "@/lib/bible-character-images";
import {
  BIBLE_CHARACTERS,
  getBibleCharacter,
  type BibleCharacter,
} from "@/lib/bible-characters";
import { getStoryImage } from "@/lib/bible-story-images";
import {
  BIBLE_STORIES,
  type BibleStory,
} from "@/lib/bible-stories";
import { parsePassage } from "@/lib/passage-parser";

export type PassageRelatedVisual = {
  type: "story" | "character";
  slug: string;
  title: string;
  hook: string;
  href: string;
  image: { src: string; fallbackSrc: string; alt: string };
  /** Pasal cocok langsung, atau fallback tokoh utama kitab. */
  match: "chapter" | "book";
};

function chapterPrefixFromPassage(passage: string) {
  const parsed = parsePassage(passage);
  if (!parsed) return null;
  return `${parsed.bookName} ${parsed.chapter}`;
}

function passageMatchesChapter(passageRef: string, chapterPrefix: string) {
  const normalized = passageRef.trim();
  if (normalized === chapterPrefix) return true;
  if (normalized.startsWith(`${chapterPrefix}:`)) return true;
  if (chapterPrefix.startsWith(`${normalized} `)) return true;
  return false;
}

function findStoryForChapter(chapterPrefix: string): BibleStory | null {
  const exact = BIBLE_STORIES.find((story) =>
    story.keyPassages.some((item) =>
      passageMatchesChapter(item.passage, chapterPrefix),
    ),
  );
  if (exact) return exact;

  return (
    BIBLE_STORIES.find((story) =>
      story.keyMoments?.some(
        (moment) =>
          moment.passage &&
          passageMatchesChapter(moment.passage, chapterPrefix),
      ),
    ) ?? null
  );
}

function characterMatchesChapter(
  character: BibleCharacter,
  chapterPrefix: string,
) {
  const verses = [
    character.verse,
    ...(character.verses ?? []),
  ].filter(Boolean);

  if (
    verses.some(
      (verse) =>
        verse?.passage && passageMatchesChapter(verse.passage, chapterPrefix),
    )
  ) {
    return true;
  }

  return (character.keyMoments ?? []).some(
    (moment) =>
      moment.passage && passageMatchesChapter(moment.passage, chapterPrefix),
  );
}

function findCharacterForChapter(chapterPrefix: string): BibleCharacter | null {
  return (
    BIBLE_CHARACTERS.find((character) =>
      characterMatchesChapter(character, chapterPrefix),
    ) ?? null
  );
}

function resolveCharacterSlugFromName(name: string) {
  const primary = name.split(/[&(,]/)[0]!.trim();
  if (!primary) return null;

  const exact = BIBLE_CHARACTERS.find(
    (character) => character.name.toLowerCase() === primary.toLowerCase(),
  );
  if (exact) return exact.slug;

  const partial = BIBLE_CHARACTERS.find(
    (character) =>
      character.name.toLowerCase().startsWith(primary.toLowerCase()) ||
      character.alsoCalled?.some((alias) =>
        alias.toLowerCase().includes(primary.toLowerCase()),
      ),
  );
  return partial?.slug ?? null;
}

function findBookFallbackCharacter(bookAbbr: string): BibleCharacter | null {
  const roster = BIBLE_BOOK_CHARACTERS[bookAbbr];
  if (!roster?.length) return null;

  for (const entry of roster) {
    const slug = resolveCharacterSlugFromName(entry.name);
    if (!slug) continue;
    const character = getBibleCharacter(slug);
    if (character) return character;
  }

  return null;
}

function storyVisual(story: BibleStory, match: "chapter" | "book") {
  const image = getStoryImage(story.slug, story.title);
  return {
    type: "story" as const,
    slug: story.slug,
    title: story.title,
    hook: story.summary,
    href: `/baca/kisah/${story.slug}`,
    image: {
      src: image.src,
      fallbackSrc: image.fallbackSrc,
      alt: image.alt,
    },
    match,
  };
}

function characterVisual(
  character: BibleCharacter,
  match: "chapter" | "book",
  hookOverride?: string,
) {
  const image = getCharacterImage(
    character.slug,
    character.name,
    character.category,
  );
  return {
    type: "character" as const,
    slug: character.slug,
    title: character.name,
    hook: hookOverride ?? character.summary,
    href: `/baca/tokoh/${character.slug}`,
    image: {
      src: image.src,
      fallbackSrc: image.fallbackSrc,
      alt: image.alt,
    },
    match,
  };
}

/** Visual terkait pasal — kisah, tokoh, atau tokoh utama kitab. */
export function getPassageRelatedVisual(
  passage: string,
): PassageRelatedVisual | null {
  const chapterPrefix = chapterPrefixFromPassage(passage);
  const parsed = parsePassage(passage);
  if (!chapterPrefix || !parsed) return null;

  const story = findStoryForChapter(chapterPrefix);
  if (story) return storyVisual(story, "chapter");

  const character = findCharacterForChapter(chapterPrefix);
  if (character) return characterVisual(character, "chapter");

  const bookCharacter = findBookFallbackCharacter(parsed.bookAbbr);
  if (bookCharacter) {
    const roster = BIBLE_BOOK_CHARACTERS[parsed.bookAbbr];
    const rosterEntry = roster?.find((entry) =>
      resolveCharacterSlugFromName(entry.name) === bookCharacter.slug,
    );
    const hook = rosterEntry
      ? `${rosterEntry.role} — tokoh utama dalam kitab ${parsed.bookName}.`
      : bookCharacter.summary;
    return characterVisual(bookCharacter, "book", hook);
  }

  return null;
}
