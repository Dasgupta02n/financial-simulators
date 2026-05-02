import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function hraTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/hra-calculator");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Basic Salary (₹/month)", default: 50000, format: FORMATS.currency },
    { label: "HRA Received (₹/month)", default: 20000, format: FORMATS.currency },
    { label: "Rent Paid (₹/month)", default: 15000, format: FORMATS.currency },
    { label: "Metro City?", default: 1, format: "0" }, // 1=Metro, 0=Non-metro
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

  // HRA Exemption = MIN(HRA, Rent - 10% Basic, 50%/40% of Basic)
  const outputs = [
    { label: "HRA Exemption", formula: "MIN(B6,B7-0.1*B5,IF(B8=1,0.5*B5,0.4*B5))", format: FORMATS.currency },
    { label: "Taxable HRA", formula: "MAX(B6-MIN(B6,B7-0.1*B5,IF(B8=1,0.5*B5,0.4*B5)),0)", format: FORMATS.currency },
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

  ws.getColumn(1).width = 28;
  ws.getColumn(2).width = 22;
}

export function registerHraTemplate(): void { registerTemplate("hra", hraTemplate); }