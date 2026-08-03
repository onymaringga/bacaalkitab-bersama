"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  GitBranch,
  Network,
  Search,
  Sparkles,
} from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import {
  GENEALOGY_ADAM_TO_JESUS,
  GENEALOGY_ERAS,
  MATTHEW_BRANCH_FROM_DAVID,
  genealogyPassageHref,
  getFeaturedGenealogy,
  getGenealogyCount,
  getGenealogyEra,
  searchGenealogy,
  type GenealogyEraId,
  type GenealogyPerson,
} from "@/lib/bible-genealogy";
import { cn } from "@/lib/utils";

type EraFilter = "all" | GenealogyEraId;

function personHref(person: GenealogyPerson) {
  if (person.characterSlug) return `/baca/tokoh/${person.characterSlug}`;
  return null;
}

/** Peta silsilah Adam → Yesus (Lukas 3). */
export function GenealogyView() {
  const [query, setQuery] = useState("");
  const [era, setEra] = useState<EraFilter>("all");
  const [selectedId, setSelectedId] = useState<string>("adam");
  const [showMatthew, setShowMatthew] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const nodeRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const total = getGenealogyCount();
  const featured = useMemo(() => getFeaturedGenealogy(), []);

  const people = useMemo(() => {
    let list = searchGenealogy(query);
    if (era !== "all") list = list.filter((person) => person.era === era);
    if (featuredOnly) list = list.filter((person) => person.featured);
    return list;
  }, [query, era, featuredOnly]);

  const selected =
    people.find((person) => person.id === selectedId) ??
    GENEALOGY_ADAM_TO_JESUS.find((person) => person.id === selectedId) ??
    GENEALOGY_ADAM_TO_JESUS[0]!;

  const selectedEra = getGenealogyEra(selected.era);
  const selectedIndex = GENEALOGY_ADAM_TO_JESUS.findIndex(
    (person) => person.id === selected.id,
  );
  const progress =
    total <= 1 ? 100 : Math.round((selectedIndex / (total - 1)) * 100);

  useEffect(() => {
    if (people.some((person) => person.id === selectedId)) return;
    if (people[0]) setSelectedId(people[0].id);
  }, [people, selectedId]);

  function jumpTo(id: string) {
    setSelectedId(id);
    setEra("all");
    setQuery("");
    setFeaturedOnly(false);
    requestAnimationFrame(() => {
      nodeRefs.current.get(id)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  const grouped = useMemo(() => {
    const map = new Map<GenealogyEraId, GenealogyPerson[]>();
    for (const eraItem of GENEALOGY_ERAS) map.set(eraItem.id, []);
    for (const person of people) {
      map.get(person.era)?.push(person);
    }
    return GENEALOGY_ERAS.map((eraItem) => ({
      era: eraItem,
      people: map.get(eraItem.id) ?? [],
    })).filter((group) => group.people.length > 0);
  }, [people]);

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
        <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-gradient-to-br from-[#f3ebe0] via-white to-[#e8f0ea] px-5 py-5 sm:px-6 sm:py-6">
          <p className="member-web-kicker text-[var(--m-accent)]">
            {copy.genealogy.eyebrow}
          </p>
          <h1 className="member-web-display mt-1.5 text-[clamp(1.65rem,3vw,2.35rem)] leading-[1.1] text-[var(--m-ink)]">
            {copy.genealogy.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--m-ink-soft)]">
            {copy.genealogy.subtitle}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-[var(--m-ink-soft)]">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1 ring-1 ring-[var(--m-line)]">
              <Network className="size-3.5 text-[var(--m-accent)]" />
              {copy.genealogy.catalogCount(total)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1 ring-1 ring-[var(--m-line)]">
              Lukas 3:23–38
            </span>
          </div>
        </div>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--m-ink-soft)]" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.genealogy.searchPlaceholder}
          className="h-11 rounded-xl border-[var(--m-line)] bg-[var(--m-paper)]/90 pl-10"
          aria-label={copy.genealogy.searchPlaceholder}
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          data-active={era === "all"}
          onClick={() => setEra("all")}
          className={cn(
            "inline-flex h-8 items-center rounded-lg border px-2.5 text-xs font-semibold transition",
            era === "all"
              ? "border-[var(--m-accent)] bg-[var(--m-accent)] text-white"
              : "border-[var(--m-line)] bg-[var(--m-paper)] text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
          )}
        >
          Semua zaman
        </button>
        {GENEALOGY_ERAS.map((item) => (
          <button
            key={item.id}
            type="button"
            data-active={era === item.id}
            onClick={() => setEra(item.id)}
            className={cn(
              "inline-flex h-8 items-center rounded-lg border px-2.5 text-xs font-semibold transition",
              era === item.id
                ? "border-transparent text-white"
                : "border-[var(--m-line)] bg-[var(--m-paper)] text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
            )}
            style={
              era === item.id
                ? { backgroundColor: item.accent, borderColor: item.accent }
                : undefined
            }
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setFeaturedOnly((value) => !value)}
          className={cn(
            "inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold transition",
            featuredOnly
              ? "border-[var(--m-accent)] bg-[var(--m-accent)]/10 text-[var(--m-accent)]"
              : "border-[var(--m-line)] bg-[var(--m-paper)] text-[var(--m-ink-soft)]",
          )}
        >
          <Sparkles className="size-3.5" />
          Tokoh kunci
        </button>
      </div>

      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[var(--m-accent)]" />
          <h2 className="text-sm font-semibold text-[var(--m-ink)]">
            {copy.genealogy.featured}
          </h2>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featured.map((person) => (
            <button
              key={person.id}
              type="button"
              onClick={() => jumpTo(person.id)}
              className={cn(
                "inline-flex h-8 shrink-0 items-center rounded-full border px-3 text-xs font-semibold transition",
                selected.id === person.id
                  ? "border-[var(--m-accent)] bg-[var(--m-accent)] text-white"
                  : "border-[var(--m-line)] bg-[var(--m-paper)] text-[var(--m-ink)] hover:border-[var(--m-accent)]/40",
              )}
            >
              {person.name}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <section className="relative overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[linear-gradient(180deg,#f7f1e8_0%,#eef3ef_48%,#f4ebe3_100%)]">
          <div className="sticky top-0 z-10 border-b border-[var(--m-line)]/80 bg-[var(--m-paper)]/90 px-4 py-2.5 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-[var(--m-ink-soft)]">
              <span>Adam</span>
              <span className="tabular-nums text-[var(--m-accent)]">
                {progress}% perjalanan
              </span>
              <span>Yesus</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--m-wash)]">
              <div
                className="h-full rounded-full bg-[var(--m-accent)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="relative max-h-[38rem] space-y-6 overflow-y-auto px-3 py-5 sm:px-5">
            <div
              className="pointer-events-none absolute top-5 bottom-5 left-[1.55rem] w-px bg-[var(--m-line)] sm:left-[1.85rem]"
              aria-hidden
            />

            {grouped.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[var(--m-line)] bg-[var(--m-paper)]/70 px-4 py-10 text-center text-sm text-[var(--m-ink-soft)]">
                {copy.genealogy.emptySearch}
              </p>
            ) : (
              grouped.map((group) => (
                <div key={group.era.id} className="relative space-y-2">
                  <div className="sticky top-[3.25rem] z-[1] ml-8 sm:ml-10">
                    <div
                      className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm"
                      style={{ backgroundColor: group.era.accent }}
                    >
                      {group.era.label}
                      <span className="rounded bg-white/20 px-1.5 py-0.5 tabular-nums">
                        {group.people.length}
                      </span>
                    </div>
                    <p className="mt-1 max-w-sm text-[11px] text-[var(--m-ink-soft)]">
                      {group.era.summary}
                    </p>
                  </div>

                  <ul className="space-y-1.5">
                    {group.people.map((person) => {
                      const active = person.id === selected.id;
                      return (
                        <li key={person.id} className="relative">
                          <button
                            type="button"
                            ref={(node) => {
                              if (node) nodeRefs.current.set(person.id, node);
                              else nodeRefs.current.delete(person.id);
                            }}
                            onClick={() => setSelectedId(person.id)}
                            className={cn(
                              "group flex w-full items-start gap-3 rounded-xl px-1.5 py-1.5 text-left transition sm:gap-3.5",
                              active
                                ? "bg-[var(--m-paper)]/95 shadow-sm ring-1 ring-[var(--m-accent)]/30"
                                : "hover:bg-[var(--m-paper)]/70",
                            )}
                          >
                            <span className="relative z-[1] mt-1 flex size-7 shrink-0 items-center justify-center sm:size-8">
                              <span
                                className={cn(
                                  "size-3 rounded-full ring-2 ring-white transition sm:size-3.5",
                                  person.featured ? "scale-110" : "",
                                  active ? "shadow-md" : "",
                                )}
                                style={{ backgroundColor: group.era.accent }}
                              />
                            </span>
                            <span className="min-w-0 flex-1 pt-0.5">
                              <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                <span
                                  className={cn(
                                    "font-semibold text-[var(--m-ink)]",
                                    person.featured
                                      ? "text-[0.95rem]"
                                      : "text-sm",
                                    active && "text-[var(--m-accent)]",
                                  )}
                                >
                                  {person.name}
                                </span>
                                <span className="text-[10px] tabular-nums text-[var(--m-ink-soft)]">
                                  gen. {person.generation}
                                </span>
                              </span>
                              {person.featured || active ? (
                                <span className="mt-0.5 line-clamp-2 block text-[11px] leading-relaxed text-[var(--m-ink-soft)]">
                                  {person.note}
                                </span>
                              ) : null}
                            </span>
                          </button>

                          {person.id === "daud" ? (
                            <div className="ml-10 mt-1 mb-2 sm:ml-12">
                              <button
                                type="button"
                                onClick={() => setShowMatthew((value) => !value)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--m-line)] bg-[var(--m-paper)]/80 px-2.5 py-1.5 text-[11px] font-semibold text-[var(--m-ink-soft)] transition hover:border-[var(--m-accent)]/40 hover:text-[var(--m-ink)]"
                              >
                                <GitBranch className="size-3.5 text-[var(--m-accent)]" />
                                {showMatthew
                                  ? "Sembunyikan cabang Matius"
                                  : copy.genealogy.matthewBranch}
                              </button>
                              {showMatthew ? (
                                <div className="mt-2 rounded-xl border border-[var(--m-line)] bg-[var(--m-paper)]/90 px-3 py-2.5">
                                  <p className="text-[11px] leading-relaxed text-[var(--m-ink-soft)]">
                                    {copy.genealogy.matthewNote}
                                  </p>
                                  <ol className="mt-2 space-y-1">
                                    {MATTHEW_BRANCH_FROM_DAVID.map((item) => (
                                      <li
                                        key={item.name}
                                        className="flex items-start gap-2 text-[11px]"
                                      >
                                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--m-accent)]" />
                                        <span>
                                          <span className="font-semibold text-[var(--m-ink)]">
                                            {item.name}
                                          </span>
                                          <span className="text-[var(--m-ink-soft)]">
                                            {" "}
                                            — {item.note}
                                          </span>
                                        </span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="space-y-3 lg:sticky lg:top-3 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/95">
            <div
              className="px-4 py-3 text-white"
              style={{ backgroundColor: selectedEra.accent }}
            >
              <p className="text-[11px] font-medium opacity-90">
                {selectedEra.label} · generasi {selected.generation}
              </p>
              <h2 className="mt-0.5 text-xl font-semibold tracking-tight">
                {selected.name}
              </h2>
              {selected.alsoCalled && selected.alsoCalled.length > 0 ? (
                <p className="mt-1 text-[11px] opacity-90">
                  Juga: {selected.alsoCalled.join(" · ")}
                </p>
              ) : null}
            </div>
            <div className="space-y-3 px-4 py-4">
              <p className="text-sm leading-relaxed text-[var(--m-ink)]">
                {selected.note}
              </p>
              {selected.reference ? (
                <p className="text-xs font-medium text-[var(--m-accent)]">
                  {selected.reference}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {genealogyPassageHref(selected) ? (
                  <Button
                    asChild
                    size="sm"
                    className="h-9 rounded-xl font-semibold"
                  >
                    <Link href={genealogyPassageHref(selected)!}>
                      {copy.genealogy.readInContext}
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                ) : null}
                {personHref(selected) ? (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-9 rounded-xl font-semibold"
                  >
                    <Link href={personHref(selected)!}>
                      {copy.genealogy.openCharacter}
                    </Link>
                  </Button>
                ) : null}
              </div>
              <div className="flex gap-2 border-t border-[var(--m-line)] pt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 flex-1 rounded-lg"
                  disabled={selectedIndex <= 0}
                  onClick={() => {
                    const prev = GENEALOGY_ADAM_TO_JESUS[selectedIndex - 1];
                    if (prev) jumpTo(prev.id);
                  }}
                >
                  ← Sebelumnya
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 flex-1 rounded-lg"
                  disabled={selectedIndex >= total - 1}
                  onClick={() => {
                    const next = GENEALOGY_ADAM_TO_JESUS[selectedIndex + 1];
                    if (next) jumpTo(next.id);
                  }}
                >
                  Berikutnya →
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <p className="rounded-xl border border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/40 px-4 py-3 text-xs leading-relaxed text-[var(--m-ink-soft)]">
        {copy.genealogy.hint}
      </p>
    </div>
  );
}
