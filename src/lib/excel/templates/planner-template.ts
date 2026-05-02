import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function plannerTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/planner");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Current Age", default: 30, format: FORMATS.year },
    { label: "Retirement Age", default: 55, format: FORMATS.year },
    { label: "Monthly Investment (₹)", default: 20000, format: FORMATS.currency },
    { label: "Return Rate (%)", default: 10, format: FORMATS.percentWhole },
    { label: "Monthly Expenses (₹)", default: 50000, format: FORMATS.currency },
    { label: "Inflation (%)", default: 6, format: FORMATS.percentWhole },
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
    { label: "Emergency Fund Target (6 months)", formula: "B9*6", format: FORMATS.currency },
    { label: "Retirement Corpus Needed (25x annual)", formula: "B9*12*25", format: FORMATS.currency },
    { label: "Corpus at Retirement (projected)", formula: "FV(B8/100/12,(B6-B5)*12,-B7)", format: FORMATS.currency },
    { label: "Gap (positive = surplus)", formula: "FV(B8/100/12,(B6-B5)*12,-B7)-B9*12*25", format: FORMATS.currency },
    { label: "Monthly SIP Needed for Retirement", formula: "PMT(B8/100/12,(B6-B5)*12,0,-B9*12*25)", format: FORMATS.currency },
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

  ws.getColumn(1).width = 38;
  ws.getColumn(2).width = 22;
}

export function registerPlannerTemplate(): void { registerTemplate("planner", plannerTemplate); }