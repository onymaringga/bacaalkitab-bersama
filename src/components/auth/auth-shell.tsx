import type { ReactNode } from "react";
import Link from "next/link";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { ArrowLeft } from "lucide-react";

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

const PANEL_IMG =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1400&q=85";

export function AuthShell({
  children,
  title,
  subtitle,
  panelEyebrow,
  panelTitle,
  panelBody,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
  panelEyebrow?: string;
  panelTitle?: ReactNode;
  panelBody?: string;
}) {
  return (
    <div
      className={cn(
        display.variable,
        sans.variable,
        "landing relative min-h-dvh antialiased",
      )}
      data-copy-root
    >
      <div className="landing-hero-wash pointer-events-none absolute inset-0 opacity-80" />

      <div className="relative grid min-h-dvh lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${PANEL_IMG})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#12233f]/92 via-[#1a2b45]/55 to-[#1a2b45]/25"
            aria-hidden
          />
          <div className="relative z-10 flex flex-1 flex-col justify-between p-10 xl:p-12">
            <Link
              href="/"
              className="landing-brand-mark text-[1.05rem] text-white"
            >
              {copy.app.name}
            </Link>
            <div className="max-w-md pb-4">
              {panelEyebrow ? (
                <p className="landing-kicker text-white/70">{panelEyebrow}</p>
              ) : null}
              <h2 className="landing-display mt-3 text-[clamp(2rem,3vw,2.75rem)] leading-[1.1] text-white">
                {panelTitle}
              </h2>
              {panelBody ? (
                <p className="mt-4 text-sm leading-relaxed text-white/75">
                  {panelBody}
                </p>
              ) : null}
            </div>
          </div>
        </aside>

        <main className="relative flex flex-col justify-center px-5 py-10 sm:px-8 md:px-12">
          <div className="mx-auto w-full max-w-[24rem]">
            <div className="mb-8 flex items-center justify-between gap-3 lg:mb-10">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--l-ink-soft)] transition-colors hover:text-[var(--l-ink)]"
              >
                <ArrowLeft className="size-4" />
                Beranda
              </Link>
              <Link
                href="/"
                className="landing-brand-mark text-sm text-[var(--l-ink)] lg:hidden"
              >
                {copy.app.name}
              </Link>
            </div>

            <div className="landing-reveal">
              <h1 className="landing-display text-[clamp(1.85rem,4vw,2.35rem)] leading-[1.1] text-[var(--l-ink)]">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[var(--l-ink-soft)]">
                {subtitle}
              </p>
            </div>

            <div
              className="landing-reveal mt-8"
              style={{ animationDelay: "80ms" }}
            >
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
