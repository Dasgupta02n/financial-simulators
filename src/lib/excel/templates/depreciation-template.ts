import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function depreciationTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/depreciation-calculator");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Purchase Price (₹)", default: 1000000, format: FORMATS.currency },
    { label: "Ownership Years", default: 5, format: FORMATS.year },
    { label: "Depreciation Rate (%/year)", default: 15, format: FORMATS.percentWhole },
    { label: "Inflation (%)", default: 6, format: FORMATS.percentWhole },
    { label: "Annual Income (₹)", default: 1200000, format: FORMATS.currency },
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
    { label: "Book Value (straight-line)", formula: "B5*(1-B7/100*B6)", format: FORMATS.currency },
    { label: "Estimated Resale Value", formula: "B5*(1-B7/100)^B6", format: FORMATS.currency },
    { label: "Total Cost of Ownership", formula: "B5-B5*(1-B7/100)^B6", format: FORMATS.currency },
    { label: "Depreciation per Year", formula: "B5*B7/100", format: FORMATS.currency },
    { label: "Real Cost of Ownership", formula: "(B5-B5*(1-B7/100)^B6)/(1+B8/100)^B6", format: FORMATS.currency },
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

export function registerDepreciationTemplate(): void { registerTemplate("depreciation", depreciationTemplate); }