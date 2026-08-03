"use client";

import { Crown, UserRound } from "lucide-react";

import { useRolePreview } from "@/components/role-preview/role-preview-provider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { TitleWithHint } from "@/components/ui/title-with-hint";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";
import type { GroupViewRole } from "@/lib/role-preview-storage";

const OPTIONS: {
  value: GroupViewRole;
  label: string;
  hint: string;
  icon: typeof UserRound;
}[] = [
  {
    value: "member",
    label: copy.profile.rolePreview.member.label,
    hint: copy.profile.rolePreview.member.description,
    icon: UserRound,
  },
  {
    value: "leader",
    label: copy.profile.rolePreview.leader.label,
    hint: copy.profile.rolePreview.leader.description,
    icon: Crown,
  },
];

export function RolePreviewSwitcher() {
  const { viewRole, setViewRole } = useRolePreview();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          <TitleWithHint
            title={copy.profile.rolePreview.title}
            hint={copy.profile.rolePreview.description}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            const active = viewRole === option.value;

            return (
              <div
                key={option.value}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-3 py-3 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-muted/60",
                )}
              >
                <button
                  type="button"
                  onClick={() => setViewRole(option.value)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <Icon className={cn("size-4", active && "text-primary")} />
                  <span className="text-sm font-semibold">{option.label}</span>
                </button>
                <InfoTooltip content={option.hint} label={option.label} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
