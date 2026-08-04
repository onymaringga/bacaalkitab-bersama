import type { ReactNode } from "react";
import Link from "next/link";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { ArrowUpRight } from "lucide-react";

import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-landing-display",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-landing-sans",
});

const navLinks = [
  { href: "/cara-kerja", label: "Cara kerja" },
  { href: "/untuk-komunitas", label: "Untuk komunitas" },
] as const;

const legalLinks = [
  { href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
  { href: "/kebijakan-privasi", label: "Kebijakan Privasi" },
] as const;

export function MarketingShell({
  children,
  activeHref,
}: {
  children: ReactNode;
  activeHref?: string;
}) {
  return (
    <div
      className={cn(
        display.variable,
        sans.variable,
        "landing min-h-dvh overflow-x-hidden antialiased",
      )}
    >
      <header className="sticky top-0 z-30 border-b border-[var(--l-line-soft)] bg-[var(--l-paper)]/85 backdrop-blur-md">
        <div className="landing-shell flex h-14 items-center justify-between gap-4 md:h-16">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/" className="landing-brand-mark shrink-0 text-[var(--l-ink)]">
              {copy.app.name}
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                    activeHref === link.href
                      ? "bg-[var(--l-wash)] text-[var(--l-accent)]"
                      : "text-[var(--l-ink-soft)] hover:text-[var(--l-ink)]",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/login" className="landing-btn-ghost landing-btn-sm">
              {copy.auth.login.title}
            </Link>
            <Link href="/register" className="landing-btn-primary landing-btn-sm">
              {copy.auth.login.register}
            </Link>
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-[var(--l-line-soft)] bg-[var(--l-paper)]">
        <div className="landing-shell flex flex-col gap-6 py-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="landing-brand-mark text-sm text-[var(--l-ink)]">
              {copy.app.name}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 sm:hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-semibold text-[var(--l-accent)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <nav
              aria-label="Legal"
              className="flex flex-wrap gap-x-4 gap-y-2 md:justify-end"
            >
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-semibold text-[var(--l-ink-soft)] transition hover:text-[var(--l-accent)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="text-xs text-[var(--l-ink-soft)] md:text-right">
              Baca · Renung · Tumbuh bersama
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function MarketingCta({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="landing-cta-band">
      <div className="landing-shell py-14 text-center md:py-16">
        <div className="landing-reveal mx-auto max-w-2xl">
          <h2 className="landing-display text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.1] text-white">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80">
            {subtitle}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className="landing-btn-on-color">
              {copy.auth.login.register}
              <ArrowUpRight className="size-4" />
            </Link>
            <Link href="/login" className="landing-btn-on-color-ghost">
              {copy.auth.login.title}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
