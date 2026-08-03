"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { CHAT_EMOJI_GROUPS } from "@/lib/chat-emoji";
import { isLikelyGifUrl, type ChatGifItem } from "@/lib/chat-gifs";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type ChatEmojiPickerProps = {
  onPick: (emoji: string) => void;
  className?: string;
};

export function ChatEmojiPicker({ onPick, className }: ChatEmojiPickerProps) {
  return (
    <div
      className={cn(
        "max-h-56 overflow-y-auto rounded-xl border border-[var(--m-line)] bg-white p-2.5 shadow-[var(--shadow-float)]",
        className,
      )}
    >
      {CHAT_EMOJI_GROUPS.map((group) => (
        <div key={group.label} className="mb-2 last:mb-0">
          <p className="mb-1 px-1 text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
            {group.label}
          </p>
          <div className="grid grid-cols-8 gap-0.5">
            {group.emojis.map((emoji) => (
              <button
                key={`${group.label}-${emoji}`}
                type="button"
                className="flex size-9 items-center justify-center rounded-lg text-lg transition hover:bg-[var(--m-wash)]"
                onMouseDown={(event) => {
                  event.preventDefault();
                  onPick(emoji);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

type ChatGifPickerProps = {
  onPick: (gif: ChatGifItem) => void;
  className?: string;
};

export function ChatGifPicker({ onPick, className }: ChatGifPickerProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<ChatGifItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("curated");

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/chat/gifs?q=${encodeURIComponent(query.trim())}&limit=24`,
          { signal: controller.signal },
        );
        const payload = (await response.json()) as {
          items?: ChatGifItem[];
          source?: string;
        };
        setItems(payload.items ?? []);
        setSource(payload.source ?? "curated");
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, query ? 280 : 0);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  function handleSubmitUrl() {
    const value = query.trim();
    if (!isLikelyGifUrl(value)) return;
    onPick({
      id: `url-${Date.now()}`,
      title: "GIF dari tautan",
      url: value,
      preview: value,
      tags: [],
      source: "curated",
    });
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--m-line)] bg-white shadow-[var(--shadow-float)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--m-line)] px-3 py-2">
        <Search className="size-3.5 shrink-0 text-[var(--m-ink-soft)]" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && isLikelyGifUrl(query)) {
              event.preventDefault();
              handleSubmitUrl();
            }
          }}
          placeholder={copy.chat.gifSearchPlaceholder}
          className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
        />
        {isLikelyGifUrl(query) ? (
          <button
            type="button"
            onClick={handleSubmitUrl}
            className="shrink-0 rounded-md bg-[var(--m-accent)] px-2 py-1 text-[11px] font-semibold text-white"
          >
            Pakai
          </button>
        ) : null}
      </div>

      <div className="max-h-52 overflow-y-auto p-2">
        {loading ? (
          <p className="flex items-center justify-center gap-2 py-8 text-sm text-[var(--m-ink-soft)]">
            <Loader2 className="size-4 animate-spin" />
            {copy.chat.gifLoading}
          </p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--m-ink-soft)]">
            {copy.chat.gifEmpty}
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="overflow-hidden rounded-lg border border-[var(--m-line)] bg-[var(--m-wash)]/40 transition hover:border-[var(--m-accent)]/40"
                onMouseDown={(event) => {
                  event.preventDefault();
                  onPick(item);
                }}
                title={item.title}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.preview}
                  alt={item.title}
                  className="aspect-square h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="border-t border-[var(--m-line)] px-3 py-1.5 text-[10px] text-[var(--m-ink-soft)]">
        {copy.chat.gifSourceHint}
        {source !== "curated" ? ` · ${source}` : " · katalog lokal"}
      </p>
    </div>
  );
}

type GifPreviewChipProps = {
  url: string;
  onRemove: () => void;
};

export function ChatGifPreviewChip({ url, onRemove }: GifPreviewChipProps) {
  return (
    <div className="relative mb-2 inline-flex max-w-[11rem] overflow-hidden rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={copy.chat.gifPreview}
        className="max-h-28 w-full object-cover"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 inline-flex size-6 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/70"
        aria-label={copy.chat.gifRemove}
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
