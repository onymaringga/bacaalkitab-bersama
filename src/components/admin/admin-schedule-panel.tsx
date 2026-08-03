"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  CalendarRange,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PassageMultiPicker } from "@/components/admin/passage-multi-picker";
import { showToast } from "@/components/ui/toast-host";
import { copy } from "@/lib/copy";
import { formatShortDate } from "@/lib/format-date";
import {
  demoProgramScheduleMeta,
  demoSchedule,
} from "@/lib/reading-progress";
import { getScheduleDayDetail } from "@/lib/schedule-day-detail";
import { cn } from "@/lib/utils";

function dayNumber(dateKey: string) {
  const start = parseISO(demoProgramScheduleMeta.startDate);
  const current = parseISO(dateKey);
  return (
    Math.round((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
    1
  );
}

function weekdayLabel(dateKey: string) {
  return format(parseISO(dateKey), "EEE", { locale: localeId });
}

type ScheduleForm = {
  date: string;
  passages: string[];
  prompt: string;
};

const emptyForm: ScheduleForm = {
  date: "",
  passages: [],
  prompt: "",
};

export function AdminSchedulePanel() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ScheduleForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const todayRowRef = useRef<HTMLTableRowElement | null>(null);

  const sorted = useMemo(
    () =>
      [...demoSchedule].sort((a, b) =>
        a.scheduledDate.localeCompare(b.scheduledDate),
      ),
    [],
  );

  const rows = useMemo(() => {
    return sorted.map((item) => {
      const detail = getScheduleDayDetail(item.scheduledDate);
      return {
        ...item,
        day: dayNumber(item.scheduledDate),
        pct: detail?.completionPct ?? null,
        completed: detail?.completedCount ?? 0,
        total: detail?.totalCount ?? 0,
      };
    });
  }, [sorted]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (item) =>
        item.passage.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.scheduledDate.includes(q),
    );
  }, [query, rows]);

  useEffect(() => {
    if (query.trim()) return;
    todayRowRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [query]);

  function closeModal() {
    setOpen(false);
    setForm(emptyForm);
    setError(null);
  }

  function updateField<K extends keyof ScheduleForm>(
    key: K,
    value: ScheduleForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  }

  async function handlePublish() {
    if (!form.date.trim()) {
      setError("Tanggal wajib diisi.");
      return;
    }
    if (form.passages.length === 0) {
      setError("Pilih minimal satu pasal Alkitab.");
      return;
    }

    setSaving(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    setSaving(false);
    showToast(`Bacaan diterbitkan · ${form.passages.join(" · ")}`);
    closeModal();
  }

  const rangeLabel = `${formatShortDate(demoProgramScheduleMeta.startDate)} – ${formatShortDate(demoProgramScheduleMeta.endDate)}`;

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90">
        <div className="flex flex-col gap-4 border-b border-[var(--a-line)] bg-[var(--a-wash)]/60 px-4 py-4 sm:flex-row sm:items-end sm:justify-between lg:px-5">
          <div>
            <p className="admin-kicker text-[var(--a-accent)]">Rencana program</p>
            <h3 className="admin-display mt-1.5 text-xl text-[var(--a-ink)] lg:text-2xl">
              Jadwal baca harian
            </h3>
            <p className="mt-1.5 flex items-center gap-2 text-sm text-[var(--a-ink-soft)]">
              <CalendarRange className="size-4 shrink-0 text-[var(--a-accent)]" />
              {rangeLabel}
            </p>
            <p className="mt-2 text-xs text-[var(--a-ink-soft)]">
              Klik baris untuk lihat detail peserta & refleksi.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="rounded-xl border border-[var(--a-line)] bg-white px-3.5 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--a-ink-soft)]">
                  Total hari
                </p>
                <p className="admin-display text-lg text-[var(--a-ink)]">
                  {demoProgramScheduleMeta.totalDays}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--a-line)] bg-white px-3.5 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--a-ink-soft)]">
                  Rencana
                </p>
                <p className="text-sm font-semibold text-[var(--a-ink)]">
                  {demoProgramScheduleMeta.planName}
                </p>
              </div>
            </div>
            <Button
              type="button"
              className="h-10 gap-2 rounded-xl bg-[var(--a-accent)] font-semibold text-white hover:bg-[#2563eb]"
              onClick={() => setOpen(true)}
            >
              <Plus className="size-4" />
              {copy.admin.schedule.title}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-[var(--a-line)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-5">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--a-ink-soft)]" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari pasal atau tanggal…"
              className="rounded-xl border-[var(--a-line)] bg-white pl-9"
            />
          </div>
          <p className="text-xs text-[var(--a-ink-soft)]">
            Menampilkan {filtered.length} dari {sorted.length} hari
          </p>
        </div>

        <div className="max-h-[min(62dvh,40rem)] overflow-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-[var(--a-paper)] text-[11px] font-semibold tracking-wide text-[var(--a-ink-soft)] uppercase shadow-[0_1px_0_var(--a-line)]">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-semibold lg:px-5">
                  Hari
                </th>
                <th className="whitespace-nowrap px-3 py-3 font-semibold">
                  Tanggal
                </th>
                <th className="whitespace-nowrap px-3 py-3 font-semibold">
                  Pasal
                </th>
                <th className="px-3 py-3 font-semibold">Judul</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold lg:px-5">
                  Sudah baca
                </th>
                <th className="w-10 px-2 py-3" aria-hidden />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const isToday = item.scheduledDate === todayKey;
                return (
                  <tr
                    key={item.id}
                    ref={isToday ? todayRowRef : undefined}
                    role="link"
                    tabIndex={0}
                    onClick={() =>
                      router.push(`/admin/jadwal/${item.scheduledDate}`)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(`/admin/jadwal/${item.scheduledDate}`);
                      }
                    }}
                    className={cn(
                      "cursor-pointer border-b border-[var(--a-line)] last:border-b-0 outline-none transition-colors",
                      "hover:bg-[var(--a-wash)]/70 focus-visible:bg-[var(--a-wash)]",
                      isToday ? "bg-[var(--a-wash)]" : "bg-white",
                    )}
                  >
                    <td className="px-4 py-3.5 align-middle lg:px-5">
                      <span
                        className={cn(
                          "inline-flex min-w-10 items-center justify-center rounded-lg px-2 py-1 font-mono text-xs font-semibold",
                          isToday
                            ? "bg-[var(--a-accent)] text-white"
                            : "bg-[var(--a-wash)] text-[var(--a-ink)]",
                        )}
                      >
                        {String(item.day).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 align-middle">
                      <p className="font-medium text-[var(--a-ink)]">
                        {formatShortDate(item.scheduledDate)}
                      </p>
                      <p className="text-xs capitalize text-[var(--a-ink-soft)]">
                        {weekdayLabel(item.scheduledDate)}
                        {isToday ? " · Hari ini" : ""}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 align-middle">
                      <p className="font-semibold text-[var(--a-accent)]">
                        {item.passage}
                      </p>
                    </td>
                    <td className="max-w-[14rem] px-3 py-3.5 align-middle">
                      <p className="truncate text-[var(--a-ink)]">
                        {item.title.replace(/^Hari \d+ — /, "")}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 align-middle lg:px-5">
                      {item.pct === null ? (
                        <p className="text-xs text-[var(--a-ink-soft)]">—</p>
                      ) : (
                        <div className="w-[7.5rem]">
                          <div className="flex items-baseline justify-between gap-2">
                            <p
                              className={cn(
                                "admin-display text-base leading-none",
                                item.pct >= 75
                                  ? "text-[var(--status-success-text)]"
                                  : item.pct >= 50
                                    ? "text-[var(--a-accent)]"
                                    : "text-[var(--status-danger-text)]",
                              )}
                            >
                              {item.pct}%
                            </p>
                            <p className="text-[11px] text-[var(--a-ink-soft)]">
                              {item.completed}/{item.total}
                            </p>
                          </div>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--a-wash)]">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                item.pct >= 75
                                  ? "bg-[var(--status-success-text)]"
                                  : item.pct >= 50
                                    ? "bg-[var(--a-accent)]"
                                    : "bg-[var(--status-danger-text)]",
                              )}
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-3.5 align-middle text-[var(--a-ink-soft)]">
                      <ChevronRight className="size-4" />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-[var(--a-ink-soft)]"
                  >
                    Tidak ada bacaan yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) closeModal();
          else setOpen(true);
        }}
      >
        <DialogContent
          showCloseButton
          className="gap-0 overflow-hidden p-0 sm:max-w-xl"
        >
          <DialogHeader className="space-y-1 border-b border-[var(--a-line)] px-5 py-4 pr-12 text-left">
            <DialogTitle className="text-base font-semibold text-[var(--a-ink)]">
              {copy.admin.schedule.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-[var(--a-ink-soft)]">
              {copy.admin.schedule.description}
            </DialogDescription>
          </DialogHeader>

          <form
            className="max-h-[min(70dvh,36rem)] space-y-4 overflow-y-auto px-5 py-4"
            onSubmit={(event) => {
              event.preventDefault();
              void handlePublish();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="modal-admin-date">
                {copy.admin.schedule.date}
              </Label>
              <Input
                id="modal-admin-date"
                type="date"
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
                className="h-11 rounded-xl"
              />
            </div>

            <PassageMultiPicker
              label={copy.admin.schedule.passage}
              value={form.passages}
              onChange={(passages) => updateField("passages", passages)}
            />

            <div className="space-y-1.5">
              <Label htmlFor="modal-admin-prompt">
                {copy.admin.schedule.reflectionPrompt}
              </Label>
              <Input
                id="modal-admin-prompt"
                value={form.prompt}
                onChange={(event) => updateField("prompt", event.target.value)}
                placeholder={copy.admin.schedule.reflectionPlaceholder}
                className="h-11 rounded-xl"
              />
            </div>

            {error ? (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              >
                {error}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-2 border-t border-[var(--a-line)] pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl"
                onClick={closeModal}
                disabled={saving}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className={cn(
                  "h-10 rounded-xl bg-[var(--a-accent)] font-semibold text-white hover:bg-[#2563eb]",
                  saving && "opacity-80",
                )}
              >
                {saving ? "Menyimpan…" : copy.admin.schedule.publish}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
