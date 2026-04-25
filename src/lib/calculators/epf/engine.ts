import type { EPFInput, EPFOutput, EPFYearRow } from "./types";

const EPS_BASIC_CAP = 15000; // EPS contribution is capped on ₹15,000 basic

export function computeEPF(input: EPFInput): EPFOutput {
  const {
    monthlyBasicSalary,
    employeeRate,
    employerEpfRate,
    employerEpsRate,
    ageOfEntry,
    retirementAge,
    annualSalaryIncrease,
    epfInterestRate,
    inflationRate,
  } = input;

  const years = Math.max(1, retirementAge - ageOfEntry);
  const monthlyIncreaseFactor = 1 + annualSalaryIncrease / 100 / 12;
  const yearlyInterestRate = epfInterestRate / 100;

  let currentBasic = monthlyBasicSalary;
  let totalEmployeeContribution = 0;
  let totalEmployerEpfContribution = 0;
  let totalInterestEarned = 0;
  const yearlyBreakdown: EPFYearRow[] = [];

  // Opening balance for year 1 is 0
  let openingBalance = 0;

  for (let y = 1; y <= years; y++) {
    const age = ageOfEntry + y - 1;

    // Monthly contributions for this year
    const employeeMonthly = currentBasic * (employeeRate / 100);
    // EPS is capped: employer EPS = min(basic, 15000) * epsRate/100
    const epsBasic = Math.min(currentBasic, EPS_BASIC_CAP);
    const employerEpsMonthly = epsBasic * (employerEpsRate / 100);
    // Employer EPF = employer total (12%) - EPS portion; but if basic > 15000,
    // the remainder of the 12% on the excess also goes to EPF
    const employerTotalMonthly = currentBasic * ((employerEpfRate + employerEpsRate) / 100);
    const employerEpfMonthly = employerTotalMonthly - employerEpsMonthly;

    const annualEmployeeContribution = employeeMonthly * 12;
    const annualEmployerEpfContribution = employerEpfMonthly * 12;
    const annualEmployerEpsContribution = employerEpsMonthly * 12;
    const totalYearContribution = annualEmployeeContribution + annualEmployerEpfContribution;

    // Interest: calculated on opening balance + average of year's contributions
    // Simplified: interest on opening balance + half of year's EPF contributions
    // This approximates monthly compounding
    const interestEarned = (openingBalance + totalYearContribution / 2) * yearlyInterestRate;

    const closingBalance = openingBalance + totalYearContribution + interestEarned;

    const inflationFactor = Math.pow(1 + inflationRate / 100, y);
    const realClosingBalance = closingBalance / inflationFactor;

    yearlyBreakdown.push({
      year: y,
      age,
      monthlyBasic: Math.round(currentBasic),
      employeeContribution: Math.round(annualEmployeeContribution),
      employerEpfContribution: Math.round(annualEmployerEpfContribution),
      employerEpsContribution: Math.round(annualEmployerEpsContribution),
      totalYearContribution: Math.round(totalYearContribution),
      openingBalance: Math.round(openingBalance),
      interestEarned: Math.round(interestEarned),
      closingBalance: Math.round(closingBalance),
      realClosingBalance: Math.round(realClosingBalance),
    });

    totalEmployeeContribution += annualEmployeeContribution;
    totalEmployerEpfContribution += annualEmployerEpfContribution;
    totalInterestEarned += interestEarned;

    openingBalance = closingBalance;

    // Increase basic salary for next year
    currentBasic = currentBasic * (1 + annualSalaryIncrease / 100);
  }

  const totalCorpusAtRetirement = Math.round(
    totalEmployeeContribution + totalEmployerEpfContribution + totalInterestEarned
  );
  const finalInflationFactor = Math.pow(1 + inflationRate / 100, years);
  const realCorpusAtRetirement = Math.round(totalCorpusAtRetirement / finalInflationFactor);

  return {
    monthlyEmployeeContribution: Math.round(monthlyBasicSalary * (employeeRate / 100)),
    monthlyEmployerEpfContribution: Math.round(
      monthlyBasicSalary * ((employerEpfRate + employerEpsRate) / 100) -
        Math.min(monthlyBasicSalary, EPS_BASIC_CAP) * (employerEpsRate / 100)
    ),
    monthlyEmployerEpsContribution: Math.round(
      Math.min(monthlyBasicSalary, EPS_BASIC_CAP) * (employerEpsRate / 100)
    ),
    totalEmployeeContribution: Math.round(totalEmployeeContribution),
    totalEmployerEpfContribution: Math.round(totalEmployerEpfContribution),
    totalInterestEarned: Math.round(totalInterestEarned),
    totalCorpusAtRetirement,
    realCorpusAtRetirement,
    yearlyBreakdown,
  };
}