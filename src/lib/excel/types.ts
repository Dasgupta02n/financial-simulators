/** Shared types for Excel workbook generation */

export interface ExcelFieldDef {
  /** Cell reference or row key used in formulas */
  key: string;
  /** Human-readable label shown in the sheet */
  label: string;
  /** Default/example value for the input cell */
  defaultValue: number;
  /** Excel number format string (e.g. "#,##0", "0.00%", "₹#,##0") */
  format?: string;
}

export interface ExcelOutputDef {
  key: string;
  label: string;
  /** Formula string referencing input cells (e.g. "=B5*(1+B7)^B8-B5") */
  formula: string;
  format?: string;
}

export interface ExcelTemplateConfig {
  calculatorId: string;
  calculatorName: string;
  slug: string;
  inputs: ExcelFieldDef[];
  outputs: ExcelOutputDef[];
  /** Optional yearly table columns */
  yearlyColumns?: { key: string; label: string; format?: string }[];
  /** Number of years for yearly table (if applicable) */
  yearlyRows?: number;
}

export interface ExcelDownloadRequest {
  firstName: string;
  surname: string;
  email: string;
  city?: string;
  country?: string;
  calculatorId: string;
  locale: string;
  eulaAccepted: boolean;
}