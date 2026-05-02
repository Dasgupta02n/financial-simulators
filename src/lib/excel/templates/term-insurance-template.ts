import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function termInsuranceTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/term-insurance-calculator");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Annual Income (₹)", default: 1200000, format: FORMATS.currency },
    { label: "Monthly Expenses (₹)", default: 40000, format: FORMATS.currency },
    { label: "Outstanding Loans (₹)", default: 3000000, format: FORMATS.currency },
    { label: "Years of Coverage", default: 25, format: FORMATS.year },
    { label: "Inflation (%)", default: 6, format: FORMATS.percentWhole },
    { label: "Existing Insurance (₹)", default: 0, format: FORMATS.currency },
  ];

  inputs.forEach((inp, i) => {
    const row = 5 + i;
    ws.getCell(`A${row}`).value = inp.label;
    ws.getCell(`A${row}`).font = LABEL_FONT;
    const vCell = ws.getCell(`B${row}`);
    vCell.value = inp.default;
    vCell.font = VALUE_FONT;
    vCell.fill = INPUT_FILL;
    if (inp.format) vCell.numFmt = inp.format;
  });

  const outStart = 12;
  ws.getCell(`A${outStart}`).value = "OUTPUTS";
  ws.getCell(`A${outStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const outputs = [
    { label: "Future Expenses (total)", formula: "B6*12*((1+B9/100)^B8-1)/(B9/100)", format: FORMATS.currency },
    { label: "Cover Needed", formula: "B6*12*B8+B7-B10", format: FORMATS.currency },
    { label: "Monthly Premium (Low est.)", formula: "(B6*12*B8+B7-B10)*0.005/12", format: FORMATS.currency },
    { label: "Monthly Premium (High est.)", formula: "(B6*12*B8+B7-B10)*0.015/12", format: FORMATS.currency },
  ];

  outputs.forEach((out, i) => {
    const row = outStart + 1 + i;
    ws.getCell(`A${row}`).value = out.label;
    ws.getCell(`A${row}`).font = LABEL_FONT;
    const vCell = ws.getCell(`B${row}`);
    vCell.value = { formula: out.formula };
    vCell.font = { ...VALUE_FONT, bold: true, color: { argb: BRAND.sienna } };
    if (out.format) vCell.numFmt = out.format;
  });

  ws.getColumn(1).width = 32;
  ws.getColumn(2).width = 22;
}

export function registerTermInsuranceTemplate(): void { registerTemplate("termInsurance", termInsuranceTemplate); }