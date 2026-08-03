import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { copy } from "@/lib/copy";

function AuthDivider() {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-[var(--l-line-soft)]" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-[var(--l-paper)] px-2.5 font-medium text-[var(--l-ink-soft)]">
          {copy.auth.google.divider}
        </span>
      </div>
    </div>
  );
}

export function SocialAuthButtons() {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  if (!googleEnabled) return null;

  return (
    <>
      <AuthDivider />
      <GoogleSignInButton />
    </>
  );
}
