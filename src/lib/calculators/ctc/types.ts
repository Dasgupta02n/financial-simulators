export interface CTCInput {
  grossCTC: number;
  basicPct: number; // % of CTC as Basic Salary
  hraPct: number; // % of Basic as HRA
  ltaPct: number; // % of CTC as LTA
  npsEmployerPct: number; // % of CTC as NPS (employer)
  specialAllowance: number; // remaining goes here
  // Deduction inputs
  actualRentMonthly: number;
  metroCity: boolean;
  deduction80C: number;
  deduction80D: number;
  deductionNPS: number;
  // Regime choice
  regime: "old" | "new";
}

export interface SalaryBreakdown {
  basic: number;
  hra: number;
  lta: number;
  npsEmployer: number;
  specialAllowance: number;
  totalFixed: number;
  basicPct: number;
  hraPct: number;
}

export interface TaxCalculation {
  taxableIncome: number;
  tax: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
}

export interface CTCOutput {
  breakdown: SalaryBreakdown;
  hraExemption: number;
  taxableIncome: number;
  tax: TaxCalculation;
  inHandAnnual: number;
  inHandMonthly: number;
  optimizedBreakdown: SalaryBreakdown;
  optimizedHRAExemption: number;
  optimizedTaxableIncome: number;
  optimizedTax: TaxCalculation;
  optimizedInHandAnnual: number;
  optimizedInHandMonthly: number;
  savingsAnnual: number;
  savingsMonthly: number;
}