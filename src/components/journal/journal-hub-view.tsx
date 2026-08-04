"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { BookHeart, CalendarDays, Plus, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";
import { getMoodEmoji } from "@/lib/journal-constants";
import {
  createJournalPage,
  getJournalPreviewText,
  getServerJournalPages,
  listJournalPages,
  migrateJournalPage,
  subscribeJournalPages,
  type JournalPage,
} from "@/lib/journal-entries";
import { createJournalPageFromSchedule } from "@/lib/journal-verse-utils";
import { getScheduledReadingForDate } from "@/lib/reading-progress";
import { getTodayKey } from "@/lib/reading-status";
import { showToast } from "@/components/ui/toast-host";
import { cn } from "@/lib/utils";

function useJournalPages() {
  return useSyncExternalStore(
    subscribeJournalPages,
    listJournalPages,
    getServerJournalPages,
  );
}

function renderMiniElements(
  canvasElements: ReturnType<typeof migrateJournalPage>["sheets"][number]["elements"],
) {
  return canvasElements.map((el) => {
    if (el.type === "sticker") {
      return (
        <span
          key={el.id}
          className="pointer-events-none absolute text-lg leading-none"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            transform: `rotate(${el.rotation}deg)`,
          }}
        >
          {el.emoji}
        </span>
      );
    }
    if (el.type === "image" && el.src) {
      return (
        <div
          key={el.id}
          className="pointer-events-none absolute overflow-hidden rounded border border-white/70"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            width: `${el.width}%`,
            height: `${el.height}%`,
            transform: `rotate(${el.rotation}deg)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={el.src} alt="" className="h-full w-full object-cover" />
        </div>
      );
    }
    if (el.type === "youtube" && el.youtubeId) {
      return (
        <div
          key={el.id}
          className="pointer-events-none absolute flex items-center justify-center overflow-hidden rounded border border-white/70 bg-black/80 text-lg"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            width: `${el.width}%`,
            height: `${el.height}%`,
            transform: `rotate(${el.rotation}deg)`,
          }}
        >
          ▶
        </div>
      );
    }
    return null;
  });
}

function JournalPageCard({ page }: { page: JournalPage }) {
  const normalized = migrateJournalPage(page);
  const previewSheets = normalized.sheets.slice(0, 2);
  const preview = getJournalPreviewText(page) || copy.journal.emptyPagePreview;
  const dateLabel = format(new Date(page.updatedAt), "d MMM yyyy", { locale: idLocale });

  return (
    <Link href={`/jurnal/${page.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-[2px_2px_0_rgba(0,0,0,0.06),4px_4px_16px_rgba(0,0,0,0.08)] transition group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0_rgba(0,0,0,0.08),8px_8px_24px_rgba(0,0,0,0.12)]">
        <div className="absolute inset-0 flex">
          {previewSheets.map((sheet) => (
            <div
              key={sheet.id}
              className="relative flex-1 overflow-hidden"
              style={{ backgroundColor: page.backgroundColor }}
            >
              {renderMiniElements(sheet.elements)}
            </div>
          ))}
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/10"
            aria-hidden
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3 pt-10">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-2 text-base font-semibold text-white sm:text-lg">
              {page.title || copy.journal.untitledPage}
            </p>
            <span className="text-lg">{getMoodEmoji(page.mood)}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-white/85">
            {preview}
          </p>
          <p className="mt-1.5 text-[10px] font-medium text-white/70">{dateLabel}</p>
        </div>
      </div>
    </Link>
  );
}

export function JournalHubView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pages = useJournalPages();
  const dateParamHandled = useRef(false);

  useEffect(() => {
    if (dateParamHandled.current) return;
    const dateKey = searchParams.get("date");
    if (!dateKey) return;
    dateParamHandled.current = true;

    const reading = getScheduledReadingForDate(dateKey);
    if (!reading || reading.passage === "Belum dijadwalkan") {
      showToast(copy.journal.noReadingForDate);
      router.replace("/jurnal");
      return;
    }

    const page = createJournalPageFromSchedule(reading);
    router.replace(`/jurnal/${page.id}`);
  }, [router, searchParams]);

  function handleNewPage() {
    const page = createJournalPage();
    router.push(`/jurnal/${page.id}`);
  }

  function handleNewFromSchedule() {
    const reading = getScheduledReadingForDate(getTodayKey());
    if (!reading) {
      showToast(copy.journal.verseScheduleEmpty);
      return;
    }
    const page = createJournalPageFromSchedule(reading);
    router.push(`/jurnal/${page.id}`);
  }

  return (
    <div className="member-web-animate-in mx-auto w-full max-w-4xl space-y-6 pb-8">
      <header className="overflow-hidden rounded-3xl border border-[var(--m-line)] bg-gradient-to-br from-[#fff7ed] via-white to-[#fdf4ff] px-5 py-6 sm:px-7">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--m-accent)]/10 text-[var(--m-accent)]">
            <BookHeart className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="member-web-kicker text-[var(--m-accent)]">
              {copy.journal.eyebrow}
            </p>
            <h1 className="member-web-display mt-1 text-[clamp(1.75rem,3vw,2.35rem)] leading-[1.1] text-[var(--m-ink)]">
              {copy.journal.title}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--m-ink-soft)]">
              {copy.journal.subtitle}
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button type="button" onClick={handleNewPage} className="h-10 rounded-xl font-semibold">
            <Plus className="size-4" />
            {copy.journal.newPage}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleNewFromSchedule}
            className="h-10 rounded-xl font-semibold"
          >
            <CalendarDays className="size-4" />
            {copy.journal.newFromSchedule}
          </Button>
        </div>
      </header>

      {pages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--m-line)] bg-white/60 px-6 py-14 text-center">
          <Sparkles className="mx-auto size-8 text-[var(--m-accent)]/70" />
          <p className="mt-3 text-sm font-medium text-[var(--m-ink)]">
            {copy.journal.emptyTitle}
          </p>
          <p className="mt-1 text-sm text-[var(--m-ink-soft)]">
            {copy.journal.emptyHint}
          </p>
          <Button
            type="button"
            onClick={handleNewPage}
            variant="outline"
            className="mt-5 rounded-xl"
          >
            <Plus className="size-4" />
            {copy.journal.newPage}
          </Button>
        </div>
      ) : (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2 px-0.5">
            <h2 className="text-sm font-semibold text-[var(--m-ink)]">
              {copy.journal.myPages}
            </h2>
            <span className="text-xs tabular-nums text-[var(--m-ink-soft)]">
              {copy.journal.pageCount(pages.length)}
            </span>
          </div>
          <div
            className={cn(
              "grid gap-4",
              "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
            )}
          >
            {pages.map((page) => (
              <JournalPageCard key={page.id} page={page} />
            ))}
            <button
              type="button"
              onClick={handleNewPage}
              className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/40 text-[var(--m-ink-soft)] transition hover:border-[var(--m-accent)]/40 hover:text-[var(--m-accent)]"
            >
              <Plus className="size-8 opacity-50" />
              <span className="text-xs font-medium">{copy.journal.newPage}</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
