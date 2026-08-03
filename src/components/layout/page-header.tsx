"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { InfoTooltip } from "@/components/ui/info-tooltip";
import { copy } from "@/lib/copy";

type PageHeaderProps = {
  title?: string;
  /** Teks bantuan — hanya di tooltip, bukan di layar */
  hint?: string;
  eyebrow?: string;
  /** Fallback jika tidak ada riwayat browser di dalam app. */
  backHref?: string;
  backLabel?: string;
  /** Jika true (default saat ada backHref), tombol kembali memakai history.back(). */
  useHistoryBack?: boolean;
  action?: React.ReactNode;
};

export function PageHeader({
  title,
  hint,
  eyebrow,
  backHref,
  backLabel = copy.common.back,
  useHistoryBack = true,
  action,
}: PageHeaderProps) {
  const router = useRouter();
  const showTitleBlock = Boolean(title || eyebrow || action);
  const showBack = Boolean(backHref);

  function handleBack() {
    if (!backHref) return;
    if (useHistoryBack && typeof window !== "undefined") {
      try {
        const ref = document.referrer;
        const fromApp =
          window.history.length > 1 &&
          (!ref || new URL(ref).origin === window.location.origin);
        if (fromApp) {
          router.back();
          return;
        }
      } catch {
        /* ignore */
      }
    }
    router.push(backHref);
  }

  return (
    <header className={showTitleBlock ? "mb-5 space-y-2" : "mb-4"}>
      {showBack ? (
        useHistoryBack ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {backLabel}
          </button>
        ) : (
          <Link
            href={backHref!}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {backLabel}
          </Link>
        )
      ) : null}

      {showTitleBlock ? (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            {eyebrow ? (
              <p className="text-xs font-medium text-muted-foreground">{eyebrow}</p>
            ) : null}
            {title ? (
              <div className="flex items-center gap-1.5">
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground">
                  {title}
                </h1>
                {hint ? (
                  <InfoTooltip content={hint} label={`Info: ${title}`} />
                ) : null}
              </div>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
    </header>
  );
}
