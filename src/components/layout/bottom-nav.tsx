"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  Compass,
  Home,
  LayoutDashboard,
  UserRound,
  Users,
} from "lucide-react";

import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { isBibleReadingPath, isExplorePath } from "@/lib/explore-routes";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  match?: (pathname: string) => boolean;
};

const memberItems: NavItem[] = [
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
  {
    href: "/profil",
    label: copy.nav.profile,
    icon: UserRound,
    match: (pathname) =>
      pathname === "/profil" || pathname.startsWith("/profil/"),
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

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = isActive(pathname, item);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center gap-0.5 px-0.5 py-2 text-[9px] font-medium transition-colors sm:px-1 sm:text-[10px]",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
      <span className={cn("truncate", active && "font-semibold")}>
        {item.label}
      </span>
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
