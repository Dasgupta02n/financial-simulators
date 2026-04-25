import type { SIPInput, YearlyDataPoint } from "./types";
import { getYearlySIP } from "./step-up";
import { applyLTCG } from "./tax";

export function computeSIP(input: SIPInput): YearlyDataPoint[] {
  const monthlyRate = input.returnRate / 100 / 12;
  const totalMonths = input.tenure * 12;
  const yearlyData: YearlyDataPoint[] = [];

  let lumpsumValue = input.lumpsum;
  let sipAccumulated = 0;
  let totalInvested = 0;

  for (let month = 1; month <= totalMonths; month++) {
    const currentYear = Math.ceil(month / 12);
    const currentSIP = getYearlySIP(
      input.monthlySIP,
      currentYear - 1,
      input.stepUpMode,
      input.stepUpValue
    );

    lumpsumValue *= 1 + monthlyRate;
    sipAccumulated = (sipAccumulated + currentSIP) * (1 + monthlyRate);
    totalInvested += currentSIP;

    if (month % 12 === 0) {
      const nominalCorpus = lumpsumValue + sipAccumulated;
      const inflationFactor = Math.pow(1 + input.inflationRate / 100, currentYear);
      const totalInvestedSoFar = totalInvested + input.lumpsum;
      const { postTaxCorpus } = applyLTCG(nominalCorpus, totalInvestedSoFar);
      yearlyData.push({
        year: currentYear,
        invested: totalInvestedSoFar,
        nominalCorpus,
        realCorpus: nominalCorpus / inflationFactor,
        postTaxCorpus,
      });
    }
  }

  return yearlyData;
}