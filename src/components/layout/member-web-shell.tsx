"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Caveat, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import {
  BookHeart,
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
import { QuickTooltip } from "@/components/ui/quick-tooltip";
import { WorshipMusicFab } from "@/components/bible/worship-music-controls";
import { RolePreviewBanner } from "@/components/role-preview/role-preview-banner";
import { SidebarProfileMenu } from "@/components/layout/sidebar-profile-menu";
import { SidebarRoutePrefetch, prefetchSidebarRoute } from "@/components/layout/sidebar-route-prefetch";
import { ScheduleUnfinishedBadge } from "@/components/schedule/schedule-unfinished-badge";
import { copy } from "@/lib/copy";
import { demoUser } from "@/lib/demo-data";
import { isBibleReadingPath, isExplorePath, isPassageReaderPage } from "@/lib/explore-routes";
import { cn } from "@/lib/utils";
import { useDevice } from "@/hooks/use-device";

const SIDEBAR_COLLAPSE_KEY = "bacaalkitab-member-sidebar-collapsed";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-member-display",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-member-sans",
});

const script = Caveat({
  subsets: ["latin"],
  variable: "--font-member-script",
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
    href: "/jadwal",
    label: copy.nav.schedule,
    icon: CalendarDays,
    match: (pathname) => pathname.startsWith("/jadwal"),
  },
  {
    href: "/explore",
    label: copy.nav.explore,
    icon: Compass,
    match: (pathname) => isExplorePath(pathname),
  },
  {
    href: "/jurnal",
    label: copy.nav.journal,
    icon: BookHeart,
    match: (pathname) => pathname.startsWith("/jurnal"),
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

function NavLinkInner({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <>
      <span className="member-web-nav-icon relative">
        <Icon className="size-4" />
        {item.href === "/jadwal" ? (
          <ScheduleUnfinishedBadge className="absolute -top-1 -right-1" />
        ) : null}
      </span>
      {!collapsed ? (
        <span className="flex-1 truncate">{item.label}</span>
      ) : null}
    </>
  );
}

function NavLink({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const router = useRouter();
  const link = (
    <Link
      href={item.href}
      prefetch
      onPointerDown={() => prefetchSidebarRoute(router, item.href)}
      onMouseEnter={() => prefetchSidebarRoute(router, item.href)}
      onFocus={() => prefetchSidebarRoute(router, item.href)}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "member-web-nav-item",
        collapsed && "member-web-nav-item-collapsed",
        active && "member-web-nav-item-active",
      )}
    >
      <NavLinkInner item={item} collapsed={collapsed} />
    </Link>
  );

  return (
    <QuickTooltip label={item.label} side="right" delayDuration={120}>
      {link}
    </QuickTooltip>
  );
}

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
  const { isMobile } = useDevice();
  const immersiveMobileReading =
    isMobile && isPassageReaderPage(pathname ?? "");
  const hideTopBreadcrumb =
    pathname != null && /^\/jurnal\/[^/]+$/.test(pathname);
  const { session, isAdmin } = useDemoAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const closeProfileMenu = () => setProfileMenuOpen(false);

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

  useEffect(() => {
    closeProfileMenu();
  }, [pathname]);

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
        script.variable,
        "member-web min-h-dvh w-full antialiased",
        collapsed && "member-web-sidebar-collapsed",
      )}
    >
      <BiblePageThemeSync />
      <SidebarRoutePrefetch />
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

          <QuickTooltip
            label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
            side="right"
            delayDuration={120}
          >
            <button
              type="button"
              onClick={toggleCollapsed}
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-xl border border-[var(--m-line)] bg-[var(--m-paper)] text-[var(--m-ink-soft)] transition-colors hover:border-[var(--m-accent)] hover:bg-[var(--m-wash)] hover:text-[var(--m-accent)]",
                collapsed && "mt-0",
              )}
              aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </button>
          </QuickTooltip>
        </div>

        <nav
          className={cn(
            "relative z-10 mt-8 flex flex-1 flex-col gap-1.5",
            collapsed ? "w-full items-center" : "w-full",
          )}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(pathname, item)}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <div
          className={cn(
            "relative z-10 mt-auto w-full space-y-2 border-t border-[var(--m-line)] pt-4",
            collapsed && "flex flex-col items-center",
          )}
        >
          {collapsed ? (
            <>
              <HeaderUtilityIcons
                className="flex-col"
                size="sm"
                tooltipSide="right"
                onPointerEnter={closeProfileMenu}
              />
              <SidebarProfileMenu
                displayName={displayName}
                username={username}
                collapsed
                isActive={isProfilePath(pathname)}
                open={profileMenuOpen}
                onOpenChange={setProfileMenuOpen}
              />
            </>
          ) : (
            <div className="flex items-center gap-1">
              <SidebarProfileMenu
                displayName={displayName}
                username={username}
                collapsed={false}
                isActive={isProfilePath(pathname)}
                open={profileMenuOpen}
                onOpenChange={setProfileMenuOpen}
              />
              <HeaderUtilityIcons
                size="sm"
                tooltipSide="right"
                onPointerEnter={closeProfileMenu}
              />
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
        <main
          className={cn(
            "relative mx-auto w-full min-w-0 max-w-6xl flex-1 overflow-x-clip px-4 pb-28 pt-4 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8 xl:px-12",
            immersiveMobileReading && "pt-2",
          )}
        >
          <div className="relative w-full min-w-0">
            {!immersiveMobileReading && !hideTopBreadcrumb ? (
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <MemberBreadcrumb className="mb-3 lg:mb-4" />
                </div>
                <HeaderUtilityIcons
                  className="-mt-1 mb-3 shrink-0 lg:hidden"
                  size="sm"
                  tooltipSide="bottom"
                />
              </div>
            ) : null}
            <RolePreviewBanner />
            {children}
          </div>
        </main>
        <BottomNav className="lg:hidden" />
        {!immersiveMobileReading ? <WorshipMusicFab /> : null}
      </div>
    </div>
  );
}
