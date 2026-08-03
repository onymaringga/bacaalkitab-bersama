"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  HandHeart,
  Lightbulb,
  Quote,
  Sparkles,
} from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";
import {
  getRelatedTopics,
  getTopicCategory,
  topicVerseHref,
  type BibleTopic,
} from "@/lib/bible-topics";

type TopicDetailViewProps = {
  topic: BibleTopic;
};

export function TopicDetailView({ topic }: TopicDetailViewProps) {
  const category = getTopicCategory(topic.category);
  const related = getRelatedTopics(topic, 4);

  return (
    <div className="member-web-animate-in mx-auto w-full max-w-3xl space-y-6 pb-2">
      <header className="space-y-3">
        <HistoryBackButton
          fallbackHref="/baca/topik"
          label={copy.topics.backToTopics}
          size="sm"
          variant="ghost"
          className="-ml-2 h-9 px-2 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
        />
        <div>
          <p className="member-web-kicker text-[var(--m-accent)]">
            {category.label} · {topic.verses.length} ayat kunci
          </p>
          <h1 className="member-web-display mt-1.5 text-[clamp(1.65rem,3vw,2.35rem)] leading-[1.1] text-[var(--m-ink)]">
            {topic.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--m-ink-soft)]">
            {topic.summary}
          </p>
        </div>
      </header>

      {topic.reflection ? (
        <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
          <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
            <Lightbulb className="size-3.5 text-[var(--m-accent)]" />
            <p className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.topics.reflectionTitle}
            </p>
          </div>
          <p className="px-4 py-4 text-sm leading-relaxed text-[var(--m-ink)] sm:px-5">
            {topic.reflection}
          </p>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--m-ink)]">
          {copy.topics.keyVerses}
        </h2>
        <ul className="space-y-3">
          {topic.verses.map((verse, index) => (
            <li
              key={verse.reference}
              className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90"
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
                <Button
                  asChild
                  size="sm"
                  className="h-9 rounded-xl font-semibold"
                >
                  <Link href={topicVerseHref(verse)}>
                    {copy.topics.readInContext}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {topic.prayer ? (
        <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
          <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-2.5">
            <HandHeart className="size-3.5 text-[var(--m-accent)]" />
            <p className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.topics.prayerTitle}
            </p>
          </div>
          <p className="px-4 py-4 text-sm leading-relaxed text-[var(--m-ink)] italic sm:px-5">
            {topic.prayer}
          </p>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-[var(--m-accent)]" />
            <h2 className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.topics.relatedTitle}
            </h2>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/baca/topik/${item.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-[var(--m-line)] bg-white/90 px-3.5 py-3 transition hover:border-[var(--m-accent)]/35 hover:bg-[var(--m-wash)]/40"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--m-ink)]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-[var(--m-ink-soft)]">
                      {item.summary}
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-[var(--m-ink-soft)]" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="rounded-xl border border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/40 px-4 py-3 text-xs leading-relaxed text-[var(--m-ink-soft)]">
        {copy.topics.contextHint}
      </p>
    </div>
  );
}
