"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import {
  BookHeart,
  BookOpen,
  Bookmark,
  CalendarDays,
  ChevronRight,
  Download,
  Highlighter,
  Languages,
  Maximize2,
  MessageCircle,
  Mic,
  NotebookPen,
  Volume2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeatureItem = {
  icon: typeof BookOpen;
  title: string;
  body: string;
  href?: string;
};

type FeatureGroup = {
  id: string;
  title: string;
  items: FeatureItem[];
};

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: "baca",
    title: "Baca Alkitab",
    items: [
      {
        icon: BookOpen,
        title: "Pasal & jadwal",
        body: "Bacaan harian program, atau jelajahi kitab pasal demi pasal.",
        href: "/baca",
      },
      {
        icon: Languages,
        title: "Banyak terjemahan",
        body: "TB, BIS, TL, Toba, Simalungun, Karo — ganti kapan saja.",
        href: "/baca",
      },
      {
        icon: Volume2,
        title: "Dengarkan",
        body: "Bacakan pasal atau teks yang sedang kamu blok.",
      },
      {
        icon: Maximize2,
        title: "Full screen & cover",
        body: "Mode kertas + cover Alkitab yang bisa kamu custom.",
      },
      {
        icon: Download,
        title: "Unduh offline",
        body: "Simpan kitab di perangkat untuk jaringan lambat.",
        href: "/baca?browse=1",
      },
      {
        icon: Mic,
        title: "Live Transkrip",
        body: "Transkrip khotbah bahasa daerah (Simalungun, dll.) + terjemahan Indonesia.",
        href: "/transkrip",
      },
    ],
  },
  {
    id: "saat-membaca",
    title: "Saat membaca",
    items: [
      {
        icon: Highlighter,
        title: "Highlight",
        body: "Blok teks, pilih warna, tandai ayat yang berkesan.",
      },
      {
        icon: Bookmark,
        title: "Bookmark",
        body: "Simpan ayat pilihan agar mudah dibuka lagi.",
      },
      {
        icon: Languages,
        title: "Bandingkan versi",
        body: "Blok ayat → Bandingkan → lihat di terjemahan lain.",
      },
    ],
  },
  {
    id: "renung",
    title: "Renung & selesai",
    items: [
      {
        icon: NotebookPen,
        title: "Refleksi diri",
        body: "Tulis catatan pribadi. Menyimpan juga menandai selesai.",
        href: "/refleksiku",
      },
      {
        icon: BookHeart,
        title: "Jurnal perasaan",
        body: "Buku jurnal pribadi — tulis, warnai, stiker, dan foto.",
        href: "/jurnal",
      },
      {
        icon: BookOpen,
        title: "Renungan",
        body: "Ringkasan singkat di tab Renungan pada bacaan.",
        href: "/baca",
      },
      {
        icon: CalendarDays,
        title: "Jadwal baca",
        body: "Rencana harian, progress, dan loncat ke hari tertentu.",
        href: "/jadwal",
      },
    ],
  },
  {
    id: "kelompok",
    title: "Bersama kelompok",
    items: [
      {
        icon: Users,
        title: "Kelompokku",
        body: "Anggota, progres bersama, dan aktivitas kelompok.",
        href: "/kelompok",
      },
      {
        icon: MessageCircle,
        title: "Chat kelompok",
        body: "Percakapan saling menguatkan, bisa mention anggota.",
        href: "/chat",
      },
    ],
  },
];

export function FeaturesGuideView() {
  const navId = useId();
  const [activeId, setActiveId] = useState(FEATURE_GROUPS[0]!.id);

  useEffect(() => {
    const sections = FEATURE_GROUPS.map((group) =>
      document.getElementById(`fitur-${group.id}`),
    ).filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveId(visible.target.id.replace(/^fitur-/, ""));
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.2, 0.5, 0.8] },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="member-web-animate-in space-y-8 pb-4">
      <header className="relative overflow-hidden rounded-3xl border border-[var(--m-line)] bg-gradient-to-br from-white via-[#f7faff] to-[var(--m-wash)] px-5 py-7 sm:px-8 sm:py-9">
        <div
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.1 255 / 0.35), transparent 70%)",
          }}
        />
        <p className="member-web-kicker relative text-[var(--m-accent)]">
          Panduan
        </p>
        <h1 className="member-web-display relative mt-2 text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.08] text-[var(--m-ink)]">
          Fitur app
        </h1>
        <p className="relative mt-2.5 max-w-xl text-sm leading-relaxed text-[var(--m-ink-soft)] sm:text-[0.95rem]">
          Dari baca ayat sampai tumbuh bersama kelompok — ini yang bisa kamu
          lakukan.
        </p>
        <div className="relative mt-5 flex flex-wrap gap-2">
          <Button asChild className="h-10 rounded-xl px-4">
            <Link href="/baca">Mulai baca</Link>
          </Button>
          <Button asChild variant="outline" className="h-10 rounded-xl px-4">
            <Link href="/profil/bantuan">Bantuan & FAQ</Link>
          </Button>
        </div>
      </header>

      <nav
        aria-label="Bagian fitur"
        className="sticky top-0 z-20 -mx-1 overflow-x-auto px-1 py-1 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--m-paper)]/80"
      >
        <div
          id={navId}
          className="inline-flex min-w-full gap-1.5 rounded-2xl border border-[var(--m-line)] bg-white/90 p-1.5 sm:min-w-0"
        >
          {FEATURE_GROUPS.map((group, index) => {
            const active = activeId === group.id;
            return (
              <a
                key={group.id}
                href={`#fitur-${group.id}`}
                onClick={() => setActiveId(group.id)}
                className={cn(
                  "shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition sm:text-sm",
                  active
                    ? "bg-[var(--m-accent)] text-white shadow-sm"
                    : "text-[var(--m-ink-soft)] hover:bg-[var(--m-wash)] hover:text-[var(--m-ink)]",
                )}
              >
                <span className="mr-1.5 tabular-nums opacity-70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {group.title}
              </a>
            );
          })}
        </div>
      </nav>

      <div className="space-y-10">
        {FEATURE_GROUPS.map((group, groupIndex) => (
          <section
            key={group.id}
            id={`fitur-${group.id}`}
            className="scroll-mt-24 space-y-4"
          >
            <div className="flex items-end gap-3 border-b border-[var(--m-line)] pb-3">
              <span className="member-web-display text-3xl leading-none text-[var(--m-accent)]/35 tabular-nums">
                {String(groupIndex + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 pb-0.5">
                <h2 className="text-xl font-semibold tracking-tight text-[var(--m-ink)]">
                  {group.title}
                </h2>
              </div>
            </div>

            <ul className="divide-y divide-[var(--m-line)] overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
              {group.items.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--m-wash)] text-[var(--m-accent)]">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[var(--m-ink)]">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-[var(--m-ink-soft)]">
                        {item.body}
                      </span>
                    </span>
                    {item.href ? (
                      <ChevronRight
                        className="size-4 shrink-0 text-[var(--m-ink-soft)] transition group-hover:text-[var(--m-accent)]"
                        aria-hidden
                      />
                    ) : (
                      <span className="size-4 shrink-0" aria-hidden />
                    )}
                  </>
                );

                return (
                  <li key={item.title}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-[var(--m-wash)]/50"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3.5">
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
