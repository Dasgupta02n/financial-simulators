export interface EMIInput {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  extraMonthlyCash: number;
  sipReturnRate: number;
  inflationRate: number;
}

export interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  outstanding: number;
  prepaidPrincipal?: number;
  prepaidOutstanding?: number;
  sipInvested?: number;
  sipCorpus?: number;
}

export interface RateShift {
  enabled: boolean;
  shifts: RateShiftPoint[];
}

export interface RateShiftPoint {
  afterYear: number;
  bpsChange: number; // positive = hike, negative = cut
}

export interface EMIOutput {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  prepaidTotalInterest: number;
  prepaidSavedInterest: number;
  prepaidMonthsSaved: number;
  sipCorpusAtLoanEnd: number;
  crossoverMonth?: number;
  amortization: AmortizationRow[];
  rateShift: RateShift;
}

export type CrossoverResult = {
  crossoverMonth: number | null;
  sipCorpusAtCrossover: number;
  prepaidSavedAtCrossover: number;
}