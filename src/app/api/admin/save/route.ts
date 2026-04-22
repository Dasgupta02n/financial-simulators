import { NextRequest, NextResponse } from "next/server";
import { saveFile } from "@/lib/github-api";

const ALLOWED_PREFIXES = ["src/content/calculators/", "src/content/blog/"];

export async function POST(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN ?? "";
  if (!token) {
    return NextResponse.json({ error: "GitHub token not configured" }, { status: 500 });
  }

  const { path, content, message } = await req.json();

  if (!path || !content || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Prevent path traversal
  if (path.includes("..") || path.startsWith("/")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  // Only allow writes to content directories
  const isAllowed = ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix));
  if (!isAllowed) {
    return NextResponse.json({ error: "Path not allowed" }, { status: 403 });
  }

  try {
    const success = await saveFile(path, content, message);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}