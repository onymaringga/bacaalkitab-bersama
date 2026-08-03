import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { LandingFaq } from "@/components/marketing/landing-faq";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { copy } from "@/lib/copy";

/** Still-life only — no faces / dating-style portraits */
const IMG_BIBLE =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1400&q=85";
const IMG_PAGES =
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&q=85";
const IMG_LIGHT =
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1600&q=85";

const journey = [
  {
    ...copy.landing.journey.read,
    image: IMG_BIBLE,
    tone: "sky" as const,
  },
  {
    ...copy.landing.journey.reflect,
    image: IMG_PAGES,
    tone: "mint" as const,
  },
  {
    ...copy.landing.journey.grow,
    image: IMG_LIGHT,
    tone: "lilac" as const,
  },
] as const;

export default function HomePage() {
  return (
    <MarketingShell>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[var(--l-line-soft)]">
        <div className="landing-hero-wash" aria-hidden />
        <div className="landing-shell relative grid items-center gap-10 py-14 md:grid-cols-12 md:gap-10 md:py-16 lg:min-h-[calc(100dvh-4rem)] lg:py-20">
          <div className="landing-reveal md:col-span-6 lg:col-span-5">
            <p className="landing-kicker text-[var(--l-accent)]">
              Program baca Alkitab bersama
            </p>
            <h1 className="landing-display mt-4 text-[clamp(2.5rem,6.5vw,4.75rem)] leading-[0.96] text-[var(--l-ink)]">
              Baca Alkitab
              <br />
              <span className="landing-display-italic text-[var(--l-accent)]">
                Bersama
              </span>
            </h1>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-[var(--l-ink-soft)] md:text-base">
              Baca, renung, dan tumbuh bersama kelompokmu.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/login" className="landing-btn-primary">
                Masuk
                <ArrowUpRight className="size-4" />
              </Link>
              <Link href="/cara-kerja" className="landing-btn-ghost">
                Lihat cara kerja
              </Link>
            </div>
          </div>

          <div
            className="landing-reveal md:col-span-6 lg:col-span-7"
            style={{ animationDelay: "100ms" }}
          >
            <div className="landing-hero-frame">
              <div
                className="landing-hero-photo"
                style={{ backgroundImage: `url(${IMG_BIBLE})` }}
                role="img"
                aria-label="Alkitab terbuka"
              />
              <div className="landing-hero-caption">
                <p className="landing-kicker text-[var(--l-accent)]">Hari ini</p>
                <p className="landing-display-italic mt-2 text-lg leading-snug text-[var(--l-ink)] md:text-xl">
                  “Firman-Mu itu pelita bagi kakiku…”
                </p>
                <p className="mt-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--l-ink-soft)] uppercase">
                  Mazmur 119:105 · Matius 5:1–12
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="bg-[var(--l-wash)]">
        <div className="landing-shell py-16 md:py-20">
          <div className="landing-reveal flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="landing-kicker text-[var(--l-accent)]">Alur</p>
              <h2 className="landing-display mt-3 text-[clamp(1.9rem,4vw,2.85rem)] leading-[1.1] text-[var(--l-ink)]">
                {copy.landing.journeyTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--l-ink-soft)]">
                {copy.landing.journeySubtitle}
              </p>
            </div>
            <Link
              href="/cara-kerja"
              className="text-sm font-semibold text-[var(--l-accent)] hover:underline"
            >
              Selengkapnya →
            </Link>
          </div>

          <ol className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-5">
            {journey.map((step, index) => (
              <li
                key={step.title}
                className={`landing-reveal landing-step overflow-hidden landing-step-${step.tone}`}
                style={{ animationDelay: `${90 + index * 80}ms` }}
              >
                <div
                  className="aspect-[16/10] bg-cover bg-center"
                  style={{ backgroundImage: `url(${step.image})` }}
                  role="img"
                  aria-label={step.title}
                />
                <div className="p-5 md:p-6">
                  <p className="text-xs font-bold tracking-[0.16em] text-[var(--l-accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="landing-display mt-2 text-2xl text-[var(--l-ink)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--l-ink-soft)]">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FOR WHOM */}
      <section className="bg-[var(--l-paper)]">
        <div className="landing-shell grid items-center gap-10 py-16 md:grid-cols-12 md:gap-12 md:py-20">
          <div className="landing-reveal order-2 md:order-1 md:col-span-6">
            <div
              className="landing-side-photo aspect-[4/3] bg-cover bg-center"
              style={{ backgroundImage: `url(${IMG_LIGHT})` }}
              role="img"
              aria-label="Halaman Alkitab di cahaya pagi"
            />
          </div>
          <div className="landing-reveal order-1 md:order-2 md:col-span-6">
            <p className="landing-kicker text-[var(--l-accent)]">Untuk siapa</p>
            <h2 className="landing-display mt-3 text-[clamp(1.9rem,4vw,2.85rem)] leading-[1.1] text-[var(--l-ink)]">
              {copy.landing.forWhomTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--l-ink-soft)]">
              {copy.landing.forWhomSubtitle}
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Jadwal baca harian yang jelas untuk seluruh program",
                "Kelompok saling mendukung tanpa rasa diawasi",
                "Admin dan ketua memantau kesehatan program dengan lembut",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm text-[var(--l-ink)]"
                >
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--l-accent)]" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/untuk-komunitas"
              className="mt-6 inline-flex text-sm font-semibold text-[var(--l-accent)] hover:underline"
            >
              Lihat untuk komunitas →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[var(--l-line-soft)] bg-[var(--l-paper)]">
        <div className="landing-shell py-16 md:py-20">
          <div className="landing-reveal mx-auto max-w-2xl text-center md:mx-0 md:max-w-xl md:text-left">
            <p className="landing-kicker text-[var(--l-accent)]">FAQ</p>
            <h2 className="landing-display mt-3 text-[clamp(1.9rem,4vw,2.85rem)] leading-[1.1] text-[var(--l-ink)]">
              {copy.landing.faqTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--l-ink-soft)]">
              {copy.landing.faqSubtitle}
            </p>
          </div>

          <div className="mt-10 md:mt-12 md:grid md:grid-cols-12 md:gap-10">
            <div className="md:col-span-10 lg:col-span-8">
              <LandingFaq items={copy.landing.faq} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta-band">
        <div className="landing-shell py-16 text-center md:py-20">
          <div className="landing-reveal mx-auto max-w-2xl">
            <p className="landing-kicker text-white/75">Mulai</p>
            <h2 className="landing-display mt-3 text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] text-white">
              {copy.landing.finalCtaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/80">
              {copy.landing.finalCtaSubtitle}
            </p>
            <div className="mt-8">
              <Link href="/login" className="landing-btn-on-color">
                Masuk
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
