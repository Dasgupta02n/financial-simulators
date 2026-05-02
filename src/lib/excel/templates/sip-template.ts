import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, SIENNA_FILL, NAVY_FILL, FORMATS, HEADER_FONT, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink, autoWidth } from "../utils";

function sipTemplate(ws: Worksheet, name: string): void {
  // Brand header
  addBrandHeader(ws, name);
  ws.mergeCells("A1:D1");

  // Link to online version
  addLink(ws, 2, 1, `Open online →`, "https://c7xai.in/sip-simulator");

  // Input section
  const inputStart = 4;
  ws.getCell(`A${inputStart}`).value = "INPUTS";
  ws.getCell(`A${inputStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Monthly SIP (₹)", default: 10000, format: FORMATS.currency, cell: "B6" },
    { label: "Lumpsum (₹)", default: 0, format: FORMATS.currency, cell: "B7" },
    { label: "Expected Return (%)", default: 12, format: FORMATS.percentWhole, cell: "B8" },
    { label: "Tenure (years)", default: 15, format: FORMATS.year, cell: "B9" },
    { label: "Inflation (%)", default: 6, format: FORMATS.percentWhole, cell: "B10" },
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

  // Output section
  const outputStart = inputStart + inputs.length + 2;
  ws.getCell(`A${outputStart}`).value = "OUTPUTS";
  ws.getCell(`A${outputStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const outputs = [
    { label: "Total Invested", formula: "B6*B9*12+B7", format: FORMATS.currency },
    { label: "Nominal Corpus", formula: "FV(B8/100/12,B9*12,-B6,-B7)", format: FORMATS.currency },
    { label: "Post-Tax Corpus (LTCG 12.5% above ₹1.25L)", formula: "IF((FV(B8/100/12,B9*12,-B6,-B7)-(B6*B9*12+B7))<=125000,FV(B8/100/12,B9*12,-B6,-B7),FV(B8/100/12,B9*12,-B6,-B7)-((FV(B8/100/12,B9*12,-B6,-B7)-(B6*B9*12+B7)-125000)*0.125))", format: FORMATS.currency },
    { label: "Real Corpus (inflation-adjusted)", formula: "IF((FV(B8/100/12,B9*12,-B6,-B7)-(B6*B9*12+B7))<=125000,FV(B8/100/12,B9*12,-B6,-B7),FV(B8/100/12,B9*12,-B6,-B7)-((FV(B8/100/12,B9*12,-B6,-B7)-(B6*B9*12+B7)-125000)*0.125))/(1+B10/100)^B9", format: FORMATS.currency },
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

  // Yearly breakdown header
  const yearlyStart = outputStart + outputs.length + 2;
  ws.getCell(`A${yearlyStart}`).value = "YEARLY BREAKDOWN";
  ws.getCell(`A${yearlyStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const yearlyHeaders = ["Year", "Invested", "Nominal Value", "Real Value"];
  yearlyHeaders.forEach((h, i) => {
    const cell = ws.getCell(yearlyStart + 1, i + 1);
    cell.value = h;
    cell.font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.white } };
    cell.fill = NAVY_FILL;
  });

  // Yearly data formulas (15 years by default, referencing B9)
  for (let y = 1; y <= 20; y++) {
    const row = yearlyStart + 1 + y;
    ws.getCell(row, 1).value = y;
    ws.getCell(row, 1).font = VALUE_FONT;

    // Invested = monthly * years * 12 + lumpsum
    ws.getCell(row, 2).value = { formula: `B6*${y}*12+B7` };
    ws.getCell(row, 2).numFmt = FORMATS.currency;

    // Nominal value = FV
    ws.getCell(row, 3).value = { formula: `FV(B8/100/12,${y}*12,-B6,-B7)` };
    ws.getCell(row, 3).numFmt = FORMATS.currency;

    // Real value = nominal / (1+inflation)^years
    ws.getCell(row, 4).value = { formula: `FV(B8/100/12,${y}*12,-B6,-B7)/(1+B10/100)^${y}` };
    ws.getCell(row, 4).numFmt = FORMATS.currency;
  }

  // Column widths
  ws.getColumn(1).width = 30;
  ws.getColumn(2).width = 20;
  ws.getColumn(3).width = 20;
  ws.getColumn(4).width = 20;
}

export function registerSipTemplate(): void {
  registerTemplate("sip", sipTemplate);
}