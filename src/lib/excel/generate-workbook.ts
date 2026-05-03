import ExcelJS from "exceljs";
import { createAboutSheet } from "./sheets/about-sheet";
import { createRegistrationSheet } from "./sheets/registration-sheet";
import { getTemplate } from "./templates/registry";

export interface GenerateWorkbookOptions {
  calculatorId: string;
  calculatorName: string;
  calculatorSlug: string;
  email: string;
  locale: string;
}

/**
 * Generate a complete .xlsx workbook for a calculator.
 *
 * Creates 3 sheets:
 * 1. Calculator — formula-driven template matching the web calculator
 * 2. Registration — user info + registration status
 * 3. About c7xai — links, branding, disclaimer
 */
export async function generateWorkbook(
  opts: GenerateWorkbookOptions
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "c7xai";
  workbook.company = "c7xai";
  workbook.created = new Date();

  // Sheet 1: Calculator template
  const calcWs = workbook.addWorksheet("Calculator", {
    properties: { tabColor: { argb: "FFD8400E" } },
  });
  const template = getTemplate(opts.calculatorId);
  if (template) {
    template(calcWs, opts.calculatorName);
  } else {
    // Fallback: generic template
    calcWs.columns = [{ width: 30 }, { width: 20 }];
    calcWs.getCell("A1").value = opts.calculatorName;
    calcWs.getCell("A1").font = { name: "Calibri", size: 14, bold: true };
    calcWs.getCell("A3").value = "Open this calculator online →";
    calcWs.getCell("A3").font = {
      name: "Calibri",
      size: 11,
      color: { argb: "FF2563EB" },
      underline: "single",
    };
    if (typeof calcWs.getCell("A3").value === "string") {
      // ExcelJS doesn't support direct hyperlink in value string,
      // we'll add it as a proper hyperlink below
    }
  }

  // Sheet 2: Registration
  const regWs = workbook.addWorksheet("Registration", {
    properties: { tabColor: { argb: "FF15803D" } },
  });
  createRegistrationSheet(regWs, opts.email);

  // Sheet 3: About c7xai
  const aboutWs = workbook.addWorksheet("About c7xai", {
    properties: { tabColor: { argb: "FF0A0F1E" } },
  });
  createAboutSheet(aboutWs, opts.calculatorName, opts.calculatorSlug);

  // Generate .xlsx buffer
  const xlsxBuffer = await workbook.xlsx.writeBuffer();

  return Buffer.from(xlsxBuffer);
}