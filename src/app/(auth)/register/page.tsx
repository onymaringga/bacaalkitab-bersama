import { AuthShell } from "@/components/auth/auth-shell";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { copy } from "@/lib/copy";

import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title={copy.auth.register.title}
      subtitle={copy.auth.register.description}
      panelEyebrow="Daftar"
      panelTitle={
        <>
          Bergabung dengan komunitas baca{" "}
          <span className="landing-display-italic text-white/90">
            yang kamu ikuti
          </span>
        </>
      }
      panelBody="Buat akun, masuk ke kelompok, dan mulai dari bacaan hari ini."
    >
      <RegisterForm social={<SocialAuthButtons />} />
    </AuthShell>
  );
}
