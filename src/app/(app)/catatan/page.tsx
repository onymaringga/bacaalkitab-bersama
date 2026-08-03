"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen, Sparkles } from "lucide-react";

import { GroupReflectionChat } from "@/components/notes/group-reflection-chat";
import { HistoryBackButton } from "@/components/ui/history-back-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { copy } from "@/lib/copy";
import { demoNotes, demoSchedule, demoTodayReading } from "@/lib/demo-data";
import { formatShortDate } from "@/lib/format-date";
import { getTodayKey } from "@/lib/reading-status";
import { resolveScheduleReading } from "@/lib/schedule-devotional";

function CatatanContent() {
  const searchParams = useSearchParams();
  const passage = searchParams.get("passage") ?? demoTodayReading.passage;

  const scheduleItem = useMemo(() => {
    const todayKey = getTodayKey();
    const byPassage =
      demoSchedule.find((item) => item.passage === passage) ??
      demoSchedule.find((item) => item.scheduledDate === todayKey) ??
      demoTodayReading;
    return resolveScheduleReading(byPassage);
  }, [passage]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 lg:space-y-5">
      <header className="flex items-center gap-1">
        <HistoryBackButton
          fallbackHref="/baca"
          className="size-9 shrink-0 rounded-lg"
        />
        <div>
          <h1 className="text-lg font-bold text-[var(--m-ink)] lg:text-xl">
            Refleksi
          </h1>
          <p className="text-xs text-[var(--m-ink-soft)]">
            Renungan & chat kelompok — refleksi langsung masuk ke percakapan
          </p>
        </div>
      </header>

      <Card className="overflow-hidden border-[var(--m-line)] shadow-[var(--shadow-soft)] lg:shadow-none">
        <CardContent className="flex items-center gap-3 py-3.5">
          <div
            className="h-12 w-12 shrink-0 rounded-xl bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=120&h=120&fit=crop)",
            }}
            aria-hidden
          />
          <div className="min-w-0">
            <p className="text-xs text-[var(--m-ink-soft)]">Bacaan</p>
            <p className="truncate font-bold text-[var(--m-ink)]">{passage}</p>
            <p className="truncate text-xs text-[var(--m-ink-soft)]">
              {scheduleItem.title}
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
        <div className="border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-4 py-3.5 lg:px-5">
          <h2 className="flex items-center gap-2 font-semibold text-[var(--m-ink)]">
            <Sparkles className="size-4 text-[var(--m-accent)]" />
            Renungan bacaan
          </h2>
        </div>
        <div className="space-y-3 px-4 py-4 lg:px-5">
          <div className="flex items-start gap-2.5">
            <BookOpen className="mt-0.5 size-4 shrink-0 text-[var(--m-accent)]" />
            <p className="text-sm leading-relaxed text-[var(--m-ink)]">
              {scheduleItem.devotional}
            </p>
          </div>
          {scheduleItem.reflectionPrompt ? (
            <div className="rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/40 px-3.5 py-3">
              <p className="text-xs font-semibold text-[var(--m-accent)]">
                Pertanyaan renungan
              </p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--m-ink)]">
                {scheduleItem.reflectionPrompt}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <GroupReflectionChat
        passage={passage}
        showComposer
        allowReflectionCompose
        composerDefault="reflection"
      />

      {demoNotes.length > 0 ? (
        <div className="space-y-2">
          <p className="px-0.5 text-sm font-semibold text-[var(--m-ink)]">
            {copy.notes.history}
          </p>
          {demoNotes.map((note) => (
            <Card
              key={note.id}
              className="border-[var(--m-line)] shadow-[var(--shadow-soft)] lg:shadow-none"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{note.passage}</CardTitle>
                <p className="text-xs text-[var(--m-ink-soft)]">
                  {copy.notes.updated(formatShortDate(note.updatedAt))}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-line text-[var(--m-ink-soft)]">
                  {note.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function CatatanPage() {
  return (
    <Suspense fallback={null}>
      <CatatanContent />
    </Suspense>
  );
}
