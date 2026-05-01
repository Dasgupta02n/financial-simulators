import type { NPSInput, NPSYearlyPoint, NPSOutput } from "./types";

// Auto Choice lifecycle: equity allocation by age
function autoChoiceEquityPct(age: number): number {
  if (age <= 35) return 75;
  if (age <= 45) return 75 - (age - 35) * 2.5;
  if (age <= 55) return 50 - (age - 45) * 2.5;
  return 25;
}

export function computeNPS(input: NPSInput): NPSOutput {
  const {
    currentAge, retirementAge, monthlyContribution, employerContribution,
    equityReturn, debtReturn, annuityReturn, inflationRate,
  } = input;

  const years = retirementAge - currentAge;
  const yearlyData: NPSYearlyPoint[] = [];
  let corpus = 0;
  let totalContributed = 0;
  let totalGrowth = 0;

  for (let year = 1; year <= years; year++) {
    const age = currentAge + year;
    const monthlyTotal = monthlyContribution + employerContribution;
    const annualContribution = monthlyTotal * 12;
    totalContributed += annualContribution;

    const equityPct = autoChoiceEquityPct(age);
    const debtPct = 100 - equityPct;

    const blendedReturn = (equityPct / 100) * (equityReturn / 100) + (debtPct / 100) * (debtReturn / 100);
    const growth = corpus * blendedReturn + annualContribution * blendedReturn / 2;
    totalGrowth += growth;
    corpus = corpus + annualContribution + growth;

    yearlyData.push({
      year,
      age,
      equityPct,
      contribution: Math.round(annualContribution),
      corpusEnd: Math.round(corpus),
      realCorpusEnd: Math.round(corpus / Math.pow(1 + inflationRate / 100, year)),
    });
  }

  const corpusAtRetirement = Math.round(corpus);
  const realCorpusAtRetirement = Math.round(corpusAtRetirement / Math.pow(1 + inflationRate / 100, years));

  // NPS withdrawal rules: 60% tax-free lumpsum, 40% annuity
  const lumpsumWithdrawal = Math.round(corpusAtRetirement * 0.60);
  const annuityCorpus = Math.round(corpusAtRetirement * 0.40);

  // Annuity: 40% of annuity is taxable (under new regime, annuity income added to other income)
  const monthlyPension = Math.round(annuityCorpus * annuityReturn / 100 / 12);
  const realMonthlyPension = Math.round(monthlyPension / Math.pow(1 + inflationRate / 100, years));
  // Under NPS: 60% lumpsum is tax-free. Annuity is fully taxable as income.
  const annuityTaxable = Math.round(annuityCorpus * annuityReturn / 100); // annual annuity is fully taxable

  return {
    yearlyData,
    corpusAtRetirement,
    realCorpusAtRetirement,
    lumpsumWithdrawal,
    annuityCorpus,
    monthlyPension,
    realMonthlyPension,
    annuityTaxable,
    totalContributed: Math.round(totalContributed),
    totalGrowth: Math.round(totalGrowth),
  };
}