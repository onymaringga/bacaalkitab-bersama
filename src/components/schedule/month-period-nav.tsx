"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatMonthLabel, parseMonthKey } from "@/lib/calendar-utils";

export type MonthOption = { key: string; label: string };

type MonthPeriodNavProps = {
  value: string;
  options: MonthOption[];
  onChange: (monthKey: string) => void;
  className?: string;
};

export function MonthPeriodNav({
  value,
  options,
  onChange,
  className,
}: MonthPeriodNavProps) {
  const monthIndex = options.findIndex((option) => option.key === value);
  const canGoPrev = monthIndex > 0;
  const canGoNext = monthIndex >= 0 && monthIndex < options.length - 1;
  const month = parseMonthKey(value);

  return (
    <div
      className={
        className ??
        "mx-auto flex w-full max-w-[17.5rem] items-center gap-1 rounded-2xl border border-[var(--m-line)] bg-[var(--m-wash)]/40 p-1 sm:max-w-[18.5rem]"
      }
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-9 shrink-0 rounded-xl text-[var(--m-ink)] hover:bg-white"
        disabled={!canGoPrev}
        onClick={() => {
          if (!canGoPrev) return;
          onChange(options[monthIndex - 1].key);
        }}
        aria-label="Bulan sebelumnya"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          aria-label="Pilih periode bulan"
          className="h-9 min-w-0 flex-1 justify-center gap-1.5 rounded-xl border-0 bg-white px-2.5 font-semibold capitalize shadow-sm text-[var(--m-ink)] hover:bg-white focus-visible:ring-2 focus-visible:ring-[var(--m-accent)]/25"
        >
          <SelectValue placeholder="Pilih bulan">
            {formatMonthLabel(month)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {options.map((option) => (
            <SelectItem
              key={option.key}
              value={option.key}
              className="capitalize"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-9 shrink-0 rounded-xl text-[var(--m-ink)] hover:bg-white"
        disabled={!canGoNext}
        onClick={() => {
          if (!canGoNext) return;
          onChange(options[monthIndex + 1].key);
        }}
        aria-label="Bulan berikutnya"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
