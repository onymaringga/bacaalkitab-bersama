import { AuthShell } from "@/components/auth/auth-shell";
import { copy } from "@/lib/copy";

import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title={copy.auth.forgotPassword.title}
      subtitle={copy.auth.forgotPassword.description}
      panelEyebrow="Akun"
      panelTitle={
        <>
          Pulihkan akses ke{" "}
          <span className="landing-display-italic text-white/90">
            bacaan bersama
          </span>
        </>
      }
      panelBody="Atur ulang password demo kamu, lalu lanjutkan bacaan dan chat kelompok seperti biasa."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
