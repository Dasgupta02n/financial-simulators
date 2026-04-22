import type { AccumulatorInput, YearlyAccumulationPoint, AccumulatorOutput } from "./types";

export function computeAccumulation(input: AccumulatorInput): AccumulatorOutput {
  const { lumpsum, sipMonthly, returnRate, tenure, stepUpMode, stepUpValue, inflationRate } = input;
  const monthlyRate = returnRate / 100 / 12;
  const yearlyData: YearlyAccumulationPoint[] = [];

  let lumpsumValue = lumpsum;
  let sipCorpus = 0;
  let sipInvested = 0;

  for (let year = 1; year <= tenure; year++) {
    // Compute monthly SIP for this year
    let currentSip: number;
    if (stepUpMode === "percentage") {
      currentSip = sipMonthly * Math.pow(1 + stepUpValue / 100, year - 1);
    } else {
      currentSip = sipMonthly + stepUpValue * (year - 1);
    }

    // Compound lumpsum through 12 months
    for (let m = 0; m < 12; m++) {
      lumpsumValue = lumpsumValue * (1 + monthlyRate);
    }

    // Compound SIP through 12 months
    for (let m = 0; m < 12; m++) {
      sipCorpus = (sipCorpus + currentSip) * (1 + monthlyRate);
      sipInvested += currentSip;
    }

    const nominalTotal = lumpsumValue + sipCorpus;
    const realTotal = nominalTotal / Math.pow(1 + inflationRate / 100, year);

    yearlyData.push({
      year,
      lumpsumValue: Math.round(lumpsumValue),
      sipCorpus: Math.round(sipCorpus),
      sipInvested: Math.round(sipInvested),
      nominalTotal: Math.round(nominalTotal),
      realTotal: Math.round(realTotal),
    });
  }

  const final = yearlyData[yearlyData.length - 1];
  const totalInvested = Math.round(lumpsum + final.sipInvested);

  return {
    yearlyData,
    finalLumpsum: final.lumpsumValue,
    finalSipCorpus: final.sipCorpus,
    finalSipInvested: final.sipInvested,
    finalNominalTotal: final.nominalTotal,
    finalRealTotal: final.realTotal,
    totalInvested,
  };
}