"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Library,
  Scroll,
  Search,
} from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getNewTestamentBooks,
  getOldTestamentBooks,
} from "@/lib/bible-books";
import {
  bookIntroHref,
  searchBibleBookIntros,
} from "@/lib/bible-book-intros";
import { copy } from "@/lib/copy";

type TestamentFilter = "all" | "pl" | "pb";

export function KitabExploreView() {
  const [query, setQuery] = useState("");
  const [testament, setTestament] = useState<TestamentFilter>("all");

  const results = useMemo(() => {
    let list = searchBibleBookIntros(query);
    if (testament === "pl") {
      const allowed = new Set(getOldTestamentBooks().map((b) => b.abbr));
      list = list.filter((item) => allowed.has(item.book.abbr));
    } else if (testament === "pb") {
      const allowed = new Set(getNewTestamentBooks().map((b) => b.abbr));
      list = list.filter((item) => allowed.has(item.book.abbr));
    }
    return list;
  }, [query, testament]);

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
            {copy.bookIntro.eyebrow}
          </p>
          <h1 className="member-web-display mt-1.5 text-[clamp(1.65rem,3vw,2.35rem)] leading-[1.1] text-[var(--m-ink)]">
            {copy.bookIntro.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--m-ink-soft)]">
            {copy.bookIntro.subtitle}
          </p>
        </div>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--m-ink-soft)]" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.bookIntro.searchPlaceholder}
          className="h-11 rounded-xl border-[var(--m-line)] bg-white/90 pl-10"
          aria-label={copy.bookIntro.searchPlaceholder}
        />
      </div>

      <Tabs
        value={testament}
        onValueChange={(value) => setTestament(value as TestamentFilter)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">{copy.bookIntro.allBooks}</TabsTrigger>
          <TabsTrigger value="pl">{copy.bible.oldTestament}</TabsTrigger>
          <TabsTrigger value="pb">{copy.bible.newTestament}</TabsTrigger>
        </TabsList>
      </Tabs>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--m-ink)]">
            <Library className="size-4 text-[var(--m-accent)]" />
            {query ? copy.bookIntro.results : copy.bookIntro.listTitle}
          </h2>
          <span className="text-xs tabular-nums text-[var(--m-ink-soft)]">
            {results.length} kitab
          </span>
        </div>

        {results.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--m-line)] bg-white/60 px-4 py-10 text-center text-sm text-[var(--m-ink-soft)]">
            {copy.bookIntro.emptySearch}
          </p>
        ) : (
          <ul className="divide-y divide-[var(--m-line)] overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
            {results.map(({ book, intro }) => (
              <li key={book.abbr}>
                <Link
                  href={bookIntroHref(book.abbr)}
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--m-wash)]/55 sm:px-5"
                >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--m-wash)] text-[var(--m-accent)]">
                      <Scroll className="size-3.5" />
                    </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--m-ink)]">
                      {book.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[var(--m-ink-soft)]">
                      {intro.genre} · {intro.summary}
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-[var(--m-ink-soft)]/45" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-[var(--m-ink-soft)]">
        <BookOpen className="mt-0.5 size-3.5 shrink-0" />
        {copy.bookIntro.disclaimer}
      </p>
    </div>
  );
}
