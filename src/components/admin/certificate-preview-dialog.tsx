"use client";

import { Award } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CERTIFICATE_CATEGORY_LABEL,
  type CertificateCategory,
  type ProgramParticipant,
} from "@/lib/program-participants";
import { formatShortDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

type CertificatePreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant: ProgramParticipant | null;
  programName: string;
  organization: string;
};

const CATEGORY_ACCENT: Record<
  Exclude<CertificateCategory, "incomplete">,
  string
> = {
  completion: "#1d4ed8",
  participation: "#0f766e",
  leader: "#b45309",
};

export function CertificatePreviewDialog({
  open,
  onOpenChange,
  participant,
  programName,
  organization,
}: CertificatePreviewDialogProps) {
  if (!participant || !participant.graduated || participant.category === "incomplete") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sertifikat belum tersedia</DialogTitle>
            <DialogDescription>
              Peserta ini belum lulus, jadi sertifikat belum diterbitkan.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const accent = CATEGORY_ACCENT[participant.category];
  const categoryLabel = CERTIFICATE_CATEGORY_LABEL[participant.category];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <DialogHeader className="space-y-1 border-b border-[var(--a-line)] px-5 py-4 pr-12 text-left">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-[var(--a-ink)]">
            <Award className="size-4 text-[var(--a-accent)]" />
            Sertifikat — {participant.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-[var(--a-ink-soft)]">
            {categoryLabel} · {programName}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-[var(--a-wash)]/40 px-4 py-5 sm:px-6">
          <div
            className={cn(
              "relative overflow-hidden rounded-xl border-2 bg-[#fffdf8] shadow-[0_12px_40px_oklch(0.45_0.06_255/0.12)]",
            )}
            style={{ borderColor: accent }}
          >
            <div
              className="absolute inset-x-0 top-0 h-1.5"
              style={{ background: accent }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full opacity-15"
              style={{ background: accent }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-10 -left-6 size-28 rounded-full opacity-10"
              style={{ background: accent }}
              aria-hidden
            />

            <div className="relative px-6 py-8 text-center sm:px-10 sm:py-10">
              <p
                className="text-[0.65rem] font-bold tracking-[0.22em] uppercase"
                style={{ color: accent }}
              >
                {organization}
              </p>
              <h3 className="admin-display mt-3 text-2xl text-[#1a2b45] sm:text-3xl">
                Sertifikat Penghargaan
              </h3>
              <p className="mt-1 text-xs text-[#5c6f8c]">
                Diberikan kepada
              </p>
              <p className="admin-display mt-3 text-[1.65rem] leading-tight text-[#14233a] sm:text-[1.85rem]">
                {participant.name}
              </p>
              <div
                className="mx-auto mt-3 h-px w-24"
                style={{ background: accent }}
                aria-hidden
              />
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#5c6f8c]">
                atas partisipasi dalam program{" "}
                <span className="font-semibold text-[#1a2b45]">
                  {programName}
                </span>{" "}
                dengan kategori{" "}
                <span className="font-semibold" style={{ color: accent }}>
                  {categoryLabel}
                </span>
                .
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#5c6f8c]">
                <div>
                  <p className="font-semibold text-[#1a2b45]">
                    {participant.completionRate}%
                  </p>
                  <p>Penyelesaian</p>
                </div>
                <div>
                  <p className="font-semibold text-[#1a2b45]">
                    {participant.groupName}
                  </p>
                  <p>Kelompok</p>
                </div>
                <div>
                  <p className="font-semibold text-[#1a2b45]">
                    {participant.certificateIssuedAt
                      ? formatShortDate(participant.certificateIssuedAt)
                      : "—"}
                  </p>
                  <p>Tanggal terbit</p>
                </div>
              </div>
              <p className="mt-6 font-mono text-[10px] tracking-wider text-[#5c6f8c]/50">
                {participant.certificateId}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
