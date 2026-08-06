"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookHeart, BookOpen, CheckCircle2, Circle, RotateCcw } from "lucide-react";

import { MarkReadingCompleteButton, markReadingIncomplete } from "@/components/bible/mark-reading-complete";
import { PassageReader } from "@/components/bible/passage-reader";
import { PassageRelatedVisual } from "@/components/bible/passage-related-visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReadingTimeLabel } from "@/components/ui/reading-time-label";
import { copy } from "@/lib/copy";
import { formatShortDate } from "@/lib/format-date";
import { createJournalPageFromSchedule } from "@/lib/journal-verse-utils";
import { estimateReadingTimeForPassage } from "@/lib/reading-time";
import type { ReadingSchedule } from "@/lib/types";
import { cn } from "@/lib/utils";

type ReadingCardProps = {
  reading: ReadingSchedule;
  preview?: boolean;
  featured?: boolean;
  /** Izinkan buka bacaan + tandai selesai meski bukan hari ini. */
  allowEarlyRead?: boolean;
  /** Jadwal masih di masa depan — tampilkan label "Baca lebih awal". */
  isUpcoming?: boolean;
  /**
   * Dipakai di dalam dialog yang sudah menampilkan judul/tanggal/pasal.
   * Sembunyikan header & status yang dobel.
   */
  embedded?: boolean;
};

export function ReadingCard({
  reading,
  preview = false,
  featured = false,
  allowEarlyRead = false,
  isUpcoming = false,
  embedded = false,
}: ReadingCardProps) {
  const router = useRouter();
  const bibleHref = `/baca?tab=alkitab&passage=${encodeURIComponent(reading.passage)}&date=${encodeURIComponent(reading.scheduledDate)}`;
  const isHomePreview = preview;
  const canOpenReading =
    reading.passage !== "Belum dijadwalkan" &&
    (featured || allowEarlyRead || isHomePreview);

  function handleWriteJournal() {
    if (reading.passage === "Belum dijadwalkan") return;
    const page = createJournalPageFromSchedule(reading);
    router.push(`/jurnal/${page.id}`);
  }

  return (
    <Card className={cn(embedded && "border-0 bg-transparent shadow-none")}>
      {isHomePreview ? (
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                {copy.home.todayReading}
              </p>
              <CardTitle className="mt-1 text-xl font-bold text-foreground">
                {reading.passage}
              </CardTitle>
              {reading.passage !== "Belum dijadwalkan" ? (
                <ReadingTimeLabel
                  className="mt-1"
                  label={estimateReadingTimeForPassage(reading.passage)}
                />
              ) : null}
              <CardDescription className="mt-0.5 line-clamp-1">
                {reading.title}
              </CardDescription>
            </div>
            {reading.completed ? (
              <CheckCircle2 className="size-6 shrink-0 text-[var(--status-success-text)]" />
            ) : (
              <Circle className="size-6 shrink-0 text-border" />
            )}
          </div>
        </CardHeader>
      ) : null}

      {!isHomePreview && !embedded ? (
        <CardHeader className="gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="rounded-md px-2.5 font-semibold"
              >
                {reading.passage}
              </Badge>
              {reading.passage !== "Belum dijadwalkan" ? (
                <ReadingTimeLabel
                  label={estimateReadingTimeForPassage(reading.passage)}
                />
              ) : null}
            </div>
            {reading.completed ? (
              <CheckCircle2 className="size-5 text-[var(--status-success-text)]" />
            ) : (
              <Circle className="size-5 text-border" />
            )}
          </div>
          <CardTitle className="text-lg font-bold">{reading.title}</CardTitle>
          <CardDescription>
            {formatShortDate(reading.scheduledDate)}
          </CardDescription>
        </CardHeader>
      ) : null}

      <CardContent className={cn("space-y-4", embedded && "p-0")}>
        {!isHomePreview ? (
          <PassageReader
            passage={reading.passage}
            defaultExpanded={false}
            compact
            hideMarkComplete
            hideTitle
            sneakPeek={2}
          />
        ) : (
          <CardDescription>
            {formatShortDate(reading.scheduledDate)}
          </CardDescription>
        )}

        {isHomePreview ? (
          reading.devotional.trim() ? (
            <div className="rounded-lg bg-muted/60 p-3.5">
              <p className="line-clamp-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {reading.devotional}
              </p>
            </div>
          ) : null
        ) : reading.devotional.trim() ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {reading.devotional}
          </p>
        ) : null}

        {reading.reflectionPrompt ? (
          <div className="rounded-lg border border-border p-3.5 text-sm">
            <p className="font-semibold text-foreground">
              {copy.reading.reflectionPrompt}
            </p>
            <p className="mt-1 leading-relaxed text-muted-foreground">
              {reading.reflectionPrompt}
            </p>
          </div>
        ) : null}

        {canOpenReading && reading.passage !== "Belum dijadwalkan" ? (
          <PassageRelatedVisual passage={reading.passage} compact />
        ) : null}

        {canOpenReading ? (
          <ReadingCardActions
            reading={reading}
            bibleHref={bibleHref}
            featured={featured}
            isHomePreview={isHomePreview}
            isUpcoming={isUpcoming}
            onWriteJournal={handleWriteJournal}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

function ReadingCardActions({
  reading,
  bibleHref,
  featured,
  isHomePreview,
  isUpcoming,
  onWriteJournal,
}: {
  reading: ReadingSchedule;
  bibleHref: string;
  featured?: boolean;
  isHomePreview: boolean;
  isUpcoming?: boolean;
  onWriteJournal: () => void;
}) {
  const openReadingLabel =
    isUpcoming && !featured && !isHomePreview
      ? copy.schedule.readEarly
      : isHomePreview
        ? reading.completed
          ? copy.home.readTodayCta
          : copy.home.continueReading
        : copy.schedule.openReading;

  return (
    <div className="space-y-3">
      <Button
        asChild
        size="lg"
        className="h-11 w-full rounded-xl font-semibold shadow-sm"
      >
        <Link href={bibleHref}>
          <BookOpen className="size-4" />
          {openReadingLabel}
        </Link>
      </Button>

      {reading.completed ? (
        <>
          <div className="grid grid-cols-2 gap-2">
            <MarkReadingCompleteButton
              passage={reading.passage}
              dateKey={reading.scheduledDate}
              redirectToChat={false}
              hideCompletedBanner
              hideMarkIncomplete
              actionLayout="button-only"
              className="min-w-0"
            />
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-11 rounded-xl font-semibold"
              onClick={onWriteJournal}
            >
              <BookHeart className="size-4" />
              {copy.journal.writeFromReading}
            </Button>
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() =>
              markReadingIncomplete(reading.scheduledDate, reading.passage)
            }
          >
            <RotateCcw className="size-3.5" />
            {copy.schedule.markIncomplete}
          </button>
        </>
      ) : (
        <>
          <MarkReadingCompleteButton
            passage={reading.passage}
            dateKey={reading.scheduledDate}
            hideHints={!featured}
            redirectToChat={false}
            hideCompletedBanner
            actionLayout="button-only"
            className="w-full"
          />
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1.5 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={onWriteJournal}
          >
            <BookHeart className="size-3.5" />
            {copy.journal.writeFromReading}
          </button>
        </>
      )}
    </div>
  );
}
