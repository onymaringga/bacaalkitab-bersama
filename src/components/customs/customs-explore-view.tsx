"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Flame,
  HandMetal,
  Scroll,
  Search,
  Sparkles,
  Waves,
} from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import {
  BIBLE_CUSTOM_CATEGORIES,
  getCustomCount,
  getFeaturedCustoms,
  getCustomCategory,
  searchBibleCustoms,
  customEraLabel,
  type BibleCustomCategoryId,
} from "@/lib/bible-customs";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | BibleCustomCategoryId;

const CATEGORY_TONE: Record<
  BibleCustomCategoryId,
  { chip: string; card: string; icon: string; Icon: typeof Scroll }
> = {
  perayaan: {
    chip: "border-amber-200 bg-amber-50 text-amber-900 data-[active=true]:border-amber-700 data-[active=true]:bg-amber-700 data-[active=true]:text-white",
    card: "from-amber-50 to-orange-50/80",
    icon: "bg-amber-100 text-amber-800",
    Icon: Sparkles,
  },
  perjanjian: {
    chip: "border-rose-200 bg-rose-50 text-rose-900 data-[active=true]:border-rose-700 data-[active=true]:bg-rose-700 data-[active=true]:text-white",
    card: "from-rose-50 to-pink-50/80",
    icon: "bg-rose-100 text-rose-800",
    Icon: HandMetal,
  },
  kesucian: {
    chip: "border-cyan-200 bg-cyan-50 text-cyan-900 data-[active=true]:border-cyan-700 data-[active=true]:bg-cyan-700 data-[active=true]:text-white",
    card: "from-cyan-50 to-sky-50/80",
    icon: "bg-cyan-100 text-cyan-800",
    Icon: Waves,
  },
  ibadah: {
    chip: "border-violet-200 bg-violet-50 text-violet-900 data-[active=true]:border-violet-700 data-[active=true]:bg-violet-700 data-[active=true]:text-white",
    card: "from-violet-50 to-purple-50/80",
    icon: "bg-violet-100 text-violet-800",
    Icon: Flame,
  },
  simbol: {
    chip: "border-emerald-200 bg-emerald-50 text-emerald-900 data-[active=true]:border-emerald-700 data-[active=true]:bg-emerald-700 data-[active=true]:text-white",
    card: "from-emerald-50 to-teal-50/80",
    icon: "bg-emerald-100 text-emerald-800",
    Icon: Scroll,
  },
};

const SEARCH_CHIPS = [
  "Paskah",
  "sunat",
  "menstruasi",
  "lepas sandal",
  "Sabat",
  "puasa",
];

export function CustomsExploreView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const featured = useMemo(() => getFeaturedCustoms(), []);
  const customs = useMemo(() => {
    let list = searchBibleCustoms(query);
    if (category !== "all") {
      list = list.filter((item) => item.category === category);
    }
    return list;
  }, [query, category]);

  const isSearchMode = Boolean(query.trim()) || category !== "all";

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
        <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-gradient-to-br from-[#f5f0e8] via-white to-[#eef6f0] px-5 py-5 sm:px-6 sm:py-6">
          <p className="member-web-kicker text-[var(--m-accent)]">
            {copy.customs.eyebrow}
          </p>
          <h1 className="member-web-display mt-1.5 text-[clamp(1.65rem,3vw,2.35rem)] leading-[1.1] text-[var(--m-ink)]">
            {copy.customs.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--m-ink-soft)]">
            {copy.customs.subtitle}
          </p>
          <p className="mt-3 text-[11px] font-medium tabular-nums text-[var(--m-ink-soft)]">
            {copy.customs.catalogCount(getCustomCount())}
          </p>
        </div>
      </header>

      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--m-ink-soft)]" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.customs.searchPlaceholder}
            className="h-11 rounded-xl border-[var(--m-line)] bg-white/90 pl-10"
          />
        </div>
        {!isSearchMode ? (
          <div className="flex flex-wrap gap-1.5">
            {SEARCH_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setQuery(chip)}
                className="rounded-lg border border-[var(--m-line)] bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[var(--m-ink-soft)] transition hover:border-[var(--m-accent)]/30 hover:text-[var(--m-accent)]"
              >
                {chip}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <p className="px-0.5 text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
          {copy.customs.categoryLabel}
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            data-active={category === "all"}
            onClick={() => setCategory("all")}
            className={cn(
              "inline-flex h-8 shrink-0 items-center rounded-lg border px-2.5 text-xs font-semibold transition",
              category === "all"
                ? "border-[var(--m-accent)] bg-[var(--m-accent)] text-white"
                : "border-[var(--m-line)] bg-white text-[var(--m-ink-soft)]",
            )}
          >
            Semua
          </button>
          {BIBLE_CUSTOM_CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              data-active={category === item.id}
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
      </div>

      {!isSearchMode ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[var(--m-accent)]" />
            <h2 className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.customs.featured}
            </h2>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {featured.map((item) => {
              const tone = CATEGORY_TONE[item.category];
              const cat = getCustomCategory(item.category);
              const Icon = tone.Icon;
              return (
                <Link
                  key={item.slug}
                  href={`/baca/kebiasaan/${item.slug}`}
                  className={cn(
                    "group flex flex-col rounded-2xl border border-[var(--m-line)] bg-gradient-to-br p-4 transition hover:border-[var(--m-accent)]/35 hover:shadow-sm",
                    tone.card,
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl",
                        tone.icon,
                      )}
                    >
                      <Icon className="size-4.5" />
                    </span>
                    <ChevronRight className="size-4 text-[var(--m-ink-soft)]/40 group-hover:text-[var(--m-accent)]" />
                  </div>
                  <p className="mt-3 font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold text-[var(--m-accent)]/90 uppercase">
                    {cat.label}
                  </p>
                  <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-[var(--m-ink-soft)]">
                    {item.summary}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--m-ink)]">
          {isSearchMode ? copy.customs.results : copy.customs.allCustoms}
        </h2>
        {customs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--m-line)] px-4 py-10 text-center text-sm text-[var(--m-ink-soft)]">
            {copy.customs.emptySearch}
          </p>
        ) : (
          <ul className="divide-y divide-[var(--m-line)] overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
            {customs.map((item) => {
              const cat = getCustomCategory(item.category);
              return (
                <li key={item.slug}>
                  <Link
                    href={`/baca/kebiasaan/${item.slug}`}
                    className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-[var(--m-wash)]/45 sm:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium text-[var(--m-accent)]/90">
                        {cat.label} · {customEraLabel(item.era)}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-[var(--m-ink-soft)]">
                        {item.summary}
                      </p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-[var(--m-ink-soft)]/40 group-hover:text-[var(--m-accent)]" />
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
