import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, SIENNA_FILL, NAVY_FILL, FORMATS, HEADER_FONT, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function emiTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/emi-analyzer");

  const inputStart = 4;
  ws.getCell(`A${inputStart}`).value = "INPUTS";
  ws.getCell(`A${inputStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Loan Amount (₹)", default: 5000000, format: FORMATS.currency },
    { label: "Interest Rate (% p.a.)", default: 8.5, format: FORMATS.percentDecimal },
    { label: "Tenure (years)", default: 20, format: FORMATS.year },
    { label: "Extra Monthly Payment (₹)", default: 0, format: FORMATS.currency },
    { label: "SIP Return Rate (%)", default: 12, format: FORMATS.percentWhole },
    { label: "Inflation (%)", default: 6, format: FORMATS.percentWhole },
  ];

  inputs.forEach((inp, i) => {
    const row = inputStart + 1 + i;
    ws.getCell(`A${row}`).value = inp.label;
    ws.getCell(`A${row}`).font = LABEL_FONT;
    const vCell = ws.getCell(`B${row}`);
    vCell.value = inp.default;
    vCell.font = VALUE_FONT;
    vCell.fill = INPUT_FILL;
    if (inp.format) vCell.numFmt = inp.format;
  });

  // B5=Loan, B6=Rate, B7=Tenure, B8=Extra, B9=SIP Rate, B10=Inflation
  const outputStart = inputStart + inputs.length + 2;
  ws.getCell(`A${outputStart}`).value = "OUTPUTS";
  ws.getCell(`A${outputStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const outputs = [
    { label: "Monthly EMI", formula: "PMT(B6/100/12,B7*12,-B5)", format: FORMATS.currency },
    { label: "Total Interest", formula: "PMT(B6/100/12,B7*12,-B5)*B7*12-B5", format: FORMATS.currency },
    { label: "Total Payment", formula: "PMT(B6/100/12,B7*12,-B5)*B7*12", format: FORMATS.currency },
  ];

  outputs.forEach((out, i) => {
    const row = outputStart + 1 + i;
    ws.getCell(`A${row}`).value = out.label;
    ws.getCell(`A${row}`).font = LABEL_FONT;
    const vCell = ws.getCell(`B${row}`);
    vCell.value = { formula: out.formula };
    vCell.font = { ...VALUE_FONT, bold: true, color: { argb: BRAND.sienna } };
    if (out.format) vCell.numFmt = out.format;
  });

  // Amortization header
  const amortStart = outputStart + outputs.length + 2;
  ws.getCell(`A${amortStart}`).value = "AMORTIZATION SCHEDULE (first 12 months)";
  ws.getCell(`A${amortStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const amortHeaders = ["Month", "EMI", "Principal", "Interest", "Outstanding"];
  amortHeaders.forEach((h, i) => {
    const cell = ws.getCell(amortStart + 1, i + 1);
    cell.value = h;
    cell.font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.white } };
    cell.fill = NAVY_FILL;
  });

  for (let m = 1; m <= 12; m++) {
    const row = amortStart + 1 + m;
    ws.getCell(row, 1).value = m;
    // EMI
    ws.getCell(row, 2).value = { formula: "PMT(B6/100/12,B7*12,-B5)" };
    ws.getCell(row, 2).numFmt = FORMATS.currency;
    // Principal portion (simplified - use PPMT)
    ws.getCell(row, 3).value = { formula: `PPMT(B6/100/12,${m},B7*12,-B5)` };
    ws.getCell(row, 3).numFmt = FORMATS.currency;
    // Interest portion (use IPMT)
    ws.getCell(row, 4).value = { formula: `IPMT(B6/100/12,${m},B7*12,-B5)` };
    ws.getCell(row, 4).numFmt = FORMATS.currency;
    // Outstanding balance
    ws.getCell(row, 5).value = { formula: `FV(B6/100/12,${m},PMT(B6/100/12,B7*12,-B5),-B5)*(-1)` };
    ws.getCell(row, 5).numFmt = FORMATS.currency;
  }

  ws.getColumn(1).width = 30;
  ws.getColumn(2).width = 20;
  ws.getColumn(3).width = 18;
  ws.getColumn(4).width = 18;
  ws.getColumn(5).width = 20;
}

export function registerEmiTemplate(): void {
  registerTemplate("emi", emiTemplate);
}