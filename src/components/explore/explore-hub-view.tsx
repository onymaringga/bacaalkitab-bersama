"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  ChevronRight,
  Compass,
  Flame,
  GitBranch,
  Lightbulb,
  Library,
  MapPinned,
  Scroll,
  ScrollText,
  Sparkles,
  Users,
} from "lucide-react";

import { CharacterPortrait } from "@/components/characters/character-portrait";
import {
  PortalAiDisclaimer,
  PortalArticleCard,
  PortalArticleRow,
  PortalHeroBanner,
  PortalSectionHeader,
} from "@/components/explore/explore-portal-shell";
import { copy } from "@/lib/copy";
import { BIBLE_BOOKS } from "@/lib/bible-books";
import { getCharacterCount } from "@/lib/bible-characters";
import { getCustomCount } from "@/lib/bible-customs";
import { getGenealogyCount } from "@/lib/bible-genealogy";
import { getGlossaryCount } from "@/lib/bible-glossary";
import { getPlaceCount, getStoryCount } from "@/lib/bible-places";
import { getStoryCount as getImportantStoryCount } from "@/lib/bible-stories";
import { getTopicCount } from "@/lib/bible-topics";
import {
  getCharacterOneLineInsight,
  getExploreCharacterSpotlight,
  getExploreDidYouKnowBundle,
  getExplorePortalArticles,
  getExplorePortalHero,
  getExploreSpotlightContent,
  getTopExploreCharacters,
  passagePrefixFromReference,
} from "@/lib/explore-hub-content";
import { getTodayKey } from "@/lib/reading-status";

type ExploreGroupId = "word" | "stories" | "context";

type ExploreDestination = {
  id: string;
  href: string;
  title: string;
  description: string;
  meta: string;
  icon: LucideIcon;
  group: ExploreGroupId;
};

const EXPLORE_DESTINATIONS: ExploreDestination[] = [
  {
    id: "kitab",
    href: "/baca/kitab",
    title: copy.bookIntro.title,
    description: copy.bookIntro.subtitleShort,
    meta: `${BIBLE_BOOKS.length} kitab`,
    icon: Scroll,
    group: "word",
  },
  {
    id: "topik",
    href: "/baca/topik",
    title: copy.topics.title,
    description: copy.topics.subtitleShort,
    meta: copy.topics.catalogCount(getTopicCount()),
    icon: Compass,
    group: "word",
  },
  {
    id: "glosarium",
    href: "/baca/glosarium",
    title: copy.glossary.title,
    description: copy.glossary.subtitleShort,
    meta: copy.glossary.catalogCount(getGlossaryCount()),
    icon: Library,
    group: "word",
  },
  {
    id: "kisah",
    href: "/baca/kisah",
    title: copy.stories.title,
    description: copy.stories.subtitleShort,
    meta: copy.stories.catalogCount(getImportantStoryCount()),
    icon: ScrollText,
    group: "stories",
  },
  {
    id: "tokoh",
    href: "/baca/tokoh",
    title: copy.characters.title,
    description: copy.characters.subtitleShort,
    meta: copy.characters.catalogCount(getCharacterCount()),
    icon: Users,
    group: "stories",
  },
  {
    id: "kebiasaan",
    href: "/baca/kebiasaan",
    title: copy.customs.title,
    description: copy.customs.subtitleShort,
    meta: copy.customs.catalogCount(getCustomCount()),
    icon: Flame,
    group: "context",
  },
  {
    id: "peta",
    href: "/baca/peta",
    title: copy.places.title,
    description: copy.places.subtitleShort,
    meta: copy.places.catalogCount(getPlaceCount(), getStoryCount()),
    icon: MapPinned,
    group: "context",
  },
  {
    id: "silsilah",
    href: "/baca/silsilah",
    title: copy.genealogy.title,
    description: copy.genealogy.subtitleShort,
    meta: copy.genealogy.catalogCount(getGenealogyCount()),
    icon: GitBranch,
    group: "context",
  },
];

function CategoryIndexTile({ item }: { item: ExploreDestination }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="group flex items-start gap-3 rounded-xl border border-[var(--m-line)] bg-white p-3.5 transition hover:border-[var(--m-accent)]/30"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--m-wash)] text-[var(--m-accent)]">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
            {item.title}
          </p>
          <span className="shrink-0 text-[10px] tabular-nums text-[var(--m-ink-soft)]">
            {item.meta}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--m-ink-soft)]">
          {item.description}
        </p>
      </div>
    </Link>
  );
}

function PortalDidYouKnow() {
  const bundle = useMemo(() => getExploreDidYouKnowBundle(getTodayKey()), []);
  const { primary, deeperContext } = bundle;
  const href = primary.reference
    ? `/baca?browse=1&passage=${encodeURIComponent(passagePrefixFromReference(primary.reference) ?? primary.reference)}`
    : "/explore";

  return (
    <aside className="rounded-xl border border-[var(--m-line)] bg-gradient-to-br from-[#f3ebe0] via-white to-[#e8f0ea] p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-[var(--m-accent)]/10 text-[var(--m-accent)]">
          <Lightbulb className="size-4" />
        </span>
        <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
          {copy.explore.didYouKnowTitle}
        </p>
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug text-[var(--m-ink)]">
        {primary.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--m-ink-soft)]">
        {primary.body}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-[var(--m-ink)]/85">
        {deeperContext}
      </p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--m-accent)] hover:underline"
      >
        {copy.explore.didYouKnowCta}
        <ArrowUpRight className="size-3.5" />
      </Link>
    </aside>
  );
}

function PortalCharacterSpotlight() {
  const spotlight = useMemo(
    () => getExploreCharacterSpotlight(getTodayKey()),
    [],
  );
  const content = useMemo(
    () => (spotlight ? getExploreSpotlightContent(spotlight) : null),
    [spotlight],
  );

  if (!content) return null;

  const { character, storyParagraphs } = content;
  const teaser = storyParagraphs[0] ?? getCharacterOneLineInsight(character);

  return (
    <Link
      href={`/baca/tokoh/${character.slug}`}
      className="group flex gap-3 rounded-xl border border-[var(--m-line)] bg-white p-4 transition hover:border-[var(--m-accent)]/30"
    >
      <CharacterPortrait
        slug={character.slug}
        name={character.name}
        category={character.category}
        variant="thumb"
        className="size-16 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold tracking-wide text-[var(--m-accent)] uppercase">
          {copy.explore.sneakPeekEyebrow}
        </p>
        <p className="mt-0.5 text-base font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
          {character.name}
        </p>
        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-[var(--m-ink-soft)]">
          {teaser}
        </p>
      </div>
    </Link>
  );
}

/** Hub Explore — gaya portal berita / ensiklopedia. */
export function ExploreHubView() {
  const dateKey = getTodayKey();
  const heroData = useMemo(() => getExplorePortalHero(dateKey), [dateKey]);
  const articles = useMemo(() => getExplorePortalArticles(dateKey, 10), [dateKey]);
  const [leadArticle, ...restArticles] = articles;
  const sideArticles = restArticles.slice(0, 4);
  const moreArticles = restArticles.slice(4);

  const statsLine = copy.explore.statsSummary(
    BIBLE_BOOKS.length,
    getTopicCount(),
    getCharacterCount(),
    getImportantStoryCount(),
    getGlossaryCount(),
  );

  const hero = heroData
    ? { ...heroData, eyebrow: copy.explore.portalHeroEyebrow }
    : null;

  return (
    <div className="member-web-animate-in mx-auto w-full max-w-6xl space-y-8 pb-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--m-line)] pb-4">
        <div>
          <p className="member-web-kicker text-[var(--m-accent)]">
            {copy.explore.eyebrow}
          </p>
          <h1 className="member-web-display mt-0.5 text-[clamp(1.85rem,3.2vw,2.5rem)] leading-tight text-[var(--m-ink)]">
            {copy.explore.title} Alkitab
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--m-ink-soft)]">
            {copy.explore.subtitle}
          </p>
        </div>
        <p className="inline-flex items-center gap-1.5 rounded-full border border-[var(--m-line)] bg-white px-3 py-1.5 text-xs text-[var(--m-ink-soft)]">
          <Sparkles className="size-3.5 text-[var(--m-accent)]" aria-hidden />
          {statsLine}
        </p>
      </header>

      {hero ? <PortalHeroBanner hero={hero} /> : null}

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="space-y-8">
          <section className="space-y-4">
            <PortalSectionHeader
              title={copy.explore.highlightsTitle}
              hint={copy.explore.featuredHint}
            />
            {leadArticle ? (
              <PortalArticleCard article={leadArticle} featured />
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              {sideArticles.map((article) => (
                <PortalArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>

          {moreArticles.length > 0 ? (
            <section className="space-y-1">
              <PortalSectionHeader title={copy.explore.sectionStories} />
              {moreArticles.map((article) => (
                <PortalArticleRow key={article.id} article={article} />
              ))}
            </section>
          ) : null}
        </div>

        <div className="space-y-6 lg:sticky lg:top-24">
          <PortalDidYouKnow />
          <PortalCharacterSpotlight />

          <section className="space-y-3">
            <PortalSectionHeader title={copy.explore.popularTitle} />
            <ul className="divide-y divide-[var(--m-line)] rounded-xl border border-[var(--m-line)] bg-white px-3">
              {copy.explore.popularLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between gap-2 py-2.5 text-sm font-medium text-[var(--m-ink)] transition hover:text-[var(--m-accent)]"
                  >
                    {link.label}
                    <ChevronRight className="size-4 shrink-0 opacity-40" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <PortalSectionHeader
              title={copy.explore.topCharactersTitle}
              href="/baca/tokoh"
            />
            <ul className="space-y-2">
              {getTopExploreCharacters(5).map((character, index) => (
                <li key={character.slug}>
                  <Link
                    href={`/baca/tokoh/${character.slug}`}
                    className="group flex items-center gap-2.5 rounded-lg border border-[var(--m-line)] bg-white px-2.5 py-2 transition hover:border-[var(--m-accent)]/30"
                  >
                    <span className="w-4 shrink-0 text-center text-[11px] font-bold tabular-nums text-[var(--m-accent)]">
                      {index + 1}
                    </span>
                    <CharacterPortrait
                      slug={character.slug}
                      name={character.name}
                      category={character.category}
                      variant="thumb"
                      className="size-8 shrink-0"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
                      {character.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="space-y-4">
        <PortalSectionHeader
          title={copy.explore.browseIndexTitle}
          hint="Delapan pintu masuk ensiklopedia Alkitab"
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {EXPLORE_DESTINATIONS.map((item) => (
            <CategoryIndexTile key={item.id} item={item} />
          ))}
        </div>
      </section>

      <PortalAiDisclaimer />
    </div>
  );
}
