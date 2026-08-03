import { demoGroupReflections, demoUser } from "@/lib/demo-data";
import {
  getReflectionChatMessages,
  isDeletedChatMessage,
  isReflectionShareMessage,
  subscribeReflectionChat,
} from "@/lib/group-reflection-chat";
import type { GroupReflection } from "@/lib/types";

export type CommunityReflectionItem = GroupReflection & {
  isMine?: boolean;
};

const SERVER_FEED: CommunityReflectionItem[] = demoGroupReflections.filter(
  (item) => item.visibility === "group",
);

let cachedFeed: CommunityReflectionItem[] | null = null;
let cachedFeedKey: string | null = null;

function buildCommunityReflectionFeed(): CommunityReflectionItem[] {
  const demoItems: CommunityReflectionItem[] = demoGroupReflections
    .filter((item) => item.visibility === "group")
    .map((item) => ({ ...item }));

  const mine = getReflectionChatMessages()
    .filter(
      (message) =>
        isReflectionShareMessage(message) &&
        !isDeletedChatMessage(message) &&
        Boolean(message.content?.trim()),
    )
    .map((message) => ({
      id: message.id,
      authorName: message.authorName || demoUser.name,
      content: message.content,
      time: message.time,
      visibility: "group" as const,
      passage: message.passage,
      groupName: "Kelompokku",
      isMine: Boolean(message.isMine),
    }));

  // Pesan milik user di atas, lalu demo dari berbagai kelompok.
  const merged = [...mine.filter((item) => item.isMine), ...demoItems];
  const seen = new Set<string>();
  const unique: CommunityReflectionItem[] = [];
  for (const item of merged) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
  }
  return unique;
}

/** Snapshot stabil untuk useSyncExternalStore. */
export function getCommunityReflectionFeed(): CommunityReflectionItem[] {
  const messages = getReflectionChatMessages();
  const key = messages
    .map(
      (item) =>
        `${item.id}:${item.deleted ? "d" : "a"}:${item.kind ?? ""}:${item.content?.length ?? 0}`,
    )
    .join("|");
  if (cachedFeed && cachedFeedKey === key) return cachedFeed;
  cachedFeedKey = key;
  cachedFeed = buildCommunityReflectionFeed();
  return cachedFeed;
}

export function getServerCommunityReflectionFeed(): CommunityReflectionItem[] {
  return SERVER_FEED;
}

export function subscribeCommunityReflectionFeed(onChange: () => void) {
  return subscribeReflectionChat(() => {
    cachedFeed = null;
    cachedFeedKey = null;
    onChange();
  });
}
