import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

const AUTH_SECRET = process.env.AUTH_SECRET ?? "";

function getSecret(): Buffer {
  if (!AUTH_SECRET) throw new Error("AUTH_SECRET not configured");
  return Buffer.from(AUTH_SECRET, "hex");
}

export function generateSessionToken(): string {
  const sessionId = randomBytes(32).toString("hex");
  const hmac = createHmac("sha256", getSecret()).update(sessionId).digest("hex");
  return `${sessionId}:${hmac}`;
}

export function signToken(sessionId: string): string {
  return createHmac("sha256", getSecret()).update(sessionId).digest("hex");
}

export function verifyAdminSession(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_session");
  if (!cookie?.value) return false;

  const parts = cookie.value.split(":");
  if (parts.length !== 2) return false;

  const [sessionId, providedHmac] = parts;
  const expectedHmac = signToken(sessionId);

  const provided = Buffer.from(providedHmac, "hex");
  const expected = Buffer.from(expectedHmac, "hex");

  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}