export interface StepUpSIPInput {
  monthlySIP: number;
  annualStepUp: number;
  returnRate: number;
  tenureYears: number;
  inflationRate: number;
}

export interface StepUpSIPOutput {
  totalInvested: number;
  nominalCorpus: number;
  realCorpus: number;
  afterLTCG: number;
  regularCorpus: number;
  regularInvested: number;
  stepUpGainVsRegular: number;
  yearlyBreakdown: {
    year: number;
    sipAmount: number;
    investedSoFar: number;
    nominalValue: number;
  }[];
}