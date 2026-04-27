import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { saveFile } from "@/lib/github-api";
import { verifyAdminSession } from "@/lib/admin-auth";

const ALLOWED_PREFIXES = ["src/content/calculators/", "src/content/blog/"];

function validatePath(filePath: string): boolean {
  // Double-decode to catch encoded traversal sequences
  let decoded = filePath;
  for (let i = 0; i < 2; i++) {
    try { decoded = decodeURIComponent(decoded); } catch { return false; }
  }

  // Reject null bytes
  if (decoded.includes("\0")) return false;

  // Normalize and verify no traversal above base
  const normalized = path.posix.normalize(decoded);
  if (normalized.startsWith("/") || normalized.includes("..")) return false;

  // Must match an allowed prefix
  return ALLOWED_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN ?? "";
  if (!token) {
    return NextResponse.json({ error: "GitHub token not configured" }, { status: 500 });
  }

  const { path, content, message } = await req.json();

  if (!path || !content || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!validatePath(path)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 403 });
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