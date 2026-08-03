"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BIBLE_BOOKS,
  getNewTestamentBooks,
  getOldTestamentBooks,
  type BibleBook,
} from "@/lib/bible-books";
import { getChapterOptions } from "@/lib/bible-chapters";
import { buildPassageReference } from "@/lib/passage-parser";
import { cn } from "@/lib/utils";

type Testament = "pl" | "pb";

function chapterReference(book: BibleBook, chapter: number) {
  return buildPassageReference({
    bookName: book.name,
    bookAbbr: book.abbr,
    chapter,
    startVerse: 1,
    endVerse: 1,
    wholeChapter: true,
  }).reference;
}

type PassageMultiPickerProps = {
  value: string[];
  onChange: (passages: string[]) => void;
  label?: string;
};

export function PassageMultiPicker({
  value,
  onChange,
  label = "Pasal Alkitab",
}: PassageMultiPickerProps) {
  const [testament, setTestament] = useState<Testament>("pb");
  const books = testament === "pl" ? getOldTestamentBooks() : getNewTestamentBooks();
  const [bookAbbr, setBookAbbr] = useState(books[0]?.abbr ?? "Mat");

  const selectedBook = useMemo(
    () => BIBLE_BOOKS.find((book) => book.abbr === bookAbbr) ?? books[0],
    [bookAbbr, books],
  );

  const chapters = useMemo(
    () => getChapterOptions(selectedBook.abbr),
    [selectedBook.abbr],
  );

  function handleTestamentChange(next: string) {
    const value = next as Testament;
    setTestament(value);
    const nextBooks =
      value === "pl" ? getOldTestamentBooks() : getNewTestamentBooks();
    setBookAbbr(nextBooks[0]?.abbr ?? "Mat");
  }

  function toggleChapter(chapter: number) {
    const reference = chapterReference(selectedBook, chapter);
    if (value.includes(reference)) {
      onChange(value.filter((item) => item !== reference));
      return;
    }
    onChange([...value, reference]);
  }

  function removePassage(reference: string) {
    onChange(value.filter((item) => item !== reference));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        <span className="text-[11px] text-[var(--a-ink-soft)]">
          {value.length === 0
            ? "Belum dipilih"
            : `${value.length} pasal dipilih`}
        </span>
      </div>

      {value.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {value.map((passage) => (
            <Badge
              key={passage}
              variant="secondary"
              className="gap-1 rounded-lg bg-[var(--a-wash)] px-2 py-1 text-xs font-semibold text-[var(--a-ink)]"
            >
              {passage}
              <button
                type="button"
                aria-label={`Hapus ${passage}`}
                className="rounded-sm text-[var(--a-ink-soft)] hover:text-[var(--a-ink)]"
                onClick={() => removePassage(passage)}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}

      <Tabs value={testament} onValueChange={handleTestamentChange}>
        <TabsList className="grid h-9 w-full grid-cols-2 rounded-lg bg-[var(--a-wash)] p-1">
          <TabsTrigger value="pl" className="rounded-md text-xs">
            Perjanjian Lama
          </TabsTrigger>
          <TabsTrigger value="pb" className="rounded-md text-xs">
            Perjanjian Baru
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Select
        value={bookAbbr}
        onValueChange={(next) => setBookAbbr(next)}
      >
        <SelectTrigger className="h-11 w-full rounded-xl">
          <SelectValue placeholder="Pilih kitab" />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {books.map((book) => (
            <SelectItem key={book.abbr} value={book.abbr}>
              {book.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="max-h-40 overflow-y-auto rounded-xl border border-[var(--a-line)] bg-white p-2">
        <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
          {chapters.map((chapter) => {
            const reference = chapterReference(selectedBook, chapter);
            const selected = value.includes(reference);
            return (
              <button
                key={chapter}
                type="button"
                onClick={() => toggleChapter(chapter)}
                className={cn(
                  "flex h-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
                  selected
                    ? "bg-[var(--a-accent)] text-white"
                    : "bg-[var(--a-wash)] text-[var(--a-ink)] hover:bg-[var(--a-wash)]/80",
                )}
              >
                {chapter}
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-[11px] text-[var(--a-ink-soft)]">
        Pilih kitab, lalu ketuk pasal. Bisa lebih dari satu.
      </p>
    </div>
  );
}
