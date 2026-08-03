"use client";

import { useSyncExternalStore } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  getAvatarUrlByMemberId,
  getAvatarUrlByName,
  getCurrentUserAvatarUrl,
  subscribeProfileAvatar,
} from "@/lib/member-avatars";
import { getInitials } from "@/lib/group-members";
import { cn } from "@/lib/utils";

type MemberAvatarProps = {
  name: string;
  memberId?: string;
  /** Pakai foto user yang login (termasuk custom dari profil). */
  currentUser?: boolean;
  className?: string;
  fallbackClassName?: string;
  alt?: string;
};

function useLiveCurrentAvatar(name: string, enabled: boolean) {
  return useSyncExternalStore(
    enabled ? subscribeProfileAvatar : subscribeNoop,
    () => (enabled ? getCurrentUserAvatarUrl(name) : ""),
    () => "",
  );
}

function subscribeNoop() {
  return () => {};
}

export function MemberAvatar({
  name,
  memberId,
  currentUser = false,
  className,
  fallbackClassName,
  alt,
}: MemberAvatarProps) {
  const liveUrl = useLiveCurrentAvatar(name, currentUser);
  const src = currentUser
    ? liveUrl || getCurrentUserAvatarUrl(name)
    : memberId
      ? getAvatarUrlByMemberId(memberId)
      : getAvatarUrlByName(name);

  return (
    <Avatar className={cn("overflow-hidden", className)}>
      <AvatarImage src={src} alt={alt ?? name} />
      <AvatarFallback
        className={cn(
          "bg-[var(--m-wash)] text-[var(--m-ink)] font-semibold",
          fallbackClassName,
        )}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
