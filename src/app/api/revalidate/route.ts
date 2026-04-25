import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const secret = body.secret;

  const validSecret = process.env.REVALIDATE_SECRET;
  if (!validSecret || secret !== validSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  // Revalidate all static pages
  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}