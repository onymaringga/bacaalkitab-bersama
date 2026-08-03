"use client";

import { useMemo } from "react";
import { ArrowUpRight, BookOpenText, Globe2, Search } from "lucide-react";

import { getDevotionalStudyResources } from "@/lib/devotional-study-links";
import { cn } from "@/lib/utils";

type DevotionalStudyLinksProps = {
  passage: string;
  className?: string;
};

const SOURCE_ICON = {
  sabda: BookOpenText,
  "enduring-word": BookOpenText,
  "web-search": Search,
} as const;

export function DevotionalStudyLinks({
  passage,
  className,
}: DevotionalStudyLinksProps) {
  const resources = useMemo(
    () => getDevotionalStudyResources(passage),
    [passage],
  );

  if (resources.length === 0) return null;

  return (
    <section className={cn("space-y-3", className)}>
      <div>
        <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-[var(--m-ink-soft)] uppercase">
          <Globe2 className="size-3.5" />
          Belajar lebih dalam
        </p>
        <p className="mt-1 text-sm text-[var(--m-ink-soft)]">
          3 sumber di internet untuk memperdalam renungan pasal ini.
        </p>
      </div>

      <ul className="space-y-2">
        {resources.map((item, index) => {
          const Icon =
            SOURCE_ICON[item.id as keyof typeof SOURCE_ICON] ?? Globe2;
          return (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex items-start gap-3 rounded-2xl border border-[var(--m-line)] bg-white px-3.5 py-3",
                  "transition-colors hover:border-[var(--m-accent)]/40 hover:bg-[var(--m-wash)]/50",
                )}
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--m-wash)] text-[var(--m-accent)]">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                      {index + 1}. {item.source}
                    </span>
                    <span className="rounded-md bg-[var(--m-wash)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--m-accent)] uppercase">
                      {item.lang === "id" ? "ID" : "EN"}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-[var(--m-ink-soft)]">
                    {item.description}
                  </span>
                </span>
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-[var(--m-ink-soft)] transition group-hover:text-[var(--m-accent)]" />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
