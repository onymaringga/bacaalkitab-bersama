"use client";

import Link from "next/link";
import {
  ChevronRight,
  Compass,
  GitBranch,
  Library,
  MapPinned,
  Scroll,
  Users,
} from "lucide-react";

import { copy } from "@/lib/copy";
import { BIBLE_BOOKS } from "@/lib/bible-books";
import { getCharacterCount } from "@/lib/bible-characters";
import { getGenealogyCount } from "@/lib/bible-genealogy";
import { getGlossaryCount } from "@/lib/bible-glossary";
import { getPlaceCount, getStoryCount } from "@/lib/bible-places";
import { getTopicCount } from "@/lib/bible-topics";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    href: "/baca/kitab",
    title: copy.bookIntro.title,
    description: copy.bookIntro.subtitle,
    meta: () => `${BIBLE_BOOKS.length} kitab`,
    icon: Scroll,
    tone: "from-[#f3ebe0] to-[#efe6d8] text-[#7a5c32]",
    iconBg: "bg-[#e8dcc8] text-[#7a5c32]",
    wide: false,
  },
  {
    href: "/baca/topik",
    title: copy.topics.title,
    description: copy.topics.subtitle,
    meta: () => copy.topics.catalogCount(getTopicCount()),
    icon: Compass,
    tone: "from-[#e8f1fb] to-[#e4eef8] text-[#3d5a73]",
    iconBg: "bg-[#d7e6f4] text-[#3d5a73]",
    wide: false,
  },
  {
    href: "/baca/tokoh",
    title: copy.characters.title,
    description: copy.characters.subtitle,
    meta: () => copy.characters.catalogCount(getCharacterCount()),
    icon: Users,
    tone: "from-[#eef3ea] to-[#e7efe3] text-[#4a6741]",
    iconBg: "bg-[#dce8d6] text-[#4a6741]",
    wide: false,
  },
  {
    href: "/baca/glosarium",
    title: copy.glossary.title,
    description: copy.glossary.subtitle,
    meta: () => copy.glossary.catalogCount(getGlossaryCount()),
    icon: Library,
    tone: "from-[#f3eef8] to-[#ebe4f3] text-[#5b4570]",
    iconBg: "bg-[#e4daf0] text-[#5b4570]",
    wide: false,
  },
  {
    href: "/baca/peta",
    title: copy.places.title,
    description: copy.places.subtitle,
    meta: () => copy.places.catalogCount(getPlaceCount(), getStoryCount()),
    icon: MapPinned,
    tone: "from-[#e7f0e8] to-[#e2ebe8] text-[#3f6b55]",
    iconBg: "bg-[#d5e6da] text-[#3f6b55]",
    wide: false,
  },
  {
    href: "/baca/silsilah",
    title: copy.genealogy.title,
    description: copy.genealogy.subtitle,
    meta: () => copy.genealogy.catalogCount(getGenealogyCount()),
    icon: GitBranch,
    tone: "from-[#f8efe8] to-[#f3e8e0] text-[#8a4b2e]",
    iconBg: "bg-[#edd9cc] text-[#8a4b2e]",
    wide: true,
  },
] as const;

/** Hub Explore — pintu masuk sejarah, topik, tokoh, glosarium, dan peta. */
export function ExploreHubView() {
  return (
    <div className="member-web-animate-in mx-auto w-full max-w-3xl space-y-6 pb-2">
      <header className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-gradient-to-br from-[#eef3ea] via-white to-[#e8f0f6] px-5 py-5 sm:px-6 sm:py-6">
        <p className="member-web-kicker text-[var(--m-accent)]">
          {copy.explore.eyebrow}
        </p>
        <h1 className="member-web-display mt-1.5 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-[var(--m-ink)]">
          {copy.explore.title}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--m-ink-soft)]">
          {copy.explore.subtitle}
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <li
              key={section.href}
              className={cn(section.wide && "sm:col-span-2")}
            >
              <Link
                href={section.href}
                className={cn(
                  "group flex h-full items-start gap-3.5 rounded-2xl border border-[var(--m-line)] bg-gradient-to-br p-4 transition hover:border-[var(--m-accent)]/35 hover:shadow-sm sm:p-5",
                  section.tone,
                )}
              >
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl",
                    section.iconBg,
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-base font-semibold text-[var(--m-ink)]">
                      {section.title}
                    </p>
                    <ChevronRight className="mt-0.5 size-4 shrink-0 text-[var(--m-ink-soft)]/50 transition group-hover:translate-x-0.5 group-hover:text-[var(--m-accent)]" />
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--m-ink-soft)]">
                    {section.description}
                  </p>
                  <p className="mt-2.5 text-[11px] font-semibold text-[var(--m-accent)]">
                    {section.meta()}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="rounded-xl border border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/40 px-4 py-3 text-xs leading-relaxed text-[var(--m-ink-soft)]">
        {copy.explore.hint}
      </p>
    </div>
  );
}
