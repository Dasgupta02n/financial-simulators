/* ── Financial Planner Types ── */

export type LifeStage = "single" | "married" | "married_with_kids" | "near_retirement" | "retired";
export type IncomeBracket = "below5L" | "5to10L" | "10to25L" | "25to50L" | "50Lto1Cr" | "above1Cr";
export type GoalType = "emergency_fund" | "home" | "education" | "marriage" | "retirement" | "car" | "travel" | "health";
export type InsuranceType = "life" | "health" | "vehicle" | "none";
export type RiskProfile = "aggressive" | "moderate" | "conservative";

export interface PlannerInput {
  /* Step 1: Personal */
  ageRange: string;
  dependents: number;
  lifeStage: LifeStage;

  /* Step 2: Income & Expenses */
  incomeBracket: IncomeBracket;
  savingsRate: number; // percentage 0-100
  monthlyInvestment: number;

  /* Step 3: Goals */
  goals: PlannerGoal[];

  /* Step 4: Insurance */
  insurance: InsuranceType[];

  /* Step 5 & 6: Computed */
  inflationRate: number;
}

export interface PlannerGoal {
  id: string;
  type: GoalType;
  name: string;
  targetAmount: number;
  yearsFromNow: number;
  priority: "essential" | "important" | "nice_to_have";
}

export interface PlannerOutput {
  /* Gap analysis */
  emergencyFundGap: number;
  emergencyTarget: number;
  retirementGap: number;
  retirementCorpusNeeded: number;
  goalGaps: GoalGap[];

  /* Recommendations */
  recommendations: PlannerRecommendation[];

  /* Linked calculators */
  calculatorLinks: CalculatorLink[];

  /* Summary stats */
  monthlyInvestmentNeeded: number;
  currentMonthlyInvestment: number;
  surplusDeficit: number;

  /* New: Enhanced outputs */
  riskProfile: RiskProfile;
  assetAllocation: AssetAllocation;
  monthlyBudgetAllocation: MonthlyAllocation[];
  taxStrategy: TaxStrategy;
  insuranceRecommendations: InsuranceRecommendation[];
  netWorthProjection: YearlyProjection[];
  stepByStepActionPlan: ActionStep[];
  keyInsights: string[];
}

export interface GoalGap {
  goal: PlannerGoal;
  projectedAmount: number;
  gap: number;
  monthlySIPNeeded: number;
  inflatedTarget: number;
}

export interface PlannerRecommendation {
  id: string;
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
  calculatorLink?: string;
}

export interface CalculatorLink {
  label: string;
  slug: string;
  reason: string;
}

export interface AssetAllocation {
  equity: number; // percentage
  debt: number;
  gold: number;
  realEstate: number;
  cash: number;
  rationale: string;
}

export interface MonthlyAllocation {
  category: string;
  amount: number;
  percentage: number;
  reason: string;
}

export interface TaxStrategy {
  regime: "old" | "new";
  regimeReason: string;
  estimatedTaxSavings: number;
  deductions: TaxDeduction[];
}

export interface TaxDeduction {
  section: string;
  description: string;
  maxAmount: number;
  recommendedAmount: number;
}

export interface InsuranceRecommendation {
  type: string;
  recommendedCover: number;
  estimatedPremium: number;
  priority: "critical" | "high" | "medium";
  reason: string;
}

export interface YearlyProjection {
  year: number;
  age: number;
  totalCorpus: number;
  invested: number;
  returns: number;
}

export interface ActionStep {
  step: number;
  timeframe: string;
  title: string;
  description: string;
  actionItems: string[];
  calculatorLink?: string;
}

/* ── Step tracking ── */
export const STEPS = [
  { id: 1, label: "Profile" },
  { id: 2, label: "Income" },
  { id: 3, label: "Goals" },
  { id: 4, label: "Insurance" },
  { id: 5, label: "Analysis" },
  { id: 6, label: "Action Plan" },
] as const;

export const INCOME_BRACKETS: { value: IncomeBracket; label: string; range: string }[] = [
  { value: "below5L", label: "Below ₹5L", range: "< ₹5,00,000" },
  { value: "5to10L", label: "₹5L – ₹10L", range: "₹5L – ₹10L" },
  { value: "10to25L", label: "₹10L – ₹25L", range: "₹10L – ₹25L" },
  { value: "25to50L", label: "₹25L – ₹50L", range: "₹25L – ₹50L" },
  { value: "50Lto1Cr", label: "₹50L – ₹1Cr", range: "₹50L – ₹1Cr" },
  { value: "above1Cr", label: "Above ₹1Cr", range: "> ₹1,00,00,000" },
];

export const LIFE_STAGES: { value: LifeStage; label: string; icon: string }[] = [
  { value: "single", label: "Single", icon: "🧑" },
  { value: "married", label: "Married", icon: "💑" },
  { value: "married_with_kids", label: "Married + Kids", icon: "👨‍👩‍👧" },
  { value: "near_retirement", label: "Near Retirement", icon: "🧓" },
  { value: "retired", label: "Retired", icon: "🏖️" },
];

export const GOAL_TYPES: { value: GoalType; label: string; defaultAmount: number; defaultYears: number }[] = [
  { value: "emergency_fund", label: "Emergency Fund", defaultAmount: 300000, defaultYears: 1 },
  { value: "home", label: "Home Purchase", defaultAmount: 5000000, defaultYears: 5 },
  { value: "education", label: "Education", defaultAmount: 2000000, defaultYears: 10 },
  { value: "marriage", label: "Marriage", defaultAmount: 1000000, defaultYears: 3 },
  { value: "retirement", label: "Retirement", defaultAmount: 50000000, defaultYears: 25 },
  { value: "car", label: "Car", defaultAmount: 1000000, defaultYears: 3 },
  { value: "travel", label: "Travel Fund", defaultAmount: 300000, defaultYears: 2 },
  { value: "health", label: "Health Fund", defaultAmount: 500000, defaultYears: 5 },
];