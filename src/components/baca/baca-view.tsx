"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { BibleBrowser } from "@/components/bible/bible-browser";
import {
  BookmarksButton,
  BookmarksModal,
} from "@/components/bible/bookmarks-modal";
import { DownloadBibleBooks } from "@/components/bible/download-bible-books";
import { HistoryBackButton } from "@/components/ui/history-back-button";
import { copy } from "@/lib/copy";
import { readLastOpenedPassage } from "@/lib/bible-opened-chapters";
import { demoTodayReading } from "@/lib/demo-data";
import { resolveScheduleReading } from "@/lib/schedule-devotional";

function BacaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passage = searchParams.get("passage");
  const browseMode = searchParams.get("browse") === "1";
  const scheduleDate = searchParams.get("date");
  const [resolving, setResolving] = useState(!passage);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);

  useEffect(() => {
    setResolving(!passage);
    if (passage) return;

    const last = readLastOpenedPassage();
    const today = resolveScheduleReading(demoTodayReading);
    const target =
      last ||
      (today.passage !== "Belum dijadwalkan" ? today.passage : null) ||
      "Matius 1";

    const params = new URLSearchParams();
    params.set("passage", target);
    if (!scheduleDate) {
      params.set("browse", "1");
    } else {
      params.set("date", scheduleDate);
    }
    router.replace(`/baca?${params.toString()}`);
  }, [passage, scheduleDate, router]);

  function openPassageFromBookmark(passageLabel: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("passage", passageLabel);
    if (!params.get("browse") && !params.get("date")) {
      params.set("browse", "1");
    }
    router.replace(`/baca?${params.toString()}`, { scroll: false });
  }

  if (resolving || !passage) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {copy.bible.openFromLink}
      </p>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-7">
      <header className="member-web-animate-in flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <HistoryBackButton
            fallbackHref="/dashboard"
            className="size-9 shrink-0 rounded-xl [&_svg]:size-4"
          />
          <div className="min-w-0 hidden sm:block">
            <p className="member-web-kicker text-[var(--m-accent)]">
              {copy.bible.eyebrow}
            </p>
            <h1 className="text-base font-semibold tracking-tight text-[var(--m-ink-soft)] lg:text-lg">
              {browseMode ? copy.bible.title : copy.read.title}
            </h1>
          </div>
        </div>
        <div className="flex max-w-full shrink-0 items-center gap-1.5 overflow-x-auto pb-0.5 sm:gap-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <DownloadBibleBooks triggerClassName="hidden sm:inline-flex" />
          <BookmarksButton
            className="h-9 shrink-0 rounded-xl border-[var(--m-line)] font-semibold"
            onClick={() => setBookmarksOpen(true)}
          />
        </div>
      </header>

      <Suspense
        fallback={
          <p className="py-8 text-center text-sm text-muted-foreground">
            {copy.bible.openFromLink}
          </p>
        }
      >
        <BibleBrowser browseMode={browseMode} />
      </Suspense>
      <BookmarksModal
        open={bookmarksOpen}
        onOpenChange={setBookmarksOpen}
        onOpenPassage={openPassageFromBookmark}
      />
    </div>
  );
}

export function BacaView() {
  return (
    <Suspense
      fallback={
        <p className="py-8 text-center text-sm text-muted-foreground">
          {copy.bible.openFromLink}
        </p>
      }
    >
      <BacaContent />
    </Suspense>
  );
}
