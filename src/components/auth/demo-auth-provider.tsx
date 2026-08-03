"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import {
  clearDemoSession,
  readDemoSession,
  type DemoSession,
  writeDemoSession,
} from "@/lib/demo-auth";

type DemoAuthContextValue = {
  session: DemoSession | null;
  isAdmin: boolean;
  login: (session: DemoSession) => void;
  logout: () => void;
  ready: boolean;
};

const DemoAuthContext = createContext<DemoAuthContextValue | null>(null);

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("demo-session-updated", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("demo-session-updated", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

const serverSnapshot: DemoSession | null = null;

function getServerSnapshot() {
  return serverSnapshot;
}

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const session = useSyncExternalStore(
    subscribe,
    readDemoSession,
    getServerSnapshot,
  );

  useEffect(() => {
    setReady(true);
  }, []);

  const login = useCallback((next: DemoSession) => {
    writeDemoSession(next);
  }, []);

  const logout = useCallback(() => {
    clearDemoSession();
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAdmin: session?.role === "admin",
      login,
      logout,
      ready,
    }),
    [session, login, logout, ready],
  );

  return (
    <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);
  if (!context) {
    return {
      session: null,
      isAdmin: false,
      login: () => {},
      logout: () => {},
      ready: true,
    };
  }
  return context;
}
