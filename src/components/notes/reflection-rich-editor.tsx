"use client";

import { useEffect, useRef } from "react";
import { Bold, Minus, Palette, Type } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuickTooltip } from "@/components/ui/quick-tooltip";
import {
  REFLECTION_FONT_SIZES,
  reflectionContentToEditorHtml,
  reflectionPlainLength,
  sanitizeReflectionHtml,
} from "@/lib/reflection-html";
import { cn } from "@/lib/utils";

const TEXT_COLORS = [
  { id: "ink", label: "Hitam", value: "#14233a" },
  { id: "accent", label: "Biru", value: "#2563eb" },
  { id: "emerald", label: "Hijau", value: "#047857" },
  { id: "amber", label: "Amber", value: "#b45309" },
  { id: "rose", label: "Merah", value: "#be123c" },
] as const;

type ReflectionRichEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  minHeightClassName?: string;
};

/** Editor refleksi: bold, ukuran font, garis horizontal, warna teks. */
export function ReflectionRichEditor({
  value,
  onChange,
  placeholder = "Tulis refleksi…",
  maxLength = 2000,
  className,
  minHeightClassName = "min-h-[10rem]",
}: ReflectionRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastHtmlRef = useRef("");

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const next = reflectionContentToEditorHtml(value);
    if (next === lastHtmlRef.current) return;
    if (el.innerHTML === next) {
      lastHtmlRef.current = next;
      return;
    }
    el.innerHTML = next || "";
    lastHtmlRef.current = el.innerHTML;
  }, [value]);

  function emitChange() {
    const el = editorRef.current;
    if (!el) return;
    const html = sanitizeReflectionHtml(el.innerHTML);
    const plainLen = reflectionPlainLength(html);
    if (plainLen > maxLength) {
      // Batasi: kembalikan isi sebelumnya jika melebihi.
      el.innerHTML = lastHtmlRef.current;
      return;
    }
    lastHtmlRef.current = html;
    onChange(html);
  }

  function runCommand(command: string, commandValue?: string) {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    try {
      document.execCommand(command, false, commandValue);
    } catch {
      /* ignore */
    }
    emitChange();
  }

  /** Terapkan font-size ke seleksi (via fontSize sementara → span). */
  function applyFontSize(sizeValue: string) {
    const el = editorRef.current;
    if (!el) return;
    el.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      // Tanpa seleksi: set ukuran default untuk ketikan berikutnya via font tag
      try {
        document.execCommand("fontSize", false, "7");
      } catch {
        /* ignore */
      }
    } else {
      try {
        document.execCommand("fontSize", false, "7");
      } catch {
        /* ignore */
      }
    }

    const fonts = el.querySelectorAll("font[size='7']");
    fonts.forEach((font) => {
      const span = document.createElement("span");
      span.style.fontSize = sizeValue;
      // pertahankan warna jika ada
      const color = (font as HTMLElement).getAttribute("color");
      if (color) span.style.color = color;
      while (font.firstChild) {
        span.appendChild(font.firstChild);
      }
      font.replaceWith(span);
    });

    emitChange();
  }

  const plainLen = reflectionPlainLength(value);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--m-line)] bg-[var(--m-paper)]",
        className,
      )}
    >
      <div
        className="flex flex-wrap items-center gap-0.5 border-b border-[var(--m-line)] bg-[var(--m-wash)]/40 px-1.5 py-1"
        role="toolbar"
        aria-label="Format teks refleksi"
      >
        <QuickTooltip label="Tebal">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-lg"
            aria-label="Tebal"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("bold")}
          >
            <Bold className="size-3.5" />
          </Button>
        </QuickTooltip>
        <QuickTooltip label="Garis pemisah">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-lg"
            aria-label="Sisipkan garis"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("insertHorizontalRule")}
          >
            <Minus className="size-3.5" />
          </Button>
        </QuickTooltip>

        <span className="mx-1 h-4 w-px bg-[var(--m-line)]" aria-hidden />

        <span className="inline-flex items-center gap-0.5 px-0.5 text-[var(--m-ink-soft)]">
          <Type className="size-3.5" aria-hidden />
          <span className="sr-only">Ukuran teks</span>
        </span>
        {REFLECTION_FONT_SIZES.map((size, index) => (
          <QuickTooltip key={size.id} label={size.label}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 min-w-8 rounded-lg px-1.5 font-semibold text-[var(--m-ink)]"
              style={{ fontSize: `${0.7 + index * 0.12}rem` }}
              aria-label={`Ukuran ${size.label}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => applyFontSize(size.value)}
            >
              A
            </Button>
          </QuickTooltip>
        ))}

        <span className="mx-1 h-4 w-px bg-[var(--m-line)]" aria-hidden />

        <span className="inline-flex items-center gap-0.5 px-0.5 text-[var(--m-ink-soft)]">
          <Palette className="size-3.5" aria-hidden />
          <span className="sr-only">Warna teks</span>
        </span>
        {TEXT_COLORS.map((color) => (
          <QuickTooltip key={color.id} label={color.label}>
            <button
              type="button"
              aria-label={`Warna ${color.label}`}
              className="mx-0.5 size-5 rounded-full border border-black/10 shadow-sm transition hover:scale-110"
              style={{ backgroundColor: color.value }}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand("foreColor", color.value)}
            />
          </QuickTooltip>
        ))}
      </div>

      <div className="relative">
        {!plainLen ? (
          <p className="pointer-events-none absolute top-3 left-3 text-sm text-[var(--m-ink-soft)]">
            {placeholder}
          </p>
        ) : null}
        <div
          ref={editorRef}
          role="textbox"
          aria-multiline
          contentEditable
          suppressContentEditableWarning
          className={cn(
            "reflection-rich-editor px-3 py-3 text-sm leading-relaxed text-[var(--m-ink)] outline-none",
            minHeightClassName,
          )}
          onInput={emitChange}
          onBlur={emitChange}
        />
      </div>

      <div className="flex justify-end border-t border-[var(--m-line)] px-3 py-1.5">
        <p className="text-[11px] tabular-nums text-[var(--m-ink-soft)]">
          {plainLen}/{maxLength}
        </p>
      </div>
    </div>
  );
}
