"use client";

import { use } from "react";

import { AdminGroupDetail } from "@/components/admin/admin-group-detail";

type PageProps = {
  params: Promise<{ groupId: string }>;
};

export default function AdminGroupDetailPage({ params }: PageProps) {
  const { groupId } = use(params);
  return <AdminGroupDetail groupId={groupId} />;
}
