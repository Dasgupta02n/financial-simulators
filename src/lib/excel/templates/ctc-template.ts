import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function ctcTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/ctc-optimizer");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Gross CTC (₹)", default: 2000000, format: FORMATS.currency },
    { label: "Basic (%)", default: 40, format: FORMATS.percentWhole },
    { label: "HRA (%)", default: 50, format: FORMATS.percentWhole },
    { label: "Actual Rent (₹/month)", default: 25000, format: FORMATS.currency },
    { label: "Metro City?", default: 1, format: "0" },
    { label: "80C Deductions (₹)", default: 150000, format: FORMATS.currency },
    { label: "80D Deductions (₹)", default: 25000, format: FORMATS.currency },
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
    { label: "Basic (₹/year)", formula: "B5*B6/100", format: FORMATS.currency },
    { label: "HRA (₹/year)", formula: "B5*B6/100*B7/100", format: FORMATS.currency },
    { label: "In-Hand Monthly (est.)", formula: "(B5-B5*0.12-IF(B11=1,MIN(B5*B6/100*B7/100,B8*12-0.1*B5*B6/100,0.5*B5*B6/100),MIN(B5*B6/100*B7/100,B8*12-0.1*B5*B6/100,0.4*B5*B6/100))-B12-B13-50000)/12*0.8", format: FORMATS.currency },
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

export function registerCtcTemplate(): void { registerTemplate("ctc", ctcTemplate); }