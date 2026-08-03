"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, MapPinned } from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";
import {
  getPlaceKind,
  getPlaceRegion,
  placeEraLabel,
  placeStoryHref,
  type BiblePlace,
} from "@/lib/bible-places";
import { cn } from "@/lib/utils";

type PlaceDetailViewProps = {
  place: BiblePlace;
};

export function PlaceDetailView({ place }: PlaceDetailViewProps) {
  const region = getPlaceRegion(place.region);
  const kind = getPlaceKind(place.kind);
  const plStories = place.stories.filter((story) => story.era === "pl");
  const pbStories = place.stories.filter((story) => story.era === "pb");

  return (
    <div className="member-web-animate-in mx-auto w-full max-w-3xl space-y-6 pb-2">
      <header className="space-y-3">
        <HistoryBackButton
          fallbackHref="/baca/peta"
          label={copy.places.backToList}
          size="sm"
          variant="ghost"
          className="-ml-2 h-9 px-2 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
        />
        <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/90 px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="member-web-kicker text-[var(--m-accent)]">
              {kind.label}
            </p>
            <span className="rounded-md bg-[var(--m-wash)] px-2 py-0.5 text-[10px] font-semibold text-[var(--m-ink-soft)]">
              {region.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-[var(--m-wash)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
              <MapPinned className="size-3" />
              {place.stories.length} kisah
            </span>
          </div>
          <h1 className="member-web-display mt-1.5 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-[var(--m-ink)]">
            {place.name}
          </h1>
          {place.alsoCalled && place.alsoCalled.length > 0 ? (
            <p className="mt-2 text-sm text-[var(--m-ink-soft)]">
              Juga disebut:{" "}
              <span className="font-medium text-[var(--m-ink)]">
                {place.alsoCalled.join(" · ")}
              </span>
            </p>
          ) : null}
          <p className="mt-3 text-base leading-relaxed text-[var(--m-ink)]">
            {place.blurb}
          </p>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--m-ink)]">
          {copy.places.storiesTitle}
        </h2>

        {plStories.length > 0 ? (
          <StoryGroup label={placeEraLabel("pl")} stories={plStories} />
        ) : null}
        {pbStories.length > 0 ? (
          <StoryGroup label={placeEraLabel("pb")} stories={pbStories} />
        ) : null}
      </section>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" className="h-10 rounded-xl font-semibold">
          <Link href="/baca/peta">
            <MapPinned className="size-3.5" />
            {copy.places.backToMap}
          </Link>
        </Button>
      </div>

      <p className="rounded-xl border border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/40 px-4 py-3 text-xs leading-relaxed text-[var(--m-ink-soft)]">
        {copy.places.hint}
      </p>
    </div>
  );
}

function StoryGroup({
  label,
  stories,
}: {
  label: string;
  stories: BiblePlace["stories"];
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--m-ink-soft)] uppercase">
        {label}
      </p>
      <ul className="space-y-2.5">
        {stories.map((story) => (
          <li
            key={`${story.reference}-${story.title}`}
            className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-paper)]/90"
          >
            <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/45 px-4 py-2.5">
              <BookOpen className="size-3.5 shrink-0 text-[var(--m-accent)]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--m-ink)]">
                  {story.title}
                </p>
                <p className="text-[11px] text-[var(--m-ink-soft)]">
                  {story.reference}
                </p>
              </div>
            </div>
            <div className="space-y-3 px-4 py-3.5">
              <p className="text-sm leading-relaxed text-[var(--m-ink)]">
                {story.summary}
              </p>
              <Button
                asChild
                size="sm"
                className={cn("h-9 rounded-xl font-semibold")}
              >
                <Link href={placeStoryHref(story)}>
                  {copy.places.readInContext}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
