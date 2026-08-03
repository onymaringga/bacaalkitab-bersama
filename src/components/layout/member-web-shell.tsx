"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import {
  BookOpen,
  CalendarDays,
  Compass,
  Home,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
} from "lucide-react";

import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { MemberBreadcrumb } from "@/components/layout/app-breadcrumb";
import { BiblePageThemeSync } from "@/components/bible/bible-page-theme-sync";
import { BottomNav } from "@/components/layout/bottom-nav";
import { HeaderUtilityIcons } from "@/components/layout/header-utility-icons";
import { WorshipMusicFab } from "@/components/bible/worship-music-controls";
import { RolePreviewBanner } from "@/components/role-preview/role-preview-banner";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { copy } from "@/lib/copy";
import { demoUser } from "@/lib/demo-data";
import { isBibleReadingPath, isExplorePath } from "@/lib/explore-routes";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSE_KEY = "bacaalkitab-member-sidebar-collapsed";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-member-display",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-member-sans",
});

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  match?: (pathname: string) => boolean;
};

const memberNavItems: NavItem[] = [
  { href: "/dashboard", label: copy.nav.home, icon: Home },
  {
    href: "/baca",
    label: copy.nav.read,
    icon: BookOpen,
    match: (pathname) => isBibleReadingPath(pathname),
  },
  {
    href: "/explore",
    label: copy.nav.explore,
    icon: Compass,
    match: (pathname) => isExplorePath(pathname),
  },
  {
    href: "/jadwal",
    label: copy.nav.schedule,
    icon: CalendarDays,
    match: (pathname) => pathname.startsWith("/jadwal"),
  },
  {
    href: "/kelompok",
    label: copy.nav.group,
    icon: Users,
    match: (pathname) =>
      pathname.startsWith("/kelompok") || pathname.startsWith("/profil/anggota"),
  },
];

const adminNavItems: NavItem[] = [
  {
    href: "/admin",
    label: "Admin",
    icon: LayoutDashboard,
    match: (pathname) => pathname.startsWith("/admin"),
  },
  ...memberNavItems.filter((item) => item.href !== "/dashboard"),
];

function isActive(pathname: string, item: NavItem) {
  if (item.match) return item.match(pathname);
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function isProfilePath(pathname: string) {
  return (
    pathname === "/profil" ||
    (pathname.startsWith("/profil/") &&
      !pathname.startsWith("/profil/anggota"))
  );
}

export function MemberWebShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { session, isAdmin } = useDemoAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const navItems = isAdmin ? adminNavItems : memberNavItems;

  const displayName = session?.name ?? demoUser.name;
  const displayEmail = session?.email ?? demoUser.email;
  const username = session?.username ?? displayEmail.split("@")[0];

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSE_KEY);
      if (stored === "1") setCollapsed(true);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <div
      className={cn(
        display.variable,
        sans.variable,
        "member-web min-h-dvh w-full antialiased",
        collapsed && "member-web-sidebar-collapsed",
      )}
    >
      <BiblePageThemeSync />
      <aside
        className={cn(
          "member-web-aside hidden h-dvh flex-col py-6 transition-[width,padding] duration-300 ease-out lg:flex",
          collapsed ? "w-[4.75rem] items-center px-2.5" : "w-[16.5rem] px-5",
          !ready && "duration-0",
        )}
      >
        <div
          className={cn(
            "relative z-10 flex w-full",
            collapsed
              ? "flex-col items-center gap-3"
              : "items-start justify-between gap-2 px-1",
          )}
        >
          {collapsed ? (
            <Link
              href="/dashboard"
              className="member-web-display flex size-10 items-center justify-center rounded-xl bg-[var(--m-paper)] text-lg text-[var(--m-accent)] shadow-sm ring-1 ring-[var(--m-line)]"
              title="Baca Alkitab Bersama"
              aria-label="Baca Alkitab Bersama"
            >
              B
            </Link>
          ) : (
            <div className="min-w-0">
              <h1 className="member-web-display text-[1.35rem] leading-tight text-[var(--m-ink)]">
                Baca Alkitab{" "}
                <span className="member-web-display-italic text-[var(--m-accent)]">
                  Bersama
                </span>
              </h1>
            </div>
          )}

          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl border border-[var(--m-line)] bg-[var(--m-paper)] text-[var(--m-ink-soft)] transition-colors hover:border-[var(--m-accent)] hover:bg-[var(--m-wash)] hover:text-[var(--m-accent)]",
              collapsed && "mt-0",
            )}
            aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
            title={collapsed ? "Perluas" : "Ciutkan"}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </button>
        </div>

        <nav
          className={cn(
            "relative z-10 mt-8 flex flex-1 flex-col gap-1.5",
            collapsed ? "w-full items-center" : "w-full",
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                className={cn(
                  "member-web-nav-item",
                  collapsed && "member-web-nav-item-collapsed",
                  active && "member-web-nav-item-active",
                )}
              >
                <span className="member-web-nav-icon relative">
                  <Icon className="size-4" />
                </span>
                {!collapsed ? (
                  <span className="flex-1 truncate">{item.label}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div
          className={cn(
            "relative z-10 mt-auto w-full space-y-2 border-t border-[var(--m-line)] pt-4",
            collapsed && "flex flex-col items-center",
          )}
        >
          {collapsed ? (
            <>
              <HeaderUtilityIcons className="flex-col" size="sm" />
              <Link
                href="/profil"
                title={displayName}
                aria-label={`Profil ${displayName}`}
                className={cn(
                  "rounded-full transition-shadow hover:ring-2 hover:ring-[var(--m-accent)]/30",
                  isProfilePath(pathname) &&
                    "ring-2 ring-[var(--m-accent)]/50",
                )}
                aria-current={isProfilePath(pathname) ? "page" : undefined}
              >
                <MemberAvatar
                  name={displayName}
                  currentUser
                  className="size-10"
                  fallbackClassName="bg-[var(--m-wash)] text-[var(--m-accent)] text-xs"
                />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <Link
                href="/profil"
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[var(--m-wash)]/70",
                  isProfilePath(pathname) && "bg-[var(--m-paper)] shadow-sm",
                )}
                aria-current={isProfilePath(pathname) ? "page" : undefined}
              >
                <MemberAvatar
                  name={displayName}
                  currentUser
                  className="size-9"
                  fallbackClassName="bg-[var(--m-wash)] text-[var(--m-accent)] text-xs"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--m-ink)]">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-[var(--m-ink-soft)]">
                    @{username}
                  </p>
                </div>
              </Link>
              <HeaderUtilityIcons size="sm" />
            </div>
          )}
        </div>
      </aside>

      <div
        className={cn(
          "relative flex min-h-dvh w-full min-w-0 max-w-full flex-col overflow-x-clip bg-[var(--m-paper)] transition-[padding] duration-300 ease-out",
          collapsed ? "lg:pl-[4.75rem]" : "lg:pl-[16.5rem]",
          !ready && "lg:duration-0",
        )}
      >
        {/* Full-bleed wash — harus di kolom penuh, bukan di main max-w-6xl */}
        <div
          data-member-web-wash
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 45% at 85% 0%, oklch(0.82 0.08 250 / 0.28), transparent 58%), radial-gradient(ellipse 50% 35% at 10% 100%, oklch(0.88 0.05 210 / 0.2), transparent 55%)",
          }}
        />
        <main className="relative mx-auto w-full min-w-0 max-w-6xl flex-1 overflow-x-clip px-4 pb-28 pt-4 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8 xl:px-12">
          <div className="relative w-full min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <MemberBreadcrumb className="mb-3 lg:mb-4" />
              </div>
              <HeaderUtilityIcons
                className="-mt-1 mb-3 shrink-0 lg:hidden"
                size="sm"
              />
            </div>
            <RolePreviewBanner />
            {children}
          </div>
        </main>
        <BottomNav className="lg:hidden" />
        <WorshipMusicFab />
      </div>
    </div>
  );
}
