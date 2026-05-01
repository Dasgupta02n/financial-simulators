import type { FDInput, FDYearlyPoint, FDOutput } from "./types";

export function computeFD(input: FDInput): FDOutput {
  const { principal, tenure, interestRate, compoundingFreq, taxSlab, inflationRate } = input;
  const ratePerPeriod = interestRate / 100 / compoundingFreq;
  const taxRate = taxSlab / 100;
  const yearlyData: FDYearlyPoint[] = [];

  let grossValue = principal;

  for (let year = 1; year <= tenure; year++) {
    // Compound for this year
    grossValue = grossValue * Math.pow(1 + ratePerPeriod, compoundingFreq);
    const grossInterest = grossValue - principal;

    // Post-tax: compute value after taxing interest each year
    let postTaxValue = principal;
    for (let y = 1; y <= year; y++) {
      const prevPTValue = y === 1 ? principal : yearlyData[y - 2].postTaxValue;
      const ptInterest = prevPTValue * (Math.pow(1 + ratePerPeriod, compoundingFreq) - 1);
      postTaxValue = prevPTValue + ptInterest * (1 - taxRate);
    }

    const realValue = postTaxValue / Math.pow(1 + inflationRate / 100, year);
    const realYield = year === 0 ? 0 : (((postTaxValue / principal) ** (1 / year) - 1) * 100) - inflationRate;

    yearlyData.push({
      year,
      grossValue: Math.round(grossValue),
      postTaxValue: Math.round(postTaxValue),
      realValue: Math.round(realValue),
      grossInterest: Math.round(grossInterest),
      postTaxInterest: Math.round(grossInterest * (1 - taxRate)),
      realYield: Math.round(realYield * 100) / 100,
    });
  }

  const final = yearlyData[yearlyData.length - 1];
  const totalInterestGross = final.grossInterest;
  const totalInterestPostTax = final.postTaxInterest;
  const postTaxYield = ((final.postTaxValue / principal) ** (1 / tenure) - 1) * 100;
  const realYield = postTaxYield - inflationRate;

  return {
    yearlyData,
    maturityGross: final.grossValue,
    maturityPostTax: final.postTaxValue,
    maturityReal: final.realValue,
    totalInterestGross,
    totalInterestPostTax,
    postTaxYield: Math.round(postTaxYield * 100) / 100,
    realYield: Math.round(realYield * 100) / 100,
  };
}