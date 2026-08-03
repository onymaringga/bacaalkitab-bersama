"use client";

import { useRolePreview } from "@/components/role-preview/role-preview-provider";
import { Badge } from "@/components/ui/badge";
import { copy } from "@/lib/copy";
import { demoUser } from "@/lib/demo-data";

export function EffectiveRoleBadge() {
  const { isLeaderView } = useRolePreview();
  const role = isLeaderView ? "leader" : demoUser.role;

  return (
    <Badge variant={isLeaderView ? "default" : "secondary"}>
      {copy.profile.roleBadge(role)}
    </Badge>
  );
}
