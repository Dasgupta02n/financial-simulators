import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function npsTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/nps-modeler");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Current Age", default: 30, format: FORMATS.year },
    { label: "Retirement Age", default: 60, format: FORMATS.year },
    { label: "Monthly Contribution (₹)", default: 5000, format: FORMATS.currency },
    { label: "Employer Contribution (₹)", default: 5000, format: FORMATS.currency },
    { label: "Expected Return (%)", default: 10, format: FORMATS.percentWhole },
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
    { label: "Corpus at Retirement", formula: "FV(B9/100/12,(B6-B5)*12,-(B7+B8))", format: FORMATS.currency },
    { label: "Real Corpus (inflation-adjusted)", formula: "FV(B9/100/12,(B6-B5)*12,-(B7+B8))/(1+B10/100)^(B6-B5)", format: FORMATS.currency },
    { label: "Lumpsum Withdrawal (60%)", formula: "FV(B9/100/12,(B6-B5)*12,-(B7+B8))*0.6", format: FORMATS.currency },
    { label: "Annuity Corpus (40%)", formula: "FV(B9/100/12,(B6-B5)*12,-(B7+B8))*0.4", format: FORMATS.currency },
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

  ws.getColumn(1).width = 34;
  ws.getColumn(2).width = 22;
}

export function registerNpsTemplate(): void { registerTemplate("nps", npsTemplate); }