"use client";

import Link from "next/link";
import { Shield, Users } from "lucide-react";

import { useRolePreview } from "@/components/role-preview/role-preview-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { copy } from "@/lib/copy";
import { demoUser } from "@/lib/demo-data";
import { getRoleLabel } from "@/lib/role-label";

export function DashboardRoleCard() {
  const { isLeaderView } = useRolePreview();
  const role = isLeaderView ? "leader" : demoUser.role;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{copy.leader.roleCard.title}</CardTitle>
        <Badge variant={isLeaderView ? "default" : "secondary"}>
          {getRoleLabel(role)}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {isLeaderView ? (
          <Button asChild variant="default" size="sm">
            <Link href="/kelompok">
              <Users className="mr-1 size-3.5" />
              {copy.leader.roleCard.watchMembers}
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href="/kelompok">{copy.leader.roleCard.viewGroup}</Link>
          </Button>
        )}
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">
            <Shield className="mr-1 size-3.5" />
            {copy.profile.access.admin}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
