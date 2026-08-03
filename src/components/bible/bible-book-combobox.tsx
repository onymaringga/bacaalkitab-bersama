"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Popover } from "radix-ui";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BibleBook } from "@/lib/bible-books";
import { cn } from "@/lib/utils";

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function bookMatches(book: BibleBook, query: string) {
  const keys = [book.name, book.abbr, ...book.aliases].map(normalize);
  return keys.some(
    (key) => key.includes(query) || query.includes(key) || key.startsWith(query),
  );
}

type BibleBookComboboxProps = {
  books: BibleBook[];
  value: string;
  onChange: (abbr: string) => void;
  id?: string;
  placeholder?: string;
};

export function BibleBookCombobox({
  books,
  value,
  onChange,
  id,
  placeholder = "Pilih kitab",
}: BibleBookComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selected =
    books.find((book) => book.abbr === value) ?? books[0] ?? null;

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return books;
    return books.filter((book) => bookMatches(book, q));
  }, [books, query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  function selectBook(abbr: string) {
    onChange(abbr);
    setOpen(false);
  }

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
          <span className="truncate">
            {selected?.name ?? placeholder}
          </span>
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
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari kitab…"
                className="h-9 rounded-lg pl-8"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && filtered[0]) {
                    event.preventDefault();
                    selectBook(filtered[0].abbr);
                  }
                }}
              />
            </div>
          </div>
          <ul className="max-h-64 overflow-y-auto p-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-2 py-3 text-center text-sm text-muted-foreground">
                Kitab tidak ditemukan
              </li>
            ) : (
              filtered.map((book) => {
                const isSelected = book.abbr === (selected?.abbr ?? value);
                return (
                  <li key={book.abbr} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
                        isSelected && "bg-accent/60",
                      )}
                      onClick={() => selectBook(book.abbr)}
                    >
                      <span className="min-w-0 flex-1 truncate">{book.name}</span>
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
