"use client";

import Link from "next/link";
import { useState } from "react";

import { PasswordField } from "@/components/auth/password-field";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import { signUp } from "@/lib/auth-client";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

export function RegisterForm({ social }: { social?: React.ReactNode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUp.email({ name, email, password });
      window.location.href = "/dashboard";
    } catch {
      setError(copy.auth.register.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
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
