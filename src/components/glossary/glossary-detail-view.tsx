"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, Quote } from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";
import {
  getGlossaryCategory,
  glossaryVerseHref,
  type BibleGlossaryTerm,
} from "@/lib/bible-glossary";

type GlossaryDetailViewProps = {
  term: BibleGlossaryTerm;
};

export function GlossaryDetailView({ term }: GlossaryDetailViewProps) {
  const category = getGlossaryCategory(term.category);
  const paragraphs = term.explanation
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className="member-web-animate-in mx-auto w-full max-w-3xl space-y-6 pb-2">
      <header className="space-y-3">
        <HistoryBackButton
          fallbackHref="/baca/glosarium"
          label={copy.glossary.backToList}
          size="sm"
          variant="ghost"
          className="-ml-2 h-9 px-2 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
        />
        <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90 px-5 py-5 sm:px-6">
          <p className="member-web-kicker text-[var(--m-accent)]">
            {category.label}
          </p>
          <h1 className="member-web-display mt-1.5 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-[var(--m-ink)]">
            {term.term}
          </h1>
          {term.alsoCalled && term.alsoCalled.length > 0 ? (
            <p className="mt-2 text-sm text-[var(--m-ink-soft)]">
              Juga disebut:{" "}
              <span className="font-medium text-[var(--m-ink)]">
                {term.alsoCalled.join(" · ")}
              </span>
            </p>
          ) : null}
          <p className="mt-3 text-base leading-relaxed text-[var(--m-ink)]">
            {term.plainMeaning}
          </p>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--m-ink)]">
          {copy.glossary.explanation}
        </h2>
        <div className="space-y-3 rounded-2xl border border-[var(--m-line)] bg-white/90 px-4 py-4 sm:px-5">
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="text-sm leading-relaxed text-[var(--m-ink)]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {term.verse ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--m-ink)]">
            {copy.glossary.keyVerse}
          </h2>
          <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
            <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
              <BookOpen className="size-3.5 shrink-0 text-[var(--m-accent)]" />
              <p className="text-sm font-semibold text-[var(--m-ink)]">
                {term.verse.reference}
              </p>
            </div>
            <div className="space-y-3 px-4 py-4">
              <p className="flex gap-2 text-sm leading-relaxed text-[var(--m-ink)]">
                <Quote className="mt-0.5 size-3.5 shrink-0 text-[var(--m-accent)]/70" />
                <span>{term.verse.text}</span>
              </p>
              <Button asChild size="sm" className="h-9 rounded-xl font-semibold">
                <Link href={glossaryVerseHref(term.verse)}>
                  {copy.glossary.readInContext}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      <p className="rounded-xl border border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/40 px-4 py-3 text-xs leading-relaxed text-[var(--m-ink-soft)]">
        {copy.glossary.hint}
      </p>
    </div>
  );
}
