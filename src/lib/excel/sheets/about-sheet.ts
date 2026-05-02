import type { Worksheet } from "exceljs";
import { BRAND, HEADER_FONT, SIENNA_FILL, NAVY_FILL, LABEL_FONT, LINK_FONT } from "../styles";
import { addLink } from "../utils";

const SITE = "https://c7xai.in";

const LINKS = [
  { text: "Home", url: SITE },
  { text: "Methodology", url: `${SITE}/methodology` },
  { text: "Truth Index", url: `${SITE}/truth-index` },
  { text: "Compare Tools", url: `${SITE}/compare` },
  { text: "Blog", url: `${SITE}/blog` },
  { text: "Privacy Policy", url: `${SITE}/privacy` },
  { text: "Terms of Service", url: `${SITE}/terms` },
  { text: "EULA", url: `${SITE}/eula` },
] as const;

export function createAboutSheet(
  ws: Worksheet,
  calculatorName: string,
  calculatorSlug: string
): void {
  ws.columns = [{ width: 30 }, { width: 50 }];

  // Brand header
  const r1 = ws.getRow(1);
  r1.height = 36;
  const hCell = ws.getCell("A1");
  hCell.value = "c7xai";
  hCell.font = { ...HEADER_FONT, size: 20 };
  hCell.fill = SIENNA_FILL;
  ws.mergeCells("A1:B1");

  // Tagline
  ws.getCell("A2").value = "See through the numbers.™";
  ws.getCell("A2").font = { ...LABEL_FONT, italic: true, color: { argb: BRAND.textSecondary } };
  ws.mergeCells("A2:B2");

  // Calculator link
  const r4 = ws.getRow(4);
  r4.height = 20;
  const calcCell = ws.getCell("A4");
  calcCell.value = `This template: ${calculatorName}`;
  calcCell.font = { name: "Calibri", size: 12, bold: true, color: { argb: BRAND.navy } };
  addLink(ws, 5, 1, `Open online →`, `${SITE}/${calculatorSlug}`);

  // Links section
  ws.getCell("A7").value = "Quick Links";
  ws.getCell("A7").font = { name: "Calibri", size: 12, bold: true, color: { argb: BRAND.sienna } };

  LINKS.forEach((link, i) => {
    addLink(ws, 8 + i, 1, link.text, link.url);
  });

  // Footer
  const footerRow = 8 + LINKS.length + 1;
  const fCell = ws.getCell(`A${footerRow}`);
  fCell.value = `Built with ♥ by c7xai · Computed entirely client-side`;
  fCell.font = { name: "Calibri", size: 9, color: { argb: BRAND.textSecondary } };

  const dateCell = ws.getCell(`A${footerRow + 1}`);
  dateCell.value = `Template generated: ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`;
  dateCell.font = { name: "Calibri", size: 9, color: { argb: BRAND.textSecondary } };

  // Disclaimer
  const discRow = footerRow + 3;
  ws.getCell(`A${discRow}`).value = "DISCLAIMER";
  ws.getCell(`A${discRow}`).font = { name: "Calibri", size: 10, bold: true, color: { argb: BRAND.lossRed } };

  ws.mergeCells(`A${discRow + 1}:B${discRow + 1}`);
  const discCell = ws.getCell(`A${discRow + 1}`);
  discCell.value = "This template is for informational purposes only. It does not constitute financial advice. Calculations use RBI 10-year average inflation (6%), current tax slabs, and market data. Verify all numbers at c7xai.in";
  discCell.font = { name: "Calibri", size: 9, color: { argb: BRAND.textSecondary } };
  ws.getRow(discRow + 1).height = 48;
}