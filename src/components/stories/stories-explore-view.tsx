"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";

import {
  ExplorePortalShell,
  ExplorePortalSidebar,
  PortalArticleCard,
  PortalCatalogSection,
  PortalSearchChips,
  PortalSectionHeader,
  type ExplorePortalArticle,
  type ExplorePortalHero,
} from "@/components/explore/explore-portal-shell";
import { StoryComicIllustration } from "@/components/stories/story-comic-illustration";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import { getStoryImage } from "@/lib/bible-story-images";
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

const SEARCH_CHIPS = [
  "keluaran",
  "daud",
  "yesus",
  "pentakosta",
  "yusuf",
  "ester",
] as const;

function storyToArticle(story: ReturnType<typeof getFeaturedStories>[number]): ExplorePortalArticle {
  const image = getStoryImage(story.slug, story.title);
  return {
    id: story.slug,
    href: `/baca/kisah/${story.slug}`,
    section: getStoryCategory(story.category).label,
    title: story.title,
    excerpt: story.summary,
    image,
    imageSlot: (
      <StoryComicIllustration
        slug={story.slug}
        title={story.title}
        variant="thumb"
        className="size-full rounded-none"
      />
    ),
  };
}

/** Jelajahi kisah-kisah penting Alkitab — gaya portal. */
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

  const heroStory = featured[0];
  const hero: ExplorePortalHero | null = heroStory
    ? {
        href: `/baca/kisah/${heroStory.slug}`,
        eyebrow: copy.explore.portalHeroEyebrow,
        section: copy.stories.title,
        title: heroStory.title,
        excerpt: heroStory.summary,
        imageSlot: (
          <StoryComicIllustration
            slug={heroStory.slug}
            title={heroStory.title}
            variant="hero"
            className="size-full rounded-none"
          />
        ),
      }
    : null;

  const highlightArticles = featured.slice(1, 5).map(storyToArticle);

  return (
    <ExplorePortalShell
      eyebrow={copy.stories.eyebrow}
      title={copy.stories.title}
      subtitle={copy.stories.subtitle}
      stats={copy.stories.catalogCount(totalCount)}
      hero={hero}
      toolbar={
        <>
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
            <PortalSearchChips chips={SEARCH_CHIPS} onSelect={setQuery} />
          ) : null}
          <div
            role="tablist"
            aria-label={copy.stories.categoryAria}
            className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <button
              type="button"
              role="tab"
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
                aria-selected={category === item.id}
                onClick={() => setCategory(item.id)}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center rounded-lg border px-2.5 text-xs font-semibold transition",
                  category === item.id
                    ? "border-[var(--m-accent)] bg-[var(--m-accent)] text-white"
                    : "border-[var(--m-line)] bg-white text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      }
      sidebar={
        <ExplorePortalSidebar
          popularLinks={[
            { label: "Keluaran", href: "/baca/kisah/keluaran-mesir" },
            { label: "Yusuf", href: "/baca/kisah/yusuf-mesir" },
            { label: "Samaritan baik", href: "/baca/kisah/samaritan-baik" },
          ]}
        />
      }
    >
      {!isSearchMode && highlightArticles.length > 0 ? (
        <section className="space-y-3">
          <PortalSectionHeader
            title={copy.stories.featured}
            hint={copy.explore.featuredHint}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {highlightArticles.map((article) => (
              <PortalArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ) : null}

      <PortalCatalogSection
        title={
          isSearchMode ? copy.stories.results : copy.stories.allStories
        }
        countLabel={`${stories.length} kisah`}
        isEmpty={stories.length === 0}
        emptyMessage={copy.stories.emptySearch}
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {stories.map((story) => {
            const cat = getStoryCategory(story.category);
            return (
              <li key={story.slug}>
                <Link
                  href={`/baca/kisah/${story.slug}`}
                  className="group flex h-full items-center gap-3 rounded-xl border border-[var(--m-line)] bg-white px-3.5 py-3 transition hover:border-[var(--m-accent)]/30"
                >
                  <StoryComicIllustration
                    slug={story.slug}
                    title={story.title}
                    variant="thumb"
                    className="size-14 shrink-0 rounded-lg ring-1 ring-[var(--m-line)]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
                      {story.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--m-ink-soft)]">
                      {cat.label} · {storyEraLabel(story.era)}
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 opacity-40" />
                </Link>
              </li>
            );
          })}
        </ul>
      </PortalCatalogSection>
    </ExplorePortalShell>
  );
}
