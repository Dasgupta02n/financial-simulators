export const INFLATION_RATE = 6;
export const RBI_10YR_AVG_INFLATION = 6;
export const LTCG_RATE = 0.125;
export const LTCG_EXEMPTION_LIMIT = 1_25_000;
export const FY_YEAR = "2025-26";
export const LAST_UPDATED = "2026-04-25";

export const NEW_REGIME_SLABS = [
  { upto: 4_00_000, rate: 0 },
  { upto: 8_00_000, rate: 0.05 },
  { upto: 12_00_000, rate: 0.10 },
  { upto: 16_00_000, rate: 0.15 },
  { upto: 20_00_000, rate: 0.20 },
  { upto: 24_00_000, rate: 0.25 },
  { upto: Infinity, rate: 0.30 },
];

export function computeLTCG(gains: number): {
  exempt: number;
  taxable: number;
  tax: number;
  postTaxCorpus: number;
} {
  const exempt = Math.min(gains, LTCG_EXEMPTION_LIMIT);
  const taxable = Math.max(0, gains - LTCG_EXEMPTION_LIMIT);
  const tax = taxable * LTCG_RATE;
  return { exempt, taxable, tax, postTaxCorpus: gains - tax };
}