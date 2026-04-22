import type { FIREInput, FIREYearlyPoint, FIREOutput } from "./types";

export function computeFIRE(input: FIREInput): FIREOutput {
  const {
    currentAge, retirementAge, lifeExpectancy,
    monthlyExpenses, currentCorpus, monthlySIP,
    preRetirementReturn, postRetirementReturn,
    preRetirementInflation, postRetirementInflation,
    equityAllocation, glidePathShift,
  } = input;

  const preYears = retirementAge - currentAge;
  const postYears = lifeExpectancy - retirementAge;
  const yearlyData: FIREYearlyPoint[] = [];

  let corpus = currentCorpus;
  let totalContributed = 0;
  let totalGrowth = 0;
  let totalWithdrawn = 0;
  let depleted = false;
  let depletionAge: number | null = null;

  // FIRE number: 25x annual expenses at retirement (4% rule adjusted for inflation)
  const annualExpensesAtRetirement = monthlyExpenses * 12 * Math.pow(1 + preRetirementInflation / 100, preYears);
  const fireNumber = Math.round(annualExpensesAtRetirement * 25);

  // Accumulation phase
  for (let year = 1; year <= preYears; year++) {
    const age = currentAge + year;
    const corpusStart = Math.round(corpus);
    const contribution = monthlySIP * 12;
    totalContributed += contribution;

    const yearReturn = preRetirementReturn / 100;
    const growth = corpus * yearReturn + contribution * yearReturn / 2; // mid-year contribution approximation
    totalGrowth += growth;

    corpus = corpus + contribution + growth;

    yearlyData.push({
      year,
      age,
      phase: "accumulation",
      corpusStart,
      contribution: Math.round(contribution),
      growth: Math.round(growth),
      withdrawal: 0,
      corpusEnd: Math.round(corpus),
      realCorpusEnd: Math.round(corpus / Math.pow(1 + preRetirementInflation / 100, year)),
      equityPct: equityAllocation,
    });
  }

  const corpusAtRetirement = Math.round(corpus);

  // Withdrawal phase with glide path
  for (let year = 1; year <= postYears; year++) {
    const age = retirementAge + year;
    if (corpus <= 0) {
      if (!depleted) {
        depleted = true;
        depletionAge = age - 1;
      }
      break;
    }

    const corpusStart = Math.round(corpus);

    // Glide path: equity decreases linearly from equityAllocation to (equityAllocation - glidePathShift)
    const glideFraction = (year - 1) / Math.max(postYears - 1, 1);
    const currentEquityPct = equityAllocation - glidePathShift * glideFraction;
    const currentDebtPct = 100 - currentEquityPct;

    // Weighted return
    const equityReturn = preRetirementReturn / 100; // Use pre-retirement equity return for equity portion
    const debtReturn = postRetirementReturn / 100 * 0.4; // Debt returns are lower
    const yearReturn = (currentEquityPct / 100) * equityReturn + (currentDebtPct / 100) * debtReturn;

    const growth = corpus * yearReturn;
    totalGrowth += growth;

    // Inflation-adjusted withdrawal (post-retirement inflation)
    const annualWithdrawal = annualExpensesAtRetirement * Math.pow(1 + postRetirementInflation / 100, year - 1);
    totalWithdrawn += annualWithdrawal;

    corpus = corpus + growth - annualWithdrawal;

    if (corpus <= 0 && !depleted) {
      depleted = true;
      depletionAge = age;
    }

    yearlyData.push({
      year: preYears + year,
      age,
      phase: "withdrawal",
      corpusStart,
      contribution: 0,
      growth: Math.round(growth),
      withdrawal: Math.round(annualWithdrawal),
      corpusEnd: Math.round(Math.max(0, corpus)),
      realCorpusEnd: Math.round(Math.max(0, corpus) / Math.pow(1 + postRetirementInflation / 100, preYears + year)),
      equityPct: Math.round(currentEquityPct),
    });
  }

  const final = yearlyData[yearlyData.length - 1];

  return {
    yearlyData,
    fireNumber,
    corpusAtRetirement,
    corpusAtEnd: final?.corpusEnd ?? 0,
    realCorpusAtRetirement: Math.round(corpusAtRetirement / Math.pow(1 + preRetirementInflation / 100, preYears)),
    yearsInRetirement: postYears,
    depleted,
    depletionAge,
    totalContributed: Math.round(totalContributed),
    totalGrowth: Math.round(totalGrowth),
    totalWithdrawn: Math.round(totalWithdrawn),
  };
}