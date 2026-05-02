import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function gstTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/gst-calculator");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Amount (₹)", default: 100000, format: FORMATS.currency },
    { label: "GST Rate (%)", default: 18, format: FORMATS.percentWhole },
    { label: "Inclusive of GST? (1=Yes, 0=No)", default: 0, format: "0" },
    { label: "Intra-State? (1=Yes, 0=No)", default: 1, format: "0" },
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
    { label: "Pre-Tax Amount", formula: "IF(B7=1,B5/(1+B6/100),B5)", format: FORMATS.currency },
    { label: "GST Amount", formula: "IF(B7=1,B5*B6/100/(1+B6/100),B5*B6/100)", format: FORMATS.currency },
    { label: "Post-Tax Total", formula: "IF(B7=1,B5,B5*(1+B6/100))", format: FORMATS.currency },
    { label: "CGST", formula: "IF(B8=1,IF(B7=1,B5*B6/100/(1+B6/100)/2,B5*B6/100/2),0)", format: FORMATS.currency },
    { label: "SGST", formula: "IF(B8=1,IF(B7=1,B5*B6/100/(1+B6/100)/2,B5*B6/100/2),0)", format: FORMATS.currency },
    { label: "IGST", formula: "IF(B8=0,IF(B7=1,B5*B6/100/(1+B6/100),B5*B6/100),0)", format: FORMATS.currency },
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

export function registerGstTemplate(): void { registerTemplate("gst", gstTemplate); }