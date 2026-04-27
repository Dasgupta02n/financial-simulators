import { NextRequest, NextResponse } from "next/server";

const windows = new Map<string, { count: number; start: number }>();

export function rateLimit(
  req: NextRequest,
  opts: { maxRequests: number; windowMs: number }
): NextResponse | null {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const now = Date.now();
  const entry = windows.get(ip);

  if (entry && now - entry.start < opts.windowMs) {
    entry.count++;
    if (entry.count > opts.maxRequests) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }
  } else {
    windows.set(ip, { count: 1, start: now });
  }

  // Prune stale entries periodically
  if (windows.size > 10_000) {
    for (const [key, val] of windows) {
      if (now - val.start >= opts.windowMs) windows.delete(key);
    }
  }

  return null;
}