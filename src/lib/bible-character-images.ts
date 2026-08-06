import type { BibleCharacterCategoryId } from "@/lib/bible-characters";
import { getCharacterImageSource, type ImageSource } from "@/lib/image-source";

export type CharacterImage = {
  src: string;
  fallbackSrc: string;
  alt: string;
  source: ImageSource;
};

/** Classical JPGs replaced with comic SVG — nudity, explicit art, or wrong subject. */
const CHARACTER_SVG_ONLY = new Set([
  "adam",
  "ester",
  "hagar",
  "hawa",
  "lidia",
  "maria-magdalena",
  "naomi",
  "priskila",
  "simson",
  "yehuda",
  "yunus",
  "yusuf",
  "zakheus",
]);

/** Gambar tokoh khusus dari ilustrasi kisah terkait. */
const CHARACTER_STORY_IMAGE: Record<string, string> = {
  yesus: "salib-kebangkitan",
};

export function getCharacterImage(
  slug: string,
  name: string,
  _category?: BibleCharacterCategoryId,
): CharacterImage {
  const svgSrc = `/characters/${slug}.svg`;
  const source = getCharacterImageSource(slug);

  if (CHARACTER_SVG_ONLY.has(slug)) {
    return {
      src: svgSrc,
      fallbackSrc: svgSrc,
      alt: `Ilustrasi tokoh ${name}`,
      source,
    };
  }

  const storySlug = CHARACTER_STORY_IMAGE[slug];
  if (storySlug) {
    const storySrc = `/stories/${storySlug}.jpg`;
    const storySvg = `/stories/${storySlug}.svg`;
    return {
      src: storySrc,
      fallbackSrc: storySvg,
      alt: `Ilustrasi tokoh ${name}`,
      source,
    };
  }

  return {
    src: `/characters/${slug}.jpg`,
    fallbackSrc: svgSrc,
    alt: `Ilustrasi tokoh ${name}`,
    source,
  };
}
