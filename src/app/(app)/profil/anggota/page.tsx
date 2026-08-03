"use client";

import { PageHeader } from "@/components/layout/page-header";
import { GroupMembersList } from "@/components/group/group-members-list";
import { useRolePreview } from "@/components/role-preview/role-preview-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { copy } from "@/lib/copy";
import { demoGroups } from "@/lib/demo-data";
import { demoUserGroupIds } from "@/lib/group-members";

export default function AnggotaKelompokPage() {
  const { isLeaderView } = useRolePreview();
  const userGroups = demoGroups.filter((group) =>
    demoUserGroupIds.includes(group.id),
  );

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
