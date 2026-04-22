import type { GoalInput, GoalResult, GoalOutput } from "./types";

export function computeGoals(input: GoalInput): GoalOutput {
  const { goals, returnRateConservative, returnRateModerate, returnRateAggressive, inflationRate } = input;

  const goalResults: GoalResult[] = goals.map((goal) => {
    const inflatedTarget = goal.targetAmount * Math.pow(1 + inflationRate / 100, goal.yearsFromNow);
    const months = goal.yearsFromNow * 12;

    // SIP formula: FV of SIP = P × [((1+r)^n - 1) / r]
    // Solving for P: P = FV / [((1+r)^n - 1) / r]
    function sipForRate(rate: number): number {
      if (months === 0) return 0;
      const monthlyRate = rate / 100 / 12;
      if (monthlyRate === 0) return inflatedTarget / months;
      const factor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
      return inflatedTarget / factor;
    }

    return {
      id: goal.id,
      name: goal.name,
      priority: goal.priority,
      todayValue: goal.targetAmount,
      inflatedTarget: Math.round(inflatedTarget),
      yearsFromNow: goal.yearsFromNow,
      monthlySIPConservative: Math.round(sipForRate(returnRateConservative)),
      monthlySIPModerate: Math.round(sipForRate(returnRateModerate)),
      monthlySIPAggressive: Math.round(sipForRate(returnRateAggressive)),
    };
  });

  return {
    goals: goalResults,
    totalMonthlyConservative: goalResults.reduce((s, g) => s + g.monthlySIPConservative, 0),
    totalMonthlyModerate: goalResults.reduce((s, g) => s + g.monthlySIPModerate, 0),
    totalMonthlyAggressive: goalResults.reduce((s, g) => s + g.monthlySIPAggressive, 0),
    totalInflatedTarget: goalResults.reduce((s, g) => s + g.inflatedTarget, 0),
  };
}