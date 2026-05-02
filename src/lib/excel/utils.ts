import type { Workbook, Worksheet } from "exceljs";

/** Set column widths based on content */
export function autoWidth(ws: Worksheet, min = 10, max = 40): void {
  ws.columns?.forEach((col) => {
    let maxLen = min;
    col.eachCell?.({ includeEmpty: false }, (cell) => {
      const len = String(cell.value ?? "").length;
      if (len > maxLen) maxLen = len;
    });
    col.width = Math.min(maxLen + 2, max);
  });
}

/** Add c7xai branding header row to a sheet */
export function addBrandHeader(
  ws: Worksheet,
  title: string,
  startRow = 1
): void {
  const { BRAND, HEADER_FONT, SIENNA_FILL } = require("./styles") as typeof import("./styles");
  ws.getRow(startRow).height = 30;
  const cell = ws.getCell(startRow, 1);
  cell.value = title;
  cell.font = HEADER_FONT;
  cell.fill = SIENNA_FILL;
  ws.mergeCells(startRow, 1, startRow, 4);
}

/** Add a hyperlink cell */
export function addLink(
  ws: Worksheet,
  row: number,
  col: number,
  text: string,
  url: string
): void {
  const cell = ws.getCell(row, col);
  cell.value = { text, hyperlink: url };
  const { LINK_FONT } = require("./styles") as typeof import("./styles");
  cell.font = LINK_FONT;
}

/** Add input row (label + editable value) */
export function addInputRow(
  ws: Worksheet,
  row: number,
  label: string,
  defaultValue: number | string,
  format?: string,
  valueCol = 2
): void {
  const { LABEL_FONT, INPUT_FILL, VALUE_FONT } = require("./styles") as typeof import("./styles");
  const labelCell = ws.getCell(row, 1);
  labelCell.value = label;
  labelCell.font = LABEL_FONT;

  const valueCell = ws.getCell(row, valueCol);
  valueCell.value = defaultValue;
  valueCell.font = VALUE_FONT;
  valueCell.fill = INPUT_FILL;
  if (format) valueCell.numFmt = format;
}

/** Add output row (label + formula result) */
export function addOutputRow(
  ws: Worksheet,
  row: number,
  label: string,
  formula: string,
  format?: string,
  valueCol = 2
): void {
  const { LABEL_FONT, VALUE_FONT } = require("./styles") as typeof import("./styles");
  const labelCell = ws.getCell(row, 1);
  labelCell.value = label;
  labelCell.font = LABEL_FONT;

  const valueCell = ws.getCell(row, valueCol);
  valueCell.value = { formula };
  valueCell.font = VALUE_FONT;
  if (format) valueCell.numFmt = format;
}

/** Generate site URL for a calculator */
export function calcUrl(slug: string, locale = "en"): string {
  return locale === "en"
    ? `https://c7xai.in/${slug}`
    : `https://c7xai.in/${locale}/${slug}`;
}