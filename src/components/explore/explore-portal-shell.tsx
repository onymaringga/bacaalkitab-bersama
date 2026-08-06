"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowUpRight, BookOpen, ChevronRight, Info } from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

export type ExplorePortalImage = {
  src: string;
  fallbackSrc: string;
  alt: string;
};

export type ExplorePortalHero = {
  href: string;
  eyebrow: string;
  section?: string;
  title: string;
  excerpt: string;
  image?: ExplorePortalImage;
  imageSlot?: ReactNode;
};

export type ExplorePortalArticle = {
  id: string;
  href: string;
  section: string;
  title: string;
  excerpt: string;
  image?: ExplorePortalImage;
  imageSlot?: ReactNode;
};

export function PortalImage({
  image,
  className,
}: {
  image: ExplorePortalImage;
  className?: string;
}) {
  const [src, setSrc] = useState(image.src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={image.alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (src !== image.fallbackSrc) setSrc(image.fallbackSrc);
      }}
    />
  );
}

export function PortalSectionHeader({
  title,
  hint,
  href,
  actionLabel = "Lihat semua",
}: {
  title: string;
  hint?: string;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3 border-b border-[var(--m-ink)]/10 pb-2">
      <div>
        <h2 className="member-web-display text-lg text-[var(--m-ink)]">{title}</h2>
        {hint ? (
          <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">{hint}</p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-[var(--m-accent)] hover:underline"
        >
          {actionLabel}
          <ChevronRight className="size-3.5" />
        </Link>
      ) : null}
    </div>
  );
}

export function PortalHeroBanner({ hero }: { hero: ExplorePortalHero }) {
  return (
    <Link
      href={hero.href}
      className="group relative block overflow-hidden rounded-2xl border border-[var(--m-line)] bg-[var(--m-ink)] shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-[16/10] sm:aspect-[21/9]">
        {hero.imageSlot ? (
          <div className="absolute inset-0 [&_img]:size-full [&_img]:object-cover">
            {hero.imageSlot}
          </div>
        ) : hero.image ? (
          <PortalImage
            image={hero.image}
            className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--m-accent)]/30 to-[var(--m-ink)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/92 via-[#0f172a]/45 to-[#0f172a]/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/55 via-transparent to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase">
            {hero.eyebrow}
            {hero.section ? (
              <>
                <span className="mx-2 text-white/35">·</span>
                {hero.section}
              </>
            ) : null}
          </p>
          <h2 className="member-web-display mt-2 max-w-2xl text-[clamp(1.5rem,3vw,2.35rem)] leading-[1.08] text-white">
            {hero.title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/82">
            {hero.excerpt}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--m-ink)] transition group-hover:bg-white/92">
            {copy.explore.readArticleCta}
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PortalArticleCard({
  article,
  featured = false,
}: {
  article: ExplorePortalArticle;
  featured?: boolean;
}) {
  return (
    <Link
      href={article.href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--m-line)] bg-white transition hover:border-[var(--m-accent)]/25 hover:shadow-sm",
        featured && "sm:flex-row sm:items-stretch",
      )}
    >
      {article.imageSlot ? (
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-[var(--m-wash)]",
            featured ? "aspect-[16/10] sm:aspect-auto sm:w-2/5" : "aspect-[16/10]",
          )}
        >
          {article.imageSlot}
        </div>
      ) : article.image ? (
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-[var(--m-wash)]",
            featured ? "aspect-[16/10] sm:aspect-auto sm:w-2/5" : "aspect-[16/10]",
          )}
        >
          <PortalImage
            image={article.image}
            className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center bg-gradient-to-br from-[var(--m-wash)] to-[var(--m-accent)]/10",
            featured ? "aspect-[16/10] sm:aspect-auto sm:w-2/5" : "aspect-[16/10]",
          )}
        >
          <BookOpen className="size-8 text-[var(--m-accent)]/45" aria-hidden />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold tracking-wide text-[var(--m-accent)] uppercase">
          {article.section}
        </p>
        <h3
          className={cn(
            "mt-1 font-semibold leading-snug text-[var(--m-ink)] group-hover:text-[var(--m-accent)]",
            featured ? "text-lg" : "text-sm",
          )}
        >
          {article.title}
        </h3>
        <p className="mt-1.5 line-clamp-3 flex-1 text-xs leading-relaxed text-[var(--m-ink-soft)] sm:text-sm">
          {article.excerpt}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--m-accent)]">
          {copy.explore.readArticleCta}
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}

export function PortalArticleRow({ article }: { article: ExplorePortalArticle }) {
  return (
    <Link
      href={article.href}
      className="group flex gap-3 border-b border-[var(--m-line)] py-3 last:border-0"
    >
      {article.imageSlot ? (
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-[var(--m-wash)]">
          {article.imageSlot}
        </div>
      ) : article.image ? (
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-[var(--m-wash)]">
          <PortalImage image={article.image} className="size-full object-cover" />
        </div>
      ) : (
        <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-[var(--m-wash)]">
          <BookOpen className="size-5 text-[var(--m-accent)]/50" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold tracking-wide text-[var(--m-accent)] uppercase">
          {article.section}
        </p>
        <p className="mt-0.5 font-semibold leading-snug text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
          {article.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-[var(--m-ink-soft)]">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}

export function PortalPopularLinks({
  links,
  title = copy.explore.popularTitle,
}: {
  links: readonly { label: string; href: string }[];
  title?: string;
}) {
  return (
    <section className="space-y-2">
      <PortalSectionHeader title={title} />
      <ul className="divide-y divide-[var(--m-line)] rounded-xl border border-[var(--m-line)] bg-white px-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center justify-between gap-2 py-2.5 text-sm font-medium text-[var(--m-ink)] transition hover:text-[var(--m-accent)]"
            >
              {link.label}
              <ChevronRight className="size-4 shrink-0 opacity-40" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PortalAiDisclaimer() {
  return (
    <p
      role="note"
      className="flex items-start gap-2 rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/40 px-3 py-2.5 text-[11px] leading-relaxed text-[var(--m-ink-soft)]"
    >
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{copy.explore.aiDisclaimer}</span>
    </p>
  );
}

export function ExplorePortalSidebar({
  popularLinks,
  children,
}: {
  popularLinks?: readonly { label: string; href: string }[];
  children?: ReactNode;
}) {
  return (
    <>
      {children}
      {popularLinks?.length ? <PortalPopularLinks links={popularLinks} /> : null}
      <PortalAiDisclaimer />
    </>
  );
}

export function ExplorePortalShell({
  eyebrow,
  title,
  subtitle,
  stats,
  hero,
  toolbar,
  sidebar,
  children,
  footer,
  backHref = "/explore",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  stats?: string;
  hero?: ExplorePortalHero | null;
  toolbar?: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  backHref?: string;
}) {
  return (
    <div className="member-web-animate-in mx-auto w-full max-w-6xl space-y-6 pb-6">
      <HistoryBackButton
        fallbackHref={backHref}
        label={copy.explore.backToExplore}
        size="sm"
        variant="ghost"
        className="-ml-2 h-9 px-2 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
      />

      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--m-line)] pb-4">
        <div>
          <p className="member-web-kicker text-[var(--m-accent)]">{eyebrow}</p>
          <h1 className="member-web-display mt-0.5 text-[clamp(1.75rem,3vw,2.35rem)] leading-tight text-[var(--m-ink)]">
            {title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--m-ink-soft)]">{subtitle}</p>
        </div>
        {stats ? (
          <p className="rounded-full border border-[var(--m-line)] bg-white px-3 py-1.5 text-xs tabular-nums text-[var(--m-ink-soft)]">
            {stats}
          </p>
        ) : null}
      </header>

      {hero ? <PortalHeroBanner hero={hero} /> : null}
      {toolbar ? <div className="space-y-3">{toolbar}</div> : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start">
        <div className="space-y-6">{children}</div>
        {sidebar ? (
          <aside className="space-y-5 lg:sticky lg:top-24">{sidebar}</aside>
        ) : null}
      </div>

      {footer}
    </div>
  );
}

export function PortalCatalogSection({
  title,
  countLabel,
  emptyMessage,
  isEmpty,
  children,
}: {
  title: string;
  countLabel?: string;
  emptyMessage?: string;
  isEmpty?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <PortalSectionHeader title={title} />
        {countLabel ? (
          <span className="shrink-0 text-xs tabular-nums text-[var(--m-ink-soft)]">
            {countLabel}
          </span>
        ) : null}
      </div>
      {isEmpty && emptyMessage ? (
        <p className="rounded-xl border border-dashed border-[var(--m-line)] bg-white/60 px-4 py-10 text-center text-sm text-[var(--m-ink-soft)]">
          {emptyMessage}
        </p>
      ) : (
        children
      )}
    </section>
  );
}

export function PortalSearchChips({
  chips,
  onSelect,
}: {
  chips: readonly string[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onSelect(chip)}
          className="rounded-lg border border-[var(--m-line)] bg-white px-2.5 py-1 text-[11px] font-medium text-[var(--m-ink-soft)] transition hover:border-[var(--m-accent)]/40 hover:text-[var(--m-ink)]"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
