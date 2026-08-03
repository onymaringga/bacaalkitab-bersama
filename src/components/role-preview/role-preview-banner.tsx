"use client";

import { Crown } from "lucide-react";

import { useRolePreview } from "@/components/role-preview/role-preview-provider";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { copy } from "@/lib/copy";

export function RolePreviewBanner() {
  const { isLeaderView } = useRolePreview();

  if (!isLeaderView) return null;

  return (
    <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Crown className="size-3.5 shrink-0 text-primary" />
        Mode Ketua
      </span>
      <InfoTooltip content={copy.profile.leaderBanner} label="Mode Ketua" />
    </div>
  );
}
