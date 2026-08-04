"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  HandHeart,
  Lightbulb,
  ListTree,
  MapPinned,
  Quote,
  Sparkles,
  Users,
} from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { Button } from "@/components/ui/button";
import { StoryComicIllustration } from "@/components/stories/story-comic-illustration";
import { copy } from "@/lib/copy";
import { getBibleCharacter } from "@/lib/bible-characters";
import {
  getStoryCategory,
  storyEraLabel,
  storyPassageHref,
  type BibleStory,
} from "@/lib/bible-stories";

type StoryDetailViewProps = {
  story: BibleStory;
};

function splitParagraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function StoryDetailView({ story }: StoryDetailViewProps) {
  const category = getStoryCategory(story.category);
  const backgroundParagraphs = story.background
    ? splitParagraphs(story.background)
    : [];
  const narrativeParagraphs = splitParagraphs(story.narrative);
  const reflectionParagraphs = story.reflection
    ? splitParagraphs(story.reflection)
    : [];
  const moments = story.keyMoments ?? [];

  return (
    <div className="member-web-animate-in mx-auto w-full max-w-3xl space-y-6 pb-2">
      <header className="space-y-3">
        <HistoryBackButton
          fallbackHref="/baca/kisah"
          label={copy.stories.backToStories}
          size="sm"
          variant="ghost"
          className="-ml-2 h-9 px-2 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
        />
        <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/90">
          <StoryComicIllustration
            slug={story.slug}
            title={story.title}
            variant="hero"
          />
          <div className="px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="member-web-kicker text-[var(--m-accent)]">
                {category.label}
              </p>
              <span className="rounded-md bg-[var(--m-wash)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                {storyEraLabel(story.era)}
              </span>
              {moments.length > 0 ? (
                <span className="rounded-md bg-[var(--m-wash)] px-2 py-0.5 text-[10px] font-semibold text-[var(--m-ink-soft)]">
                  {moments.length} momen kunci
                </span>
              ) : null}
            </div>
            <h1 className="member-web-display mt-1.5 text-[clamp(1.65rem,3vw,2.35rem)] leading-[1.1] text-[var(--m-ink)]">
              {story.title}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--m-ink-soft)]">
              {story.summary}
            </p>
          </div>
        </div>
      </header>

      {backgroundParagraphs.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
          <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
            <Sparkles className="size-3.5 text-[var(--m-accent)]" />
            <p className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.stories.backgroundTitle}
            </p>
          </div>
          <div className="space-y-3 px-4 py-4 sm:px-5">
            {backgroundParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-sm leading-relaxed text-[var(--m-ink)]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
        <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
          <BookOpen className="size-3.5 text-[var(--m-accent)]" />
          <p className="text-sm font-semibold text-[var(--m-ink)]">
            {copy.stories.narrativeTitle}
          </p>
        </div>
        <div className="space-y-3 px-4 py-4 sm:px-5">
          {narrativeParagraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className="text-sm leading-relaxed text-[var(--m-ink)]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {moments.length > 0 ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--m-ink)]">
            <ListTree className="size-4 text-[var(--m-accent)]" />
            {copy.stories.momentsTitle}
          </h2>
          <ol className="space-y-2.5">
            {moments.map((moment, index) => (
              <li
                key={moment.title}
                className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90"
              >
                <div className="flex gap-3 px-4 py-3.5 sm:px-5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--m-accent)]/10 text-xs font-bold text-[var(--m-accent)]">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--m-ink)]">
                      {moment.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--m-ink-soft)]">
                      {moment.summary}
                    </p>
                    {moment.reference && moment.passage ? (
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-8 px-2 text-xs font-semibold text-[var(--m-accent)]"
                      >
                        <Link
                          href={storyPassageHref({
                            reference: moment.reference,
                            passage: moment.passage,
                            verse: moment.verse,
                          })}
                        >
                          {moment.reference}
                          <ArrowUpRight className="size-3" />
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {story.lessons && story.lessons.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
          <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
            <Lightbulb className="size-3.5 text-[var(--m-accent)]" />
            <p className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.stories.lessonsTitle}
            </p>
          </div>
          <ul className="space-y-2 px-4 py-4 sm:px-5">
            {story.lessons.map((lesson) => (
              <li
                key={lesson}
                className="flex gap-2 text-sm leading-relaxed text-[var(--m-ink)]"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--m-accent)]" />
                {lesson}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {reflectionParagraphs.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
          <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
            <Lightbulb className="size-3.5 text-[var(--m-accent)]" />
            <p className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.stories.reflectionTitle}
            </p>
          </div>
          <div className="space-y-3 px-4 py-4 sm:px-5">
            {reflectionParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-sm leading-relaxed text-[var(--m-ink)]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--m-ink)]">
          {copy.stories.keyPassages}
        </h2>
        <ul className="space-y-3">
          {story.keyPassages.map((passageItem, index) => (
            <li
              key={passageItem.reference}
              className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90"
            >
              <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[var(--m-accent)]/10 text-[11px] font-semibold text-[var(--m-accent)]">
                  {index + 1}
                </span>
                <BookOpen className="size-3.5 shrink-0 text-[var(--m-accent)]" />
                <p className="text-sm font-semibold text-[var(--m-ink)]">
                  {passageItem.reference}
                </p>
              </div>
              <div className="space-y-3 px-4 py-4">
                {passageItem.text ? (
                  <p className="flex gap-2 text-sm leading-relaxed text-[var(--m-ink)]">
                    <Quote className="mt-0.5 size-3.5 shrink-0 text-[var(--m-accent)]/70" />
                    <span>{passageItem.text}</span>
                  </p>
                ) : null}
                <Button
                  asChild
                  size="sm"
                  className="h-9 rounded-xl font-semibold"
                >
                  <Link href={storyPassageHref(passageItem)}>
                    {copy.stories.readInContext}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {story.prayer ? (
        <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
          <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
            <HandHeart className="size-3.5 text-[var(--m-accent)]" />
            <p className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.stories.prayerTitle}
            </p>
          </div>
          <p className="px-4 py-4 text-sm leading-relaxed text-[var(--m-ink)] italic sm:px-5">
            {story.prayer}
          </p>
        </section>
      ) : null}

      {story.relatedCharacterSlugs && story.relatedCharacterSlugs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--m-ink)]">
            <Users className="size-4 text-[var(--m-accent)]" />
            {copy.stories.relatedCharacters}
          </h2>
          <div className="flex flex-wrap gap-2">
            {story.relatedCharacterSlugs.map((slug) => {
              const character = getBibleCharacter(slug);
              return (
                <Link
                  key={slug}
                  href={`/baca/tokoh/${slug}`}
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--m-line)] bg-white/90 px-3 py-1.5 text-sm font-medium text-[var(--m-ink)] transition hover:border-[var(--m-accent)]/30 hover:text-[var(--m-accent)]"
                >
                  {character?.name ?? slug}
                  <ChevronRight className="size-3.5 opacity-50" />
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {story.relatedPlaceSlugs && story.relatedPlaceSlugs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--m-ink)]">
            <MapPinned className="size-4 text-[var(--m-accent)]" />
            {copy.stories.relatedPlaces}
          </h2>
          <div className="flex flex-wrap gap-2">
            {story.relatedPlaceSlugs.map((slug) => (
              <Link
                key={slug}
                href={`/baca/peta/${slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--m-line)] bg-white/90 px-3 py-1.5 text-sm font-medium capitalize text-[var(--m-ink)] transition hover:border-[var(--m-accent)]/30 hover:text-[var(--m-accent)]"
              >
                {slug}
                <ChevronRight className="size-3.5 opacity-50" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <p className="flex gap-2 rounded-xl border border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/40 px-4 py-3 text-xs leading-relaxed text-[var(--m-ink-soft)]">
        <Quote className="mt-0.5 size-3.5 shrink-0 text-[var(--m-accent)]/70" />
        {copy.stories.hint}
      </p>
    </div>
  );
}
