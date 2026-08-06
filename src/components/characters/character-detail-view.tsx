"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  HandHeart,
  HeartHandshake,
  Users,
} from "lucide-react";

import { HistoryBackButton } from "@/components/ui/history-back-button";
import { CharacterPortrait } from "@/components/characters/character-portrait";
import { copy } from "@/lib/copy";
import {
  characterEraLabel,
  characterVerseHref,
  getBibleCharacter,
  getCharacterCategory,
  getCharacterVerses,
  getCharacterAlsoCalled,
  type BibleCharacter,
  type BibleCharacterMoment,
  type BibleCharacterVerse,
  type BibleCharacterFamily,
  type CharacterFamilyMember,
} from "@/lib/bible-characters";
import {
  getCharacterFamily,
  hasFamilyInfo,
  normalizeFamilyMembers,
} from "@/lib/bible-character-family";
import { cn } from "@/lib/utils";

type CharacterDetailViewProps = {
  character: BibleCharacter;
};

function splitParagraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function CharacterDetailView({ character }: CharacterDetailViewProps) {
  const category = getCharacterCategory(character.category);
  const storyParagraphs = splitParagraphs(character.story);
  const backgroundParagraphs = character.background
    ? splitParagraphs(character.background)
    : [];
  const reflectionParagraphs = character.reflection
    ? splitParagraphs(character.reflection)
    : [];
  const verses = getCharacterVerses(character);
  const moments = character.keyMoments ?? [];
  const related = (character.relatedSlugs ?? [])
    .map((slug) => getBibleCharacter(slug))
    .filter((item): item is BibleCharacter => Boolean(item))
    .slice(0, 4);
  const family = character.family ?? getCharacterFamily(character.slug);
  const alsoCalled = getCharacterAlsoCalled(character);

  return (
    <div className="member-web-animate-in mx-auto w-full max-w-5xl space-y-5 pb-2">
      <HistoryBackButton
        fallbackHref="/baca/tokoh"
        label={copy.characters.backToList}
        size="sm"
        variant="ghost"
        className="-ml-2 h-9 px-2 text-[var(--m-ink-soft)] hover:text-[var(--m-ink)]"
      />

      <header className="overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90">
        <div className="grid lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
          <CharacterPortrait
            slug={character.slug}
            name={character.name}
            category={character.category}
            variant="hero"
            className="lg:aspect-[4/5] lg:min-h-0 lg:rounded-none lg:border-r lg:border-[var(--m-line)]"
          />
          <div className="px-5 py-5 sm:px-6 lg:py-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="member-web-kicker text-[var(--m-accent)]">
                {category.label}
              </p>
              <span className="rounded-md bg-[var(--m-wash)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                {characterEraLabel(character.era)}
              </span>
              {moments.length > 0 ? (
                <span className="rounded-md bg-[var(--m-wash)] px-2 py-0.5 text-[10px] font-semibold text-[var(--m-ink-soft)]">
                  {moments.length} momen
                </span>
              ) : null}
            </div>
            <h1 className="member-web-display mt-1.5 text-[clamp(1.75rem,3vw,2.35rem)] leading-[1.1] text-[var(--m-ink)]">
              {character.name}
            </h1>
            <p className="mt-1.5 text-sm font-medium text-[var(--m-accent)]">
              {character.role}
            </p>
            {alsoCalled.length > 0 ? (
              <p className="mt-2 text-sm text-[var(--m-ink-soft)]">
                Juga disebut:{" "}
                <span className="font-medium text-[var(--m-ink)]">
                  {alsoCalled.join(" · ")}
                </span>
              </p>
            ) : null}
            <p className="mt-3 text-sm leading-relaxed text-[var(--m-ink)] sm:text-[0.95rem]">
              {character.summary}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start">
        <div className="space-y-5 min-w-0">
          {backgroundParagraphs.length > 0 ? (
            <ContentSection title={copy.characters.backgroundTitle}>
              {backgroundParagraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-sm leading-relaxed text-[var(--m-ink)]"
                >
                  {paragraph}
                </p>
              ))}
            </ContentSection>
          ) : null}

          <ContentSection title={copy.characters.storyTitle}>
            {storyParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-sm leading-relaxed text-[var(--m-ink)]"
              >
                {paragraph}
              </p>
            ))}
          </ContentSection>

          <NarrativeFollowUpBlocks
            character={character}
            moments={moments}
            reflectionParagraphs={reflectionParagraphs}
          />

          <div className="space-y-5 lg:hidden">
            <SidebarBlocks
              character={character}
              family={family}
              verses={verses}
              related={related}
              compact={false}
            />
          </div>
        </div>

        <aside className="hidden space-y-4 lg:sticky lg:top-24 lg:block lg:self-start">
          <SidebarBlocks
            character={character}
            family={family}
            verses={verses}
            related={related}
            compact
          />
        </aside>
      </div>

      <p className="rounded-xl border border-dashed border-[var(--m-line)] bg-[var(--m-wash)]/40 px-4 py-3 text-xs leading-relaxed text-[var(--m-ink-soft)]">
        {copy.characters.hint}
      </p>
    </div>
  );
}

function ContentSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <h2 className="text-sm font-semibold text-[var(--m-ink)]">{title}</h2>
      <div className="space-y-3 rounded-2xl border border-[var(--m-line)] bg-white/90 px-4 py-4 sm:px-5">
        {children}
      </div>
    </section>
  );
}

function NarrativeFollowUpBlocks({
  character,
  moments,
  reflectionParagraphs,
}: {
  character: BibleCharacter;
  moments: BibleCharacterMoment[];
  reflectionParagraphs: string[];
}) {
  return (
    <>
      {moments.length > 0 ? (
        <ContentSection title={copy.characters.momentsTitle}>
          <ol className="divide-y divide-[var(--m-line)]">
            {moments.map((moment, index) => (
              <MomentCard
                key={`${moment.title}-${index}`}
                moment={moment}
                index={index}
              />
            ))}
          </ol>
        </ContentSection>
      ) : null}

      {character.lessons && character.lessons.length > 0 ? (
        <ContentSection title={copy.characters.lessonsTitle}>
          <ul className="space-y-2">
            {character.lessons.map((lesson) => (
              <li
                key={lesson}
                className="flex gap-2 text-sm leading-relaxed text-[var(--m-ink)]"
              >
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--m-accent)]"
                  aria-hidden
                />
                <span>{lesson}</span>
              </li>
            ))}
          </ul>
        </ContentSection>
      ) : null}

      {reflectionParagraphs.length > 0 ? (
        <ContentSection title={copy.characters.reflectionTitle}>
          {reflectionParagraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="text-sm leading-relaxed text-[var(--m-ink)]"
            >
              {paragraph}
            </p>
          ))}
        </ContentSection>
      ) : null}
    </>
  );
}

function SidebarBlocks({
  character,
  family,
  verses,
  related,
  compact,
}: {
  character: BibleCharacter;
  family: BibleCharacterFamily;
  verses: BibleCharacterVerse[];
  related: BibleCharacter[];
  compact: boolean;
}) {
  return (
    <>
      <FamilySection family={family} compact={compact} />

      {verses.length > 0 ? (
        <SidebarSection
          icon={BookOpen}
          title={
            verses.length > 1
              ? copy.characters.keyVerses
              : copy.characters.keyVerse
          }
          compact={compact}
        >
          <ul className="divide-y divide-[var(--m-line)]">
            {verses.map((verse, index) => (
              <VerseCard
                key={`${verse.reference}-${index}`}
                verse={verse}
                index={index}
                compact={compact}
              />
            ))}
          </ul>
        </SidebarSection>
      ) : null}

      {character.prayer ? (
        <SidebarSection
          icon={HandHeart}
          title={copy.characters.prayerTitle}
          compact={compact}
        >
          <p className="text-xs leading-relaxed text-[var(--m-ink)] italic sm:text-sm">
            {character.prayer}
          </p>
        </SidebarSection>
      ) : null}

      {related.length > 0 ? (
        <SidebarSection
          icon={Users}
          title={copy.characters.relatedTitle}
          compact={compact}
        >
          <ul className="space-y-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/baca/tokoh/${item.slug}`}
                  className="group flex items-center gap-2.5 rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/35 p-2.5 transition hover:border-[var(--m-accent)]/30 hover:bg-[var(--m-wash)]/55"
                >
                  <CharacterPortrait
                    slug={item.slug}
                    name={item.name}
                    category={item.category}
                    variant="thumb"
                    className="size-10 shrink-0 rounded-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--m-ink)] group-hover:text-[var(--m-accent)]">
                      {item.name}
                    </p>
                    <p className="truncate text-[11px] text-[var(--m-ink-soft)]">
                      {item.role}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </SidebarSection>
      ) : null}
    </>
  );
}

function SidebarSection({
  icon: Icon,
  title,
  compact,
  children,
}: {
  icon: typeof BookOpen;
  title: string;
  compact: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90",
        compact && "shadow-sm",
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--m-line)] bg-[var(--m-wash)]/50 px-3.5 py-2">
        <Icon className="size-3.5 text-[var(--m-accent)]" />
        <h2 className="text-xs font-semibold text-[var(--m-ink)] sm:text-sm">
          {title}
        </h2>
      </div>
      <div className="space-y-2 px-3.5 py-3">{children}</div>
    </section>
  );
}

const FAMILY_GROUPS: {
  key: keyof BibleCharacterFamily;
  labelKey:
    | "familyFather"
    | "familyMother"
    | "familySpouse"
    | "familyInLaws"
    | "familySiblings"
    | "familyChildren";
}[] = [
  { key: "father", labelKey: "familyFather" },
  { key: "mother", labelKey: "familyMother" },
  { key: "spouse", labelKey: "familySpouse" },
  { key: "inLaws", labelKey: "familyInLaws" },
  { key: "siblings", labelKey: "familySiblings" },
  { key: "children", labelKey: "familyChildren" },
];

function FamilySection({
  family,
  compact,
}: {
  family: BibleCharacterFamily;
  compact: boolean;
}) {
  const hasInfo = hasFamilyInfo(family);

  return (
    <SidebarSection
      icon={HeartHandshake}
      title={copy.characters.familyTitle}
      compact={compact}
    >
      {hasInfo ? (
        <dl className="space-y-2.5">
          {FAMILY_GROUPS.map(({ key, labelKey }) => {
            const members = normalizeFamilyMembers(family[key]);
            if (members.length === 0) return null;
            return (
              <div key={key}>
                <dt className="text-[10px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                  {copy.characters[labelKey]}
                </dt>
                <dd className="mt-1">
                  <ul className="space-y-1">
                    {members.map((member) => (
                      <FamilyMemberItem
                        key={`${key}-${member.slug ?? member.name}`}
                        member={member}
                      />
                    ))}
                  </ul>
                </dd>
              </div>
            );
          })}
        </dl>
      ) : (
        <p className="text-xs text-[var(--m-ink-soft)] sm:text-sm">
          {copy.characters.familyNotRecorded}
        </p>
      )}
    </SidebarSection>
  );
}

function FamilyMemberItem({ member }: { member: CharacterFamilyMember }) {
  const linked = member.slug ? getBibleCharacter(member.slug) : null;

  return (
    <li className="text-xs leading-relaxed text-[var(--m-ink)] sm:text-sm">
      {linked ? (
        <Link
          href={`/baca/tokoh/${linked.slug}`}
          className="font-medium text-[var(--m-accent)] underline-offset-2 hover:underline"
        >
          {member.name}
        </Link>
      ) : (
        <span className="font-medium">{member.name}</span>
      )}
      {member.note ? (
        <span className="text-[var(--m-ink-soft)]"> — {member.note}</span>
      ) : null}
    </li>
  );
}

function MomentCard({
  moment,
  index,
}: {
  moment: BibleCharacterMoment;
  index: number;
}) {
  const href =
    moment.passage != null
      ? characterVerseHref({
          reference: moment.reference ?? moment.passage,
          passage: moment.passage,
          verse: moment.verse,
          text: "",
        })
      : null;

  return (
    <li className="py-3 first:pt-0 last:pb-0">
      <div className="flex items-start gap-2.5">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-[var(--m-accent)]/10 text-[10px] font-bold text-[var(--m-accent)]">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <p className="text-sm font-semibold text-[var(--m-ink)]">
              {moment.title}
            </p>
            {moment.reference ? (
              href ? (
                <Link
                  href={href}
                  className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-[var(--m-accent)] hover:underline"
                >
                  {moment.reference}
                  <ArrowUpRight className="size-3" />
                </Link>
              ) : (
                <span className="shrink-0 text-[11px] text-[var(--m-ink-soft)]">
                  {moment.reference}
                </span>
              )
            ) : null}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-[var(--m-ink)]">
            {moment.summary}
          </p>
        </div>
      </div>
    </li>
  );
}

function VerseCard({
  verse,
  compact,
}: {
  verse: BibleCharacterVerse;
  index: number;
  compact: boolean;
}) {
  return (
    <li className="py-2.5 first:pt-0 last:pb-0">
      <p className="text-[11px] font-semibold text-[var(--m-accent)] sm:text-xs">
        {verse.reference}
      </p>
      <p
        className={cn(
          "mt-1 text-xs leading-relaxed text-[var(--m-ink)] sm:text-sm",
          compact && "line-clamp-4",
        )}
      >
        {verse.text}
      </p>
      <Link
        href={characterVerseHref(verse)}
        className="mt-1.5 inline-flex items-center gap-0.5 text-[11px] font-semibold text-[var(--m-accent)] hover:underline sm:text-xs"
      >
        {copy.characters.readInContext}
        <ArrowUpRight className="size-3" />
      </Link>
    </li>
  );
}
