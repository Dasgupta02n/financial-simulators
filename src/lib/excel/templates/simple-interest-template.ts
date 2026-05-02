import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function simpleInterestTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/simple-interest-calculator");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Principal (₹)", default: 100000, format: FORMATS.currency },
    { label: "Rate (% p.a.)", default: 8, format: FORMATS.percentWhole },
    { label: "Years", default: 5, format: FORMATS.year },
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

  const outStart = 9;
  ws.getCell(`A${outStart}`).value = "OUTPUTS";
  ws.getCell(`A${outStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const outputs = [
    { label: "Simple Interest", formula: "B5*B6/100*B7", format: FORMATS.currency },
    { label: "Total Amount (Simple)", formula: "B5+B5*B6/100*B7", format: FORMATS.currency },
    { label: "Compound Interest", formula: "B5*(1+B6/100)^B7-B5", format: FORMATS.currency },
    { label: "Total Amount (Compound)", formula: "B5*(1+B6/100)^B7", format: FORMATS.currency },
    { label: "Difference (Compound - Simple)", formula: "B5*(1+B6/100)^B7-(B5+B5*B6/100*B7)", format: FORMATS.currency },
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

export function registerSimpleInterestTemplate(): void { registerTemplate("simpleInterest", simpleInterestTemplate); }