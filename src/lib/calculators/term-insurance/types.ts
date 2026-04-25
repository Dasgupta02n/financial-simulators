export interface TermInsuranceInput {
  annualIncome: number;
  monthlyExpenses: number;
  outstandingLoans: number;
  numberOfDependants: number;
  yearsOfCoverage: number;
  inflationRate: number;
  existingInsuranceCover: number;
  savingsInvestments: number;
}

export interface TermInsuranceOutput {
  coverNeeded: number;
  futureExpenses: number;
  emergencyFund: number;
  totalRequired: number;
  monthlyPremiumLow: number;
  monthlyPremiumHigh: number;
  premiumAsPercentOfIncome: number;
  coverageAdequacyYears: number;
  existingCoverPercent: number;
}