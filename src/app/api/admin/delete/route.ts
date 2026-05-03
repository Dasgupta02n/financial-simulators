import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { deleteFile } from "@/lib/github-api";
import { verifyAdminSession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

const ALLOWED_PREFIXES = ["src/content/calculators/", "src/content/blog/"];

function validatePath(filePath: string): boolean {
  let decoded = filePath;
  for (let i = 0; i < 2; i++) {
    try { decoded = decodeURIComponent(decoded); } catch { return false; }
  }

  if (decoded.includes("\0")) return false;

  const normalized = path.posix.normalize(decoded);
  if (normalized.startsWith("/") || normalized.includes("..")) return false;

  return ALLOWED_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN ?? "";
  if (!token) {
    return NextResponse.json({ error: "GitHub token not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("path");

  if (!filePath || !validatePath(filePath)) {
    return NextResponse.json({ error: "Invalid or missing path" }, { status: 400 });
  }

  try {
    const success = await deleteFile(filePath, `chore(blog): delete ${path.basename(filePath)}`);
    if (success) {
      revalidatePath("/blog", "layout");
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "File not found or delete failed" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}