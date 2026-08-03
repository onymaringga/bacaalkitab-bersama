"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AtSign, BookOpen, ImageIcon, MessageCircle, Send, Smile, Sparkles, Trash2 } from "lucide-react";

import {
  ChatEmojiPicker,
  ChatGifPicker,
  ChatGifPreviewChip,
} from "@/components/notes/chat-media-pickers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast-host";
import {
  filterMentionCandidates,
  getActiveMentionQuery,
  getGroupMentionCandidates,
  insertMentionAtCaret,
  parseMentionSegments,
  type MentionCandidate,
} from "@/lib/chat-mentions";
import type { ChatGifItem } from "@/lib/chat-gifs";
import { copy } from "@/lib/copy";
import {
  canDeleteOwnChatMessage,
  deleteOwnChatMessage,
  getChatDeleteRemainingMs,
  getReflectionChatMessages,
  getServerReflectionChatMessages,
  isReflectionChatUnlocked,
  isReflectionShareMessage,
  postGroupChatMessage,
  saveMyReflectionMessage,
  subscribeReflectionChat,
  type ReflectionChatMessage,
} from "@/lib/group-reflection-chat";
import { getRoleLabel } from "@/lib/role-label";
import { cn } from "@/lib/utils";

type ChatFilter = "all" | "reflection" | "chat";
type ComposerMode = "reflection" | "chat";

const CHAT_FILTERS: { value: ChatFilter; label: string }[] = [
  { value: "all", label: copy.chat.filterAll },
  { value: "reflection", label: copy.chat.filterReflection },
  { value: "chat", label: copy.chat.filterChat },
];

type GroupReflectionChatProps = {
  passage: string;
  /** Paksa tampil terbuka (setelah save di parent). */
  forceUnlocked?: boolean;
  /** Tampilkan composer kirim pesan. */
  showComposer?: boolean;
  /** Izinkan kirim refleksi dari composer (langsung ke chat kelompok). */
  allowReflectionCompose?: boolean;
  /** Mode default composer. */
  composerDefault?: ComposerMode;
  /** Tinggi area pesan lebih besar (halaman chat). */
  expanded?: boolean;
  /** Sembunyikan judul di dalam kartu (kalau halaman sudah punya judul). */
  hideHeader?: boolean;
};

function formatRemaining(ms: number) {
  const totalSec = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  if (minutes <= 0) return `${seconds} dtk`;
  return `${minutes} mnt ${seconds.toString().padStart(2, "0")} dtk`;
}

function MentionedText({
  content,
  candidates,
  mine,
}: {
  content: string;
  candidates: MentionCandidate[];
  mine?: boolean;
}) {
  const segments = useMemo(
    () => parseMentionSegments(content, candidates),
    [content, candidates],
  );

  return (
    <p className="mt-0.5 text-sm leading-relaxed whitespace-pre-wrap">
      {segments.map((segment, index) =>
        segment.type === "mention" ? (
          <span
            key={`${segment.handle}-${index}`}
            className={cn(
              "rounded px-0.5 font-semibold",
              mine
                ? "bg-white/20 text-white"
                : "bg-[var(--m-accent)]/12 text-[var(--m-accent)]",
            )}
          >
            {segment.value}
          </span>
        ) : (
          <span key={`t-${index}`}>{segment.value}</span>
        ),
      )}
    </p>
  );
}

function MessageBody({
  content,
  gifUrl,
  candidates,
  mine,
}: {
  content: string;
  gifUrl?: string;
  candidates: MentionCandidate[];
  mine?: boolean;
}) {
  const showText =
    Boolean(content.trim()) && !(gifUrl && content.trim() === "GIF");

  return (
    <>
      {gifUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={gifUrl}
          alt="GIF"
          className={cn(
            "mt-1 max-h-48 w-full max-w-[16rem] rounded-xl object-cover",
            showText && "mb-1.5",
          )}
          loading="lazy"
        />
      ) : null}
      {showText ? (
        <MentionedText content={content} candidates={candidates} mine={mine} />
      ) : null}
    </>
  );
}

export function GroupReflectionChat({
  passage,
  forceUnlocked = false,
  showComposer = false,
  allowReflectionCompose = false,
  composerDefault = "chat",
  expanded = false,
  hideHeader = false,
}: GroupReflectionChatProps) {
  const unlocked = useSyncExternalStore(
    subscribeReflectionChat,
    () => forceUnlocked || isReflectionChatUnlocked(),
    () => forceUnlocked,
  );
  const messages = useSyncExternalStore(
    subscribeReflectionChat,
    getReflectionChatMessages,
    getServerReflectionChatMessages,
  );
  const mentionCandidates = useMemo(() => getGroupMentionCandidates(), []);
  const [draft, setDraft] = useState("");
  const [caret, setCaret] = useState(0);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [filter, setFilter] = useState<ChatFilter>("all");
  const [mediaPanel, setMediaPanel] = useState<"emoji" | "gif" | null>(null);
  const [pendingGif, setPendingGif] = useState<ChatGifItem | null>(null);
  const [composerMode, setComposerMode] = useState<ComposerMode>(() =>
    allowReflectionCompose ? composerDefault : "chat",
  );
  const [now, setNow] = useState(() => Date.now());
  const [pendingDelete, setPendingDelete] =
    useState<ReflectionChatMessage | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canComposeReflection = allowReflectionCompose;
  const effectiveComposerMode: ComposerMode =
    !unlocked && canComposeReflection
      ? "reflection"
      : canComposeReflection
        ? composerMode
        : "chat";
  const showChatBody = unlocked || forceUnlocked;
  const showComposerBar =
    showComposer && (unlocked || forceUnlocked || canComposeReflection);

  const filterCounts = useMemo(() => {
    let reflection = 0;
    let chat = 0;
    for (const message of messages) {
      if (isReflectionShareMessage(message)) reflection += 1;
      else chat += 1;
    }
    return {
      all: messages.length,
      reflection,
      chat,
    };
  }, [messages]);

  const filteredMessages = useMemo(() => {
    if (filter === "all") return messages;
    if (filter === "reflection") {
      return messages.filter((message) => isReflectionShareMessage(message));
    }
    return messages.filter((message) => !isReflectionShareMessage(message));
  }, [messages, filter]);

  const activeMention = useMemo(
    () => getActiveMentionQuery(draft, caret),
    [draft, caret],
  );
  const mentionMatches = useMemo(() => {
    if (!activeMention) return [];
    return filterMentionCandidates(mentionCandidates, activeMention.query);
  }, [activeMention, mentionCandidates]);
  const mentionOpen = Boolean(activeMention) && mentionMatches.length > 0;

  const deletableSignature = useMemo(
    () =>
      messages
        .filter((message) => canDeleteOwnChatMessage(message, now))
        .map((message) => message.id)
        .join("|"),
    [messages, now],
  );

  useEffect(() => {
    setMentionIndex(0);
  }, [activeMention?.query, activeMention?.start]);

  useEffect(() => {
    if (!unlocked) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [unlocked, filteredMessages.length, filter]);

  useEffect(() => {
    if (!deletableSignature) return;

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [deletableSignature]);

  function syncCaret(target: HTMLTextAreaElement) {
    setCaret(target.selectionStart ?? target.value.length);
  }

  function applyMention(candidate: MentionCandidate) {
    const selection =
      textareaRef.current?.selectionStart ?? draft.length;
    const next = insertMentionAtCaret(draft, selection, candidate.handle);
    setDraft(next.text.slice(0, 500));
    setCaret(Math.min(next.caret, 500));
    window.requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(next.caret, next.caret);
      setCaret(next.caret);
    });
  }

  function insertAtCaret(text: string) {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? caret;
    const end = el?.selectionEnd ?? start;
    const next = `${draft.slice(0, start)}${text}${draft.slice(end)}`.slice(
      0,
      500,
    );
    const nextCaret = Math.min(start + text.length, 500);
    setDraft(next);
    setCaret(nextCaret);
    window.requestAnimationFrame(() => {
      const target = textareaRef.current;
      if (!target) return;
      target.focus();
      target.setSelectionRange(nextCaret, nextCaret);
      setCaret(nextCaret);
    });
  }

  function handleSend() {
    if (effectiveComposerMode === "reflection") {
      if (!draft.trim()) return;
      saveMyReflectionMessage({
        content: draft,
        passage,
        shareToGroup: true,
      });
      setDraft("");
      setCaret(0);
      setPendingGif(null);
      setMediaPanel(null);
      showToast(copy.chat.reflectionSentToast);
      return;
    }

    if (!draft.trim() && !pendingGif) return;
    postGroupChatMessage({
      content: draft,
      gifUrl: pendingGif?.url,
    });
    setDraft("");
    setCaret(0);
    setPendingGif(null);
    setMediaPanel(null);
  }

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    const ok = deleteOwnChatMessage(pendingDelete.id);
    setPendingDelete(null);
    if (ok) {
      showToast(copy.chat.deleteSuccess);
    } else {
      showToast(copy.chat.deleteExpired);
    }
  }

  function handleComposerKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (mentionOpen) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setMentionIndex((current) =>
          current + 1 >= mentionMatches.length ? 0 : current + 1,
        );
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setMentionIndex((current) =>
          current - 1 < 0 ? mentionMatches.length - 1 : current - 1,
        );
        return;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        const selected = mentionMatches[mentionIndex] ?? mentionMatches[0];
        if (selected) applyMention(selected);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        // tutup dengan sisip spasi setelah @query supaya pola mention putus
        const el = textareaRef.current;
        if (el && activeMention) {
          const next =
            draft.slice(0, activeMention.start + 1 + activeMention.query.length) +
            " " +
            draft.slice(el.selectionStart);
          setDraft(next.slice(0, 500));
        }
        return;
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  if (!showChatBody && !showComposerBar) {
    return (
      <section className="rounded-2xl border border-dashed border-[var(--m-line)] bg-white/70 px-4 py-6 text-center lg:px-5">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-[var(--m-wash)] text-[var(--m-accent)]">
          <MessageCircle className="size-5" />
        </div>
        <h2 className="mt-3 font-semibold text-[var(--m-ink)]">
          {copy.chat.lockedTitle}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--m-ink-soft)]">
          {copy.chat.lockedHint}
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
      {!hideHeader ? (
        <div className="shrink-0 border-b border-[var(--m-line)] bg-[var(--m-wash)]/45 px-4 py-3.5 lg:px-5">
          <h2 className="flex items-center gap-2 font-semibold text-[var(--m-ink)]">
            <MessageCircle className="size-4 text-[var(--m-accent)]" />
            {copy.chat.title}
          </h2>
          <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">
            Saling menguatkan lewat percakapan kelompok
          </p>
        </div>
      ) : null}

      {showChatBody ? (
        <div className="flex shrink-0 flex-col gap-2 border-b border-[var(--m-line)] bg-white/60 px-4 py-2.5 lg:px-5">
          <div
            role="tablist"
            aria-label={copy.chat.filterAria}
            className="flex gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {CHAT_FILTERS.map((item) => {
              const active = filter === item.value;
              const count = filterCounts[item.value];
              return (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(item.value)}
                  className={cn(
                    "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors",
                    active
                      ? "border-[var(--m-accent)] bg-[var(--m-accent)] text-white"
                      : "border-[var(--m-line)] bg-white text-[var(--m-ink-soft)] hover:border-[var(--m-accent)]/35 hover:text-[var(--m-ink)]",
                  )}
                >
                  {item.value === "reflection" ? (
                    <Sparkles className="size-3 shrink-0" />
                  ) : null}
                  {item.value === "chat" ? (
                    <MessageCircle className="size-3 shrink-0" />
                  ) : null}
                  {item.label}
                  <span
                    className={cn(
                      "rounded-md px-1 py-px text-[10px] font-semibold tabular-nums",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[var(--m-wash)] text-[var(--m-ink-soft)]",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="border-b border-[var(--m-line)] px-4 py-4 text-center lg:px-5">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-[var(--m-wash)] text-[var(--m-accent)]">
            <Sparkles className="size-4" />
          </div>
          <h2 className="mt-2.5 text-sm font-semibold text-[var(--m-ink)]">
            {copy.chat.lockedTitle}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-[var(--m-ink-soft)]">
            {copy.chat.lockedHint}
          </p>
        </div>
      )}

      {showChatBody ? (
      <div
        className={cn(
          "min-h-0 space-y-3 overflow-y-auto px-4 py-4 lg:px-5",
          expanded
            ? "max-h-[min(46rem,72dvh)] flex-1"
            : "max-h-[min(34rem,62dvh)]",
        )}
      >
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--m-ink-soft)]">
            {copy.chat.empty}
          </p>
        ) : filteredMessages.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--m-ink-soft)]">
            {filter === "reflection"
              ? copy.chat.filterEmptyReflection
              : copy.chat.filterEmptyChat}
          </p>
        ) : (
          filteredMessages.map((message) => {
            const deletable = canDeleteOwnChatMessage(message, now);
            const remaining = deletable
              ? getChatDeleteRemainingMs(message, now)
              : 0;
            const isReflection = isReflectionShareMessage(message);
            const isDeleted = Boolean(message.deleted);

            if (isDeleted) {
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2.5",
                    message.isMine ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <MemberAvatar
                    name={message.authorName}
                    currentUser={message.isMine}
                    className="size-8 shrink-0 opacity-60"
                    fallbackClassName={cn(
                      "text-[10px] font-bold",
                      message.isMine
                        ? "bg-[var(--m-accent)]/70 text-white"
                        : "bg-[var(--m-wash)] text-[var(--m-ink)]",
                    )}
                  />
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl border border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/40 px-3.5 py-2.5",
                      message.isMine ? "rounded-tr-md" : "rounded-tl-md",
                    )}
                  >
                    <p className="inline-flex items-center gap-1.5 text-sm italic text-[var(--m-ink-soft)]">
                      <Trash2 className="size-3.5 shrink-0 opacity-70" />
                      {isReflection
                        ? copy.chat.deletedReflectionPlaceholder
                        : copy.chat.deletedPlaceholder}
                    </p>
                    <p className="mt-1 text-[10px] text-[var(--m-ink-soft)]/80">
                      {message.isMine ? "Kamu" : message.authorName}
                      {message.time ? ` · ${message.time}` : null}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2.5",
                  message.isMine ? "flex-row-reverse" : "flex-row",
                )}
              >
                <MemberAvatar
                  name={message.authorName}
                  currentUser={message.isMine}
                  className="size-8 shrink-0"
                  fallbackClassName={cn(
                    "text-[10px] font-bold",
                    message.isMine
                      ? "bg-[var(--m-accent)] text-white"
                      : "bg-[var(--m-wash)] text-[var(--m-ink)]",
                  )}
                />
                {isReflection ? (
                  <div
                    className={cn(
                      "max-w-[min(100%,28rem)] overflow-hidden rounded-2xl border shadow-sm",
                      message.isMine
                        ? "rounded-tr-md border-[var(--m-accent)]/35 bg-[var(--m-wash)]"
                        : "rounded-tl-md border-[var(--m-accent)]/25 bg-white",
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-[var(--m-line)] bg-[var(--m-accent)]/[0.06] px-3 py-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--m-accent)]">
                        <Sparkles className="size-3" />
                        {copy.chat.reflectionBadge}
                      </span>
                      {message.passage ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--m-ink)]">
                          <BookOpen className="size-3 shrink-0 text-[var(--m-accent)]" />
                          {message.passage}
                        </span>
                      ) : null}
                    </div>
                    <div className="px-3.5 py-2.5">
                      <p className="text-[11px] font-semibold text-[var(--m-ink-soft)]">
                        {message.isMine
                          ? `Kamu · ${copy.chat.reflectionShared}`
                          : `${message.authorName} · ${copy.chat.reflectionShared}`}
                      </p>
                      <MessageBody
                        content={message.content}
                        gifUrl={message.gifUrl}
                        candidates={mentionCandidates}
                        mine={false}
                      />
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <p className="text-[10px] text-[var(--m-ink-soft)]">
                          {message.time}
                          {deletable
                            ? ` · ${copy.chat.deleteWindowHint} ${formatRemaining(remaining)}`
                            : null}
                        </p>
                        {deletable ? (
                          <button
                            type="button"
                            onClick={() => setPendingDelete(message)}
                            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-[var(--m-accent)] transition hover:bg-[var(--m-wash)]"
                            aria-label={copy.chat.delete}
                          >
                            <Trash2 className="size-3" />
                            {copy.chat.delete}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5",
                      message.isMine
                        ? "rounded-tr-md bg-[var(--m-accent)] text-white"
                        : "rounded-tl-md bg-[var(--m-wash)] text-[var(--m-ink)]",
                    )}
                  >
                    {!message.isMine ? (
                      <p className="text-[11px] font-semibold text-[var(--m-accent)]">
                        {message.authorName}
                      </p>
                    ) : null}
                    <MessageBody
                      content={message.content}
                      gifUrl={message.gifUrl}
                      candidates={mentionCandidates}
                      mine={message.isMine}
                    />
                    <div
                      className={cn(
                        "mt-1.5 flex items-center gap-2",
                        message.isMine ? "justify-between" : "justify-start",
                      )}
                    >
                      <p
                        className={cn(
                          "text-[10px]",
                          message.isMine
                            ? "text-white/65"
                            : "text-[var(--m-ink-soft)]",
                        )}
                      >
                        {message.time}
                        {deletable
                          ? ` · ${copy.chat.deleteWindowHint} ${formatRemaining(remaining)}`
                          : null}
                      </p>
                      {deletable ? (
                        <button
                          type="button"
                          onClick={() => setPendingDelete(message)}
                          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white/85 transition hover:bg-white/15 hover:text-white"
                          aria-label={copy.chat.delete}
                        >
                          <Trash2 className="size-3" />
                          {copy.chat.delete}
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
      ) : null}

      {showComposerBar ? (
        <div className="relative shrink-0 border-t border-[var(--m-line)] px-3 py-3 lg:px-4">
          {canComposeReflection && unlocked ? (
            <div
              role="group"
              aria-label={copy.chat.composerModeAria}
              className="mb-2.5 flex gap-1 rounded-lg bg-[var(--m-wash)]/80 p-0.5"
            >
              <button
                type="button"
                onClick={() => setComposerMode("reflection")}
                className={cn(
                  "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition",
                  effectiveComposerMode === "reflection"
                    ? "bg-white text-[var(--m-accent)] shadow-sm"
                    : "text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
                )}
              >
                <Sparkles className="size-3" />
                {copy.chat.composerModeReflection}
              </button>
              <button
                type="button"
                onClick={() => setComposerMode("chat")}
                className={cn(
                  "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition",
                  effectiveComposerMode === "chat"
                    ? "bg-white text-[var(--m-accent)] shadow-sm"
                    : "text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
                )}
              >
                <MessageCircle className="size-3" />
                {copy.chat.composerModeChat}
              </button>
            </div>
          ) : null}

          {effectiveComposerMode === "reflection" ? (
            <p className="mb-2 inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[var(--m-wash)] px-2.5 py-1 text-[11px] font-semibold text-[var(--m-ink)]">
              <BookOpen className="size-3 shrink-0 text-[var(--m-accent)]" />
              <span className="truncate">{passage}</span>
            </p>
          ) : null}

          {mentionOpen && effectiveComposerMode === "chat" ? (
            <div
              role="listbox"
              aria-label={copy.chat.mentionLabel}
              className="absolute inset-x-3 bottom-[calc(100%-0.25rem)] z-20 max-h-52 overflow-y-auto rounded-xl border border-[var(--m-line)] bg-white py-1 shadow-[var(--shadow-float)] lg:inset-x-4"
            >
              {mentionMatches.map((candidate, index) => (
                <button
                  key={candidate.id}
                  type="button"
                  role="option"
                  aria-selected={index === mentionIndex}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors",
                    index === mentionIndex
                      ? "bg-[var(--m-wash)]"
                      : "hover:bg-[var(--m-wash)]/60",
                  )}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    applyMention(candidate);
                  }}
                  onMouseEnter={() => setMentionIndex(index)}
                >
                  {candidate.id === "all" ? (
                    <div className="flex size-8 items-center justify-center rounded-full bg-[var(--m-accent)]/10 text-[var(--m-accent)]">
                      <AtSign className="size-3.5" />
                    </div>
                  ) : (
                    <MemberAvatar
                      name={candidate.name}
                      memberId={candidate.id}
                      currentUser={candidate.isCurrentUser}
                      className="size-8"
                      fallbackClassName="bg-[var(--m-wash)] text-[10px] font-semibold text-[var(--m-ink)]"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--m-ink)]">
                      {candidate.id === "all"
                        ? copy.chat.mentionAll
                        : candidate.name}
                    </p>
                    <p className="truncate text-[11px] text-[var(--m-ink-soft)]">
                      {candidate.id === "all"
                        ? `${copy.chat.mentionAllHandle} · @semua`
                        : `@${candidate.handle}`}
                      {candidate.id !== "all"
                        ? ` · ${getRoleLabel(candidate.role)}`
                        : null}
                    </p>
                  </div>
                </button>
              ))}
              {mentionMatches.length === 0 ? (
                <p className="px-3 py-2 text-sm text-[var(--m-ink-soft)]">
                  {copy.chat.mentionEmpty}
                </p>
              ) : null}
            </div>
          ) : null}

          {mediaPanel === "emoji" && effectiveComposerMode === "chat" ? (
            <ChatEmojiPicker
              className="absolute inset-x-3 bottom-[calc(100%-0.25rem)] z-20 lg:inset-x-4"
              onPick={(emoji) => {
                insertAtCaret(emoji);
              }}
            />
          ) : null}

          {mediaPanel === "gif" && effectiveComposerMode === "chat" ? (
            <ChatGifPicker
              className="absolute inset-x-3 bottom-[calc(100%-0.25rem)] z-20 lg:inset-x-4"
              onPick={(gif) => {
                setPendingGif(gif);
                setMediaPanel(null);
              }}
            />
          ) : null}

          {pendingGif && effectiveComposerMode === "chat" ? (
            <ChatGifPreviewChip
              url={pendingGif.preview || pendingGif.url}
              onRemove={() => setPendingGif(null)}
            />
          ) : null}

          <div className="flex items-end gap-2">
            {effectiveComposerMode === "chat" ? (
              <div className="flex shrink-0 items-center gap-1.5 pb-0.5">
                <button
                  type="button"
                  onClick={() =>
                    setMediaPanel((current) =>
                      current === "emoji" ? null : "emoji",
                    )
                  }
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-xl border transition",
                    mediaPanel === "emoji"
                      ? "border-[var(--m-accent)] bg-[var(--m-wash)] text-[var(--m-accent)]"
                      : "border-[var(--m-line)] bg-white text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
                  )}
                  aria-label={copy.chat.emojiAria}
                  aria-pressed={mediaPanel === "emoji"}
                >
                  <Smile className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMediaPanel((current) =>
                      current === "gif" ? null : "gif",
                    )
                  }
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-xl border transition",
                    mediaPanel === "gif"
                      ? "border-[var(--m-accent)] bg-[var(--m-wash)] text-[var(--m-accent)]"
                      : "border-[var(--m-line)] bg-white text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]",
                  )}
                  aria-label={copy.chat.gifAria}
                  aria-pressed={mediaPanel === "gif"}
                >
                  <ImageIcon className="size-4" />
                </button>
              </div>
            ) : null}
            <Textarea
              ref={textareaRef}
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value.slice(0, 500));
                syncCaret(event.target);
              }}
              onClick={(event) => {
                syncCaret(event.currentTarget);
                setMediaPanel(null);
              }}
              onFocus={() => setMediaPanel(null)}
              onKeyUp={(event) => syncCaret(event.currentTarget)}
              onSelect={(event) => syncCaret(event.currentTarget)}
              placeholder={
                effectiveComposerMode === "reflection"
                  ? copy.chat.reflectionPlaceholder
                  : copy.chat.placeholder
              }
              className="min-h-[2.75rem] max-h-28 flex-1 resize-none rounded-xl text-sm"
              rows={2}
              onKeyDown={handleComposerKeyDown}
            />
            <Button
              type="button"
              size="icon"
              className="size-11 shrink-0 rounded-xl"
              disabled={
                effectiveComposerMode === "reflection"
                  ? !draft.trim()
                  : !draft.trim() && !pendingGif
              }
              onClick={handleSend}
              aria-label={copy.chat.send}
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}

      <Dialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <DialogContent className="gap-4 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{copy.chat.deleteTitle}</DialogTitle>
            <DialogDescription>{copy.chat.deleteDescription}</DialogDescription>
          </DialogHeader>
          {pendingDelete ? (
            <p className="rounded-xl bg-[var(--m-wash)] px-3.5 py-3 text-sm leading-relaxed text-[var(--m-ink)] line-clamp-4">
              {pendingDelete.content}
            </p>
          ) : null}
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingDelete(null)}
            >
              {copy.chat.deleteCancel}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="font-semibold"
              onClick={handleConfirmDelete}
            >
              <Trash2 className="size-4" />
              {copy.chat.deleteConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
