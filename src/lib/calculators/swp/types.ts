export interface SWPInput {
  corpus: number;
  monthlyWithdrawal: number;
  returnRate: number;
  tenure: number;
  inflationRate: number;
  crashEnabled: boolean;
  crashSeverity: number; // 0.2 or 0.3
  crashYear: number; // year crash starts (1-indexed)
  crashDuration: number; // years the crash lasts
}

export interface SWPYearlyPoint {
  year: number;
  corpusStart: number;
  withdrawal: number;
  growth: number;
  corpusEnd: number;
  realCorpusEnd: number;
  stressCorpusEnd?: number;
}

export interface SWPOutput {
  yearlyData: SWPYearlyPoint[];
  finalCorpus: number;
  finalRealCorpus: number;
  yearsLasted: number;
  depleted: boolean;
  totalWithdrawn: number;
  totalGrowth: number;
  stressFinalCorpus?: number;
  stressYearsLasted?: number;
  stressDepleted?: boolean;
}