import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const rateLimitResult = rateLimit(req, { maxRequests: 5, windowMs: 60_000 });
  if (rateLimitResult) return rateLimitResult;

  const body = await req.json().catch(() => ({}));
  const secret = body.secret;

  const validSecret = process.env.REVALIDATE_SECRET;
  if (!validSecret || secret !== validSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  // Revalidate all static pages
  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}