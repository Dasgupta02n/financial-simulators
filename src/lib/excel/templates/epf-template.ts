import type { Worksheet } from "exceljs";
import { registerTemplate } from "./registry";
import { BRAND, FORMATS, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";
import { addBrandHeader, addLink } from "../utils";

function epfTemplate(ws: Worksheet, name: string): void {
  addBrandHeader(ws, name);
  addLink(ws, 2, 1, "Open online →", "https://c7xai.in/epf-calculator");

  ws.getCell("A4").value = "INPUTS";
  ws.getCell("A4").font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const inputs = [
    { label: "Monthly Basic Salary (₹)", default: 50000, format: FORMATS.currency },
    { label: "Employee EPF Rate (%)", default: 12, format: FORMATS.percentWhole },
    { label: "Employer EPF Rate (%)", default: 3.67, format: FORMATS.percentDecimal },
    { label: "Employer EPS Rate (%)", default: 8.33, format: FORMATS.percentDecimal },
    { label: "Age of Entry", default: 25, format: FORMATS.year },
    { label: "Retirement Age", default: 58, format: FORMATS.year },
    { label: "EPF Interest Rate (%)", default: 8.25, format: FORMATS.percentDecimal },
    { label: "Annual Salary Increase (%)", default: 5, format: FORMATS.percentWhole },
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

  const outStart = 15;
  ws.getCell(`A${outStart}`).value = "OUTPUTS";
  ws.getCell(`A${outStart}`).font = { ...LABEL_FONT, bold: true, color: { argb: BRAND.sienna } };

  const outputs = [
    { label: "Monthly Employee Contribution", formula: "B5*B6/100", format: FORMATS.currency },
    { label: "Monthly Employer EPF", formula: "B5*B7/100", format: FORMATS.currency },
    { label: "Monthly Employer EPS", formula: "MIN(B5*B8/100,1250)", format: FORMATS.currency },
    { label: "Total Corpus at Retirement (approx)", formula: "FV(B11/100/12,(B10-B9)*12,-(B5*B6/100+B5*B7/100),0,1)", format: FORMATS.currency },
    { label: "Real Corpus (inflation-adjusted)", formula: "FV(B11/100/12,(B10-B9)*12,-(B5*B6/100+B5*B7/100),0,1)/(1+B12/100)^(B10-B9)", format: FORMATS.currency },
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

export function registerEpfTemplate(): void { registerTemplate("epf", epfTemplate); }