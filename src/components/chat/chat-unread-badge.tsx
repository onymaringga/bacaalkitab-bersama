"use client";

import { useSyncExternalStore } from "react";

import {
  getServerUnreadChatCount,
  getUnreadChatCount,
  subscribeReflectionChat,
} from "@/lib/group-reflection-chat";
import { cn } from "@/lib/utils";

type ChatUnreadBadgeProps = {
  className?: string;
  /** Compact pill for sidebar / bottom nav */
  size?: "sm" | "md";
};

export function useUnreadChatCount() {
  return useSyncExternalStore(
    subscribeReflectionChat,
    getUnreadChatCount,
    getServerUnreadChatCount,
  );
}

export function ChatUnreadBadge({
  className,
  size = "sm",
}: ChatUnreadBadgeProps) {
  const count = useUnreadChatCount();
  if (count <= 0) return null;

  const label = count > 99 ? "99+" : String(count);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-red-500 font-bold text-white tabular-nums",
        size === "sm" && "h-4 min-w-4 px-1 text-[10px] leading-none",
        size === "md" && "h-5 min-w-5 px-1.5 text-[11px] leading-none",
        className,
      )}
      aria-label={`${count} pesan belum dibaca`}
    >
      {label}
    </span>
  );
}
