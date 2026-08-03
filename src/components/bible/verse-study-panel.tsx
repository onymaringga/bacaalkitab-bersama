"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpenText,
  ChevronDown,
  ExternalLink,
  Loader2,
  Quote,
  Sparkles,
  Waypoints,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { BibleVersionCode } from "@/lib/bible-books";
import { pickVersesForCompare } from "@/lib/bible-compare";
import { loadPassageClient } from "@/lib/bible-passage-cache";
import {
  findRelatedPassagesFromBlockedText,
  type RelatedPassageHit,
} from "@/lib/bible-related-passages";
import {
  getCommentaryForSelection,
  getCrossRefsForSelection,
  getStudyExternalLinks,
  type ResolvedCrossRef,
  type StudyVerseRef,
} from "@/lib/bible-verse-study";
import { cn } from "@/lib/utils";

type StudyTab = "related" | "refs" | "commentary";

type VerseStudyPanelProps = {
  open: boolean;
  bookAbbr: string;
  bookName: string;
  /** Label pasal saat ini (untuk tautan eksternal) */
  passageLabel: string;
  citation: string;
  /** Teks ayat yang diblok — dipakai cari bacaan terkait */
  selectedText: string;
  currentVersion: BibleVersionCode;
  selected: Array<{ chapter: number; verse: number }>;
  onClose: () => void;
  onInteract?: () => void;
  className?: string;
};

export function VerseStudyPanel({
  open,
  bookAbbr,
  bookName,
  passageLabel,
  citation,
  selectedText,
  currentVersion,
  selected,
  onClose,
  onInteract,
  className,
}: VerseStudyPanelProps) {
  const [tab, setTab] = useState<StudyTab>("related");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorById, setErrorById] = useState<Record<string, string>>({});
  const [textById, setTextById] = useState<
    Record<string, Array<{ verse: number; content: string }>>
  >({});

  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [relatedHits, setRelatedHits] = useState<RelatedPassageHit[]>([]);

  const crossRefs = useMemo(
    () => getCrossRefsForSelection(bookAbbr, selected),
    [bookAbbr, selected],
  );

  const commentary = useMemo(
    () => getCommentaryForSelection(bookAbbr, selected),
    [bookAbbr, selected],
  );

  const externalLinks = useMemo(
    () => getStudyExternalLinks(passageLabel),
    [passageLabel],
  );

  useEffect(() => {
    if (!open) return;
    setExpandedId(null);
    setLoadingId(null);
    setErrorById({});
    setTextById({});
  }, [open, bookAbbr, citation]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function run() {
      setRelatedLoading(true);
      setRelatedHits([]);
      setRelatedKeywords([]);

      const result = await findRelatedPassagesFromBlockedText({
        selectedText,
        version: currentVersion,
        exclude: { bookName, verses: selected },
        limit: 8,
      });

      if (cancelled) return;
      setRelatedKeywords(result.keywords);
      setRelatedHits(result.hits);
      setRelatedLoading(false);

      // Tab default: terkait bila ada hasil, else rujukan, else tafsir
      if (result.hits.length > 0) setTab("related");
      else if (crossRefs.length > 0) setTab("refs");
      else setTab("commentary");
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [
    open,
    selectedText,
    currentVersion,
    bookName,
    selected,
    crossRefs.length,
  ]);

  async function loadCrossRef(item: ResolvedCrossRef) {
    onInteract?.();
    if (expandedId === item.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(item.id);

    if (textById[item.id] || loadingId === item.id) return;

    setLoadingId(item.id);
    setErrorById((prev) => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });

    const data = await loadPassageClient(item.passageLabel, currentVersion);
    if (!data) {
      setErrorById((prev) => ({
        ...prev,
        [item.id]: "Gagal memuat ayat. Coba lagi.",
      }));
      setLoadingId(null);
      return;
    }

    const end = item.ref.endVerse ?? item.ref.verse;
    const wanted: StudyVerseRef[] = [];
    for (let verse = item.ref.verse; verse <= end; verse += 1) {
      wanted.push({
        bookAbbr: item.ref.bookAbbr,
        chapter: item.ref.chapter,
        verse,
      });
    }

    const picked = pickVersesForCompare(
      data,
      wanted.map((ref) => ({ chapter: ref.chapter, verse: ref.verse })),
    );

    if (picked.length === 0) {
      setErrorById((prev) => ({
        ...prev,
        [item.id]: "Ayat belum tersedia di versi ini.",
      }));
    } else {
      setTextById((prev) => ({
        ...prev,
        [item.id]: picked.map((row) => ({
          verse: row.verse,
          content: row.content,
        })),
      }));
    }
    setLoadingId(null);
  }

  function toggleRelated(item: RelatedPassageHit) {
    onInteract?.();
    setExpandedId((current) => (current === item.id ? null : item.id));
  }

  if (!open) return null;

  return (
    <div
      data-verse-study-panel
      data-highlight-toolbar
      className={cn("w-full", className)}
      role="dialog"
      aria-label="Bacaan terkait dan tafsiran"
      onPointerDown={() => onInteract?.()}
      onMouseDown={(event) => {
        event.preventDefault();
        onInteract?.();
      }}
    >
      <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white shadow-[var(--shadow-soft)]">
        <div className="flex items-start justify-between gap-2 border-b border-[var(--m-line)]/70 px-3.5 py-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--m-ink)]">
              <BookOpenText className="size-3.5 shrink-0 text-[var(--m-accent)]" />
              Bacaan terkait
            </p>
            <p className="mt-0.5 truncate text-xs text-[var(--m-ink-soft)]">
              {citation}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7 shrink-0 rounded-full"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X className="size-3.5" />
          </Button>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-[var(--m-line)]/70 px-2.5 py-2">
          {(
            [
              {
                id: "related" as const,
                label: "Terkait",
                icon: Sparkles,
                count: relatedHits.length,
              },
              {
                id: "refs" as const,
                label: "Rujukan",
                icon: Waypoints,
                count: crossRefs.length,
              },
              {
                id: "commentary" as const,
                label: "Tafsir",
                icon: Quote,
                count: commentary ? 1 : 0,
              },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onInteract?.();
                  setTab(item.id);
                }}
                className={cn(
                  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition",
                  active
                    ? "bg-[var(--m-accent)] text-white"
                    : "bg-[var(--m-wash)] text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                {item.label}
                {item.count > 0 ? (
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px] tabular-nums",
                      active
                        ? "bg-white/20"
                        : "bg-white text-[var(--m-ink-soft)]",
                    )}
                  >
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="max-h-[min(55vh,28rem)] space-y-3 overflow-y-auto overscroll-contain px-3.5 py-3.5">
          {tab === "related" ? (
            <RelatedTab
              loading={relatedLoading}
              keywords={relatedKeywords}
              hits={relatedHits}
              expandedId={expandedId}
              onToggle={toggleRelated}
              externalLinks={externalLinks}
              onInteract={onInteract}
            />
          ) : null}

          {tab === "refs" ? (
            crossRefs.length === 0 ? (
              <div className="space-y-3 py-2">
                <p className="text-sm leading-relaxed text-[var(--m-ink-soft)]">
                  Belum ada rujukan klasik untuk ayat ini. Coba tab Terkait —
                  hasilnya dari teks yang kamu blok.
                </p>
                <ExternalLinksList
                  links={externalLinks}
                  onInteract={onInteract}
                />
              </div>
            ) : (
              <ul className="space-y-2">
                {crossRefs.map((item) => {
                  const openItem = expandedId === item.id;
                  const loading = loadingId === item.id;
                  const verses = textById[item.id];
                  const error = errorById[item.id];
                  return (
                    <li
                      key={item.id}
                      className="overflow-hidden rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/25"
                    >
                      <button
                        type="button"
                        onPointerDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          void loadCrossRef(item);
                        }}
                        className="flex w-full items-start gap-2 px-3 py-2.5 text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[var(--m-ink)]">
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">
                            {item.theme}
                          </p>
                        </div>
                        <ChevronDown
                          className={cn(
                            "mt-0.5 size-4 shrink-0 text-[var(--m-ink-soft)] transition",
                            openItem && "rotate-180",
                          )}
                        />
                      </button>

                      {openItem ? (
                        <div className="border-t border-[var(--m-line)] bg-white px-3 py-3">
                          {loading ? (
                            <div className="flex items-center gap-2 text-sm text-[var(--m-ink-soft)]">
                              <Loader2 className="size-4 animate-spin text-[var(--m-accent)]" />
                              Memuat ayat…
                            </div>
                          ) : null}
                          {!loading && error ? (
                            <p className="text-sm text-destructive">{error}</p>
                          ) : null}
                          {!loading && !error && verses
                            ? verses.map((row) => (
                                <p
                                  key={row.verse}
                                  className="text-[0.95rem] leading-relaxed text-[var(--m-ink)]"
                                >
                                  <sup className="mr-1 font-semibold text-[var(--m-accent)]">
                                    {row.verse}
                                  </sup>
                                  {row.content}
                                </p>
                              ))
                            : null}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )
          ) : null}

          {tab === "commentary" ? (
            <div className="space-y-3">
              {commentary ? (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold tracking-wide text-[var(--m-accent)] uppercase">
                      {commentary.source === "verse"
                        ? "Tafsir ayat"
                        : commentary.source === "chapter"
                          ? "Catatan pasal"
                          : "Latar kitab"}
                    </p>
                    <span className="text-xs text-[var(--m-ink-soft)]">
                      {commentary.citation}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--m-ink)]">
                    {commentary.summary}
                  </p>
                  {commentary.points.length > 0 ? (
                    <ul className="space-y-1.5">
                      {commentary.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-2 text-sm leading-relaxed text-[var(--m-ink)]"
                        >
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--m-accent)]" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-[var(--m-ink-soft)]">
                  Belum ada tafsiran ringkas untuk ayat ini. Gunakan sumber
                  eksternal berikut.
                </p>
              )}

              <ExternalLinksList
                links={externalLinks}
                onInteract={onInteract}
              />
            </div>
          ) : null}
        </div>

        {tab === "related" && relatedHits.length > 0 ? (
          <div className="border-t border-[var(--m-line)]/70 px-3.5 py-2.5">
            <p className="text-[11px] leading-relaxed text-[var(--m-ink-soft)]">
              Dari teks yang kamu blok · ketuk untuk baca penuh
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RelatedTab({
  loading,
  keywords,
  hits,
  expandedId,
  onToggle,
  externalLinks,
  onInteract,
}: {
  loading: boolean;
  keywords: string[];
  hits: RelatedPassageHit[];
  expandedId: string | null;
  onToggle: (item: RelatedPassageHit) => void;
  externalLinks: ReturnType<typeof getStudyExternalLinks>;
  onInteract?: () => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-[var(--m-ink-soft)]">
        <Loader2 className="size-4 animate-spin text-[var(--m-accent)]" />
        Mencari bacaan terkait…
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className="space-y-3 py-2">
        <p className="text-sm leading-relaxed text-[var(--m-ink-soft)]">
          Belum ketemu bacaan terkait dari teks ini. Coba tab Rujukan atau
          blok ayat dengan kata kunci yang lebih khas (mis. kasih, iman,
          pengampunan).
        </p>
        <ExternalLinksList links={externalLinks} onInteract={onInteract} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {keywords.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-md bg-[var(--m-wash)] px-2 py-0.5 text-[11px] font-medium text-[var(--m-ink-soft)]"
            >
              {keyword}
            </span>
          ))}
        </div>
      ) : null}

      <ul className="space-y-2">
        {hits.map((item) => {
          const openItem = expandedId === item.id;
          return (
            <li
              key={item.id}
              className="overflow-hidden rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/25"
            >
              <button
                type="button"
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onToggle(item);
                }}
                className="flex w-full items-start gap-2 px-3 py-2.5 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--m-ink)]">
                    {item.reference}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--m-ink-soft)]">
                    {item.snippet}
                  </p>
                  <p className="mt-1 text-[10px] font-medium tracking-wide text-[var(--m-accent)] uppercase">
                    cocok: {item.matchedBy}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "mt-0.5 size-4 shrink-0 text-[var(--m-ink-soft)] transition",
                    openItem && "rotate-180",
                  )}
                />
              </button>

              {openItem ? (
                <div className="border-t border-[var(--m-line)] bg-white px-3 py-3">
                  <p className="text-[0.95rem] leading-relaxed text-[var(--m-ink)]">
                    <sup className="mr-1 font-semibold text-[var(--m-accent)]">
                      {item.verse}
                    </sup>
                    {item.text}
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ExternalLinksList({
  links,
  onInteract,
}: {
  links: ReturnType<typeof getStudyExternalLinks>;
  onInteract?: () => void;
}) {
  if (links.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
        Pendalaman eksternal
      </p>
      <ul className="space-y-1.5">
        {links.slice(0, 2).map((link) => (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onInteract?.()}
              className="flex items-start gap-2 rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/30 px-3 py-2.5 transition hover:border-[var(--m-accent)]/40 hover:bg-[var(--m-wash)]/55"
            >
              <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-[var(--m-accent)]" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[var(--m-ink)]">
                  {link.source}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-[var(--m-ink-soft)]">
                  {link.description}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
