import { redirect } from "next/navigation";

type AlkitabPageProps = {
  searchParams: Promise<{ passage?: string }>;
};

export default async function AlkitabPage({ searchParams }: AlkitabPageProps) {
  const params = await searchParams;
  if (params.passage) {
    redirect(`/baca?browse=1&passage=${encodeURIComponent(params.passage)}`);
  }
  redirect("/baca");
}
