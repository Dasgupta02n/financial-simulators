import {
  TaxInput,
  RegimeResult,
  SlabEntry,
  TaxOutput,
  CrossoverResult,
  OLD_REGIME_SLABS,
  NEW_REGIME_SLABS,
  OLD_STANDARD_DEDUCTION,
  NEW_STANDARD_DEDUCTION,
  MAX_80C,
  MAX_80D,
  MAX_NPS,
  CESS_RATE,
  OLD_87A_THRESHOLD,
  OLD_87A_REBATE,
  NEW_87A_THRESHOLD,
  NEW_87A_MAX_REBATE,
} from "./types";
import { computeSurcharge } from "./surcharge";

function computeTaxOnSlabs(taxableIncome: number, slabs: readonly { from: number; to: number; rate: number }[]): {
  tax: number;
  breakdown: SlabEntry[];
} {
  let totalTax = 0;
  const breakdown: SlabEntry[] = [];

  for (const slab of slabs) {
    if (taxableIncome <= slab.from) break;
    const taxableInSlab = Math.min(taxableIncome, slab.to) - slab.from;
    if (taxableInSlab <= 0) continue;
    const taxInSlab = Math.round(taxableInSlab * slab.rate);
    totalTax += taxInSlab;
    breakdown.push({
      from: slab.from,
      to: slab.to === Infinity ? taxableIncome : slab.to,
      rate: slab.rate,
      taxInSlab,
    });
  }

  return { tax: totalTax, breakdown };
}

function apply87ARebate(
  tax: number,
  taxableIncome: number,
  regime: "old" | "new"
): number {
  if (regime === "old") {
    if (taxableIncome <= OLD_87A_THRESHOLD) {
      return Math.min(tax, OLD_87A_REBATE);
    }
  } else {
    if (taxableIncome <= NEW_87A_THRESHOLD) {
      return Math.min(tax, NEW_87A_MAX_REBATE);
    }
  }
  return 0;
}

function computeRegime(
  input: TaxInput,
  regime: "old" | "new"
): RegimeResult {
  const grossIncome = input.grossSalary;
  const standardDeduction = regime === "old" ? OLD_STANDARD_DEDUCTION : NEW_STANDARD_DEDUCTION;

  let totalDeductions = standardDeduction;
  if (regime === "old") {
    const sec80c = Math.min(input.section80C, MAX_80C);
    const sec80d = Math.min(input.section80D, MAX_80D);
    const nps = Math.min(input.nps80CCD1B, MAX_NPS);
    const hra = input.hraExemption;
    const other = input.otherDeductions;
    totalDeductions += sec80c + sec80d + nps + hra + other;
  }

  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  const slabs = regime === "old" ? OLD_REGIME_SLABS : NEW_REGIME_SLABS;
  const { tax: taxOnSlabs, breakdown } = computeTaxOnSlabs(taxableIncome, slabs);

  const rebate = apply87ARebate(taxOnSlabs, taxableIncome, regime);
  const taxAfterRebate = Math.max(0, taxOnSlabs - rebate);

  const { surcharge, marginalRelief } = computeSurcharge(
    taxableIncome,
    taxAfterRebate,
    regime
  );

  const cess = Math.round((taxAfterRebate + surcharge) * CESS_RATE);
  const totalTax = taxAfterRebate + surcharge + cess;
  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0;

  return {
    regimeName: regime === "old" ? "Old Regime" : "New Regime",
    grossIncome,
    standardDeduction,
    totalDeductions,
    taxableIncome,
    taxBeforeCess: taxAfterRebate,
    surcharge,
    marginalRelief,
    cess,
    totalTax,
    effectiveRate,
    slabBreakdown: breakdown,
  };
}

export function computeTax(input: TaxInput): TaxOutput {
  const oldRegime = computeRegime(input, "old");
  const newRegime = computeRegime(input, "new");
  const crossover = findCrossover(input);

  return { oldRegime, newRegime, crossover };
}

export function findCrossover(input: TaxInput): CrossoverResult {
  const currentDeductions =
    Math.min(input.section80C, MAX_80C) +
    Math.min(input.section80D, MAX_80D) +
    Math.min(input.nps80CCD1B, MAX_NPS) +
    input.hraExemption +
    input.otherDeductions;

  // Binary search for crossover deduction amount
  let lo = 0;
  let hi = input.grossSalary;
  const newRegimeTax = computeRegime(input, "new").totalTax;

  for (let i = 0; i < 50; i++) {
    const mid = Math.round((lo + hi) / 2);
    const testInput: TaxInput = {
      ...input,
      section80C: Math.min(mid, MAX_80C),
      section80D: Math.min(Math.max(0, mid - MAX_80C), MAX_80D),
      nps80CCD1B: Math.min(Math.max(0, mid - MAX_80C - MAX_80D), MAX_NPS),
      hraExemption: Math.max(0, mid - MAX_80C - MAX_80D - MAX_NPS),
      otherDeductions: 0,
    };
    const oldTax = computeRegime(testInput, "old").totalTax;
    if (oldTax > newRegimeTax) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const crossoverDeduction = Math.round((lo + hi) / 2);
  const savings = newRegimeTax - computeRegime(input, "old").totalTax;

  return {
    crossoverDeduction,
    newRegimeTaxAtCrossover: newRegimeTax,
    oldRegimeTaxAtCrossover: computeRegime(
      {
        ...input,
        section80C: Math.min(crossoverDeduction, MAX_80C),
        section80D: Math.min(Math.max(0, crossoverDeduction - MAX_80C), MAX_80D),
        nps80CCD1B: Math.min(Math.max(0, crossoverDeduction - MAX_80C - MAX_80D), MAX_NPS),
        hraExemption: Math.max(0, crossoverDeduction - MAX_80C - MAX_80D - MAX_NPS),
        otherDeductions: 0,
      },
      "old"
    ).totalTax,
    currentDeductions,
    currentSavingsNewOverOld: savings,
    recommendation: savings < 0 ? "new" : "old",
  };
}