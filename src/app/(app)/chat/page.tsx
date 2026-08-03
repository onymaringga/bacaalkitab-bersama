"use client";

import { useEffect } from "react";

import { GroupReflectionChat } from "@/components/notes/group-reflection-chat";
import { copy } from "@/lib/copy";
import { demoTodayReading } from "@/lib/demo-data";
import { markChatAsRead } from "@/lib/group-reflection-chat";
import { resolveScheduleReading } from "@/lib/schedule-devotional";

export default function ChatPage() {
  const reading = resolveScheduleReading(demoTodayReading);
  const passage = reading.passage;

  useEffect(() => {
    markChatAsRead();
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 lg:gap-5">
      <header className="member-web-animate-in">
        <p className="member-web-kicker text-[var(--m-accent)]">
          {copy.nav.group}
        </p>
        <h1 className="member-web-display mt-1.5 text-[clamp(1.65rem,2.8vw,2.5rem)] leading-[1.1] text-[var(--m-ink)]">
          {copy.chat.title}
        </h1>
      </header>

      <GroupReflectionChat
        passage={passage}
        forceUnlocked
        showComposer
        expanded
        hideHeader
      />
    </div>
  );
}
