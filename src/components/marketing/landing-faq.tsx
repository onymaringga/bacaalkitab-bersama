"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type FaqItem = {
  q: string;
  a: string;
};

type LandingFaqProps = {
  items: readonly FaqItem[];
};

export function LandingFaq({ items }: LandingFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-[var(--l-line-soft)] border-y border-[var(--l-line-soft)]">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `landing-faq-panel-${index}`;
        const buttonId = `landing-faq-button-${index}`;

        return (
          <li key={item.q} className="landing-reveal" style={{ animationDelay: `${index * 60}ms` }}>
            <button
              type="button"
              id={buttonId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-start gap-4 py-5 text-left transition-colors hover:text-[var(--l-accent)] md:py-6"
            >
              <span className="mt-0.5 font-mono text-[0.7rem] font-semibold tracking-wider text-[var(--l-accent)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="landing-display min-w-0 flex-1 text-lg leading-snug text-[var(--l-ink)] md:text-xl">
                {item.q}
              </span>
              <ChevronDown
                className={cn(
                  "mt-1 size-5 shrink-0 text-[var(--l-accent)] transition-transform duration-200",
                  open && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="pb-5 pl-10 pr-2 md:pb-6 md:pl-12"
            >
              <p className="max-w-2xl text-sm leading-relaxed text-[var(--l-ink-soft)] md:text-[0.95rem]">
                {item.a}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
