export interface FIREInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  monthlyExpenses: number;
  currentCorpus: number;
  monthlySIP: number;
  preRetirementReturn: number;
  postRetirementReturn: number;
  preRetirementInflation: number;
  postRetirementInflation: number;
  equityAllocation: number; // 0-100%, rest is debt
  // Glide path: equity shifts from equityAllocation at retirement to equityAllocation - glidePathShift at lifeExpectancy
  glidePathShift: number;
}

export interface FIREYearlyPoint {
  year: number;
  age: number;
  phase: "accumulation" | "withdrawal";
  corpusStart: number;
  contribution: number;
  growth: number;
  withdrawal: number;
  corpusEnd: number;
  realCorpusEnd: number;
  equityPct: number;
}

export interface FIREOutput {
  yearlyData: FIREYearlyPoint[];
  fireNumber: number;
  corpusAtRetirement: number;
  corpusAtEnd: number;
  realCorpusAtRetirement: number;
  yearsInRetirement: number;
  depleted: boolean;
  depletionAge: number | null;
  totalContributed: number;
  totalGrowth: number;
  totalWithdrawn: number;
}