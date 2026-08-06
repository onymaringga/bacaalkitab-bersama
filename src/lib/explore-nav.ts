import { copy } from "@/lib/copy";

export type ExploreNavChild = {
  href: string;
  label: string;
};

/** Submenu Explore Alkitab — sinkron dengan hub /explore. */
export function getExploreNavChildren(): ExploreNavChild[] {
  return [
    { href: "/baca/kitab", label: copy.bookIntro.title },
    { href: "/baca/topik", label: copy.topics.title },
    { href: "/baca/kebiasaan", label: copy.customs.title },
    { href: "/baca/glosarium", label: copy.glossary.title },
    { href: "/baca/kisah", label: copy.stories.title },
    { href: "/baca/tokoh", label: copy.characters.title },
    { href: "/baca/peta", label: copy.places.title },
    { href: "/baca/silsilah", label: copy.genealogy.title },
  ];
}

export function isExploreNavChildActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
