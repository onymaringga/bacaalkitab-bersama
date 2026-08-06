"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import {
  ExplorePortalShell,
  ExplorePortalSidebar,
  PortalArticleCard,
  PortalCatalogSection,
  PortalSectionHeader,
  type ExplorePortalArticle,
  type ExplorePortalHero,
} from "@/components/explore/explore-portal-shell";
import { BookThumbnail } from "@/components/kitab/book-thumbnail";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BIBLE_BOOKS,
  getNewTestamentBooks,
  getOldTestamentBooks,
} from "@/lib/bible-books";
import {
  bookIntroHref,
  getBookWithIntro,
  searchBibleBookIntros,
} from "@/lib/bible-book-intros";
import { getBookImage } from "@/lib/bible-book-images";
import { copy } from "@/lib/copy";

type TestamentFilter = "all" | "pl" | "pb";

function bookToArticle({
  book,
  intro,
}: NonNullable<ReturnType<typeof getBookWithIntro>>): ExplorePortalArticle {
  const image = getBookImage(book.abbr, book.name, intro.genre);
  return {
    id: book.abbr,
    href: bookIntroHref(book.abbr),
    section: intro.genre,
    title: book.name,
    excerpt: intro.summary,
    image,
    imageSlot: (
      <BookThumbnail
        abbr={book.abbr}
        bookName={book.name}
        genre={intro.genre}
        variant="thumb"
        className="size-full rounded-none"
      />
    ),
  };
}

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

  const isSearchMode = Boolean(query.trim()) || testament !== "all";

  const heroSource = useMemo(() => {
    if (results[0]) return results[0];
    return getBookWithIntro("Kej") ?? getBookWithIntro("Mat");
  }, [results]);

  const hero: ExplorePortalHero | null = heroSource
    ? {
        href: bookIntroHref(heroSource.book.abbr),
        eyebrow: copy.explore.portalHeroEyebrow,
        section: copy.bookIntro.title,
        title: heroSource.book.name,
        excerpt: heroSource.intro.summary,
        image: getBookImage(
          heroSource.book.abbr,
          heroSource.book.name,
          heroSource.intro.genre,
        ),
        imageSlot: (
          <BookThumbnail
            abbr={heroSource.book.abbr}
            bookName={heroSource.book.name}
            genre={heroSource.intro.genre}
            variant="hero"
            className="size-full rounded-none"
          />
        ),
      }
    : null;

  const highlightResults = useMemo(() => {
    if (isSearchMode || !heroSource) return [];
    const heroAbbr = heroSource.book.abbr;
    return results.filter((item) => item.book.abbr !== heroAbbr).slice(0, 4);
  }, [results, heroSource, isSearchMode]);

  return (
    <ExplorePortalShell
      eyebrow={copy.bookIntro.eyebrow}
      title={copy.bookIntro.title}
      subtitle={copy.bookIntro.subtitle}
      stats={`${BIBLE_BOOKS.length} kitab`}
      hero={hero}
      toolbar={
        <>
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
        </>
      }
      sidebar={
        <ExplorePortalSidebar
          popularLinks={[
            { label: "Kejadian", href: "/baca/kitab/Kej" },
            { label: "Matius", href: "/baca/kitab/Mat" },
            { label: "Roma", href: "/baca/kitab/Rom" },
          ]}
        />
      }
      footer={
        <p className="text-xs leading-relaxed text-[var(--m-ink-soft)]">
          {copy.bookIntro.disclaimer}
        </p>
      }
    >
      {!isSearchMode && highlightResults.length > 0 ? (
        <section className="space-y-3">
          <PortalSectionHeader
            title={copy.explore.featuredTitle}
            hint={copy.explore.featuredHint}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {highlightResults.map((item) => (
              <PortalArticleCard
                key={item.book.abbr}
                article={bookToArticle(item)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <PortalCatalogSection
        title={isSearchMode ? copy.bookIntro.results : copy.bookIntro.listTitle}
        countLabel={`${results.length} kitab`}
        isEmpty={results.length === 0}
        emptyMessage={copy.bookIntro.emptySearch}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {results.map((item) => (
            <PortalArticleCard
              key={item.book.abbr}
              article={bookToArticle(item)}
            />
          ))}
        </div>
      </PortalCatalogSection>
    </ExplorePortalShell>
  );
}
