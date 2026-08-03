"use client";

import { useEffect, useState } from "react";
import { PenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast-host";
import {
  authorRoleLabel,
  getScheduleDevotional,
  saveScheduleDevotional,
  type DevotionalAuthorRole,
} from "@/lib/schedule-devotional";
import { cn } from "@/lib/utils";

type ScheduleDevotionalEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateKey: string;
  passage: string;
  authorRole: DevotionalAuthorRole;
  authorName: string;
  /** Initial seed if no custom renungan yet (e.g. default schedule text) */
  seedContent?: string;
  onSaved?: () => void;
};

export function ScheduleDevotionalEditor({
  open,
  onOpenChange,
  dateKey,
  passage,
  authorRole,
  authorName,
  seedContent = "",
  onSaved,
}: ScheduleDevotionalEditorProps) {
  const existing = getScheduleDevotional(dateKey);
  const [content, setContent] = useState(existing?.content ?? seedContent);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const current = getScheduleDevotional(dateKey);
    setContent(current?.content || seedContent || "");
  }, [open, dateKey, seedContent]);

  async function handleSave() {
    const trimmed = content.trim();
    if (!trimmed) return;

    setSaving(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    saveScheduleDevotional({
      dateKey,
      content: trimmed,
      authorRole,
      authorName,
    });
    setSaving(false);
    onOpenChange(false);
    showToast("Renungan disimpan");
    onSaved?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <DialogHeader className="space-y-1 border-b border-border px-5 py-4 pr-12 text-left">
          <DialogTitle className="text-base font-semibold">
            {existing ? "Edit renungan" : "Tulis renungan"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Untuk {passage}. Ditulis sebagai{" "}
            {authorRoleLabel(authorRole).toLowerCase()}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-5 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="schedule-devotional">Isi renungan</Label>
            <Textarea
              id="schedule-devotional"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={8}
              className="min-h-[12rem] resize-y rounded-xl text-sm leading-relaxed"
              placeholder="Tulis renungan singkat untuk bacaan hari ini…"
              autoFocus
            />
            <p className="text-[11px] text-muted-foreground">
              Renungan ini tampil untuk seluruh peserta di jadwal bacaan
              tersebut.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={saving || !content.trim()}
              className={cn(
                "h-10 gap-2 rounded-xl font-semibold",
                saving && "opacity-80",
              )}
              onClick={() => void handleSave()}
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" />
                  Menyimpan…
                </>
              ) : (
                <>
                  <PenLine className="size-4" />
                  Simpan renungan
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
