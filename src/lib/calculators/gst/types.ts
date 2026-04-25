export interface GSTInput {
  amount: number;
  gstRate: number;
  inclusive: boolean;   // true = amount includes GST, false = amount is pre-GST
  intraState: boolean;  // true = CGST+SGST split, false = IGST
}

export interface GSTOutput {
  preTaxAmount: number;
  gstAmount: number;
  postTaxTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  effectiveRate: number;
}