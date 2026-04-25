import type { PlannerInput, PlannerOutput, GoalGap, PlannerRecommendation, CalculatorLink } from "./types";

const INCOME_MEDIAN: Record<string, number> = {
  below5L: 350000,
  "5to10L": 750000,
  "10to25L": 1750000,
  "25to50L": 3750000,
  "50Lto1Cr": 7500000,
  above1Cr: 15000000,
};

const RETURN_RATES: Record<string, number> = {
  equity: 0.12,
  debt: 0.07,
  gold: 0.08,
};

export function computePlanner(input: PlannerInput): PlannerOutput {
  const annualIncome = INCOME_MEDIAN[input.incomeBracket] || 1000000;
  const monthlyIncome = annualIncome / 12;
  const monthlyInvestment = input.monthlyInvestment || monthlyIncome * (input.savingsRate / 100);

  // Emergency fund = 6 months expenses
  const monthlyExpenses = monthlyIncome * (1 - input.savingsRate / 100);
  const emergencyTarget = monthlyExpenses * 6;
  const emergencyGap = Math.max(0, emergencyTarget - monthlyInvestment * 6);

  // Retirement corpus (4% rule)
  const annualExpenses = monthlyExpenses * 12;
  const retirementCorpus = annualExpenses * 25; // 25x annual expenses
  const yearsToRetirement = input.lifeStage === "retired" ? 0
    : input.lifeStage === "near_retirement" ? 5 : 30;
  const futureValue = retirementCorpus * Math.pow(1 + 0.06, yearsToRetirement);
  const sipForRetirement = yearsToRetirement > 0
    ? (futureValue * RETURN_RATES.equity / 12) / (Math.pow(1 + RETURN_RATES.equity / 12, yearsToRetirement * 12) - 1)
    : 0;
  const retirementGap = Math.max(0, sipForRetirement - monthlyInvestment);

  // Goal gaps
  const goalGaps: GoalGap[] = input.goals.map((goal) => {
    const inflatedTarget = goal.targetAmount * Math.pow(1 + 0.06, goal.yearsFromNow);
    const rate = RETURN_RATES.equity;
    const months = goal.yearsFromNow * 12;
    const monthlySIP = months > 0
      ? (inflatedTarget * rate / 12) / (Math.pow(1 + rate / 12, months) - 1)
      : goal.targetAmount;
    const projectedAmount = monthlyInvestment > 0 && months > 0
      ? monthlyInvestment * ((Math.pow(1 + rate / 12, months) - 1) / (rate / 12))
      : 0;
    const gap = Math.max(0, inflatedTarget - projectedAmount);
    return { goal, projectedAmount: Math.round(projectedAmount), gap: Math.round(gap), monthlySIPNeeded: Math.round(monthlySIP) };
  });

  // Recommendations
  const recommendations: PlannerRecommendation[] = [];
  const calculatorLinks: CalculatorLink[] = [];

  // Emergency fund check
  if (emergencyGap > 0) {
    recommendations.push({
      id: "emergency",
      priority: "critical",
      title: "Build Emergency Fund First",
      description: `You need ₹${Math.round(emergencyTarget / 100000)}L as emergency fund (6 months expenses). Currently short by ₹${Math.round(emergencyGap / 100000)}L.`,
      action: "Park 3-6 months expenses in a liquid fund or savings account before investing.",
      calculatorLink: "/fd-comparator",
    });
    calculatorLinks.push({ label: "FD Comparator", slug: "fd-comparator", reason: "Compare liquid fund returns for emergency fund parking" });
  }

  // Insurance check
  if (!input.insurance.includes("health")) {
    recommendations.push({
      id: "health_insurance",
      priority: "critical",
      title: "Get Health Insurance",
      description: "Medical emergencies can wipe out years of savings. A ₹10-15L family floater costs ₹12-25K/year.",
      action: "Get a base health insurance plan before investing further.",
    });
  }
  if (!input.insurance.includes("life") && (input.lifeStage === "married" || input.lifeStage === "married_with_kids")) {
    recommendations.push({
      id: "life_insurance",
      priority: "high",
      title: "Get Term Insurance",
      description: "With dependents, you need a term plan worth 10-15x annual income. Skip endowment/ULIP plans.",
      action: "Buy a pure term plan — ₹1Cr cover costs ₹8-15K/year for ages 25-35.",
    });
  }

  // Tax optimization
  if (input.incomeBracket !== "below5L") {
    recommendations.push({
      id: "tax_optimize",
      priority: "high",
      title: "Optimize Tax Strategy",
      description: "Choosing the right tax regime and maximizing 80C deductions can save ₹50K-2L/year.",
      action: "Compare old vs new regime. Max out 80C (PPF, ELSS, NPS).",
      calculatorLink: "/tax-sandbox",
    });
    calculatorLinks.push({ label: "Tax Sandbox", slug: "tax-sandbox", reason: "Compare old vs new tax regime" });
  }

  // Retirement check
  if (yearsToRetirement > 0 && retirementGap > 0) {
    recommendations.push({
      id: "retirement",
      priority: "high",
      title: "Increase Retirement Savings",
      description: `You need ₹${Math.round(sipForRetirement / 1000)}K/month for retirement. Currently investing ₹${Math.round(monthlyInvestment / 1000)}K/month — short by ₹${Math.round(retirementGap / 1000)}K/month.`,
      action: "Start a SIP in NPS or index fund for retirement.",
      calculatorLink: "/fire-matrix",
    });
    calculatorLinks.push({ label: "FIRE Matrix", slug: "fire-matrix", reason: "Plan your retirement corpus" });
  }

  // Goal-specific recommendations
  goalGaps.forEach((gg) => {
    if (gg.gap > 0 && gg.goal.priority === "essential") {
      recommendations.push({
        id: `goal_${gg.goal.id}`,
        priority: "high",
        title: `Fund ${gg.goal.name}`,
        description: `${gg.goal.name} needs ₹${Math.round(gg.monthlySIPNeeded / 1000)}K/month SIP to reach ₹${Math.round(gg.goal.targetAmount / 100000)}L in ${gg.goal.yearsFromNow} years.`,
        action: `Allocate ₹${Math.round(gg.monthlySIPNeeded / 1000)}K/month specifically for this goal.`,
      });
    }
  });

  // Sort recommendations by priority
  const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Add default calculator links
  calculatorLinks.push(
    { label: "SIP Simulator", slug: "sip-simulator", reason: "Check real SIP returns after tax and inflation" },
    { label: "Goal Planner", slug: "goal-planner", reason: "Set monthly SIP targets for each goal" }
  );

  // Remove duplicate links
  const uniqueLinks = calculatorLinks.filter((link, i, arr) => arr.findIndex((l) => l.slug === link.slug) === i);

  const totalSIPNeeded = goalGaps.reduce((sum, g) => sum + g.monthlySIPNeeded, 0) + (retirementGap > 0 ? sipForRetirement : 0);

  return {
    emergencyFundGap: Math.round(emergencyGap),
    retirementGap: Math.round(retirementGap),
    goalGaps,
    recommendations,
    calculatorLinks: uniqueLinks,
    monthlyInvestmentNeeded: Math.round(totalSIPNeeded),
    currentMonthlyInvestment: Math.round(monthlyInvestment),
    surplusDeficit: Math.round(monthlyInvestment - totalSIPNeeded),
  };
}