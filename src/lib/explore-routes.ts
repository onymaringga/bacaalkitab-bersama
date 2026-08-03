/** Rute Explore: sejarah kitab, topik, tokoh, glosarium, peta (+ silsilah). */

export const EXPLORE_PATH_PREFIXES = [
  "/explore",
  "/baca/kitab",
  "/baca/topik",
  "/baca/tokoh",
  "/baca/glosarium",
  "/baca/peta",
  "/baca/silsilah",
] as const;

export function isExplorePath(pathname: string) {
  return EXPLORE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isBibleReadingPath(pathname: string) {
  if (isExplorePath(pathname)) return false;
  return (
    pathname.startsWith("/baca") ||
    pathname.startsWith("/alkitab") ||
    pathname.startsWith("/renungan")
  );
}
