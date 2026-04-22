import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function isAuthenticated(req: NextRequest): boolean {
  const session = req.cookies.get("admin_session");
  return session?.value === "1";
}

const CALCULATOR_IDS = ["sip", "emi", "tax", "accum", "fd", "swp", "fire", "ctc", "nps", "goal"];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!CALCULATOR_IDS.includes(id)) {
    return NextResponse.json({ error: "Invalid calculator ID" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "src/content/calculators", `${id}.json`);
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ error: "Config not found" }, { status: 404 });
  }
}