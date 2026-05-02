import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function forexTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/forex-calculator");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Amount (INR)", default: 500000, format: FORMATS.currency },
    { label: "Exchange Rate (1 USD = INR)", default: 83, format: FORMATS.numberDecimal },
    { label: "Holding Years", default: 3, format: FORMATS.year },
    { label: "Appreciation Rate (%)", default: 3, format: FORMATS.percentWhole },
    { label: "Tax Slab (%)", default: 30, format: FORMATS.percentWhole },
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
    { label: "Foreign Amount (USD)", formula: "B5/B6", format: FORMATS.numberDecimal },
    { label: "Final INR Value", formula: "B5/B6*(1+B8/100)^B7*B6", format: FORMATS.currency },
    { label: "Capital Gains Tax", formula: "MAX((B5/B6*(1+B8/100)^B7*B6-B5)*B9/100,0)", format: FORMATS.currency },
    { label: "TCS @ 5%", formula: "B5*0.05", format: FORMATS.currency },
    { label: "Net Proceeds", formula: "B5/B6*(1+B8/100)^B7*B6-MAX((B5/B6*(1+B8/100)^B7*B6-B5)*B9/100,0)-B5*0.05", format: FORMATS.currency },
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

export function registerForexTemplate(): void { registerTemplate("forex", forexTemplate); }