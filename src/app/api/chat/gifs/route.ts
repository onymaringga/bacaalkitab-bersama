import { NextResponse } from "next/server";

import {
  isLikelyGifUrl,
  searchCuratedGifs,
  type ChatGifItem,
} from "@/lib/chat-gifs";

export const dynamic = "force-dynamic";

type GiphyGif = {
  id: string;
  title?: string;
  images?: {
    original?: { url?: string };
    fixed_height_small?: { url?: string };
    preview_gif?: { url?: string };
    downsized?: { url?: string };
  };
};

type TenorResult = {
  id: string;
  title?: string;
  content_description?: string;
  media_formats?: {
    gif?: { url?: string };
    tinygif?: { url?: string };
    nanogif?: { url?: string };
  };
};

async function searchGiphy(query: string, limit: number): Promise<ChatGifItem[]> {
  const key = process.env.GIPHY_API_KEY?.trim();
  if (!key) return [];

  const params = new URLSearchParams({
    api_key: key,
    q: query || "amen",
    limit: String(limit),
    rating: "g",
    lang: "en",
  });
  const endpoint = query
    ? `https://api.giphy.com/v1/gifs/search?${params}`
    : `https://api.giphy.com/v1/gifs/trending?${params}`;

  const response = await fetch(endpoint, { next: { revalidate: 300 } });
  if (!response.ok) return [];

  const payload = (await response.json()) as { data?: GiphyGif[] };
  const list = payload.data ?? [];

  return list
    .map((item): ChatGifItem | null => {
      const url =
        item.images?.downsized?.url ||
        item.images?.original?.url ||
        item.images?.fixed_height_small?.url;
      const preview =
        item.images?.fixed_height_small?.url ||
        item.images?.preview_gif?.url ||
        url;
      if (!url || !preview) return null;
      return {
        id: `giphy-${item.id}`,
        title: item.title?.trim() || "GIF",
        url,
        preview,
        tags: [query].filter(Boolean),
        source: "giphy",
      };
    })
    .filter((item): item is ChatGifItem => Boolean(item));
}

async function searchTenor(query: string, limit: number): Promise<ChatGifItem[]> {
  const key = process.env.TENOR_API_KEY?.trim();
  if (!key) return [];

  const params = new URLSearchParams({
    key,
    client_key: "bacaalkitab-bersama",
    q: query || "amen",
    limit: String(limit),
    media_filter: "gif",
  });
  const endpoint = query
    ? `https://tenor.googleapis.com/v2/search?${params}`
    : `https://tenor.googleapis.com/v2/featured?${params}`;

  const response = await fetch(endpoint, { next: { revalidate: 300 } });
  if (!response.ok) return [];

  const payload = (await response.json()) as { results?: TenorResult[] };
  const list = payload.results ?? [];

  return list
    .map((item): ChatGifItem | null => {
      const url = item.media_formats?.gif?.url;
      const preview =
        item.media_formats?.tinygif?.url ||
        item.media_formats?.nanogif?.url ||
        url;
      if (!url || !preview) return null;
      return {
        id: `tenor-${item.id}`,
        title: item.title || item.content_description || "GIF",
        url,
        preview,
        tags: [query].filter(Boolean),
        source: "tenor",
      };
    })
    .filter((item): item is ChatGifItem => Boolean(item));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim().slice(0, 80);
  const limit = Math.min(
    36,
    Math.max(8, Number(searchParams.get("limit") ?? 24) || 24),
  );

  if (query && isLikelyGifUrl(query)) {
    return NextResponse.json({
      source: "url",
      items: [
        {
          id: `url-${Date.now()}`,
          title: "GIF dari tautan",
          url: query,
          preview: query,
          tags: [],
          source: "curated",
        } satisfies ChatGifItem,
      ],
    });
  }

  try {
    let remote = await searchGiphy(query, limit);
    if (remote.length === 0) {
      remote = await searchTenor(query, limit);
    }

    if (remote.length > 0) {
      return NextResponse.json({
        source: remote[0]?.source ?? "giphy",
        items: remote,
      });
    }
  } catch {
    /* fallback curated */
  }

  return NextResponse.json({
    source: "curated",
    items: searchCuratedGifs(query, limit),
  });
}
