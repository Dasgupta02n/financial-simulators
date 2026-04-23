export interface CompoundInput {
  principal: number;
  monthlyContribution: number;
  annualRate: number;
  tenure: number;
  compoundingFreq: 1 | 4 | 12;
  inflationRate: number;
  taxSlab: number;
}

export interface CompoundYearlyPoint {
  year: number;
  invested: number;
  nominalValue: number;
  postTaxValue: number;
  realValue: number;
}

export interface CompoundOutput {
  yearlyData: CompoundYearlyPoint[];
  totalInvested: number;
  maturityNominal: number;
  maturityPostTax: number;
  maturityReal: number;
  nominalYield: number;
  realYield: number;
}