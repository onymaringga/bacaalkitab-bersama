"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast-host";
import { copy } from "@/lib/copy";
import { saveMyReflectionMessage } from "@/lib/group-reflection-chat";
import { cn } from "@/lib/utils";

export type ReflectionVisibility = "private" | "leader" | "group";

type NoteEditorProps = {
  initialContent?: string;
  placeholder?: string;
  showPrompt?: boolean;
  passage?: string;
  onSaved?: (payload: {
    content: string;
    apply: string;
    visibility: ReflectionVisibility;
  }) => void;
};

const MAX_LEN = 1000;

export function NoteEditor({
  initialContent = "",
  showPrompt = true,
  passage,
  onSaved,
}: NoteEditorProps) {
  const [spoke, setSpoke] = useState(initialContent);
  const [apply, setApply] = useState("");
  const [shareToGroup, setShareToGroup] = useState(true);
  const [saved, setSaved] = useState(false);

  const visibility: ReflectionVisibility = shareToGroup ? "group" : "private";

  function handleSave() {
    if (!spoke.trim()) return;
    const content = [spoke.trim(), apply.trim()].filter(Boolean).join("\n\n");
    saveMyReflectionMessage({
      content,
      passage: passage ?? "Bacaan hari ini",
      shareToGroup,
    });
    setSaved(true);
    showToast(
      shareToGroup
        ? "Refleksi tersimpan · chat kelompok terbuka"
        : "Refleksi pribadi tersimpan · chat kelompok terbuka",
    );
    onSaved?.({
      content,
      apply: apply.trim(),
      visibility,
    });
  }

  return (
    <div className="space-y-5">
      {showPrompt ? (
        <div className="space-y-2">
          <Label className="text-sm font-semibold leading-snug text-foreground">
            {copy.notes.prompt}
          </Label>
          <Textarea
            value={spoke}
            onChange={(event) => {
              setSpoke(event.target.value.slice(0, MAX_LEN));
              setSaved(false);
            }}
            placeholder={copy.notes.placeholder}
            className="min-h-28 resize-none rounded-xl text-base leading-relaxed"
          />
          <p className="text-right text-[11px] text-muted-foreground">
            {spoke.length}/{MAX_LEN}
          </p>
        </div>
      ) : (
        <Textarea
          value={spoke}
          onChange={(event) => {
            setSpoke(event.target.value.slice(0, MAX_LEN));
            setSaved(false);
          }}
          placeholder={copy.notes.placeholder}
          className="min-h-36 resize-none rounded-xl text-base leading-relaxed"
        />
      )}

      {showPrompt ? (
        <div className="space-y-2">
          <Label className="text-sm font-semibold leading-snug text-foreground">
            {copy.notes.promptOptional}
          </Label>
          <Textarea
            value={apply}
            onChange={(event) => {
              setApply(event.target.value.slice(0, MAX_LEN));
              setSaved(false);
            }}
            placeholder="Tulis penerapan praktismu di sini…"
            className="min-h-24 resize-none rounded-xl text-base leading-relaxed"
          />
          <p className="text-right text-[11px] text-muted-foreground">
            {apply.length}/{MAX_LEN}
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setShareToGroup((value) => !value);
          setSaved(false);
        }}
        className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3.5 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">
            Bagikan ke chat kelompok
          </p>
          <p className="text-xs text-muted-foreground">
            {shareToGroup
              ? "Anggota lain bisa membaca refleksimu di chat."
              : "Hanya kamu yang melihat. Chat kelompok tetap terbuka setelah disimpan."}
          </p>
        </div>
        <span
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full transition-colors",
            shareToGroup ? "bg-primary" : "bg-muted",
          )}
          aria-hidden
        >
          <span
            className={cn(
              "absolute top-0.5 size-6 rounded-full bg-white shadow transition-transform",
              shareToGroup ? "translate-x-5" : "translate-x-0.5",
            )}
          />
        </span>
        <span className="sr-only">Visibility: {visibility}</span>
      </button>

      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">
          Setelah selesai, kamu bisa melihat refleksi teman sekelompok.
        </p>
        <Button
          size="lg"
          className="h-10 shrink-0 rounded-xl px-5 font-semibold"
          onClick={handleSave}
          disabled={!spoke.trim()}
        >
          {saved ? copy.notes.saved : "Selesai"}
        </Button>
      </div>
    </div>
  );
}
