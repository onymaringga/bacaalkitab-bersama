"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { BookOpen, PenLine } from "lucide-react";

import { MemberAvatar } from "@/components/ui/member-avatar";
import { Button } from "@/components/ui/button";
import {
  getCommunityReflectionFeed,
  getServerCommunityReflectionFeed,
  subscribeCommunityReflectionFeed,
} from "@/lib/community-reflections";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

type CommunityReflectionFeedProps = {
  className?: string;
  limit?: number;
};

export function CommunityReflectionFeed({
  className,
  limit = 8,
}: CommunityReflectionFeedProps) {
  const feed = useSyncExternalStore(
    subscribeCommunityReflectionFeed,
    getCommunityReflectionFeed,
    getServerCommunityReflectionFeed,
  );
  const items = feed.slice(0, limit);

  return (
    <section
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90",
        className,
      )}
    >
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--m-line)] px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-[var(--m-ink)]">
            {copy.home.communityReflections.title}
          </h2>
          <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">
            {copy.home.communityReflections.subtitle}
          </p>
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 shrink-0 rounded-lg px-2.5 text-xs font-semibold text-[var(--m-accent)]"
        >
          <Link href="/catatan">
            <PenLine className="size-3.5" />
            {copy.home.writeReflection}
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="px-4 py-8 text-center sm:px-5">
          <p className="text-sm text-[var(--m-ink-soft)]">
            {copy.home.communityReflections.empty}
          </p>
        </div>
      ) : (
        <ul className="min-h-0 flex-1 divide-y divide-[var(--m-line)] overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="px-4 py-3.5 sm:px-5">
              <div className="flex gap-3">
                <MemberAvatar
                  name={item.authorName}
                  currentUser={item.isMine}
                  className="size-9 shrink-0"
                  fallbackClassName="bg-[var(--m-wash)] text-xs font-semibold text-[var(--m-ink)]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <p className="text-sm font-semibold text-[var(--m-ink)]">
                      {item.authorName}
                    </p>
                    {item.groupName ? (
                      <span className="text-[11px] font-medium text-[var(--m-accent)]">
                        {item.groupName}
                      </span>
                    ) : null}
                    <span className="text-[11px] text-[var(--m-ink-soft)]">
                      {item.time}
                    </span>
                  </div>

                  {item.passage ? (
                    <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-[var(--m-ink-soft)]">
                      <BookOpen className="size-3 shrink-0" />
                      {item.passage}
                    </p>
                  ) : null}

                  <p className="mt-1.5 line-clamp-4 text-sm leading-relaxed text-[var(--m-ink)]">
                    {item.content}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
