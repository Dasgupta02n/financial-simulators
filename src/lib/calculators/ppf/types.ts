export interface PPFInput {
  yearlyContribution: number;
  interestRate: number;
  tenure: number;
  inflationRate: number;
}

export interface PPFYearlyPoint {
  year: number;
  invested: number;
  interestEarned: number;
  nominalValue: number;
  realValue: number;
}

export interface PPFOutput {
  yearlyData: PPFYearlyPoint[];
  totalInvested: number;
  totalInterest: number;
  maturityValue: number;
  realMaturityValue: number;
  effectiveYield: number;
  realYield: number;
}