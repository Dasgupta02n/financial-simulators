export interface FDInput {
  principal: number;
  tenure: number;
  interestRate: number;
  compoundingFreq: number; // times per year (1=annual, 4=quarterly, 12=monthly)
  taxSlab: number; // marginal tax rate %
  inflationRate: number;
}

export interface FDYearlyPoint {
  year: number;
  grossValue: number;
  postTaxValue: number;
  realValue: number;
  grossInterest: number;
  postTaxInterest: number;
  realYield: number;
}

export interface FDOutput {
  yearlyData: FDYearlyPoint[];
  maturityGross: number;
  maturityPostTax: number;
  maturityReal: number;
  totalInterestGross: number;
  totalInterestPostTax: number;
  postTaxYield: number;
  realYield: number;
}