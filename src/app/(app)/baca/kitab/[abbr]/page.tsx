import { notFound } from "next/navigation";

import { KitabDetailView } from "@/components/kitab/kitab-detail-view";
import { BIBLE_BOOKS } from "@/lib/bible-books";
import { getBookWithEnrichedIntro } from "@/lib/bible-book-intros";

type PageProps = {
  params: Promise<{ abbr: string }>;
};

export function generateStaticParams() {
  return BIBLE_BOOKS.map((book) => ({ abbr: book.abbr }));
}

export default async function BacaKitabDetailPage({ params }: PageProps) {
  const { abbr } = await params;
  const decoded = decodeURIComponent(abbr);
  const data = getBookWithEnrichedIntro(decoded);
  if (!data) notFound();
  return <KitabDetailView book={data.book} intro={data.intro} />;
}
