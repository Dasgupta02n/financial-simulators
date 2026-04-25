import type { TruthResult } from "./types";
import {
  FY_YEAR,
  INFLATION_RATE,
  LAST_UPDATED,
  computeLTCG,
} from "./assumptions";

/* ── SIP ─────────────────────────────────────── */

interface SIPPartial {
  totalInvested: number;
  nominalCorpus: number;
  realCorpus: number;
  postTaxCorpus?: number;
  ltcgTax?: number;
}

export function truthFromSIP(r: SIPPartial, inflationRate = INFLATION_RATE): TruthResult {
  const gains = r.nominalCorpus - r.totalInvested;
  const ltcg = computeLTCG(gains);
  const postTax = r.nominalCorpus - ltcg.tax;
  const inflationFactor = Math.pow(1 + inflationRate / 100, 1);
  const realPostTax = postTax / inflationFactor;

  return {
    grossLabel: "Mutual fund tells you",
    grossValue: r.nominalCorpus,
    realLabel: "You actually keep",
    realValue: Math.round(realPostTax),
    deductions: [
      { label: `After inflation (${inflationRate}%)`, amount: Math.round(r.nominalCorpus - r.realCorpus) },
      { label: "After LTCG tax", amount: Math.round(ltcg.tax) },
    ],
    assumptions: [
      `Inflation: ${inflationRate}% (RBI 10-yr avg)`,
      `LTCG tax: 12.5% above ₹1.25L exemption`,
      "Returns assumed constant — actual market returns vary",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate,
    lastUpdated: LAST_UPDATED,
  };
}

/* ── FD ─────────────────────────────────────── */

interface FDPartial {
  maturityGross: number;
  maturityPostTax: number;
  maturityReal: number;
  totalInterestGross: number;
}

export function truthFromFD(r: FDPartial, inflationRate = INFLATION_RATE): TruthResult {
  return {
    grossLabel: "Bank shows you",
    grossValue: r.maturityGross,
    realLabel: "You actually keep",
    realValue: r.maturityReal,
    deductions: [
      { label: "Tax on interest", amount: Math.round(r.maturityGross - r.maturityPostTax) },
      { label: `Inflation erosion (${inflationRate}%)`, amount: Math.round(r.maturityPostTax - r.maturityReal) },
    ],
    assumptions: [
      `Interest taxed at your slab rate`,
      `Inflation: ${inflationRate}% (RBI 10-yr avg)`,
      "FD interest fully taxable — no exemption",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate,
    lastUpdated: LAST_UPDATED,
  };
}

/* ── Compound Interest ──────────────────────── */

interface CompoundPartial {
  totalInvested: number;
  maturityNominal: number;
  maturityPostTax: number;
  maturityReal: number;
}

export function truthFromCompound(r: CompoundPartial, inflationRate = INFLATION_RATE): TruthResult {
  const taxDeduction = r.maturityNominal - r.maturityPostTax;
  const inflationDeduction = r.maturityPostTax - r.maturityReal;

  return {
    grossLabel: "Nominal value",
    grossValue: r.maturityNominal,
    realLabel: "You actually keep",
    realValue: r.maturityReal,
    deductions: [
      { label: "Tax on gains", amount: Math.round(taxDeduction) },
      { label: `Inflation erosion (${inflationRate}%)`, amount: Math.round(inflationDeduction) },
    ],
    assumptions: [
      `Gains taxed at your slab rate`,
      `Inflation: ${inflationRate}% (RBI 10-yr avg)`,
      "Compounding frequency affects final amount",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate,
    lastUpdated: LAST_UPDATED,
  };
}

/* ── PPF (tax-free) ─────────────────────────── */

interface PPFPartial {
  totalInvested: number;
  maturityValue: number;
  realMaturityValue: number;
}

export function truthFromPPF(r: PPFPartial, inflationRate = INFLATION_RATE): TruthResult {
  return {
    grossLabel: "PPF maturity value",
    grossValue: r.maturityValue,
    realLabel: "Real purchasing power",
    realValue: r.realMaturityValue,
    deductions: [
      { label: "Tax on gains", amount: 0 },
      { label: `Inflation erosion (${inflationRate}%)`, amount: Math.round(r.maturityValue - r.realMaturityValue) },
    ],
    assumptions: [
      "PPF is fully tax-exempt (EEE status)",
      `Inflation: ${inflationRate}% (RBI 10-yr avg)`,
      "15-year lock-in, partial withdrawal after 7 years",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate,
    lastUpdated: LAST_UPDATED,
  };
}

/* ── SWP ─────────────────────────────────────── */

interface SWPPartial {
  finalCorpus: number;
  finalRealCorpus: number;
  totalWithdrawn: number;
}

export function truthFromSWP(r: SWPPartial, inflationRate = INFLATION_RATE): TruthResult {
  return {
    grossLabel: "Remaining corpus (nominal)",
    grossValue: r.finalCorpus,
    realLabel: "Real purchasing power",
    realValue: r.finalRealCorpus,
    deductions: [
      { label: `Inflation erosion (${inflationRate}%)`, amount: Math.round(r.finalCorpus - r.finalRealCorpus) },
    ],
    assumptions: [
      `Inflation: ${inflationRate}% (RBI 10-yr avg)`,
      "Withdrawals increase with inflation annually",
      "SWP gains taxed as per holding period",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate,
    lastUpdated: LAST_UPDATED,
  };
}

/* ── Accumulator ─────────────────────────────── */

interface AccumPartial {
  totalInvested: number;
  finalNominalTotal: number;
  finalRealTotal: number;
}

export function truthFromAccumulator(r: AccumPartial, inflationRate = INFLATION_RATE): TruthResult {
  const gains = r.finalNominalTotal - r.totalInvested;
  const ltcg = computeLTCG(gains);
  const postTax = r.finalNominalTotal - ltcg.tax;
  const inflationFactor = Math.pow(1 + inflationRate / 100, 1);
  const realPostTax = postTax / inflationFactor;

  return {
    grossLabel: "Nominal corpus",
    grossValue: r.finalNominalTotal,
    realLabel: "You actually keep",
    realValue: Math.round(realPostTax),
    deductions: [
      { label: `After inflation (${inflationRate}%)`, amount: Math.round(r.finalNominalTotal - r.finalRealTotal) },
      { label: "After LTCG tax", amount: Math.round(ltcg.tax) },
    ],
    assumptions: [
      `Inflation: ${inflationRate}% (RBI 10-yr avg)`,
      `LTCG tax: 12.5% above ₹1.25L exemption`,
      "Assumes equity-class gains treatment",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate,
    lastUpdated: LAST_UPDATED,
  };
}

/* ── FIRE ─────────────────────────────────────── */

interface FIREPartial {
  corpusAtRetirement: number;
  realCorpusAtRetirement: number;
  totalContributed: number;
}

export function truthFromFIRE(r: FIREPartial, inflationRate = INFLATION_RATE): TruthResult {
  const gains = r.corpusAtRetirement - r.totalContributed;
  const ltcg = computeLTCG(gains);
  const postTax = r.corpusAtRetirement - ltcg.tax;

  return {
    grossLabel: "Corpus at retirement",
    grossValue: r.corpusAtRetirement,
    realLabel: "Real purchasing power",
    realValue: r.realCorpusAtRetirement,
    deductions: [
      { label: `Inflation erosion`, amount: Math.round(r.corpusAtRetirement - r.realCorpusAtRetirement) },
      { label: "Estimated LTCG tax on gains", amount: Math.round(ltcg.tax) },
    ],
    assumptions: [
      `Inflation: ${inflationRate}% (RBI 10-yr avg)`,
      `LTCG tax: 12.5% above ₹1.25L exemption`,
      "4% withdrawal rule used for FIRE number",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate,
    lastUpdated: LAST_UPDATED,
  };
}

/* ── NPS ─────────────────────────────────────── */

interface NPSPartial {
  corpusAtRetirement: number;
  realCorpusAtRetirement: number;
  lumpsumWithdrawal: number;
  annuityCorpus: number;
  monthlyPension: number;
  realMonthlyPension: number;
  annuityTaxable: number;
  totalContributed: number;
}

export function truthFromNPS(r: NPSPartial, inflationRate = INFLATION_RATE): TruthResult {
  return {
    grossLabel: "Monthly pension (nominal)",
    grossValue: r.monthlyPension,
    realLabel: "Real monthly income",
    realValue: r.realMonthlyPension,
    deductions: [
      { label: `Inflation erosion`, amount: Math.round(r.monthlyPension - r.realMonthlyPension) },
      { label: "Tax on annuity income", amount: Math.round(r.annuityTaxable) },
    ],
    assumptions: [
      `Inflation: ${inflationRate}% (RBI 10-yr avg)`,
      "60% lumpsum is tax-free; 40% annuity is fully taxable",
      "Annuity rate affects pension amount",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate,
    lastUpdated: LAST_UPDATED,
  };
}

/* ── EPF ─────────────────────────────────────── */

interface EPFPartial {
  totalCorpusAtRetirement: number;
  totalEmployeeContribution: number;
  totalInterestEarned: number;
}

export function truthFromEPF(r: EPFPartial, inflationRate = INFLATION_RATE): TruthResult {
  const inflationFactor = Math.pow(1 + inflationRate / 100, 1);
  const realCorpus = r.totalCorpusAtRetirement / inflationFactor;

  return {
    grossLabel: "EPF corpus at retirement",
    grossValue: r.totalCorpusAtRetirement,
    realLabel: "Real purchasing power",
    realValue: Math.round(realCorpus),
    deductions: [
      { label: `Inflation erosion (${inflationRate}%)`, amount: Math.round(r.totalCorpusAtRetirement - realCorpus) },
      { label: "Tax on withdrawal", amount: 0 },
    ],
    assumptions: [
      "EPF is tax-free if withdrawn after 5 years of continuous service",
      `Inflation: ${inflationRate}% (RBI 10-yr avg)`,
      "Interest rate varies yearly (currently ~8.25%)",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate,
    lastUpdated: LAST_UPDATED,
  };
}

/* ── Goal Planner ─────────────────────────────── */

interface GoalPartial {
  totalInflatedTarget: number;
  totalMonthlyModerate: number;
  goals: { name: string; inflatedTarget: number; todayValue: number }[];
}

export function truthFromGoal(r: GoalPartial, inflationRate = INFLATION_RATE): TruthResult {
  const totalTodayValue = r.goals.reduce((sum, g) => sum + g.todayValue, 0);
  const inflationErosion = r.totalInflatedTarget - totalTodayValue;

  return {
    grossLabel: "Total cost (inflated)",
    grossValue: r.totalInflatedTarget,
    realLabel: "Today's value of goals",
    realValue: Math.round(totalTodayValue),
    deductions: [
      { label: `Inflation markup (${inflationRate}%)`, amount: Math.round(inflationErosion) },
    ],
    assumptions: [
      `Inflation: ${inflationRate}% (RBI 10-yr avg)`,
      "SIP amounts based on moderate return assumption",
      "Goals prioritized as essential / important / nice-to-have",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate,
    lastUpdated: LAST_UPDATED,
  };
}

/* ── EMI ─────────────────────────────────────── */

interface EMIPartial {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
}

export function truthFromEMI(r: EMIPartial, inflationRate = INFLATION_RATE): TruthResult {
  const interestBurden = r.totalInterest;

  return {
    grossLabel: "Total payment to bank",
    grossValue: r.totalPayment,
    realLabel: "Interest you pay",
    realValue: Math.round(interestBurden),
    deductions: [
      { label: "Interest cost", amount: Math.round(interestBurden) },
    ],
    assumptions: [
      "EMI stays fixed — but inflation reduces real burden over time",
      `Inflation: ${inflationRate}% (RBI 10-yr avg)`,
      "Prepayment can significantly reduce interest",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate,
    lastUpdated: LAST_UPDATED,
  };
}

/* ── CTC / Salary ─────────────────────────────── */

interface CTCPartial {
  inHandMonthly: number;
  savingsMonthly: number;
}

export function truthFromCTC(r: CTCPartial): TruthResult {
  return {
    grossLabel: "Monthly in-hand",
    grossValue: r.inHandMonthly,
    realLabel: "Savings potential",
    realValue: r.savingsMonthly,
    deductions: [
      { label: "Tax, PF, other deductions", amount: 0 },
    ],
    assumptions: [
      "In-hand after all statutory deductions",
      "Savings = in-hand minus estimated expenses",
      "Tax regime affects take-home significantly",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate: INFLATION_RATE,
    lastUpdated: LAST_UPDATED,
  };
}

/* ── Tax ─────────────────────────────────────── */

interface TaxPartial {
  grossIncome: number;
  totalTax: number;
  effectiveRate: number;
}

export function truthFromTax(r: TaxPartial): TruthResult {
  const inHand = r.grossIncome - r.totalTax;

  return {
    grossLabel: "Gross income",
    grossValue: r.grossIncome,
    realLabel: "After-tax income",
    realValue: Math.round(inHand),
    deductions: [
      { label: `Income tax + cess (effective ${r.effectiveRate.toFixed(1)}%)`, amount: Math.round(r.totalTax) },
    ],
    assumptions: [
      "Calculation based on current tax slabs",
      "Does not include TDS timing effects",
      "Cess at 4% on tax amount",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate: INFLATION_RATE,
    lastUpdated: LAST_UPDATED,
  };
}

/* ── HRA ─────────────────────────────────────── */

interface HRAPartial {
  hraExemption: number;
  taxableHRA: number;
}

export function truthFromHRA(r: HRAPartial): TruthResult {
  return {
    grossLabel: "HRA received",
    grossValue: r.hraExemption + r.taxableHRA,
    realLabel: "HRA exempted",
    realValue: r.hraExemption,
    deductions: [
      { label: "Taxable HRA", amount: r.taxableHRA },
    ],
    assumptions: [
      "Exemption = min(actual HRA, rent - 10% basic, 50%/40% of basic)",
      "Metro city: 50% of basic; Non-metro: 40% of basic",
      "Must live in rented accommodation to claim",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate: INFLATION_RATE,
    lastUpdated: LAST_UPDATED,
  };
}

/* ── Simple Interest ─────────────────────────── */

interface SIPartial {
  simpleInterest: number;
  compoundInterest: number;
  totalAmount: number;
  principal: number;
}

export function truthFromSimpleInterest(r: SIPartial, inflationRate = INFLATION_RATE): TruthResult {
  const inflationFactor = Math.pow(1 + inflationRate / 100, 1);
  const realValue = Math.round(r.totalAmount / inflationFactor);

  return {
    grossLabel: "Maturity amount (simple)",
    grossValue: r.totalAmount,
    realLabel: "Real purchasing power",
    realValue,
    deductions: [
      { label: `Inflation erosion (${inflationRate}%)`, amount: Math.round(r.totalAmount - realValue) },
      { label: "Interest taxed at slab", amount: 0 },
    ],
    assumptions: [
      `Inflation: ${inflationRate}% (RBI 10-yr avg)`,
      "Interest income is fully taxable at your slab rate",
      "Simple interest does not compound — compound interest earns more over time",
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate,
    lastUpdated: LAST_UPDATED,
  };
}