"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarRange,
  Feather,
  Goal,
  ListTree,
  NotebookPen,
  PenLine,
  Quote,
  ScrollText,
  Sparkles,
  Users,
} from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { Button } from "@/components/ui/button";
import {
  bookReadHref,
  type EnrichedBibleBookIntro,
} from "@/lib/bible-book-intros";
import type { BibleBook } from "@/lib/bible-books";
import { OLD_TESTAMENT_SIZE, BIBLE_BOOKS } from "@/lib/bible-books";
import { copy } from "@/lib/copy";

type KitabDetailViewProps = {
  book: BibleBook;
  intro: EnrichedBibleBookIntro;
};

const SECTIONS = [
  {
    key: "author" as const,
    labelKey: "who" as const,
    icon: PenLine,
  },
  {
    key: "when" as const,
    labelKey: "when" as const,
    icon: CalendarRange,
  },
  {
    key: "how" as const,
    labelKey: "how" as const,
    icon: Feather,
  },
  {
    key: "why" as const,
    labelKey: "why" as const,
    icon: Goal,
  },
  {
    key: "audience" as const,
    labelKey: "audience" as const,
    icon: Users,
  },
];

export function KitabDetailView({ book, intro }: KitabDetailViewProps) {
  const bookIndex = BIBLE_BOOKS.findIndex((item) => item.abbr === book.abbr);
  const testament =
    bookIndex >= 0 && bookIndex < OLD_TESTAMENT_SIZE
      ? copy.bible.oldTestament
      : copy.bible.newTestament;
  const themes = intro.themes ?? [];
  const characters = intro.characters ?? [];
  const outline = intro.outline ?? [];
  const sources = intro.sources ?? [];

  return (
    <div className="member-web-animate-in mx-auto w-full max-w-3xl space-y-6 pb-2">
      <header className="space-y-3">
        <HistoryBackButton
          fallbackHref="/baca/kitab"
          label={copy.bookIntro.backToList}
          size="sm"
          variant="ghost"
          className="-ml-2 h-9 px-2 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
        />
        <div>
          <p className="member-web-kicker text-[var(--m-accent)]">
            {testament} · {intro.genre}
            {intro.chapters > 0
              ? ` · ${intro.chapters} ${copy.bookIntro.chaptersLabel}`
              : null}
          </p>
          <h1 className="member-web-display mt-1.5 text-[clamp(1.65rem,3vw,2.35rem)] leading-[1.1] text-[var(--m-ink)]">
            {book.name}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--m-ink-soft)]">
            {intro.summary}
          </p>
        </div>
        <Button asChild className="h-10 rounded-xl font-semibold">
          <Link href={bookReadHref(book.name)}>
            <BookOpen className="size-4" />
            {copy.bookIntro.readBook}
          </Link>
        </Button>
      </header>

      {intro.about ? (
        <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
          <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
            <ScrollText className="size-3.5 text-[var(--m-accent)]" />
            <p className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.bookIntro.aboutTitle}
            </p>
          </div>
          <p className="px-4 py-4 text-sm leading-relaxed text-[var(--m-ink)] sm:px-5">
            {intro.about}
          </p>
          {intro.deeper ? (
            <p className="border-t border-[var(--m-line)] px-4 py-3.5 text-sm leading-relaxed text-[var(--m-ink-soft)] sm:px-5">
              {intro.deeper}
            </p>
          ) : null}
        </section>
      ) : null}

      {themes.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-[var(--m-accent)]" />
            <h2 className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.bookIntro.themesTitle}
            </h2>
          </div>
          <ul className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <li
                key={theme}
                className="rounded-lg bg-[var(--m-wash)] px-2.5 py-1 text-xs font-medium text-[var(--m-ink)]"
              >
                {theme}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {characters.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
          <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
            <Users className="size-3.5 text-[var(--m-accent)]" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--m-ink)]">
                {copy.bookIntro.charactersTitle}
              </p>
              <p className="text-[11px] leading-snug text-[var(--m-ink-soft)]">
                {copy.bookIntro.charactersHint}
              </p>
            </div>
          </div>
          <ul className="divide-y divide-[var(--m-line)]">
            {characters.map((character) => (
              <li
                key={`${character.name}-${character.role}`}
                className="flex gap-3 px-4 py-3.5 sm:px-5"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--m-wash)] text-[11px] font-semibold text-[var(--m-accent)]">
                  {character.name
                    .split(/[\s&,/]+/)
                    .filter((part) => /^[A-Za-zÀ-ÿĀ-ž]/.test(part))
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase()}
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold text-[var(--m-ink)]">
                    {character.name}
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--m-ink-soft)]">
                    {character.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
        <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
          <Quote className="size-3.5 text-[var(--m-accent)]" />
          <p className="text-sm font-semibold text-[var(--m-ink)]">
            {copy.bookIntro.overviewTitle}
          </p>
        </div>
        <ul className="divide-y divide-[var(--m-line)]">
          {SECTIONS.map(({ key, labelKey, icon: Icon }) => (
            <li key={key} className="px-4 py-4 sm:px-5">
              <div className="flex gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--m-wash)] text-[var(--m-accent)]">
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-semibold tracking-wide text-[var(--m-accent)] uppercase">
                    {copy.bookIntro.fields[labelKey]}
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--m-ink)]">
                    {intro[key]}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {outline.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
          <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
            <ListTree className="size-3.5 text-[var(--m-accent)]" />
            <p className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.bookIntro.outlineTitle}
            </p>
          </div>
          <ol className="divide-y divide-[var(--m-line)]">
            {outline.map((item, index) => (
              <li
                key={item}
                className="flex gap-3 px-4 py-3.5 text-sm leading-relaxed text-[var(--m-ink)] sm:px-5"
              >
                <span className="mt-0.5 w-5 shrink-0 text-xs font-semibold text-[var(--m-accent)]">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {intro.notes ? (
        <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
          <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
            <NotebookPen className="size-3.5 text-[var(--m-accent)]" />
            <p className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.bookIntro.notesTitle}
            </p>
          </div>
          <p className="px-4 py-4 text-sm leading-relaxed text-[var(--m-ink)] sm:px-5">
            {intro.notes}
          </p>
        </section>
      ) : null}

      {sources.length > 0 ? (
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.bookIntro.sourcesTitle}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[var(--m-ink-soft)]">
              {copy.bookIntro.sourcesHint}
            </p>
          </div>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--m-ink)]">
            {sources.map((source) => (
              <li key={source.id}>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline decoration-[var(--m-line)] underline-offset-2 hover:text-[var(--m-accent)]"
                  >
                    {source.title}
                  </a>
                ) : (
                  <span className="font-medium">{source.title}</span>
                )}
                {source.credit ? (
                  <span className="text-[var(--m-ink-soft)]">
                    {" "}
                    — {source.credit}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs leading-relaxed text-[var(--m-ink-soft)]">
        {copy.bookIntro.disclaimer}
      </p>
    </div>
  );
}
