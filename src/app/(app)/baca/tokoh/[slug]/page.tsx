import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CharacterDetailView } from "@/components/characters/character-detail-view";
import {
  BIBLE_CHARACTERS,
  getBibleCharacter,
} from "@/lib/bible-characters";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BIBLE_CHARACTERS.map((character) => ({ slug: character.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const character = getBibleCharacter(slug);
  if (!character) return { title: "Tokoh Alkitab" };
  return {
    title: `${character.name} · Tokoh Alkitab`,
    description: character.summary,
  };
}

export default async function BacaTokohDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const character = getBibleCharacter(slug);
  if (!character) notFound();
  return <CharacterDetailView character={character} />;
}
