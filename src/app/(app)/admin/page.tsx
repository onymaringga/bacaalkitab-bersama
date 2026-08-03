"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { LoadingModal } from "@/components/ui/loading-screen";

function AdminPageContent() {
  const router = useRouter();
  const { session, isAdmin, ready, logout } = useDemoAuth();

  useEffect(() => {
    if (!ready) return;
    if (!isAdmin) {
      router.replace("/login");
    }
  }, [ready, isAdmin, router]);

  if (!ready || !isAdmin || !session) {
    return (
      <LoadingModal
        label="Memuat panel admin"
        hint="Menyiapkan dashboard program baca bersama…"
      />
    );
  }

  return (
    <AdminDashboard
      session={session}
      onLogout={() => {
        logout();
        router.push("/login");
      }}
    />
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <LoadingModal
          label="Memuat panel admin"
          hint="Menyiapkan dashboard program baca bersama…"
        />
      }
    >
      <AdminPageContent />
    </Suspense>
  );
}
