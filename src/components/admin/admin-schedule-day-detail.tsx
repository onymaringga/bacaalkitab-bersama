"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  CheckCircle2,
  Circle,
  MessageSquareText,
  PenLine,
  Users,
  XCircle,
} from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { ScheduleDevotionalEditor } from "@/components/schedule/schedule-devotional-editor";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LoadingModal } from "@/components/ui/loading-screen";
import {
  SendReminderButton,
  SendReminderDialog,
} from "@/components/ui/send-reminder-dialog";
import { demoProgram } from "@/lib/demo-data";
import { formatDisplayDate, formatShortDate } from "@/lib/format-date";
import {
  authorRoleLabel,
  subscribeScheduleDevotionals,
} from "@/lib/schedule-devotional";
import {
  getScheduleDayDetail,
  visibilityLabel,
  type ScheduleDayParticipant,
  type ScheduleDayReflection,
} from "@/lib/schedule-day-detail";
import type { MemberReadingDayStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<MemberReadingDayStatus, string> = {
  completed: "Sudah baca",
  pending: "Belum baca",
  missed: "Terlewat",
};

function incompleteReminderMessage(passage: string, count: number) {
  return `Hai teman-teman,

Pengingat lembut untuk ${count} peserta yang belum menyelesaikan bacaan.

Pasal: ${passage}.

Luangkan waktu singkat untuk Firman — kami mendoakanmu.`;
}

function personalIncompleteReminder(name: string, passage: string) {
  return `Hai ${name},

Pengingat lembut untuk bacaan yang belum selesai: ${passage}.

Luangkan waktu singkat untuk Firman — kami mendoakanmu.`;
}

type AdminScheduleDayDetailProps = {
  date: string;
};

export function AdminScheduleDayDetail({ date }: AdminScheduleDayDetailProps) {
  const router = useRouter();
  const { session, isAdmin, ready, logout } = useDemoAuth();
  const [version, setVersion] = useState(0);
  const detail = useMemo(() => getScheduleDayDetail(date), [date, version]);
  const [filter, setFilter] = useState<"all" | MemberReadingDayStatus>("all");
  const [bulkRemindOpen, setBulkRemindOpen] = useState(false);
  const [devotionalOpen, setDevotionalOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!isAdmin) router.replace("/login");
  }, [ready, isAdmin, router]);

  useEffect(() => {
    return subscribeScheduleDevotionals(() => {
      setVersion((current) => current + 1);
    });
  }, []);

  if (!ready || !isAdmin || !session) {
    return (
      <LoadingModal
        label="Memuat detail jadwal"
        hint="Menyiapkan status peserta dan refleksi…"
      />
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!detail) {
    return (
      <AdminShell
        session={session}
        onLogout={handleLogout}
        activeNav="schedule"
      >
        <BackLink />
        <div className="mt-6 rounded-2xl border border-[var(--a-line)] bg-white/90 p-6">
          <h1 className="admin-display text-2xl text-[var(--a-ink)]">
            Jadwal tidak ditemukan
          </h1>
          <p className="mt-2 text-sm text-[var(--a-ink-soft)]">
            Tidak ada bacaan untuk tanggal ini.
          </p>
        </div>
      </AdminShell>
    );
  }

  const filteredParticipants =
    filter === "all"
      ? detail.participants
      : detail.participants.filter((p) => p.status === filter);

  const incompleteParticipants = detail.participants.filter(
    (p) => p.status === "pending" || p.status === "missed",
  );
  const incompleteCount = incompleteParticipants.length;

  return (
    <AdminShell session={session} onLogout={handleLogout} activeNav="schedule">
      <BackLink />

      <header className="mt-5 mb-5 lg:mt-2 lg:mb-6">
        <p className="admin-kicker text-[var(--a-accent)]">
          {demoProgram.organization}
        </p>
        <p className="mt-1 text-xs text-[var(--a-ink-soft)]">
          Detail jadwal
          {detail.isToday ? " · Hari ini" : ""}
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90">
        <div className="border-b border-[var(--a-line)] bg-[var(--a-wash)]/70 px-5 py-6 md:px-7">
          <h1 className="admin-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-[var(--a-ink)]">
            {detail.schedule.passage}
          </h1>
          <p className="mt-2 text-sm text-[var(--a-ink-soft)]">
            {formatDisplayDate(detail.schedule.scheduledDate)} ·{" "}
            {detail.schedule.title.replace(/^Hari \d+ — /, "")}
          </p>
          {detail.schedule.reflectionPrompt ? (
            <p className="mt-4 max-w-2xl rounded-xl border border-[var(--a-line)] bg-white/80 px-3.5 py-3 text-sm leading-relaxed text-[var(--a-ink)]">
              <span className="font-semibold text-[var(--a-accent)]">
                Pertanyaan refleksi:{" "}
              </span>
              {detail.schedule.reflectionPrompt}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-0 md:grid-cols-4">
          <StatCell
            label="Sudah baca"
            value={
              detail.completionPct === null
                ? "—"
                : `${detail.completionPct}%`
            }
            hint={`${detail.completedCount}/${detail.totalCount}`}
          />
          <StatCell
            label="Selesai"
            value={String(detail.completedCount)}
            className="md:border-l md:border-[var(--a-line)]"
          />
          <StatCell
            label="Belum / pending"
            value={String(detail.pendingCount)}
            className="border-t border-[var(--a-line)] md:border-t-0 md:border-l"
          />
          <StatCell
            label="Terlewat"
            value={String(detail.missedCount)}
            className="border-t border-[var(--a-line)] md:border-t-0 md:border-l"
          />
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90 lg:mt-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--a-line)] bg-[var(--a-wash)]/60 px-4 py-3.5 lg:px-5">
          <div className="flex items-start gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--a-accent)]">
              <PenLine className="size-4" />
            </div>
            <div>
              <h2 className="admin-display text-lg text-[var(--a-ink)]">
                Renungan
              </h2>
              <p className="mt-0.5 text-xs text-[var(--a-ink-soft)]">
                Ditulis admin atau ketua kelompok — tampil untuk peserta.
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            className="h-9 gap-1.5 rounded-xl bg-[var(--a-accent)] font-semibold text-white hover:bg-[#2563eb]"
            onClick={() => setDevotionalOpen(true)}
          >
            <PenLine className="size-3.5" />
            {detail.officialDevotional || detail.schedule.devotional
              ? "Edit renungan"
              : "Tulis renungan"}
          </Button>
        </div>
        <div className="px-4 py-4 lg:px-5">
          {detail.schedule.devotional ? (
            <>
              <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--a-ink)]">
                {detail.schedule.devotional}
              </p>
              {detail.officialDevotional ? (
                <p className="mt-3 text-xs text-[var(--a-ink-soft)]">
                  Ditulis oleh {detail.officialDevotional.authorName} ·{" "}
                  {authorRoleLabel(detail.officialDevotional.authorRole)}
                </p>
              ) : (
                <p className="mt-3 text-xs text-[var(--a-ink-soft)]">
                  Renungan bawaan program — bisa diganti.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-[var(--a-ink-soft)]">
              Belum ada renungan untuk jadwal ini. Tulis agar peserta punya
              bahan renungan.
            </p>
          )}
        </div>
      </section>

      {detail.isFuture ? (
        <p className="mt-6 rounded-2xl border border-[var(--a-line)] bg-white/90 px-5 py-4 text-sm text-[var(--a-ink-soft)]">
          Hari ini belum tiba. Status baca dan refleksi akan muncul setelah
          tanggalnya lewat.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-5 lg:gap-5">
          <section className="rounded-2xl border border-[var(--a-line)] bg-white/90 p-5 lg:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--a-wash)] text-[var(--a-accent)]">
                  <Users className="size-4" />
                </div>
                <div>
                  <h2 className="admin-display text-lg text-[var(--a-ink)]">
                    Peserta
                  </h2>
                  <p className="mt-0.5 text-xs text-[var(--a-ink-soft)]">
                    Status baca {formatShortDate(date)}
                  </p>
                </div>
              </div>
              {incompleteCount > 0 ? (
                <Button
                  type="button"
                  size="sm"
                  className="h-9 shrink-0 gap-1.5 rounded-xl bg-[var(--a-accent)] font-semibold text-white hover:bg-[#2563eb]"
                  onClick={() => setBulkRemindOpen(true)}
                >
                  <Bell className="size-3.5" />
                  Ingatkan ({incompleteCount})
                </Button>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {(
                [
                  ["all", "Semua"],
                  ["completed", "Selesai"],
                  ["pending", "Pending"],
                  ["missed", "Terlewat"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                    filter === key
                      ? "bg-[var(--a-accent)] text-white"
                      : "bg-[var(--a-wash)] text-[var(--a-ink-soft)] hover:text-[var(--a-ink)]",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <ul className="mt-4 max-h-[28rem] space-y-2 overflow-auto pr-1">
              {filteredParticipants.map((person) => (
                <ParticipantRow
                  key={person.id}
                  person={person}
                  passage={detail.schedule.passage}
                />
              ))}
              {filteredParticipants.length === 0 ? (
                <li className="py-6 text-center text-sm text-[var(--a-ink-soft)]">
                  Tidak ada peserta di filter ini.
                </li>
              ) : null}
            </ul>
          </section>

          <section className="rounded-2xl border border-[var(--a-line)] bg-white/90 p-5 lg:col-span-3">
            <div className="flex items-start gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--a-wash)] text-[var(--a-accent)]">
                <MessageSquareText className="size-4" />
              </div>
              <div>
                <h2 className="admin-display text-lg text-[var(--a-ink)]">
                  Refleksi peserta
                </h2>
                <p className="mt-0.5 text-xs text-[var(--a-ink-soft)]">
                  {detail.reflections.length} renungan untuk hari ini
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {detail.reflections.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--a-line)] px-4 py-10 text-center">
                  <BookOpen className="mx-auto size-5 text-[var(--a-ink-soft)]" />
                  <p className="mt-3 text-sm text-[var(--a-ink-soft)]">
                    Belum ada refleksi yang dibagikan untuk bacaan ini.
                  </p>
                </div>
              ) : (
                detail.reflections.map((item) => (
                  <ReflectionCard key={item.id} item={item} />
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {incompleteCount > 0 ? (
        <SendReminderDialog
          open={bulkRemindOpen}
          onOpenChange={setBulkRemindOpen}
          recipientName={`${incompleteCount} peserta`}
          recipientLabel={`${incompleteCount} peserta yang belum selesai`}
          recipientEmail={incompleteParticipants.map((p) => p.email)}
          recipientPhone={incompleteParticipants
            .map((p) => p.phone)
            .filter(Boolean) as string[]}
          defaultMessage={incompleteReminderMessage(
            detail.schedule.passage,
            incompleteCount,
          )}
          successMessage={`Pengingat terkirim via email ke ${incompleteCount} peserta yang belum selesai`}
        />
      ) : null}

      <ScheduleDevotionalEditor
        open={devotionalOpen}
        onOpenChange={setDevotionalOpen}
        dateKey={date}
        passage={detail.schedule.passage}
        authorRole="admin"
        authorName={session.name}
        seedContent={
          detail.officialDevotional?.content || detail.schedule.devotional
        }
      />
    </AdminShell>
  );
}

function BackLink() {
  return (
    <Link
      href="/admin?tab=schedule"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--a-accent)] transition-colors hover:text-[#2563eb]"
    >
      <ArrowLeft className="size-4" />
      Kembali ke jadwal baca
    </Link>
  );
}

function StatCell({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("px-5 py-4 md:px-6", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--a-ink-soft)]">
        {label}
      </p>
      <p className="admin-display mt-1 text-2xl text-[var(--a-ink)]">{value}</p>
      {hint ? (
        <p className="mt-0.5 text-xs text-[var(--a-ink-soft)]">{hint}</p>
      ) : null}
    </div>
  );
}

function ParticipantRow({
  person,
  passage,
}: {
  person: ScheduleDayParticipant;
  passage: string;
}) {
  const needsReminder =
    person.status === "pending" || person.status === "missed";

  return (
    <li className="flex items-center gap-2.5 rounded-xl border border-[var(--a-line)] bg-[var(--a-paper)]/50 px-3 py-2.5">
      <Avatar className="size-9 shrink-0">
        <AvatarFallback className="bg-[var(--a-wash)] text-xs font-bold text-[var(--a-accent)]">
          {person.initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <Link
          href={`/admin/users/${person.id}`}
          className="truncate text-sm font-semibold text-[var(--a-ink)] hover:text-[var(--a-accent)]"
        >
          {person.name}
        </Link>
        <p className="truncate text-[11px] text-[var(--a-ink-soft)]">
          {person.groupName}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {needsReminder ? (
          <SendReminderButton
            recipientName={person.name}
            recipientEmail={person.email}
            recipientPhone={person.phone}
            defaultMessage={personalIncompleteReminder(person.name, passage)}
            successMessage={`Pengingat terkirim ke ${person.name}`}
            variant="outline"
            size="icon-sm"
            className="size-8 rounded-lg border-[var(--a-line)] text-[var(--a-accent)] hover:bg-[var(--a-wash)]"
          >
            <Bell className="size-3.5" />
            <span className="sr-only">Ingatkan {person.name}</span>
          </SendReminderButton>
        ) : null}
        <StatusIcon status={person.status} />
      </div>
    </li>
  );
}

function StatusIcon({ status }: { status: MemberReadingDayStatus }) {
  if (status === "completed") {
    return (
      <span title={STATUS_LABEL[status]}>
        <CheckCircle2 className="size-4 text-[var(--status-success-text)]" />
      </span>
    );
  }
  if (status === "missed") {
    return (
      <span title={STATUS_LABEL[status]}>
        <XCircle className="size-4 text-[var(--status-danger-text)]" />
      </span>
    );
  }
  return (
    <span title={STATUS_LABEL[status]}>
      <Circle className="size-4 text-[var(--a-ink-soft)]" />
    </span>
  );
}

function ReflectionCard({ item }: { item: ScheduleDayReflection }) {
  return (
    <article className="rounded-xl border border-[var(--a-line)] bg-[var(--a-paper)]/50 p-4">
      <div className="flex items-start gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="bg-[var(--a-wash)] text-xs font-bold text-[var(--a-accent)]">
            {item.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/users/${item.memberId}`}
              className="text-sm font-semibold text-[var(--a-ink)] hover:text-[var(--a-accent)]"
            >
              {item.memberName}
            </Link>
            <span className="rounded-md bg-[var(--a-wash)] px-2 py-0.5 text-[10px] font-semibold text-[var(--a-ink-soft)]">
              {visibilityLabel(item.visibility)}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-[var(--a-ink-soft)]">
            {item.groupName}
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-[var(--a-ink)]">
            {item.content}
          </p>
        </div>
      </div>
    </article>
  );
}
