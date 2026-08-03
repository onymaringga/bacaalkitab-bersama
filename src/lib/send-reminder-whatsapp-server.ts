import { buildWhatsAppDeepLink, toWhatsAppPhone } from "@/lib/phone";

export type SendReminderWhatsAppInput = {
  to: string | string[];
  body: string;
  kind?: "daily" | "manual";
};

function normalizePhones(to: string | string[]) {
  const list = (Array.isArray(to) ? to : [to])
    .map((item) => toWhatsAppPhone(item))
    .filter(Boolean);
  return [...new Set(list)];
}

async function sendViaCloudApi(phones: string[], body: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  if (!token || !phoneNumberId) return null;

  const sent: string[] = [];
  const errors: string[] = [];

  for (const phone of phones) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: phone,
            type: "text",
            text: { preview_url: false, body },
          }),
        },
      );

      const data = (await response.json().catch(() => null)) as {
        error?: { message?: string };
        messages?: { id?: string }[];
      } | null;

      if (!response.ok) {
        errors.push(
          data?.error?.message || `Gagal kirim WhatsApp ke +${phone}`,
        );
        continue;
      }

      sent.push(phone);
    } catch {
      errors.push(`Gagal kirim WhatsApp ke +${phone}`);
    }
  }

  if (sent.length === 0) {
    return {
      ok: false as const,
      error: errors[0] || "Gagal mengirim WhatsApp.",
    };
  }

  return {
    ok: true as const,
    recipients: sent.map((phone) => `+${phone}`),
    mode: "api" as const,
    warning:
      sent.length < phones.length ? errors.filter(Boolean).join("; ") : undefined,
  };
}

/** Kirim pengingat WhatsApp (Cloud API jika ada, else deep link wa.me). */
export async function sendReminderWhatsAppServer(
  input: SendReminderWhatsAppInput,
) {
  const phones = normalizePhones(input.to);
  if (phones.length === 0) {
    return {
      ok: false as const,
      error: "Nomor WhatsApp penerima tidak valid. Isi nomor HP di biodata.",
    };
  }

  const body = input.body.trim();
  if (!body) {
    return { ok: false as const, error: "Pesan pengingat kosong." };
  }

  const viaApi = await sendViaCloudApi(phones, body);
  if (viaApi) return viaApi;

  // Tanpa Cloud API: kembalikan deep link supaya client buka WhatsApp.
  const deepLinks = phones.map((phone) => ({
    phone: `+${phone}`,
    url: buildWhatsAppDeepLink(phone, body),
  }));

  return {
    ok: true as const,
    recipients: deepLinks.map((item) => item.phone),
    mode: "deeplink" as const,
    deepLinks,
  };
}
