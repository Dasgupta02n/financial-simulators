import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, SIENNA_FILL, NAVY_FILL, FORMATS, HEADER_FONT, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function taxTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  ws.mergeCells("A1:D1");
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/tax-sandbox");

  const inputStart = 4;
  ws.getCell(`A${inputStart}`).value = "INPUTS";
  ws.getCell(`A${inputStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Gross Salary (₹)", default: 1500000, format: FORMATS.currency },
    { label: "Section 80C Deductions (₹)", default: 150000, format: FORMATS.currency },
    { label: "Section 80D Deductions (₹)", default: 25000, format: FORMATS.currency },
    { label: "HRA Exemption (₹)", default: 0, format: FORMATS.currency },
    { label: "NPS 80CCD(1B) (₹)", default: 0, format: FORMATS.currency },
    { label: "Other Deductions (₹)", default: 0, format: FORMATS.currency },
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

  // B5=Salary, B6=80C, B7=80D, B8=HRA, B9=NPS, B10=Other
  const outputStart = inputStart + inputs.length + 2;
  ws.getCell(`A${outputStart}`).value = "NEW REGIME (FY 2024-25)";
  ws.getCell(`A${outputStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const newRegimeOutputs = [
    { label: "Taxable Income", formula: "B5-75000", format: FORMATS.currency },
    { label: "Tax (New Regime)", formula: "IF(B5-75000<=3000000,(B5-75000-2500000)*0.05+IF(B5-75000>2000000,(MIN(B5-75000,3000000)-2000000)*0.1,0)+IF(B5-75000>1000000,(MIN(B5-75000,2000000)-1000000)*0.05,0),0)", format: FORMATS.currency },
  ];

  let row = outputStart + 1;
  for (const out of newRegimeOutputs) {
    ws.getCell(`A${row}`).value = out.label;
    ws.getCell(`A${row}`).font = LABEL_FONT;
    const vCell = ws.getCell(`B${row}`);
    vCell.value = { formula: out.formula };
    vCell.font = { ...VALUE_FONT, bold: true, color: { argb: BRAND.sienna } };
    if (out.format) vCell.numFmt = out.format;
    row++;
  }

  // Old Regime section
  row += 1;
  ws.getCell(`A${row}`).value = "OLD REGIME";
  ws.getCell(`A${row}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const oldRegimeOutputs = [
    { label: "Total Deductions", formula: "B6+B7+B8+B9+B10", format: FORMATS.currency },
    { label: "Taxable Income (Old)", formula: "MAX(B5-B6-B7-B8-B9-B10-50000,0)", format: FORMATS.currency },
  ];

  row++;
  for (const out of oldRegimeOutputs) {
    ws.getCell(`A${row}`).value = out.label;
    ws.getCell(`A${row}`).font = LABEL_FONT;
    const vCell = ws.getCell(`B${row}`);
    vCell.value = { formula: out.formula };
    vCell.font = { ...VALUE_FONT, bold: true, color: { argb: BRAND.navy } };
    if (out.format) vCell.numFmt = out.format;
    row++;
  }

  ws.getColumn(1).width = 32;
  ws.getColumn(2).width = 22;
}

export function registerTaxTemplate(): void {
  registerTemplate("tax", taxTemplate);
}