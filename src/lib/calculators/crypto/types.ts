export interface CryptoInput {
  purchasePrice: number;
  quantity: number;
  currentPrice: number;
  holdingYears: number;
  stakingIncome: number;
  taxSlab: number;
  inflationRate: number;
}

export interface CryptoYearlyPoint {
  year: number;
  valueAtPrice: number;
  tax30Pct: number;
  tds1Pct: number;
  realValue: number;
  cumulativeStakingIncome: number;
  stakingTax: number;
}

export interface CryptoOutput {
  yearlyData: CryptoYearlyPoint[];
  totalGains: number;
  taxOnGains: number;
  tdsAmount: number;
  stakingTax: number;
  netAfterTax: number;
  realValueAfterInflation: number;
  effectiveTaxRate: number;
  realReturn: number;
}