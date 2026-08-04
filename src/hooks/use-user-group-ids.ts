"use client";

import { useSyncExternalStore } from "react";

import { readDemoSession } from "@/lib/demo-auth";
import {
  getServerUserGroupIds,
  getUserGroupIds,
  subscribeUserMembership,
} from "@/lib/user-membership";

export function useUserGroupIds() {
  const session = useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return () => {};
      window.addEventListener("demo-session-updated", onChange);
      return () => window.removeEventListener("demo-session-updated", onChange);
    },
    readDemoSession,
    () => null,
  );

  return useSyncExternalStore(
    subscribeUserMembership,
    () => getUserGroupIds(session?.email),
    getServerUserGroupIds,
  );
}
