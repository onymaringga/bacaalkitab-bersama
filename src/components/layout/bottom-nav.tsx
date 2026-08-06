"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookHeart,
  BookOpen,
  CalendarDays,
  Compass,
  Home,
  LayoutDashboard,
  UserRound,
  Users,
} from "lucide-react";

import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { prefetchSidebarRoute } from "@/components/layout/sidebar-route-prefetch";
import { ScheduleUnfinishedBadge } from "@/components/schedule/schedule-unfinished-badge";
import { isBibleReadingPath, isExplorePath } from "@/lib/explore-routes";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { getDefaultBacaHref } from "@/lib/baca-default-route";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  match?: (pathname: string) => boolean;
};

const memberItems: NavItem[] = [
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
  {
    href: "/profil",
    label: copy.nav.profile,
    icon: UserRound,
    match: (pathname) =>
      pathname === "/profil" ||
      (pathname.startsWith("/profil/") &&
        !pathname.startsWith("/profil/anggota")),
  },
];

const adminItems: NavItem[] = [
  {
    href: "/admin",
    label: "Admin",
    icon: LayoutDashboard,
    match: (pathname) => pathname.startsWith("/admin"),
  },
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
  {
    href: "/profil",
    label: copy.nav.profile,
    icon: UserRound,
    match: (pathname) =>
      pathname === "/profil" ||
      (pathname.startsWith("/profil/") &&
        !pathname.startsWith("/profil/anggota")),
  },
];

function isActive(pathname: string, item: NavItem) {
  if (item.match) return item.match(pathname);
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavLinkInner({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  const Icon = item.icon;

  return (
    <>
      <span className="relative">
        <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
        {item.href === "/jadwal" ? (
          <ScheduleUnfinishedBadge className="absolute -top-1 -right-1.5" />
        ) : null}
      </span>
      <span className={cn("truncate", active && "font-semibold")}>
        {item.label}
      </span>
    </>
  );
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const router = useRouter();
  const active = isActive(pathname, item);

  return (
    <Link
      href={item.href}
      prefetch
      onPointerDown={() => prefetchSidebarRoute(router, item.href)}
      onMouseEnter={() => prefetchSidebarRoute(router, item.href)}
      onFocus={() => prefetchSidebarRoute(router, item.href)}
      className={cn(
        "flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-1.5 text-[9px] font-medium touch-manipulation transition-colors sm:px-1 sm:text-[10px]",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <NavLinkInner item={item} active={active} />
    </Link>
  );
}

export function BottomNav({ className }: { className?: string }) {
  const { isAdmin } = useDemoAuth();
  const items = isAdmin ? adminItems : memberItems;

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-card/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex max-w-2xl items-end justify-around px-0.5">
        {items.map((item) => (
          <NavLink key={`${item.href}-${item.label}`} item={item} />
        ))}
      </div>
    </nav>
  );
}
