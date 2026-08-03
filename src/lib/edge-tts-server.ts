import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

import {
  isNaturalTtsVoiceId,
  type NaturalTtsVoiceId,
} from "@/lib/natural-tts-voices";

export {
  NATURAL_TTS_VOICES,
  isNaturalTtsVoiceId,
  type NaturalTtsVoiceId,
} from "@/lib/natural-tts-voices";

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Edge TTS SSML aman — teks user di-escape. */
export async function synthesizeNaturalSpeech(input: {
  text: string;
  voice?: NaturalTtsVoiceId;
  /** Relatif 0.5–1.5 (default 0.95 = nyaman untuk Alkitab) */
  rate?: number;
}): Promise<Buffer> {
  const text = input.text.replace(/\s+/g, " ").trim();
  if (!text) {
    throw new Error("Teks kosong");
  }
  if (text.length > 2200) {
    throw new Error("Teks terlalu panjang untuk satu potongan TTS");
  }

  const voice: NaturalTtsVoiceId =
    input.voice && isNaturalTtsVoiceId(input.voice)
      ? input.voice
      : "id-ID-GadisNeural";
  const rate = Math.min(1.5, Math.max(0.5, input.rate ?? 0.95));

  const tts = new MsEdgeTTS();
  await tts.setMetadata(
    voice,
    OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3,
  );

  const { audioStream } = tts.toStream(escapeXml(text), { rate });

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    audioStream.on("data", (chunk: Buffer) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    audioStream.on("end", () => resolve());
    audioStream.on("close", () => resolve());
    audioStream.on("error", (error: Error) => reject(error));
  });

  tts.close();

  const audio = Buffer.concat(chunks);
  if (audio.byteLength < 64) {
    throw new Error("Gagal menghasilkan audio");
  }
  return audio;
}
