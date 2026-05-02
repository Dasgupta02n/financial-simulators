import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function swpTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/swp-stress-test");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Corpus (₹)", default: 10000000, format: FORMATS.currency },
    { label: "Monthly Withdrawal (₹)", default: 50000, format: FORMATS.currency },
    { label: "Return Rate (%)", default: 8, format: FORMATS.percentWhole },
    { label: "Tenure (years)", default: 25, format: FORMATS.year },
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
    { label: "Final Corpus (nominal)", formula: "FV(B7/100/12,B8*12,B6,-B5)*(-1)", format: FORMATS.currency },
    { label: "Total Withdrawn", formula: "B6*B8*12", format: FORMATS.currency },
    { label: "Years Corpus Lasts (approx)", formula: "IF(FV(B7/100/12,B8*12,B6,-B5)>0,B8,\"Depleted before tenure\")", format: FORMATS.year },
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

export function registerSwpTemplate(): void { registerTemplate("swp", swpTemplate); }