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
          Mulai perjalanan baca{" "}
          <span className="landing-display-italic text-white/90">
            sendiri atau bersama kelompok
          </span>
        </>
      }
      panelBody="Daftar sebagai individu atau langsung gabung ke kelompok baca yang kamu ikuti."
    >
      <RegisterForm social={<SocialAuthButtons />} />
    </AuthShell>
  );
}
