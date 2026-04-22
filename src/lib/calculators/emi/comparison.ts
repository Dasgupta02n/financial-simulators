import type { EMIInput, CrossoverResult, AmortizationRow } from "./types";

export function findCrossover(
  input: EMIInput,
  amortization: AmortizationRow[]
): CrossoverResult {
  let prepaidSavedInterest = 0;
  const loanMonths = amortization.length;
  const baseTotalInterest = amortization.reduce((sum, r) => sum + r.interest, 0);

  for (let i = 0; i < amortization.length; i++) {
    const row = amortization[i];
    // Interest saved by prepayment = interest that would have been paid on the
    // outstanding balance differential (standard outstanding - prepaid outstanding)
    const outstandingDiff = (row.outstanding || 0) - (row.prepaidOutstanding || 0);
    const monthlyRate = input.interestRate / 100 / 12;
    prepaidSavedInterest += Math.round(outstandingDiff * monthlyRate);

    const sipCorpus = row.sipCorpus || 0;

    if (sipCorpus > 0 && sipCorpus > prepaidSavedInterest && i > 12) {
      return {
        crossoverMonth: row.month,
        sipCorpusAtCrossover: sipCorpus,
        prepaidSavedAtCrossover: prepaidSavedInterest,
      };
    }
  }

  return {
    crossoverMonth: null,
    sipCorpusAtCrossover: amortization[amortization.length - 1]?.sipCorpus || 0,
    prepaidSavedAtCrossover: prepaidSavedInterest,
  };
}

export function computeSummary(input: EMIInput, amortization: AmortizationRow[]) {
  const totalMonths = amortization.length;
  const baseInterest = amortization.reduce((sum, r) => sum + r.interest, 0);
  const basePayment = amortization.reduce((sum, r) => sum + r.emi, 0);

  // Find prepaid loan end month
  let prepaidEndMonth = totalMonths;
  for (let i = 0; i < amortization.length; i++) {
    if ((amortization[i].prepaidOutstanding || 0) <= 0) {
      prepaidEndMonth = amortization[i].month;
      break;
    }
  }

  // Compute prepaid interest: sum interest only until prepaid loan ends
  const prepaidTotalInterest = amortization
    .filter((r) => r.month <= prepaidEndMonth)
    .reduce((sum, r) => sum + (r.prepaidOutstanding !== undefined ? r.interest : 0), 0);

  const savedInterest = baseInterest - prepaidTotalInterest;
  const monthsSaved = totalMonths - prepaidEndMonth;
  const finalSipCorpus = amortization[amortization.length - 1]?.sipCorpus || 0;
  const finalSipInvested = amortization[amortization.length - 1]?.sipInvested || 0;

  const monthlyRate = input.interestRate / 100 / 12;
  const emi = input.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, input.tenure * 12)
    / (Math.pow(1 + monthlyRate, input.tenure * 12) - 1);

  return {
    emi: Math.round(emi),
    totalInterest: baseInterest,
    totalPayment: basePayment,
    prepaidTotalInterest,
    prepaidSavedInterest: savedInterest,
    prepaidMonthsSaved: monthsSaved,
    sipCorpusAtLoanEnd: finalSipCorpus,
    sipInvestedAtLoanEnd: finalSipInvested,
  };
}