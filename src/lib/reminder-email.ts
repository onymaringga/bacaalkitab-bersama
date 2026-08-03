/** Pengiriman pengingat via email (client → API Resend + outbox lokal). */

const OUTBOX_KEY = "bacaalkitab-reminder-email-outbox";

export type ReminderEmailPayload = {
  to: string | string[];
  subject: string;
  body: string;
  kind?: "daily" | "manual";
};

export type ReminderEmailRecord = {
  id: string;
  to: string[];
  subject: string;
  body: string;
  kind: "daily" | "manual";
  sentAt: string;
};

function normalizeRecipients(to: string | string[]) {
  const list = (Array.isArray(to) ? to : [to])
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set(list)];
}

function readOutbox(): ReminderEmailRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(OUTBOX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as ReminderEmailRecord[]) : [];
  } catch {
    return [];
  }
}

function writeOutbox(records: ReminderEmailRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OUTBOX_KEY, JSON.stringify(records.slice(0, 40)));
  window.dispatchEvent(new Event("reminder-email-sent"));
}

function appendOutbox(
  recipients: string[],
  payload: ReminderEmailPayload,
  id?: string | null,
) {
  const record: ReminderEmailRecord = {
    id: id || `mail-${Date.now()}`,
    to: recipients,
    subject: payload.subject.trim(),
    body: payload.body.trim(),
    kind: payload.kind ?? "manual",
    sentAt: new Date().toISOString(),
  };
  writeOutbox([record, ...readOutbox()]);
}

/** Kirim pengingat ke email penerima lewat API server. */
export async function sendReminderEmail(
  payload: ReminderEmailPayload,
): Promise<{ ok: true; recipients: string[] } | { ok: false; error: string }> {
  const recipients = normalizeRecipients(payload.to);
  if (recipients.length === 0) {
    return { ok: false, error: "Email penerima tidak tersedia." };
  }

  const subject = payload.subject.trim();
  const body = payload.body.trim();
  if (!subject || !body) {
    return { ok: false, error: "Pesan pengingat kosong." };
  }

  try {
    const response = await fetch("/api/reminders/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: recipients,
        subject,
        body,
        kind: payload.kind ?? "manual",
      }),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok: true; recipients: string[]; id?: string | null }
      | { ok: false; error?: string }
      | null;

    if (!response.ok || !data || data.ok !== true) {
      return {
        ok: false,
        error:
          data && "error" in data && data.error
            ? data.error
            : "Gagal mengirim email. Coba lagi sebentar.",
      };
    }

    appendOutbox(data.recipients, payload, data.id);
    return { ok: true, recipients: data.recipients };
  } catch {
    return {
      ok: false,
      error: "Tidak bisa menghubungi server email. Periksa koneksi lalu coba lagi.",
    };
  }
}

export function getReminderEmailOutbox() {
  return readOutbox();
}

export function formatReminderRecipientsLabel(recipients: string[]) {
  if (recipients.length === 0) return "";
  if (recipients.length === 1) return recipients[0];
  if (recipients.length === 2) return `${recipients[0]} dan ${recipients[1]}`;
  return `${recipients[0]} (+${recipients.length - 1} lainnya)`;
}
