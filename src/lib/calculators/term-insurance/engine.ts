import type { TermInsuranceInput, TermInsuranceOutput } from "./types";

/**
 * Term insurance cover calculation using the Human Life Value (HLV) method.
 *
 * Steps:
 * 1. Inflate monthly expenses over the coverage period to get total future expenses.
 * 2. Add outstanding loans (immediate liability).
 * 3. Add emergency fund = 6 months of current expenses.
 * 4. Subtract existing savings & investments.
 * 5. Subtract existing life insurance cover.
 * 6. Result = additional cover needed.
 *
 * Premium estimate uses a rough rate of ₹800-1200 per ₹1 Cr cover per year
 * for a 30-year-old non-smoker.
 */
export function computeTermInsurance(input: TermInsuranceInput): TermInsuranceOutput {
  const {
    annualIncome,
    monthlyExpenses,
    outstandingLoans,
    numberOfDependants,
    yearsOfCoverage,
    inflationRate,
    existingInsuranceCover,
    savingsInvestments,
  } = input;

  // Step 1: Future value of monthly expenses over the coverage period.
  // We sum inflated annual expenses for each year.
  // Annual expense = monthlyExpenses * 12
  // Each year's expense = base * (1 + inflationRate/100) ^ yearIndex
  // Add 5% incremental cost per dependant beyond 1.
  const dependantMultiplier = 1 + Math.max(0, numberOfDependants - 1) * 0.05;
  const baseAnnualExpense = monthlyExpenses * 12 * dependantMultiplier;
  const inflationFactor = 1 + inflationRate / 100;

  let futureExpenses = 0;
  for (let year = 0; year < yearsOfCoverage; year++) {
    futureExpenses += baseAnnualExpense * Math.pow(inflationFactor, year);
  }
  futureExpenses = Math.round(futureExpenses);

  // Step 2: Outstanding loans
  const totalLoans = outstandingLoans;

  // Step 3: Emergency fund = 6 months of current expenses
  const emergencyFund = Math.round(monthlyExpenses * 6 * dependantMultiplier);

  // Step 4: Total required before subtracting assets
  const totalRequired = futureExpenses + totalLoans + emergencyFund;

  // Step 5: Cover needed
  const coverNeeded = Math.max(
    0,
    Math.round(totalRequired - savingsInvestments - existingInsuranceCover)
  );

  // Premium estimate: ₹800-1200 per ₹1 Cr cover per year
  // Convert to monthly
  const coverInCr = coverNeeded / 10000000;
  const monthlyPremiumLow = Math.round((coverInCr * 800) / 12);
  const monthlyPremiumHigh = Math.round((coverInCr * 1200) / 12);

  // Premium as % of annual income
  const annualPremiumMid = (coverInCr * 1000); // midpoint ₹1000 per Cr
  const premiumAsPercentOfIncome =
    annualIncome > 0
      ? Math.round((annualPremiumMid / annualIncome) * 1000) / 10 // one decimal
      : 0;

  // Coverage adequacy: how many years of current expenses the cover buys
  const currentAnnualExpense = monthlyExpenses * 12;
  const coverageAdequacyYears =
    currentAnnualExpense > 0
      ? Math.round((coverNeeded + existingInsuranceCover + savingsInvestments) / currentAnnualExpense)
      : 0;

  // Existing cover as % of total required
  const existingCoverPercent =
    totalRequired > 0
      ? Math.round((existingInsuranceCover / totalRequired) * 100)
      : 0;

  return {
    coverNeeded,
    futureExpenses,
    emergencyFund,
    totalRequired,
    monthlyPremiumLow,
    monthlyPremiumHigh,
    premiumAsPercentOfIncome,
    coverageAdequacyYears,
    existingCoverPercent,
  };
}