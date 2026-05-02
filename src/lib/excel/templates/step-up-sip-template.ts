import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function stepUpSipTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/step-up-sip-calculator");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Monthly SIP (₹)", default: 10000, format: FORMATS.currency },
    { label: "Annual Step-Up (%)", default: 10, format: FORMATS.percentWhole },
    { label: "Return Rate (%)", default: 12, format: FORMATS.percentWhole },
    { label: "Tenure (years)", default: 15, format: FORMATS.year },
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

  const outStart = 11;
  ws.getCell(`A${outStart}`).value = "OUTPUTS";
  ws.getCell(`A${outStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const outputs = [
    { label: "Total Invested (approx)", formula: "B5*12*((1+B6/100)^B8-1)/(B6/100)", format: FORMATS.currency },
    { label: "Nominal Corpus (approx)", formula: "B5*12*((1+B7/100/12)^(B8*12)-(1+B6/100)^(B8))/((1+B7/100/12)-1-B6/100)", format: FORMATS.currency },
    { label: "Real Corpus (inflation-adjusted)", formula: "B5*12*((1+B7/100/12)^(B8*12)-(1+B6/100)^(B8))/((1+B7/100/12)-1-B6/100)/(1+B9/100)^B8", format: FORMATS.currency },
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

export function registerStepUpSipTemplate(): void { registerTemplate("stepUpSip", stepUpSipTemplate); }