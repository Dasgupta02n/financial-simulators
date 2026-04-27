import type {
  PlannerInput,
  PlannerOutput,
  GoalGap,
  PlannerRecommendation,
  CalculatorLink,
  AssetAllocation,
  MonthlyAllocation,
  TaxStrategy,
  TaxDeduction,
  InsuranceRecommendation,
  YearlyProjection,
  ActionStep,
  RiskProfile,
} from "./types";

const INCOME_MEDIAN: Record<string, number> = {
  below5L: 350000,
  "5to10L": 750000,
  "10to25L": 1750000,
  "25to50L": 3750000,
  "50Lto1Cr": 7500000,
  above1Cr: 15000000,
};

const RETURN_RATES = { equity: 0.12, debt: 0.07, gold: 0.08, realEstate: 0.09 };

const TAX_OLD_DEDUCTIONS_MAX = 450000; // 80C + 80D + 80CCD + HRA + home loan
const TAX_NEW_DEDUCTIONS_MAX = 75000;  // New regime standard deduction + NPS

function determineRiskProfile(input: PlannerInput): RiskProfile {
  if (input.lifeStage === "retired" || input.lifeStage === "near_retirement") return "conservative";
  if (input.lifeStage === "married_with_kids" && input.savingsRate < 20) return "conservative";
  if (input.lifeStage === "single" && input.savingsRate >= 30) return "aggressive";
  return "moderate";
}

function getAssetAllocation(risk: RiskProfile, lifeStage: string): AssetAllocation {
  if (risk === "conservative" || lifeStage === "retired") {
    return {
      equity: 30, debt: 45, gold: 5, realEstate: 15, cash: 5,
      rationale: "Conservative mix prioritizing capital preservation. Higher debt allocation protects against market volatility in retirement.",
    };
  }
  if (risk === "aggressive") {
    return {
      equity: 70, debt: 10, gold: 5, realEstate: 10, cash: 5,
      rationale: "Aggressive mix maximizing equity growth. Suitable for young investors with 20+ year horizons who can withstand market dips.",
    };
  }
  return {
    equity: 55, debt: 20, gold: 5, realEstate: 15, cash: 5,
    rationale: "Balanced mix for moderate risk tolerance. Equity drives growth, debt provides stability, gold hedges inflation.",
  };
}

function getTaxStrategy(incomeBracket: string, insurance: string[]): TaxStrategy {
  const annualIncome = INCOME_MEDIAN[incomeBracket] || 1000000;

  // New regime is better for most brackets now (2025 budget changed slabs)
  const isNewBetter = annualIncome <= 1500000 || incomeBracket === "below5L" || incomeBracket === "5to10L";

  const deductions: TaxDeduction[] = [];
  let regime: "old" | "new" = "new";
  let estimatedTaxSavings = 0;

  if (isNewBetter) {
    regime = "new";
    deductions.push(
      { section: "Standard Deduction", description: "Auto ₹75,000 deduction under new regime", maxAmount: 75000, recommendedAmount: 75000 },
      { section: "80CCD(1B)", description: "NPS additional ₹50,000 deduction (available in both regimes)", maxAmount: 50000, recommendedAmount: 50000 },
      { section: "80CCD(2)", description: "Employer NPS contribution (up to 14% of basic, deductible in new regime)", maxAmount: Math.round(annualIncome * 0.14), recommendedAmount: Math.round(annualIncome * 0.1) },
    );
    estimatedTaxSavings = 75000 * 0.3 + 50000 * 0.3; // Rough savings at 30% slab
  } else {
    regime = "old";
    deductions.push(
      { section: "80C", description: "PPF, ELSS, NPS, LIC, home loan principal", maxAmount: 150000, recommendedAmount: 150000 },
      { section: "80D", description: "Health insurance premium (self + family)", maxAmount: insurance.includes("health") ? 75000 : 25000, recommendedAmount: insurance.includes("health") ? 50000 : 25000 },
      { section: "80CCD(1B)", description: "NPS additional contribution", maxAmount: 50000, recommendedAmount: 50000 },
      { section: "HRA", description: "House Rent Allowance exemption", maxAmount: Math.round(annualIncome * 0.1), recommendedAmount: Math.round(annualIncome * 0.08) },
      { section: "24(b)", description: "Home loan interest deduction", maxAmount: 200000, recommendedAmount: 0 },
    );
    estimatedTaxSavings = deductions.reduce((s, d) => s + Math.min(d.recommendedAmount, d.maxAmount), 0) * 0.3;
  }

  const regimeReason = regime === "new"
    ? `New regime saves more for your income bracket with the updated slabs. You keep more money with less paperwork — no investment lock-in required.`
    : `Old regime with deductions saves ₹${formatApprox(estimatedTaxSavings)}/year. You must invest in specified instruments to claim these deductions.`;

  return {
    regime,
    regimeReason,
    estimatedTaxSavings: Math.round(estimatedTaxSavings),
    deductions,
  };
}

function getInsuranceRecommendations(input: PlannerInput): InsuranceRecommendation[] {
  const annualIncome = INCOME_MEDIAN[input.incomeBracket] || 1000000;
  const recommendations: InsuranceRecommendation[] = [];
  const hasDependents = input.lifeStage === "married" || input.lifeStage === "married_with_kids";
  const hasLifeInsurance = input.insurance.includes("life");
  const hasHealthInsurance = input.insurance.includes("health");

  if (!hasHealthInsurance) {
    const cover = hasDependents ? 1500000 : 1000000;
    recommendations.push({
      type: "Health Insurance",
      recommendedCover: cover,
      estimatedPremium: Math.round(cover * 0.015),
      priority: "critical",
      reason: "Medical emergencies can wipe out years of savings. A ₹${(cover/100000).toFixed(0)}L family floater covers hospitalization, surgery, and day-care procedures.",
    });
  }

  if (hasDependents && !hasLifeInsurance) {
    const cover = Math.round(annualIncome * 12);
    recommendations.push({
      type: "Term Insurance",
      recommendedCover: cover,
      estimatedPremium: Math.round(cover * 0.001),
      priority: "critical",
      reason: `With ${input.dependents} dependents, you need ${formatApprox(cover)} cover (12x annual income). A pure term plan costs just ${formatApprox(Math.round(cover * 0.001))}/year for ages 25-35.`,
    });
  }

  if (hasLifeInsurance) {
    recommendations.push({
      type: "Review Existing Life Insurance",
      recommendedCover: 0,
      estimatedPremium: 0,
      priority: "medium",
      reason: "Check if your current life cover equals 10-15x annual income. If you have endowment/ULIP/whole-life policies, consider switching to term insurance — same cover at 1/10th the cost.",
    });
  }

  if (hasDependents) {
    recommendations.push({
      type: "Critical Illness Rider",
      recommendedCover: 2500000,
      estimatedPremium: 5000,
      priority: "high",
      reason: "Covers cancer, heart attack, stroke. ₹25L payout on diagnosis — separate from health insurance. Costs ₹3-5K/year for ages 25-40.",
    });
  }

  return recommendations;
}

function getMonthlyAllocation(
  input: PlannerInput,
  output: { monthlyInvestmentNeeded: number; currentMonthlyInvestment: number; goalGaps: GoalGap[]; emergencyFundGap: number }
): MonthlyAllocation[] {
  const total = Math.max(output.monthlyInvestmentNeeded, input.monthlyInvestment);
  const allocations: MonthlyAllocation[] = [];
  let remaining = total;

  // 1. Emergency fund first (if gap exists)
  if (output.emergencyFundGap > 0) {
    const emergencySIP = Math.min(remaining, Math.round(output.emergencyFundGap * 0.05 / 6)); // Build in 6 months
    if (emergencySIP > 0) {
      allocations.push({
        category: "Emergency Fund (Liquid Fund)",
        amount: emergencySIP,
        percentage: Math.round((emergencySIP / total) * 100),
        reason: "Park in a liquid fund or savings account. Build 6 months expenses before investing.",
      });
      remaining -= emergencySIP;
    }
  }

  // 2. Goal SIPs by priority
  const essentialGoals = output.goalGaps.filter((g) => g.goal.priority === "essential");
  const importantGoals = output.goalGaps.filter((g) => g.goal.priority === "important");
  const niceGoals = output.goalGaps.filter((g) => g.goal.priority === "nice_to_have");

  for (const g of essentialGoals) {
    if (remaining <= 0) break;
    const sip = Math.min(remaining, g.monthlySIPNeeded);
    allocations.push({
      category: g.goal.name,
      amount: sip,
      percentage: Math.round((sip / total) * 100),
      reason: `${g.goal.priority} goal — ${g.goal.yearsFromNow} year timeline`,
    });
    remaining -= sip;
  }

  for (const g of importantGoals) {
    if (remaining <= 0) break;
    const sip = Math.min(remaining, g.monthlySIPNeeded);
    allocations.push({
      category: g.goal.name,
      amount: sip,
      percentage: Math.round((sip / total) * 100),
      reason: `${g.goal.priority} goal — ${g.goal.yearsFromNow} year timeline`,
    });
    remaining -= sip;
  }

  for (const g of niceGoals) {
    if (remaining <= 0) break;
    const sip = Math.min(remaining, Math.round(g.monthlySIPNeeded * 0.5)); // Half allocation for nice-to-haves
    allocations.push({
      category: g.goal.name,
      amount: sip,
      percentage: Math.round((sip / total) * 100),
      reason: "Nice-to-have — invest surplus after essential goals",
    });
    remaining -= sip;
  }

  // 3. Retirement (if not already a goal)
  const hasRetirementGoal = input.goals.some((g) => g.type === "retirement");
  if (!hasRetirementGoal && remaining > 0) {
    allocations.push({
      category: "Retirement (NPS + Index Fund)",
      amount: remaining,
      percentage: Math.round((remaining / total) * 100),
      reason: "Long-term compounding. Even small amounts grow 10x over 25 years.",
    });
  } else if (remaining > 0) {
    allocations.push({
      category: "Additional Investment",
      amount: remaining,
      percentage: Math.round((remaining / total) * 100),
      reason: "Surplus after meeting all goals — invest in diversified equity funds.",
    });
  }

  return allocations;
}

function getNetWorthProjection(input: PlannerInput, monthlyInvestment: number): YearlyProjection[] {
  const projections: YearlyProjection[] = [];
  let totalInvested = 0;
  let totalReturns = 0;
  const monthlyReturn = 0.10 / 12; // Use 10% blended return for projection

  const startAge = input.lifeStage === "near_retirement" ? 50 : input.lifeStage === "retired" ? 60 : input.lifeStage === "married_with_kids" ? 32 : 28;
  const years = input.lifeStage === "retired" ? 5 : 30;

  for (let y = 1; y <= years; y++) {
    for (let m = 1; m <= 12; m++) {
      totalInvested += monthlyInvestment;
      totalReturns = (totalReturns + monthlyInvestment) * (1 + monthlyReturn) - (totalReturns + monthlyInvestment);
    }
    // Simple compound: FV = PMT * ((1+r)^n - 1) / r
    const n = y * 12;
    const fv = monthlyInvestment * ((Math.pow(1 + monthlyReturn, n) - 1) / monthlyReturn);
    projections.push({
      year: y,
      age: startAge + y,
      totalCorpus: Math.round(fv),
      invested: Math.round(totalInvested),
      returns: Math.round(fv - totalInvested),
    });
  }

  return projections;
}

function getActionSteps(input: PlannerInput, output: { emergencyFundGap: number; emergencyTarget: number; goalGaps: GoalGap[]; taxStrategy: TaxStrategy; surplusDeficit: number; retirementGap: number; monthlyInvestmentNeeded: number; currentMonthlyInvestment: number }): ActionStep[] {
  const steps: ActionStep[] = [];
  const annualIncome = INCOME_MEDIAN[input.incomeBracket] || 1000000;
  let stepNum = 1;

  // Step 1: Emergency fund
  if (output.emergencyFundGap > 0) {
    steps.push({
      step: stepNum++,
      timeframe: "This month",
      title: "Start Emergency Fund",
      description: `Build ${formatApprox(output.emergencyTarget)} emergency fund in a liquid fund or savings account before investing.`,
      actionItems: [
        `Open a liquid mutual fund or high-interest savings account`,
        `Set up auto-debit of ${formatApprox(Math.round(output.emergencyFundGap * 0.05 / 6))}/month`,
        `Aim to complete in 6 months`,
        `Do NOT invest this money in equity — keep it accessible`,
      ],
      calculatorLink: "/fd-comparator",
    });
  }

  // Step 2: Insurance
  const hasHealth = input.insurance.includes("health");
  const hasLife = input.insurance.includes("life");
  const hasDependents = input.lifeStage === "married" || input.lifeStage === "married_with_kids";

  if (!hasHealth) {
    steps.push({
      step: stepNum++,
      timeframe: "This week",
      title: "Get Health Insurance",
      description: "Medical bills are the #1 cause of personal bankruptcy in India. Get covered immediately.",
      actionItems: [
        `Buy a family floater of ₹10-15L (costs ₹12-25K/year)`,
        `Choose a plan with no room rent capping and minimum 2-year waiting period for pre-existing conditions`,
        `Consider Super Top-Up for ₹25-50L additional cover (costs ₹3-5K/year)`,
        `Do NOT buy from your employer alone — it lapses when you switch jobs`,
      ],
    });
  }

  if (hasDependents && !hasLife) {
    steps.push({
      step: stepNum++,
      timeframe: "This week",
      title: "Buy Term Insurance",
      description: `Pure term cover of ${formatApprox(annualIncome * 12)} (12x income) costs just ₹8-15K/year at your age.`,
      actionItems: [
        `Get term insurance of at least 10-15x annual income`,
        `Choose 40-50 year term (not 60-65 year — you won't need it that long)`,
        `Do NOT buy endowment/ULIP/whole-life — they return 4-5% vs 12%+ from SIP`,
        `Compare quotes on PolicyBazaar or Ditto before buying`,
      ],
    });
  }

  // Step 3: Tax optimization
  steps.push({
    step: stepNum++,
    timeframe: "This month",
    title: `Switch to ${output.taxStrategy.regime === "new" ? "New" : "Old"} Tax Regime`,
    description: output.taxStrategy.regimeReason,
    actionItems: [
      output.taxStrategy.regime === "new"
        ? `New regime saves you more with zero investment lock-in. Just declare on your employer's form.`
        : `Old regime with deductions saves ₹${formatApprox(output.taxStrategy.estimatedTaxSavings)}/year. Invest in PPF (₹1.5L), NPS (₹50K), and ELSS for maximum deduction.`,
      output.taxStrategy.regime === "old" ? `Max out 80C: PPF (₹1.5L lock-in 15yr) + ELSS (₹1.5L, 3yr lock-in)` : `NPS ₹50K under 80CCD(1B) is deductible in both regimes`,
      `Submit investment declaration to employer in April itself — don't wait for year-end`,
    ],
    calculatorLink: "/tax-sandbox",
  });

  // Step 4: Goal-specific SIPs
  const essentialGoals = output.goalGaps.filter((g) => g.goal.priority === "essential");
  if (essentialGoals.length > 0) {
    steps.push({
      step: stepNum++,
      timeframe: "This month",
      title: "Start Goal-Based SIPs",
      description: "Set up separate SIPs for each essential goal with dedicated accounts.",
      actionItems: essentialGoals.flatMap((g) => [
        `${g.goal.name}: ₹${formatApprox(g.monthlySIPNeeded)}/month SIP for ${g.goal.yearsFromNow} years → ₹${formatApprox(g.goal.targetAmount)}`,
        `Use index funds for 7+ year goals, debt funds for < 3 year goals`,
      ]),
      calculatorLink: "/sip-simulator",
    });
  }

  // Step 5: Retirement (if not covered by goals)
  const hasRetirementGoal = input.goals.some((g) => g.type === "retirement");
  if (!hasRetirementGoal) {
    steps.push({
      step: stepNum++,
      timeframe: "This month",
      title: "Start Retirement Planning",
      description: `Even ₹5,000/month in NPS + index fund becomes ${formatApprox(5000 * ((Math.pow(1.1 / 12, 30 * 12) - 1) / (0.1 / 12)))} in 30 years.`,
      actionItems: [
        "Open NPS account (get extra 80CCD(1B) ₹50K deduction under both regimes)",
        "Start index fund SIP — Nifty 50 or Nifty Next 50",
        "Increase SIP by 10% every year (step-up SIP)",
        "Do NOT touch this money until age 55-60",
      ],
      calculatorLink: "/fire-matrix",
    });
  }

  // Step 6: Review schedule
  steps.push({
    step: stepNum++,
    timeframe: "Ongoing",
    title: "Review & Rebalance",
    description: "Financial plans need annual checkups. Here's when to review:",
    actionItems: [
      `January: Submit tax declaration to employer with chosen regime`,
      `March: Review SIP amounts — increase by 10% (step-up SIP)`,
      `June: Check emergency fund is still 6 months of current expenses`,
      `October: Review insurance coverage — increase health cover if income rose`,
      `December: Tax-loss harvest equity investments before year-end`,
      `Every 3 years: Rebalance asset allocation back to target mix`,
    ],
  });

  return steps;
}

function getKeyInsights(input: PlannerInput, output: { surplusDeficit: number; emergencyFundGap: number; taxStrategy: TaxStrategy }): string[] {
  const insights: string[] = [];
  const annualIncome = INCOME_MEDIAN[input.incomeBracket] || 1000000;

  if (output.surplusDeficit < 0) {
    insights.push("You're short by " + formatApprox(Math.abs(output.surplusDeficit)) + "/month. Consider increasing SIPs or reducing discretionary spending by 5-10%.");
  } else {
    insights.push("Great — you have a surplus of " + formatApprox(output.surplusDeficit) + "/month. Invest this in index funds for compounding.");
  }

  if (!input.insurance.includes("health")) {
    insights.push("You have no health insurance. A single hospitalization can wipe out years of savings. This is your #1 priority.");
  }

  if (output.taxStrategy.regime === "new") {
    insights.push("The new tax regime saves you more money with zero investment lock-in. No need to buy insurance products you don't want.");
  }

  if (input.savingsRate < 20) {
    insights.push("Your savings rate of " + input.savingsRate + "% is below the recommended 20%. Try to increase it by 5% each year.");
  }

  if (output.emergencyFundGap > 0) {
    insights.push("Your emergency fund covers less than 3 months of expenses. Build this to 6 months before investing aggressively.");
  }

  if (input.goals.some((g) => g.type === "retirement" && g.yearsFromNow > 25)) {
    insights.push("Retirement 25+ years away means " + formatApprox(10000) + "/month in an index fund could become 1.5Cr+. Start now — compounding rewards time.");
  }

  return insights;
}

function formatApprox(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

export function computePlanner(input: PlannerInput): PlannerOutput {
  const annualIncome = INCOME_MEDIAN[input.incomeBracket] || 1000000;
  const monthlyIncome = annualIncome / 12;
  const monthlyInvestment = input.monthlyInvestment || monthlyIncome * (input.savingsRate / 100);
  const monthlyExpenses = monthlyIncome * (1 - input.savingsRate / 100);

  // Emergency fund = 6 months expenses
  const emergencyTarget = Math.round(monthlyExpenses * 6);
  const emergencyGap = Math.max(0, emergencyTarget - monthlyInvestment * 6);

  // Retirement corpus (4% rule + inflation adjustment)
  const annualExpenses = monthlyExpenses * 12;
  const retirementCorpus = Math.round(annualExpenses * 25);
  const yearsToRetirement = input.lifeStage === "retired" ? 0
    : input.lifeStage === "near_retirement" ? 5
    : input.lifeStage === "married_with_kids" ? 25
    : 30;
  const futureRetirementCorpus = Math.round(retirementCorpus * Math.pow(1.06, yearsToRetirement));
  const sipForRetirement = yearsToRetirement > 0
    ? Math.round((futureRetirementCorpus * RETURN_RATES.equity / 12) / (Math.pow(1 + RETURN_RATES.equity / 12, yearsToRetirement * 12) - 1))
    : 0;
  const retirementGap = Math.max(0, sipForRetirement - monthlyInvestment);

  // Goal gaps (with inflation)
  const goalGaps: GoalGap[] = input.goals.map((goal) => {
    const inflatedTarget = Math.round(goal.targetAmount * Math.pow(1.06, goal.yearsFromNow));
    const rate = goal.yearsFromNow > 5 ? RETURN_RATES.equity : RETURN_RATES.debt;
    const months = goal.yearsFromNow * 12;
    const monthlySIP = months > 0
      ? Math.round((inflatedTarget * rate / 12) / (Math.pow(1 + rate / 12, months) - 1))
      : goal.targetAmount;
    const projectedAmount = monthlyInvestment > 0 && months > 0
      ? Math.round(monthlyInvestment * ((Math.pow(1 + rate / 12, months) - 1) / (rate / 12)))
      : 0;
    const gap = Math.max(0, inflatedTarget - projectedAmount);
    return { goal, projectedAmount, gap, monthlySIPNeeded: monthlySIP, inflatedTarget };
  });

  // Determine risk profile and asset allocation
  const riskProfile = determineRiskProfile(input);
  const assetAllocation = getAssetAllocation(riskProfile, input.lifeStage);

  // Tax strategy
  const taxStrategy = getTaxStrategy(input.incomeBracket, input.insurance);

  // Insurance recommendations
  const insuranceRecommendations = getInsuranceRecommendations(input);

  // Recommendations
  const recommendations: PlannerRecommendation[] = [];
  const calculatorLinks: CalculatorLink[] = [];

  // Emergency fund
  if (emergencyGap > 0) {
    recommendations.push({
      id: "emergency",
      priority: "critical",
      title: "Build Emergency Fund First",
      description: `You need ${formatApprox(emergencyTarget)} as emergency fund (6 months expenses). Currently short by ${formatApprox(emergencyGap)}.`,
      action: "Park 3-6 months expenses in a liquid fund or savings account before investing anything else.",
      calculatorLink: "/fd-comparator",
    });
    calculatorLinks.push({ label: "FD Comparator", slug: "fd-comparator", reason: "Compare liquid fund returns for emergency fund parking" });
  }

  // Insurance
  if (!input.insurance.includes("health")) {
    recommendations.push({
      id: "health_insurance",
      priority: "critical",
      title: "Get Health Insurance Immediately",
      description: "Medical emergencies can wipe out years of savings. A ₹10-15L family floater costs ₹12-25K/year.",
      action: "Get a base health insurance plan before investing further.",
    });
  }

  if (!input.insurance.includes("life") && (input.lifeStage === "married" || input.lifeStage === "married_with_kids")) {
    recommendations.push({
      id: "life_insurance",
      priority: "critical",
      title: "Get Term Insurance",
      description: `With dependents, you need a term plan worth 10-15x annual income (${formatApprox(annualIncome * 12)}). Skip endowment/ULIP plans.`,
      action: "Buy a pure term plan — ₹1Cr cover costs ₹8-15K/year for ages 25-35.",
    });
  }

  // Tax optimization
  if (input.incomeBracket !== "below5L") {
    recommendations.push({
      id: "tax_optimize",
      priority: "high",
      title: `Switch to ${taxStrategy.regime === "new" ? "New" : "Old"} Tax Regime`,
      description: `The ${taxStrategy.regime} regime ${taxStrategy.regime === "new" ? "saves more with less paperwork" : "with deductions saves ₹" + formatApprox(taxStrategy.estimatedTaxSavings) + "/year"}.`,
      action: taxStrategy.regime === "new"
        ? "Declare new regime on your employer's form. No investment lock-in required."
        : "Max out 80C (PPF, ELSS, NPS) + 80D (health insurance) + 80CCD(1B) for maximum savings.",
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
      description: `You need ${formatApprox(sipForRetirement)}/month for retirement. Currently investing ${formatApprox(monthlyInvestment)}/month — short by ${formatApprox(retirementGap)}/month.`,
      action: "Start a SIP in NPS (extra 80CCD(1B) deduction) + index fund for retirement.",
      calculatorLink: "/fire-matrix",
    });
    calculatorLinks.push({ label: "FIRE Matrix", slug: "fire-matrix", reason: "Plan your retirement corpus" });
  }

  // Goal-specific
  goalGaps.forEach((gg) => {
    if (gg.gap > 0 && gg.goal.priority !== "nice_to_have") {
      recommendations.push({
        id: `goal_${gg.goal.id}`,
        priority: gg.goal.priority === "essential" ? "high" : "medium",
        title: `Fund ${gg.goal.name}`,
        description: `${gg.goal.name} needs ${formatApprox(gg.monthlySIPNeeded)}/month SIP to reach ${formatApprox(gg.goal.targetAmount)} in ${gg.goal.yearsFromNow} years (inflation-adjusted: ${formatApprox(gg.inflatedTarget)}).`,
        action: `Allocate ${formatApprox(gg.monthlySIPNeeded)}/month specifically for this goal using a ${gg.goal.yearsFromNow > 5 ? "equity index fund" : "debt fund"}.`,
      });
    }
  });

  // Sort by priority
  const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Default links
  calculatorLinks.push(
    { label: "SIP Simulator", slug: "sip-simulator", reason: "Check real SIP returns after tax and inflation" },
    { label: "Goal Planner", slug: "goal-planner", reason: "Set monthly SIP targets for each goal" }
  );

  // Remove duplicates
  const uniqueLinks = calculatorLinks.filter((link, i, arr) => arr.findIndex((l) => l.slug === link.slug) === i);

  // Calculate totals
  const totalSIPNeeded = goalGaps.reduce((sum, g) => sum + g.monthlySIPNeeded, 0) + (retirementGap > 0 ? sipForRetirement : 0);

  // Build output
  const baseOutput = {
    emergencyFundGap: Math.round(emergencyGap),
    emergencyTarget,
    retirementGap: Math.round(retirementGap),
    retirementCorpusNeeded: futureRetirementCorpus,
    goalGaps,
    recommendations,
    calculatorLinks: uniqueLinks,
    monthlyInvestmentNeeded: Math.round(totalSIPNeeded),
    currentMonthlyInvestment: Math.round(monthlyInvestment),
    surplusDeficit: Math.round(monthlyInvestment - totalSIPNeeded),
  };

  // Enhanced outputs
  const monthlyBudgetAllocation = getMonthlyAllocation(input, baseOutput);
  const netWorthProjection = getNetWorthProjection(input, monthlyInvestment);
  const actionSteps = getActionSteps(input, { emergencyFundGap: baseOutput.emergencyFundGap, emergencyTarget: baseOutput.emergencyTarget, goalGaps: baseOutput.goalGaps, taxStrategy, surplusDeficit: baseOutput.surplusDeficit, retirementGap: baseOutput.retirementGap, monthlyInvestmentNeeded: baseOutput.monthlyInvestmentNeeded, currentMonthlyInvestment: baseOutput.currentMonthlyInvestment });
  const keyInsights = getKeyInsights(input, { surplusDeficit: baseOutput.surplusDeficit, emergencyFundGap: baseOutput.emergencyFundGap, taxStrategy });

  return {
    ...baseOutput,
    riskProfile,
    assetAllocation,
    monthlyBudgetAllocation,
    taxStrategy,
    insuranceRecommendations,
    netWorthProjection,
    stepByStepActionPlan: actionSteps,
    keyInsights,
  };
}