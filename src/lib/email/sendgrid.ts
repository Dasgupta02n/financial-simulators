import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

interface SendExcelEmailOptions {
  to: string;
  calculatorName: string;
  buffer: Buffer;
  fileName: string;
  firstName: string;
}

export async function sendExcelEmail(opts: SendExcelEmailOptions): Promise<void> {
  const { to, calculatorName, buffer, fileName, firstName } = opts;

  const html = `
<div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
  <div style="background: #D8400E; padding: 16px 20px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #fff; font-size: 20px; margin: 0;">c7xai — ${calculatorName}</h1>
  </div>
  <div style="background: #fff; border: 1px solid #eee; border-top: none; padding: 20px; border-radius: 0 0 8px 8px;">
    <p style="font-size: 15px; margin: 0 0 16px;">Hi ${firstName},</p>
    <p style="font-size: 14px; color: #444; margin: 0 0 16px;">
      Your fully functional <strong>${calculatorName}</strong> Excel template is attached.
      It works offline with live formulas — no internet needed.
    </p>
    <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-bottom: 16px;">
      <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #888;">File</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${fileName}</td></tr>
      <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #888;">Sheets</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">Calculator · Registration · About</td></tr>
      <tr><td style="padding: 8px 0; color: #888;">Format</td><td style="padding: 8px 0; text-align: right;">Excel (.xlsx)</td></tr>
    </table>
    <p style="font-size: 12px; color: #999; margin: 0;">
      For informational purposes only. Verify all numbers at
      <a href="https://c7xai.in" style="color: #D8400E;">c7xai.in</a>
    </p>
  </div>
</div>`;

  const msg = {
    to,
    from: "c7xai Excel <excel@c7xai.in>",
    subject: `Your ${calculatorName} Excel Template — c7xai`,
    html,
    attachments: [
      {
        content: buffer.toString("base64"),
        filename: fileName,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        disposition: "attachment" as const,
      },
    ],
  };

  await sgMail.send(msg);
}