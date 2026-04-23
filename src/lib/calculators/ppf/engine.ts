import type { PPFInput, PPFYearlyPoint, PPFOutput } from "./types";

export function computePPF(input: PPFInput): PPFOutput {
  const { yearlyContribution, interestRate, inflationRate, tenure } = input;
  const annualRate = interestRate / 100;
  const inflationFactor = inflationRate / 100;
  const yearlyData: PPFYearlyPoint[] = [];

  let balance = 0;
  let totalInvested = 0;

  for (let year = 1; year <= tenure; year++) {
    // Interest on opening balance + contribution (simplified: contribution at start of year)
    balance = (balance + yearlyContribution) * (1 + annualRate);
    totalInvested += yearlyContribution;

    const interestThisYear = balance - totalInvested;
    const realValue = balance / Math.pow(1 + inflationFactor, year);

    yearlyData.push({
      year,
      invested: totalInvested,
      interestEarned: Math.round(interestThisYear),
      nominalValue: Math.round(balance),
      realValue: Math.round(realValue),
    });
  }

  const final = yearlyData[yearlyData.length - 1];
  const effectiveYield = tenure > 0 ? (Math.pow(final.nominalValue / totalInvested, 1 / tenure) - 1) * 100 : 0;
  const realYield = effectiveYield - inflationRate;

  return {
    yearlyData,
    totalInvested,
    totalInterest: final.interestEarned,
    maturityValue: final.nominalValue,
    realMaturityValue: final.realValue,
    effectiveYield: Math.round(effectiveYield * 100) / 100,
    realYield: Math.round(realYield * 100) / 100,
  };
}