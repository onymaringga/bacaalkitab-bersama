"use client";

import { notFound, useRouter } from "next/navigation";
import { use, useEffect, useState, useSyncExternalStore } from "react";

import { JournalPageEditor } from "@/components/journal/journal-page-editor";
import {
  getJournalPage,
  getServerJournalPage,
  subscribeJournalPages,
  type JournalPage,
} from "@/lib/journal-entries";

type PageProps = {
  params: Promise<{ id: string }>;
};

function useJournalPage(id: string): JournalPage | null {
  return useSyncExternalStore(
    subscribeJournalPages,
    () => getJournalPage(id),
    getServerJournalPage,
  );
}

export default function JurnalDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [hadPage, setHadPage] = useState(false);
  const page = useJournalPage(id);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (page) setHadPage(true);
  }, [page]);

  useEffect(() => {
    if (mounted && hadPage && !page) {
      router.replace("/jurnal");
    }
  }, [mounted, hadPage, page, router]);

  if (!mounted) {
    return (
      <div className="member-web-animate-in mx-auto w-full max-w-2xl py-16 text-center text-sm text-[var(--m-ink-soft)]">
        Memuat jurnal…
      </div>
    );
  }

  if (!page) {
    if (hadPage) {
      return (
        <div className="member-web-animate-in mx-auto w-full max-w-2xl py-16 text-center text-sm text-[var(--m-ink-soft)]">
          Memuat jurnal…
        </div>
      );
    }
    notFound();
  }

  return <JournalPageEditor page={page} />;
}
