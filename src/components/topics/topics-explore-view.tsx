"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Compass,
  Cross,
  Heart,
  Home,
  Search,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import {
  BIBLE_TOPIC_CATEGORIES,
  BIBLE_TOPICS,
  getFeaturedTopics,
  getTopicCategory,
  searchBibleTopics,
  type BibleTopicCategoryId,
} from "@/lib/bible-topics";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | BibleTopicCategoryId;

const CATEGORY_TONE: Record<
  BibleTopicCategoryId,
  { chip: string; card: string; icon: string; Icon: typeof Heart }
> = {
  faith: {
    chip: "border-sky-200 bg-sky-50 text-sky-800 data-[active=true]:border-sky-600 data-[active=true]:bg-sky-600 data-[active=true]:text-white",
    card: "from-sky-50 to-cyan-50/80",
    icon: "bg-sky-100 text-sky-700",
    Icon: Cross,
  },
  emotion: {
    chip: "border-rose-200 bg-rose-50 text-rose-800 data-[active=true]:border-rose-600 data-[active=true]:bg-rose-600 data-[active=true]:text-white",
    card: "from-rose-50 to-orange-50/70",
    icon: "bg-rose-100 text-rose-700",
    Icon: Heart,
  },
  relationship: {
    chip: "border-emerald-200 bg-emerald-50 text-emerald-800 data-[active=true]:border-emerald-600 data-[active=true]:bg-emerald-600 data-[active=true]:text-white",
    card: "from-emerald-50 to-teal-50/80",
    icon: "bg-emerald-100 text-emerald-700",
    Icon: Users,
  },
  life: {
    chip: "border-amber-200 bg-amber-50 text-amber-900 data-[active=true]:border-amber-600 data-[active=true]:bg-amber-600 data-[active=true]:text-white",
    card: "from-amber-50 to-yellow-50/70",
    icon: "bg-amber-100 text-amber-800",
    Icon: Home,
  },
  promise: {
    chip: "border-indigo-200 bg-indigo-50 text-indigo-800 data-[active=true]:border-indigo-600 data-[active=true]:bg-indigo-600 data-[active=true]:text-white",
    card: "from-indigo-50 to-blue-50/80",
    icon: "bg-indigo-100 text-indigo-700",
    Icon: Shield,
  },
};

const SEARCH_CHIPS = [
  "kasih",
  "ketakutan",
  "doa",
  "pengampunan",
  "kerja",
  "keselamatan",
];

/** Jelajahi Alkitab lewat topik — pola Discover / Topical Index. */
export function TopicsExploreView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const featured = useMemo(() => getFeaturedTopics().slice(0, 8), []);
  const totalCount = BIBLE_TOPICS.length;

  const topics = useMemo(() => {
    let list = searchBibleTopics(query);
    if (category !== "all") {
      list = list.filter((topic) => topic.category === category);
    }
    return [...list].sort((a, b) => a.title.localeCompare(b.title, "id"));
  }, [query, category]);

  return (
    <div className="member-web-animate-in mx-auto w-full max-w-3xl space-y-6 pb-2">
      <header className="space-y-3">
        <HistoryBackButton
          fallbackHref="/explore"
          label={copy.explore.backToExplore}
          size="sm"
          variant="ghost"
          className="-ml-2 h-9 px-2 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
        />
        <div>
          <p className="member-web-kicker text-[var(--m-accent)]">
            {copy.topics.eyebrow}
          </p>
          <h1 className="member-web-display mt-1.5 text-[clamp(1.65rem,3vw,2.35rem)] leading-[1.1] text-[var(--m-ink)]">
            {copy.topics.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--m-ink-soft)]">
            {copy.topics.subtitle}
          </p>
          <p className="mt-1.5 text-xs font-medium text-[var(--m-ink-soft)]">
            {copy.topics.catalogCount(totalCount)}
          </p>
        </div>
      </header>

      <div className="space-y-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--m-ink-soft)]" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.topics.searchPlaceholder}
            className="h-11 rounded-xl border-[var(--m-line)] bg-white/90 pl-10"
            aria-label={copy.topics.searchPlaceholder}
          />
        </div>
        {!query ? (
          <div className="flex flex-wrap gap-1.5">
            {SEARCH_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setQuery(chip)}
                className="rounded-lg border border-[var(--m-line)] bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[var(--m-ink-soft)] transition hover:border-[var(--m-accent)]/40 hover:text-[var(--m-ink)]"
              >
                {chip}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div
        role="tablist"
        aria-label={copy.topics.categoryAria}
        className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <button
          type="button"
          role="tab"
          data-active={category === "all"}
          aria-selected={category === "all"}
          onClick={() => setCategory("all")}
          className={cn(
            "inline-flex h-8 shrink-0 items-center rounded-lg border px-2.5 text-xs font-semibold transition",
            category === "all"
              ? "border-[var(--m-accent)] bg-[var(--m-accent)] text-white"
              : "border-[var(--m-line)] bg-white text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
          )}
        >
          Semua
        </button>
        {BIBLE_TOPIC_CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            data-active={category === item.id}
            aria-selected={category === item.id}
            onClick={() => setCategory(item.id)}
            className={cn(
              "inline-flex h-8 shrink-0 items-center rounded-lg border px-2.5 text-xs font-semibold transition",
              CATEGORY_TONE[item.id].chip,
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {!query && category === "all" ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[var(--m-accent)]" />
            <h2 className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.topics.featured}
            </h2>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {featured.map((topic) => {
              const tone = CATEGORY_TONE[topic.category];
              const Icon = tone.Icon;
              return (
                <Link
                  key={topic.slug}
                  href={`/baca/topik/${topic.slug}`}
                  className={cn(
                    "group flex items-start gap-3 rounded-2xl border border-[var(--m-line)] bg-gradient-to-br p-3.5 transition hover:border-[var(--m-accent)]/35",
                    tone.card,
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      tone.icon,
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
                      {topic.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--m-ink-soft)]">
                      {topic.summary}
                    </p>
                    <p className="mt-1.5 text-[11px] font-medium text-[var(--m-ink-soft)]">
                      {topic.verses.length} ayat kunci
                    </p>
                  </div>
                  <ChevronRight className="mt-1 size-4 shrink-0 text-[var(--m-ink-soft)]/50 transition group-hover:text-[var(--m-accent)]" />
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--m-ink)]">
            <Compass className="size-4 text-[var(--m-accent)]" />
            {query || category !== "all"
              ? copy.topics.results
              : copy.topics.allTopics}
          </h2>
          <span className="text-xs tabular-nums text-[var(--m-ink-soft)]">
            {topics.length} dari {totalCount}
          </span>
        </div>

        {topics.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--m-line)] bg-white/60 px-4 py-10 text-center text-sm text-[var(--m-ink-soft)]">
            {copy.topics.emptySearch}
          </p>
        ) : (
          <ul className="divide-y divide-[var(--m-line)] overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
            {topics.map((topic) => {
              const cat = getTopicCategory(topic.category);
              const tone = CATEGORY_TONE[topic.category];
              const Icon = tone.Icon;
              return (
                <li key={topic.slug}>
                  <Link
                    href={`/baca/topik/${topic.slug}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--m-wash)]/55 sm:px-5"
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg",
                        tone.icon,
                      )}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[var(--m-ink)]">
                        {topic.title}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-[var(--m-ink-soft)]">
                        {topic.summary}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-[var(--m-ink-soft)]/80">
                        {cat.label} · {topic.verses.length} ayat
                      </p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-[var(--m-ink-soft)]/45" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
