import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GlossaryDetailView } from "@/components/glossary/glossary-detail-view";
import { BIBLE_GLOSSARY, getGlossaryTerm } from "@/lib/bible-glossary";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BIBLE_GLOSSARY.map((term) => ({ slug: term.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) return { title: "Glosarium" };
  return {
    title: `${term.term} · Glosarium`,
    description: term.plainMeaning,
  };
}

export default async function BacaGlosariumDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) notFound();
  return <GlossaryDetailView term={term} />;
}
