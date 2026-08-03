"use client";

import { use } from "react";

import { AdminProgramDetail } from "@/components/admin/admin-program-detail";

type PageProps = {
  params: Promise<{ programId: string }>;
};

export default function AdminProgramDetailPage({ params }: PageProps) {
  const { programId } = use(params);
  return <AdminProgramDetail programId={programId} />;
}
