"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Compass,
  Flame,
  GitBranch,
  Info,
  Library,
  Lightbulb,
  MapPinned,
  Quote,
  Scroll,
  ScrollText,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { CharacterPortrait } from "@/components/characters/character-portrait";
import { copy } from "@/lib/copy";
import { BIBLE_BOOKS } from "@/lib/bible-books";
import { getCharacterCount, getCharacterCategory, characterVerseHref } from "@/lib/bible-characters";
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
  getExploreSpotlightContent,
  getTopExploreCharacters,
  passagePrefixFromReference,
} from "@/lib/explore-hub-content";
import { getTodayKey } from "@/lib/reading-status";
import { cn } from "@/lib/utils";

type ExploreGroupId = "word" | "stories" | "context";

type ExploreDestination = {
  id: string;
  href: string;
  title: string;
  description: string;
  meta: string;
  icon: LucideIcon;
  group: ExploreGroupId;
  tone: {
    card: string;
    icon: string;
  };
};

type ExploreGroup = {
  id: ExploreGroupId;
  label: string;
  hint: string;
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
    tone: {
      card: "from-amber-50/90 to-orange-50/60",
      icon: "bg-amber-100 text-amber-800",
    },
  },
  {
    id: "topik",
    href: "/baca/topik",
    title: copy.topics.title,
    description: copy.topics.subtitleShort,
    meta: copy.topics.catalogCount(getTopicCount()),
    icon: Compass,
    group: "word",
    tone: {
      card: "from-sky-50/90 to-indigo-50/60",
      icon: "bg-sky-100 text-sky-700",
    },
  },
  {
    id: "kebiasaan",
    href: "/baca/kebiasaan",
    title: copy.customs.title,
    description: copy.customs.subtitleShort,
    meta: copy.customs.catalogCount(getCustomCount()),
    icon: Flame,
    group: "context",
    tone: {
      card: "from-stone-50/90 to-amber-50/60",
      icon: "bg-stone-100 text-stone-800",
    },
  },
  {
    id: "glosarium",
    href: "/baca/glosarium",
    title: copy.glossary.title,
    description: copy.glossary.subtitleShort,
    meta: copy.glossary.catalogCount(getGlossaryCount()),
    icon: Library,
    group: "word",
    tone: {
      card: "from-violet-50/90 to-purple-50/60",
      icon: "bg-violet-100 text-violet-700",
    },
  },
  {
    id: "kisah",
    href: "/baca/kisah",
    title: copy.stories.title,
    description: copy.stories.subtitleShort,
    meta: copy.stories.catalogCount(getImportantStoryCount()),
    icon: ScrollText,
    group: "stories",
    tone: {
      card: "from-orange-50/90 to-rose-50/60",
      icon: "bg-orange-100 text-orange-800",
    },
  },
  {
    id: "tokoh",
    href: "/baca/tokoh",
    title: copy.characters.title,
    description: copy.characters.subtitleShort,
    meta: copy.characters.catalogCount(getCharacterCount()),
    icon: Users,
    group: "stories",
    tone: {
      card: "from-emerald-50/90 to-teal-50/60",
      icon: "bg-emerald-100 text-emerald-700",
    },
  },
  {
    id: "peta",
    href: "/baca/peta",
    title: copy.places.title,
    description: copy.places.subtitleShort,
    meta: copy.places.catalogCount(getPlaceCount(), getStoryCount()),
    icon: MapPinned,
    group: "context",
    tone: {
      card: "from-teal-50/90 to-cyan-50/60",
      icon: "bg-teal-100 text-teal-700",
    },
  },
  {
    id: "silsilah",
    href: "/baca/silsilah",
    title: copy.genealogy.title,
    description: copy.genealogy.subtitleShort,
    meta: copy.genealogy.catalogCount(getGenealogyCount()),
    icon: GitBranch,
    group: "context",
    tone: {
      card: "from-orange-50/90 to-amber-50/60",
      icon: "bg-orange-100 text-orange-800",
    },
  },
];

const EXPLORE_GROUPS: ExploreGroup[] = [
  {
    id: "word",
    label: copy.explore.sectionWord,
    hint: copy.explore.sectionWordHint,
  },
  {
    id: "stories",
    label: copy.explore.sectionStories,
    hint: copy.explore.sectionStoriesHint,
  },
  {
    id: "context",
    label: copy.explore.sectionContext,
    hint: copy.explore.sectionContextHint,
  },
];

function ExploreGridCard({ item }: { item: ExploreDestination }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex h-full min-h-[9rem] flex-col overflow-hidden rounded-2xl border border-[var(--m-line)] bg-gradient-to-br transition hover:border-[var(--m-accent)]/25 hover:shadow-sm",
        item.tone.card,
      )}
    >
      <div className="flex flex-1 flex-col p-4 sm:p-4.5">
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              item.tone.icon,
            )}
          >
            <Icon className="size-4.5" aria-hidden />
          </span>
          <span className="rounded-full border border-[var(--m-line)] bg-white/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
            {item.meta}
          </span>
        </div>
        <p className="mt-3 font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
          {item.title}
        </p>
        <p className="mt-1 flex-1 text-sm leading-snug text-[var(--m-ink-soft)]">
          {item.description}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--m-accent)]">
          {copy.explore.openDestination}
          <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

function ExploreCharacterSpotlight() {
  const spotlight = useMemo(
    () => getExploreCharacterSpotlight(getTodayKey()),
    [],
  );

  const content = useMemo(
    () => (spotlight ? getExploreSpotlightContent(spotlight) : null),
    [spotlight],
  );

  if (!content) return null;

  const { character, storyParagraphs, whyItMatters, keyVerse, extraVerses, lessons, keyMoments, relatedStory } =
    content;
  const category = getCharacterCategory(character.category);

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
        <CharacterPortrait
          slug={character.slug}
          name={character.name}
          category={character.category}
          variant="thumb"
          className="mx-auto size-24 shrink-0 sm:mx-0 sm:size-28"
        />
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-[var(--m-accent)] uppercase">
              {copy.explore.sneakPeekEyebrow}
            </p>
            <h2 className="member-web-display mt-1 text-2xl leading-tight text-[var(--m-ink)]">
              {character.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-[var(--m-ink-soft)]">
              {character.role}
              <span className="mx-1.5 text-[var(--m-line)]">·</span>
              {category.label}
            </p>
          </div>

          <div className="space-y-2.5">
            {storyParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-sm leading-relaxed text-[var(--m-ink)]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="rounded-xl border border-[var(--m-line)]/70 bg-white/70 px-3.5 py-3">
            <p className="text-[11px] font-semibold tracking-wide text-[var(--m-accent)] uppercase">
              {copy.explore.whyItMattersLabel}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--m-ink-soft)]">
              {whyItMatters}
            </p>
          </div>

          {keyVerse ? (
            <blockquote className="rounded-xl border border-[var(--m-line)]/70 bg-white/60 px-3.5 py-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[var(--m-accent)] uppercase">
                <Quote className="size-3.5" aria-hidden />
                {copy.explore.keyVerseLabel}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--m-ink)] italic">
                &ldquo;{keyVerse.text}&rdquo;
              </p>
              <Link
                href={characterVerseHref(keyVerse)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--m-accent)] transition hover:underline"
              >
                {keyVerse.reference}
                <ArrowUpRight className="size-3" />
              </Link>
            </blockquote>
          ) : null}

          {lessons.length > 0 ? (
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                {copy.explore.lifeLessonLabel}
              </p>
              <ul className="mt-2 space-y-1.5">
                {lessons.map((lesson) => (
                  <li
                    key={lesson}
                    className="flex gap-2 text-sm leading-snug text-[var(--m-ink)]"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--m-accent)]" />
                    {lesson}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {keyMoments.length > 0 ? (
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                {copy.explore.keyMomentsLabel}
              </p>
              <ul className="mt-2 space-y-2">
                {keyMoments.map((moment) => (
                  <li
                    key={moment.title}
                    className="rounded-lg border border-[var(--m-line)]/60 bg-white/50 px-3 py-2"
                  >
                    <p className="text-sm font-semibold text-[var(--m-ink)]">
                      {moment.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[var(--m-ink-soft)]">
                      {moment.summary}
                      {moment.reference ? (
                        <span className="ml-1 font-medium text-[var(--m-accent)]">
                          · {moment.reference}
                        </span>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {relatedStory ? (
            <div className="rounded-xl border border-orange-200/60 bg-orange-50/40 px-3.5 py-3">
              <p className="text-[11px] font-semibold tracking-wide text-orange-800/80 uppercase">
                {copy.explore.relatedStoryLabel}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--m-ink)]">
                {relatedStory.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--m-ink-soft)]">
                {relatedStory.summary}
              </p>
              <Link
                href={`/baca/kisah/${relatedStory.slug}`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--m-accent)] transition hover:underline"
              >
                {copy.explore.readStoryCta}
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          ) : null}

          {extraVerses.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {extraVerses.map((verse) => (
                <Link
                  key={verse.reference}
                  href={characterVerseHref(verse)}
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--m-line)] bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[var(--m-accent)] transition hover:border-[var(--m-accent)]/30"
                >
                  {verse.reference}
                  <ArrowUpRight className="size-3" />
                </Link>
              ))}
            </div>
          ) : null}

          <Link
            href={`/baca/tokoh/${character.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--m-accent)] transition hover:underline"
          >
            {copy.explore.sneakPeekCta}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function ExploreTopCharacters() {
  const characters = useMemo(() => getTopExploreCharacters(8), []);

  return (
    <section className="rounded-2xl border border-[var(--m-line)] bg-white/90 p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--m-wash)] text-[var(--m-accent)]">
          <TrendingUp className="size-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[var(--m-ink)]">
            {copy.explore.topCharactersTitle}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--m-ink-soft)]">
            {copy.explore.topCharactersHint}
          </p>
        </div>
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {characters.map((character, index) => (
          <li key={character.slug}>
            <Link
              href={`/baca/tokoh/${character.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/25 px-3 py-2.5 transition hover:border-[var(--m-accent)]/30 hover:bg-[var(--m-wash)]/60"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold tabular-nums text-[var(--m-accent)] ring-1 ring-[var(--m-line)]">
                {index + 1}
              </span>
              <CharacterPortrait
                slug={character.slug}
                name={character.name}
                category={character.category}
                variant="thumb"
                className="size-10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
                  {character.name}
                </p>
                <p className="truncate text-[11px] text-[var(--m-ink-soft)]">
                  {character.role}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[var(--m-ink)]/80">
                  {getCharacterOneLineInsight(character)}
                </p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-[var(--m-ink-soft)]/40 group-hover:text-[var(--m-accent)]" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExploreDidYouKnow() {
  const bundle = useMemo(() => getExploreDidYouKnowBundle(getTodayKey()), []);
  const { primary, deeperContext, relatedFact, relatedStory } = bundle;
  const href = primary.reference
    ? `/baca?browse=1&passage=${encodeURIComponent(passagePrefixFromReference(primary.reference) ?? primary.reference)}`
    : "/explore";

  return (
    <aside className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-gradient-to-br from-[#f3ebe0] via-white to-[#e8f0ea] p-4 lg:sticky lg:top-24 lg:max-w-[22rem] lg:justify-self-end">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-xl bg-[var(--m-accent)]/10 text-[var(--m-accent)]">
          <Lightbulb className="size-4" />
        </span>
        <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
          {copy.explore.didYouKnowTitle}
        </p>
      </div>
      <h2 className="mt-3 text-base font-semibold leading-snug text-[var(--m-ink)]">
        {primary.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--m-ink-soft)]">
        {primary.body}
      </p>
      {primary.reference ? (
        <Link
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--m-accent)] transition hover:underline"
        >
          {primary.reference}
          <ArrowUpRight className="size-3" />
        </Link>
      ) : null}

      <div className="mt-4 rounded-xl border border-[var(--m-line)]/60 bg-white/60 px-3 py-2.5">
        <p className="text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
          {copy.explore.didYouKnowContextLabel}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--m-ink)]">
          {deeperContext}
        </p>
      </div>

      <div className="mt-3 rounded-xl border border-[var(--m-line)]/60 bg-white/40 px-3 py-2.5">
        <p className="text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
          {copy.explore.didYouKnowRelatedLabel}
        </p>
        <p className="mt-1 text-xs font-semibold text-[var(--m-ink)]">
          {relatedFact.title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-[var(--m-ink-soft)]">
          {relatedFact.body}
        </p>
      </div>

      {relatedStory ? (
        <Link
          href={`/baca/kisah/${relatedStory.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--m-accent)] transition hover:underline"
        >
          {copy.explore.didYouKnowReadStory}: {relatedStory.title}
          <ArrowUpRight className="size-3.5" />
        </Link>
      ) : (
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--m-ink)] transition hover:text-[var(--m-accent)]"
        >
          {copy.explore.didYouKnowCta}
          <ArrowUpRight className="size-3.5" />
        </Link>
      )}
    </aside>
  );
}

/** Hub Explore — portal pendalaman Alkitab. */
export function ExploreHubView() {
  const statsLine = copy.explore.statsSummary(
    BIBLE_BOOKS.length,
    getTopicCount(),
    getCharacterCount(),
    getImportantStoryCount(),
    getGlossaryCount(),
  );

  return (
    <div className="member-web-animate-in mx-auto w-full max-w-5xl space-y-8 pb-4">
      <header className="relative overflow-hidden rounded-3xl border border-[var(--m-line)] bg-gradient-to-br from-white via-[#f7f4ef] to-[#e8f0ea] px-5 py-7 sm:px-8 sm:py-9">
        <div
          className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.08 145 / 0.3), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-12 size-48 rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, oklch(0.82 0.1 255 / 0.25), transparent 70%)",
          }}
        />
        <div className="relative flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--m-accent)]/10 text-[var(--m-accent)]">
            <BookOpen className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="member-web-kicker text-[var(--m-accent)]">
              {copy.explore.eyebrow}
            </p>
            <h1 className="member-web-display mt-1 text-[clamp(1.85rem,3.4vw,2.55rem)] leading-[1.08] text-[var(--m-ink)]">
              {copy.explore.title}
            </h1>
          </div>
        </div>
        <p className="relative mt-3 max-w-2xl text-sm leading-relaxed text-[var(--m-ink-soft)] sm:text-[0.95rem]">
          {copy.explore.subtitle}
        </p>
        <p className="relative mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--m-line)] bg-white/75 px-3 py-1.5 text-xs font-medium tabular-nums text-[var(--m-ink-soft)]">
          <Sparkles className="size-3.5 text-[var(--m-accent)]" aria-hidden />
          {statsLine}
        </p>
        <p
          role="note"
          className="relative mt-3 flex items-start gap-2 rounded-xl border border-amber-200/70 bg-amber-50/70 px-3.5 py-2.5 text-xs leading-relaxed text-amber-950/90"
        >
          <Info className="mt-0.5 size-3.5 shrink-0 text-amber-700" aria-hidden />
          <span>{copy.explore.aiDisclaimer}</span>
        </p>
      </header>

      <section className="member-web-animate-in-delay grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-4">
          <ExploreCharacterSpotlight />
          <ExploreTopCharacters />
        </div>
        <ExploreDidYouKnow />
      </section>

      <section className="space-y-3">
        <h2 className="px-0.5 text-sm font-semibold text-[var(--m-ink)]">
          {copy.explore.popularTitle}
        </h2>
        <div className="flex flex-wrap gap-2">
          {copy.explore.popularLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--m-line)] bg-white/90 px-3 py-1.5 text-sm font-medium text-[var(--m-ink)] transition hover:border-[var(--m-accent)]/30 hover:bg-[var(--m-wash)]/60 hover:text-[var(--m-accent)]"
            >
              {link.label}
              <ChevronRight className="size-3.5 opacity-50" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      <div className="space-y-8">
        {EXPLORE_GROUPS.map((group) => {
          const items = EXPLORE_DESTINATIONS.filter((item) => item.group === group.id);
          if (items.length === 0) return null;

          return (
            <section key={group.id} className="space-y-3">
              <div className="border-b border-[var(--m-line)] pb-3">
                <h2 className="text-base font-semibold tracking-tight text-[var(--m-ink)]">
                  {group.label}
                </h2>
                <p className="mt-0.5 text-sm text-[var(--m-ink-soft)]">{group.hint}</p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <ExploreGridCard item={item} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
