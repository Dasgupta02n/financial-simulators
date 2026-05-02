import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  const calculatorId = searchParams.get("calculatorId")?.trim();

  if (!email || !calculatorId) {
    return NextResponse.json(
      { error: "Missing email or calculatorId" },
      { status: 400 }
    );
  }

  try {
    const prisma = getPrismaClient();
    const lead = await prisma.lead.findFirst({
      where: { email, calculatorId },
      select: { id: true, eulaAccepted: true, createdAt: true },
    });

    return NextResponse.json({
      registered: !!lead,
      eulaAccepted: lead?.eulaAccepted ?? false,
      registeredAt: lead?.createdAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("Excel verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}