export interface Deduction {
  label: string;
  amount: number;
}

export interface TruthResult {
  grossLabel: string;
  grossValue: number;
  realLabel: string;
  realValue: number;
  deductions: Deduction[];
  assumptions: string[];
  taxRegime: string;
  inflationRate: number;
  lastUpdated: string;
}