import type { GSTInput, GSTOutput } from "./types";

export function computeGST(input: GSTInput): GSTOutput {
  const { amount, gstRate, inclusive, intraState } = input;

  let preTaxAmount: number;
  let gstAmount: number;
  let postTaxTotal: number;

  if (inclusive) {
    // Amount includes GST — extract pre-tax and GST from total
    preTaxAmount = (amount * 100) / (100 + gstRate);
    gstAmount = amount - preTaxAmount;
    postTaxTotal = amount;
  } else {
    // Amount is pre-GST — add GST on top
    preTaxAmount = amount;
    gstAmount = (amount * gstRate) / 100;
    postTaxTotal = amount + gstAmount;
  }

  // CGST + SGST split for intra-state, IGST for inter-state
  const cgst = intraState ? gstAmount / 2 : 0;
  const sgst = intraState ? gstAmount / 2 : 0;
  const igst = intraState ? 0 : gstAmount;

  return {
    preTaxAmount: Math.round(preTaxAmount * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    postTaxTotal: Math.round(postTaxTotal * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    effectiveRate: gstRate,
  };
}