import { NextResponse } from "next/server";

import {
  isNaturalTtsVoiceId,
  synthesizeNaturalSpeech,
  type NaturalTtsVoiceId,
} from "@/lib/edge-tts-server";

export const runtime = "nodejs";
export const maxDuration = 60;

type TtsBody = {
  text?: string;
  voice?: string;
  rate?: number;
};

export async function POST(request: Request) {
  let body: TtsBody;
  try {
    body = (await request.json()) as TtsBody;
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Teks wajib diisi" }, { status: 400 });
  }
  if (text.length > 2200) {
    return NextResponse.json(
      { error: "Teks terlalu panjang. Pecah per ayat." },
      { status: 400 },
    );
  }

  const voice: NaturalTtsVoiceId = isNaturalTtsVoiceId(body.voice ?? "")
    ? (body.voice as NaturalTtsVoiceId)
    : "id-ID-GadisNeural";

  const rate =
    typeof body.rate === "number" && Number.isFinite(body.rate)
      ? body.rate
      : 0.95;

  try {
    const audio = await synthesizeNaturalSpeech({ text, voice, rate });
    return new NextResponse(new Uint8Array(audio), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal menghasilkan suara";
    console.error("[tts]", message);
    return NextResponse.json(
      { error: "Gagal memuat suara natural. Coba lagi atau pakai suara perangkat." },
      { status: 502 },
    );
  }
}
