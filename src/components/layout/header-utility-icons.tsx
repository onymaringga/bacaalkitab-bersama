"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, MessageCircle } from "lucide-react";

import { ChatUnreadBadge } from "@/components/chat/chat-unread-badge";
import { QuickTooltip } from "@/components/ui/quick-tooltip";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type HeaderUtilityIconsProps = {
  className?: string;
  /** Ukuran tombol ikon. */
  size?: "sm" | "md";
  /** Posisi tooltip — default atas (cocok di footer sidebar). */
  tooltipSide?: "top" | "right" | "bottom" | "left";
  /** Tutup menu profil saat pointer masuk zona ikon (hindari dropdown menutup tooltip). */
  onPointerEnter?: () => void;
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
  tooltipSide = "top",
  onPointerEnter,
}: HeaderUtilityIconsProps) {
  const pathname = usePathname();
  const box = size === "sm" ? "size-9" : "size-10";
  const icon = size === "sm" ? "size-4" : "size-4";

  const chatLink = (
    <Link
      href="/chat"
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
  );

  const notificationsLink = (
    <Link
      href="/notifikasi"
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
  );

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      onPointerEnter={onPointerEnter}
    >
      <QuickTooltip label={copy.nav.chat} side={tooltipSide} delayDuration={120}>
        {chatLink}
      </QuickTooltip>
      <QuickTooltip
        label={copy.nav.notifications}
        side={tooltipSide}
        delayDuration={120}
      >
        {notificationsLink}
      </QuickTooltip>
    </div>
  );
}
