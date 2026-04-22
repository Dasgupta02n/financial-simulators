import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

function isAuthenticated(req: NextRequest): boolean {
  const session = req.cookies.get("admin_session");
  return session?.value === "1";
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = getAllPosts();
  return NextResponse.json({ posts });
}