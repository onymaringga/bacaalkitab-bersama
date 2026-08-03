"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  Check,
  CheckCircle2,
  Download,
  HardDrive,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/components/ui/toast-host";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BibleVersionCode } from "@/lib/bible-books";
import {
  BIBLE_BOOKS,
  QUICK_DOWNLOAD_SETS,
  countCachedBookChapters,
  countPendingChapters,
  downloadBibleBooks,
  estimateChapterCount,
  estimateDownloadBytes,
  formatCacheBytes,
  getNewTestamentBooks,
  getOfflineCacheSummary,
  getOldTestamentBooks,
  isBookFullyCached,
} from "@/lib/bible-offline-books";
import {
  readPreferredBibleVersion,
  writePreferredBibleVersion,
  BIBLE_VERSION_OPTIONS,
} from "@/lib/bible-version-preference";
import { cn } from "@/lib/utils";

function subscribeCache(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

type DownloadProgress = {
  done: number;
  total: number;
  current?: string;
};

type DownloadBibleBooksProps = {
  triggerClassName?: string;
  /** Tampilkan sebagai kartu inline (pengaturan) bukan tombol dialog. */
  embedded?: boolean;
};

export function DownloadBibleBooks({
  triggerClassName,
  embedded = false,
}: DownloadBibleBooksProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [version, setVersion] = useState<BibleVersionCode>(() =>
    typeof window === "undefined" ? "tb" : readPreferredBibleVersion(),
  );
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [justFinished, setJustFinished] = useState<{
    fetched: number;
    skipped: number;
  } | null>(null);
  const [testament, setTestament] = useState<"pl" | "pb">("pb");
  const [tick, setTick] = useState(0);

  useSyncExternalStore(
    subscribeCache,
    () => tick,
    () => 0,
  );

  const testamentBooks =
    testament === "pl" ? getOldTestamentBooks() : getNewTestamentBooks();

  const allTestamentSelected =
    testamentBooks.length > 0 &&
    testamentBooks.every((book) => selected.has(book.abbr));

  const chapterTotal = useMemo(
    () => estimateChapterCount([...selected]),
    [selected],
  );

  const pendingInfo = useMemo(() => {
    void tick;
    if (selected.size === 0) {
      return { pending: 0, alreadyCached: 0, total: 0 };
    }
    return countPendingChapters([...selected], version);
  }, [selected, version, tick]);

  const estimateLabel = useMemo(() => {
    if (pendingInfo.pending <= 0) return null;
    return formatCacheBytes(estimateDownloadBytes(pendingInfo.pending));
  }, [pendingInfo.pending]);

  const cacheSummary = useMemo(() => {
    void tick;
    return getOfflineCacheSummary();
  }, [tick]);

  const percent = progress?.total
    ? Math.min(100, Math.round((100 * progress.done) / progress.total))
    : 0;

  function toggleBook(abbr: string) {
    setJustFinished(null);
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(abbr)) next.delete(abbr);
      else next.add(abbr);
      return next;
    });
  }

  function applyQuickSet(bookAbbrs: string[]) {
    setJustFinished(null);
    setSelected(new Set(bookAbbrs));
  }

  function selectAllTestament() {
    setJustFinished(null);
    setSelected((current) => {
      const next = new Set(current);
      for (const book of testamentBooks) next.add(book.abbr);
      return next;
    });
  }

  function clearTestamentSelection() {
    setJustFinished(null);
    setSelected((current) => {
      const next = new Set(current);
      for (const book of testamentBooks) next.delete(book.abbr);
      return next;
    });
  }

  function selectAllBible() {
    setJustFinished(null);
    setSelected(new Set(BIBLE_BOOKS.map((book) => book.abbr)));
  }

  async function handleDownload() {
    if (selected.size === 0 || downloading) return;
    setJustFinished(null);
    setDownloading(true);
    setProgress({ done: 0, total: Math.max(chapterTotal, 1) });
    writePreferredBibleVersion(version);

    try {
      const result = await downloadBibleBooks([...selected], version, {
        concurrency: 2,
        onProgress: (done, total, current) =>
          setProgress({ done, total, current }),
      });
      setTick((value) => value + 1);
      setJustFinished({ fetched: result.fetched, skipped: result.skipped });

      if (result.fetched === 0 && result.skipped > 0) {
        showToast("Kitab yang dipilih sudah tersimpan di perangkat");
      } else if (result.fetched > 0) {
        showToast(
          `${result.fetched} pasal diunduh` +
            (result.skipped ? ` · ${result.skipped} sudah ada` : ""),
        );
      } else {
        showToast("Tidak ada pasal baru yang diunduh. Coba lagi sebentar.");
      }
    } finally {
      setDownloading(false);
      setProgress(null);
    }
  }

  const panel = (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--m-line)] bg-[var(--m-wash)]/55 px-3.5 py-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--m-accent)] shadow-sm">
          <HardDrive className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[var(--m-ink)]">
            Tersimpan di perangkat
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--m-ink-soft)]">
            {cacheSummary.count} pasal · {cacheSummary.label}
          </p>
        </div>
        <Select
          value={version}
          disabled={downloading}
          onValueChange={(next) => {
            setJustFinished(null);
            setVersion(next as BibleVersionCode);
            setTick((value) => value + 1);
          }}
        >
          <SelectTrigger
            aria-label="Pilih terjemahan Alkitab"
            className="h-8 w-auto min-w-[4.75rem] shrink-0 rounded-lg border-[var(--m-line)] bg-white px-2.5 text-xs font-semibold text-[var(--m-ink)]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {BIBLE_VERSION_OPTIONS.map((option) => (
              <SelectItem
                key={option.code}
                value={option.code}
                className="text-xs font-semibold"
              >
                {option.short} · {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_DOWNLOAD_SETS.map((set) => (
          <Button
            key={set.id}
            type="button"
            size="sm"
            variant="outline"
            disabled={downloading}
            className="h-8 rounded-lg text-xs font-semibold"
            onClick={() => applyQuickSet(set.bookAbbrs)}
          >
            {set.label}
          </Button>
        ))}
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={downloading}
          className="h-8 rounded-lg text-xs font-semibold"
          onClick={selectAllBible}
        >
          Semua kitab
        </Button>
      </div>

      <Tabs
        value={testament}
        onValueChange={(value) => setTestament(value as "pl" | "pb")}
        className="space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList className="grid h-9 min-w-0 flex-1 grid-cols-2 rounded-xl sm:max-w-xs">
            <TabsTrigger value="pl" className="rounded-lg text-xs font-semibold">
              Perjanjian Lama
            </TabsTrigger>
            <TabsTrigger value="pb" className="rounded-lg text-xs font-semibold">
              Perjanjian Baru
            </TabsTrigger>
          </TabsList>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={downloading}
            className="h-8 shrink-0 rounded-lg px-2.5 text-xs font-semibold text-[var(--m-accent)]"
            onClick={() =>
              allTestamentSelected
                ? clearTestamentSelection()
                : selectAllTestament()
            }
          >
            {allTestamentSelected ? "Batal pilih" : "Pilih semua"}
          </Button>
        </div>
        <TabsContent value="pl" className="mt-0">
          <BookChecklist
            books={getOldTestamentBooks()}
            version={version}
            selected={selected}
            disabled={downloading}
            onToggle={toggleBook}
          />
        </TabsContent>
        <TabsContent value="pb" className="mt-0">
          <BookChecklist
            books={getNewTestamentBooks()}
            version={version}
            selected={selected}
            disabled={downloading}
            onToggle={toggleBook}
          />
        </TabsContent>
      </Tabs>

      {selected.size > 0 && !downloading && !justFinished ? (
        <div className="rounded-2xl border border-[var(--m-line)] bg-white px-3.5 py-3">
          <p className="text-xs font-semibold text-[var(--m-ink)]">
            Siap diunduh
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <SummaryChip
              label="Kitab"
              value={String(selected.size)}
            />
            <SummaryChip
              label="Pasal baru"
              value={String(pendingInfo.pending)}
            />
            <SummaryChip
              label="Estimasi"
              value={estimateLabel ?? "—"}
            />
          </div>
          {pendingInfo.alreadyCached > 0 ? (
            <p className="mt-2 text-[11px] text-[var(--m-ink-soft)]">
              {pendingInfo.alreadyCached} pasal sudah ada — akan dilewati
            </p>
          ) : null}
          {pendingInfo.pending === 0 ? (
            <p className="mt-2 text-[11px] font-medium text-emerald-700">
              Semua pasal pilihan sudah tersimpan
            </p>
          ) : null}
        </div>
      ) : null}

      {progress ? (
        <div className="space-y-3 rounded-2xl border border-[var(--m-accent)]/25 bg-[var(--m-accent)]/6 px-3.5 py-3.5">
          <div className="flex items-start gap-3">
            <div className="relative size-12 shrink-0">
              <svg viewBox="0 0 36 36" className="size-12 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  className="stroke-[var(--m-line)]"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  className="stroke-[var(--m-accent)] transition-[stroke-dashoffset] duration-300"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 15.5}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 15.5 * (1 - percent / 100)
                  }`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums text-[var(--m-ink)]">
                {percent}%
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--m-ink)]">
                Mengunduh…
              </p>
              <p className="mt-0.5 truncate text-xs text-[var(--m-ink-soft)]">
                {progress.current
                  ? `Sekarang: ${progress.current}`
                  : "Menyiapkan unduhan"}
              </p>
              <p className="mt-1 text-[11px] tabular-nums text-[var(--m-ink-soft)]">
                {progress.done}/{progress.total} pasal
                {progress.total - progress.done > 0
                  ? ` · ${progress.total - progress.done} tersisa`
                  : ""}
              </p>
            </div>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/80">
            <div
              className="h-full rounded-full bg-[var(--m-accent)] transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      ) : null}

      {justFinished ? (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-900">
              Unduhan selesai
            </p>
            <p className="mt-0.5 text-xs text-emerald-800/80">
              {justFinished.fetched > 0
                ? `${justFinished.fetched} pasal baru tersimpan`
                : "Tidak ada pasal baru"}
              {justFinished.skipped > 0
                ? ` · ${justFinished.skipped} sudah ada`
                : ""}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          className="h-11 flex-1 rounded-xl font-semibold"
          disabled={
            selected.size === 0 ||
            downloading ||
            (pendingInfo.pending === 0 && selected.size > 0)
          }
          onClick={() => void handleDownload()}
        >
          {downloading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Mengunduh {percent}%
            </>
          ) : pendingInfo.pending === 0 && selected.size > 0 ? (
            <>
              <CheckCircle2 className="size-4" />
              Sudah lengkap
            </>
          ) : (
            <>
              <Download className="size-4" />
              Unduh {pendingInfo.pending || chapterTotal || ""} pasal
            </>
          )}
        </Button>
        {selected.size > 0 ? (
          <Button
            type="button"
            variant="ghost"
            className="h-11 rounded-xl"
            disabled={downloading}
            onClick={() => {
              setSelected(new Set());
              setJustFinished(null);
            }}
          >
            Reset
          </Button>
        ) : null}
      </div>

      <p className="text-[11px] leading-relaxed text-[var(--m-ink-soft)]">
        Teks disimpan di perangkat ini supaya buka pasal lebih cepat, termasuk
        saat jaringan lambat. Mazmur &amp; kitab panjang memakai lebih banyak
        ruang.
      </p>
    </div>
  );

  if (embedded) {
    return panel;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (downloading) return;
        setOpen(next);
        if (next) {
          setVersion(readPreferredBibleVersion());
          setTick((value) => value + 1);
          setJustFinished(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "h-9 gap-1.5 rounded-xl border-[var(--m-line)] font-semibold",
            triggerClassName,
          )}
        >
          <Download className="size-4" />
          Unduh
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[min(90dvh,42rem)] w-full max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b border-[var(--m-line)] px-5 py-4 pr-12 text-left">
          <DialogTitle>Unduh Alkitab</DialogTitle>
          <DialogDescription>
            Pilih beberapa kitab untuk disimpan di perangkat — baca jadi lebih
            cepat.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{panel}</div>
      </DialogContent>
    </Dialog>
  );
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--m-wash)]/80 px-2.5 py-2 text-center">
      <p className="text-sm font-semibold tabular-nums text-[var(--m-ink)]">
        {value}
      </p>
      <p className="text-[10px] text-[var(--m-ink-soft)]">{label}</p>
    </div>
  );
}

function BookChecklist({
  books,
  version,
  selected,
  disabled,
  onToggle,
}: {
  books: typeof BIBLE_BOOKS;
  version: BibleVersionCode;
  selected: Set<string>;
  disabled?: boolean;
  onToggle: (abbr: string) => void;
}) {
  return (
    <ul className="grid max-h-52 grid-cols-2 gap-1.5 overflow-y-auto sm:grid-cols-3">
      {books.map((book) => {
        const active = selected.has(book.abbr);
        const full = isBookFullyCached(book, version);
        const { cached, total } = countCachedBookChapters(book, version);
        const pct = total ? Math.round((100 * cached) / total) : 0;
        return (
          <li key={book.abbr}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onToggle(book.abbr)}
              className={cn(
                "flex w-full flex-col gap-1.5 rounded-xl border px-2.5 py-2 text-left transition-colors",
                active
                  ? "border-[var(--m-accent)] bg-[var(--m-accent)]/8"
                  : "border-[var(--m-line)] hover:bg-[var(--m-wash)]/60",
                full && !active && "border-emerald-200 bg-emerald-50/40",
              )}
            >
              <span className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded border",
                    active
                      ? "border-[var(--m-accent)] bg-[var(--m-accent)] text-white"
                      : full
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-[var(--m-ink-soft)]/40",
                  )}
                >
                  {active || full ? (
                    <Check className="size-3" strokeWidth={3} />
                  ) : null}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-[var(--m-ink)]">
                    {book.name}
                  </span>
                  <span className="block text-[10px] text-[var(--m-ink-soft)]">
                    {full
                      ? "Lengkap"
                      : cached > 0
                        ? `${cached}/${total} pasal`
                        : `${total} pasal`}
                  </span>
                </span>
              </span>
              {cached > 0 && !full ? (
                <span className="h-1 overflow-hidden rounded-full bg-[var(--m-wash)]">
                  <span
                    className="block h-full rounded-full bg-[var(--m-accent)]/70"
                    style={{ width: `${pct}%` }}
                  />
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
