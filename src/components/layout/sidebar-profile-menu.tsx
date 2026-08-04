"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { LogoutConfirmDialog } from "@/components/auth/logout-confirm-dialog";
import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { MemberAvatar } from "@/components/ui/member-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type SidebarProfileMenuProps = {
  displayName: string;
  username: string;
  collapsed: boolean;
  isActive: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const HOVER_CLOSE_DELAY_MS = 180;

export function SidebarProfileMenu({
  displayName,
  username,
  collapsed,
  isActive,
  open: controlledOpen,
  onOpenChange,
}: SidebarProfileMenuProps) {
  const router = useRouter();
  const { logout } = useDemoAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  function cancelClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function scheduleClose() {
    cancelClose();
    closeTimerRef.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY_MS);
  }

  function handleOpen() {
    cancelClose();
    setOpen(true);
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Profil ${displayName}`}
            onMouseEnter={collapsed ? handleOpen : undefined}
            onMouseLeave={collapsed ? scheduleClose : undefined}
            onFocus={collapsed ? handleOpen : undefined}
            className={cn(
              collapsed
                ? "inline-flex rounded-full transition-shadow hover:ring-2 hover:ring-[var(--m-accent)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-accent)]/50"
                : "flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-[var(--m-wash)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--m-accent)]/30",
              isActive && !collapsed && "bg-[var(--m-paper)] shadow-sm",
              isActive && collapsed && "ring-2 ring-[var(--m-accent)]/50",
            )}
          >
            <MemberAvatar
              name={displayName}
              currentUser
              className={collapsed ? "size-10" : "size-9"}
              fallbackClassName="bg-[var(--m-wash)] text-[var(--m-accent)] text-xs"
            />
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--m-ink)]">
                  {displayName}
                </p>
                <p className="truncate text-xs text-[var(--m-ink-soft)]">
                  @{username}
                </p>
              </div>
            ) : null}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={collapsed ? "right" : "top"}
          align={collapsed ? "end" : "start"}
          sideOffset={10}
          onMouseEnter={collapsed ? cancelClose : undefined}
          onMouseLeave={collapsed ? scheduleClose : undefined}
          className="z-[120] w-56 overflow-hidden border-0 p-0 shadow-lg ring-1 ring-[var(--m-line)]"
        >
          <div className="bg-[var(--m-ink,#14233a)] px-3 py-2.5">
            <p className="text-[10px] font-semibold tracking-wide text-white/65 uppercase">
              {copy.nav.profile}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-white">
              {displayName}
            </p>
            <p className="text-[10px] text-white/75">@{username}</p>
          </div>
          <div className="p-1">
            <DropdownMenuItem asChild>
              <Link href="/profil" className="gap-2 rounded-lg px-2 py-2">
                <User className="size-4" />
                {copy.nav.profile}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="gap-2 rounded-lg px-2 py-2"
              onSelect={() => setLogoutOpen(true)}
            >
              <LogOut className="size-4" />
              {copy.profile.access.logout}
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={() => {
          logout();
          router.push("/login");
        }}
      />
    </>
  );
}
