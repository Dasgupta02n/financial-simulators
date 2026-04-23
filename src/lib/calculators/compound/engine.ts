import type { CompoundInput, CompoundYearlyPoint, CompoundOutput } from "./types";

export function computeCompound(input: CompoundInput): CompoundOutput {
  const { principal, monthlyContribution, annualRate, tenure, compoundingFreq, inflationRate, taxSlab } = input;
  const ratePerPeriod = annualRate / 100 / compoundingFreq;
  const periodsPerYear = compoundingFreq;
  const taxRate = taxSlab / 100;
  const yearlyData: CompoundYearlyPoint[] = [];

  let totalInvested = principal;
  let nominalValue = principal;

  for (let year = 1; year <= tenure; year++) {
    // Compound existing value for this year
    nominalValue = nominalValue * Math.pow(1 + ratePerPeriod, periodsPerYear);

    // Add monthly contributions compounded for remaining months
    if (monthlyContribution > 0) {
      for (let month = 1; month <= 12; month++) {
        const monthsRemaining = 12 - month;
        nominalValue += monthlyContribution * Math.pow(1 + annualRate / 100 / 12, monthsRemaining);
        totalInvested += monthlyContribution;
      }
    }

    // Post-tax: tax on gains above principal + contributions
    const gains = nominalValue - totalInvested;
    const postTaxValue = totalInvested + gains * (1 - taxRate);
    const realValue = postTaxValue / Math.pow(1 + inflationRate / 100, year);

    yearlyData.push({
      year,
      invested: Math.round(totalInvested),
      nominalValue: Math.round(nominalValue),
      postTaxValue: Math.round(postTaxValue),
      realValue: Math.round(realValue),
    });
  }

  const final = yearlyData[yearlyData.length - 1];
  const nominalYield = tenure > 0 ? (Math.pow(final.nominalValue / totalInvested, 1 / tenure) - 1) * 100 : 0;
  const realYield = nominalYield - inflationRate;

  return {
    yearlyData,
    totalInvested: Math.round(totalInvested),
    maturityNominal: final.nominalValue,
    maturityPostTax: final.postTaxValue,
    maturityReal: final.realValue,
    nominalYield: Math.round(nominalYield * 100) / 100,
    realYield: Math.round(realYield * 100) / 100,
  };
}