import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/** Lazy-load view berat — skeleton dari `(app)/loading.tsx`, bukan duplikat di sini. */
export function lazyView(
  importFn: () => Promise<{ default: ComponentType }>,
) {
  return dynamic(importFn);
}
