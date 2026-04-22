export type StepUpMode = "percentage" | "absolute";

export interface AccumulatorInput {
  lumpsum: number;
  sipMonthly: number;
  returnRate: number;
  tenure: number;
  stepUpMode: StepUpMode;
  stepUpValue: number;
  inflationRate: number;
}

export interface YearlyAccumulationPoint {
  year: number;
  lumpsumValue: number;
  sipCorpus: number;
  sipInvested: number;
  nominalTotal: number;
  realTotal: number;
}

export interface AccumulatorOutput {
  yearlyData: YearlyAccumulationPoint[];
  finalLumpsum: number;
  finalSipCorpus: number;
  finalSipInvested: number;
  finalNominalTotal: number;
  finalRealTotal: number;
  totalInvested: number;
}