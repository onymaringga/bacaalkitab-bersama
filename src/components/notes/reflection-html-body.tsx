"use client";

import {
  looksLikeHtml,
  sanitizeReflectionHtml,
  stripReflectionHtml,
} from "@/lib/reflection-html";
import { cn } from "@/lib/utils";

type ReflectionHtmlBodyProps = {
  content: string;
  className?: string;
  /** Potong teks polos jika lebih panjang dari ini (tanpa HTML). */
  previewChars?: number;
  expanded?: boolean;
};

/** Tampilkan isi refleksi (HTML aman atau plain text). */
export function ReflectionHtmlBody({
  content,
  className,
  previewChars,
  expanded = true,
}: ReflectionHtmlBodyProps) {
  const plain = stripReflectionHtml(content);
  const long =
    typeof previewChars === "number" && plain.length > previewChars;
  const showPreview = long && !expanded;

  if (!looksLikeHtml(content)) {
    const body = showPreview
      ? `${plain.slice(0, previewChars).trimEnd()}…`
      : content;
    return (
      <p
        className={cn(
          "whitespace-pre-wrap text-sm leading-relaxed text-[var(--m-ink)]",
          className,
        )}
      >
        {body}
      </p>
    );
  }

  if (showPreview) {
    return (
      <p
        className={cn(
          "whitespace-pre-wrap text-sm leading-relaxed text-[var(--m-ink)]",
          className,
        )}
      >
        {`${plain.slice(0, previewChars).trimEnd()}…`}
      </p>
    );
  }

  const safe = sanitizeReflectionHtml(content);
  return (
    <div
      className={cn(
        "reflection-html-body text-sm leading-relaxed text-[var(--m-ink)]",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
