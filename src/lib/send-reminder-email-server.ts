export type SendReminderEmailInput = {
  to: string | string[];
  subject: string;
  body: string;
  kind?: "daily" | "manual";
};

function normalizeRecipients(to: string | string[]) {
  const list = (Array.isArray(to) ? to : [to])
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set(list)];
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function toHtmlBody(body: string) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map(
      (part) =>
        `<p style="margin:0 0 14px;line-height:1.6;color:#1f2937;font-size:15px;">${escapeHtml(part).replaceAll("\n", "<br/>")}</p>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px;background:#f4f6f8;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:28px 24px;">
      <p style="margin:0 0 18px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#2563eb;font-family:system-ui,sans-serif;font-weight:700;">
        Baca Alkitab Bersama
      </p>
      ${paragraphs}
      <p style="margin:22px 0 0;font-size:12px;line-height:1.5;color:#6b7280;font-family:system-ui,sans-serif;">
        Pengingat lembut dari komunitas baca Alkitabmu.
      </p>
    </div>
  </body>
</html>`;
}

async function sendViaResend(
  recipients: string[],
  subject: string,
  body: string,
) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;

  const { Resend } = await import("resend");
  const from =
    process.env.REMINDER_EMAIL_FROM?.trim() ||
    "Baca Alkitab Bersama <onboarding@resend.dev>";

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: recipients,
    subject,
    text: body,
    html: toHtmlBody(body),
  });

  if (error) {
    return {
      ok: false as const,
      error: error.message || "Gagal mengirim email lewat Resend.",
    };
  }

  return {
    ok: true as const,
    recipients,
    id: data?.id ?? null,
    provider: "resend" as const,
  };
}

/** Fallback tanpa API key — kirim ke inbox penerima via FormSubmit. */
async function sendViaFormSubmit(
  recipients: string[],
  subject: string,
  body: string,
) {
  const results: string[] = [];
  const errors: string[] = [];

  for (const recipient of recipients) {
    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: subject,
            message: body,
            _template: "box",
            _captcha: "false",
          }),
        },
      );

      const data = (await response.json().catch(() => null)) as {
        success?: string | boolean;
        message?: string;
        error?: string;
      } | null;

      if (!response.ok) {
        errors.push(
          data?.message || data?.error || `Gagal kirim ke ${recipient}`,
        );
        continue;
      }

      results.push(recipient);
    } catch {
      errors.push(`Gagal kirim ke ${recipient}`);
    }
  }

  if (results.length === 0) {
    return {
      ok: false as const,
      error:
        errors[0] ||
        "Gagal mengirim email. Cek inbox untuk aktivasi FormSubmit (email pertama), lalu coba lagi.",
    };
  }

  return {
    ok: true as const,
    recipients: results,
    id: null,
    provider: "formsubmit" as const,
    warning:
      results.length < recipients.length
        ? `Sebagian gagal: ${errors.join("; ")}`
        : undefined,
  };
}

/** Kirim email pengingat (Resend jika ada key, else FormSubmit). */
export async function sendReminderEmailViaResend(input: SendReminderEmailInput) {
  const recipients = normalizeRecipients(input.to);
  if (recipients.length === 0) {
    return { ok: false as const, error: "Email penerima tidak tersedia." };
  }

  const subject = input.subject.trim();
  const body = input.body.trim();
  if (!subject || !body) {
    return { ok: false as const, error: "Pesan pengingat kosong." };
  }

  const viaResend = await sendViaResend(recipients, subject, body);
  if (viaResend) return viaResend;

  return sendViaFormSubmit(recipients, subject, body);
}
