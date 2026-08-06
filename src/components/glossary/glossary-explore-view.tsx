"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";

import {
  ExplorePortalShell,
  ExplorePortalSidebar,
  PortalCatalogSection,
  PortalSectionHeader,
  type ExplorePortalHero,
} from "@/components/explore/explore-portal-shell";
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
  type BibleGlossaryTerm,
} from "@/lib/bible-glossary";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | BibleGlossaryCategoryId;

const CATEGORY_CHIP: Record<BibleGlossaryCategoryId, string> = {
  iman: "border-sky-200 bg-sky-50 text-sky-800 data-[active=true]:border-sky-600 data-[active=true]:bg-sky-600 data-[active=true]:text-white",
  ibadah:
    "border-violet-200 bg-violet-50 text-violet-800 data-[active=true]:border-violet-600 data-[active=true]:bg-violet-600 data-[active=true]:text-white",
  gelar:
    "border-amber-200 bg-amber-50 text-amber-900 data-[active=true]:border-amber-600 data-[active=true]:bg-amber-600 data-[active=true]:text-white",
  tempat:
    "border-emerald-200 bg-emerald-50 text-emerald-800 data-[active=true]:border-emerald-600 data-[active=true]:bg-emerald-600 data-[active=true]:text-white",
  sejarah:
    "border-slate-200 bg-slate-50 text-slate-800 data-[active=true]:border-slate-700 data-[active=true]:bg-slate-700 data-[active=true]:text-white",
};

function groupTermsByLetter(terms: BibleGlossaryTerm[]) {
  const groups = new Map<string, BibleGlossaryTerm[]>();
  for (const item of terms) {
    const letter = glossaryIndexLetter(item.term);
    const list = groups.get(letter) ?? [];
    list.push(item);
    groups.set(letter, list);
  }
  return [...groups.entries()].sort(([a], [b]) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b, "id");
  });
}

function GlossaryTermRow({ item }: { item: BibleGlossaryTerm }) {
  const category = getGlossaryCategory(item.category);

  return (
    <li>
      <Link
        href={`/baca/glosarium/${item.slug}`}
        className="group flex items-start justify-between gap-3 px-4 py-3 transition hover:bg-[var(--m-wash)]/50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="font-semibold leading-snug text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
              {item.term}
            </p>
            {item.alsoCalled?.[0] ? (
              <p className="text-[11px] text-[var(--m-ink-soft)]">
                ({item.alsoCalled[0]})
              </p>
            ) : null}
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--m-ink-soft)]">
            <span className="font-medium text-[var(--m-accent)]/80">
              {category.label}
            </span>
            <span className="mx-1.5 text-[var(--m-line)]">·</span>
            {item.plainMeaning}
          </p>
        </div>
        <ChevronRight className="mt-0.5 size-4 shrink-0 text-[var(--m-ink-soft)] opacity-40 transition group-hover:opacity-100" />
      </Link>
    </li>
  );
}

function GlossaryTermList({ terms }: { terms: BibleGlossaryTerm[] }) {
  const groups = useMemo(() => groupTermsByLetter(terms), [terms]);

  return (
    <div className="space-y-5">
      {groups.map(([letter, items]) => (
        <section key={letter} className="space-y-2">
          <h3 className="member-web-display px-1 text-lg text-[var(--m-ink)]">
            {letter}
          </h3>
          <ul className="divide-y divide-[var(--m-line)] overflow-hidden rounded-xl border border-[var(--m-line)] bg-white">
            {items.map((item) => (
              <GlossaryTermRow key={item.slug} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Glosarium istilah Alkitab yang jarang didengar. */
export function GlossaryExploreView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const featured = useMemo(() => getFeaturedGlossaryTerms(), []);
  const totalCount = getGlossaryCount();
  const isSearchMode = Boolean(query.trim()) || category !== "all";

  const terms = useMemo(() => {
    let list = searchBibleGlossary(query);
    if (category !== "all") {
      list = list.filter((item) => item.category === category);
    }
    return list;
  }, [query, category]);

  const heroTerm = featured[0];
  const hero: ExplorePortalHero | null = heroTerm
    ? {
        href: `/baca/glosarium/${heroTerm.slug}`,
        eyebrow: copy.explore.portalHeroEyebrow,
        section: copy.glossary.title,
        title: heroTerm.term,
        excerpt: heroTerm.plainMeaning,
      }
    : null;

  const highlightTerms = featured.slice(1, 5);

  return (
    <ExplorePortalShell
      eyebrow={copy.glossary.eyebrow}
      title={copy.glossary.title}
      subtitle={copy.glossary.subtitle}
      stats={copy.glossary.catalogCount(totalCount)}
      hero={hero}
      toolbar={
        <>
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
            { label: "Shalom", href: "/baca/glosarium/shalom" },
            { label: "Hesed", href: "/baca/glosarium/hesed" },
            { label: "Anugerah", href: "/baca/glosarium/anugerah" },
            { label: "Roh Kudus", href: "/baca/glosarium/roh-kudus" },
          ]}
        />
      }
    >
      {!isSearchMode && highlightTerms.length > 0 ? (
        <section className="space-y-3">
          <PortalSectionHeader
            title={copy.glossary.featured}
            hint={copy.explore.featuredHint}
          />
          <ul className="divide-y divide-[var(--m-line)] overflow-hidden rounded-xl border border-[var(--m-line)] bg-white">
            {highlightTerms.map((item) => (
              <GlossaryTermRow key={item.slug} item={item} />
            ))}
          </ul>
        </section>
      ) : null}

      <PortalCatalogSection
        title={isSearchMode ? copy.glossary.results : copy.glossary.allTerms}
        countLabel={`${terms.length} istilah`}
        isEmpty={terms.length === 0}
        emptyMessage={copy.glossary.emptySearch}
      >
        <GlossaryTermList terms={terms} />
      </PortalCatalogSection>
    </ExplorePortalShell>
  );
}
