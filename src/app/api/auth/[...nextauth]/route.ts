import { NextRequest, NextResponse } from "next/server";

const hasAnyProvider = !!(process.env.AUTH_GITHUB_ID || process.env.AUTH_GOOGLE_ID);

export async function GET(req: NextRequest) {
  if (!hasAnyProvider) {
    return NextResponse.json({});
  }
  const { handlers } = await import("@/lib/auth");
  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  if (!hasAnyProvider) {
    return NextResponse.json({ error: "No OAuth configured" }, { status: 503 });
  }
  const { handlers } = await import("@/lib/auth");
  return handlers.POST(req);
}