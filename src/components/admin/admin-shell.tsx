"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import {
  BookOpen,
  CalendarPlus,
  LayoutDashboard,
  LogOut,
  UserRound,
  Users,
} from "lucide-react";

import { LogoutConfirmDialog } from "@/components/auth/logout-confirm-dialog";
import { AdminBreadcrumb } from "@/components/layout/app-breadcrumb";
import type { DemoSession } from "@/lib/demo-auth";
import { cn } from "@/lib/utils";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-admin-display",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-admin-sans",
});

export type AdminNavId =
  | "overview"
  | "schedule"
  | "program"
  | "groups"
  | "users";

const navItems: {
  id: AdminNavId;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/admin?tab=overview",
    icon: LayoutDashboard,
  },
  {
    id: "schedule",
    label: "Jadwal Baca",
    href: "/admin?tab=schedule",
    icon: CalendarPlus,
  },
  {
    id: "program",
    label: "Program",
    href: "/admin?tab=program",
    icon: BookOpen,
  },
  {
    id: "groups",
    label: "Kelompok",
    href: "/admin?tab=groups",
    icon: Users,
  },
  {
    id: "users",
    label: "Peserta",
    href: "/admin?tab=users",
    icon: UserRound,
  },
];

type AdminShellProps = {
  session: DemoSession;
  onLogout: () => void;
  activeNav: AdminNavId;
  children: ReactNode;
};

export function AdminShell({
  session,
  onLogout,
  activeNav,
  children,
}: AdminShellProps) {
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  function goTo(href: string) {
    router.push(href);
  }

  return (
    <div
      className={cn(
        display.variable,
        sans.variable,
        "admin-shell min-h-dvh antialiased",
      )}
    >
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col lg:mx-0 lg:max-w-none">
        <aside className="admin-aside hidden h-dvh w-[17.5rem] flex-col px-5 py-7 lg:flex">
          <div className="relative z-10 px-1">
            <p className="admin-kicker text-[var(--a-accent)]">Panel admin</p>
            <h1 className="admin-display mt-2 text-[1.35rem] leading-tight text-[var(--a-ink)]">
              Baca Alkitab{" "}
              <span className="admin-display-italic text-[var(--a-accent)]">
                Bersama
              </span>
            </h1>
          </div>

          <nav className="relative z-10 mt-9 flex flex-1 flex-col gap-1.5">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(item.href)}
                  className={cn(
                    "admin-nav-item",
                    active && "admin-nav-item-active",
                  )}
                >
                  <span className="admin-nav-icon">
                    <Icon className="size-4" />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  <span
                    className={cn(
                      "font-mono text-[0.65rem] tracking-wider",
                      active
                        ? "text-[var(--a-accent)]"
                        : "text-[var(--a-ink-soft)]/50",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="relative z-10 mt-auto space-y-3 border-t border-[var(--a-line)] pt-5">
            <div className="px-1">
              <p className="text-sm font-semibold text-[var(--a-ink)]">
                {session.name}
              </p>
              <p className="text-xs text-[var(--a-ink-soft)]">
                @{session.username}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="admin-logout"
            >
              <LogOut className="size-4" />
              Keluar
            </button>
          </div>
        </aside>

        <main className="relative flex-1 px-4 py-5 lg:ml-[17.5rem] lg:px-10 lg:py-9">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 70% 45% at 90% 0%, oklch(0.82 0.08 250 / 0.35), transparent 55%)",
            }}
          />

          <div className="relative mb-4 flex items-center justify-between gap-3 lg:hidden">
            <div>
              <p className="admin-kicker text-[var(--a-accent)]">Admin</p>
              <p className="admin-display mt-1 text-xl text-[var(--a-ink)]">
                Baca Alkitab Bersama
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="admin-logout w-auto min-h-9 px-3 text-xs"
            >
              <LogOut className="size-3.5" />
              Keluar
            </button>
          </div>

          <div className="relative mb-5 flex gap-5 overflow-x-auto border-b border-[var(--a-line)] lg:mb-0 lg:hidden">
            {navItems.map((item) => {
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(item.href)}
                  className={cn(
                    "admin-mobile-tab",
                    active && "admin-mobile-tab-active",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="relative" data-copy-root>
            <AdminBreadcrumb />
            {children}
          </div>
        </main>
      </div>

      <LogoutConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={onLogout}
      />
    </div>
  );
}
