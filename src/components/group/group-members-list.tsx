"use client";

import Link from "next/link";
import { Bell, CheckCircle2, ChevronRight, Circle, Users } from "lucide-react";

import { useRolePreview } from "@/components/role-preview/role-preview-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGroupSummary, getInitials, getMembersByGroup } from "@/lib/group-members";
import { getAvatarUrlByName } from "@/lib/member-avatars";
import { copy } from "@/lib/copy";
import { demoGroupReflections } from "@/lib/demo-data";
import { getRoleLabel } from "@/lib/role-label";
import type { GroupMemberProgress, MemberTodayStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type GroupMembersListProps = {
  groupId: string;
  groupName: string;
};

const TODAY_LABELS = copy.members.todayStatus;

export function GroupMembersList({ groupId, groupName }: GroupMembersListProps) {
  const { isLeaderView } = useRolePreview();
  const members = getMembersByGroup(groupId);
  const summary = getGroupSummary(groupId);
  const progressPct = Math.round(
    (summary.completedToday / summary.memberCount) * 100,
  );
  const reflectionCount = demoGroupReflections.length;

  return (
    <div className="space-y-3">
      <Tabs defaultValue="progress" className="space-y-3">
        <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl bg-muted p-1">
          <TabsTrigger value="progress" className="rounded-lg">
            Progress
          </TabsTrigger>
          <TabsTrigger value="refleksi" className="rounded-lg">
            Refleksi
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-3 gap-2">
          <StatChip
            label="Sudah baca"
            value={`${summary.completedToday}/${summary.memberCount}`}
          />
          <StatChip label="Progress" value={`${progressPct}%`} />
          <StatChip label="Refleksi" value={String(reflectionCount)} />
        </div>

        <TabsContent value="progress" className="space-y-3">
          <Card className="overflow-hidden shadow-[var(--shadow-soft)]">
            <CardHeader className="border-b border-border py-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Users className="size-4" />
                {groupName} · {members.length} anggota
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {members.map((member) => (
                  <MemberListRow key={member.id} member={member} />
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refleksi" className="space-y-2">
          {demoGroupReflections.map((item) => (
            <Card key={item.id} className="shadow-[var(--shadow-soft)]">
              <CardContent className="flex items-start gap-3 py-4">
                <Avatar className="size-9">
                  <AvatarImage
                    src={getAvatarUrlByName(item.authorName)}
                    alt={item.authorName}
                  />
                  <AvatarFallback className="bg-muted text-xs font-semibold">
                    {getInitials(item.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{item.authorName}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.content}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {item.time}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {isLeaderView ? (
        <SendReminderButton
          recipientName={groupName}
          recipientLabel={`kelompok ${groupName}`}
          recipientEmail={members
            .filter((m) => !m.isCurrentUser)
            .map((m) => m.email)}
          defaultMessage={defaultGroupReminderMessage(groupName)}
          size="lg"
          className="h-12 w-full rounded-xl text-base font-semibold shadow-[var(--shadow-float)]"
          successMessage="Pengingat lembut terkirim via email ke grup"
        >
          <Bell className="size-4" />
          Kirim Pengingat ke Grup
        </SendReminderButton>
      ) : null}
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card px-3 py-3 text-center shadow-[var(--shadow-soft)] ring-1 ring-border">
      <p className="text-base font-bold text-foreground">{value}</p>
      <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

function MemberListRow({ member }: { member: GroupMemberProgress }) {
  return (
    <li>
      <Link
        href={`/profil/anggota/${member.id}`}
        className={cn(
          "flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40",
          member.isCurrentUser && "bg-primary/[0.03]",
        )}
      >
        <MemberAvatar
          name={member.name}
          memberId={member.id}
          currentUser={member.isCurrentUser}
          className="size-10"
          fallbackClassName="bg-muted text-xs font-semibold text-foreground"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-foreground">
              {member.name}
            </p>
            {member.isCurrentUser ? (
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {copy.common.you}
              </span>
            ) : null}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {getRoleLabel(member.role)}
            {member.todayStatus === "completed" ? " · Refleksi ada" : ""}
          </p>
        </div>

        <TodayStatusIcon status={member.todayStatus} />
        <ChevronRight className="size-4 shrink-0 text-muted-foreground/50" />
      </Link>
    </li>
  );
}

function TodayStatusIcon({ status }: { status: MemberTodayStatus }) {
  const Icon = status === "completed" ? CheckCircle2 : Circle;

  return (
    <Icon
      className={cn(
        "size-5 shrink-0",
        status === "completed" && "text-[var(--status-success-text)]",
        status !== "completed" && "text-muted-foreground/35",
      )}
      aria-label={TODAY_LABELS[status]}
    />
  );
}
