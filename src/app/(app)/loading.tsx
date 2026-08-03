"use client";

import { LoadingModal } from "@/components/ui/loading-screen";

export default function AppLoading() {
  return (
    <LoadingModal
      label="Memuat…"
      hint="Menyiapkan konten untukmu."
    />
  );
}
