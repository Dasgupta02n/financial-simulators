import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function cryptoTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/crypto-calculator");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Purchase Price (₹)", default: 500000, format: FORMATS.currency },
    { label: "Quantity", default: 1, format: FORMATS.number },
    { label: "Current Price (₹)", default: 800000, format: FORMATS.currency },
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

  const outStart = 11;
  ws.getCell(`A${outStart}`).value = "OUTPUTS";
  ws.getCell(`A${outStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const outputs = [
    { label: "Total Gains", formula: "(B7-B5)*B6", format: FORMATS.currency },
    { label: "Tax @ 30% (Flat)", formula: "MAX((B7-B5)*B6*0.3,0)", format: FORMATS.currency },
    { label: "TDS @ 1%", formula: "B7*B6*0.01", format: FORMATS.currency },
    { label: "Net After Tax", formula: "B7*B6-MAX((B7-B5)*B6*0.3,0)-B7*B6*0.01", format: FORMATS.currency },
    { label: "Real Value (inflation-adjusted)", formula: "(B7*B6-MAX((B7-B5)*B6*0.3,0)-B7*B6*0.01)/(1+B9/100)", format: FORMATS.currency },
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

export function registerCryptoTemplate(): void { registerTemplate("crypto", cryptoTemplate); }