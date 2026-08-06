"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

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

const SEARCH_CHIPS = [
  "kasih",
  "ketakutan",
  "doa",
  "pengampunan",
  "kerja",
  "keselamatan",
] as const;

const CATEGORY_CHIP: Record<BibleTopicCategoryId, string> = {
  faith:
    "border-sky-200 bg-sky-50 text-sky-800 data-[active=true]:border-sky-600 data-[active=true]:bg-sky-600 data-[active=true]:text-white",
  emotion:
    "border-rose-200 bg-rose-50 text-rose-800 data-[active=true]:border-rose-600 data-[active=true]:bg-rose-600 data-[active=true]:text-white",
  relationship:
    "border-emerald-200 bg-emerald-50 text-emerald-800 data-[active=true]:border-emerald-600 data-[active=true]:bg-emerald-600 data-[active=true]:text-white",
  life: "border-amber-200 bg-amber-50 text-amber-900 data-[active=true]:border-amber-600 data-[active=true]:bg-amber-600 data-[active=true]:text-white",
  promise:
    "border-indigo-200 bg-indigo-50 text-indigo-800 data-[active=true]:border-indigo-600 data-[active=true]:bg-indigo-600 data-[active=true]:text-white",
};

function topicToArticle(
  topic: ReturnType<typeof getFeaturedTopics>[number],
): ExplorePortalArticle {
  return {
    id: topic.slug,
    href: `/baca/topik/${topic.slug}`,
    section: getTopicCategory(topic.category).label,
    title: topic.title,
    excerpt: topic.summary,
  };
}

/** Jelajahi Alkitab lewat topik — pola Discover / Topical Index. */
export function TopicsExploreView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const featured = useMemo(() => getFeaturedTopics(), []);
  const totalCount = BIBLE_TOPICS.length;
  const isSearchMode = Boolean(query.trim()) || category !== "all";

  const topics = useMemo(() => {
    let list = searchBibleTopics(query);
    if (category !== "all") {
      list = list.filter((topic) => topic.category === category);
    }
    return [...list].sort((a, b) => a.title.localeCompare(b.title, "id"));
  }, [query, category]);

  const heroTopic = featured[0];
  const hero: ExplorePortalHero | null = heroTopic
    ? {
        href: `/baca/topik/${heroTopic.slug}`,
        eyebrow: copy.explore.portalHeroEyebrow,
        section: copy.topics.title,
        title: heroTopic.title,
        excerpt: heroTopic.summary,
      }
    : null;

  const highlightArticles = featured.slice(1, 5).map(topicToArticle);

  return (
    <ExplorePortalShell
      eyebrow={copy.topics.eyebrow}
      title={copy.topics.title}
      subtitle={copy.topics.subtitle}
      stats={copy.topics.catalogCount(totalCount)}
      hero={hero}
      toolbar={
        <>
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
            <PortalSearchChips chips={SEARCH_CHIPS} onSelect={setQuery} />
          ) : null}
          <div
            role="tablist"
            aria-label={copy.topics.categoryAria}
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
            {BIBLE_TOPIC_CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={category === item.id}
                onClick={() => setCategory(item.id)}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center rounded-lg border px-2.5 text-xs font-semibold transition",
                  CATEGORY_CHIP[item.id],
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
            { label: "Kasih", href: "/baca/topik/kasih" },
            { label: "Doa", href: "/baca/topik/doa" },
            { label: "Ketakutan", href: "/baca/topik/ketakutan" },
          ]}
        />
      }
    >
      {!isSearchMode && highlightArticles.length > 0 ? (
        <section className="space-y-3">
          <PortalSectionHeader
            title={copy.topics.featured}
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
        title={isSearchMode ? copy.topics.results : copy.topics.allTopics}
        countLabel={`${topics.length} dari ${totalCount}`}
        isEmpty={topics.length === 0}
        emptyMessage={copy.topics.emptySearch}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {topics.map((topic) => (
            <PortalArticleCard
              key={topic.slug}
              article={topicToArticle(topic)}
            />
          ))}
        </div>
      </PortalCatalogSection>
    </ExplorePortalShell>
  );
}
