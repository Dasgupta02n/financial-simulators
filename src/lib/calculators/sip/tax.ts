import { MACRO_CONTEXT } from "@/lib/macro/context";

export interface TaxResult {
  gains: number;
  exempt: number;
  taxable: number;
  tax: number;
  postTaxCorpus: number;
}

export function applyLTCG(maturityCorpus: number, totalInvested: number): TaxResult {
  const gains = Math.max(0, maturityCorpus - totalInvested);
  const exempt = Math.min(gains, MACRO_CONTEXT.ltcgExemption);
  const taxable = Math.max(0, gains - exempt);
  const tax = taxable * MACRO_CONTEXT.ltcgRate;
  const postTaxCorpus = maturityCorpus - tax;

  return { gains, exempt, taxable, tax, postTaxCorpus };
}