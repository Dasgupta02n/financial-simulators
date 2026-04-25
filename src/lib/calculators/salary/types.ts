export interface SalaryInput {
  ctc: number;           // Annual CTC
  basicPct: number;      // % of CTC as basic (40-50, default 50)
  bonusPct: number;      // % of CTC as bonus (0-30, default 10)
  metroCity: boolean;    // Metro city affects HRA
  regime: "old" | "new"; // Tax regime
}

export interface CTCBreakdown {
  basic: number;
  hra: number;
  specialAllowance: number;
  bonus: number;
  employerPF: number;
  grossSalary: number;
}

export interface TaxBreakdown {
  slabEntries: { from: number; to: number; rate: number; tax: number }[];
  taxBeforeCess: number;
  rebate: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
}

export interface Deductions {
  employeePF: number;
  professionalTax: number;
  incomeTax: number;
  totalDeductions: number;
}

export interface SalaryOutput {
  breakdown: CTCBreakdown;
  deductions: Deductions;
  taxableIncome: number;
  standardDeduction: number;
  tax: TaxBreakdown;
  monthlyGross: number;
  annualGross: number;
  monthlyInHand: number;
  annualInHand: number;
  pieData: { name: string; value: number }[];
}