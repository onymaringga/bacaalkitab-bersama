import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StoryDetailView } from "@/components/stories/story-detail-view";
import { BIBLE_STORIES, getBibleStory } from "@/lib/bible-stories";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BIBLE_STORIES.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getBibleStory(slug);
  if (!story) return { title: "Kisah Penting" };
  return {
    title: `${story.title} · Kisah Penting`,
    description: story.summary,
  };
}

export default async function BacaKisahDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const story = getBibleStory(slug);
  if (!story) notFound();
  return <StoryDetailView story={story} />;
}
