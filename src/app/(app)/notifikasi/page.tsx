"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, HeartHandshake, Megaphone, PenLine } from "lucide-react";

import { showToast } from "@/components/ui/toast-host";
import { copy } from "@/lib/copy";
import { demoNotifications } from "@/lib/demo-data";
import type { DemoNotification } from "@/lib/types";
import { cn } from "@/lib/utils";

const icons = {
  reminder: Bell,
  encouragement: HeartHandshake,
  announcement: Megaphone,
  reflection: PenLine,
} as const;

type NotificationType = DemoNotification["type"];
type FilterValue = "all" | NotificationType;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: copy.notifications.filterAll },
  { value: "reminder", label: copy.notifications.types.reminder },
  { value: "encouragement", label: copy.notifications.types.encouragement },
  { value: "announcement", label: copy.notifications.types.announcement },
  { value: "reflection", label: copy.notifications.types.reflection },
];

export default function NotifikasiPage() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    demoNotifications[0]?.id ?? null,
  );

  const counts = useMemo(() => {
    const next: Record<FilterValue, number> = {
      all: demoNotifications.length,
      reminder: 0,
      encouragement: 0,
      announcement: 0,
      reflection: 0,
    };
    for (const item of demoNotifications) {
      next[item.type] += 1;
    }
    return next;
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return demoNotifications;
    return demoNotifications.filter((item) => item.type === filter);
  }, [filter]);

  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!filtered.some((item) => item.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((item) => item.id === selectedId);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-3 lg:space-y-4">
      <header className="member-web-animate-in">
        <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-[var(--m-accent)] uppercase">
          Inbox
        </p>
        <h1 className="member-web-display mt-1 text-[clamp(1.35rem,2.2vw,1.75rem)] leading-tight text-[var(--m-ink)]">
          {copy.notifications.title}
        </h1>
        <p className="mt-1 text-sm text-[var(--m-ink-soft)]">
          {copy.notifications.subtitle}
        </p>
      </header>

      <div
        role="tablist"
        aria-label={copy.notifications.filterAria}
        className="member-web-animate-in flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {FILTERS.map((item) => {
          const active = filter === item.value;
          const count = counts[item.value];
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(item.value)}
              className={cn(
                "inline-flex h-8 shrink-0 items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold transition-colors",
                active
                  ? "border-[var(--m-accent)] bg-[var(--m-accent)] text-white"
                  : "border-[var(--m-line)] bg-white/90 text-[var(--m-ink-soft)] hover:border-[var(--m-accent)]/35 hover:text-[var(--m-ink)]",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "rounded-md px-1 py-px text-[10px] font-semibold tabular-nums",
                  active
                    ? "bg-white/20 text-white"
                    : "bg-[var(--m-wash)] text-[var(--m-ink-soft)]",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {demoNotifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--m-line)] px-4 py-8 text-center">
          <p className="text-sm font-semibold text-[var(--m-ink)]">
            {copy.notifications.empty}
          </p>
          <p className="mt-1 text-xs text-[var(--m-ink-soft)]">
            {copy.notifications.emptyHint}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--m-line)] px-4 py-8 text-center">
          <p className="text-sm font-semibold text-[var(--m-ink)]">
            {copy.notifications.emptyFilter}
          </p>
          <p className="mt-1 text-xs text-[var(--m-ink-soft)]">
            {copy.notifications.emptyFilterHint}
          </p>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="mt-3 text-xs font-semibold text-[var(--m-accent)] hover:underline"
          >
            Lihat semua notifikasi
          </button>
        </div>
      ) : (
        <div className="member-web-animate-in-delay lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(14rem,0.75fr)] lg:items-start lg:gap-5">
          <ul className="overflow-hidden rounded-xl border border-[var(--m-line)] bg-white/90">
            {filtered.map((item, index) => {
              const Icon = icons[item.type];
              const active = item.id === selectedId;
              return (
                <li
                  key={item.id}
                  className={cn(
                    index > 0 && "border-t border-[var(--m-line)]",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(item.id);
                      showToast(`Membuka: ${item.title}`);
                    }}
                    className={cn(
                      "flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors sm:px-3.5",
                      active
                        ? "bg-[var(--m-wash)]/70"
                        : "hover:bg-[var(--m-wash)]/40",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
                        active
                          ? "bg-[var(--m-accent)] text-white"
                          : "bg-[var(--m-wash)] text-[var(--m-accent)]",
                      )}
                    >
                      <Icon className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-[var(--m-ink)]">
                          {item.title}
                        </p>
                        <span className="shrink-0 text-[10px] text-[var(--m-ink-soft)]">
                          {item.time}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-[var(--m-ink-soft)]">
                        <span className="font-medium text-[var(--m-accent)]">
                          {copy.notifications.types[item.type]}
                        </span>
                        <span className="text-[var(--m-ink-soft)]/50"> · </span>
                        {item.body}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {selected ? (
            <aside className="mt-3 hidden rounded-xl border border-[var(--m-line)] bg-white/90 px-4 py-3.5 lg:sticky lg:top-8 lg:mt-0 lg:block">
              <p className="text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                {copy.notifications.types[selected.type]}
              </p>
              <h2 className="mt-1 text-sm font-semibold text-[var(--m-ink)]">
                {selected.title}
              </h2>
              <p className="mt-0.5 text-[11px] text-[var(--m-ink-soft)]">
                {selected.time}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--m-ink-soft)]">
                {selected.body}
              </p>
            </aside>
          ) : null}

          {selected ? (
            <div className="mt-3 rounded-xl border border-[var(--m-line)] bg-white/90 px-3.5 py-3 lg:hidden">
              <p className="text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                {copy.notifications.types[selected.type]}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--m-ink)]">
                {selected.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--m-ink-soft)]">
                {selected.body}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
