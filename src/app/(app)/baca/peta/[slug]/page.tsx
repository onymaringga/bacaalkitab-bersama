import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PlaceDetailView } from "@/components/places/place-detail-view";
import { BIBLE_PLACES, getBiblePlace } from "@/lib/bible-places";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BIBLE_PLACES.map((place) => ({ slug: place.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = getBiblePlace(slug);
  if (!place) return { title: "Peta Alkitab" };
  return {
    title: `${place.name} · Peta Alkitab`,
    description: place.blurb,
  };
}

export default async function BacaPetaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const place = getBiblePlace(slug);
  if (!place) notFound();
  return <PlaceDetailView place={place} />;
}
