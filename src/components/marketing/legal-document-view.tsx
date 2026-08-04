import Link from "next/link";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import type { LegalDocument } from "@/lib/legal-content";

type LegalDocumentViewProps = {
  document: LegalDocument;
  backHref?: string;
  backLabel?: string;
};

export function LegalDocumentView({
  document,
  backHref = "/",
  backLabel = "Kembali ke beranda",
}: LegalDocumentViewProps) {
  return (
    <article className="landing-shell py-10 md:py-14">
      <HistoryBackButton
        fallbackHref={backHref}
        label={backLabel}
        size="sm"
        variant="ghost"
        className="-ml-2 mb-6 h-9 px-2 text-[var(--l-ink-soft)] hover:text-[var(--l-ink)]"
      />

      <header className="landing-reveal max-w-2xl">
        <p className="landing-kicker text-[var(--l-accent)]">Legal</p>
        <h1 className="landing-display mt-3 text-[clamp(2rem,4.5vw,3rem)] leading-[1.08] text-[var(--l-ink)]">
          {document.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--l-ink-soft)] md:text-base">
          {document.subtitle}
        </p>
        <p className="mt-3 text-xs font-medium text-[var(--l-ink-soft)]">
          Terakhir diperbarui: {document.updatedAt}
        </p>
      </header>

      <div className="landing-reveal mt-10 max-w-2xl space-y-8">
        {document.sections.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-[var(--l-line-soft)] bg-white px-5 py-5 md:px-6 md:py-6"
          >
            <h2 className="text-base font-semibold text-[var(--l-ink)] md:text-lg">
              {section.title}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--l-ink-soft)]">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
              {section.bullets?.length ? (
                <ul className="list-disc space-y-2 pl-5">
                  {section.bullets.map((item) => (
                    <li key={item.slice(0, 48)}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      <footer className="landing-reveal mt-10 flex flex-wrap gap-4 border-t border-[var(--l-line-soft)] pt-6 text-sm">
        <Link
          href="/syarat-ketentuan"
          className="font-semibold text-[var(--l-accent)] hover:underline"
        >
          Syarat & Ketentuan
        </Link>
        <Link
          href="/kebijakan-privasi"
          className="font-semibold text-[var(--l-accent)] hover:underline"
        >
          Kebijakan Privasi
        </Link>
      </footer>
    </article>
  );
}
