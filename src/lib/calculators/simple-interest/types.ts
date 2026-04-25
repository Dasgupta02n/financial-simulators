export interface SimpleInterestInput {
  principal: number;
  rate: number;
  years: number;
  compoundingFrequency: number; // times per year: 1=annual, 2=semi-annual, 4=quarterly, 12=monthly
}

export interface YearlyBreakdown {
  year: number;
  simpleInterest: number;
  simpleAmount: number;
  compoundInterest: number;
  compoundAmount: number;
  difference: number;
}

export interface SimpleInterestOutput {
  simpleInterest: number;
  totalAmount: number;
  compoundInterest: number;
  compoundAmount: number;
  difference: number;
  yearlyBreakdown: YearlyBreakdown[];
}