"use client";

import { LoadingModal } from "@/components/ui/loading-screen";

export default function AdminLoading() {
  return (
    <LoadingModal
      label="Memuat…"
      hint="Menyiapkan halaman admin…"
    />
  );
}
