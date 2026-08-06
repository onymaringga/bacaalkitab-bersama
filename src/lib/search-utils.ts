/** Shared search normalization, fuzzy matching, and relevance scoring. */

export function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix: number[] = new Array(cols);

  for (let j = 0; j < cols; j += 1) matrix[j] = j;

  for (let i = 1; i < rows; i += 1) {
    let prev = i;
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const next = Math.min(
        matrix[j] + 1,
        prev + 1,
        matrix[j - 1] + cost,
      );
      matrix[j - 1] = prev;
      prev = next;
    }
    matrix[cols - 1] = prev;
  }

  return matrix[cols - 1];
}

/** Score a query against a person/place name (exact, prefix, substring, typo-tolerant). */
export function scoreNameMatch(query: string, name: string) {
  const q = normalizeSearch(query);
  const n = normalizeSearch(name);
  if (!q || !n) return 0;

  if (q === n) return 100;
  if (n.startsWith(q)) return 80 + Math.round((q.length / n.length) * 15);
  if (q.startsWith(n) && n.length >= 3) return 75;
  if (n.includes(q) && q.length >= 3) return 55 + Math.round((q.length / n.length) * 15);

  const dist = levenshtein(q, n);
  const maxLen = Math.max(q.length, n.length);
  const ratio = 1 - dist / maxLen;

  if (dist === 1 && maxLen >= 4 && maxLen <= 12) return 72;
  if (ratio >= 0.78 && q.length >= 3 && n.length >= 3) {
    return Math.round(ratio * 68);
  }

  return 0;
}

type BookKeyKind = "name" | "abbr" | "alias";

/** Score bible book relevance. Avoids reverse substring matches like thomas ⊃ ho (Hosea). */
export function scoreBookMatch(
  query: string,
  book: { name: string; abbr: string; aliases: string[] },
) {
  const q = normalizeSearch(query);
  if (!q) return 0;

  let best = 0;
  const entries: { key: string; kind: BookKeyKind }[] = [
    { key: book.name, kind: "name" },
    { key: book.abbr, kind: "abbr" },
    ...book.aliases.map((alias) => ({ key: alias, kind: "alias" as const })),
  ];

  for (const { key, kind } of entries) {
    const k = normalizeSearch(key);
    if (!k) continue;

    if (q === k) {
      best = Math.max(best, 100);
      continue;
    }

    if (k.startsWith(q)) {
      best = Math.max(best, 70 + Math.round((q.length / k.length) * 25));
      continue;
    }

    const isShortKey = kind === "abbr" || k.length <= 3;
    if (isShortKey) {
      if (q.startsWith(k)) {
        const rest = q.slice(k.length);
        if (rest === "" || /^\s/.test(rest)) {
          best = Math.max(best, 88);
        }
      }
      continue;
    }

    if (k.includes(q) && q.length >= 2) {
      best = Math.max(best, 50 + Math.round((q.length / k.length) * 30));
    }

    if (k.length >= 4 && q.length >= 3) {
      const dist = levenshtein(q, k);
      const maxLen = Math.max(q.length, k.length);
      const ratio = 1 - dist / maxLen;
      if (ratio >= 0.82) {
        best = Math.max(best, Math.round(ratio * 62));
      }
    }
  }

  return best;
}

/** Minimum score to include a bible book hit in global search. */
export const BIBLE_BOOK_MATCH_MIN_SCORE = 45;

/** Minimum name score to treat a character match as strong (suppress weak bible hits). */
export const STRONG_NAME_MATCH_MIN_SCORE = 55;

function haystackWords(haystack: string) {
  return normalizeSearch(haystack)
    .split(/[\s,.;:!?()[\]"'·/—–-]+/)
    .filter(Boolean);
}

export function scoreHaystackMatch(query: string, haystack: string) {
  const q = normalizeSearch(query);
  if (!q || q.length < 3) return 0;

  for (const word of haystackWords(haystack)) {
    if (word === q) return 90;
    if (word.startsWith(q)) {
      return 70 + Math.round((q.length / word.length) * 20);
    }
  }

  // Frasa panjang boleh cocok di teks utuh (bukan di tengah kata).
  if (q.length >= 4) {
    const h = normalizeSearch(haystack);
    if (h.includes(q)) return 30 + Math.min(20, q.length * 2);
  }

  return 0;
}
