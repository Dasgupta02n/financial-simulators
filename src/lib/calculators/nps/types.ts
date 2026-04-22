export interface NPSInput {
  currentAge: number;
  retirementAge: number;
  monthlyContribution: number;
  employerContribution: number; // monthly
  equityReturn: number; // %
  debtReturn: number; // %
  // Auto choice lifecycle: equity allocation depends on age
  // Auto choice: 75% equity up to age 35, decreasing by 2.5% per year from 36-45, then 25% from 45+
  annuityRate: number; // % of corpus used for annuity
  annuityReturn: number; // % return on annuity
  inflationRate: number;
}

export interface NPSYearlyPoint {
  year: number;
  age: number;
  equityPct: number;
  contribution: number;
  corpusEnd: number;
  realCorpusEnd: number;
}

export interface NPSOutput {
  yearlyData: NPSYearlyPoint[];
  corpusAtRetirement: number;
  realCorpusAtRetirement: number;
  lumpsumWithdrawal: number; // 60% tax-free
  annuityCorpus: number; // 40% for annuity
  monthlyPension: number;
  realMonthlyPension: number;
  annuityTaxable: number; // taxable portion of annuity
  totalContributed: number;
  totalGrowth: number;
}