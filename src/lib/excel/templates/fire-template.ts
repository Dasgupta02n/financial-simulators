import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, SIENNA_FILL, NAVY_FILL, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function fireTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/fire-matrix");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Current Age", default: 30, format: FORMATS.year },
    { label: "Retirement Age", default: 55, format: FORMATS.year },
    { label: "Life Expectancy", default: 85, format: FORMATS.year },
    { label: "Monthly Expenses (₹)", default: 50000, format: FORMATS.currency },
    { label: "Current Corpus (₹)", default: 1000000, format: FORMATS.currency },
    { label: "Monthly SIP (₹)", default: 25000, format: FORMATS.currency },
    { label: "Pre-Retirement Return (%)", default: 10, format: FORMATS.percentWhole },
    { label: "Post-Retirement Return (%)", default: 6, format: FORMATS.percentWhole },
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

  const outStart = 5 + inputs.length + 1;
  ws.getCell(`A${outStart}`).value = "OUTPUTS";
  ws.getCell(`A${outStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const outputs = [
    { label: "FIRE Number (25x annual expenses)", formula: "B8*12*25", format: FORMATS.currency },
    { label: "Years to Retirement", formula: "B6-B5", format: FORMATS.year },
    { label: "Corpus at Retirement (projected)", formula: "FV(B11/100/12,(B6-B5)*12,-B9,-B7)", format: FORMATS.currency },
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

export function registerFireTemplate(): void { registerTemplate("fire", fireTemplate); }