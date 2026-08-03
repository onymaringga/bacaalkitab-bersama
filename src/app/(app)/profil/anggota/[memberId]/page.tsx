"use client";

import { notFound } from "next/navigation";
import { use } from "react";

import { MemberDetailView } from "@/components/group/member-detail-view";
import { PageHeader } from "@/components/layout/page-header";
import { copy } from "@/lib/copy";
import { demoGroups } from "@/lib/demo-data";
import { getMemberById } from "@/lib/group-members";

type MemberDetailPageProps = {
  params: Promise<{ memberId: string }>;
};

export default function MemberDetailPage({ params }: MemberDetailPageProps) {
  const { memberId } = use(params);
  const member = getMemberById(memberId);

  if (!member) {
    notFound();
  }

  const group = demoGroups.find((item) => item.id === member.groupId);

  return (
    <>
      <PageHeader
        backHref="/profil/anggota"
        backLabel={copy.members.backToList}
      />
      <MemberDetailView member={member} groupName={group?.name ?? "Kelompok"} />
    </>
  );
}
