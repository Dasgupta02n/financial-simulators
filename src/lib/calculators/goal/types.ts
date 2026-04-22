export interface GoalInput {
  goals: Goal[];
  returnRateConservative: number; // %
  returnRateModerate: number;
  returnRateAggressive: number;
  inflationRate: number;
  currentAge: number;
  timeHorizon: number; // years
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number; // in today's money
  yearsFromNow: number;
  priority: "essential" | "important" | "nice-to-have";
}

export interface GoalOutput {
  goals: GoalResult[];
  totalMonthlyConservative: number;
  totalMonthlyModerate: number;
  totalMonthlyAggressive: number;
  totalInflatedTarget: number;
}

export interface GoalResult {
  id: string;
  name: string;
  priority: "essential" | "important" | "nice-to-have";
  todayValue: number;
  inflatedTarget: number;
  yearsFromNow: number;
  monthlySIPConservative: number;
  monthlySIPModerate: number;
  monthlySIPAggressive: number;
}