export type StoryImage = {
  src: string;
  fallbackSrc: string;
  alt: string;
  kind: "photo" | "comic";
};

export function getStoryImage(slug: string, title: string): StoryImage {
  return {
    src: `/stories/${slug}.jpg`,
    fallbackSrc: `/stories/${slug}.svg`,
    alt: `Ilustrasi: ${title}`,
    kind: "photo",
  };
}
