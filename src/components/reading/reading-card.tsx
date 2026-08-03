"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, Circle } from "lucide-react";

import { MarkReadingCompleteButton } from "@/components/bible/mark-reading-complete";
import { PassageReader } from "@/components/bible/passage-reader";
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
  const bibleHref = `/baca?tab=alkitab&passage=${encodeURIComponent(reading.passage)}&date=${encodeURIComponent(reading.scheduledDate)}`;
  const isHomePreview = preview;
  const canOpenReading =
    reading.passage !== "Belum dijadwalkan" &&
    (featured || allowEarlyRead || isHomePreview);

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

        {canOpenReading ? (
          <div className="space-y-2">
            {isHomePreview && reading.completed ? (
              <>
                <Button
                  asChild
                  size="lg"
                  className="h-11 w-full rounded-lg font-semibold"
                >
                  <Link href={bibleHref}>
                    <BookOpen className="size-4" />
                    {copy.home.readTodayCta}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 w-full rounded-lg font-semibold"
                >
                  <Link
                    href={`/catatan?from=complete&passage=${encodeURIComponent(reading.passage)}`}
                  >
                    {copy.home.writeReflection}
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="h-11 w-full rounded-lg font-semibold"
                >
                  <Link href={bibleHref}>
                    <BookOpen className="size-4" />
                    {isUpcoming && !featured && !isHomePreview
                      ? copy.schedule.readEarly
                      : isHomePreview
                        ? copy.home.continueReading
                        : copy.schedule.openReading}
                  </Link>
                </Button>
                <MarkReadingCompleteButton
                  passage={reading.passage}
                  dateKey={reading.scheduledDate}
                  hideHints={!featured}
                  redirectToChat={false}
                  hideCompletedBanner={embedded}
                />
              </>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
