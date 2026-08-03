"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Popover } from "radix-ui";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuickTooltip } from "@/components/ui/quick-tooltip";
import type { BibleVersionCode } from "@/lib/bible-books";
import { BIBLE_VERSION_OPTIONS } from "@/lib/bible-version-preference";
import { cn } from "@/lib/utils";

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function versionMatches(
  option: (typeof BIBLE_VERSION_OPTIONS)[number],
  query: string,
) {
  const keys = [option.code, option.short, option.label].map(normalize);
  return keys.some(
    (key) => key.includes(query) || query.includes(key) || key.startsWith(query),
  );
}

type BibleVersionPickerProps = {
  value: BibleVersionCode;
  onChange: (version: BibleVersionCode) => void;
  className?: string;
  triggerClassName?: string;
  /** Compact trigger width for toolbar use. */
  compact?: boolean;
};

export function BibleVersionPicker({
  value,
  onChange,
  className,
  triggerClassName,
  compact = false,
}: BibleVersionPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selected =
    BIBLE_VERSION_OPTIONS.find((option) => option.code === value) ??
    BIBLE_VERSION_OPTIONS[0]!;

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return BIBLE_VERSION_OPTIONS;
    return BIBLE_VERSION_OPTIONS.filter((option) => versionMatches(option, q));
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  function selectVersion(code: BibleVersionCode) {
    onChange(code);
    setOpen(false);
  }

  return (
    <div className={cn("min-w-0", className)}>
      <Popover.Root open={open} onOpenChange={setOpen} modal={false}>
        <QuickTooltip label={open ? "" : `${selected.short} · ${selected.label}`}>
          <span className="inline-flex w-full min-w-0">
            <Popover.Trigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                aria-label={`Terjemahan ${selected.short} · ${selected.label}`}
                className={cn(
                  "w-full justify-between rounded-xl border-[var(--m-line)] bg-white px-3 font-semibold text-[var(--m-ink)]",
                  compact ? "h-9 w-auto min-w-0 max-w-none shrink-0 gap-1 px-2.5" : "h-10 min-w-0",
                  triggerClassName,
                )}
              >
                <span className="truncate tracking-wide uppercase">
                  {selected.short}
                </span>
                <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
              </Button>
            </Popover.Trigger>
          </span>
        </QuickTooltip>
        <Popover.Portal>
          <Popover.Content
            align="start"
            side="bottom"
            sideOffset={6}
            collisionPadding={12}
            avoidCollisions
            className="z-[140] w-[var(--radix-popover-trigger-width)] min-w-[17rem] overflow-hidden rounded-xl border border-[var(--m-line)] bg-white text-[var(--m-ink)] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.45)] outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
          >
            <div className="border-b border-border p-2">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari terjemahan…"
                  className="h-9 rounded-lg pl-8"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && filtered[0]) {
                      event.preventDefault();
                      selectVersion(filtered[0].code);
                    }
                  }}
                />
              </div>
            </div>
            <ul className="max-h-56 overflow-y-auto p-1" role="listbox">
              {filtered.length === 0 ? (
                <li className="px-2 py-3 text-center text-sm text-muted-foreground">
                  Terjemahan tidak ditemukan
                </li>
              ) : (
                filtered.map((option) => {
                  const isSelected = option.code === value;
                  return (
                    <li
                      key={option.code}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm outline-none transition-colors",
                          "hover:bg-sky-100 hover:text-[var(--m-ink)] focus-visible:bg-sky-100",
                          isSelected &&
                            "bg-sky-600 font-semibold text-white hover:bg-sky-700 hover:text-white focus-visible:bg-sky-700 focus-visible:text-white",
                        )}
                        onClick={() => selectVersion(option.code)}
                      >
                        <span className="min-w-0 flex-1 truncate">
                          <span className="font-semibold">{option.short}</span>
                          <span
                            className={cn(
                              "text-muted-foreground",
                              isSelected && "text-white/80",
                            )}
                          >
                            {" "}
                            · {option.label}
                          </span>
                        </span>
                        <Check
                          className={cn(
                            "size-4 shrink-0",
                            isSelected
                              ? "opacity-100 text-white"
                              : "opacity-0 text-sky-600",
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
    </div>
  );
}
