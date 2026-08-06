import { bookIntroHref, getBookWithIntro, searchBibleBookIntros } from "@/lib/bible-book-intros";
import { buildBacaHref } from "@/lib/baca-default-route";
import { getBibleCharacter, scoreCharacterSearch, searchBibleCharacters } from "@/lib/bible-characters";
import { getBibleCustom, searchBibleCustoms, scoreCustomTitleMatch } from "@/lib/bible-customs";
import { searchBibleGlossary } from "@/lib/bible-glossary";
import { searchBiblePlaces } from "@/lib/bible-places";
import { searchBible, type BibleSearchHit } from "@/lib/bible-search";
import { getBibleStory, scoreStorySearch, searchBibleStories } from "@/lib/bible-stories";
import { getBibleTopic, searchBibleTopics } from "@/lib/bible-topics";
import { copy } from "@/lib/copy";
import { getExploreNavChildren } from "@/lib/explore-nav";
import { normalizeSearch } from "@/lib/search-utils";

export type GlobalSearchResultKind =
  | "page"
  | "bible"
  | "book"
  | "character"
  | "story"
  | "topic"
  | "glossary"
  | "place"
  | "custom";

export type GlobalSearchResult = {
  id: string;
  kind: GlobalSearchResultKind;
  group: string;
  title: string;
  subtitle?: string;
  href: string;
};

export type GlobalSearchGroup = {
  id: string;
  label: string;
  results: GlobalSearchResult[];
};

type PendingSearchGroup = GlobalSearchGroup & {
  priority: number;
  defaultOrder: number;
};

const SEARCH_GROUP_DEFAULT_ORDER: Record<string, number> = {
  pages: 0,
  customs: 1,
  characters: 2,
  stories: 3,
  bible: 4,
  books: 5,
  topics: 6,
  glossary: 7,
  places: 8,
};

function orderSearchGroups(groups: PendingSearchGroup[]): GlobalSearchGroup[] {
  return groups
    .slice()
    .sort(
      (a, b) =>
        b.priority - a.priority || a.defaultOrder - b.defaultOrder,
    )
    .map(({ id, label, results }) => ({ id, label, results }));
}

const APP_PAGES: { title: string; href: string; keywords: string[] }[] = [
  { title: copy.nav.home, href: "/dashboard", keywords: ["beranda", "home"] },
  {
    title: copy.nav.read,
    href: buildBacaHref("Matius 1"),
    keywords: ["baca", "alkitab", "ayat", "pasal"],
  },
  { title: copy.nav.explore, href: "/explore", keywords: ["explore", "jelajah"] },
  { title: copy.nav.schedule, href: "/jadwal", keywords: ["jadwal", "rencana"] },
  { title: copy.nav.journal, href: "/jurnal", keywords: ["jurnal", "catatan"] },
  { title: copy.nav.group, href: "/kelompok", keywords: ["kelompok", "komunitas"] },
  { title: copy.nav.myReflections, href: "/refleksiku", keywords: ["refleksi"] },
  { title: copy.nav.chat, href: "/chat", keywords: ["chat", "pesan"] },
  { title: copy.nav.profile, href: "/profil", keywords: ["profil", "akun"] },
];

function normalize(value: string) {
  return normalizeSearch(value);
}

function bibleHitToResult(hit: BibleSearchHit): GlobalSearchResult {
  return {
    id: `bible-${hit.bookAbbr}-${hit.chapter}`,
    kind: "bible",
    group: copy.globalSearch.groupBible,
    title: hit.label,
    subtitle: hit.subtitle,
    href: buildBacaHref(hit.reference),
  };
}

type TopSearchRef =
  | { kind: "character"; slug: string }
  | { kind: "story"; slug: string }
  | { kind: "topic"; slug: string }
  | { kind: "bible"; reference: string }
  | { kind: "book"; abbr: string }
  | { kind: "glossary"; slug: string }
  | { kind: "place"; slug: string }
  | { kind: "custom"; slug: string };

/** Rekomendasi default — yang paling sering dicari di app ini. */
const TOP_SEARCH_REFS: TopSearchRef[] = [
  { kind: "character", slug: "yesus" },
  { kind: "character", slug: "daud" },
  { kind: "character", slug: "musa" },
  { kind: "character", slug: "paulus" },
  { kind: "character", slug: "tomas" },
  { kind: "character", slug: "maria" },
  { kind: "story", slug: "keluaran-mesir" },
  { kind: "story", slug: "penciptaan" },
  { kind: "story", slug: "salib-kebangkitan" },
  { kind: "custom", slug: "paskah" },
  { kind: "custom", slug: "sabat" },
  { kind: "bible", reference: "Yohanes 3" },
  { kind: "bible", reference: "Mazmur 23" },
  { kind: "bible", reference: "Kejadian 1" },
  { kind: "topic", slug: "kasih" },
  { kind: "topic", slug: "iman" },
  { kind: "topic", slug: "pengampunan" },
  { kind: "book", abbr: "Kej" },
  { kind: "book", abbr: "Mat" },
  { kind: "place", slug: "yerusalem" },
  { kind: "glossary", slug: "anugerah" },
];

function resolveTopSearch(ref: TopSearchRef): GlobalSearchResult | null {
  switch (ref.kind) {
    case "character": {
      const item = getBibleCharacter(ref.slug);
      if (!item) return null;
      return {
        id: `top-char-${item.slug}`,
        kind: "character",
        group: copy.globalSearch.groupCharacters,
        title: item.name,
        subtitle: item.role,
        href: `/baca/tokoh/${item.slug}`,
      };
    }
    case "story": {
      const item = getBibleStory(ref.slug);
      if (!item) return null;
      return {
        id: `top-story-${item.slug}`,
        kind: "story",
        group: copy.globalSearch.groupStories,
        title: item.title,
        subtitle: item.summary,
        href: `/baca/kisah/${item.slug}`,
      };
    }
    case "topic": {
      const item = getBibleTopic(ref.slug);
      if (!item) return null;
      return {
        id: `top-topic-${item.slug}`,
        kind: "topic",
        group: copy.globalSearch.groupTopics,
        title: item.title,
        subtitle: item.summary,
        href: `/baca/topik/${item.slug}`,
      };
    }
    case "bible": {
      const hit = searchBible(ref.reference, 1)[0];
      if (!hit) return null;
      return { ...bibleHitToResult(hit), id: `top-bible-${hit.bookAbbr}-${hit.chapter}` };
    }
    case "book": {
      const item = getBookWithIntro(ref.abbr);
      if (!item) return null;
      return {
        id: `top-book-${item.book.abbr}`,
        kind: "book",
        group: copy.globalSearch.groupBooks,
        title: item.book.name,
        subtitle: item.intro.summary,
        href: bookIntroHref(item.book.abbr),
      };
    }
    case "glossary": {
      const item = searchBibleGlossary(ref.slug).find((term) => term.slug === ref.slug);
      if (!item) return null;
      return {
        id: `top-term-${item.slug}`,
        kind: "glossary",
        group: copy.globalSearch.groupGlossary,
        title: item.term,
        subtitle: item.plainMeaning,
        href: `/baca/glosarium/${item.slug}`,
      };
    }
    case "place": {
      const item = searchBiblePlaces(ref.slug).find((place) => place.slug === ref.slug);
      if (!item) return null;
      return {
        id: `top-place-${item.slug}`,
        kind: "place",
        group: copy.globalSearch.groupPlaces,
        title: item.name,
        subtitle: item.blurb,
        href: `/baca/peta/${item.slug}`,
      };
    }
    case "custom": {
      const item = getBibleCustom(ref.slug);
      if (!item) return null;
      return {
        id: `top-custom-${item.slug}`,
        kind: "custom",
        group: copy.globalSearch.groupCustoms,
        title: item.title,
        subtitle: item.summary,
        href: `/baca/kebiasaan/${item.slug}`,
      };
    }
    default:
      return null;
  }
}

export function getGlobalSearchSuggestions(
  recent: GlobalSearchResult[] = [],
): GlobalSearchGroup[] {
  const groups: GlobalSearchGroup[] = [];

  if (recent.length > 0) {
    groups.push({
      id: "recent",
      label: copy.globalSearch.groupRecent,
      results: recent.map((item) => ({
        ...item,
        id: `recent-${item.href}`,
      })),
    });
  }

  const popular = TOP_SEARCH_REFS.map(resolveTopSearch).filter(
    (item): item is GlobalSearchResult => item != null,
  );
  const popularResults = popular.filter(
    (item) => !recent.some((entry) => entry.href === item.href),
  );

  if (popularResults.length > 0) {
    groups.push({
      id: "popular",
      label: copy.globalSearch.groupPopular,
      results: popularResults,
    });
  }

  return groups;
}

export function searchGlobal(
  query: string,
  limits: Partial<Record<GlobalSearchResultKind, number>> = {},
): GlobalSearchGroup[] {
  const q = query.trim();
  if (!q) return getGlobalSearchSuggestions();

  const perKind = {
    page: 3,
    bible: 5,
    book: 4,
    character: 4,
    story: 4,
    topic: 4,
    glossary: 4,
    place: 3,
    custom: 3,
    ...limits,
  };

  const nq = normalize(q);
  const pendingGroups: PendingSearchGroup[] = [];

  const pages: GlobalSearchResult[] = [];
  for (const page of APP_PAGES) {
    const haystack = [page.title, ...page.keywords].map(normalize).join(" ");
    if (page.title.toLowerCase().includes(q.toLowerCase()) || haystack.includes(nq)) {
      pages.push({
        id: `page-${page.href}`,
        kind: "page",
        group: copy.globalSearch.groupPages,
        title: page.title,
        href: page.href,
      });
    }
  }
  for (const item of getExploreNavChildren()) {
    if (normalize(item.label).includes(nq)) {
      pages.push({
        id: `explore-${item.href}`,
        kind: "page",
        group: copy.globalSearch.groupPages,
        title: item.label,
        subtitle: copy.nav.explore,
        href: item.href,
      });
    }
  }
  if (pages.length > 0) {
    pendingGroups.push({
      id: "pages",
      label: copy.globalSearch.groupPages,
      results: pages.slice(0, perKind.page),
      priority: 45,
      defaultOrder: SEARCH_GROUP_DEFAULT_ORDER.pages,
    });
  }

  const customItems = searchBibleCustoms(q);
  const customs = customItems
    .slice(0, perKind.custom)
    .map((item) => ({
      id: `custom-${item.slug}`,
      kind: "custom" as const,
      group: copy.globalSearch.groupCustoms,
      title: item.title,
      subtitle: item.summary,
      href: `/baca/kebiasaan/${item.slug}`,
    }));
  if (customs.length > 0) {
    pendingGroups.push({
      id: "customs",
      label: copy.globalSearch.groupCustoms,
      results: customs,
      priority: customItems.reduce(
        (best, item) => Math.max(best, scoreCustomTitleMatch(item, q)),
        0,
      ),
      defaultOrder: SEARCH_GROUP_DEFAULT_ORDER.customs,
    });
  }

  const characterItems = searchBibleCharacters(q);
  const characters = characterItems
    .slice(0, perKind.character)
    .map((item) => ({
      id: `char-${item.slug}`,
      kind: "character" as const,
      group: copy.globalSearch.groupCharacters,
      title: item.name,
      subtitle: item.role,
      href: `/baca/tokoh/${item.slug}`,
    }));
  if (characters.length > 0) {
    pendingGroups.push({
      id: "characters",
      label: copy.globalSearch.groupCharacters,
      results: characters,
      priority: characterItems.length
        ? scoreCharacterSearch(characterItems[0]!, q)
        : 0,
      defaultOrder: SEARCH_GROUP_DEFAULT_ORDER.characters,
    });
  }

  const storyItems = searchBibleStories(q);
  const stories = storyItems
    .slice(0, perKind.story)
    .map((item) => ({
      id: `story-${item.slug}`,
      kind: "story" as const,
      group: copy.globalSearch.groupStories,
      title: item.title,
      subtitle: item.summary,
      href: `/baca/kisah/${item.slug}`,
    }));
  if (stories.length > 0) {
    pendingGroups.push({
      id: "stories",
      label: copy.globalSearch.groupStories,
      results: stories,
      priority: storyItems.length ? scoreStorySearch(storyItems[0]!, q) : 0,
      defaultOrder: SEARCH_GROUP_DEFAULT_ORDER.stories,
    });
  }

  const bible = searchBible(q, perKind.bible).map(bibleHitToResult);
  if (bible.length > 0) {
    pendingGroups.push({
      id: "bible",
      label: copy.globalSearch.groupBible,
      results: bible,
      priority: 35,
      defaultOrder: SEARCH_GROUP_DEFAULT_ORDER.bible,
    });
  }

  const books = searchBibleBookIntros(q)
    .slice(0, perKind.book)
    .map(({ book, intro }) => ({
      id: `book-${book.abbr}`,
      kind: "book" as const,
      group: copy.globalSearch.groupBooks,
      title: book.name,
      subtitle: intro.summary,
      href: bookIntroHref(book.abbr),
    }));
  if (books.length > 0) {
    pendingGroups.push({
      id: "books",
      label: copy.globalSearch.groupBooks,
      results: books,
      priority: 35,
      defaultOrder: SEARCH_GROUP_DEFAULT_ORDER.books,
    });
  }

  const topics = searchBibleTopics(q)
    .slice(0, perKind.topic)
    .map((item) => ({
      id: `topic-${item.slug}`,
      kind: "topic" as const,
      group: copy.globalSearch.groupTopics,
      title: item.title,
      subtitle: item.summary,
      href: `/baca/topik/${item.slug}`,
    }));
  if (topics.length > 0) {
    pendingGroups.push({
      id: "topics",
      label: copy.globalSearch.groupTopics,
      results: topics,
      priority: 30,
      defaultOrder: SEARCH_GROUP_DEFAULT_ORDER.topics,
    });
  }

  const glossary = searchBibleGlossary(q)
    .slice(0, perKind.glossary)
    .map((item) => ({
      id: `term-${item.slug}`,
      kind: "glossary" as const,
      group: copy.globalSearch.groupGlossary,
      title: item.term,
      subtitle: item.plainMeaning,
      href: `/baca/glosarium/${item.slug}`,
    }));
  if (glossary.length > 0) {
    pendingGroups.push({
      id: "glossary",
      label: copy.globalSearch.groupGlossary,
      results: glossary,
      priority: 30,
      defaultOrder: SEARCH_GROUP_DEFAULT_ORDER.glossary,
    });
  }

  const places = searchBiblePlaces(q)
    .slice(0, perKind.place)
    .map((item) => ({
      id: `place-${item.slug}`,
      kind: "place" as const,
      group: copy.globalSearch.groupPlaces,
      title: item.name,
      subtitle: item.blurb,
      href: `/baca/peta/${item.slug}`,
    }));
  if (places.length > 0) {
    pendingGroups.push({
      id: "places",
      label: copy.globalSearch.groupPlaces,
      results: places,
      priority: 30,
      defaultOrder: SEARCH_GROUP_DEFAULT_ORDER.places,
    });
  }

  return orderSearchGroups(pendingGroups);
}

export function flattenGlobalSearchGroups(groups: GlobalSearchGroup[]) {
  return groups.flatMap((group) => group.results);
}
