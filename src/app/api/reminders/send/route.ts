import { NextResponse } from "next/server";

import { sendReminderEmailViaResend } from "@/lib/send-reminder-email-server";

export const runtime = "nodejs";

type Body = {
  to?: string | string[];
  subject?: string;
  body?: string;
  kind?: "daily" | "manual";
};

export async function GET() {
  return NextResponse.json({
    configured: true,
    provider: process.env.RESEND_API_KEY?.trim() ? "resend" : "formsubmit",
    from:
      process.env.REMINDER_EMAIL_FROM?.trim() ||
      "Baca Alkitab Bersama <onboarding@resend.dev>",
  });
}

export async function POST(request: Request) {
  let payload: Body;
  try {
    payload = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Permintaan tidak valid." },
      { status: 400 },
    );
  }

  const result = await sendReminderEmailViaResend({
    to: payload.to ?? [],
    subject: payload.subject ?? "",
    body: payload.body ?? "",
    kind: payload.kind,
  });

  if (!result.ok) {
    const status = result.error.includes("belum dikonfigurasi") ? 503 : 400;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result);
}
