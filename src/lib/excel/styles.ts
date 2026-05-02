/** c7xai brand styles for Excel workbooks */
export const BRAND = {
  sienna: "FFD8400E" as const, // #D8400E with ARGB prefix
  navy: "FF0A0F1E" as const,
  navyLight: "FF141B2D" as const,
  white: "FFFFFFFF" as const,
  white50: "80FFFFFF" as const,
  white70: "B3FFFFFF" as const,
  black: "FF000000" as const,
  lightGray: "FFF5F5F7" as const,
  borderGray: "FFE0E0E5" as const,
  textSecondary: "FF5A5F6E" as const,
  linkBlue: "FF2563EB" as const,
  gainGreen: "FF15803D" as const,
  lossRed: "FFDC2626" as const,
} as const;

export const HEADER_FONT = {
  name: "Calibri",
  size: 14,
  bold: true,
  color: { argb: BRAND.white },
} as const;

export const LABEL_FONT = {
  name: "Calibri",
  size: 11,
  color: { argb: BRAND.textSecondary },
} as const;

export const VALUE_FONT = {
  name: "Calibri",
  size: 11,
  bold: true,
  color: { argb: BRAND.navy },
} as const;

export const LINK_FONT = {
  name: "Calibri",
  size: 11,
  color: { argb: BRAND.linkBlue },
  underline: "single" as const,
} as const;

export const INPUT_FILL = {
  type: "pattern" as const,
  pattern: "solid" as const,
  fgColor: { argb: BRAND.lightGray },
} as const;

export const SIENNA_FILL = {
  type: "pattern" as const,
  pattern: "solid" as const,
  fgColor: { argb: BRAND.sienna },
} as const;

export const NAVY_FILL = {
  type: "pattern" as const,
  pattern: "solid" as const,
  fgColor: { argb: BRAND.navy },
} as const;

/** Common number formats */
export const FORMATS = {
  currency: '₹#,##0',
  currencyDecimal: '₹#,##0.00',
  percent: '0.00%',
  percentDecimal: '0.00%',
  percentWhole: '0%',
  number: '#,##0',
  numberDecimal: '#,##0.00',
  year: '0',
} as const;