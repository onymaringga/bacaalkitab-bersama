"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  Compass,
  Flame,
  Library,
  MapPinned,
  Scroll,
  ScrollText,
  Search,
  Users,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import {
  flattenGlobalSearchGroups,
  getGlobalSearchSuggestions,
  searchGlobal,
  type GlobalSearchResult,
  type GlobalSearchResultKind,
} from "@/lib/global-search";
import {
  clearGlobalSearchRecent,
  pushGlobalSearchRecent,
  readGlobalSearchRecent,
} from "@/lib/global-search-history";
import { cn } from "@/lib/utils";

type GlobalSearchContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openSearch: () => void;
};

const GlobalSearchContext = createContext<GlobalSearchContextValue | null>(null);

export function useGlobalSearch() {
  const ctx = useContext(GlobalSearchContext);
  if (!ctx) {
    throw new Error("useGlobalSearch must be used within GlobalSearchProvider");
  }
  return ctx;
}

const KIND_ICONS: Record<
  GlobalSearchResultKind,
  typeof BookOpen
> = {
  page: Compass,
  bible: BookOpen,
  book: Scroll,
  character: Users,
  story: ScrollText,
  topic: Compass,
  glossary: Library,
  place: MapPinned,
  custom: Flame,
};

function GlobalSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recent, setRecent] = useState<GlobalSearchResult[]>([]);

  const groups = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed) return searchGlobal(trimmed);
    return getGlobalSearchSuggestions(recent);
  }, [query, recent]);
  const flat = useMemo(() => flattenGlobalSearchGroups(groups), [groups]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
      return;
    }
    setRecent(readGlobalSearchRecent());
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const navigate = useCallback(
    (result: GlobalSearchResult) => {
      pushGlobalSearchRecent(result);
      setRecent(readGlobalSearchRecent());
      onOpenChange(false);
      router.push(result.href);
    },
    [onOpenChange, router],
  );

  const clearRecent = useCallback(() => {
    clearGlobalSearchRecent();
    setRecent([]);
    setSelectedIndex(0);
  }, []);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => Math.min(index + 1, flat.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && flat[selectedIndex]) {
      event.preventDefault();
      navigate(flat[selectedIndex]!);
    }
  }

  let runningIndex = -1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[10%] max-h-[min(80dvh,32rem)] translate-y-0 gap-0 overflow-hidden border-[var(--m-line)] bg-white p-0 sm:max-w-xl"
      >
        <DialogTitle className="sr-only">{copy.globalSearch.title}</DialogTitle>
        <div className="flex items-center gap-2 border-b border-[var(--m-line)] px-3 py-2.5">
          <Search className="size-4 shrink-0 text-[var(--m-ink-soft)]" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={copy.globalSearch.placeholder}
            className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            aria-label={copy.globalSearch.placeholder}
            autoComplete="off"
          />
          <kbd className="hidden shrink-0 rounded-md border border-[var(--m-line)] bg-[var(--m-wash)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--m-ink-soft)] sm:inline">
            esc
          </kbd>
        </div>

        <div className="max-h-[min(60dvh,24rem)] overflow-y-auto overscroll-contain px-2 py-2">
          {!query.trim() && flat.length > 0 ? (
            <p className="px-2 pb-1 text-xs text-[var(--m-ink-soft)]">
              {copy.globalSearch.emptyQueryHint}
            </p>
          ) : null}
          {flat.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-[var(--m-ink-soft)]">
              {query.trim()
                ? copy.globalSearch.noResults
                : copy.globalSearch.emptyQueryHint}
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.id} className="mb-2 last:mb-0">
                <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                  <p className="text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                    {group.label}
                  </p>
                  {group.id === "recent" ? (
                    <button
                      type="button"
                      onClick={clearRecent}
                      className="text-[10px] font-semibold text-[var(--m-accent)] hover:underline"
                    >
                      {copy.globalSearch.clearRecent}
                    </button>
                  ) : null}
                </div>
                <ul>
                  {group.results.map((result) => {
                    runningIndex += 1;
                    const itemIndex = runningIndex;
                    const Icon =
                      group.id === "recent"
                        ? Clock
                        : KIND_ICONS[result.kind];
                    const active = itemIndex === selectedIndex;
                    return (
                      <li key={result.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          onClick={() => navigate(result)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition",
                            active
                              ? "bg-[var(--m-accent)]/10 text-[var(--m-ink)]"
                              : "hover:bg-[var(--m-wash)]/70",
                          )}
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--m-wash)] text-[var(--m-accent)]">
                            <Icon className="size-3.5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">
                              {result.title}
                            </span>
                            {result.subtitle ? (
                              <span className="mt-0.5 block truncate text-xs text-[var(--m-ink-soft)]">
                                {result.subtitle}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => setOpen(true), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <GlobalSearchContext.Provider value={{ open, setOpen, openSearch }}>
      {children}
      <GlobalSearchDialog open={open} onOpenChange={setOpen} />
    </GlobalSearchContext.Provider>
  );
}

export function GlobalSearchIconButton({
  className,
  size = "sm",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const { openSearch } = useGlobalSearch();
  const box = size === "sm" ? "size-9" : "size-10";
  const icon = "size-4";

  return (
    <button
      type="button"
      onClick={openSearch}
      aria-label={copy.globalSearch.title}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl text-[var(--m-ink-soft)] transition-colors hover:bg-[var(--m-wash)]/70 hover:text-[var(--m-ink)]",
        box,
        className,
      )}
    >
      <Search className={icon} />
    </button>
  );
}

export function GlobalSearchTrigger({
  className,
  collapsed = false,
}: {
  className?: string;
  collapsed?: boolean;
}) {
  const { openSearch } = useGlobalSearch();

  return (
    <button
      type="button"
      onClick={openSearch}
      className={cn(
        "flex items-center gap-2 rounded-xl border border-[var(--m-line)] bg-white/90 text-[var(--m-ink-soft)] transition hover:border-[var(--m-accent)]/30 hover:text-[var(--m-ink)]",
        collapsed
          ? "size-10 justify-center"
          : "h-10 w-full px-3 text-left text-sm",
        className,
      )}
      aria-label={copy.globalSearch.title}
    >
      <Search className="size-4 shrink-0" />
      {!collapsed ? (
        <>
          <span className="min-w-0 flex-1 truncate">
            {copy.globalSearch.placeholder}
          </span>
          <kbd className="hidden rounded-md border border-[var(--m-line)] bg-[var(--m-wash)] px-1.5 py-0.5 text-[10px] font-medium sm:inline">
            {copy.globalSearch.shortcutHint}
          </kbd>
        </>
      ) : null}
    </button>
  );
}
