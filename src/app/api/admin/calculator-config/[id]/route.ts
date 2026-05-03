import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyAdminSession } from "@/lib/admin-auth";

const CALCULATOR_IDS = [
  "sip", "emi", "tax", "accum", "fd", "swp", "fire", "ctc", "nps", "goal",
  "ppf", "epf", "hra", "salary", "gst", "compound", "simple-interest",
  "step-up-sip", "term-insurance", "crypto", "depreciation", "forex",
  "planner", "real-estate",
];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminSession(req)) {
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