"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Eye,
  Layers,
  Search,
  Target,
  Users,
} from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { CertificatePreviewDialog } from "@/components/admin/certificate-preview-dialog";
import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingModal } from "@/components/ui/loading-screen";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatShortDate } from "@/lib/format-date";
import { getProgramById } from "@/lib/program-history";
import {
  CERTIFICATE_CATEGORY_LABEL,
  getInitials,
  getProgramDetailInsights,
  getProgramParticipantStats,
  getProgramParticipants,
  type CertificateCategory,
  type ProgramGroupBreakdown,
  type ProgramParticipant,
} from "@/lib/program-participants";
import { cn } from "@/lib/utils";

type AdminProgramDetailProps = {
  programId: string;
};

type DetailListTab = "groups" | "participants";

type ParticipantFilter =
  | "all"
  | "graduated"
  | "incomplete"
  | CertificateCategory;

const FILTERS: { id: ParticipantFilter; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "graduated", label: "Lulus" },
  { id: "incomplete", label: "Belum lulus" },
  { id: "completion", label: "Penyelesaian penuh" },
  { id: "participation", label: "Partisipasi aktif" },
  { id: "leader", label: "Penghargaan ketua" },
];

const GRADUATION_CRITERIA = [
  {
    id: "completion" as const,
    title: "Penyelesaian penuh",
    threshold: "≥ 85%",
    detail: "Hampir seluruh jadwal bacaan diselesaikan dengan konsisten.",
  },
  {
    id: "participation" as const,
    title: "Partisipasi aktif",
    threshold: "≥ 55%",
    detail: "Aktif mengikuti program meski belum penyelesaian penuh.",
  },
  {
    id: "leader" as const,
    title: "Penghargaan ketua",
    threshold: "Ketua · ≥ 70%",
    detail: "Ketua yang menjaga ritme bacaan dan mendampingi anggota.",
  },
];

export function AdminProgramDetail({ programId }: AdminProgramDetailProps) {
  const router = useRouter();
  const { session, isAdmin, ready, logout } = useDemoAuth();
  const program = getProgramById(programId);
  const [filter, setFilter] = useState<ParticipantFilter>("all");
  const [listTab, setListTab] = useState<DetailListTab>("groups");
  const [groupQuery, setGroupQuery] = useState("");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<ProgramParticipant | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!isAdmin) router.replace("/login");
  }, [ready, isAdmin, router]);

  const participants = useMemo(
    () => (program ? getProgramParticipants(program.id) : []),
    [program],
  );
  const stats = useMemo(
    () => (program ? getProgramParticipantStats(program.id) : null),
    [program],
  );
  const insights = useMemo(
    () => (program ? getProgramDetailInsights(program.id) : null),
    [program],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return participants.filter((p) => {
      if (filter === "graduated" && !p.graduated) return false;
      if (filter === "incomplete" && p.graduated) return false;
      if (
        filter !== "all" &&
        filter !== "graduated" &&
        filter !== "incomplete" &&
        p.category !== filter
      ) {
        return false;
      }

      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.groupName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
      );
    });
  }, [participants, filter, query]);

  const filteredGroups = useMemo(() => {
    const groups = insights?.byGroup ?? [];
    const q = groupQuery.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter(
      (g) =>
        g.groupName.toLowerCase().includes(q) ||
        g.leaderName.toLowerCase().includes(q),
    );
  }, [insights, groupQuery]);

  if (!ready || !isAdmin || !session) {
    return (
      <LoadingModal
        label="Memuat detail program"
        hint="Menyiapkan ringkasan program…"
      />
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!program) {
    return (
      <AdminShell
        session={session}
        onLogout={handleLogout}
        activeNav="program"
      >
        <BackLink />
        <div className="mt-6 rounded-2xl border border-[var(--a-line)] bg-white/90 p-6">
          <h1 className="admin-display text-2xl text-[var(--a-ink)]">
            Program tidak ditemukan
          </h1>
          <p className="mt-2 text-sm text-[var(--a-ink-soft)]">
            ID program ini tidak ada di data demo.
          </p>
        </div>
      </AdminShell>
    );
  }

  const isActive = program.status === "active";
  const durationDays =
    differenceInCalendarDays(
      parseISO(program.endDate),
      parseISO(program.startDate),
    ) + 1;
  const elapsedDays = isActive
    ? Math.min(
        durationDays,
        Math.max(
          0,
          differenceInCalendarDays(new Date(), parseISO(program.startDate)) +
            1,
        ),
      )
    : durationDays;
  const timeProgress = Math.round((elapsedDays / durationDays) * 100);
  const avgRate = insights?.avgCompletion ?? program.completionRate;
  const participantTotal = stats?.total ?? program.participantCount;
  const groupCount = insights?.byGroup.length ?? program.groupCount;
  const progressPct = isActive ? timeProgress : avgRate;
  const progressLabel = isActive
    ? `Hari ${elapsedDays} / ${durationDays}`
    : `Rata-rata penyelesaian ${avgRate}%`;

  return (
    <AdminShell session={session} onLogout={handleLogout} activeNav="program">
      <BackLink />

      {/* Hero */}
      <header className="mt-5 mb-5 overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90 lg:mt-2 lg:mb-6">
        <div className="px-4 py-5 lg:px-6 lg:py-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 max-w-2xl">
              <p className="admin-kicker text-[var(--a-accent)]">
                {program.organization}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <h1 className="admin-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.15] text-[var(--a-ink)]">
                  {program.name}
                </h1>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                    isActive
                      ? "bg-[var(--status-success-bg)] text-[var(--status-success-text)]"
                      : "bg-[var(--a-wash)] text-[var(--a-ink-soft)]",
                  )}
                >
                  {isActive ? "Berjalan" : "Selesai"}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--a-ink-soft)]">
                {program.summary}
              </p>
            </div>
            {isActive ? (
              <Link
                href="/admin?tab=schedule"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[var(--a-accent)] hover:text-[#2563eb]"
              >
                Jadwal baca
                <ChevronRight className="size-4" />
              </Link>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--a-line)] pt-4 text-xs text-[var(--a-ink-soft)]">
            <MetaInline icon={CalendarRange}>
              {formatShortDate(program.startDate)} –{" "}
              {formatShortDate(program.endDate)} · {durationDays} hari
            </MetaInline>
            <MetaInline icon={BookOpen}>{program.readingPace}</MetaInline>
            <MetaInline icon={Users}>{program.audience}</MetaInline>
            <MetaInline icon={Layers}>{program.readingTrack}</MetaInline>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
              <span className="text-[var(--a-ink-soft)]">
                {isActive ? "Progres waktu" : "Penyelesaian akhir"}
              </span>
              <span className="font-semibold text-[var(--a-accent)]">
                {progressLabel}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="h-full rounded-full bg-[var(--a-accent)] transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {program.focusAreas.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {program.focusAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-md bg-[var(--a-wash)] px-2 py-1 text-[11px] font-semibold text-[var(--a-ink)]"
                >
                  {area}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      {/* Stats — 4 key metrics */}
      <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:mb-6">
        <StatCard
          icon={Users}
          label="Peserta"
          value={String(participantTotal)}
          hint={`${insights?.leaderCount ?? 0} ketua · ${insights?.memberCount ?? 0} anggota`}
        />
        <StatCard
          icon={Layers}
          label="Kelompok"
          value={String(groupCount)}
        />
        <StatCard
          icon={Target}
          label="Rata-rata"
          value={`${avgRate}%`}
          tone="accent"
        />
        {isActive ? (
          <StatCard
            icon={CheckCircle2}
            label="Waktu berjalan"
            value={`${timeProgress}%`}
            hint={`Hari ${elapsedDays} dari ${durationDays}`}
            tone="success"
          />
        ) : (
          <StatCard
            icon={Award}
            label="Lulus / sertifikat"
            value={`${stats?.graduated ?? 0}`}
            hint={`${insights?.graduationRate ?? 0}% · ${stats?.incomplete ?? 0} belum`}
            tone="success"
          />
        )}
      </section>

      {/* About + criteria */}
      <div className="mb-5 grid gap-4 lg:mb-6 lg:grid-cols-2">
        <Panel
          title="Tentang program"
          subtitle="Ringkasan tujuan dan cara program dijalankan."
        >
          <p className="text-sm leading-relaxed text-[var(--a-ink)]">
            {program.description}
          </p>
        </Panel>

        <Panel
          title="Kriteria sertifikat"
          subtitle={
            isActive
              ? "Diterbitkan di akhir program."
              : "Kategori penerbitan sertifikat."
          }
        >
          <ul className="-mx-4 divide-y divide-[var(--a-line)] lg:-mx-5">
            {GRADUATION_CRITERIA.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 px-4 py-3 first:pt-0 last:pb-0 lg:px-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[var(--a-ink)]">
                      {item.title}
                    </p>
                    <span className="rounded bg-[var(--a-wash)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--a-ink-soft)]">
                      {item.threshold}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--a-ink-soft)]">
                    {item.detail}
                  </p>
                </div>
                {!isActive && stats ? (
                  <p className="admin-display shrink-0 text-lg text-[var(--a-accent)]">
                    {stats.byCategory[item.id]}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Compact highlights */}
      <section className="mb-5 overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90 lg:mb-6">
        <div className="border-b border-[var(--a-line)] px-4 py-3 lg:px-5">
          <h2 className="admin-display text-base text-[var(--a-ink)]">
            {isActive ? "Sorotan" : "Hasil singkat"}
          </h2>
          <p className="mt-0.5 text-xs text-[var(--a-ink-soft)]">
            {isActive
              ? "Sekilas peserta teratas dan yang perlu perhatian."
              : "Sekilas pencapaian tertinggi dan yang belum lulus."}
          </p>
        </div>
        <div className="grid divide-y divide-[var(--a-line)] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <HighlightList
            title="Teratas"
            empty="Belum ada data."
            people={insights?.topPerformers ?? []}
            tone="success"
          />
          <HighlightList
            title={isActive ? "Perlu perhatian" : "Belum lulus"}
            empty="Tidak ada yang perlu perhatian."
            people={
              isActive
                ? (insights?.needsAttention ?? [])
                : participants.filter((p) => !p.graduated).slice(0, 5)
            }
            tone="warn"
          />
        </div>
      </section>

      {/* Tabbed lists: kelompok | peserta */}
      <section className="overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90">
        <Tabs
          value={listTab}
          onValueChange={(value) => setListTab(value as DetailListTab)}
          className="gap-0"
        >
          <div className="flex flex-col gap-3 border-b border-[var(--a-line)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-5">
            <TabsList className="h-10 w-full rounded-xl bg-[var(--a-wash)] p-1 sm:w-auto">
              <TabsTrigger
                value="groups"
                className="gap-1.5 rounded-lg px-3 text-xs data-active:bg-white data-active:text-[var(--a-ink)] data-active:shadow-sm sm:text-sm"
              >
                <Layers className="size-3.5" />
                Kelompok
                <span className="tabular-nums opacity-60">({groupCount})</span>
              </TabsTrigger>
              <TabsTrigger
                value="participants"
                className="gap-1.5 rounded-lg px-3 text-xs data-active:bg-white data-active:text-[var(--a-ink)] data-active:shadow-sm sm:text-sm"
              >
                <Users className="size-3.5" />
                Peserta
                <span className="tabular-nums opacity-60">
                  ({participantTotal})
                </span>
              </TabsTrigger>
            </TabsList>

            {listTab === "groups" ? (
              <div className="relative w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--a-ink-soft)]" />
                <Input
                  value={groupQuery}
                  onChange={(event) => setGroupQuery(event.target.value)}
                  placeholder="Cari nama kelompok atau ketua…"
                  className="h-9 rounded-xl border-[var(--a-line)] bg-white pl-9"
                  aria-label="Cari kelompok"
                />
              </div>
            ) : (
              <div className="relative w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--a-ink-soft)]" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari nama atau kelompok…"
                  className="h-9 rounded-xl border-[var(--a-line)] bg-white pl-9"
                  aria-label="Cari peserta"
                />
              </div>
            )}
          </div>

          <TabsContent value="groups" className="mt-0 outline-none">
            <div className="flex items-center justify-between border-b border-[var(--a-line)] bg-[var(--a-wash)]/30 px-4 py-2 text-[11px] text-[var(--a-ink-soft)] lg:px-5">
              <span>
                Menampilkan {filteredGroups.length} dari {groupCount} kelompok
              </span>
            </div>
            <ul className="max-h-[min(28rem,60dvh)] divide-y divide-[var(--a-line)] overflow-y-auto">
              {filteredGroups.map((group) => (
                <GroupRow
                  key={group.groupId}
                  group={group}
                  isActive={isActive}
                />
              ))}
              {filteredGroups.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-[var(--a-ink-soft)] lg:px-5">
                  {groupQuery.trim()
                    ? `Tidak ada kelompok yang cocok dengan “${groupQuery.trim()}”.`
                    : "Belum ada data kelompok."}
                </li>
              ) : null}
            </ul>
          </TabsContent>

          <TabsContent value="participants" className="mt-0 outline-none">
            {!isActive ? (
              <div className="flex gap-2 overflow-x-auto border-b border-[var(--a-line)] px-4 py-2.5 lg:px-5">
                {FILTERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={cn(
                      "shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
                      filter === item.id
                        ? "bg-[var(--a-accent)] text-white"
                        : "bg-[var(--a-wash)] text-[var(--a-ink-soft)] hover:text-[var(--a-ink)]",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="flex items-center justify-between border-b border-[var(--a-line)] bg-[var(--a-wash)]/30 px-4 py-2 text-[11px] text-[var(--a-ink-soft)] lg:px-5">
              <span>
                Menampilkan {filtered.length} dari {participants.length} peserta
              </span>
            </div>

            <ul className="max-h-[min(28rem,60dvh)] divide-y divide-[var(--a-line)] overflow-y-auto">
              {filtered.map((person) => (
                <li
                  key={person.id}
                  className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 lg:px-5"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback className="bg-[var(--a-accent)] text-xs font-bold text-white">
                        {getInitials(person.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate text-sm font-semibold text-[var(--a-ink)]">
                          {person.name}
                        </p>
                        <StatusBadge person={person} isActive={isActive} />
                        {person.role === "leader" ? (
                          <span className="rounded-md bg-[var(--a-wash)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--a-accent)]">
                            Ketua
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-[var(--a-ink-soft)]">
                        {person.groupName} · {person.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                    <div className="min-w-[3.5rem] text-right">
                      <p className="text-sm font-semibold tabular-nums text-[var(--a-ink)]">
                        {person.completionRate}%
                      </p>
                    </div>
                    {person.graduated ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 rounded-lg border-[var(--a-line)] px-2.5 text-xs"
                        onClick={() => setPreview(person)}
                      >
                        <Eye className="size-3.5" />
                        Sertifikat
                      </Button>
                    ) : (
                      <span className="inline-flex h-8 min-w-[5.5rem] items-center justify-center rounded-lg bg-[var(--a-wash)] px-2 text-[11px] font-medium text-[var(--a-ink-soft)]">
                        {isActive ? "Berjalan" : "Belum lulus"}
                      </span>
                    )}
                  </div>
                </li>
              ))}
              {filtered.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-[var(--a-ink-soft)] lg:px-5">
                  {query.trim()
                    ? `Tidak ada hasil untuk “${query.trim()}”.`
                    : "Tidak ada peserta pada filter ini."}
                </li>
              ) : null}
            </ul>
          </TabsContent>
        </Tabs>
      </section>

      <CertificatePreviewDialog
        open={Boolean(preview)}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
        participant={preview}
        programName={program.name}
        organization={program.organization}
      />
    </AdminShell>
  );
}

function GroupRow({
  group,
  isActive,
}: {
  group: ProgramGroupBreakdown;
  isActive: boolean;
}) {
  return (
    <li>
      <Link
        href={`/admin/kelompok/${group.groupId}`}
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--a-wash)]/50 lg:px-5"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--a-ink)]">
            {group.groupName}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--a-ink-soft)]">
            {group.leaderName} · {group.memberCount} peserta
            {!isActive ? ` · ${group.graduatedCount} lulus` : null}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--a-wash)]">
            <div
              className="h-full rounded-full bg-[var(--a-accent)]"
              style={{ width: `${group.avgCompletion}%` }}
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="admin-display text-base tabular-nums text-[var(--a-accent)]">
            {group.avgCompletion}%
          </span>
          <ChevronRight className="size-4 text-[var(--a-ink-soft)]/40" />
        </div>
      </Link>
    </li>
  );
}

function BackLink() {
  return (
    <Link
      href="/admin?tab=program"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--a-accent)] transition-colors hover:text-[#2563eb]"
    >
      <ArrowLeft className="size-4" />
      Kembali ke program
    </Link>
  );
}

function MetaInline({
  icon: Icon,
  children,
}: {
  icon: typeof Users;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="size-3.5 shrink-0 opacity-70" />
      {children}
    </span>
  );
}

function Panel({
  title,
  subtitle,
  children,
  flush = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  flush?: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90">
      <div className="border-b border-[var(--a-line)] px-4 py-3.5 lg:px-5">
        <h2 className="admin-display text-lg text-[var(--a-ink)]">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-[var(--a-ink-soft)]">{subtitle}</p>
        ) : null}
      </div>
      {flush ? children : <div className="px-4 py-4 lg:px-5">{children}</div>}
    </section>
  );
}

function HighlightList({
  title,
  people,
  empty,
  tone,
}: {
  title: string;
  people: ProgramParticipant[];
  empty: string;
  tone: "success" | "warn";
}) {
  return (
    <div className="px-4 py-4 lg:px-5">
      <p className="text-[10px] font-semibold tracking-wide text-[var(--a-ink-soft)] uppercase">
        {title}
      </p>
      {people.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--a-ink-soft)]">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {people.map((person) => (
            <li key={person.id} className="flex items-center gap-2.5">
              <Avatar className="size-7 shrink-0">
                <AvatarFallback
                  className={cn(
                    "text-[10px] font-bold text-white",
                    tone === "success"
                      ? "bg-[var(--status-success-text)]"
                      : "bg-[var(--status-warning-text)]",
                  )}
                >
                  {getInitials(person.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--a-ink)]">
                  {person.name}
                </p>
                <p className="truncate text-[11px] text-[var(--a-ink-soft)]">
                  {person.groupName}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 text-sm font-semibold tabular-nums",
                  tone === "success"
                    ? "text-[var(--status-success-text)]"
                    : "text-[var(--status-warning-text)]",
                )}
              >
                {person.completionRate}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusBadge({
  person,
  isActive,
}: {
  person: ProgramParticipant;
  isActive: boolean;
}) {
  if (isActive) return null;

  if (!person.graduated) {
    return (
      <span className="rounded-md bg-[var(--status-danger-bg)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--status-danger-text)]">
        Belum lulus
      </span>
    );
  }

  return (
    <span
      className={cn(
        "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
        person.category === "completion" &&
          "bg-[var(--status-success-bg)] text-[var(--status-success-text)]",
        person.category === "participation" &&
          "bg-[var(--a-wash)] text-[var(--a-accent)]",
        person.category === "leader" &&
          "bg-[var(--status-warning-bg)] text-[var(--status-warning-text)]",
      )}
    >
      {CERTIFICATE_CATEGORY_LABEL[person.category]}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: typeof Users;
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "accent";
}) {
  return (
    <div className="rounded-2xl border border-[var(--a-line)] bg-white/90 px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-[11px] text-[var(--a-ink-soft)]">
        <Icon className="size-3.5 shrink-0" />
        {label}
      </div>
      <p
        className={cn(
          "admin-display mt-1 text-2xl tabular-nums text-[var(--a-ink)]",
          tone === "success" && "text-[var(--status-success-text)]",
          tone === "accent" && "text-[var(--a-accent)]",
        )}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-0.5 text-[10px] leading-snug text-[var(--a-ink-soft)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
