import type { SimpleInterestInput, SimpleInterestOutput, YearlyBreakdown } from "./types";

export function computeSimpleInterest(input: SimpleInterestInput): SimpleInterestOutput {
  const { principal, rate, years, compoundingFrequency } = input;

  // Simple Interest: SI = P × R × T / 100
  const simpleInterest = (principal * rate * years) / 100;
  const totalAmount = principal + simpleInterest;

  // Compound Interest: A = P(1 + r/n)^(nt)
  const r = rate / 100;
  const n = compoundingFrequency;
  const compoundAmount = principal * Math.pow(1 + r / n, n * years);
  const compoundInterest = compoundAmount - principal;

  // Difference
  const difference = compoundInterest - simpleInterest;

  // Year-by-year breakdown
  const yearlyBreakdown: YearlyBreakdown[] = [];
  for (let y = 1; y <= years; y++) {
    const siYear = (principal * rate * y) / 100;
    const ciAmountYear = principal * Math.pow(1 + r / n, n * y);
    const ciYear = ciAmountYear - principal;

    yearlyBreakdown.push({
      year: y,
      simpleInterest: Math.round(siYear),
      simpleAmount: Math.round(principal + siYear),
      compoundInterest: Math.round(ciYear),
      compoundAmount: Math.round(ciAmountYear),
      difference: Math.round(ciYear - siYear),
    });
  }

  return {
    simpleInterest: Math.round(simpleInterest),
    totalAmount: Math.round(totalAmount),
    compoundInterest: Math.round(compoundInterest),
    compoundAmount: Math.round(compoundAmount),
    difference: Math.round(difference),
    yearlyBreakdown,
  };
}