"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PasswordField } from "@/components/auth/password-field";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import { readRememberMe, writeRememberMe } from "@/lib/auth-remember";
import { copy } from "@/lib/copy";
import {
  getPostLoginPath,
  validateDemoLogin,
  writeDemoSession,
} from "@/lib/demo-auth";
import { cn } from "@/lib/utils";

export function LoginForm({ social }: { social?: React.ReactNode }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const remembered = readRememberMe();
    if (!remembered.enabled || !remembered.username) return;
    setUsername(remembered.username);
    setRememberMe(true);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const session = validateDemoLogin(username, password);
    if (!session) {
      setError(copy.auth.login.error);
      setLoading(false);
      return;
    }

    writeRememberMe(rememberMe, session.username);
    writeDemoSession(session);
    router.replace(getPostLoginPath(session.role));
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="username" className="auth-label">
            Username
          </label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username atau email"
            required
            className="auth-input"
          />
        </div>
        <PasswordField
          id="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--l-ink-soft)]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="size-4 rounded border-[var(--l-line)] accent-[var(--l-accent)]"
            />
            {copy.auth.login.rememberMe}
          </label>
          <Link
            href="/lupa-password"
            className="text-sm font-semibold text-[var(--l-accent)] underline-offset-4 hover:underline"
          >
            {copy.auth.login.forgotPassword}
          </Link>
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
              {copy.auth.login.loading}
            </>
          ) : (
            copy.auth.login.submit
          )}
        </button>
      </form>
      {social}
      <p className="mt-6 text-center text-sm text-[var(--l-ink-soft)]">
        {copy.auth.login.noAccount}{" "}
        <Link
          href="/register"
          className="font-semibold text-[var(--l-accent)] underline-offset-4 hover:underline"
        >
          {copy.auth.login.register}
        </Link>
      </p>
    </div>
  );
}
