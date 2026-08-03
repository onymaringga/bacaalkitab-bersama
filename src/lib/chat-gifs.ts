export type ChatGifItem = {
  id: string;
  title: string;
  url: string;
  preview: string;
  tags: string[];
  source: "giphy" | "tenor" | "curated";
};

/**
 * Katalog GIF lokal (CDN publik) — fallback jika API key belum diset.
 * URL dari Giphy/Tenor CDN; aman untuk demo & offline-ish preview.
 */
export const CURATED_CHAT_GIFS: ChatGifItem[] = [
  {
    id: "curated-amen",
    title: "Amen",
    url: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
    preview: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/200w.gif",
    tags: ["amen", "doa", "pray", "yes"],
    source: "curated",
  },
  {
    id: "curated-clap",
    title: "Clap",
    url: "https://media.giphy.com/media/7rj2ZgttvgomY/giphy.gif",
    preview: "https://media.giphy.com/media/7rj2ZgttvgomY/200w.gif",
    tags: ["clap", "tepuk", "good", "bagus"],
    source: "curated",
  },
  {
    id: "curated-love",
    title: "Love",
    url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
    preview: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/200w.gif",
    tags: ["love", "hati", "love", "sayang"],
    source: "curated",
  },
  {
    id: "curated-happy",
    title: "Happy",
    url: "https://media.giphy.com/media/XR9IZ2vCooUroWXSbA/giphy.gif",
    preview: "https://media.giphy.com/media/XR9IZ2vCooUroWXSbA/200w.gif",
    tags: ["happy", "senang", "smile", "gembira"],
    source: "curated",
  },
  {
    id: "curated-wow",
    title: "Wow",
    url: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
    preview: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/200w.gif",
    tags: ["wow", "amazed", "kaget"],
    source: "curated",
  },
  {
    id: "curated-cry",
    title: "Touched",
    url: "https://media.giphy.com/media/ROF8OQvDmxylXRNinJ/giphy.gif",
    preview: "https://media.giphy.com/media/ROF8OQvDmxylXRNinJ/200w.gif",
    tags: ["cry", "haru", "sedih", "tears"],
    source: "curated",
  },
  {
    id: "curated-pray",
    title: "Pray",
    url: "https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif",
    preview: "https://media.giphy.com/media/l0ExncehJzexFpRHq/200w.gif",
    tags: ["pray", "doa", "amen", "bless"],
    source: "curated",
  },
  {
    id: "curated-thumbs",
    title: "Thumbs up",
    url: "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
    preview: "https://media.giphy.com/media/111ebonMs90YLu/200w.gif",
    tags: ["thumb", "ok", "setuju", "yes"],
    source: "curated",
  },
  {
    id: "curated-dance",
    title: "Celebrate",
    url: "https://media.giphy.com/media/artj92V8R3rRe/giphy.gif",
    preview: "https://media.giphy.com/media/artj92V8R3rRe/200w.gif",
    tags: ["dance", "party", "celebrate", "rayakan"],
    source: "curated",
  },
  {
    id: "curated-hi",
    title: "Hi",
    url: "https://media.giphy.com/media/xTiIzJSKB4l7xTouE8/giphy.gif",
    preview: "https://media.giphy.com/media/xTiIzJSKB4l7xTouE8/200w.gif",
    tags: ["hi", "hello", "halo", "wave"],
    source: "curated",
  },
  {
    id: "curated-strong",
    title: "Strong",
    url: "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
    preview: "https://media.giphy.com/media/l0MYC0LajbaPoEADu/200w.gif",
    tags: ["strong", "semangat", "power", "fight"],
    source: "curated",
  },
  {
    id: "curated-thanks",
    title: "Thanks",
    url: "https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif",
    preview: "https://media.giphy.com/media/3oz8xIsloV7zOmt81G/200w.gif",
    tags: ["thanks", "terima kasih", "thank"],
    source: "curated",
  },
];

export function searchCuratedGifs(query: string, limit = 24): ChatGifItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return CURATED_CHAT_GIFS.slice(0, limit);
  return CURATED_CHAT_GIFS.filter((item) => {
    const hay = `${item.title} ${item.tags.join(" ")}`.toLowerCase();
    return hay.includes(q) || q.split(/\s+/).some((part) => hay.includes(part));
  }).slice(0, limit);
}

export function isLikelyGifUrl(value: string) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return false;
    const path = url.pathname.toLowerCase();
    return (
      path.endsWith(".gif") ||
      path.includes("/giphy") ||
      url.hostname.includes("giphy.com") ||
      url.hostname.includes("tenor.com") ||
      url.hostname.includes("media.tenor")
    );
  } catch {
    return false;
  }
}
