"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, MessageCircle } from "lucide-react";

import { ChatUnreadBadge } from "@/components/chat/chat-unread-badge";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type HeaderUtilityIconsProps = {
  className?: string;
  /** Ukuran tombol ikon. */
  size?: "sm" | "md";
};

function isChatPath(pathname: string) {
  return pathname.startsWith("/chat");
}

function isNotificationsPath(pathname: string) {
  return pathname.startsWith("/notifikasi");
}

/** Chat + Notifikasi — pasangan ikon utilitas di header/sidebar. */
export function HeaderUtilityIcons({
  className,
  size = "md",
}: HeaderUtilityIconsProps) {
  const pathname = usePathname();
  const box = size === "sm" ? "size-9" : "size-10";
  const icon = size === "sm" ? "size-4" : "size-4";

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      <Link
        href="/chat"
        title={copy.nav.chat}
        aria-label={copy.nav.chat}
        aria-current={isChatPath(pathname) ? "page" : undefined}
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-xl text-[var(--m-ink-soft)] transition-colors hover:bg-[var(--m-wash)]/70 hover:text-[var(--m-ink)]",
          box,
          isChatPath(pathname) &&
            "bg-[var(--m-paper)] text-[var(--m-accent)] shadow-sm",
        )}
      >
        <MessageCircle className={icon} />
        <ChatUnreadBadge className="absolute top-1 right-1" />
      </Link>
      <Link
        href="/notifikasi"
        title={copy.nav.notifications}
        aria-label={copy.nav.notifications}
        aria-current={isNotificationsPath(pathname) ? "page" : undefined}
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-xl text-[var(--m-ink-soft)] transition-colors hover:bg-[var(--m-wash)]/70 hover:text-[var(--m-ink)]",
          box,
          isNotificationsPath(pathname) &&
            "bg-[var(--m-paper)] text-[var(--m-accent)] shadow-sm",
        )}
      >
        <Bell className={icon} />
      </Link>
    </div>
  );
}
