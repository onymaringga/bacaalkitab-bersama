"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  Filter,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import { CharacterPortrait } from "@/components/characters/character-portrait";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import {
  CHARACTER_AGE_OPTIONS,
  CHARACTER_BIRTH_PLACES,
  CHARACTER_FIELDS,
  CHARACTER_GENDER_OPTIONS,
  CHARACTER_OCCUPATIONS,
  CHARACTER_STORY_CONTEXTS,
  countActiveCharacterFilters,
  EMPTY_CHARACTER_FILTERS,
  hasActiveCharacterFilters,
  type CharacterFilterState,
} from "@/lib/bible-character-meta";
import {
  BIBLE_CHARACTER_CATEGORIES,
  filterAndSearchBibleCharacters,
  getCharacterCategory,
  getCharacterCount,
  getFeaturedCharacters,
  type BibleCharacter,
  type BibleCharacterCategoryId,
} from "@/lib/bible-characters";
import { cn } from "@/lib/utils";
import {
  countTwelveDisciplesInCatalog,
  getResolvedNotableGroups,
  TWELVE_DISCIPLES,
  type DiscipleSpotlight,
} from "@/lib/bible-disciples-content";

type CategoryFilter = "all" | BibleCharacterCategoryId;

const SEARCH_CHIPS = ["Daud", "Musa", "Maria", "Paulus", "Abraham", "Esther"];

const CATEGORY_CHIP: Record<BibleCharacterCategoryId, string> = {
  patriarkh:
    "border-amber-200 bg-amber-50 text-amber-900 data-[active=true]:border-amber-700 data-[active=true]:bg-amber-700 data-[active=true]:text-white",
  nabi: "border-sky-200 bg-sky-50 text-sky-800 data-[active=true]:border-sky-600 data-[active=true]:bg-sky-600 data-[active=true]:text-white",
  raja: "border-violet-200 bg-violet-50 text-violet-800 data-[active=true]:border-violet-600 data-[active=true]:bg-violet-600 data-[active=true]:text-white",
  murid:
    "border-blue-200 bg-blue-50 text-blue-800 data-[active=true]:border-blue-600 data-[active=true]:bg-blue-600 data-[active=true]:text-white",
  perempuan:
    "border-rose-200 bg-rose-50 text-rose-800 data-[active=true]:border-rose-600 data-[active=true]:bg-rose-600 data-[active=true]:text-white",
  lainnya:
    "border-slate-200 bg-slate-50 text-slate-800 data-[active=true]:border-slate-700 data-[active=true]:bg-slate-700 data-[active=true]:text-white",
};

function characterToArticle(item: BibleCharacter): ExplorePortalArticle {
  return {
    id: item.slug,
    href: `/baca/tokoh/${item.slug}`,
    section: getCharacterCategory(item.category).label,
    title: item.name,
    excerpt: item.summary,
    imageSlot: (
      <CharacterPortrait
        slug={item.slug}
        name={item.name}
        category={item.category}
        variant="thumb"
        className="size-full rounded-none object-cover"
      />
    ),
  };
}

function FilterMultiSelect({
  label,
  values,
  options,
  onChange,
}: {
  label: string;
  values: string[];
  options: readonly string[] | { value: string; label: string }[];
  onChange: (values: string[]) => void;
}) {
  const normalized = options.map((item) =>
    typeof item === "string" ? { value: item, label: item } : item,
  );

  const triggerLabel =
    values.length === 0
      ? copy.characters.filterAll
      : values.length === 1
        ? (normalized.find((item) => item.value === values[0])?.label ??
          values[0])
        : copy.characters.filterSelected(values.length);

  const isActive = values.length > 0;

  function toggleValue(value: string, checked: boolean) {
    onChange(
      checked ? [...values, value] : values.filter((item) => item !== value),
    );
  }

  return (
    <div className="min-w-0 space-y-1.5">
      <label className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
        {label}
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-10 w-full items-center justify-between gap-2 rounded-xl border px-3 text-xs font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--m-accent)]/30",
              isActive
                ? "border-[var(--m-accent)]/35 bg-[var(--m-accent)]/5 text-[var(--m-ink)]"
                : "border-[var(--m-line)] bg-white/90 text-[var(--m-ink)] hover:bg-white",
            )}
          >
            <span className="truncate text-left">{triggerLabel}</span>
            <ChevronDown className="size-3.5 shrink-0 text-[var(--m-ink-soft)]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-64 w-[var(--radix-dropdown-menu-trigger-width)]">
          {normalized.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.value}
              checked={values.includes(item.value)}
              onCheckedChange={(checked) =>
                toggleValue(item.value, checked === true)
              }
              onSelect={(event) => event.preventDefault()}
              className="text-xs"
            >
              {item.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function DiscipleCard({ disciple }: { disciple: DiscipleSpotlight }) {
  return (
    <Link
      href={`/baca/tokoh/${disciple.slug}`}
      className="group flex h-full flex-col rounded-xl border border-[var(--m-line)] bg-white/90 p-3.5 transition hover:border-[var(--m-accent)]/30 hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold tabular-nums text-blue-800 ring-1 ring-blue-200/80">
          {disciple.order}
        </span>
        <CharacterPortrait
          slug={disciple.slug}
          name={disciple.name}
          category="murid"
          variant="thumb"
          className="size-11 shrink-0 rounded-lg ring-1 ring-[var(--m-line)]/80"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
            {disciple.name}
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-[var(--m-accent)]/90">
            {disciple.role}
          </p>
        </div>
      </div>
      {disciple.alsoKnownAs ? (
        <p className="mt-2 text-[10px] text-[var(--m-ink-soft)]">
          {copy.characters.twelveDisciplesAlsoKnown} {disciple.alsoKnownAs}
        </p>
      ) : null}
      <p className="mt-2 flex-1 text-xs leading-relaxed text-[var(--m-ink-soft)]">
        {disciple.summary}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--m-accent)]">
        {copy.characters.readProfile}
        <ArrowUpRight className="size-3.5" />
      </span>
    </Link>
  );
}

function TwelveDisciplesSection() {
  const catalogCount = countTwelveDisciplesInCatalog();

  return (
    <section className="space-y-4 rounded-2xl border border-[var(--m-line)] bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/40 p-4 sm:p-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-[var(--m-ink)]">
              {copy.characters.twelveDisciplesTitle}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--m-ink-soft)]">
              {copy.characters.twelveDisciplesSubtitle}
            </p>
          </div>
          <span className="rounded-full border border-[var(--m-line)] bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold tabular-nums text-[var(--m-ink-soft)]">
            {copy.characters.twelveDisciplesCount(
              catalogCount,
              TWELVE_DISCIPLES.length,
            )}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-[var(--m-ink)]">
          {copy.characters.twelveDisciplesIntro}
        </p>
        <p className="text-xs font-medium text-[var(--m-accent)]">
          {copy.characters.twelveDisciplesReference}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {TWELVE_DISCIPLES.map((disciple) => (
          <DiscipleCard key={disciple.slug} disciple={disciple} />
        ))}
      </div>
    </section>
  );
}

function OtherNotableCharactersSection() {
  const groups = useMemo(() => getResolvedNotableGroups(), []);

  if (groups.length === 0) return null;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-[var(--m-ink)]">
          {copy.characters.otherNotableTitle}
        </h2>
        <p className="mt-0.5 text-sm text-[var(--m-ink-soft)]">
          {copy.characters.otherNotableSubtitle}
        </p>
      </div>
      <div className="space-y-4">
        {groups.map((group) => (
          <article
            key={group.id}
            className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90"
          >
            <div className="border-b border-[var(--m-line)] bg-[var(--m-wash)]/35 px-4 py-3.5 sm:px-5">
              <h3 className="text-sm font-semibold text-[var(--m-ink)]">
                {group.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--m-ink-soft)]">
                {group.description}
              </p>
            </div>
            <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-4">
              {group.characters.map((character) => (
                <PortalArticleCard
                  key={character.slug}
                  article={{
                    id: character.slug,
                    href: `/baca/tokoh/${character.slug}`,
                    section: group.title,
                    title: character.name,
                    excerpt: character.summary,
                    imageSlot: (
                      <CharacterPortrait
                        slug={character.slug}
                        name={character.name}
                        category={character.category}
                        variant="thumb"
                        className="size-full rounded-none object-cover"
                      />
                    ),
                  }}
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/** Jelajahi penjelasan tokoh Alkitab. */
export function CharactersExploreView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [filters, setFilters] = useState<CharacterFilterState>(
    EMPTY_CHARACTER_FILTERS,
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = countActiveCharacterFilters(filters);
  const isSearchMode =
    Boolean(query.trim()) ||
    category !== "all" ||
    hasActiveCharacterFilters(filters);

  const featured = useMemo(() => getFeaturedCharacters(), []);
  const totalCount = getCharacterCount();

  const characters = useMemo(() => {
    let list = filterAndSearchBibleCharacters(query, filters);
    if (category !== "all") {
      list = list.filter((item) => item.category === category);
    }
    return list;
  }, [query, category, filters]);

  const heroCharacter = featured[0];
  const hero: ExplorePortalHero | null = heroCharacter
    ? {
        href: `/baca/tokoh/${heroCharacter.slug}`,
        eyebrow: copy.explore.portalHeroEyebrow,
        section: copy.characters.title,
        title: heroCharacter.name,
        excerpt: heroCharacter.summary,
        imageSlot: (
          <CharacterPortrait
            slug={heroCharacter.slug}
            name={heroCharacter.name}
            category={heroCharacter.category}
            variant="hero"
            className="size-full rounded-none object-cover"
          />
        ),
      }
    : null;

  const highlightArticles = featured.slice(1, 5).map(characterToArticle);

  function updateFilter<K extends keyof CharacterFilterState>(
    key: K,
    value: CharacterFilterState[K],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setFilters(EMPTY_CHARACTER_FILTERS);
  }

  function clearAll() {
    setQuery("");
    setCategory("all");
    resetFilters();
  }

  return (
    <ExplorePortalShell
      eyebrow={copy.characters.eyebrow}
      title={copy.characters.title}
      subtitle={copy.characters.subtitle}
      stats={
        isSearchMode
          ? `${characters.length} dari ${totalCount}`
          : copy.characters.catalogCount(totalCount)
      }
      hero={hero}
      toolbar={
        <>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--m-ink-soft)]" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.characters.searchPlaceholder}
              className="h-11 rounded-xl border-[var(--m-line)] bg-white/90 pl-10 pr-10"
              aria-label={copy.characters.searchPlaceholder}
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-0.5 text-[var(--m-ink-soft)] transition hover:bg-[var(--m-wash)] hover:text-[var(--m-ink)]"
                aria-label="Hapus pencarian"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          {!query && !isSearchMode ? (
            <PortalSearchChips chips={SEARCH_CHIPS} onSelect={setQuery} />
          ) : null}

          <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5"
              aria-expanded={filtersOpen}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    activeFilterCount > 0
                      ? "bg-[var(--m-accent)]/10 text-[var(--m-accent)]"
                      : "bg-[var(--m-wash)] text-[var(--m-ink-soft)]",
                  )}
                >
                  <Filter className="size-3.5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[var(--m-ink)]">
                    {copy.characters.filtersTitle}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-[var(--m-ink-soft)]">
                    {copy.characters.filtersHint}
                  </span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {activeFilterCount > 0 ? (
                  <span className="rounded-full bg-[var(--m-accent)] px-2 py-0.5 text-[11px] font-semibold text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
                <ChevronDown
                  className={cn(
                    "size-4 text-[var(--m-ink-soft)] transition",
                    filtersOpen && "rotate-180",
                  )}
                />
              </span>
            </button>

            {filtersOpen ? (
              <div className="space-y-5 border-t border-[var(--m-line)] px-4 py-4 sm:px-5">
                <div className="space-y-3">
                  <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--m-ink-soft)] uppercase">
                    Profil tokoh
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FilterMultiSelect
                      label={copy.characters.filterGender}
                      values={filters.gender}
                      options={CHARACTER_GENDER_OPTIONS}
                      onChange={(values) =>
                        updateFilter(
                          "gender",
                          values as CharacterFilterState["gender"],
                        )
                      }
                    />
                    <FilterMultiSelect
                      label={copy.characters.filterAge}
                      values={filters.ageAtDeath}
                      options={CHARACTER_AGE_OPTIONS}
                      onChange={(values) =>
                        updateFilter(
                          "ageAtDeath",
                          values as CharacterFilterState["ageAtDeath"],
                        )
                      }
                    />
                    <FilterMultiSelect
                      label={copy.characters.filterBirthPlace}
                      values={filters.birthPlace}
                      options={CHARACTER_BIRTH_PLACES}
                      onChange={(values) => updateFilter("birthPlace", values)}
                    />
                    <FilterMultiSelect
                      label={copy.characters.filterOccupation}
                      values={filters.occupation}
                      options={CHARACTER_OCCUPATIONS}
                      onChange={(values) => updateFilter("occupation", values)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--m-ink-soft)] uppercase">
                    Konteks kisah
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FilterMultiSelect
                      label={copy.characters.filterField}
                      values={filters.field}
                      options={CHARACTER_FIELDS}
                      onChange={(values) => updateFilter("field", values)}
                    />
                    <FilterMultiSelect
                      label={copy.characters.filterStoryContext}
                      values={filters.storyContext}
                      options={CHARACTER_STORY_CONTEXTS}
                      onChange={(values) => updateFilter("storyContext", values)}
                    />
                  </div>
                </div>

                {activeFilterCount > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 border-t border-[var(--m-line)] pt-4">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--m-line)] px-3 py-1.5 text-xs font-semibold text-[var(--m-ink-soft)] transition hover:bg-[var(--m-wash)] hover:text-[var(--m-ink)]"
                    >
                      <RotateCcw className="size-3.5" />
                      {copy.characters.filterReset}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {activeFilterCount > 0 && !filtersOpen ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium text-[var(--m-ink-soft)]">
                {copy.characters.filterActive(activeFilterCount)}
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-[var(--m-accent)] transition hover:bg-[var(--m-accent)]/5"
              >
                <RotateCcw className="size-3" />
                {copy.characters.filterReset}
              </button>
            </div>
          ) : null}

          <div className="space-y-2">
            <p className="px-0.5 text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
              {copy.characters.categoryLabel}
            </p>
            <div
              role="tablist"
              aria-label={copy.characters.categoryAria}
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
              {BIBLE_CHARACTER_CATEGORIES.map((item) => (
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
          </div>
        </>
      }
      sidebar={
        <ExplorePortalSidebar
          popularLinks={[
            { label: "Daud", href: "/baca/tokoh/daud" },
            { label: "Musa", href: "/baca/tokoh/musa" },
            { label: "Abraham", href: "/baca/tokoh/abraham" },
          ]}
        />
      }
      footer={
        <p className="rounded-xl border border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/40 px-4 py-3 text-xs leading-relaxed text-[var(--m-ink-soft)]">
          {copy.characters.hint}
        </p>
      }
    >
      {!isSearchMode ? (
        <>
          <TwelveDisciplesSection />
          <OtherNotableCharactersSection />
        </>
      ) : null}

      {!isSearchMode && highlightArticles.length > 0 ? (
        <section className="space-y-3">
          <PortalSectionHeader
            title={copy.characters.featured}
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
          isSearchMode ? copy.characters.results : copy.characters.allCharacters
        }
        countLabel={`${characters.length} tokoh`}
        isEmpty={characters.length === 0}
        emptyMessage={copy.characters.emptySearch}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {characters.map((item) => (
            <PortalArticleCard
              key={item.slug}
              article={characterToArticle(item)}
            />
          ))}
        </div>
      </PortalCatalogSection>

      {characters.length === 0 && isSearchMode ? (
        <div className="-mt-3 text-center">
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--m-accent)] hover:underline"
          >
            <RotateCcw className="size-3.5" />
            Reset pencarian & filter
          </button>
        </div>
      ) : null}
    </ExplorePortalShell>
  );
}
