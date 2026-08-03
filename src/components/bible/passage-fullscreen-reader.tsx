"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Loader2,
  Palette,
  Square,
  X,
} from "lucide-react";

import { BibleCoverEditor } from "@/components/bible/bible-cover-editor";
import { BibleCoverSheet } from "@/components/bible/bible-cover-sheet";
import { BibleVersionPicker } from "@/components/bible/bible-version-picker";
import { PaperPageFlip } from "@/components/bible/paper-page-flip";
import { Button } from "@/components/ui/button";
import {
  getServerBibleCover,
  readBibleCover,
  subscribeBibleCover,
} from "@/lib/bible-cover";
import {
  getBibleFontSizeOption,
  getServerBibleFontSize,
  readBibleFontSize,
  subscribeBibleFontSize,
} from "@/lib/bible-font-size";
import {
  matchPaperVersesByRefs,
  paginateVersesForPaper,
  passageResultToPaperVerses,
  type PaperVerse,
} from "@/lib/bible-paper-pages";
import { formatVerseNumberLabel } from "@/lib/bible-api";
import { BIBLE_VERSION_SHORT, type BibleVersionCode } from "@/lib/bible-books";
import { defaultCompareVersion } from "@/lib/bible-compare";
import { loadPassageClient } from "@/lib/bible-passage-cache";
import type { BibleReadingThemeId } from "@/lib/bible-reading-theme";
import { cn } from "@/lib/utils";

type ViewMode = "single" | "dual";

type PassageFullscreenReaderProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  passage: string;
  version: BibleVersionCode;
  verses: PaperVerse[];
  readingTheme?: BibleReadingThemeId;
};

const MODE_STORAGE_KEY = "bacaalkitab-fullscreen-mode";
const RIGHT_VERSION_KEY = "bacaalkitab-fullscreen-right-version";

function readStoredMode(): ViewMode {
  if (typeof window === "undefined") return "single";
  try {
    const raw = window.localStorage.getItem(MODE_STORAGE_KEY);
    return raw === "dual" ? "dual" : "single";
  } catch {
    return "single";
  }
}

function writeStoredMode(mode: ViewMode) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}

function readStoredRightVersion(fallback: BibleVersionCode): BibleVersionCode {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(RIGHT_VERSION_KEY);
    if (raw && raw in BIBLE_VERSION_SHORT) return raw as BibleVersionCode;
  } catch {
    /* ignore */
  }
  return fallback;
}

function writeStoredRightVersion(version: BibleVersionCode) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RIGHT_VERSION_KEY, version);
  } catch {
    /* ignore */
  }
}

function PaperSheet({
  title,
  pageLabel,
  versionShort,
  verses,
  verseClass,
  verseNumberClass,
  compact = false,
  /** Isi viewport penuh — tanpa kartu/margin. */
  edgeToEdge = false,
  readingTheme = "classic",
}: {
  title: string;
  pageLabel: string;
  versionShort: string;
  verses: PaperVerse[];
  verseClass: string;
  verseNumberClass: string;
  compact?: boolean;
  edgeToEdge?: boolean;
  readingTheme?: BibleReadingThemeId;
}) {
  const isNight = readingTheme === "night";
  return (
    <article
      data-bible-paper-page
      className={cn(
        "relative flex h-full flex-col overflow-hidden",
        isNight
          ? "bg-[#14161c] text-[#e8eaef]"
          : "bg-[#f7f1e4] text-[#1c1915]",
        !edgeToEdge &&
          (isNight
            ? "rounded-[0.35rem] shadow-[0_18px_50px_-20px_rgba(0,0,0,0.65)] ring-1 ring-white/10"
            : "rounded-[0.35rem] shadow-[0_18px_50px_-20px_rgba(28,25,21,0.55),0_1px_0_rgba(255,255,255,0.65)_inset] ring-1 ring-[#d8cbb3]/80"),
      )}
      style={
        isNight
          ? undefined
          : {
              backgroundImage: `
          linear-gradient(180deg, rgba(255,255,255,0.35), transparent 18%),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 27px,
            rgba(120, 95, 60, 0.035) 28px
          )
        `,
            }
      }
    >
      {!isNight ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          }}
        />
      ) : null}

      {edgeToEdge ? (
        <div className="relative z-[1] flex items-center justify-end px-4 pt-[calc(3.5rem+env(safe-area-inset-top))] sm:px-6">
          <p
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums",
              isNight
                ? "bg-white/10 text-[#9aa3b5]"
                : "bg-[#2a241c]/6 text-[#5c4f3c]",
            )}
          >
            {pageLabel}
          </p>
        </div>
      ) : (
        <header
          className={cn(
            "relative z-[1] flex items-end justify-between gap-3",
            isNight
              ? "border-b border-white/10"
              : "border-b border-[#d9cbb4]/90",
            compact ? "px-4 pb-2.5 pt-4" : "px-6 pb-3 pt-5 sm:px-8 sm:pt-6",
          )}
        >
          <div className="min-w-0">
            <p
              className={cn(
                "truncate font-serif font-semibold tracking-tight",
                isNight ? "text-[#e8eaef]" : "text-[#2a241c]",
                compact ? "text-base" : "text-lg sm:text-xl",
              )}
            >
              {title}
            </p>
            <p
              className={cn(
                "mt-0.5 text-[11px] font-semibold tracking-[0.14em] uppercase",
                isNight ? "text-[#9aa3b5]" : "text-[#8a7a63]",
              )}
            >
              {versionShort}
            </p>
          </div>
          <p
            className={cn(
              "shrink-0 pb-0.5 text-xs font-medium tabular-nums",
              isNight ? "text-[#9aa3b5]" : "text-[#8a7a63]",
            )}
          >
            {pageLabel}
          </p>
        </header>
      )}

      <div
        className={cn(
          "relative z-[1] min-h-0 flex-1 overflow-y-auto",
          edgeToEdge
            ? "px-4 py-3 sm:px-6 sm:py-4"
            : compact
              ? "px-3.5 py-3"
              : "overflow-hidden px-5 py-4 sm:px-7 sm:py-5",
        )}
      >
        {verses.length === 0 ? (
          <p
            className={cn(
              "py-8 text-center text-sm",
              isNight ? "text-[#9aa3b5]" : "text-[#8a7a63]",
            )}
          >
            Ayat tidak tersedia di terjemahan ini.
          </p>
        ) : (
          <div
            className={cn(
              "space-y-3",
              (compact || edgeToEdge) && "space-y-2.5",
            )}
          >
            {verses.map((item) => (
              <p
                key={`${item.chapter ?? "c"}-${item.verse}`}
                className={cn(
                  item.endVerse && item.endVerse > item.verse
                    ? "grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-2"
                    : "grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2",
                  isNight ? "text-[#e8eaef]" : "text-[#1f1a14]",
                  verseClass,
                )}
              >
                <sup
                  className={cn(
                    "pt-1 text-right font-semibold",
                    isNight ? "text-[#9aa3b5]" : "text-[#6b5a42]",
                    verseNumberClass,
                  )}
                >
                  {formatVerseNumberLabel(item.verse, item.endVerse)}
                </sup>
                <span className="font-serif leading-[1.55]">{item.content}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {!edgeToEdge && !isNight ? (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#c4b194]/35 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-black/[0.04] to-transparent" />
        </>
      ) : null}
    </article>
  );
}

function DualColumn({
  side,
  title,
  version,
  onVersionChange,
  loading,
  pageLabel,
  verses,
  verseClass,
  verseNumberClass,
  readingTheme = "classic",
}: {
  side: "kiri" | "kanan";
  title: string;
  version: BibleVersionCode;
  onVersionChange: (version: BibleVersionCode) => void;
  loading: boolean;
  pageLabel: string;
  verses: PaperVerse[];
  verseClass: string;
  verseNumberClass: string;
  readingTheme?: BibleReadingThemeId;
}) {
  const isNight = readingTheme === "night";
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
      <div className="flex items-center gap-2 px-0.5">
        <span className="shrink-0 text-[10px] font-semibold tracking-[0.14em] text-white/45 uppercase">
          {side}
        </span>
        <BibleVersionPicker
          value={version}
          onChange={onVersionChange}
          compact
          className="min-w-0 flex-1"
          triggerClassName="h-8 rounded-full border-white/15 bg-white/10 px-2.5 text-xs text-white hover:bg-white/15 hover:text-white [&_svg]:text-white/70"
        />
      </div>
      <div className="relative min-h-0 flex-1">
        {loading ? (
          <div
            className={cn(
              "flex h-full items-center justify-center rounded-[0.35rem] text-sm",
              isNight
                ? "bg-[#1a1d24] text-[#9aa3b5]"
                : "bg-[#f7f1e4]/90 text-[#6b5a42]",
            )}
          >
            <Loader2 className="mr-2 size-4 animate-spin" />
            Memuat…
          </div>
        ) : (
          <PaperSheet
            title={title}
            pageLabel={pageLabel}
            versionShort={BIBLE_VERSION_SHORT[version]}
            verses={verses}
            verseClass={verseClass}
            verseNumberClass={verseNumberClass}
            compact
            edgeToEdge
            readingTheme={readingTheme}
          />
        )}
      </div>
    </div>
  );
}

export function PassageFullscreenReader({
  open,
  onClose,
  title,
  passage,
  version,
  verses,
  readingTheme = "classic",
}: PassageFullscreenReaderProps) {
  const [portalReady, setPortalReady] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [coverEditorOpen, setCoverEditorOpen] = useState(false);
  const [pageSize, setPageSize] = useState({ width: 900, height: 720 });
  const [mode, setMode] = useState<ViewMode>("single");
  const [leftVersion, setLeftVersion] = useState<BibleVersionCode>(version);
  const [rightVersion, setRightVersion] = useState<BibleVersionCode>(() =>
    defaultCompareVersion(version),
  );
  const [leftVerses, setLeftVerses] = useState<PaperVerse[]>(verses);
  const [rightVerses, setRightVerses] = useState<PaperVerse[]>([]);
  const [leftLoading, setLeftLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);

  const fontSizeId = useSyncExternalStore(
    subscribeBibleFontSize,
    readBibleFontSize,
    getServerBibleFontSize,
  );
  const fontSize = getBibleFontSizeOption(fontSizeId);
  const cover = useSyncExternalStore(
    subscribeBibleCover,
    readBibleCover,
    getServerBibleCover,
  );

  const isDual = mode === "dual";
  const isNight = readingTheme === "night";
  const singleBg = isNight ? "bg-[#0f1115]" : "bg-[#f7f1e4]";
  const singleInk = isNight ? "text-[#e8eaef]" : "text-[#2a241c]";
  const singleMuted = isNight ? "text-[#9aa3b5]" : "text-[#8a7a63]";

  const contentPages = useMemo(() => {
    const size = isDual
      ? {
          width: Math.max(240, Math.floor(pageSize.width / 2) - 12),
          height: pageSize.height,
        }
      : pageSize;
    // Dual: sedikit lebih kecil font budget via width half
    return paginateVersesForPaper(leftVerses, fontSizeId, size);
  }, [leftVerses, fontSizeId, pageSize, isDual]);

  const pages =
    contentPages.length > 0 ? contentPages : [{ id: "empty", verses: [] as PaperVerse[] }];
  // Single: cover + isi; dual: langsung isi (tanpa cover flip)
  const totalPages = isDual ? Math.max(1, pages.length) : pages.length + 1;
  const isOnCover = !isDual && pageIndex === 0;
  const contentPageIndex = isDual ? pageIndex : Math.max(0, pageIndex - 1);
  const activeLeftPage = pages[contentPageIndex] ?? pages[0];
  const activeRightVerses = useMemo(
    () => matchPaperVersesByRefs(rightVerses, activeLeftPage?.verses ?? []),
    [rightVerses, activeLeftPage],
  );

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setPageIndex(0);
    setCoverEditorOpen(false);
    setMode(readStoredMode());
    setLeftVersion(version);
    setLeftVerses(verses);
    const storedRight = readStoredRightVersion(defaultCompareVersion(version));
    setRightVersion(
      storedRight === version ? defaultCompareVersion(version) : storedRight,
    );
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
    // Hanya saat dibuka / ganti pasal dari luar — jangan reset mode tiap re-render verses
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional open gate
  }, [open, passage]);

  useEffect(() => {
    if (!open) return;
    setLeftVersion(version);
    setLeftVerses(verses);
  }, [open, version, verses]);

  // Muat terjemahan kiri jika user ganti versi (bukan versi awal dari parent)
  useEffect(() => {
    if (!open) return;
    if (leftVersion === version) {
      setLeftVerses(verses);
      setLeftLoading(false);
      return;
    }

    let cancelled = false;
    setLeftLoading(true);
    void loadPassageClient(passage, leftVersion).then((data) => {
      if (cancelled) return;
      setLeftVerses(passageResultToPaperVerses(data));
      setLeftLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [open, passage, leftVersion, version, verses]);

  // Muat terjemahan kanan (dual)
  useEffect(() => {
    if (!open || !isDual) return;

    let cancelled = false;
    setRightLoading(true);
    void loadPassageClient(passage, rightVersion).then((data) => {
      if (cancelled) return;
      setRightVerses(passageResultToPaperVerses(data));
      setRightLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [open, isDual, passage, rightVersion]);

  useEffect(() => {
    if (!open) return;

    function measure() {
      const width = Math.max(280, window.innerWidth - 24);
      const height = Math.max(
        360,
        window.innerHeight -
          56 - // header
          56 - // footer nav
          (isDual ? 40 : 16) - // dual version row
          16,
      );
      setPageSize((current) =>
        Math.abs(current.width - width) > 12 ||
        Math.abs(current.height - height) > 12
          ? { width, height }
          : current,
      );
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, isDual]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (coverEditorOpen) {
          setCoverEditorOpen(false);
          return;
        }
        onClose();
      }
      if (event.key === "ArrowRight") {
        setPageIndex((value) => Math.min(totalPages - 1, value + 1));
      }
      if (event.key === "ArrowLeft") {
        setPageIndex((value) => Math.max(0, value - 1));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, totalPages, coverEditorOpen]);

  useEffect(() => {
    setPageIndex((value) => Math.min(value, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  function handleModeChange(next: ViewMode) {
    setMode(next);
    writeStoredMode(next);
    setPageIndex(0);
  }

  function handleLeftVersionChange(next: BibleVersionCode) {
    setLeftVersion(next);
    if (next === rightVersion) {
      const alt = defaultCompareVersion(next);
      setRightVersion(alt);
      writeStoredRightVersion(alt);
    }
    setPageIndex(0);
  }

  function handleRightVersionChange(next: BibleVersionCode) {
    setRightVersion(next);
    writeStoredRightVersion(next);
    if (next === leftVersion) {
      const alt = defaultCompareVersion(next);
      setLeftVersion(alt);
    }
  }

  if (!open || !portalReady) return null;

  const dualPageLabel = `${contentPageIndex + 1} / ${pages.length}`;

  return createPortal(
    <div
      data-bible-fullscreen
      data-bible-read-theme={readingTheme}
      className={cn(
        "fixed inset-0 z-[120] flex flex-col",
        isDual ? "bg-[#1d242c]" : singleBg,
      )}
      role="dialog"
      aria-modal="true"
      aria-label={`Full screen · ${title}`}
    >
      {/* Chrome atas — overlay tipis, halaman tetap edge-to-edge */}
      <header
        className={cn(
          "absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-2",
          "px-2.5 pt-[max(0.45rem,env(safe-area-inset-top))] pb-2 sm:px-4",
          isDual
            ? "bg-gradient-to-b from-[#1d242c] via-[#1d242c]/92 to-transparent"
            : isNight
              ? "bg-gradient-to-b from-[#0f1115] via-[#0f1115]/92 to-transparent"
              : "bg-gradient-to-b from-[#f7f1e4] via-[#f7f1e4]/92 to-transparent",
        )}
      >
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-semibold tracking-tight",
              isDual ? "text-white/90" : singleInk,
            )}
          >
            {isOnCover ? cover.title || "Cover Alkitab" : title}
          </p>
          {!isDual && !isOnCover ? (
            <div className="mt-1 flex max-w-[14rem] items-center gap-1.5 sm:max-w-xs">
              <BookOpen
                className={cn("size-3.5 shrink-0", singleMuted)}
              />
              <BibleVersionPicker
                value={leftVersion}
                onChange={handleLeftVersionChange}
                compact
                className="min-w-0 flex-1"
                triggerClassName={cn(
                  "h-7 rounded-full px-2 text-[11px]",
                  isDual
                    ? "border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white [&_svg]:text-white/70"
                    : "border-[#d8cbb3] bg-white/70 text-[#3b2f2a] hover:bg-white [&_svg]:text-[#8a7a63]",
                )}
              />
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <div
            className={cn(
              "flex rounded-full p-0.5",
              isDual ? "bg-white/10" : "bg-[#2a241c]/8",
            )}
            role="group"
            aria-label="Mode tampilan"
          >
            <button
              type="button"
              onClick={() => handleModeChange("single")}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-full transition sm:h-8 sm:w-auto sm:gap-1 sm:px-2.5 sm:text-xs sm:font-semibold",
                !isDual
                  ? "bg-[#2a241c] text-[#f7f1e4]"
                  : "text-white/70 hover:text-white",
              )}
              aria-pressed={!isDual}
              aria-label="Single"
            >
              <Square className="size-3.5" />
              <span className="hidden sm:inline">Single</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("dual")}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-full transition sm:h-8 sm:w-auto sm:gap-1 sm:px-2.5 sm:text-xs sm:font-semibold",
                isDual
                  ? "bg-white text-[#1d242c]"
                  : "text-[#2a241c]/55 hover:text-[#2a241c]",
              )}
              aria-pressed={isDual}
              aria-label="Dual"
            >
              <Columns2 className="size-3.5" />
              <span className="hidden sm:inline">Dual</span>
            </button>
          </div>

          {!isDual ? (
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="size-8 rounded-full border-0 bg-[#2a241c]/8 text-[#2a241c] hover:bg-[#2a241c]/15"
              onClick={() => setCoverEditorOpen(true)}
              aria-label="Cover"
            >
              <Palette className="size-3.5" />
            </Button>
          ) : null}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className={cn(
              "h-8 gap-1 rounded-full px-2.5",
              isDual
                ? "border-0 bg-white/10 text-white hover:bg-white/15"
                : "border-0 bg-[#2a241c]/8 text-[#2a241c] hover:bg-[#2a241c]/15",
            )}
            onClick={onClose}
          >
            <X className="size-3.5" />
            <span className="text-xs font-semibold">Tutup</span>
          </Button>
        </div>
      </header>

      {/* Area baca full bleed */}
      <div
        className={cn(
          "relative z-[1] flex min-h-0 flex-1 flex-col",
          isDual && "pt-[calc(3.25rem+env(safe-area-inset-top))] pb-[4.75rem]",
          !isDual && "pb-[4.5rem]",
        )}
      >
        {isDual ? (
          <div className="flex min-h-0 w-full flex-1 flex-col gap-2 px-2 md:flex-row md:gap-2 md:px-3">
            <DualColumn
              side="kiri"
              title={title}
              version={leftVersion}
              onVersionChange={handleLeftVersionChange}
              loading={leftLoading}
              pageLabel={dualPageLabel}
              verses={activeLeftPage?.verses ?? []}
              verseClass={fontSize.verseClass}
              verseNumberClass={fontSize.verseNumberClass}
              readingTheme={readingTheme}
            />
            <div className="hidden w-px shrink-0 bg-white/10 md:block" />
            <DualColumn
              side="kanan"
              title={title}
              version={rightVersion}
              onVersionChange={handleRightVersionChange}
              loading={rightLoading}
              pageLabel={dualPageLabel}
              verses={activeRightVerses}
              verseClass={fontSize.verseClass}
              verseNumberClass={fontSize.verseNumberClass}
              readingTheme={readingTheme}
            />
          </div>
        ) : leftLoading ? (
          <div
            className={cn(
              "flex flex-1 items-center justify-center text-sm",
              isNight ? "text-[#9aa3b5]" : "text-[#8a7a63]",
            )}
          >
            <Loader2 className="mr-2 size-4 animate-spin" />
            Memuat terjemahan…
          </div>
        ) : (
          <PaperPageFlip
            pageCount={totalPages}
            pageIndex={pageIndex}
            onPageIndexChange={setPageIndex}
            className="min-h-0 flex-1"
            renderPage={(index) => {
              if (index === 0) {
                return (
                  <BibleCoverSheet
                    prefs={cover}
                    className="!rounded-none !shadow-none"
                  />
                );
              }
              const page = pages[index - 1] ?? pages[0];
              return (
                <PaperSheet
                  title={title}
                  pageLabel={`${index} / ${pages.length}`}
                  versionShort={BIBLE_VERSION_SHORT[leftVersion]}
                  verses={page?.verses ?? []}
                  verseClass={fontSize.verseClass}
                  verseNumberClass={fontSize.verseNumberClass}
                  edgeToEdge
                  readingTheme={readingTheme}
                />
              );
            }}
          />
        )}
      </div>

      {/* Nav bawah — overlay di atas kertas */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-30 flex items-center justify-between gap-2",
          "px-2.5 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-2 sm:px-4",
          isDual
            ? "bg-gradient-to-t from-[#1d242c] via-[#1d242c]/95 to-transparent"
            : "bg-gradient-to-t from-[#f7f1e4] via-[#f7f1e4]/95 to-transparent",
        )}
      >
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className={cn(
            "h-10 rounded-full disabled:opacity-35",
            isDual
              ? "border-0 bg-white/10 text-white hover:bg-white/15"
              : "border border-[#d8cbb3]/80 bg-white/80 text-[#2a241c] hover:bg-white",
          )}
          disabled={pageIndex <= 0}
          onClick={() => setPageIndex((value) => Math.max(0, value - 1))}
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </Button>
        <p
          className={cn(
            "min-w-0 flex-1 truncate text-center text-[11px] font-medium sm:text-xs",
            isDual ? "text-white/55" : "text-[#8a7a63]",
          )}
        >
          {isDual
            ? "Geser halaman bersama"
            : isOnCover
              ? "Geser untuk membuka"
              : "Geser untuk membalik halaman"}
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className={cn(
            "h-10 rounded-full disabled:opacity-35",
            isDual
              ? "border-0 bg-white/10 text-white hover:bg-white/15"
              : "border border-[#d8cbb3]/80 bg-white/80 text-[#2a241c] hover:bg-white",
          )}
          disabled={pageIndex >= totalPages - 1}
          onClick={() =>
            setPageIndex((value) => Math.min(totalPages - 1, value + 1))
          }
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <BibleCoverEditor
        open={coverEditorOpen}
        onOpenChange={setCoverEditorOpen}
        value={cover}
      />
    </div>,
    document.body,
  );
}
