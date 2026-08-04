"use client";

import { PageHeader } from "@/components/layout/page-header";
import { GroupMembersList } from "@/components/group/group-members-list";
import { useRolePreview } from "@/components/role-preview/role-preview-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { copy } from "@/lib/copy";
import { useUserGroupIds } from "@/hooks/use-user-group-ids";
import { demoGroups } from "@/lib/demo-data";

export default function AnggotaKelompokPage() {
  const { isLeaderView } = useRolePreview();
  const userGroupIds = useUserGroupIds();
  const userGroups = demoGroups.filter((group) =>
    userGroupIds.includes(group.id),
  );

  if (userGroups.length === 0) {
    return (
      <>
        <PageHeader
          backHref="/profil"
          backLabel={copy.members.backToProfil}
          title={isLeaderView ? copy.members.titleLeader : copy.members.title}
          hint={copy.groups.noGroupHint}
        />
        <p className="text-center text-sm text-[var(--m-ink-soft)]">
          {copy.groups.noGroupTitle}
        </p>
      </>
    );
  }

  if (userGroups.length === 1) {
    const group = userGroups[0];
    return (
      <>
        <PageHeader
          backHref="/kelompok"
          backLabel={copy.members.backToGroup}
          title={isLeaderView ? copy.members.titleLeader : copy.members.title}
          hint={
            isLeaderView
              ? copy.members.subtitleLeader(group.name)
              : copy.members.subtitle(group.name)
          }
        />
        <GroupMembersList groupId={group.id} groupName={group.name} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        backHref="/kelompok"
        backLabel={copy.members.backToGroup}
        title={isLeaderView ? copy.members.titleLeader : copy.members.title}
        hint={
          isLeaderView
            ? copy.members.subtitleMultiLeader
            : copy.members.subtitleMulti
        }
      />
      <Tabs defaultValue={userGroups[0]?.id} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          {userGroups.map((group) => (
            <TabsTrigger key={group.id} value={group.id}>
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {userGroups.map((group) => (
          <TabsContent key={group.id} value={group.id}>
            <GroupMembersList groupId={group.id} groupName={group.name} />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
