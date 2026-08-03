"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, RefreshCw, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TitleWithHint } from "@/components/ui/title-with-hint";
import { DevotionalStudyLinks } from "@/components/bible/devotional-study-links";
import type { DevotionalContent } from "@/lib/devotional-generator";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type DevotionalPanelProps = {
  passage: string;
  className?: string;
  /** Tanpa kartu luar — dipakai di dalam tab Baca Alkitab. */
  embedded?: boolean;
  /**
   * Saat di-set, hanya tampilkan section ini.
   * Tanpa section: renungan + ayat kunci + pertanyaan digabung dalam satu scroll.
   */
  section?: DevotionalTab;
};

type DevotionalResponse = DevotionalContent & {
  passage: string;
  error?: string;
};

export type DevotionalTab = "body" | "verse" | "questions";

export function DevotionalPanel({
  passage,
  className,
  embedded = false,
  section,
}: DevotionalPanelProps) {
  const [data, setData] = useState<DevotionalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controlled = Boolean(section);

  const loadDevotional = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/bible/devotional?passage=${encodeURIComponent(passage)}`,
      );
      const payload = (await response.json()) as
        | DevotionalResponse
        | { error: string };

      if (!response.ok) {
        const message =
          payload &&
          typeof payload === "object" &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "Gagal memuat renungan.";
        throw new Error(message);
      }

      if (!payload || typeof payload !== "object" || !("title" in payload)) {
        throw new Error("Gagal memuat renungan.");
      }

      setData(payload as DevotionalResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat renungan.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [passage]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (cancelled) return;
      await loadDevotional();
    })();
    return () => {
      cancelled = true;
    };
  }, [loadDevotional]);

  function renderSection(which: DevotionalTab) {
    if (!data) return null;

    if (which === "body") {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold leading-snug">{data.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {data.opening}
            </p>
          </div>
          <p className="text-sm leading-7 whitespace-pre-line">{data.body}</p>
          {data.prayer ? (
            <div className="rounded-xl border border-dashed border-border px-4 py-3">
              <p className="mb-1.5 text-[11px] font-bold tracking-wide text-[var(--m-accent)] uppercase">
                {copy.reading.devotional.prayerLabel}
              </p>
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                {data.prayer}
              </p>
            </div>
          ) : null}
        </div>
      );
    }

    if (which === "verse") {
      return data.keyVerse?.text ? (
        <blockquote className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-4 text-sm leading-relaxed">
          <p className="mb-2 text-xs font-semibold tracking-wide text-primary uppercase">
            {copy.reading.devotional.keyVerseLabel}
            {data.keyVerse.reference
              ? ` · ${data.keyVerse.reference}`
              : null}
          </p>
          <p className="text-base leading-relaxed text-[var(--m-ink)]">
            {data.keyVerse.text}
          </p>
        </blockquote>
      ) : (
        <p className="rounded-xl border border-dashed border-[var(--m-line)] px-4 py-6 text-center text-sm text-muted-foreground">
          Belum ada ayat kunci untuk pasal ini.
        </p>
      );
    }

    return data.reflectionQuestions?.length > 0 ? (
      <div className="rounded-xl bg-muted/60 p-4">
        <p className="text-sm font-medium">
          {copy.reading.devotional.questionsTitle}
        </p>
        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
          {data.reflectionQuestions.map((question, index) => (
            <li key={question} className="flex gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
                {index + 1}
              </span>
              <span>{question}</span>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <p className="rounded-xl border border-dashed border-[var(--m-line)] px-4 py-6 text-center text-sm text-muted-foreground">
        Belum ada pertanyaan renungan.
      </p>
    );
  }

  const body = (
    <div className="space-y-4">
      {embedded && !controlled ? (
        <div className="flex justify-end">
          <Badge variant="secondary" className="shrink-0 gap-1">
            <Sparkles className="size-3" />
            {copy.reading.devotional.badge}
          </Badge>
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-3">
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-24 w-full animate-pulse rounded-xl bg-muted" />
        </div>
      ) : null}

      {!loading && error ? (
        <div className="space-y-3 text-sm">
          <p className="text-destructive">{error}</p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={loadDevotional}
          >
            <RefreshCw className="size-3.5" />
            {copy.reading.devotional.retry}
          </Button>
        </div>
      ) : null}

      {!loading && data && controlled ? renderSection(section!) : null}

      {!loading && data && !controlled ? (
        <div className="space-y-5">
          {renderSection("body")}
          {renderSection("verse")}
          {renderSection("questions")}
        </div>
      ) : null}

      {(!controlled || section === "body") && !loading ? (
        <div
          className={cn(
            (data || error) && "mt-5 border-t border-[var(--m-line)]/70 pt-5",
          )}
        >
          <DevotionalStudyLinks passage={passage} />
        </div>
      ) : null}
    </div>
  );

  if (embedded) {
    return <div className={className}>{body}</div>;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="size-4 text-primary" />
              <TitleWithHint
                title={copy.reading.devotional.title}
                hint={copy.reading.devotional.description}
              />
            </CardTitle>
          </div>
          <Badge variant="secondary" className="shrink-0 gap-1">
            <Sparkles className="size-3" />
            {copy.reading.devotional.badge}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
}
