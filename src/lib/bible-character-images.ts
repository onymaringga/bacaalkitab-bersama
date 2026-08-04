import type { BibleCharacterCategoryId } from "@/lib/bible-characters";

export type CharacterImage = {
  src: string;
  fallbackSrc: string;
  alt: string;
};

export function getCharacterImage(
  slug: string,
  name: string,
  _category?: BibleCharacterCategoryId,
): CharacterImage {
  return {
    src: `/characters/${slug}.jpg`,
    fallbackSrc: `/characters/${slug}.svg`,
    alt: `Ilustrasi tokoh ${name}`,
  };
}
