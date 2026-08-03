/** Util HTML ringan untuk refleksi (bold / warna / ukuran / garis). */

const ALLOWED_TAGS = new Set([
  "B",
  "STRONG",
  "I",
  "EM",
  "U",
  "BR",
  "P",
  "DIV",
  "SPAN",
  "HR",
  "FONT",
]);

/** Ukuran font yang diizinkan di refleksi. */
export const REFLECTION_FONT_SIZES = [
  { id: "sm", label: "Kecil", value: "0.875rem", shortcut: "A-" },
  { id: "md", label: "Normal", value: "1rem", shortcut: "A" },
  { id: "lg", label: "Besar", value: "1.25rem", shortcut: "A+" },
  { id: "xl", label: "Sangat besar", value: "1.5rem", shortcut: "A++" },
] as const;

export type ReflectionFontSizeId = (typeof REFLECTION_FONT_SIZES)[number]["id"];

const ALLOWED_FONT_SIZES: Set<string> = new Set(
  REFLECTION_FONT_SIZES.map((item) => item.value),
);

const LEGACY_FONT_SIZE_MAP: Record<string, string> = {
  "1": "0.875rem",
  "2": "0.875rem",
  "3": "1rem",
  "4": "1.25rem",
  "5": "1.5rem",
  "6": "1.5rem",
  "7": "1.5rem",
};

export function looksLikeHtml(content: string) {
  return /<\/?[a-z][\s\S]*>/i.test(content.trim());
}

export function stripReflectionHtml(content: string) {
  if (!content) return "";
  if (typeof window === "undefined") {
    return content
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<hr\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  const doc = new DOMParser().parseFromString(content, "text/html");
  return (doc.body.textContent ?? "").replace(/\u00a0/g, " ").trim();
}

function normalizeFontSize(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = raw.trim().toLowerCase();
  if (ALLOWED_FONT_SIZES.has(value)) return value;
  if (LEGACY_FONT_SIZE_MAP[value]) return LEGACY_FONT_SIZE_MAP[value];
  // px umum dari browser
  if (value === "14px" || value === "0.875em") return "0.875rem";
  if (value === "16px" || value === "1em") return "1rem";
  if (value === "20px" || value === "1.25em") return "1.25rem";
  if (value === "24px" || value === "1.5em") return "1.5rem";
  return null;
}

function sanitizeNode(node: Node, out: ParentNode) {
  if (node.nodeType === Node.TEXT_NODE) {
    out.appendChild(document.createTextNode(node.textContent ?? ""));
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;

  const el = node as HTMLElement;
  const tag = el.tagName.toUpperCase();

  if (tag === "SCRIPT" || tag === "STYLE" || tag === "IFRAME") return;

  if (!ALLOWED_TAGS.has(tag)) {
    for (const child of Array.from(el.childNodes)) {
      sanitizeNode(child, out);
    }
    return;
  }

  if (tag === "BR" || tag === "HR") {
    out.appendChild(document.createElement(tag.toLowerCase()));
    return;
  }

  const clean = document.createElement(
    tag === "FONT" ? "span" : tag.toLowerCase(),
  );

  if (tag === "SPAN" || tag === "FONT") {
    const color =
      el.style.color ||
      el.getAttribute("color") ||
      el.getAttribute("data-color");
    if (color && /^#[0-9a-f]{3,8}$/i.test(color.trim())) {
      clean.style.color = color.trim();
    } else if (
      color &&
      /^(rgb|hsl)a?\([\d\s%.,]+\)$/i.test(color.trim())
    ) {
      clean.style.color = color.trim();
    }

    const fontSize = normalizeFontSize(
      el.style.fontSize || el.getAttribute("size") || el.getAttribute("data-size"),
    );
    if (fontSize) {
      clean.style.fontSize = fontSize;
    }
  }

  for (const child of Array.from(el.childNodes)) {
    sanitizeNode(child, clean);
  }
  out.appendChild(clean);
}

/** Bersihkan HTML refleksi — hanya tag aman. */
export function sanitizeReflectionHtml(html: string) {
  if (!html.trim()) return "";
  if (typeof window === "undefined") return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const fragment = document.createDocumentFragment();
  for (const child of Array.from(doc.body.childNodes)) {
    sanitizeNode(child, fragment);
  }
  const wrap = document.createElement("div");
  wrap.appendChild(fragment);
  return wrap.innerHTML;
}

/** Plain text → HTML aman untuk editor (baris baru jadi &lt;br&gt;). */
export function plainTextToReflectionHtml(text: string) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\n/g, "<br>");
}

export function reflectionContentToEditorHtml(content: string) {
  if (!content) return "";
  if (looksLikeHtml(content)) return sanitizeReflectionHtml(content);
  return plainTextToReflectionHtml(content);
}

export function reflectionPlainLength(content: string) {
  return stripReflectionHtml(content).length;
}
