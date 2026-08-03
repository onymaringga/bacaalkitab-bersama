"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  MapPinned,
  Search,
  Sparkles,
} from "lucide-react";

import { HolyLandGoogleMap } from "@/components/places/holy-land-google-map";
import { HistoryBackButton } from "@/components/ui/history-back-button";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import {
  BIBLE_PLACE_REGIONS,
  getFeaturedPlaces,
  getPlaceCount,
  getPlaceKind,
  getPlaceRegion,
  getStoryCount,
  getUsedPlaceKinds,
  searchBiblePlaces,
  type BiblePlaceKindId,
  type BiblePlaceRegionId,
} from "@/lib/bible-places";
import { cn } from "@/lib/utils";

type RegionFilter = "all" | BiblePlaceRegionId;
type KindFilter = "all" | BiblePlaceKindId;

const REGION_TONE: Record<
  BiblePlaceRegionId,
  { chip: string; soft: string }
> = {
  kanaan: {
    chip: "border-amber-200 bg-amber-50 text-amber-900 data-[active=true]:border-amber-700 data-[active=true]:bg-amber-700 data-[active=true]:text-white",
    soft: "bg-amber-100 text-amber-800",
  },
  galilea: {
    chip: "border-sky-200 bg-sky-50 text-sky-800 data-[active=true]:border-sky-600 data-[active=true]:bg-sky-600 data-[active=true]:text-white",
    soft: "bg-sky-100 text-sky-800",
  },
  mesir: {
    chip: "border-orange-200 bg-orange-50 text-orange-900 data-[active=true]:border-orange-700 data-[active=true]:bg-orange-700 data-[active=true]:text-white",
    soft: "bg-orange-100 text-orange-900",
  },
  mesopotamia: {
    chip: "border-violet-200 bg-violet-50 text-violet-800 data-[active=true]:border-violet-600 data-[active=true]:bg-violet-600 data-[active=true]:text-white",
    soft: "bg-violet-100 text-violet-800",
  },
  mediterania: {
    chip: "border-teal-200 bg-teal-50 text-teal-800 data-[active=true]:border-teal-600 data-[active=true]:bg-teal-600 data-[active=true]:text-white",
    soft: "bg-teal-100 text-teal-800",
  },
  lainnya: {
    chip: "border-slate-200 bg-slate-50 text-slate-800 data-[active=true]:border-slate-700 data-[active=true]:bg-slate-700 data-[active=true]:text-white",
    soft: "bg-slate-100 text-slate-800",
  },
};

const KIND_CHIP =
  "border-[var(--m-line)] bg-[var(--m-paper)] text-[var(--m-ink-soft)] data-[active=true]:border-[var(--m-accent)] data-[active=true]:bg-[var(--m-accent)] data-[active=true]:text-white";

/** Jelajahi tempat Alkitab di peta Google Maps. */
export function PlacesExploreView() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);

  const featured = useMemo(() => getFeaturedPlaces().slice(0, 6), []);
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
        <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-gradient-to-br from-[#e7f0e8] via-white to-[#eef4ff] px-5 py-5 sm:px-6 sm:py-6">
          <p className="member-web-kicker text-[var(--m-accent)]">
            {copy.places.eyebrow}
          </p>
          <h1 className="member-web-display mt-1.5 text-[clamp(1.65rem,3vw,2.35rem)] leading-[1.1] text-[var(--m-ink)]">
            {copy.places.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--m-ink-soft)]">
            {copy.places.subtitle}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-[var(--m-ink-soft)]">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1 ring-1 ring-[var(--m-line)]">
              <MapPinned className="size-3.5 text-[var(--m-accent)]" />
              {hasFilter
                ? `${places.length} dari ${placeCount} tempat`
                : copy.places.catalogCount(placeCount, storyCount)}
            </span>
          </div>
        </div>
      </header>

      <HolyLandGoogleMap
        places={mapPlaces}
        activeSlug={hoverSlug}
        onSelect={setHoverSlug}
      />

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
            data-active={kind === "all"}
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
              data-active={kind === item.id}
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
            data-active={region === "all"}
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
              data-active={region === item.id}
              aria-selected={region === item.id}
              onClick={() => setRegion(item.id)}
              className={cn(
                "inline-flex h-8 shrink-0 items-center rounded-lg border px-2.5 text-xs font-semibold transition",
                REGION_TONE[item.id].chip,
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {!hasFilter ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[var(--m-accent)]" />
            <h2 className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.places.featured}
            </h2>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {featured.map((item) => {
              const tone = REGION_TONE[item.region];
              const kindMeta = getPlaceKind(item.kind);
              return (
                <Link
                  key={item.slug}
                  href={`/baca/peta/${item.slug}`}
                  className="group flex items-start gap-3 rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/90 p-3.5 transition hover:border-[var(--m-accent)]/35"
                  onMouseEnter={() => setHoverSlug(item.slug)}
                  onMouseLeave={() => setHoverSlug(null)}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                      tone.soft,
                    )}
                  >
                    <MapPinned className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-[var(--m-ink-soft)]">
                      {kindMeta.label}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--m-ink-soft)]">
                      {item.blurb}
                    </p>
                    <p className="mt-1.5 text-[11px] font-medium text-[var(--m-accent)]">
                      {item.stories.length} kisah
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
            {hasFilter ? copy.places.results : copy.places.allPlaces}
          </h2>
          <span className="text-xs tabular-nums text-[var(--m-ink-soft)]">
            {places.length} tempat
          </span>
        </div>

        {places.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--m-line)] bg-[var(--m-paper)]/60 px-4 py-10 text-center text-sm text-[var(--m-ink-soft)]">
            {copy.places.emptySearch}
          </p>
        ) : (
          <ul className="divide-y divide-[var(--m-line)] overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/90">
            {places.map((item) => {
              const cat = getPlaceRegion(item.region);
              const kindMeta = getPlaceKind(item.kind);
              return (
                <li key={item.slug}>
                  <Link
                    href={`/baca/peta/${item.slug}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--m-wash)]/55 sm:px-5"
                    onMouseEnter={() => setHoverSlug(item.slug)}
                    onMouseLeave={() => setHoverSlug(null)}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg",
                        REGION_TONE[item.region].soft,
                      )}
                    >
                      <MapPinned className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[var(--m-ink)]">
                        {item.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[var(--m-ink-soft)]">
                        {kindMeta.label} · {cat.label} · {item.stories.length}{" "}
                        kisah
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

      <p className="rounded-xl border border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/40 px-4 py-3 text-xs leading-relaxed text-[var(--m-ink-soft)]">
        {copy.places.mapHint}
      </p>
    </div>
  );
}
