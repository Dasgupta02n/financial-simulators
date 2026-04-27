import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { generateSessionToken } from "@/lib/admin-auth";

const attempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(req: NextRequest) {
  const clientKey = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";

  const record = attempts.get(clientKey);
  if (record) {
    const elapsed = Date.now() - record.lastAttempt;
    if (elapsed < WINDOW_MS && record.count >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }
    if (elapsed >= WINDOW_MS) {
      attempts.delete(clientKey);
    }
  }

  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!adminPassword) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
  }

  const { password } = await req.json();

  if (safeEqual(password, adminPassword)) {
    attempts.delete(clientKey);
    const sessionToken = generateSessionToken();
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400,
      path: "/",
    });
    return response;
  }

  const current = attempts.get(clientKey);
  attempts.set(clientKey, {
    count: (current?.count ?? 0) + 1,
    lastAttempt: Date.now(),
  });

  return NextResponse.json({ authenticated: false }, { status: 401 });
}