export interface SIPInput {
  monthlySIP: number;
  lumpsum: number;
  returnRate: number;
  tenure: number;
  inflationRate: number;
  stepUpMode: "percentage" | "fixed";
  stepUpValue: number;
}

export interface YearlyDataPoint {
  year: number;
  invested: number;
  nominalCorpus: number;
  realCorpus: number;
  postTaxCorpus: number;
  stressCorpus?: number;
  p10?: number;
  p90?: number;
}

export interface SIPOutput {
  totalInvested: number;
  nominalCorpus: number;
  postTaxCorpus: number;
  realCorpus: number;
  stressCorpus?: number;
  ltcgTax: number;
  ltcgExempt: number;
  yearlyData: YearlyDataPoint[];
  monteCarloPaths: number[][];
}

export interface StressTestConfig {
  enabled: boolean;
  severity: 0.2 | 0.3;
  crashYears: number;
}

export type StepUpMode = "percentage" | "fixed";