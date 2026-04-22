import type { CTCInput, SalaryBreakdown, TaxCalculation, CTCOutput } from "./types";

// New regime slabs FY 2025-26
const NEW_SLABS = [
  { from: 0, to: 400000, rate: 0 },
  { from: 400000, to: 800000, rate: 0.05 },
  { from: 800000, to: 1200000, rate: 0.10 },
  { from: 1200000, to: 1600000, rate: 0.15 },
  { from: 1600000, to: 2000000, rate: 0.20 },
  { from: 2000000, to: 2400000, rate: 0.25 },
  { from: 2400000, to: Infinity, rate: 0.30 },
];

const CESS_RATE = 0.04;

function computeBreakdown(input: CTCInput): SalaryBreakdown {
  const basic = Math.round(input.grossCTC * input.basicPct / 100);
  const hra = Math.round(basic * input.hraPct / 100);
  const lta = Math.round(input.grossCTC * input.ltaPct / 100);
  const npsEmployer = Math.round(input.grossCTC * input.npsEmployerPct / 100);
  const totalFixed = basic + hra + lta + npsEmployer;
  const specialAllowance = Math.round(input.grossCTC - totalFixed);
  return { basic, hra, lta, npsEmployer, specialAllowance, totalFixed, basicPct: input.basicPct, hraPct: input.hraPct };
}

function computeHRAExemption(basic: number, hra: number, actualRentAnnual: number, metro: boolean): number {
  const metroFactor = metro ? 0.5 : 0.4;
  const exemption = Math.min(
    hra, // actual HRA received
    actualRentAnnual - basic * 0.1, // rent minus 10% of basic
    basic * metroFactor, // 50% (metro) or 40% (non-metro) of basic
  );
  return Math.max(0, Math.round(exemption));
}

function computeNewRegimeTax(taxableIncome: number): TaxCalculation {
  const stdDeduction = 75000;
  const taxable = Math.max(0, taxableIncome - stdDeduction);
  let tax = 0;
  let remaining = taxable;
  for (const slab of NEW_SLABS) {
    if (remaining <= 0) break;
    const slabWidth = slab.to === Infinity ? remaining : slab.to - slab.from;
    const taxableInSlab = Math.min(remaining, slabWidth);
    tax += taxableInSlab * slab.rate;
    remaining -= taxableInSlab;
  }
  // Section 87A rebate
  if (taxable <= 1200000) {
    const rebate = Math.min(tax, 60000);
    tax -= rebate;
  }
  const cess = Math.round(tax * CESS_RATE);
  return {
    taxableIncome: taxable,
    tax: Math.round(tax),
    cess,
    totalTax: Math.round(tax + cess),
    effectiveRate: taxableIncome > 0 ? Math.round((tax + cess) / taxableIncome * 10000) / 100 : 0,
  };
}

function computeInHand(ctc: number, breakdown: SalaryBreakup, hraExemption: number, regime: "old" | "new"): number {
  const gross = breakdown.basic + breakdown.hra + breakdown.lta + breakdown.specialAllowance;
  const taxable = regime === "new"
    ? gross - hraExemption // simplified: new regime only allows HRA exemption if relevant
    : gross - hraExemption;
  const taxCalc = computeNewRegimeTax(taxable); // Using new regime for optimization
  return ctc - taxCalc.totalTax;
}

type SalaryBreakup = SalaryBreakdown;

// Optimization: find best HRA% and Basic% combination
function optimizeStructure(input: CTCInput): { breakdown: SalaryBreakdown; hraExemption: number; taxable: number; inHand: number } {
  let bestInHand = 0;
  let bestBreakdown = computeBreakdown(input);
  let bestHRAExemption = 0;
  let bestTaxable = 0;
  let bestInHandVal = 0;

  const actualRentAnnual = input.actualRentMonthly * 12;

  // Search over basic% and hra% combinations
  for (let basicPct = 20; basicPct <= 50; basicPct += 2) {
    for (let hraPct = 10; hraPct <= 50; hraPct += 5) {
      const testInput = { ...input, basicPct, hraPct };
      const bd = computeBreakdown(testInput);
      const hraEx = computeHRAExemption(bd.basic, bd.hra, actualRentAnnual, input.metroCity);

      const gross = bd.basic + bd.hra + bd.lta + bd.specialAllowance;
      const taxable = Math.max(0, gross - hraEx - 75000); // new regime std deduction
      const taxCalc = computeNewRegimeTax(taxable);
      const inHand = input.grossCTC - taxCalc.totalTax;

      if (inHand > bestInHand) {
        bestInHand = inHand;
        bestBreakdown = bd;
        bestHRAExemption = hraEx;
        bestTaxable = taxable;
        bestInHandVal = inHand;
      }
    }
  }

  return { breakdown: bestBreakdown, hraExemption: bestHRAExemption, taxable: bestTaxable, inHand: bestInHandVal };
}

export function computeCTC(input: CTCInput): CTCOutput {
  const breakdown = computeBreakdown(input);
  const actualRentAnnual = input.actualRentMonthly * 12;
  const hraExemption = computeHRAExemption(breakdown.basic, breakdown.hra, actualRentAnnual, input.metroCity);

  const gross = breakdown.basic + breakdown.hra + breakdown.lta + breakdown.specialAllowance;
  const taxableIncome = Math.max(0, gross - hraExemption - 75000);
  const tax = computeNewRegimeTax(taxableIncome);
  const inHandAnnual = input.grossCTC - tax.totalTax;

  const optimized = optimizeStructure(input);
  const optimizedTax = computeNewRegimeTax(optimized.taxable);

  return {
    breakdown,
    hraExemption,
    taxableIncome,
    tax,
    inHandAnnual: Math.round(inHandAnnual),
    inHandMonthly: Math.round(inHandAnnual / 12),
    optimizedBreakdown: optimized.breakdown,
    optimizedHRAExemption: optimized.hraExemption,
    optimizedTaxableIncome: optimized.taxable,
    optimizedTax,
    optimizedInHandAnnual: Math.round(optimized.inHand),
    optimizedInHandMonthly: Math.round(optimized.inHand / 12),
    savingsAnnual: Math.round(optimized.inHand - inHandAnnual),
    savingsMonthly: Math.round((optimized.inHand - inHandAnnual) / 12),
  };
}