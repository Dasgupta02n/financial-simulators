import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function ppfTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/ppf-calculator");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Yearly Contribution (₹)", default: 150000, format: FORMATS.currency },
    { label: "Interest Rate (%)", default: 7.1, format: FORMATS.percentDecimal },
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

  const outStart = 10;
  ws.getCell(`A${outStart}`).value = "OUTPUTS";
  ws.getCell(`A${outStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const outputs = [
    { label: "Total Invested", formula: "B5*B7", format: FORMATS.currency },
    { label: "Maturity Value (Gross)", formula: "FV(B6/100,15,-B5,0,1)", format: FORMATS.currency },
    { label: "Total Interest Earned", formula: "FV(B6/100,15,-B5,0,1)-B5*B7", format: FORMATS.currency },
    { label: "Real Maturity Value", formula: "FV(B6/100,15,-B5,0,1)/(1+B8/100)^B7", format: FORMATS.currency },
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

export function registerPpfTemplate(): void { registerTemplate("ppf", ppfTemplate); }