"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Suspense } from "react";

import { getBookWithIntro } from "@/lib/bible-book-intros";
import { getBibleCustom } from "@/lib/bible-customs";
import { getBibleCharacter } from "@/lib/bible-characters";
import { getGenealogyPerson } from "@/lib/bible-genealogy";
import { getGlossaryTerm } from "@/lib/bible-glossary";
import { getBiblePlace } from "@/lib/bible-places";
import { getBibleTopic } from "@/lib/bible-topics";
import { copy } from "@/lib/copy";
import { formatShortDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

function memberCrumbs(
  pathname: string,
  searchParams: URLSearchParams,
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    { label: copy.nav.home, href: "/dashboard" },
  ];

  if (pathname === "/dashboard" || pathname === "/") {
    return [{ label: copy.nav.home }];
  }

  if (pathname === "/explore" || pathname.startsWith("/explore/")) {
    crumbs.push({ label: copy.nav.explore });
    return finalize(crumbs);
  }

  if (pathname.startsWith("/baca/topik")) {
    crumbs.push({ label: copy.nav.explore, href: "/explore" });
    crumbs.push({ label: copy.topics.title, href: "/baca/topik" });
    const slug = pathname.split("/")[3];
    if (slug) {
      crumbs.push({ label: getBibleTopic(slug)?.title ?? "Detail topik" });
    }
    return finalize(crumbs);
  }

  if (pathname.startsWith("/baca/kebiasaan")) {
    crumbs.push({ label: copy.nav.explore, href: "/explore" });
    crumbs.push({ label: copy.customs.title, href: "/baca/kebiasaan" });
    const slug = pathname.split("/")[3];
    if (slug) {
      crumbs.push({
        label: getBibleCustom(slug)?.title ?? "Detail kebiasaan",
      });
    }
    return finalize(crumbs);
  }

  if (pathname.startsWith("/baca/glosarium")) {
    crumbs.push({ label: copy.nav.explore, href: "/explore" });
    crumbs.push({ label: copy.glossary.title, href: "/baca/glosarium" });
    const slug = pathname.split("/")[3];
    if (slug) {
      crumbs.push({
        label: getGlossaryTerm(slug)?.term ?? "Detail istilah",
      });
    }
    return finalize(crumbs);
  }

  if (pathname.startsWith("/baca/tokoh")) {
    crumbs.push({ label: copy.nav.explore, href: "/explore" });
    crumbs.push({ label: copy.characters.title, href: "/baca/tokoh" });
    const slug = pathname.split("/")[3];
    if (slug) {
      crumbs.push({
        label: getBibleCharacter(slug)?.name ?? "Detail tokoh",
      });
    }
    return finalize(crumbs);
  }

  if (pathname.startsWith("/baca/peta")) {
    crumbs.push({ label: copy.nav.explore, href: "/explore" });
    crumbs.push({ label: copy.places.title, href: "/baca/peta" });
    const slug = pathname.split("/")[3];
    if (slug) {
      crumbs.push({
        label: getBiblePlace(slug)?.name ?? "Detail tempat",
      });
    }
    return finalize(crumbs);
  }

  if (pathname.startsWith("/baca/silsilah")) {
    crumbs.push({ label: copy.nav.explore, href: "/explore" });
    crumbs.push({ label: copy.genealogy.title, href: "/baca/silsilah" });
    const slug = pathname.split("/")[3];
    if (slug) {
      crumbs.push({
        label: getGenealogyPerson(slug)?.name ?? "Detail silsilah",
      });
    }
    return finalize(crumbs);
  }

  if (pathname.startsWith("/baca/kitab")) {
    crumbs.push({ label: copy.nav.explore, href: "/explore" });
    crumbs.push({ label: copy.bookIntro.title, href: "/baca/kitab" });
    const abbr = pathname.split("/")[3];
    if (abbr) {
      const decoded = decodeURIComponent(abbr);
      crumbs.push({
        label: getBookWithIntro(decoded)?.book.name ?? decoded,
      });
    }
    return finalize(crumbs);
  }

  if (pathname.startsWith("/baca") || pathname.startsWith("/alkitab")) {
    crumbs.push({ label: copy.nav.read, href: "/baca" });
    if (searchParams.get("browse") === "1") {
      crumbs.push({ label: copy.bible.title });
    } else if (searchParams.get("passage")) {
      crumbs.push({
        label: searchParams.get("passage") ?? "Pasal",
      });
    } else if (pathname.includes("#") || searchParams.get("tab") === "jadwal") {
      crumbs.push({ label: copy.schedule.title });
    }
    return finalize(crumbs);
  }

  if (pathname.startsWith("/jadwal")) {
    crumbs.push({ label: copy.nav.schedule });
    return finalize(crumbs);
  }

  if (pathname.startsWith("/jurnal")) {
    crumbs.push({ label: copy.nav.journal, href: "/jurnal" });
    if (pathname !== "/jurnal") {
      crumbs.push({ label: "Halaman" });
    }
    return finalize(crumbs);
  }

  if (pathname.startsWith("/refleksiku")) {
    crumbs.push({ label: copy.nav.profile, href: "/profil" });
    crumbs.push({ label: copy.nav.myReflections });
    return finalize(crumbs);
  }

  if (pathname.startsWith("/catatan") || pathname.startsWith("/renungan")) {
    crumbs.push({ label: copy.nav.read, href: "/baca" });
    crumbs.push({ label: "Refleksi" });
    return finalize(crumbs);
  }

  if (pathname.startsWith("/chat")) {
    crumbs.push({ label: copy.nav.chat });
    return finalize(crumbs);
  }

  if (pathname.startsWith("/kelompok")) {
    crumbs.push({ label: copy.nav.group });
    return finalize(crumbs);
  }

  if (pathname.startsWith("/fitur")) {
    crumbs.push({ label: copy.nav.features });
    return finalize(crumbs);
  }

  if (pathname.startsWith("/notifikasi")) {
    crumbs.push({ label: copy.nav.notifications });
    return finalize(crumbs);
  }

  if (pathname.startsWith("/profil/anggota")) {
    crumbs.push({ label: copy.nav.profile, href: "/profil" });
    crumbs.push({ label: "Anggota", href: "/profil/anggota" });
    const memberMatch = pathname.match(/^\/profil\/anggota\/([^/]+)/);
    if (memberMatch) {
      crumbs.push({ label: "Detail anggota" });
    }
    return finalize(crumbs);
  }

  if (pathname.startsWith("/profil/pengaturan")) {
    crumbs.push({ label: copy.nav.profile, href: "/profil" });
    crumbs.push({ label: "Pengaturan" });
    return finalize(crumbs);
  }

  if (pathname.startsWith("/profil/bantuan")) {
    crumbs.push({ label: copy.nav.profile, href: "/profil" });
    crumbs.push({ label: "Bantuan" });
    return finalize(crumbs);
  }

  if (pathname.startsWith("/profil/feedback")) {
    crumbs.push({ label: copy.nav.profile, href: "/profil" });
    crumbs.push({ label: "Masukan" });
    return finalize(crumbs);
  }

  if (pathname.startsWith("/profil")) {
    crumbs.push({ label: copy.nav.profile });
    return finalize(crumbs);
  }

  return finalize(crumbs);
}

function adminCrumbs(pathname: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    { label: "Admin", href: "/admin" },
  ];

  if (pathname === "/admin") {
    return [{ label: "Admin" }];
  }

  if (pathname.startsWith("/admin/program/")) {
    crumbs.push({ label: "Program", href: "/admin" });
    crumbs.push({ label: "Detail program" });
    return finalize(crumbs);
  }

  if (pathname.startsWith("/admin/kelompok/")) {
    crumbs.push({ label: "Kelompok", href: "/admin" });
    crumbs.push({ label: "Detail kelompok" });
    return finalize(crumbs);
  }

  if (pathname.startsWith("/admin/jadwal/")) {
    crumbs.push({ label: "Jadwal", href: "/admin" });
    const date = pathname.split("/").pop();
    crumbs.push({
      label:
        date && /^\d{4}-\d{2}-\d{2}$/.test(date)
          ? formatShortDate(date)
          : "Detail hari",
    });
    return finalize(crumbs);
  }

  if (pathname.startsWith("/admin/users/")) {
    crumbs.push({ label: "Peserta", href: "/admin" });
    crumbs.push({ label: "Detail peserta" });
    return finalize(crumbs);
  }

  return finalize(crumbs);
}

function finalize(crumbs: BreadcrumbItem[]): BreadcrumbItem[] {
  if (crumbs.length === 0) return crumbs;
  const last = crumbs[crumbs.length - 1];
  return [...crumbs.slice(0, -1), { label: last.label }];
}

function BreadcrumbNav({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("mb-3 lg:mb-4", className)}
    >
      <ol className="flex flex-wrap items-center gap-1 text-xs sm:text-[13px]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronRight
                  className="size-3.5 shrink-0 text-[var(--m-ink-soft)]/50"
                  aria-hidden
                />
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="inline-flex max-w-[12rem] items-center gap-1 truncate font-medium text-[var(--m-ink-soft)] transition-colors hover:text-[var(--m-accent)]"
                >
                  {index === 0 ? (
                    <Home className="size-3.5 shrink-0" aria-hidden />
                  ) : null}
                  <span className="truncate">{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "inline-flex max-w-[16rem] items-center gap-1 truncate font-semibold",
                    isLast
                      ? "text-[var(--m-ink)]"
                      : "text-[var(--m-ink-soft)]",
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {index === 0 && isLast ? (
                    <Home className="size-3.5 shrink-0" aria-hidden />
                  ) : null}
                  <span className="truncate">{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function MemberBreadcrumbInner({ className }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const items = memberCrumbs(pathname, searchParams);
  return <BreadcrumbNav items={items} className={className} />;
}

export function MemberBreadcrumb({ className }: { className?: string }) {
  return (
    <Suspense fallback={null}>
      <MemberBreadcrumbInner className={className} />
    </Suspense>
  );
}

export function AdminBreadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();
  const items = adminCrumbs(pathname);
  return (
    <BreadcrumbNav
      items={items}
      className={cn(
        "[&_a]:text-[var(--a-muted)] [&_a:hover]:text-[var(--a-accent)] [&_span]:text-[var(--a-ink)]",
        className,
      )}
    />
  );
}
