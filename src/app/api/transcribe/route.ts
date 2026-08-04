import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024;

async function whisperTranscribe(file: File, apiKey: string) {
  const body = new FormData();
  body.append("file", file, file.name || "audio.webm");
  body.append("model", "whisper-1");
  body.append("response_format", "json");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || "Whisper gagal");
  }

  const payload = (await response.json()) as { text?: string };
  return (payload.text ?? "").trim();
}

async function translateToIndonesian(text: string, apiKey: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Terjemahkan teks berikut ke Bahasa Indonesia yang natural dan mudah dipahami. Jika teks sudah Bahasa Indonesia, rapikan saja. Hanya keluarkan terjemahan, tanpa penjelasan.",
        },
        { role: "user", content: text },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || "Terjemahan gagal");
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return (payload.choices?.[0]?.message?.content ?? "").trim();
}

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.OPENAI_API_KEY),
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Mode bahasa daerah belum dikonfigurasi. Tambahkan OPENAI_API_KEY di .env.local.",
      },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const translate = formData.get("translate") === "1";

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "File audio kosong." }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Potongan audio terlalu besar (maks. 12 MB)." },
        { status: 413 },
      );
    }

    const text = await whisperTranscribe(file, apiKey);
    if (!text) {
      return NextResponse.json({ text: "", translation: "" });
    }

    const translation = translate
      ? await translateToIndonesian(text, apiKey)
      : "";

    return NextResponse.json({ text, translation });
  } catch (error) {
    console.error("[transcribe]", error);
    return NextResponse.json(
      { error: "Gagal mentranskrip audio. Coba lagi." },
      { status: 500 },
    );
  }
}
