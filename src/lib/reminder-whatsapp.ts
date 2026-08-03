/** Client helper pengingat WhatsApp. */

export type ReminderWhatsAppPayload = {
  to: string | string[];
  body: string;
  kind?: "daily" | "manual";
};

export type ReminderWhatsAppResult =
  | {
      ok: true;
      recipients: string[];
      mode: "api" | "deeplink";
      deepLinks?: { phone: string; url: string }[];
      warning?: string;
    }
  | { ok: false; error: string };

export async function sendReminderWhatsApp(
  payload: ReminderWhatsAppPayload,
): Promise<ReminderWhatsAppResult> {
  const to = (
    Array.isArray(payload.to) ? payload.to : [payload.to]
  )
    .map((item) => item.trim())
    .filter(Boolean);

  if (to.length === 0) {
    return { ok: false, error: "Nomor WhatsApp penerima tidak tersedia." };
  }

  const body = payload.body.trim();
  if (!body) {
    return { ok: false, error: "Pesan pengingat kosong." };
  }

  try {
    const response = await fetch("/api/reminders/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        body,
        kind: payload.kind ?? "manual",
      }),
    });

    const data = (await response.json().catch(() => null)) as
      | ReminderWhatsAppResult
      | null;

    if (!response.ok || !data || data.ok !== true) {
      return {
        ok: false,
        error:
          data && "error" in data && data.error
            ? data.error
            : "Gagal mengirim WhatsApp. Coba lagi sebentar.",
      };
    }

    if (data.mode === "deeplink" && data.deepLinks?.length) {
      // Buka chat WhatsApp (satu penerima langsung; multi → buka yang pertama).
      const first = data.deepLinks[0];
      if (first?.url && typeof window !== "undefined") {
        window.open(first.url, "_blank", "noopener,noreferrer");
      }
    }

    return data;
  } catch {
    return {
      ok: false,
      error: "Tidak bisa menghubungi server WhatsApp. Periksa koneksi.",
    };
  }
}
