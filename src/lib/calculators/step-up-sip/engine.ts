import type { StepUpSIPInput, StepUpSIPOutput } from "./types";

const LTCG_EXEMPTION = 125000;
const LTCG_RATE = 0.125;

export function computeStepUpSIP(input: StepUpSIPInput): StepUpSIPOutput {
  const { monthlySIP, annualStepUp, returnRate, tenureYears, inflationRate } = input;

  const monthlyReturn = returnRate / 100 / 12;
  const totalMonths = tenureYears * 12;

  let currentSIP = monthlySIP;
  let totalInvested = 0;
  let nominalCorpus = 0;
  const yearlyBreakdown: StepUpSIPOutput["yearlyBreakdown"] = [];

  for (let month = 1; month <= totalMonths; month++) {
    // Step up SIP every 12 months
    if (month > 1 && (month - 1) % 12 === 0) {
      currentSIP = currentSIP * (1 + annualStepUp / 100);
    }
    totalInvested += currentSIP;
    nominalCorpus = nominalCorpus * (1 + monthlyReturn) + currentSIP;

    if (month % 12 === 0) {
      yearlyBreakdown.push({
        year: month / 12,
        sipAmount: Math.round(currentSIP),
        investedSoFar: Math.round(totalInvested),
        nominalValue: Math.round(nominalCorpus),
      });
    }
  }

  // Regular SIP (no step-up)
  let regularCorpus = 0;
  let regularInvested = 0;
  for (let month = 1; month <= totalMonths; month++) {
    regularInvested += monthlySIP;
    regularCorpus = regularCorpus * (1 + monthlyReturn) + monthlySIP;
  }

  // Inflation-adjusted real corpus
  const inflationFactor = Math.pow(1 + inflationRate / 100, tenureYears);
  const realCorpus = nominalCorpus / inflationFactor;

  // LTCG tax on gains
  const gains = nominalCorpus - totalInvested;
  const taxableGains = Math.max(0, gains - LTCG_EXEMPTION);
  const ltcgTax = taxableGains * LTCG_RATE;
  const afterLTCG = nominalCorpus - ltcgTax;

  const stepUpGainVsRegular = nominalCorpus - regularCorpus;

  return {
    totalInvested: Math.round(totalInvested),
    nominalCorpus: Math.round(nominalCorpus),
    realCorpus: Math.round(realCorpus),
    afterLTCG: Math.round(afterLTCG),
    regularCorpus: Math.round(regularCorpus),
    regularInvested: Math.round(regularInvested),
    stepUpGainVsRegular: Math.round(stepUpGainVsRegular),
    yearlyBreakdown,
  };
}