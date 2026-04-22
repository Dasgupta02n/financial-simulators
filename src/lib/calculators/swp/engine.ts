import type { SWPInput, SWPYearlyPoint, SWPOutput } from "./types";

export function computeSWP(input: SWPInput): SWPOutput {
  const { corpus, monthlyWithdrawal, returnRate, tenure, inflationRate, crashEnabled, crashSeverity, crashYear, crashDuration } = input;
  const monthlyRate = returnRate / 100 / 12;
  const yearlyData: SWPYearlyPoint[] = [];

  let corpusNominal = corpus;
  let corpusStress = crashEnabled ? corpus : 0;
  let stressDepleted = false;
  let stressYearsLasted = tenure;
  let nominalDepleted = false;
  let nominalYearsLasted = tenure;
  let totalWithdrawn = 0;
  let totalGrowth = 0;

  for (let year = 1; year <= tenure; year++) {
    const corpusStart = Math.round(corpusNominal);
    const stressCorpusStart = Math.round(corpusStress);

    // Inflation-adjusted withdrawal for this year
    const annualWithdrawal = monthlyWithdrawal * 12 * Math.pow(1 + inflationRate / 100, year - 1);
    totalWithdrawn += annualWithdrawal;

    // Nominal path: grow corpus then withdraw
    const growthBeforeWithdrawal = corpusNominal * Math.pow(1 + monthlyRate, 12);
    const growth = growthBeforeWithdrawal - corpusNominal;
    totalGrowth += growth;
    corpusNominal = growthBeforeWithdrawal - annualWithdrawal;

    if (corpusNominal <= 0 && !nominalDepleted) {
      nominalDepleted = true;
      nominalYearsLasted = year;
    }

    const corpusEnd = Math.round(Math.max(0, corpusNominal));
    const realCorpusEnd = Math.round(corpusEnd / Math.pow(1 + inflationRate / 100, year));

    // Stress path
    let stressCorpusEnd: number | undefined;
    if (crashEnabled && !stressDepleted) {
      let stressGrowth = corpusStress * Math.pow(1 + monthlyRate, 12);
      // Inject crash
      if (year >= crashYear && year < crashYear + crashDuration) {
        stressGrowth *= (1 - crashSeverity);
      }
      corpusStress = stressGrowth - annualWithdrawal;
      if (corpusStress <= 0 && !stressDepleted) {
        stressDepleted = true;
        stressYearsLasted = year;
      }
      stressCorpusEnd = Math.round(Math.max(0, corpusStress));
    }

    yearlyData.push({
      year,
      corpusStart,
      withdrawal: Math.round(annualWithdrawal),
      growth: Math.round(growth),
      corpusEnd,
      realCorpusEnd,
      stressCorpusEnd,
    });

    if (nominalDepleted && (!crashEnabled || stressDepleted)) break;
  }

  const final = yearlyData[yearlyData.length - 1];
  return {
    yearlyData,
    finalCorpus: final.corpusEnd,
    finalRealCorpus: final.realCorpusEnd,
    yearsLasted: nominalDepleted ? nominalYearsLasted : tenure,
    depleted: nominalDepleted,
    totalWithdrawn: Math.round(totalWithdrawn),
    totalGrowth: Math.round(totalGrowth),
    stressFinalCorpus: crashEnabled ? (yearlyData[yearlyData.length - 1].stressCorpusEnd ?? 0) : undefined,
    stressYearsLasted: crashEnabled ? (stressDepleted ? stressYearsLasted : tenure) : undefined,
    stressDepleted: crashEnabled ? stressDepleted : undefined,
  };
}