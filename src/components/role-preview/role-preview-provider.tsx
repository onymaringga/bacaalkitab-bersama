"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import {
  readStoredViewRole,
  writeStoredViewRole,
  type GroupViewRole,
} from "@/lib/role-preview-storage";

type RolePreviewContextValue = {
  viewRole: GroupViewRole;
  isLeaderView: boolean;
  setViewRole: (role: GroupViewRole) => void;
};

const RolePreviewContext = createContext<RolePreviewContextValue | null>(null);

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("role-preview-updated", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("role-preview-updated", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getServerSnapshot(): GroupViewRole {
  return "member";
}

export function RolePreviewProvider({ children }: { children: React.ReactNode }) {
  const viewRole = useSyncExternalStore(
    subscribe,
    readStoredViewRole,
    getServerSnapshot,
  );

  const setViewRole = useCallback((role: GroupViewRole) => {
    writeStoredViewRole(role);
    window.dispatchEvent(new Event("role-preview-updated"));
  }, []);

  const value = useMemo(
    () => ({
      viewRole,
      isLeaderView: viewRole === "leader",
      setViewRole,
    }),
    [viewRole, setViewRole],
  );

  return (
    <RolePreviewContext.Provider value={value}>{children}</RolePreviewContext.Provider>
  );
}

export function useRolePreview() {
  const context = useContext(RolePreviewContext);
  if (!context) {
    return {
      viewRole: "member" as const,
      isLeaderView: false,
      setViewRole: () => {},
    };
  }
  return context;
}
