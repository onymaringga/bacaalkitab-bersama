"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";

import { cn } from "@/lib/utils";

type PaperPageFlipProps = {
  pageCount: number;
  pageIndex: number;
  onPageIndexChange: (index: number) => void;
  renderPage: (index: number) => ReactNode;
  className?: string;
};

type PageFlipInstance = {
  loadFromHTML: (items: HTMLElement[]) => void;
  destroy: () => void;
  update: () => void;
  flip: (pageNum: number, corner?: "top" | "bottom") => void;
  turnToPage: (pageNum: number) => void;
  getCurrentPageIndex: () => number;
  on: (
    event: string,
    callback: (e: { data: number | string }) => void,
  ) => void;
};

function fillHostStyles(host: HTMLElement) {
  host.style.width = "100%";
  host.style.height = "100%";
  host.style.minHeight = "100%";
  const wrapper = host.querySelector(".stf__wrapper") as HTMLElement | null;
  if (wrapper) {
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";
    wrapper.style.paddingBottom = "0";
  }
  const block = host.querySelector(".stf__block") as HTMLElement | null;
  if (block) {
    block.style.width = "100%";
    block.style.height = "100%";
  }
}

/**
 * Fullscreen page turn via StPageFlip — satu halaman mengisi area baca.
 * Fallback scroll jika engine gagal init.
 */
export function PaperPageFlip({
  pageCount,
  pageIndex,
  onPageIndexChange,
  renderPage,
  className,
}: PaperPageFlipProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlipInstance | null>(null);
  const rootsRef = useRef<Root[]>([]);
  const syncingRef = useRef(false);
  const pageIndexRef = useRef(pageIndex);
  const onChangeRef = useRef(onPageIndexChange);
  const renderPageRef = useRef(renderPage);
  const builtSizeRef = useRef({ w: 0, h: 0 });
  const [layoutKey, setLayoutKey] = useState(0);
  const [engineFailed, setEngineFailed] = useState(false);

  pageIndexRef.current = pageIndex;
  onChangeRef.current = onPageIndexChange;
  renderPageRef.current = renderPage;

  const safeCount = Math.max(0, pageCount);

  // Keep React page content fresh (cover / font / ayat) without rebuilding flip engine
  useEffect(() => {
    if (engineFailed) return;
    rootsRef.current.forEach((root, index) => {
      try {
        root.render(
          <div className="h-full w-full overflow-hidden">
            {renderPageRef.current(index)}
          </div>,
        );
      } catch {
        /* ignore stale root */
      }
    });
  });

  // Build / rebuild book when page count or viewport size changes
  useEffect(() => {
    if (engineFailed) return;
    const container = containerRef.current;
    if (!container || safeCount < 1) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    let pageFlip: PageFlipInstance | null = null;
    const localRoots: Root[] = [];

    void (async () => {
      try {
        const { PageFlip } = await import(
          "page-flip/dist/js/page-flip.module.js"
        );
        if (cancelled || !containerRef.current) return;

        const shell = containerRef.current;
        shell.innerHTML = "";

        const host = document.createElement("div");
        host.className = "paper-flip-host";
        fillHostStyles(host);
        shell.appendChild(host);

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
        if (cancelled || !containerRef.current) return;

        const width = Math.max(280, Math.floor(shell.clientWidth || 360));
        const height = Math.max(360, Math.floor(shell.clientHeight || 560));
        builtSizeRef.current = { w: width, h: height };

        const pageEls: HTMLElement[] = [];

        for (let index = 0; index < safeCount; index += 1) {
          const page = document.createElement("div");
          page.className = "paper-flip-page";
          page.dataset.density =
            index === 0 || index === safeCount - 1 ? "hard" : "soft";
          page.style.background = "#f7f1e4";
          pageEls.push(page);

          const root = createRoot(page);
          root.render(
            <div className="h-full w-full overflow-hidden">
              {renderPageRef.current(index)}
            </div>,
          );
          localRoots.push(root);
        }

        rootsRef.current = localRoots;

        // Biarkan React commit DOM sebelum StPageFlip mengukur halaman
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
        if (cancelled || !containerRef.current) return;

        const startPage = Math.min(
          Math.max(0, pageIndexRef.current),
          safeCount - 1,
        );

        // minWidth = lebar parent → selalu 1 halaman (bukan spread 2 kolom)
        pageFlip = new PageFlip(host, {
          width,
          height,
          size: "stretch",
          minWidth: width,
          maxWidth: width,
          minHeight: height,
          maxHeight: height,
          drawShadow: true,
          flippingTime: 850,
          usePortrait: true,
          autoSize: false,
          maxShadowOpacity: 0.35,
          showCover: true,
          mobileScrollSupport: false,
          swipeDistance: 35,
          showPageCorners: true,
          disableFlipByClick: false,
          useMouseEvents: true,
          clickEventForward: true,
          startPage,
        }) as unknown as PageFlipInstance;

        pageFlip.loadFromHTML(pageEls);
        fillHostStyles(host);

        pageFlip.on("flip", (event) => {
          const next =
            typeof event.data === "number" ? event.data : Number(event.data);
          if (!Number.isFinite(next)) return;
          if (syncingRef.current) {
            syncingRef.current = false;
            return;
          }
          onChangeRef.current(next);
        });

        if (cancelled) {
          try {
            pageFlip.destroy();
          } catch {
            /* ignore */
          }
          return;
        }

        flipRef.current = pageFlip;
        try {
          pageFlip.update();
        } catch {
          /* ignore */
        }
        fillHostStyles(host);

        let resizeTimer = 0;
        resizeObserver = new ResizeObserver(() => {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(() => {
            if (cancelled || !containerRef.current) return;
            const nextW = Math.floor(containerRef.current.clientWidth);
            const nextH = Math.floor(containerRef.current.clientHeight);
            const prev = builtSizeRef.current;
            if (
              Math.abs(nextW - prev.w) > 24 ||
              Math.abs(nextH - prev.h) > 24
            ) {
              setLayoutKey((value) => value + 1);
              return;
            }
            try {
              flipRef.current?.update();
            } catch {
              /* ignore */
            }
            fillHostStyles(host);
          }, 140);
        });
        resizeObserver.observe(shell);
      } catch {
        if (!cancelled) setEngineFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();

      const active = pageFlip ?? flipRef.current;
      flipRef.current = null;
      rootsRef.current = [];

      try {
        active?.destroy();
      } catch {
        /* ignore */
      }

      window.setTimeout(() => {
        localRoots.forEach((root) => {
          try {
            root.unmount();
          } catch {
            /* ignore */
          }
        });
      }, 0);

      if (container) container.innerHTML = "";
    };
  }, [safeCount, layoutKey, engineFailed]);

  // External navigation (buttons / keyboard) → animated flip
  useEffect(() => {
    if (engineFailed) return;
    const instance = flipRef.current;
    if (!instance) return;

    try {
      const current = instance.getCurrentPageIndex();
      if (current === pageIndex) return;

      syncingRef.current = true;
      if (Math.abs(current - pageIndex) === 1) {
        instance.flip(pageIndex, "top");
      } else {
        instance.turnToPage(pageIndex);
        syncingRef.current = false;
      }
    } catch {
      syncingRef.current = false;
      try {
        instance.turnToPage(pageIndex);
      } catch {
        /* ignore */
      }
    }
  }, [pageIndex, engineFailed]);

  if (safeCount < 1) {
    return (
      <div
        className={cn(
          "relative flex h-full min-h-0 w-full flex-1 items-center justify-center text-sm text-white/60",
          className,
        )}
      >
        Tidak ada halaman
      </div>
    );
  }

  if (engineFailed) {
    const clamped = Math.min(Math.max(0, pageIndex), safeCount - 1);
    return (
      <div
        className={cn(
          "relative h-full min-h-0 w-full flex-1 overflow-hidden",
          className,
        )}
      >
        <div className="h-full w-full overflow-hidden">{renderPage(clamped)}</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full min-h-0 w-full flex-1 overflow-hidden [&_.stf__parent]:!h-full [&_.stf__parent]:!w-full [&_.stf__wrapper]:!h-full [&_.stf__wrapper]:!w-full [&_.stf__wrapper]:!p-0 [&_.stf__block]:!h-full [&_.stf__block]:!w-full",
        className,
      )}
    />
  );
}
