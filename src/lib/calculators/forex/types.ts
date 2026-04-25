export interface ForexInput {
  amountINR: number;
  targetCurrency: string;
  exchangeRate: number;
  holdingYears: number;
  appreciationRate: number;
  taxSlab: number;
  inflationRate: number;
}

export interface ForexYearlyPoint {
  year: number;
  foreignValue: number;
  inrValue: number;
  capitalGainsTax: number;
  tcsAmount: number;
  netAfterTax: number;
  realValue: number;
}

export interface ForexOutput {
  yearlyData: ForexYearlyPoint[];
  initialForeignAmount: number;
  finalForeignAmount: number;
  finalINRValue: number;
  capitalGainsTax: number;
  tcsAmount: number;
  bankSpread: number;
  totalDeductions: number;
  netProceeds: number;
  realValue: number;
  effectiveRate: number;
}

export const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  AED: "UAE Dirham",
  SGD: "Singapore Dollar",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
};

export const RBI_LRS_LIMIT_USD = 250000;