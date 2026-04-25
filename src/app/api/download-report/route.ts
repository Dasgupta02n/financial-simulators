import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY ?? "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, calculatorTitle, calculatorData, eulaAccepted } = body as {
      name: string;
      email: string;
      calculatorTitle: string;
      calculatorData: Record<string, string>;
      eulaAccepted: boolean;
    };

    if (!name || !email || !calculatorTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!eulaAccepted) {
      return NextResponse.json({ error: "EULA must be accepted" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json({
        success: true,
        message: "Report captured (email not configured — RESEND_API_KEY missing)",
      });
    }

    // Build a simple text report
    const reportLines = [
      `c7xai — ${calculatorTitle} Report`,
      "=".repeat(40),
      "",
      `Generated for: ${name} (${email})`,
      `Date: ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
      "",
      "Results:",
      ...Object.entries(calculatorData).map(([key, value]) => `  ${key}: ${value}`),
      "",
      "---",
      "This report is for informational purposes only. It does not constitute financial advice.",
      "Calculations use RBI 10-year average inflation (6%), current tax slabs, and market data.",
      "Verify all numbers at c7xai.in",
    ];

    const reportText = reportLines.join("\n");

    const { data, error } = await getResendClient().emails.send({
      from: "c7xai Reports <reports@c7xai.in>",
      to: [email],
      subject: `Your ${calculatorTitle} Report — c7xai`,
      text: reportText,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h1 style="font-size: 20px; margin-bottom: 4px;">c7xai — ${calculatorTitle}</h1>
          <p style="color: #666; font-size: 14px; margin-bottom: 24px;">Your personalized report</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${Object.entries(calculatorData)
              .map(
                ([key, value]) =>
                  `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">${key}</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${value}</td></tr>`
              )
              .join("")}
          </table>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            This report is for informational purposes only. Calculations use RBI 10-year average inflation (6%), current tax slabs, and market data.<br/>
            Verify all numbers at <a href="https://c7xai.in" style="color: #D8400E;">c7xai.in</a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error("Download report error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}