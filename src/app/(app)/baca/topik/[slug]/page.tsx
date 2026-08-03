import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TopicDetailView } from "@/components/topics/topic-detail-view";
import { BIBLE_TOPICS, getBibleTopic } from "@/lib/bible-topics";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BIBLE_TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getBibleTopic(slug);
  if (!topic) return { title: "Topik Firman" };
  return {
    title: `${topic.title} · Topik Firman`,
    description: topic.summary,
  };
}

export default async function BacaTopikDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = getBibleTopic(slug);
  if (!topic) notFound();
  return <TopicDetailView topic={topic} />;
}
