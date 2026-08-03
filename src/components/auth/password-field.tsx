"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

type PasswordFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
};

export function PasswordField({
  id,
  value,
  onChange,
  label = "Password",
  placeholder = "••••••••",
  autoComplete = "current-password",
  minLength,
  required,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          minLength={minLength}
          required={required}
          className={cn("auth-input pr-11")}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute top-1/2 right-2.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--l-ink-soft)] transition-colors hover:bg-[var(--l-wash)] hover:text-[var(--l-ink)]"
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff className="size-4" strokeWidth={2} />
          ) : (
            <Eye className="size-4" strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}
