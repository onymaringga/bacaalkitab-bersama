"use client";

import { usePathname } from "next/navigation";

import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { BibleCacheBootstrap } from "@/components/bible/bible-cache-bootstrap";
import { MemberWebShell } from "@/components/layout/member-web-shell";
import { GlobalSearchProvider } from "@/components/search/global-search-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAdmin } = useDemoAuth();
  const isAdminRoute = isAdmin && pathname.startsWith("/admin");

  // Admin: full-bleed shell — menu handled inside AdminDashboard
  if (isAdminRoute) {
    return <div className="min-h-dvh w-full">{children}</div>;
  }

  return (
    <GlobalSearchProvider>
      <MemberWebShell>
        <BibleCacheBootstrap />
        {children}
      </MemberWebShell>
    </GlobalSearchProvider>
  );
}
