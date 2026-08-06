import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import type { CopyOverrides } from "@/lib/copy-overrides";
import type { DemoSession } from "@/lib/demo-auth";

const OVERRIDES_PATH = path.join(process.cwd(), "data/copy-overrides.json");

function isAdminSession(value: unknown): value is DemoSession {
  if (!value || typeof value !== "object") return false;
  const session = value as DemoSession;
  return session.role === "admin" && typeof session.username === "string";
}

async function readOverridesFile(): Promise<CopyOverrides> {
  try {
    const raw = await readFile(OVERRIDES_PATH, "utf8");
    const parsed = JSON.parse(raw) as CopyOverrides;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export async function GET() {
  const overrides = await readOverridesFile();
  return NextResponse.json({ overrides });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      session?: DemoSession;
      overrides?: CopyOverrides;
    };

    if (!isAdminSession(body.session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!body.overrides || typeof body.overrides !== "object") {
      return NextResponse.json({ error: "Invalid overrides" }, { status: 400 });
    }

    const sanitized: CopyOverrides = {};
    for (const [key, value] of Object.entries(body.overrides)) {
      if (typeof value === "string") sanitized[key] = value;
    }

    await writeFile(OVERRIDES_PATH, `${JSON.stringify(sanitized, null, 2)}\n`, "utf8");

    return NextResponse.json({ ok: true, count: Object.keys(sanitized).length });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as { session?: DemoSession };
    if (!isAdminSession(body.session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await writeFile(OVERRIDES_PATH, "{}\n", "utf8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to reset" }, { status: 500 });
  }
}
