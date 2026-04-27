import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { verifyAdminSession } from "@/lib/admin-auth";
import { encrypt, decrypt } from "@/lib/leads-crypto";
import { rateLimit } from "@/lib/rate-limit";

const LEADS_DIR = path.join(process.cwd(), "src", "data");
const LEADS_FILE = path.join(LEADS_DIR, "leads.json.enc");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LEN = 100;

interface Lead {
  timestamp: string;
  name: string;
  email: string;
  provider: string;
  calculator: string;
  eulaAccepted: boolean;
}

async function readLeads(): Promise<Lead[]> {
  try {
    await fs.access(LEADS_FILE);
  } catch {
    return [];
  }
  const encrypted = await fs.readFile(LEADS_FILE, "utf-8");
  try {
    return JSON.parse(decrypt(encrypted));
  } catch {
    return [];
  }
}

async function writeLeads(leads: Lead[]): Promise<void> {
  await fs.mkdir(LEADS_DIR, { recursive: true });
  await fs.writeFile(LEADS_FILE, encrypt(JSON.stringify(leads)));
}

export async function POST(req: NextRequest) {
  const rateLimitResult = rateLimit(req, { maxRequests: 60, windowMs: 60_000 });
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const { name, email, provider, calculator, eulaAccepted } = body as Lead;

    if (!name || !email || !provider || !calculator) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (name.length > MAX_NAME_LEN) {
      return NextResponse.json({ error: "Name too long" }, { status: 400 });
    }

    if (!eulaAccepted) {
      return NextResponse.json({ error: "EULA must be accepted" }, { status: 400 });
    }

    const leads = await readLeads();
    leads.push({
      timestamp: new Date().toISOString(),
      name,
      email,
      provider,
      calculator,
      eulaAccepted,
    });
    await writeLeads(leads);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await readLeads();
    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ leads: [] });
  }
}