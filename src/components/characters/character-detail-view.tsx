"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  HandHeart,
  Lightbulb,
  ListTree,
  Quote,
  Sparkles,
  Users,
} from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";
import {
  characterEraLabel,
  characterVerseHref,
  getBibleCharacter,
  getCharacterCategory,
  getCharacterVerses,
  type BibleCharacter,
  type BibleCharacterMoment,
  type BibleCharacterVerse,
} from "@/lib/bible-characters";
import { cn } from "@/lib/utils";

type CharacterDetailViewProps = {
  character: BibleCharacter;
};

function splitParagraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function CharacterDetailView({ character }: CharacterDetailViewProps) {
  const category = getCharacterCategory(character.category);
  const storyParagraphs = splitParagraphs(character.story);
  const backgroundParagraphs = character.background
    ? splitParagraphs(character.background)
    : [];
  const reflectionParagraphs = character.reflection
    ? splitParagraphs(character.reflection)
    : [];
  const verses = getCharacterVerses(character);
  const moments = character.keyMoments ?? [];
  const related = (character.relatedSlugs ?? [])
    .map((slug) => getBibleCharacter(slug))
    .filter((item): item is BibleCharacter => Boolean(item))
    .slice(0, 4);

  return (
    <div className="member-web-animate-in mx-auto w-full max-w-3xl space-y-6 pb-2">
      <header className="space-y-3">
        <HistoryBackButton
          fallbackHref="/baca/tokoh"
          label={copy.characters.backToList}
          size="sm"
          variant="ghost"
          className="-ml-2 h-9 px-2 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
        />
        <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/90 px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="member-web-kicker text-[var(--m-accent)]">
              {category.label}
            </p>
            <span className="rounded-md bg-[var(--m-wash)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
              {characterEraLabel(character.era)}
            </span>
            {moments.length > 0 ? (
              <span className="rounded-md bg-[var(--m-wash)] px-2 py-0.5 text-[10px] font-semibold text-[var(--m-ink-soft)]">
                {moments.length} momen kunci
              </span>
            ) : null}
          </div>
          <h1 className="member-web-display mt-1.5 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-[var(--m-ink)]">
            {character.name}
          </h1>
          <p className="mt-1.5 text-sm font-medium text-[var(--m-accent)]">
            {character.role}
          </p>
          {character.alsoCalled && character.alsoCalled.length > 0 ? (
            <p className="mt-2 text-sm text-[var(--m-ink-soft)]">
              Juga disebut:{" "}
              <span className="font-medium text-[var(--m-ink)]">
                {character.alsoCalled.join(" · ")}
              </span>
            </p>
          ) : null}
          <p className="mt-3 text-base leading-relaxed text-[var(--m-ink)]">
            {character.summary}
          </p>
        </div>
      </header>

      {backgroundParagraphs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--m-ink)]">
            {copy.characters.backgroundTitle}
          </h2>
          <div className="space-y-3 rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/90 px-4 py-4 sm:px-5">
            {backgroundParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
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
          {copy.characters.storyTitle}
        </h2>
        <div className="space-y-3 rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/90 px-4 py-4 sm:px-5">
          {storyParagraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
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
            {copy.characters.momentsTitle}
          </h2>
          <ol className="space-y-2.5">
            {moments.map((moment, index) => (
              <MomentCard key={`${moment.title}-${index}`} moment={moment} index={index} />
            ))}
          </ol>
        </section>
      ) : null}

      {character.lessons && character.lessons.length > 0 ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--m-ink)]">
            <Lightbulb className="size-4 text-[var(--m-accent)]" />
            {copy.characters.lessonsTitle}
          </h2>
          <ul className="space-y-2 rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/90 px-4 py-4 sm:px-5">
            {character.lessons.map((lesson) => (
              <li
                key={lesson}
                className="flex gap-2.5 text-sm leading-relaxed text-[var(--m-ink)]"
              >
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--m-accent)]"
                  aria-hidden
                />
                <span>{lesson}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {reflectionParagraphs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--m-ink)]">
            <Sparkles className="size-4 text-[var(--m-accent)]" />
            {copy.characters.reflectionTitle}
          </h2>
          <div className="space-y-3 rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/90 px-4 py-4 sm:px-5">
            {reflectionParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-sm leading-relaxed text-[var(--m-ink)]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      {character.prayer ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--m-ink)]">
            <HandHeart className="size-4 text-[var(--m-accent)]" />
            {copy.characters.prayerTitle}
          </h2>
          <p className="rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/90 px-4 py-4 text-sm leading-relaxed text-[var(--m-ink)] italic sm:px-5">
            {character.prayer}
          </p>
        </section>
      ) : null}

      {verses.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--m-ink)]">
            {verses.length > 1
              ? copy.characters.keyVerses
              : copy.characters.keyVerse}
          </h2>
          <ul className="space-y-3">
            {verses.map((verse, index) => (
              <VerseCard key={`${verse.reference}-${index}`} verse={verse} index={index} />
            ))}
          </ul>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--m-ink)]">
            <Users className="size-4 text-[var(--m-accent)]" />
            {copy.characters.relatedTitle}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/baca/tokoh/${item.slug}`}
                  className="flex items-start gap-3 rounded-xl border border-[var(--m-line)] bg-[var(--m-paper)]/90 px-3.5 py-3 transition hover:border-[var(--m-accent)]/35 hover:bg-[var(--m-wash)]/40"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--m-wash)] text-xs font-bold text-[var(--m-accent)]">
                    {item.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--m-ink)]">
                      {item.name}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--m-ink-soft)]">
                      {item.role}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="rounded-xl border border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/40 px-4 py-3 text-xs leading-relaxed text-[var(--m-ink-soft)]">
        {copy.characters.hint}
      </p>
    </div>
  );
}

function MomentCard({
  moment,
  index,
}: {
  moment: BibleCharacterMoment;
  index: number;
}) {
  const href =
    moment.passage != null
      ? characterVerseHref({
          reference: moment.reference ?? moment.passage,
          passage: moment.passage,
          verse: moment.verse,
          text: "",
        })
      : null;

  return (
    <li className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/90">
      <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/45 px-4 py-2.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[var(--m-accent)]/10 text-[11px] font-semibold text-[var(--m-accent)]">
          {index + 1}
        </span>
        <p className="min-w-0 flex-1 text-sm font-semibold text-[var(--m-ink)]">
          {moment.title}
        </p>
        {moment.reference ? (
          <span className="shrink-0 text-[11px] text-[var(--m-ink-soft)]">
            {moment.reference}
          </span>
        ) : null}
      </div>
      <div className="space-y-3 px-4 py-3.5">
        <p className="text-sm leading-relaxed text-[var(--m-ink)]">
          {moment.summary}
        </p>
        {href ? (
          <Button asChild size="sm" variant="outline" className="h-9 rounded-xl font-semibold">
            <Link href={href}>
              {copy.characters.readInContext}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        ) : null}
      </div>
    </li>
  );
}

function VerseCard({
  verse,
  index,
}: {
  verse: BibleCharacterVerse;
  index: number;
}) {
  return (
    <li
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/90",
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[var(--m-accent)]/10 text-[11px] font-semibold text-[var(--m-accent)]">
          {index + 1}
        </span>
        <BookOpen className="size-3.5 shrink-0 text-[var(--m-accent)]" />
        <p className="text-sm font-semibold text-[var(--m-ink)]">
          {verse.reference}
        </p>
      </div>
      <div className="space-y-3 px-4 py-4">
        <p className="flex gap-2 text-sm leading-relaxed text-[var(--m-ink)]">
          <Quote className="mt-0.5 size-3.5 shrink-0 text-[var(--m-accent)]/70" />
          <span>{verse.text}</span>
        </p>
        <Button asChild size="sm" className="h-9 rounded-xl font-semibold">
          <Link href={characterVerseHref(verse)}>
            {copy.characters.readInContext}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </li>
  );
}
