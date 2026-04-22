export interface TaxInput {
  grossSalary: number;
  section80C: number;
  section80D: number;
  hraExemption: number;
  nps80CCD1B: number;
  otherDeductions: number;
}

export interface RegimeResult {
  regimeName: string;
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeCess: number;
  surcharge: number;
  marginalRelief: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  slabBreakdown: SlabEntry[];
}

export interface SlabEntry {
  from: number;
  to: number;
  rate: number;
  taxInSlab: number;
}

export interface CrossoverResult {
  crossoverDeduction: number;
  newRegimeTaxAtCrossover: number;
  oldRegimeTaxAtCrossover: number;
  currentDeductions: number;
  currentSavingsNewOverOld: number;
  recommendation: "new" | "old";
}

export interface TaxOutput {
  oldRegime: RegimeResult;
  newRegime: RegimeResult;
  crossover: CrossoverResult;
}

export const OLD_REGIME_SLABS = [
  { from: 0, to: 250000, rate: 0 },
  { from: 250000, to: 500000, rate: 0.05 },
  { from: 500000, to: 1000000, rate: 0.2 },
  { from: 1000000, to: Infinity, rate: 0.3 },
] as const;

export const NEW_REGIME_SLABS = [
  { from: 0, to: 400000, rate: 0 },
  { from: 400000, to: 800000, rate: 0.05 },
  { from: 800000, to: 1200000, rate: 0.1 },
  { from: 1200000, to: 1600000, rate: 0.15 },
  { from: 1600000, to: 2000000, rate: 0.2 },
  { from: 2000000, to: 2400000, rate: 0.25 },
  { from: 2400000, to: Infinity, rate: 0.3 },
] as const;

export const SURCHARGE_THRESHOLDS = [
  { threshold: 5000000, rate: 0.10 },
  { threshold: 10000000, rate: 0.15 },
  { threshold: 20000000, rate: 0.25 },
  { threshold: 50000000, rate: 0.37 },
] as const;

export const OLD_STANDARD_DEDUCTION = 50000;
export const NEW_STANDARD_DEDUCTION = 75000;
export const MAX_80C = 150000;
export const MAX_80D = 25000;
export const MAX_NPS = 50000;
export const CESS_RATE = 0.04;

export const OLD_87A_THRESHOLD = 500000;
export const OLD_87A_REBATE = 12500;
export const NEW_87A_THRESHOLD = 1200000;
export const NEW_87A_MAX_REBATE = 60000;