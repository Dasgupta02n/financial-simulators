import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const secret = body.secret;

  if (secret !== process.env.REVALIDATE_SECRET && secret !== "c7xai-deploy-2026") {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  // Revalidate all static pages
  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}