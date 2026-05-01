import type { SalaryInput, SalaryOutput, CTCBreakdown, TaxBreakdown } from "./types";

// New regime slabs (FY 2025-26)
const NEW_SLABS = [
  { from: 0, to: 400000, rate: 0 },
  { from: 400000, to: 800000, rate: 0.05 },
  { from: 800000, to: 1200000, rate: 0.10 },
  { from: 1200000, to: 1600000, rate: 0.15 },
  { from: 1600000, to: 2000000, rate: 0.20 },
  { from: 2000000, to: 2500000, rate: 0.25 },
  { from: 2500000, to: Infinity, rate: 0.30 },
];

// Old regime slabs
const OLD_SLABS = [
  { from: 0, to: 250000, rate: 0 },
  { from: 250000, to: 500000, rate: 0.05 },
  { from: 500000, to: 1000000, rate: 0.20 },
  { from: 1000000, to: Infinity, rate: 0.30 },
];

const CESS_RATE = 0.04;
const PROFESSIONAL_TAX_ANNUAL = 2400;

function computeBreakdown(input: SalaryInput): CTCBreakdown {
  const { ctc, basicPct, bonusPct, metroCity } = input;

  const basic = Math.round(ctc * basicPct / 100);
  const hraPercent = metroCity ? 50 : 40;
  const hra = Math.round(basic * hraPercent / 100);
  const employerPF = Math.round(basic * 0.12);
  const bonus = Math.round(ctc * bonusPct / 100);
  const totalFixed = basic + hra + employerPF + bonus;
  const specialAllowance = Math.max(0, Math.round(ctc - totalFixed));
  const grossSalary = basic + hra + specialAllowance + bonus;

  return { basic, hra, specialAllowance, bonus, employerPF, grossSalary };
}

function computeTaxOnSlabs(
  taxableIncome: number,
  slabs: readonly { from: number; to: number; rate: number }[]
): { tax: number; slabEntries: { from: number; to: number; rate: number; tax: number }[] } {
  let totalTax = 0;
  const slabEntries: { from: number; to: number; rate: number; tax: number }[] = [];

  for (const slab of slabs) {
    if (taxableIncome <= slab.from) break;
    const taxableInSlab = Math.min(taxableIncome, slab.to === Infinity ? taxableIncome : slab.to) - slab.from;
    if (taxableInSlab <= 0) continue;
    const taxInSlab = Math.round(taxableInSlab * slab.rate);
    totalTax += taxInSlab;
    slabEntries.push({
      from: slab.from,
      to: slab.to === Infinity ? taxableIncome : slab.to,
      rate: slab.rate,
      tax: taxInSlab,
    });
  }

  return { tax: totalTax, slabEntries };
}

function computeTax(
  grossSalary: number,
  employeePF: number,
  regime: "old" | "new"
): TaxBreakdown {
  const standardDeduction = regime === "new" ? 75000 : 50000;
  const totalDeductions = standardDeduction + employeePF + PROFESSIONAL_TAX_ANNUAL;
  const taxableIncome = Math.max(0, grossSalary - totalDeductions);

  const slabs = regime === "new" ? NEW_SLABS : OLD_SLABS;
  const { tax: taxBeforeCess, slabEntries } = computeTaxOnSlabs(taxableIncome, slabs);

  // Section 87A rebate
  let rebate = 0;
  if (regime === "new" && taxableIncome <= 1200000) {
    rebate = Math.min(taxBeforeCess, 60000);
  } else if (regime === "old" && taxableIncome <= 500000) {
    rebate = Math.min(taxBeforeCess, 12500);
  }

  const taxAfterRebate = Math.max(0, taxBeforeCess - rebate);
  const cess = Math.round(taxAfterRebate * CESS_RATE);
  const totalTax = taxAfterRebate + cess;
  const effectiveRate = grossSalary > 0 ? Math.round(totalTax / grossSalary * 10000) / 100 : 0;

  return {
    slabEntries,
    taxBeforeCess: taxAfterRebate,
    rebate,
    cess,
    totalTax,
    effectiveRate,
  };
}

export function computeSalary(input: SalaryInput): SalaryOutput {
  const breakdown = computeBreakdown(input);

  const employeePF = Math.round(breakdown.basic * 0.12);
  const professionalTax = PROFESSIONAL_TAX_ANNUAL;
  const tax = computeTax(breakdown.grossSalary, employeePF, input.regime);

  const standardDeduction = input.regime === "new" ? 75000 : 50000;
  const totalDeductions = employeePF + professionalTax + tax.totalTax;

  const annualInHand = breakdown.grossSalary - totalDeductions;
  const monthlyInHand = Math.round(annualInHand / 12);
  const monthlyGross = Math.round(breakdown.grossSalary / 12);

  const pieData = [
    { name: "Basic", value: breakdown.basic },
    { name: "HRA", value: breakdown.hra },
    { name: "Special Allow.", value: breakdown.specialAllowance },
    { name: "Bonus", value: breakdown.bonus },
    { name: "Employer PF", value: breakdown.employerPF },
  ];

  return {
    breakdown,
    deductions: {
      employeePF,
      professionalTax,
      incomeTax: tax.totalTax,
      totalDeductions,
    },
    taxableIncome: Math.max(0, breakdown.grossSalary - standardDeduction - employeePF - professionalTax),
    standardDeduction,
    tax,
    monthlyGross,
    annualGross: breakdown.grossSalary,
    monthlyInHand,
    annualInHand,
    pieData,
  };
}