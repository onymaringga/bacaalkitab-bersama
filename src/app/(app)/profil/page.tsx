"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  Camera,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  NotebookPen,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";

import { MemberBiodataCard } from "@/components/profile/member-biodata-card";
import { ProfileOverview } from "@/components/profile/profile-overview";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { showToast } from "@/components/ui/toast-host";
import {
  getServerChapterNotes,
  listChapterNotes,
  subscribeChapterNotes,
} from "@/lib/bible-chapter-notes";
import { copy } from "@/lib/copy";
import { demoUser } from "@/lib/demo-data";
import {
  getServerMemberBiodata,
  readMemberBiodata,
  subscribeMemberBiodata,
} from "@/lib/member-biodata";
import {
  PROFILE_AVATAR_PRESETS,
  clearCurrentUserAvatarUrl,
  getCurrentUserAvatarUrl,
  setCurrentUserAvatarUrl,
  subscribeProfileAvatar,
} from "@/lib/member-avatars";
import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { cn } from "@/lib/utils";

type MenuItem = {
  href: string;
  label: string;
  icon: typeof UserRound;
  trailing?: string;
};

const accountItems: MenuItem[] = [
  { href: "/profil/pengaturan", label: "Pengaturan", icon: Settings },
  { href: "/notifikasi", label: "Notifikasi", icon: Bell },
  {
    href: "/profil/pengaturan",
    label: "Bahasa Alkitab",
    icon: BookOpen,
    trailing: "TB",
  },
];

const supportItems: MenuItem[] = [
  { href: "/fitur", label: "Fitur app", icon: Sparkles },
  { href: "/profil/bantuan", label: "Bantuan & FAQ", icon: HelpCircle },
  { href: "/profil/feedback", label: "Kirim Feedback", icon: MessageSquare },
];

export default function ProfilPage() {
  const { session, isAdmin } = useDemoAuth();
  const [pickerOpen, setPickerOpen] = useState(false);
  const displayName = session?.name ?? demoUser.name;
  const displayEmail = session?.email ?? demoUser.email;
  const biodata = useSyncExternalStore(
    subscribeMemberBiodata,
    readMemberBiodata,
    getServerMemberBiodata,
  );
  const headerName = biodata.fullName || displayName;
  const headerEmail = biodata.email || displayEmail;
  const avatarUrl = useSyncExternalStore(
    subscribeProfileAvatar,
    () => getCurrentUserAvatarUrl(headerName),
    () => getCurrentUserAvatarUrl(headerName),
  );
  const reflectionCount = useSyncExternalStore(
    subscribeChapterNotes,
    () => listChapterNotes().length,
    () => getServerChapterNotes().length,
  );

  function handlePick(url: string) {
    setCurrentUserAvatarUrl(url);
    setPickerOpen(false);
    showToast("Foto profil diperbarui");
  }

  function handleReset() {
    clearCurrentUserAvatarUrl();
    setPickerOpen(false);
    showToast("Foto profil dikembalikan ke default");
  }

  return (
    <div className="space-y-5 lg:space-y-7">
      <ProfileHero
        name={headerName}
        email={headerEmail}
        isAdmin={isAdmin}
        pickerOpen={pickerOpen}
        onTogglePicker={() => setPickerOpen((value) => !value)}
      />

      {pickerOpen ? (
        <AvatarPicker
          selected={avatarUrl}
          onPick={handlePick}
          onReset={handleReset}
        />
      ) : null}

      <RefleksikuSpotlight count={reflectionCount} />

      <ProfileOverview />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start lg:gap-6">
        <MemberBiodataCard
          nameFallback={displayName}
          emailFallback={displayEmail}
        />

        <div className="space-y-5 lg:space-y-6">
          <MenuSection title="Akun Saya" items={accountItems} />
          <MenuSection title="Dukungan" items={supportItems} />

          <p className="pb-1 text-center text-[11px] text-[var(--m-ink-soft)]">
            Versi 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

function RefleksikuSpotlight({ count }: { count: number }) {
  return (
    <Link
      href="/refleksiku"
      className="member-web-animate-in group relative block overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/95 shadow-[var(--shadow-soft)] transition hover:border-[var(--m-accent)]/35 hover:shadow-md lg:rounded-3xl"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "linear-gradient(125deg, rgba(30,58,138,0.06) 0%, rgba(59,130,246,0.1) 45%, rgba(255,255,255,0) 78%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-sky-400/15 blur-2xl transition group-hover:bg-sky-400/25"
      />

      <div className="relative flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
        <div className="flex min-w-0 items-start gap-3.5 sm:items-center">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--m-accent)] text-white shadow-sm ring-4 ring-[var(--m-accent)]/15 sm:size-14">
            <NotebookPen className="size-5 sm:size-6" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--m-accent)] uppercase">
              {copy.myReflections.eyebrow}
            </p>
            <h2 className="member-web-display mt-0.5 text-xl text-[var(--m-ink)] sm:text-2xl">
              {copy.myReflections.title}
            </h2>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-[var(--m-ink-soft)]">
              {count > 0
                ? `${count} refleksi tersimpan — baca ulang atau lanjut tulis.`
                : copy.myReflections.subtitle}
            </p>
          </div>
        </div>

        <span className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 self-start rounded-xl bg-[var(--m-accent)] px-4 text-sm font-semibold text-white transition group-hover:bg-[var(--m-accent)]/90 sm:self-center">
          {count > 0 ? "Lihat refleksi" : copy.myReflections.write}
          <ChevronRight className="size-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

function ProfileHero({
  name,
  email,
  isAdmin,
  pickerOpen,
  onTogglePicker,
}: {
  name: string;
  email: string;
  isAdmin: boolean;
  pickerOpen: boolean;
  onTogglePicker: () => void;
}) {
  return (
    <header className="member-web-animate-in relative overflow-hidden rounded-2xl border border-[var(--m-line)] lg:rounded-3xl">
      <div
        className="relative px-5 py-7 sm:px-7 sm:py-8 lg:px-8 lg:py-9"
        style={{
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 42%, #3b82f6 78%, #60a5fa 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, white 0 1.5px, transparent 2px), radial-gradient(circle at 80% 70%, white 0 1px, transparent 2px)",
            backgroundSize: "28px 28px, 18px 18px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-16 size-48 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 left-8 size-56 rounded-full bg-sky-300/20 blur-3xl"
        />

        <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
          <button
            type="button"
            onClick={onTogglePicker}
            className="relative shrink-0"
            aria-label="Ubah foto profil"
            aria-expanded={pickerOpen}
          >
            <MemberAvatar
              name={name}
              currentUser
              className="size-[4.5rem] ring-4 ring-white/25 sm:size-20"
              fallbackClassName="bg-white/20 text-xl font-bold text-white"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex size-7 items-center justify-center rounded-full bg-white text-blue-700 shadow-md ring-1 ring-black/5">
              <Camera className="size-3.5" />
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <p className="hidden text-[11px] font-semibold tracking-[0.14em] text-white/65 uppercase sm:block">
              {copy.nav.profile}
            </p>
            <h1 className="member-web-display mt-0.5 text-2xl leading-tight text-white sm:text-3xl">
              {name}
            </h1>
            <p className="mt-1 truncate text-sm text-white/80">{email}</p>
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {isAdmin ? (
                <span className="rounded-full bg-white/18 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                  Admin
                </span>
              ) : (
                <span className="rounded-full bg-white/14 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                  Anggota
                </span>
              )}
              <span className="text-[11px] text-white/65">
                Ketuk foto untuk mengganti
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function AvatarPicker({
  selected,
  onPick,
  onReset,
  className,
}: {
  selected: string;
  onPick: (url: string) => void;
  onReset: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--m-line)] bg-white/90 px-4 py-4 sm:px-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--m-ink)]">
            Pilih foto profil
          </p>
          <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">
            Pilih salah satu foto di bawah untuk akunmu.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 shrink-0 text-[var(--m-ink-soft)]"
          onClick={onReset}
        >
          Default
        </Button>
      </div>
      <div className="mt-3.5 grid grid-cols-4 gap-2.5 sm:grid-cols-8">
        {PROFILE_AVATAR_PRESETS.map((url) => {
          const active = selected === url;
          return (
            <button
              key={url}
              type="button"
              onClick={() => onPick(url)}
              className={cn(
                "aspect-square overflow-hidden rounded-full ring-2 ring-offset-2 transition",
                active
                  ? "ring-[var(--m-accent)]"
                  : "ring-transparent hover:ring-[var(--m-line)]",
              )}
              aria-label="Pilih foto ini"
              aria-pressed={active}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="size-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MenuSection({ title, items }: { title: string; items: MenuItem[] }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
      <p className="border-b border-[var(--m-line)] px-4 py-3 text-sm font-semibold text-[var(--m-ink)] sm:px-5">
        {title}
      </p>
      <ul className="divide-y divide-[var(--m-line)]">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={`${item.href}-${item.label}`}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--m-wash)]/55 sm:px-5"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--m-wash)] text-[var(--m-accent)]">
                  <Icon className="size-3.5" />
                </span>
                <span className="flex-1 text-sm font-medium text-[var(--m-ink)]">
                  {item.label}
                </span>
                {item.trailing ? (
                  <span className="rounded-md bg-[var(--m-wash)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--m-ink-soft)]">
                    {item.trailing}
                  </span>
                ) : null}
                <ChevronRight className="size-4 text-[var(--m-ink-soft)]/45" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
