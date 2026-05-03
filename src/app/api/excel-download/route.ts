import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { generateWorkbook } from "@/lib/excel/generate-workbook";
import { lookupCalculator } from "@/lib/excel/calculator-lookup";
import { sendExcelEmail } from "@/lib/email/sendgrid";
import { getPrismaClient } from "@/lib/prisma";

const VALID_IDS = new Set([
  "sip", "emi", "tax", "fire", "fd", "hra", "ctc", "goal", "swp",
  "nps", "ppf", "accum", "compound", "simpleInterest", "stepUpSip",
  "salary", "gst", "realEstate", "crypto", "forex", "depreciation",
  "termInsurance", "epf", "planner",
]);

export async function POST(req: NextRequest) {
  const rateLimitResult = rateLimit(req, { maxRequests: 5, windowMs: 60_000 });
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const {
      firstName,
      surname,
      email,
      city,
      country,
      calculatorId,
      locale = "en",
      eulaAccepted,
    } = body as {
      firstName: string;
      surname: string;
      email: string;
      city?: string;
      country?: string;
      calculatorId: string;
      locale?: string;
      eulaAccepted: boolean;
    };

    if (!firstName?.trim() || !surname?.trim() || !email?.trim() || !calculatorId) {
      return NextResponse.json(
        { error: "Missing required fields: firstName, surname, email, calculatorId" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!eulaAccepted) {
      return NextResponse.json({ error: "EULA must be accepted" }, { status: 400 });
    }

    if (!VALID_IDS.has(calculatorId)) {
      return NextResponse.json({ error: "Invalid calculatorId" }, { status: 400 });
    }

    // Save lead to database
    try {
      const prisma = getPrismaClient();
      await prisma.lead.create({
        data: {
          firstName: firstName.trim(),
          surname: surname.trim(),
          email: email.trim().toLowerCase(),
          city: city?.trim() || null,
          country: country?.trim() || null,
          calculatorId,
          locale,
          eulaAccepted: true,
        },
      });
    } catch (dbError) {
      console.error("Lead save error (non-fatal):", dbError);
    }

    // Lookup calculator metadata
    const lookup = lookupCalculator(calculatorId);
    const calculatorName = lookup?.name ?? calculatorId;
    const calculatorSlug = lookup?.slug ?? calculatorId;

    // Generate Excel workbook
    const buffer = await generateWorkbook({
      calculatorId,
      calculatorName,
      calculatorSlug,
      email: email.trim().toLowerCase(),
      locale,
    });

    const fileName = `c7xai-${calculatorId}-template.xlsx`;

    // Send email with attachment
    const sendgridKey = process.env.SENDGRID_API_KEY;
    if (sendgridKey) {
      try {
        await sendExcelEmail({
          to: email.trim().toLowerCase(),
          calculatorName,
          buffer,
          fileName,
          firstName: firstName.trim(),
        });
      } catch (emailError) {
        console.error("SendGrid error:", emailError);
        return NextResponse.json(
          { error: "Failed to send email. Please try again." },
          { status: 500 }
        );
      }
    } else {
      console.warn("SENDGRID_API_KEY not set — skipping email delivery");
    }

    return NextResponse.json({
      success: true,
      message: sendgridKey
        ? "Excel template sent to your email!"
        : "Lead captured (email not configured)",
    });
  } catch (error) {
    console.error("Excel download error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}