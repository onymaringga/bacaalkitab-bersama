"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, Ticket, User, Users } from "lucide-react";

import { PasswordField } from "@/components/auth/password-field";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import {
  getPostLoginPath,
  registerDemoAccount,
  writeDemoSession,
} from "@/lib/demo-auth";
import { demoGroups } from "@/lib/demo-data";
import { copy } from "@/lib/copy";
import {
  resolveGroupIdFromInvite,
  writeUserMembership,
  type UserMembershipType,
} from "@/lib/user-membership";
import { cn } from "@/lib/utils";

type RegisterStep = "details" | "invite";

export function RegisterForm({ social }: { social?: React.ReactNode }) {
  const router = useRouter();
  const [step, setStep] = useState<RegisterStep>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [membershipType, setMembershipType] =
    useState<UserMembershipType>("group");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inviteGroupId = useMemo(
    () => resolveGroupIdFromInvite(inviteCode),
    [inviteCode],
  );

  const inviteGroup = useMemo(
    () => demoGroups.find((group) => group.id === inviteGroupId) ?? null,
    [inviteGroupId],
  );

  function completeRegistration(groupId?: string, code?: string) {
    const session = registerDemoAccount({ name, email, password });
    if (!session) {
      setError(copy.auth.register.emailTaken);
      setLoading(false);
      return;
    }

    writeUserMembership(
      {
        type: membershipType,
        groupId,
        inviteCode: code,
      },
      session.email,
    );
    writeDemoSession(session);
    router.replace(getPostLoginPath(session.role));
  }

  function handleDetailsSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (membershipType === "group") {
      setStep("invite");
      return;
    }

    setLoading(true);
    completeRegistration();
  }

  function handleInviteSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!inviteCode.trim()) {
      setError(copy.auth.register.inviteCodeRequired);
      setLoading(false);
      return;
    }

    if (!inviteGroupId) {
      setError(copy.auth.register.inviteInvalid);
      setLoading(false);
      return;
    }

    completeRegistration(inviteGroupId, inviteCode.trim());
  }

  if (step === "invite") {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            setStep("details");
            setError(null);
          }}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--l-ink-soft)] transition hover:text-[var(--l-accent)]"
        >
          <ArrowLeft className="size-4" />
          {copy.auth.register.backToDetails}
        </button>

        <div className="mb-5 space-y-1">
          <h2 className="text-lg font-semibold text-[var(--l-ink)]">
            {copy.auth.register.inviteStepTitle}
          </h2>
          <p className="text-sm leading-relaxed text-[var(--l-ink-soft)]">
            {copy.auth.register.inviteStepDescription}
          </p>
        </div>

        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="inviteCode" className="auth-label">
              {copy.auth.register.inviteCodeLabel}
            </label>
            <div className="relative">
              <Ticket className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--l-ink-soft)]" />
              <input
                id="inviteCode"
                value={inviteCode}
                onChange={(event) => setInviteCode(event.target.value)}
                placeholder={copy.auth.register.inviteCodePlaceholder}
                className="auth-input pl-10"
                autoComplete="off"
                autoFocus
                required
              />
            </div>
            <p className="text-xs leading-relaxed text-[var(--l-ink-soft)]">
              {copy.auth.register.inviteCodeHint}
            </p>
          </div>

          {inviteGroup ? (
            <p
              role="status"
              className="rounded-xl border border-[var(--l-accent)]/25 bg-[var(--l-accent)]/8 px-3.5 py-2.5 text-sm text-[var(--l-ink)]"
            >
              {copy.auth.register.inviteGroupPreview(inviteGroup.name)}
            </p>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "landing-btn-primary w-full",
              loading && "pointer-events-none opacity-85",
            )}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="text-white" />
                {copy.auth.register.loading}
              </>
            ) : (
              copy.auth.register.submit
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleDetailsSubmit} className="space-y-4">
        <fieldset className="space-y-2.5">
          <legend className="auth-label mb-1">
            {copy.auth.register.membershipLabel}
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMembershipType("individual")}
              className={cn(
                "rounded-xl border px-3.5 py-3 text-left transition",
                membershipType === "individual"
                  ? "border-[var(--l-accent)] bg-[var(--l-accent)]/8 ring-1 ring-[var(--l-accent)]/25"
                  : "border-[var(--l-line)] bg-white hover:border-[var(--l-accent)]/35",
              )}
            >
              <span className="flex items-center gap-2 font-semibold text-[var(--l-ink)]">
                <User className="size-4 text-[var(--l-accent)]" />
                {copy.auth.register.membershipIndividual}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-[var(--l-ink-soft)]">
                {copy.auth.register.membershipIndividualHint}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMembershipType("group")}
              className={cn(
                "rounded-xl border px-3.5 py-3 text-left transition",
                membershipType === "group"
                  ? "border-[var(--l-accent)] bg-[var(--l-accent)]/8 ring-1 ring-[var(--l-accent)]/25"
                  : "border-[var(--l-line)] bg-white hover:border-[var(--l-accent)]/35",
              )}
            >
              <span className="flex items-center gap-2 font-semibold text-[var(--l-ink)]">
                <Users className="size-4 text-[var(--l-accent)]" />
                {copy.auth.register.membershipGroup}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-[var(--l-ink-soft)]">
                {copy.auth.register.membershipGroupHint}
              </span>
            </button>
          </div>
        </fieldset>

        <div className="space-y-1.5">
          <label htmlFor="name" className="auth-label">
            Nama
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nama lengkap"
            required
            className="auth-input"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="auth-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nama@email.com"
            required
            className="auth-input"
          />
        </div>
        <PasswordField
          id="password"
          value={password}
          onChange={setPassword}
          placeholder="Minimal 8 karakter"
          autoComplete="new-password"
          minLength={8}
          required
        />
        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
          >
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "landing-btn-primary w-full",
            loading && "pointer-events-none opacity-85",
          )}
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="text-white" />
              {copy.auth.register.loading}
            </>
          ) : membershipType === "group" ? (
            copy.auth.register.next
          ) : (
            copy.auth.register.submit
          )}
        </button>
      </form>
      {social}
      <p className="mt-6 text-center text-sm text-[var(--l-ink-soft)]">
        {copy.auth.register.hasAccount}{" "}
        <Link
          href="/login"
          className="font-semibold text-[var(--l-accent)] underline-offset-4 hover:underline"
        >
          {copy.auth.register.login}
        </Link>
      </p>
    </div>
  );
}
