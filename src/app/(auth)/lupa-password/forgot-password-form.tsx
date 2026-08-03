"use client";

import Link from "next/link";
import { useState } from "react";

import { PasswordField } from "@/components/auth/password-field";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import { copy } from "@/lib/copy";
import {
  findDemoAccountByLogin,
  resetDemoPassword,
} from "@/lib/demo-auth";
import { cn } from "@/lib/utils";

type Step = "lookup" | "reset" | "done";

export function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>("lookup");
  const [login, setLogin] = useState("");
  const [accountName, setAccountName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleLookup(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const account = findDemoAccountByLogin(login);
    window.setTimeout(() => {
      setLoading(false);
      if (!account) {
        setError(copy.auth.forgotPassword.notFound);
        return;
      }
      setAccountName(account.name);
      setStep("reset");
    }, 400);
  }

  function handleReset(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (newPassword.trim().length < 6) {
      setError(copy.auth.forgotPassword.tooShort);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(copy.auth.forgotPassword.mismatch);
      return;
    }

    setLoading(true);
    const ok = resetDemoPassword(login, newPassword);
    window.setTimeout(() => {
      setLoading(false);
      if (!ok) {
        setError(copy.auth.forgotPassword.notFound);
        return;
      }
      setStep("done");
    }, 350);
  }

  if (step === "done") {
    return (
      <div className="space-y-5 text-center">
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800">
          {copy.auth.forgotPassword.success}
        </p>
        <Link href="/login" className="landing-btn-primary w-full">
          {copy.auth.forgotPassword.goLogin}
        </Link>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <div>
        <form onSubmit={handleReset} className="space-y-4">
          <p className="text-sm text-[var(--l-ink-soft)]">
            {copy.auth.forgotPassword.resetDescription(accountName)}
          </p>
          <PasswordField
            id="new-password"
            label={copy.auth.forgotPassword.newPassword}
            value={newPassword}
            onChange={setNewPassword}
            autoComplete="new-password"
            minLength={6}
            required
          />
          <PasswordField
            id="confirm-password"
            label={copy.auth.forgotPassword.confirmPassword}
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            minLength={6}
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
                {copy.auth.forgotPassword.resetLoading}
              </>
            ) : (
              copy.auth.forgotPassword.resetSubmit
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--l-ink-soft)]">
          <Link
            href="/login"
            className="font-semibold text-[var(--l-accent)] underline-offset-4 hover:underline"
          >
            {copy.auth.forgotPassword.backToLogin}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleLookup} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="login" className="auth-label">
            Username atau email
          </label>
          <input
            id="login"
            name="login"
            autoComplete="username"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            placeholder="admin atau onynaraulita"
            required
            className="auth-input"
          />
        </div>
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
              {copy.auth.forgotPassword.loading}
            </>
          ) : (
            copy.auth.forgotPassword.submit
          )}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--l-ink-soft)]">
        <Link
          href="/login"
          className="font-semibold text-[var(--l-accent)] underline-offset-4 hover:underline"
        >
          {copy.auth.forgotPassword.backToLogin}
        </Link>
      </p>
    </div>
  );
}
