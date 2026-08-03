"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { copy } from "@/lib/copy";
import { getDailyBibleFact } from "@/lib/bible-daily-facts";
import { getTodayKey } from "@/lib/reading-status";
import { cn } from "@/lib/utils";

type DailyBibleFactCardProps = {
  className?: string;
};

/** Satu fakta kisah Alkitab yang berganti setiap hari. */
export function DailyBibleFactCard({ className }: DailyBibleFactCardProps) {
  const fact = getDailyBibleFact(getTodayKey());
  const passageHref = fact.reference
    ? `/baca?browse=1&passage=${encodeURIComponent(fact.reference.split(/[–—-]/)[0]!.trim())}`
    : "/explore";

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--m-line)] bg-gradient-to-br from-[#f3ebe0] via-white to-[#e8f0ea] px-4 py-4 sm:px-5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--m-accent)]/10 text-[var(--m-accent)]">
          <Sparkles className="size-3.5" />
        </span>
        <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
          {copy.home.dailyFactEyebrow}
        </p>
      </div>
      <h2 className="mt-2.5 text-base font-semibold text-[var(--m-ink)]">
        {fact.title}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--m-ink-soft)]">
        {fact.body}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        {fact.reference ? (
          <p className="text-xs font-medium text-[var(--m-accent)]">
            {fact.reference}
          </p>
        ) : null}
        <Link
          href={passageHref}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--m-ink)] transition hover:text-[var(--m-accent)]"
        >
          {copy.home.dailyFactCta}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
