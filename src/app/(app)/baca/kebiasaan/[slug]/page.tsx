import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CustomDetailView } from "@/components/customs/custom-detail-view";
import { BIBLE_CUSTOMS, getBibleCustom } from "@/lib/bible-customs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BIBLE_CUSTOMS.map((custom) => ({ slug: custom.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const custom = getBibleCustom(slug);
  if (!custom) return { title: "Kebiasaan Alkitab" };
  return {
    title: `${custom.title} · Kebiasaan Alkitab`,
    description: custom.summary,
  };
}

export default async function BacaKebiasaanDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const custom = getBibleCustom(slug);
  if (!custom) notFound();
  return <CustomDetailView custom={custom} />;
}
