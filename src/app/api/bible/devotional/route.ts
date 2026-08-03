import { NextResponse } from "next/server";

import { getBiblePassage } from "@/lib/bible-api";
import { generateDevotional } from "@/lib/devotional-generator";
import { parsePassage } from "@/lib/passage-parser";

export const revalidate = 86400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const passage = searchParams.get("passage");

  if (!passage) {
    return NextResponse.json(
      { error: "Parameter passage wajib diisi, contoh: Matius 18" },
      { status: 400 },
    );
  }

  const parsed = parsePassage(passage);
  if (!parsed) {
    return NextResponse.json(
      { error: "Format passage tidak valid." },
      { status: 400 },
    );
  }

  try {
    const biblePassage = await getBiblePassage(parsed);
    const devotional = generateDevotional(biblePassage, passage);

    return NextResponse.json({
      passage: biblePassage.reference,
      ...devotional,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal membuat renungan.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
