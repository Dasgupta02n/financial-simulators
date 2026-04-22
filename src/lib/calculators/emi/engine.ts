import type { EMIInput, AmortizationRow, RateShift } from "./types";

function getMonthlyRate(annualRate: number): number {
  return annualRate / 100 / 12;
}

function getEMI(principal: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return principal * monthlyRate * factor / (factor - 1);
}

export function getEffectiveRate(
  baseRate: number,
  shift: RateShift,
  currentMonth: number
): number {
  if (!shift.enabled || shift.shifts.length === 0) return baseRate;
  let bpsTotal = 0;
  for (const s of shift.shifts) {
    if (currentMonth > s.afterYear * 12) {
      bpsTotal += s.bpsChange;
    }
  }
  return baseRate + bpsTotal / 100;
}

export function computeAmortization(
  input: EMIInput,
  rateShift: RateShift
): AmortizationRow[] {
  const rows: AmortizationRow[] = [];
  const totalMonths = input.tenure * 12;
  let outstanding = input.loanAmount;
  let prepaidOutstanding = input.loanAmount;
  let sipAccumulated = 0;
  let sipMonthlyRate = input.sipReturnRate / 100 / 12;

  for (let month = 1; month <= totalMonths && outstanding > 0; month++) {
    const currentRate = getEffectiveRate(input.interestRate, rateShift, month);
    const monthlyRate = getMonthlyRate(currentRate);

    // Standard EMI path
    const interestPortion = outstanding * monthlyRate;
    const remainingMonths = totalMonths - month + 1;
    const emi = getEMI(input.loanAmount, monthlyRate, totalMonths);
    const principalPortion = Math.min(emi - interestPortion, outstanding);
    outstanding = Math.max(0, outstanding - principalPortion);

    // Prepayment path
    let prepaidInterest = 0;
    let prepaidPrincipal = 0;
    let prepaidEmi = 0;
    if (prepaidOutstanding > 0) {
      prepaidInterest = prepaidOutstanding * monthlyRate;
      prepaidEmi = getEMI(input.loanAmount, monthlyRate, totalMonths);
      prepaidPrincipal = Math.min(
        prepaidEmi - prepaidInterest + input.extraMonthlyCash,
        prepaidOutstanding
      );
      prepaidOutstanding = Math.max(0, prepaidOutstanding - prepaidPrincipal);
    }

    // SIP path
    sipAccumulated = (sipAccumulated + input.extraMonthlyCash) * (1 + sipMonthlyRate);

    if (outstanding <= 0.01 && prepaidOutstanding <= 0.01) break;

    rows.push({
      month,
      emi: Math.round(emi),
      principal: Math.round(principalPortion),
      interest: Math.round(interestPortion),
      outstanding: Math.round(outstanding),
      prepaidPrincipal: Math.round(prepaidPrincipal),
      prepaidOutstanding: Math.round(prepaidOutstanding),
      sipInvested: Math.round(input.extraMonthlyCash * month),
      sipCorpus: Math.round(sipAccumulated),
    });
  }

  return rows;
}