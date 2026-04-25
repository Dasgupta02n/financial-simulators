import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const LEADS_DIR = path.join(process.cwd(), "src", "data");
const LEADS_FILE = path.join(LEADS_DIR, "leads.json");

interface Lead {
  timestamp: string;
  name: string;
  email: string;
  provider: string;
  calculator: string;
  eulaAccepted: boolean;
}

async function ensureLeadsFile() {
  try {
    await fs.access(LEADS_FILE);
  } catch {
    await fs.mkdir(LEADS_DIR, { recursive: true });
    await fs.writeFile(LEADS_FILE, "[]");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, provider, calculator, eulaAccepted } = body as Lead;

    if (!name || !email || !provider || !calculator) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!eulaAccepted) {
      return NextResponse.json({ error: "EULA must be accepted" }, { status: 400 });
    }

    await ensureLeadsFile();

    const leads: Lead[] = JSON.parse(await fs.readFile(LEADS_FILE, "utf-8"));
    leads.push({
      timestamp: new Date().toISOString(),
      name,
      email,
      provider,
      calculator,
      eulaAccepted,
    });

    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Admin-only: return leads CSV
  const authHeader = req.headers.get("authorization");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureLeadsFile();
    const leads: Lead[] = JSON.parse(await fs.readFile(LEADS_FILE, "utf-8"));

    // Return as JSON (admin CMS can convert to CSV)
    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ leads: [] });
  }
}