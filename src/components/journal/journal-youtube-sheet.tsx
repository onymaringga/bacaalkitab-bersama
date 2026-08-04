"use client";

import { useEffect, useState } from "react";
import { Loader2, Music2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { copy } from "@/lib/copy";
import { parseYouTubeVideoId, youtubeThumbnailUrl } from "@/lib/youtube-utils";
import { youtubeWatchUrl } from "@/lib/worship-tracks";

type JournalYoutubeSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAttach: (payload: { videoId: string; title: string }) => void;
};

export function JournalYoutubeSheet({
  open,
  onOpenChange,
  onAttach,
}: JournalYoutubeSheetProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setUrl("");
    setTitle("");
    setError("");
  }, [open]);

  const videoId = parseYouTubeVideoId(url);

  function handleAttach() {
    const id = parseYouTubeVideoId(url);
    if (!id) {
      setError(copy.journal.youtubeInvalid);
      return;
    }
    setSubmitting(true);
    onAttach({ videoId: id, title: title.trim() });
    setSubmitting(false);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="left-1/2 right-auto w-[min(calc(100vw-1.5rem),28rem)] -translate-x-1/2 max-h-[min(80dvh,28rem)] overflow-y-auto rounded-t-[1.35rem] border-[var(--m-line)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <SheetHeader className="px-0 text-left">
          <SheetTitle className="member-web-display flex items-center gap-2 text-lg">
            <Music2 className="size-5 text-[var(--m-accent)]" />
            {copy.journal.youtubeSheetTitle}
          </SheetTitle>
          <SheetDescription>{copy.journal.youtubeSheetHint}</SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="journal-youtube-url">{copy.journal.youtubeUrlLabel}</Label>
            <Input
              id="journal-youtube-url"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                setError("");
              }}
              placeholder={copy.journal.youtubeUrlPlaceholder}
              className="rounded-xl"
            />
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="journal-youtube-title">{copy.journal.youtubeTitleLabel}</Label>
            <Input
              id="journal-youtube-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={copy.journal.youtubeTitlePlaceholder}
              className="rounded-xl"
            />
          </div>

          {videoId ? (
            <div className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-wash)]/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={youtubeThumbnailUrl(videoId)}
                alt=""
                className="aspect-video w-full object-cover"
              />
              <div className="px-3 py-2 text-xs text-[var(--m-ink-soft)]">
                {title.trim() || copy.journal.youtubeUntitled} ·{" "}
                <a
                  href={youtubeWatchUrl(videoId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--m-accent)] hover:underline"
                >
                  YouTube
                </a>
              </div>
            </div>
          ) : null}

          <Button
            type="button"
            className="w-full rounded-xl"
            disabled={!videoId || submitting}
            onClick={handleAttach}
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {copy.journal.youtubeAttach}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
