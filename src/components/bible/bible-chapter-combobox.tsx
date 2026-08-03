"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Check, CheckCircle2, ChevronsUpDown, Search } from "lucide-react";
import { Popover } from "radix-ui";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getCompletedChaptersSnapshot,
  getServerCompletedChaptersSnapshot,
  isChapterComplete,
  subscribeCompletedChapters,
} from "@/lib/bible-completed-chapters";
import {
  getAllBooksOpenProgressCached,
  getServerBooksOpenProgress,
  isChapterOpened,
  subscribeOpenedChapters,
} from "@/lib/bible-opened-chapters";
import { cn } from "@/lib/utils";

type BibleChapterComboboxProps = {
  options: number[];
  value: string;
  onChange: (chapter: string) => void;
  /** Untuk menandai pasal yang sudah selesai dibaca. */
  bookAbbr?: string;
  id?: string;
  placeholder?: string;
  /** Label opsi kosong di awal daftar (mis. "Semua ayat"). value = "". */
  emptyLabel?: string;
  /** Placeholder search field. */
  searchPlaceholder?: string;
  /** Teks saat hasil kosong. */
  emptySearchLabel?: string;
  /** Prefiks item, default kosong (hanya nomor). Mis. "Ayat ". */
  optionPrefix?: string;
};

export function BibleChapterCombobox({
  options,
  value,
  onChange,
  bookAbbr,
  id,
  placeholder = "Pilih pasal",
  emptyLabel,
  searchPlaceholder = "Cari nomor…",
  emptySearchLabel = "Tidak ditemukan",
  optionPrefix = "",
}: BibleChapterComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useSyncExternalStore(
    subscribeCompletedChapters,
    getCompletedChaptersSnapshot,
    getServerCompletedChaptersSnapshot,
  );
  useSyncExternalStore(
    subscribeOpenedChapters,
    getAllBooksOpenProgressCached,
    getServerBooksOpenProgress,
  );

  const selectedNum =
    value === ""
      ? null
      : (options.find((option) => String(option) === value) ?? null);
  const showEmpty = Boolean(emptyLabel);
  const isEmptySelected = showEmpty && value === "";

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return options;
    return options.filter((option) => String(option).includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
      selectedRef.current?.scrollIntoView({ block: "center" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  function selectChapter(chapter: number | "") {
    onChange(chapter === "" ? "" : String(chapter));
    setOpen(false);
  }

  const triggerLabel = isEmptySelected
    ? emptyLabel
    : selectedNum != null
      ? `${optionPrefix}${selectedNum}`
      : placeholder;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-11 w-full justify-between rounded-xl border-input px-3 font-normal"
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 w-(--radix-popover-trigger-width) overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                inputMode="numeric"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 rounded-lg pl-8"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && filtered[0] != null) {
                    event.preventDefault();
                    selectChapter(filtered[0]);
                  }
                }}
              />
            </div>
          </div>
          <ul
            className="max-h-64 overflow-y-auto overscroll-contain p-1"
            role="listbox"
          >
            {showEmpty && !query.trim() ? (
              <li role="option" aria-selected={isEmptySelected}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
                    isEmptySelected && "bg-accent/60",
                  )}
                  onClick={() => selectChapter("")}
                >
                  <span className="min-w-0 flex-1">{emptyLabel}</span>
                  <Check
                    className={cn(
                      "size-4 shrink-0 text-primary",
                      isEmptySelected ? "opacity-100" : "opacity-0",
                    )}
                  />
                </button>
              </li>
            ) : null}
            {filtered.length === 0 ? (
              <li className="px-2 py-3 text-center text-sm text-muted-foreground">
                {emptySearchLabel}
              </li>
            ) : (
              filtered.map((option) => {
                const isSelected = option === selectedNum;
                const isDone = bookAbbr
                  ? isChapterComplete(bookAbbr, option)
                  : false;
                const isOpened =
                  !isDone && bookAbbr
                    ? isChapterOpened(bookAbbr, option)
                    : false;
                return (
                  <li key={option} role="option" aria-selected={isSelected}>
                    <button
                      ref={isSelected ? selectedRef : undefined}
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
                        isSelected && "bg-accent/60",
                      )}
                      onClick={() => selectChapter(option)}
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-1.5 tabular-nums">
                        {optionPrefix}
                        {option}
                        {isDone ? (
                          <CheckCircle2
                            className="size-3.5 shrink-0 text-emerald-600/70"
                            aria-label="Selesai dibaca"
                          />
                        ) : isOpened ? (
                          <CheckCircle2
                            className="size-3.5 shrink-0 text-muted-foreground/40"
                            aria-label="Sudah dibuka"
                          />
                        ) : null}
                      </span>
                      <Check
                        className={cn(
                          "size-4 shrink-0 text-primary",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
