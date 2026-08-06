import { getStoryImageSource, type ImageSource } from "@/lib/image-source";

/** Classical JPGs replaced with comic SVG — nudity, explicit art, or wrong subject. */
const STORY_SVG_ONLY = new Set([
  "ester",
  "keluaran-mesir",
  "penciptaan",
]);

export type StoryImage = {
  src: string;
  fallbackSrc: string;
  alt: string;
  kind: "photo" | "comic";
  source: ImageSource;
};

export function getStoryImage(slug: string, title: string): StoryImage {
  const svgSrc = `/stories/${slug}.svg`;

  const source = getStoryImageSource(slug);

  if (STORY_SVG_ONLY.has(slug)) {
    return {
      src: svgSrc,
      fallbackSrc: svgSrc,
      alt: `Ilustrasi: ${title}`,
      kind: "comic",
      source,
    };
  }

  return {
    src: `/stories/${slug}.jpg`,
    fallbackSrc: svgSrc,
    alt: `Ilustrasi: ${title}`,
    kind: "photo",
    source,
  };
}
