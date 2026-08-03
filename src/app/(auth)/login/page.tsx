import { AuthShell } from "@/components/auth/auth-shell";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { copy } from "@/lib/copy";

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title={copy.auth.login.title}
      subtitle={copy.auth.login.description}
      panelEyebrow="Masuk"
      panelTitle={
        <>
          Lanjutkan bacaan{" "}
          <span className="landing-display-italic text-white/90">
            bersama kelompokmu
          </span>
        </>
      }
      panelBody="Buka bacaan hari ini, tulis renungan, dan lihat perjalanan kelompok — dari satu tempat."
    >
      <LoginForm social={<SocialAuthButtons />} />
    </AuthShell>
  );
}
