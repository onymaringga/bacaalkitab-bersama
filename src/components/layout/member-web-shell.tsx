"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Caveat, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import {
  BookHeart,
  BookOpen,
  CalendarDays,
  ChevronDown,
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
import {
  GlobalSearchIconButton,
  GlobalSearchTrigger,
} from "@/components/search/global-search-provider";
import { QuickTooltip } from "@/components/ui/quick-tooltip";
import { WorshipMusicFab } from "@/components/bible/worship-music-controls";
import { RolePreviewBanner } from "@/components/role-preview/role-preview-banner";
import { SidebarProfileMenu } from "@/components/layout/sidebar-profile-menu";
import { SidebarRoutePrefetch, prefetchSidebarRoute } from "@/components/layout/sidebar-route-prefetch";
import { ScheduleUnfinishedBadge } from "@/components/schedule/schedule-unfinished-badge";
import { copy } from "@/lib/copy";
import { getDefaultBacaHref } from "@/lib/baca-default-route";
import { demoUser } from "@/lib/demo-data";
import { isBibleReadingPath, isExplorePath, isPassageReaderPage } from "@/lib/explore-routes";
import {
  getExploreNavChildren,
  isExploreNavChildActive,
} from "@/lib/explore-nav";
import { cn } from "@/lib/utils";
import { useDevice } from "@/hooks/use-device";

const SIDEBAR_COLLAPSE_KEY = "bacaalkitab-member-sidebar-collapsed";
const EXPLORE_SUBMENU_KEY = "bacaalkitab-explore-submenu-open";

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
  exploreChildren?: boolean;
};

const memberNavItems: NavItem[] = [
  { href: "/dashboard", label: copy.nav.home, icon: Home },
  {
    href: getDefaultBacaHref(),
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
    exploreChildren: true,
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

function SidebarNavLink({
  href,
  className,
  children,
  ariaLabel,
  ariaCurrent,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaCurrent?: "page" | undefined;
}) {
  const router = useRouter();

  return (
    <Link
      href={href}
      prefetch
      onClick={(event) => {
        event.preventDefault();
        router.push(href);
      }}
      onPointerDown={() => prefetchSidebarRoute(router, href)}
      onMouseEnter={() => prefetchSidebarRoute(router, href)}
      onFocus={() => prefetchSidebarRoute(router, href)}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      className={className}
    >
      {children}
    </Link>
  );
}

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

function ExploreNavSection({
  item,
  active,
  collapsed,
  pathname,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  pathname: string;
}) {
  const children = getExploreNavChildren();
  const childActive = children.some((child) =>
    isExploreNavChildActive(pathname, child.href),
  );
  const [submenuOpen, setSubmenuOpen] = useState(childActive);

  useEffect(() => {
    if (childActive) {
      setSubmenuOpen(true);
      return;
    }
    try {
      const stored = localStorage.getItem(EXPLORE_SUBMENU_KEY);
      if (stored === "0") setSubmenuOpen(false);
      else if (stored === "1") setSubmenuOpen(true);
    } catch {
      /* ignore */
    }
  }, [childActive]);

  function toggleSubmenu() {
    setSubmenuOpen((current) => {
      const next = !current;
      try {
        localStorage.setItem(EXPLORE_SUBMENU_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  if (collapsed) {
    return <NavLink item={item} active={active} collapsed />;
  }

  const Icon = item.icon;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-0.5">
        <SidebarNavLink
          href={item.href}
          ariaLabel={item.label}
          ariaCurrent={active ? "page" : undefined}
          className={cn(
            "member-web-nav-item min-w-0 flex-1",
            active && "member-web-nav-item-active",
          )}
        >
          <span className="member-web-nav-icon relative">
            <Icon className="size-4" />
          </span>
          <span className="flex-1 truncate">{item.label}</span>
        </SidebarNavLink>
        <QuickTooltip
          label={submenuOpen ? "Ciutkan submenu" : "Perluas submenu"}
          side="right"
          delayDuration={120}
        >
          <button
            type="button"
            onClick={toggleSubmenu}
            aria-expanded={submenuOpen}
            aria-controls="explore-nav-submenu"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--m-ink-soft)] transition-colors hover:bg-white/55 hover:text-[var(--m-ink)]"
          >
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-200",
                !submenuOpen && "-rotate-90",
              )}
            />
          </button>
        </QuickTooltip>
      </div>
      {submenuOpen ? (
        <ul
          id="explore-nav-submenu"
          className="mt-0.5 flex list-none flex-col gap-0.5 pl-2.5"
        >
          {children.map((child) => {
            const isChildActive = isExploreNavChildActive(pathname, child.href);
            return (
              <li key={child.href}>
                <SidebarNavLink
                  href={child.href}
                  ariaCurrent={isChildActive ? "page" : undefined}
                  className={cn(
                    "block w-full rounded-[0.65rem] py-1.5 pr-2.5 pl-7 text-left text-[0.8125rem] font-medium text-[var(--m-ink-soft)] transition-colors hover:bg-white/55 hover:text-[var(--m-ink)]",
                    isChildActive &&
                      "bg-white/75 font-semibold text-[var(--m-accent)] hover:bg-white/75 hover:text-[var(--m-accent)]",
                  )}
                >
                  {child.label}
                </SidebarNavLink>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
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
  const link = (
    <SidebarNavLink
      href={item.href}
      ariaLabel={item.label}
      ariaCurrent={active ? "page" : undefined}
      className={cn(
        "member-web-nav-item",
        collapsed && "member-web-nav-item-collapsed",
        active && "member-web-nav-item-active",
      )}
    >
      <NavLinkInner item={item} collapsed={collapsed} />
    </SidebarNavLink>
  );

  if (!collapsed) return link;

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

        <div
          className={cn(
            "relative z-10 mt-5 w-full",
            collapsed && "flex justify-center",
          )}
        >
          <GlobalSearchTrigger collapsed={collapsed} />
        </div>

        <nav
          className={cn(
            "relative z-10 mt-8 flex flex-1 flex-col gap-1.5",
            collapsed ? "w-full items-center" : "w-full",
          )}
        >
          {navItems.map((item) =>
            item.exploreChildren ? (
              <ExploreNavSection
                key={item.href}
                item={item}
                active={isActive(pathname, item)}
                collapsed={collapsed}
                pathname={pathname}
              />
            ) : (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(pathname, item)}
                collapsed={collapsed}
              />
            ),
          )}
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
          "relative flex min-h-dvh w-full min-w-0 max-w-full flex-col overflow-x-clip bg-[var(--m-paper)] transition-[padding] duration-300 ease-out lg:pointer-events-none",
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
            "relative mx-auto w-full min-w-0 max-w-6xl flex-1 overflow-x-clip px-4 pb-28 pt-4 sm:px-6 lg:pointer-events-auto lg:px-10 lg:pb-10 lg:pt-8 xl:px-12",
            immersiveMobileReading && "pt-2",
          )}
        >
          <div className="relative w-full min-w-0" data-copy-root>
            {!immersiveMobileReading && !hideTopBreadcrumb ? (
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <MemberBreadcrumb className="mb-3 lg:mb-4" />
                </div>
                <div className="-mt-1 mb-3 flex shrink-0 items-center gap-0.5 lg:hidden">
                  <QuickTooltip
                    label={copy.globalSearch.title}
                    side="bottom"
                    delayDuration={120}
                  >
                    <GlobalSearchIconButton />
                  </QuickTooltip>
                  <HeaderUtilityIcons
                    size="sm"
                    tooltipSide="bottom"
                  />
                </div>
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
