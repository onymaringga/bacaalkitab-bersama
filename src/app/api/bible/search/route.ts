import { NextResponse } from "next/server";

import type { BibleVersionCode } from "@/lib/bible-books";
import { BIBLE_VERSIONS } from "@/lib/bible-books";
import { searchBible } from "@/lib/bible-search";
import { searchBibleKeywords } from "@/lib/bible-keyword-search";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim().slice(0, 80);
  const versionParam = (searchParams.get("ver") ?? "tb") as BibleVersionCode;
  const version =
    versionParam in BIBLE_VERSIONS ? versionParam : ("tb" as BibleVersionCode);

  if (query.length < 2) {
    return NextResponse.json({
      query,
      books: [],
      verses: [],
    });
  }

  const books = searchBible(query, 8);
  let verses: Awaited<ReturnType<typeof searchBibleKeywords>> = [];

  try {
    verses = await searchBibleKeywords(query, version, 20);
  } catch {
    verses = [];
  }

  return NextResponse.json({
    query,
    version,
    books,
    verses,
  });
}
