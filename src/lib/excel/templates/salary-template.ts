import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function salaryTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/salary-calculator");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "CTC (₹)", default: 1200000, format: FORMATS.currency },
    { label: "Basic (%)", default: 40, format: FORMATS.percentWhole },
    { label: "Bonus (%)", default: 10, format: FORMATS.percentWhole },
    { label: "Metro City? (1=Yes, 0=No)", default: 1, format: "0" },
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

  const outStart = 10;
  ws.getCell(`A${outStart}`).value = "OUTPUTS";
  ws.getCell(`A${outStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const outputs = [
    { label: "Basic (₹/month)", formula: "B5*B6/100/12", format: FORMATS.currency },
    { label: "HRA (₹/month)", formula: "B5*B6/100*0.5/12", format: FORMATS.currency },
    { label: "Gross Salary (₹/month)", formula: "B5/12", format: FORMATS.currency },
    { label: "In-Hand Monthly (approx)", formula: "B5/12*0.7", format: FORMATS.currency },
    { label: "In-Hand Annual (approx)", formula: "B5*0.7", format: FORMATS.currency },
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

  ws.getColumn(1).width = 30;
  ws.getColumn(2).width = 22;
}

export function registerSalaryTemplate(): void { registerTemplate("salary", salaryTemplate); }