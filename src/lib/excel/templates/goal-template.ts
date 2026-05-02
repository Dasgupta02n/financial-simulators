import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function goalTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/goal-planner");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Goal Target Amount (₹)", default: 5000000, format: FORMATS.currency },
    { label: "Years From Now", default: 10, format: FORMATS.year },
    { label: "Return Rate - Conservative (%)", default: 6, format: FORMATS.percentWhole },
    { label: "Return Rate - Moderate (%)", default: 10, format: FORMATS.percentWhole },
    { label: "Return Rate - Aggressive (%)", default: 14, format: FORMATS.percentWhole },
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
    { label: "Inflated Target", formula: "B5*(1+B10/100)^B6", format: FORMATS.currency },
    { label: "Monthly SIP (Conservative)", formula: "PMT(B7/100/12,B6*12,0,-B5*(1+B10/100)^B6)", format: FORMATS.currency },
    { label: "Monthly SIP (Moderate)", formula: "PMT(B8/100/12,B6*12,0,-B5*(1+B10/100)^B6)", format: FORMATS.currency },
    { label: "Monthly SIP (Aggressive)", formula: "PMT(B9/100/12,B6*12,0,-B5*(1+B10/100)^B6)", format: FORMATS.currency },
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

  ws.getColumn(1).width = 36;
  ws.getColumn(2).width = 22;
}

export function registerGoalTemplate(): void { registerTemplate("goal", goalTemplate); }