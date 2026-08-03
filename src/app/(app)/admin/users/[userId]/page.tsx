"use client";

import { use } from "react";

import { AdminUserDetail } from "@/components/admin/admin-user-detail";

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default function AdminUserDetailPage({ params }: PageProps) {
  const { userId } = use(params);
  return <AdminUserDetail userId={userId} />;
}
