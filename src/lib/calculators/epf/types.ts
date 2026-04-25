export interface EPFInput {
  monthlyBasicSalary: number;
  employeeRate: number;   // percentage, e.g. 12
  employerEpfRate: number; // percentage, e.g. 3.67
  employerEpsRate: number; // percentage, e.g. 8.33
  ageOfEntry: number;
  retirementAge: number;
  annualSalaryIncrease: number; // percentage, e.g. 6
  epfInterestRate: number; // percentage, e.g. 8.25
  inflationRate: number; // percentage, e.g. 6
}

export interface EPFYearRow {
  year: number;
  age: number;
  monthlyBasic: number;
  employeeContribution: number;
  employerEpfContribution: number;
  employerEpsContribution: number;
  totalYearContribution: number;
  openingBalance: number;
  interestEarned: number;
  closingBalance: number;
  realClosingBalance: number;
}

export interface EPFOutput {
  monthlyEmployeeContribution: number;
  monthlyEmployerEpfContribution: number;
  monthlyEmployerEpsContribution: number;
  totalEmployeeContribution: number;
  totalEmployerEpfContribution: number;
  totalInterestEarned: number;
  totalCorpusAtRetirement: number;
  realCorpusAtRetirement: number;
  yearlyBreakdown: EPFYearRow[];
}