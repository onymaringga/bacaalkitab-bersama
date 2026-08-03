"use client";

import { use } from "react";

import { AdminScheduleDayDetail } from "@/components/admin/admin-schedule-day-detail";

type PageProps = {
  params: Promise<{ date: string }>;
};

export default function AdminScheduleDayPage({ params }: PageProps) {
  const { date } = use(params);
  return <AdminScheduleDayDetail date={date} />;
}
