import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = auth ? toNextJsHandler(auth) : null;

export async function GET(request: Request) {
  if (!handler?.GET) {
    return NextResponse.json(
      { error: "Auth belum dikonfigurasi. Set DATABASE_URL di .env" },
      { status: 503 },
    );
  }
  return handler.GET(request);
}

export async function POST(request: Request) {
  if (!handler?.POST) {
    return NextResponse.json(
      { error: "Auth belum dikonfigurasi. Set DATABASE_URL di .env" },
      { status: 503 },
    );
  }
  return handler.POST(request);
}
