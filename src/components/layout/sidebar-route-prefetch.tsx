"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/** Rute utama sidebar — di-prefetch supaya pindah menu terasa instan. */
export const SIDEBAR_PREFETCH_ROUTES = [
  "/dashboard",
  "/baca",
  "/jadwal",
  "/explore",
  "/jurnal",
  "/kelompok",
] as const;

const PREFETCH_STAGGER_MS = 60;

export function prefetchSidebarRoute(
  router: { prefetch: (href: string) => void },
  href: string,
) {
  router.prefetch(href);
}

function staggerPrefetch(
  router: { prefetch: (href: string) => void },
  routes: readonly string[],
  startIndex = 0,
) {
  return routes.map((href, index) =>
    window.setTimeout(
      () => router.prefetch(href),
      (startIndex + index) * PREFETCH_STAGGER_MS,
    ),
  );
}

export function SidebarRoutePrefetch({
  routes = SIDEBAR_PREFETCH_ROUTES,
}: {
  routes?: readonly string[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const ordered = [
      ...routes.filter((href) => href !== pathname),
      ...routes.filter((href) => href === pathname),
    ];
    const timers = staggerPrefetch(router, ordered);

    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [router, routes, pathname]);

  return null;
}
