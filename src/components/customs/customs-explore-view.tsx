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
  BIBLE_CUSTOM_CATEGORIES,
  getCustomCount,
  getFeaturedCustoms,
  getCustomCategory,
  searchBibleCustoms,
  type BibleCustomCategoryId,
} from "@/lib/bible-customs";
import { getCustomImage } from "@/lib/bible-custom-images";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | BibleCustomCategoryId;

const SEARCH_CHIPS = [
  "Paskah",
  "sunat",
  "menstruasi",
  "lepas sandal",
  "Sabat",
  "puasa",
] as const;

const CATEGORY_CHIP: Record<BibleCustomCategoryId, string> = {
  perayaan:
    "border-amber-200 bg-amber-50 text-amber-900 data-[active=true]:border-amber-700 data-[active=true]:bg-amber-700 data-[active=true]:text-white",
  perjanjian:
    "border-rose-200 bg-rose-50 text-rose-900 data-[active=true]:border-rose-700 data-[active=true]:bg-rose-700 data-[active=true]:text-white",
  kesucian:
    "border-cyan-200 bg-cyan-50 text-cyan-900 data-[active=true]:border-cyan-700 data-[active=true]:bg-cyan-700 data-[active=true]:text-white",
  ibadah:
    "border-violet-200 bg-violet-50 text-violet-900 data-[active=true]:border-violet-700 data-[active=true]:bg-violet-700 data-[active=true]:text-white",
  simbol:
    "border-emerald-200 bg-emerald-50 text-emerald-900 data-[active=true]:border-emerald-700 data-[active=true]:bg-emerald-700 data-[active=true]:text-white",
};

function customToArticle(
  item: ReturnType<typeof getFeaturedCustoms>[number],
): ExplorePortalArticle {
  return {
    id: item.slug,
    href: `/baca/kebiasaan/${item.slug}`,
    section: getCustomCategory(item.category).label,
    title: item.title,
    excerpt: item.summary,
    image: getCustomImage(item.slug, item.title, item.category),
  };
}

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

  const heroCustom = featured[0];
  const hero: ExplorePortalHero | null = heroCustom
    ? {
        href: `/baca/kebiasaan/${heroCustom.slug}`,
        eyebrow: copy.explore.portalHeroEyebrow,
        section: copy.customs.title,
        title: heroCustom.title,
        excerpt: heroCustom.summary,
        image: getCustomImage(
          heroCustom.slug,
          heroCustom.title,
          heroCustom.category,
        ),
      }
    : null;

  const highlightArticles = featured.slice(1, 5).map(customToArticle);

  return (
    <ExplorePortalShell
      eyebrow={copy.customs.eyebrow}
      title={copy.customs.title}
      subtitle={copy.customs.subtitle}
      stats={copy.customs.catalogCount(getCustomCount())}
      hero={hero}
      toolbar={
        <>
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
            <PortalSearchChips chips={SEARCH_CHIPS} onSelect={setQuery} />
          ) : null}
          <div className="space-y-2">
            <p className="px-0.5 text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
              {copy.customs.categoryLabel}
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
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
          </div>
        </>
      }
      sidebar={
        <ExplorePortalSidebar
          popularLinks={[
            { label: "Paskah", href: "/baca/kebiasaan/paskah" },
            { label: "Sunat", href: "/baca/kebiasaan/sunat" },
            { label: "Sabat", href: "/baca/kebiasaan/sabat" },
          ]}
        />
      }
    >
      {!isSearchMode && highlightArticles.length > 0 ? (
        <section className="space-y-3">
          <PortalSectionHeader
            title={copy.customs.featured}
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
        title={isSearchMode ? copy.customs.results : copy.customs.allCustoms}
        countLabel={`${customs.length} kebiasaan`}
        isEmpty={customs.length === 0}
        emptyMessage={copy.customs.emptySearch}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {customs.map((item) => (
            <PortalArticleCard key={item.slug} article={customToArticle(item)} />
          ))}
        </div>
      </PortalCatalogSection>
    </ExplorePortalShell>
  );
}
