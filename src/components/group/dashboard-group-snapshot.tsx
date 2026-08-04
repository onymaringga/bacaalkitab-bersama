"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  HeartHandshake,
  BookOpenCheck,
} from "lucide-react";

import { useRolePreview } from "@/components/role-preview/role-preview-provider";
import { MemberAvatar } from "@/components/ui/member-avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  defaultGroupReminderMessage,
  SendReminderButton,
} from "@/components/ui/send-reminder-dialog";
import { demoGroups, demoTodayReading } from "@/lib/demo-data";
import { copy } from "@/lib/copy";
import { useUserGroupIds } from "@/hooks/use-user-group-ids";
import {
  getGroupSummary,
  getMembersByGroup,
} from "@/lib/group-members";
import { cn } from "@/lib/utils";

export function DashboardGroupSnapshot() {
  const { isLeaderView } = useRolePreview();
  const userGroupIds = useUserGroupIds();

  if (!isLeaderView) return null;

  const primaryGroup = demoGroups.find((group) =>
    userGroupIds.includes(group.id),
  );

  if (!primaryGroup) return null;

  const summary = getGroupSummary(primaryGroup.id);
  const members = getMembersByGroup(primaryGroup.id);
  const encourageMembers = members.filter(
    (member) =>
      member.todayStatus === "pending" || member.todayStatus === "missed",
  );
  const todayProgress = Math.round(
    (summary.completedToday / summary.memberCount) * 100,
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpenCheck className="size-5" />
            </div>
            <CardTitle className="text-base font-bold">
              {copy.leader.todayTarget}
            </CardTitle>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-md px-2 py-1 text-xs font-semibold",
              todayProgress >= 80
                ? "bg-[var(--status-success-bg)] text-[var(--status-success-text)]"
                : "bg-muted text-muted-foreground",
            )}
          >
            {copy.leader.achieved(todayProgress)}
          </span>
        </div>

        <div className="mt-3 rounded-lg bg-muted/60 px-3.5 py-3">
          <p className="text-xs font-medium text-muted-foreground">
            {copy.leader.todayPassage}
          </p>
          <p className="mt-0.5 text-base font-bold text-foreground">
            {demoTodayReading.passage}
          </p>
          <p className="text-xs text-muted-foreground">{demoTodayReading.title}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.home.groupJourney(todayProgress)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {encourageMembers.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-3 py-2.5">
              <HeartHandshake className="size-4 text-primary" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {copy.leader.needsReminder(encourageMembers.length)}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {copy.leader.encourageHint}
                </p>
              </div>
            </div>
            <div className="divide-y divide-border">
              {encourageMembers.slice(0, 3).map((member) => (
                <Link
                  key={member.id}
                  href={`/profil/anggota/${member.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40"
                >
                  <MemberAvatar
                    name={member.name}
                    memberId={member.id}
                    currentUser={member.isCurrentUser}
                    className="size-6"
                    fallbackClassName="bg-muted text-xs font-semibold text-foreground"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.todayStatus === "missed"
                        ? copy.members.todayStatus.missed
                        : copy.members.todayStatus.pending}
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 rounded-lg bg-[var(--status-success-bg)] px-3 py-3">
            <CheckCircle2 className="size-5 shrink-0 text-[var(--status-success-text)]" />
            <p className="text-sm font-medium text-[var(--status-success-text)]">
              {copy.leader.allDone}
            </p>
          </div>
        )}

        <SendReminderButton
          recipientName={primaryGroup.name}
          recipientLabel={`kelompok ${primaryGroup.name}`}
          recipientEmail={members
            .filter((m) => !m.isCurrentUser)
            .map((m) => m.email)}
          defaultMessage={defaultGroupReminderMessage(primaryGroup.name)}
          variant="outline"
          className="w-full"
          successMessage="Dorongan lembut terkirim via email ke kelompok"
        >
          <HeartHandshake className="size-4" />
          {copy.profile.group.sendReminder}
        </SendReminderButton>
      </CardContent>
    </Card>
  );
}
