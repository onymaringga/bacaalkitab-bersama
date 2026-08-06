"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Lightbulb,
  Quote,
  ScrollText,
  Sparkles,
} from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";
import {
  customEraLabel,
  customVerseHref,
  getCustomCategory,
  getRelatedCustoms,
  type BibleCustom,
} from "@/lib/bible-customs";

type CustomDetailViewProps = {
  custom: BibleCustom;
};

function splitParagraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function CustomDetailView({ custom }: CustomDetailViewProps) {
  const category = getCustomCategory(custom.category);
  const related = getRelatedCustoms(custom, 4);

  return (
    <div className="member-web-animate-in mx-auto w-full max-w-3xl space-y-6 pb-2">
      <header className="space-y-3">
        <HistoryBackButton
          fallbackHref="/baca/kebiasaan"
          label={copy.customs.backToCustoms}
          size="sm"
          variant="ghost"
          className="-ml-2 h-9 px-2 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
        />
        <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-gradient-to-br from-[#f5f0e8] via-white to-[#eef6f0] px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="member-web-kicker text-[var(--m-accent)]">
              {category.label}
            </p>
            <span className="rounded-md bg-[var(--m-wash)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
              {customEraLabel(custom.era)}
            </span>
          </div>
          <h1 className="member-web-display mt-1.5 text-[clamp(1.65rem,3vw,2.35rem)] leading-[1.1] text-[var(--m-ink)]">
            {custom.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--m-ink-soft)]">
            {custom.summary}
          </p>
        </div>
      </header>

      <Section
        icon={Lightbulb}
        title={copy.customs.backgroundTitle}
        paragraphs={splitParagraphs(custom.background)}
      />

      <Section
        icon={ScrollText}
        title={copy.customs.practiceTitle}
        paragraphs={splitParagraphs(custom.practice)}
      />

      <Section
        icon={Sparkles}
        title={copy.customs.meaningTitle}
        paragraphs={splitParagraphs(custom.meaning)}
      />

      {custom.today ? (
        <Section
          icon={BookOpen}
          title={copy.customs.todayTitle}
          paragraphs={splitParagraphs(custom.today)}
        />
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--m-ink)]">
          {copy.customs.keyVerses}
        </h2>
        <ul className="space-y-3">
          {custom.verses.map((verse, index) => (
            <li
              key={verse.reference}
              className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90"
            >
              <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[var(--m-accent)]/10 text-[11px] font-semibold text-[var(--m-accent)]">
                  {index + 1}
                </span>
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
                  <Link href={customVerseHref(verse)}>
                    {copy.customs.readInContext}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--m-ink)]">
            {copy.customs.relatedTitle}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/baca/kebiasaan/${item.slug}`}
                  className="group flex items-center gap-2 rounded-xl border border-[var(--m-line)] bg-white/90 p-3 transition hover:border-[var(--m-accent)]/35"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--m-ink-soft)]">
                      {item.summary}
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-[var(--m-ink-soft)]/40" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="rounded-xl border border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/40 px-4 py-3 text-xs leading-relaxed text-[var(--m-ink-soft)]">
        {copy.customs.contextHint}
      </p>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  paragraphs,
}: {
  icon: typeof Lightbulb;
  title: string;
  paragraphs: string[];
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
      <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
        <Icon className="size-3.5 text-[var(--m-accent)]" />
        <h2 className="text-sm font-semibold text-[var(--m-ink)]">{title}</h2>
      </div>
      <div className="space-y-3 px-4 py-4 sm:px-5">
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            className="text-sm leading-relaxed text-[var(--m-ink)]"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
