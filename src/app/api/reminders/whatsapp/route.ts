import { NextResponse } from "next/server";

import { sendReminderWhatsAppServer } from "@/lib/send-reminder-whatsapp-server";

export const runtime = "nodejs";

type Body = {
  to?: string | string[];
  body?: string;
  kind?: "daily" | "manual";
};

export async function GET() {
  const configured = Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN?.trim() &&
      process.env.WHATSAPP_PHONE_NUMBER_ID?.trim(),
  );
  return NextResponse.json({
    configured,
    mode: configured ? "api" : "deeplink",
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

  const result = await sendReminderWhatsAppServer({
    to: payload.to ?? [],
    body: payload.body ?? "",
    kind: payload.kind,
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
