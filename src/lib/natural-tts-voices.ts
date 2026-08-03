export const NATURAL_TTS_VOICES = [
  {
    id: "id-ID-GadisNeural",
    label: "Gadis",
    hint: "Perempuan · natural",
  },
  {
    id: "id-ID-ArdiNeural",
    label: "Ardi",
    hint: "Laki-laki · natural",
  },
] as const;

export type NaturalTtsVoiceId = (typeof NATURAL_TTS_VOICES)[number]["id"];

export function isNaturalTtsVoiceId(value: string): value is NaturalTtsVoiceId {
  return NATURAL_TTS_VOICES.some((voice) => voice.id === value);
}
