"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Library,
  Search,
  Sparkles,
} from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import {
  BIBLE_GLOSSARY_CATEGORIES,
  getFeaturedGlossaryTerms,
  getGlossaryCategory,
  getGlossaryCount,
  glossaryIndexLetter,
  searchBibleGlossary,
  type BibleGlossaryCategoryId,
} from "@/lib/bible-glossary";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | BibleGlossaryCategoryId;

const CATEGORY_TONE: Record<
  BibleGlossaryCategoryId,
  { chip: string; card: string; icon: string }
> = {
  iman: {
    chip: "border-sky-200 bg-sky-50 text-sky-800 data-[active=true]:border-sky-600 data-[active=true]:bg-sky-600 data-[active=true]:text-white",
    card: "from-sky-50 to-cyan-50/80",
    icon: "bg-sky-100 text-sky-700",
  },
  ibadah: {
    chip: "border-violet-200 bg-violet-50 text-violet-800 data-[active=true]:border-violet-600 data-[active=true]:bg-violet-600 data-[active=true]:text-white",
    card: "from-violet-50 to-fuchsia-50/70",
    icon: "bg-violet-100 text-violet-700",
  },
  gelar: {
    chip: "border-amber-200 bg-amber-50 text-amber-900 data-[active=true]:border-amber-600 data-[active=true]:bg-amber-600 data-[active=true]:text-white",
    card: "from-amber-50 to-orange-50/70",
    icon: "bg-amber-100 text-amber-800",
  },
  tempat: {
    chip: "border-emerald-200 bg-emerald-50 text-emerald-800 data-[active=true]:border-emerald-600 data-[active=true]:bg-emerald-600 data-[active=true]:text-white",
    card: "from-emerald-50 to-teal-50/80",
    icon: "bg-emerald-100 text-emerald-700",
  },
  sejarah: {
    chip: "border-slate-200 bg-slate-50 text-slate-800 data-[active=true]:border-slate-700 data-[active=true]:bg-slate-700 data-[active=true]:text-white",
    card: "from-slate-50 to-stone-50/80",
    icon: "bg-slate-100 text-slate-700",
  },
};

/** Glosarium istilah Alkitab yang jarang didengar. */
export function GlossaryExploreView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const featured = useMemo(() => getFeaturedGlossaryTerms().slice(0, 8), []);
  const totalCount = getGlossaryCount();

  const terms = useMemo(() => {
    let list = searchBibleGlossary(query);
    if (category !== "all") {
      list = list.filter((item) => item.category === category);
    }
    return list;
  }, [query, category]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof terms>();
    for (const term of terms) {
      const letter = glossaryIndexLetter(term.term);
      const list = map.get(letter) ?? [];
      list.push(term);
      map.set(letter, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, "id"));
  }, [terms]);

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
        <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-gradient-to-br from-[#eef4ff] via-white to-[#f8fafc] px-5 py-5 sm:px-6 sm:py-6">
          <p className="member-web-kicker text-[var(--m-accent)]">
            {copy.glossary.eyebrow}
          </p>
          <h1 className="member-web-display mt-1.5 text-[clamp(1.65rem,3vw,2.35rem)] leading-[1.1] text-[var(--m-ink)]">
            {copy.glossary.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--m-ink-soft)]">
            {copy.glossary.subtitle}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-[var(--m-ink-soft)]">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1 ring-1 ring-[var(--m-line)]">
              <Library className="size-3.5 text-[var(--m-accent)]" />
              {query || category !== "all"
                ? `${terms.length} dari ${totalCount}`
                : copy.glossary.catalogCount(totalCount)}
            </span>
            <span className="inline-flex items-center rounded-lg bg-white/80 px-2.5 py-1 ring-1 ring-[var(--m-line)]">
              Bahasa awam · ayat pintu masuk
            </span>
          </div>
        </div>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--m-ink-soft)]" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.glossary.searchPlaceholder}
          className="h-11 rounded-xl border-[var(--m-line)] bg-white/90 pl-10"
          aria-label={copy.glossary.searchPlaceholder}
        />
      </div>

      <div
        role="tablist"
        aria-label={copy.glossary.categoryAria}
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
        {BIBLE_GLOSSARY_CATEGORIES.map((item) => (
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
              {copy.glossary.featured}
            </h2>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {featured.map((item) => {
              const tone = CATEGORY_TONE[item.category];
              return (
                <Link
                  key={item.slug}
                  href={`/baca/glosarium/${item.slug}`}
                  className={cn(
                    "group flex items-start gap-3 rounded-2xl border border-[var(--m-line)] bg-gradient-to-br p-3.5 transition hover:border-[var(--m-accent)]/35",
                    tone.card,
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                      tone.icon,
                    )}
                  >
                    {item.term.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
                      {item.term}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--m-ink-soft)]">
                      {item.plainMeaning}
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
            <BookOpen className="size-4 text-[var(--m-accent)]" />
            {query || category !== "all"
              ? copy.glossary.results
              : copy.glossary.allTerms}
          </h2>
          <span className="text-xs tabular-nums text-[var(--m-ink-soft)]">
            {terms.length} istilah
          </span>
        </div>

        {terms.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--m-line)] bg-white/60 px-4 py-10 text-center text-sm text-[var(--m-ink-soft)]">
            {copy.glossary.emptySearch}
          </p>
        ) : (
          <div className="space-y-5">
            {grouped.map(([letter, items]) => (
              <div key={letter} className="space-y-2">
                <p className="sticky top-0 z-[1] -mx-1 bg-[var(--m-paper)]/90 px-1 py-1 text-[11px] font-bold tracking-[0.16em] text-[var(--m-accent)] uppercase backdrop-blur-sm">
                  {letter}
                </p>
                <ul className="divide-y divide-[var(--m-line)] overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
                  {items.map((item) => {
                    const cat = getGlossaryCategory(item.category);
                    return (
                      <li key={item.slug}>
                        <Link
                          href={`/baca/glosarium/${item.slug}`}
                          className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--m-wash)]/55 sm:px-5"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--m-wash)] text-xs font-bold text-[var(--m-accent)]">
                            {item.term.charAt(0)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-[var(--m-ink)]">
                              {item.term}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-[var(--m-ink-soft)]">
                              {cat.label}
                              {item.alsoCalled?.[0]
                                ? ` · juga: ${item.alsoCalled[0]}`
                                : ""}
                            </p>
                          </div>
                          <ChevronRight className="size-4 shrink-0 text-[var(--m-ink-soft)]/45" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
