"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookMarked,
  ChevronRight,
  Church,
  Crown,
  Flame,
  Mountain,
  ScrollText,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { Input } from "@/components/ui/input";
import { StoryComicIllustration } from "@/components/stories/story-comic-illustration";
import { copy } from "@/lib/copy";
import {
  BIBLE_STORY_CATEGORIES,
  getFeaturedStories,
  getStoryCategory,
  getStoryCount,
  searchBibleStories,
  storyEraLabel,
  type BibleStoryCategoryId,
} from "@/lib/bible-stories";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | BibleStoryCategoryId;

const CATEGORY_TONE: Record<
  BibleStoryCategoryId,
  { chip: string; card: string; icon: string; Icon: typeof Star }
> = {
  creation: {
    chip: "border-sky-200 bg-sky-50 text-sky-800 data-[active=true]:border-sky-600 data-[active=true]:bg-sky-600 data-[active=true]:text-white",
    card: "from-sky-50 to-cyan-50/80",
    icon: "bg-sky-100 text-sky-700",
    Icon: Star,
  },
  patriarchs: {
    chip: "border-amber-200 bg-amber-50 text-amber-900 data-[active=true]:border-amber-600 data-[active=true]:bg-amber-600 data-[active=true]:text-white",
    card: "from-amber-50 to-orange-50/70",
    icon: "bg-amber-100 text-amber-800",
    Icon: Users,
  },
  exodus: {
    chip: "border-teal-200 bg-teal-50 text-teal-800 data-[active=true]:border-teal-600 data-[active=true]:bg-teal-600 data-[active=true]:text-white",
    card: "from-teal-50 to-emerald-50/80",
    icon: "bg-teal-100 text-teal-700",
    Icon: Mountain,
  },
  kingdom: {
    chip: "border-violet-200 bg-violet-50 text-violet-800 data-[active=true]:border-violet-600 data-[active=true]:bg-violet-600 data-[active=true]:text-white",
    card: "from-violet-50 to-fuchsia-50/70",
    icon: "bg-violet-100 text-violet-700",
    Icon: Crown,
  },
  prophets: {
    chip: "border-orange-200 bg-orange-50 text-orange-900 data-[active=true]:border-orange-600 data-[active=true]:bg-orange-600 data-[active=true]:text-white",
    card: "from-orange-50 to-amber-50/70",
    icon: "bg-orange-100 text-orange-800",
    Icon: Flame,
  },
  gospel: {
    chip: "border-rose-200 bg-rose-50 text-rose-800 data-[active=true]:border-rose-600 data-[active=true]:bg-rose-600 data-[active=true]:text-white",
    card: "from-rose-50 to-pink-50/70",
    icon: "bg-rose-100 text-rose-700",
    Icon: BookMarked,
  },
  church: {
    chip: "border-blue-200 bg-blue-50 text-blue-800 data-[active=true]:border-blue-600 data-[active=true]:bg-blue-600 data-[active=true]:text-white",
    card: "from-blue-50 to-indigo-50/80",
    icon: "bg-blue-100 text-blue-700",
    Icon: Church,
  },
};

const SEARCH_CHIPS = [
  "keluaran",
  "daud",
  "yesus",
  "pentakosta",
  "yusuf",
  "ester",
];

/** Jelajahi kisah-kisah penting Alkitab. */
export function StoriesExploreView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const featured = useMemo(() => getFeaturedStories(), []);
  const totalCount = getStoryCount();
  const isSearchMode = Boolean(query.trim()) || category !== "all";

  const stories = useMemo(() => {
    let list = searchBibleStories(query);
    if (category !== "all") {
      list = list.filter((story) => story.category === category);
    }
    return list;
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
        <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-gradient-to-br from-[#fff7ed] via-white to-[#eef4ff] px-5 py-5 sm:px-6">
          <p className="member-web-kicker text-[var(--m-accent)]">
            {copy.stories.eyebrow}
          </p>
          <h1 className="member-web-display mt-1.5 text-[clamp(1.65rem,3vw,2.35rem)] leading-[1.1] text-[var(--m-ink)]">
            {copy.stories.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--m-ink-soft)]">
            {copy.stories.subtitle}
          </p>
          <p className="mt-3 text-xs font-medium text-[var(--m-ink-soft)]">
            {copy.stories.catalogCount(totalCount)}
          </p>
        </div>
      </header>

      <div className="space-y-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--m-ink-soft)]" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.stories.searchPlaceholder}
            className="h-11 rounded-xl border-[var(--m-line)] bg-white/90 pl-10"
            aria-label={copy.stories.searchPlaceholder}
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
        aria-label={copy.stories.categoryAria}
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
        {BIBLE_STORY_CATEGORIES.map((item) => (
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

      {!isSearchMode ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[var(--m-accent)]" />
            <h2 className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.stories.featured}
            </h2>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {featured.map((story) => {
              const tone = CATEGORY_TONE[story.category];
              const cat = getStoryCategory(story.category);
              const Icon = tone.Icon;
              return (
                <Link
                  key={story.slug}
                  href={`/baca/kisah/${story.slug}`}
                  className={cn(
                    "group overflow-hidden rounded-2xl border border-[var(--m-line)] bg-gradient-to-br transition hover:border-[var(--m-accent)]/35",
                    tone.card,
                  )}
                >
                  <StoryComicIllustration
                    slug={story.slug}
                    title={story.title}
                    variant="thumb"
                    className="rounded-none border-b border-[var(--m-line)]"
                  />
                  <div className="flex flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        tone.icon,
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="rounded-md bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-[var(--m-ink-soft)]">
                      {storyEraLabel(story.era)}
                    </span>
                  </div>
                  <p className="mt-2 font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
                    {story.title}
                  </p>
                  <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--m-ink-soft)]">
                    {story.summary}
                  </p>
                  <p className="mt-2 text-[10px] font-medium text-[var(--m-ink-soft)]">
                    {cat.label}
                  </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--m-ink)]">
            <ScrollText className="size-4 text-[var(--m-accent)]" />
            {isSearchMode ? copy.stories.results : copy.stories.allStories}
          </h2>
          <span className="text-xs tabular-nums text-[var(--m-ink-soft)]">
            {stories.length} kisah
          </span>
        </div>

        {stories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--m-line)] bg-white/60 px-4 py-10 text-center">
            <p className="text-sm text-[var(--m-ink-soft)]">
              {copy.stories.emptySearch}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--m-line)] overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
            {stories.map((story) => {
              const cat = getStoryCategory(story.category);
              return (
                <li key={story.slug}>
                  <Link
                    href={`/baca/kisah/${story.slug}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--m-wash)]/55 sm:px-5"
                  >
                    <StoryComicIllustration
                      slug={story.slug}
                      title={story.title}
                      variant="thumb"
                      className="size-16 shrink-0 rounded-lg ring-1 ring-[var(--m-line)]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[var(--m-ink)]">
                        {story.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[var(--m-ink-soft)]">
                        {cat.label} · {storyEraLabel(story.era)} ·{" "}
                        {story.keyPassages.length} pasal kunci
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
