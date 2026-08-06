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
import { HolyLandGoogleMap } from "@/components/places/holy-land-google-map";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import {
  BIBLE_PLACE_REGIONS,
  getFeaturedPlaces,
  getPlaceCount,
  getPlaceKind,
  getStoryCount,
  getUsedPlaceKinds,
  searchBiblePlaces,
  type BiblePlaceKindId,
  type BiblePlaceRegionId,
} from "@/lib/bible-places";
import { cn } from "@/lib/utils";

type RegionFilter = "all" | BiblePlaceRegionId;
type KindFilter = "all" | BiblePlaceKindId;

const REGION_CHIP: Record<BiblePlaceRegionId, string> = {
  kanaan:
    "border-amber-200 bg-amber-50 text-amber-900 data-[active=true]:border-amber-700 data-[active=true]:bg-amber-700 data-[active=true]:text-white",
  galilea:
    "border-sky-200 bg-sky-50 text-sky-800 data-[active=true]:border-sky-600 data-[active=true]:bg-sky-600 data-[active=true]:text-white",
  mesir:
    "border-orange-200 bg-orange-50 text-orange-900 data-[active=true]:border-orange-700 data-[active=true]:bg-orange-700 data-[active=true]:text-white",
  mesopotamia:
    "border-violet-200 bg-violet-50 text-violet-800 data-[active=true]:border-violet-600 data-[active=true]:bg-violet-600 data-[active=true]:text-white",
  mediterania:
    "border-teal-200 bg-teal-50 text-teal-800 data-[active=true]:border-teal-600 data-[active=true]:bg-teal-600 data-[active=true]:text-white",
  lainnya:
    "border-slate-200 bg-slate-50 text-slate-800 data-[active=true]:border-slate-700 data-[active=true]:bg-slate-700 data-[active=true]:text-white",
};

const KIND_CHIP =
  "border-[var(--m-line)] bg-[var(--m-paper)] text-[var(--m-ink-soft)] data-[active=true]:border-[var(--m-accent)] data-[active=true]:bg-[var(--m-accent)] data-[active=true]:text-white";

function placeToArticle(
  item: ReturnType<typeof getFeaturedPlaces>[number],
): ExplorePortalArticle {
  return {
    id: item.slug,
    href: `/baca/peta/${item.slug}`,
    section: getPlaceKind(item.kind).label,
    title: item.name,
    excerpt: item.blurb,
  };
}

/** Jelajahi tempat Alkitab di peta Google Maps. */
export function PlacesExploreView() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);

  const featured = useMemo(() => getFeaturedPlaces(), []);
  const placeCount = getPlaceCount();
  const storyCount = getStoryCount();
  const usedKinds = useMemo(() => getUsedPlaceKinds(), []);

  const places = useMemo(() => {
    let list = searchBiblePlaces(query);
    if (region !== "all") {
      list = list.filter((item) => item.region === region);
    }
    if (kind !== "all") {
      list = list.filter((item) => item.kind === kind);
    }
    return list;
  }, [query, region, kind]);

  const mapPlaces = useMemo(() => {
    if (region === "all" && kind === "all" && !query.trim()) {
      return searchBiblePlaces("");
    }
    return places;
  }, [places, region, kind, query]);

  const hasFilter = Boolean(query || region !== "all" || kind !== "all");

  const heroPlace = featured[0];
  const hero: ExplorePortalHero | null = heroPlace
    ? {
        href: `/baca/peta/${heroPlace.slug}`,
        eyebrow: copy.explore.portalHeroEyebrow,
        section: copy.places.title,
        title: heroPlace.name,
        excerpt: heroPlace.blurb,
      }
    : null;

  const highlightArticles = featured.slice(1, 5).map(placeToArticle);

  return (
    <ExplorePortalShell
      eyebrow={copy.places.eyebrow}
      title={copy.places.title}
      subtitle={copy.places.subtitle}
      stats={copy.places.catalogCount(placeCount, storyCount)}
      hero={hero}
      toolbar={
        <>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--m-ink-soft)]" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.places.searchPlaceholder}
              className="h-11 rounded-xl border-[var(--m-line)] bg-[var(--m-paper)]/90 pl-10"
              aria-label={copy.places.searchPlaceholder}
            />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
              {copy.places.kindLabel}
            </p>
            <div
              role="tablist"
              aria-label={copy.places.kindAria}
              className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <button
                type="button"
                role="tab"
                aria-selected={kind === "all"}
                onClick={() => setKind("all")}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center rounded-lg border px-2.5 text-xs font-semibold transition",
                  KIND_CHIP,
                )}
              >
                {copy.places.allKinds}
              </button>
              {usedKinds.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={kind === item.id}
                  onClick={() => setKind(item.id)}
                  className={cn(
                    "inline-flex h-8 shrink-0 items-center rounded-lg border px-2.5 text-xs font-semibold transition",
                    KIND_CHIP,
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
              {copy.places.regionLabel}
            </p>
            <div
              role="tablist"
              aria-label={copy.places.regionAria}
              className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <button
                type="button"
                role="tab"
                aria-selected={region === "all"}
                onClick={() => setRegion("all")}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center rounded-lg border px-2.5 text-xs font-semibold transition",
                  region === "all"
                    ? "border-[var(--m-accent)] bg-[var(--m-accent)] text-white"
                    : "border-[var(--m-line)] bg-[var(--m-paper)] text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
                )}
              >
                Semua
              </button>
              {BIBLE_PLACE_REGIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={region === item.id}
                  onClick={() => setRegion(item.id)}
                  className={cn(
                    "inline-flex h-8 shrink-0 items-center rounded-lg border px-2.5 text-xs font-semibold transition",
                    REGION_CHIP[item.id],
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
            { label: "Betlehem", href: "/baca/peta/betlehem" },
            { label: "Yerusalem", href: "/baca/peta/yerusalem" },
            { label: "Mesir", href: "/baca/peta/mesir" },
          ]}
        />
      }
      footer={
        <p className="rounded-xl border border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/40 px-4 py-3 text-xs leading-relaxed text-[var(--m-ink-soft)]">
          {copy.places.mapHint}
        </p>
      }
    >
      <HolyLandGoogleMap
        places={mapPlaces}
        activeSlug={hoverSlug}
        onSelect={setHoverSlug}
      />

      {!hasFilter && highlightArticles.length > 0 ? (
        <section className="space-y-3">
          <PortalSectionHeader
            title={copy.places.featured}
            hint={copy.explore.featuredHint}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {highlightArticles.map((article) => (
              <div
                key={article.id}
                onMouseEnter={() => setHoverSlug(article.id)}
                onMouseLeave={() => setHoverSlug(null)}
              >
                <PortalArticleCard article={article} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <PortalCatalogSection
        title={hasFilter ? copy.places.results : copy.places.allPlaces}
        countLabel={`${places.length} tempat`}
        isEmpty={places.length === 0}
        emptyMessage={copy.places.emptySearch}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {places.map((item) => (
            <div
              key={item.slug}
              onMouseEnter={() => setHoverSlug(item.slug)}
              onMouseLeave={() => setHoverSlug(null)}
            >
              <PortalArticleCard article={placeToArticle(item)} />
            </div>
          ))}
        </div>
      </PortalCatalogSection>
    </ExplorePortalShell>
  );
}
