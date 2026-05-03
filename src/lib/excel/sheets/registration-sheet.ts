import type { Worksheet } from "exceljs";
import { BRAND, HEADER_FONT, SIENNA_FILL, LABEL_FONT, VALUE_FONT, INPUT_FILL } from "../styles";

export function createRegistrationSheet(
  ws: Worksheet,
  registeredEmail: string
): void {
  ws.columns = [{ width: 22 }, { width: 36 }, { width: 20 }];

  // Header
  const r1 = ws.getRow(1);
  r1.height = 32;
  const hCell = ws.getCell("A1");
  hCell.value = "Registration";
  hCell.font = HEADER_FONT;
  hCell.fill = SIENNA_FILL;
  ws.mergeCells("A1:C1");

  // Info text
  ws.mergeCells("A3:C3");
  const infoCell = ws.getCell("A3");
  infoCell.value = "Register this template to receive updates and unlock full functionality.";
  infoCell.font = { ...LABEL_FONT, size: 10 };
  ws.getRow(3).height = 28;

  // Fields
  const fields = [
    { label: "First Name", value: "" },
    { label: "Surname", value: "" },
    { label: "Email", value: registeredEmail },
    { label: "City", value: "" },
    { label: "Country", value: "" },
  ];

  let row = 5;
  for (const f of fields) {
    const labelCell = ws.getCell(row, 1);
    labelCell.value = f.label;
    labelCell.font = LABEL_FONT;

    const valueCell = ws.getCell(row, 2);
    valueCell.value = f.value;
    valueCell.font = VALUE_FONT;
    valueCell.fill = INPUT_FILL;
    if (f.label === "Email" && f.value) {
      valueCell.protection = { locked: true };
    }

    row++;
  }

  // Registration status
  row += 1;
  ws.getCell(row, 1).value = "Status";
  ws.getCell(row, 1).font = { ...LABEL_FONT, bold: true };

  const statusCell = ws.getCell(row, 2);
  if (registeredEmail) {
    statusCell.value = "✓ Registered";
    statusCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: BRAND.gainGreen } };
  } else {
    statusCell.value = "✗ Not Registered";
    statusCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: BRAND.lossRed } };
  }

  // EULA reference
  row += 2;
  ws.mergeCells(`A${row}:C${row}`);
  const eulaCell = ws.getCell(`A${row}`);
  eulaCell.value = "By using this template, you accept the EULA at https://c7xai.in/eula";
  eulaCell.font = { name: "Calibri", size: 9, color: { argb: BRAND.textSecondary } };

  // Verification URL reference
  row += 2;
  ws.mergeCells(`A${row}:C${row}`);
  const verifyCell = ws.getCell(`A${row}`);
  verifyCell.value = "Verification: https://c7xai.in/api/excel-verify?email={email}&calculatorId={id}";
  verifyCell.font = { name: "Calibri", size: 9, color: { argb: BRAND.textSecondary }, italic: true };
}