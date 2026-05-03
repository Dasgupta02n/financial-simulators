import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = getAllPosts();
  return NextResponse.json({ posts });
}