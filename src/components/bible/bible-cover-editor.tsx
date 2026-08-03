"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Palette, Type } from "lucide-react";

import { BibleCoverSheet } from "@/components/bible/bible-cover-sheet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/ui/toast-host";
import {
  BIBLE_COVER_COLORS,
  BIBLE_COVER_IMAGES,
  DEFAULT_BIBLE_COVER,
  fileToCoverDataUrl,
  writeBibleCover,
  type BibleCoverPrefs,
} from "@/lib/bible-cover";
import { cn } from "@/lib/utils";

type BibleCoverEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: BibleCoverPrefs;
};

export function BibleCoverEditor({
  open,
  onOpenChange,
  value,
}: BibleCoverEditorProps) {
  const [draft, setDraft] = useState<BibleCoverPrefs>(value);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  function update(partial: Partial<BibleCoverPrefs>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Pilih file gambar");
      return;
    }
    try {
      const dataUrl = await fileToCoverDataUrl(file);
      update({ imageId: "custom", customImageDataUrl: dataUrl });
    } catch {
      showToast("Gagal memuat gambar");
    }
  }

  function handleSave() {
    writeBibleCover(draft);
    onOpenChange(false);
    showToast("Cover Alkitab disimpan");
  }

  function handleReset() {
    setDraft({ ...DEFAULT_BIBLE_COVER });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(92dvh,40rem)] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-lg"
        showCloseButton
      >
        <DialogHeader className="space-y-1 border-b border-[var(--m-line)] px-5 py-4 pr-12 text-left">
          <DialogTitle className="text-base font-semibold text-[var(--m-ink)]">
            Custom cover Alkitab
          </DialogTitle>
          <DialogDescription className="text-sm text-[var(--m-ink-soft)]">
            Pilih warna kulit, tulisan, dan gambar — biar semangat tiap buka.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[min(70dvh,32rem)] space-y-5 overflow-y-auto px-5 py-4">
          <div className="mx-auto h-52 w-36 overflow-hidden rounded-lg shadow-lg sm:h-56 sm:w-40">
            <BibleCoverSheet prefs={draft} footerHint="Pratinjau" />
          </div>

          <section className="space-y-2">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-[var(--m-ink-soft)] uppercase">
              <Palette className="size-3.5" />
              Warna kulit
            </p>
            <div className="flex flex-wrap gap-2">
              {BIBLE_COVER_COLORS.map((color) => {
                const active = draft.colorId === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    title={color.label}
                    aria-label={color.label}
                    onClick={() => update({ colorId: color.id })}
                    className={cn(
                      "size-9 rounded-full ring-2 ring-offset-2 transition",
                      active
                        ? "ring-[var(--m-accent)]"
                        : "ring-transparent hover:ring-[var(--m-line)]",
                    )}
                    style={{ background: color.base }}
                  />
                );
              })}
            </div>
          </section>

          <section className="space-y-2">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-[var(--m-ink-soft)] uppercase">
              <Type className="size-3.5" />
              Tulisan
            </p>
            <Input
              value={draft.title}
              maxLength={48}
              placeholder="Judul cover"
              onChange={(event) => update({ title: event.target.value })}
              className="h-10 rounded-xl"
            />
            <Input
              value={draft.subtitle}
              maxLength={80}
              placeholder="Subtitle / ayat favorit"
              onChange={(event) => update({ subtitle: event.target.value })}
              className="h-10 rounded-xl"
            />
          </section>

          <section className="space-y-2">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-[var(--m-ink-soft)] uppercase">
              <ImagePlus className="size-3.5" />
              Gambar
            </p>
            <div className="flex flex-wrap gap-1.5">
              {BIBLE_COVER_IMAGES.map((image) => {
                const active = draft.imageId === image.id;
                return (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => update({ imageId: image.id })}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                      active
                        ? "bg-[var(--m-accent)] text-white"
                        : "bg-[var(--m-wash)] text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
                    )}
                  >
                    {image.label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  draft.imageId === "custom"
                    ? "bg-[var(--m-accent)] text-white"
                    : "bg-[var(--m-wash)] text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
                )}
              >
                Upload foto
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  void handleFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </div>
          </section>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--m-line)] px-5 py-3.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-xl"
            onClick={handleReset}
          >
            Reset
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              className="h-10 rounded-xl"
              onClick={handleSave}
            >
              Simpan cover
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
