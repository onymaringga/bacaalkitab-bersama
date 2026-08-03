import { NextResponse } from "next/server";

import { getBiblePassage } from "@/lib/bible-api";
import { BIBLE_VERSIONS, type BibleVersionCode } from "@/lib/bible-books";
import { parsePassage } from "@/lib/passage-parser";

export const revalidate = 86400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const passage = searchParams.get("passage");
  const versionParam = (searchParams.get("ver") ?? "tb") as BibleVersionCode;

  if (!passage) {
    return NextResponse.json(
      { error: "Parameter passage wajib diisi, contoh: Matius 18:21-35" },
      { status: 400 },
    );
  }

  if (!(versionParam in BIBLE_VERSIONS)) {
    return NextResponse.json(
      { error: "Versi Alkitab tidak dikenali." },
      { status: 400 },
    );
  }

  const parsed = parsePassage(passage);
  if (!parsed) {
    return NextResponse.json(
      {
        error:
          "Format passage tidak valid. Gunakan format seperti: Matius 18:21-35",
      },
      { status: 400 },
    );
  }

  try {
    const data = await getBiblePassage(parsed, versionParam);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal memuat ayat Alkitab.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
