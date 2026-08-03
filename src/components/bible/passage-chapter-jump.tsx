"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Popover } from "radix-ui";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PassageChapterJumpProps = {
  options: number[];
  value: number;
  onChange: (chapter: number) => void;
  disabled?: boolean;
  id?: string;
};

export function PassageChapterJump({
  options,
  value,
  onChange,
  disabled = false,
  id = "passage-jump-chapter",
}: PassageChapterJumpProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

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

  function selectChapter(chapter: number) {
    onChange(chapter);
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          aria-label="Pilih pasal"
          aria-expanded={open}
          className={cn(
            "relative inline-flex h-11 items-center gap-1.5 rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/55 px-2.5 shadow-sm outline-none transition sm:px-3",
            "hover:bg-[var(--m-wash)]/80 focus-visible:ring-2 focus-visible:ring-[var(--m-accent)]/35",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <span className="text-[10px] font-semibold tracking-[0.12em] text-[var(--m-ink-soft)] uppercase">
            Pasal
          </span>
          <span className="min-w-[1.5rem] text-center text-base font-bold tabular-nums text-[var(--m-ink)]">
            {value}
          </span>
          {open ? (
            <ChevronUp
              className="size-3.5 text-[var(--m-ink-soft)]"
              aria-hidden
            />
          ) : (
            <ChevronDown
              className="size-3.5 text-[var(--m-ink-soft)]"
              aria-hidden
            />
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="center"
          side="top"
          sideOffset={8}
          collisionPadding={12}
          className="z-[80] w-[12rem] overflow-hidden rounded-xl border border-[var(--m-line)] bg-white text-[var(--m-ink)] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.45)] outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="border-b border-[var(--m-line)]/70 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-[var(--m-ink-soft)]" />
              <Input
                ref={inputRef}
                inputMode="numeric"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nomor…"
                className="h-9 rounded-lg border-[var(--m-line)] pl-8"
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
            ref={listRef}
            className="max-h-64 overflow-y-auto overscroll-contain p-1"
            role="listbox"
          >
            {filtered.length === 0 ? (
              <li className="px-2 py-3 text-center text-sm text-[var(--m-ink-soft)]">
                Tidak ditemukan
              </li>
            ) : (
              filtered.map((chapter) => {
                const isSelected = chapter === value;
                return (
                  <li key={chapter} role="option" aria-selected={isSelected}>
                    <button
                      ref={isSelected ? selectedRef : undefined}
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm outline-none transition-colors",
                        "hover:bg-[var(--m-wash)] focus-visible:bg-[var(--m-wash)]",
                        isSelected &&
                          "bg-sky-600 font-semibold text-white hover:bg-sky-700 focus-visible:bg-sky-700",
                      )}
                      onClick={() => selectChapter(chapter)}
                    >
                      <span className="min-w-0 flex-1 tabular-nums">
                        {chapter}
                      </span>
                      <Check
                        className={cn(
                          "size-4 shrink-0",
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
