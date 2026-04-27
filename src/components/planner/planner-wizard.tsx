"use client";

import { useState, useMemo } from "react";
import type { PlannerInput, PlannerGoal, LifeStage, IncomeBracket, GoalType, InsuranceType } from "@/lib/planner/types";
import { INCOME_BRACKETS, LIFE_STAGES, GOAL_TYPES, STEPS } from "@/lib/planner/types";
import { computePlanner } from "@/lib/planner/engine";
import { formatINR } from "@/lib/format";
import { LifeJourneyMap } from "@/components/planner/life-journey-map";
import { ShareBar } from "@/components/shared/share-bar";
import { DownloadReportButton } from "@/components/shared/download-report-button";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const DEFAULT_INPUT: PlannerInput = {
  ageRange: "25-35",
  dependents: 0,
  lifeStage: "single",
  incomeBracket: "10to25L",
  savingsRate: 20,
  monthlyInvestment: 15000,
  goals: [],
  insurance: [],
  inflationRate: 6,
};

export function PlannerWizard() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState<PlannerInput>(DEFAULT_INPUT);
  const output = useMemo(() => computePlanner(input), [input]);

  const canAdvance = step === 1
    ? !!input.lifeStage
    : step === 2
      ? input.monthlyInvestment > 0
      : step === 3
        ? input.goals.length > 0
        : true;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4">
      {/* Step indicator */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {STEPS.map((s) => (
          <button
            key={s.id}
            onClick={() => s.id <= step + 1 && setStep(Math.min(s.id, step))}
            className={twMerge(
              "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-mono whitespace-nowrap transition-colors",
              step === s.id ? "bg-sienna/10 text-sienna border border-sienna/30" :
              s.id < step ? "bg-surface-hover text-text-secondary" :
              "text-text-muted"
            )}
          >
            <span className={twMerge(
              "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
              s.id < step ? "bg-gain text-white" :
              s.id === step ? "bg-sienna text-white" :
              "bg-border text-text-muted"
            )}>
              {s.id < step ? "✓" : s.id}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Step content */}
      {step === 1 && <StepPersonal input={input} onChange={setInput} />}
      {step === 2 && <StepIncome input={input} onChange={setInput} />}
      {step === 3 && <StepGoals input={input} onChange={setInput} />}
      {step === 4 && <StepInsurance input={input} onChange={setInput} />}
      {step === 5 && <StepAnalysis input={input} output={output} />}
      {(step === 3 || step === 5) && input.goals.length > 0 && (
        <LifeJourneyMap goals={input.goals} currentAge={input.lifeStage === "near_retirement" ? 50 : input.lifeStage === "retired" ? 60 : input.lifeStage === "married_with_kids" ? 35 : 28} />
      )}
      {step === 6 && <StepAction input={input} output={output} />}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          className={twMerge("px-4 py-2 text-sm font-mono rounded-md transition-colors", step === 1 ? "invisible" : "bg-surface-hover text-text-secondary hover:bg-border")}
        >
          ← Back
        </button>
        {step < 6 ? (
          <button
            onClick={() => canAdvance && setStep(step + 1)}
            disabled={!canAdvance}
            className={twMerge(
              "px-6 py-2 text-sm font-semibold rounded-md transition-colors",
              canAdvance ? "bg-sienna text-white hover:bg-sienna/90" : "bg-border text-text-muted cursor-not-allowed"
            )}
          >
            {step === 4 ? "See Analysis →" : "Continue →"}
          </button>
        ) : (
          <Link href="/" className="px-6 py-2 text-sm font-semibold rounded-md bg-sienna text-white hover:bg-sienna/90 transition-colors">
            Start Over
          </Link>
        )}
      </div>
    </div>
  );
}

/* ── Step 1: Personal ──────────────────────────────── */
function StepPersonal({ input, onChange }: { input: PlannerInput; onChange: (i: PlannerInput) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary font-serif-display">Tell us about yourself</h2>
        <p className="text-sm text-text-secondary mt-1">No personal data collected. We use ranges only.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-text-secondary uppercase tracking-wider">Life Stage</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {LIFE_STAGES.map((s) => (
            <button
              key={s.value}
              onClick={() => onChange({ ...input, lifeStage: s.value })}
              className={twMerge(
                "flex flex-col items-center gap-1 p-3 rounded-lg border text-sm transition-colors",
                input.lifeStage === s.value
                  ? "bg-sienna/10 border-sienna/30 text-sienna"
                  : "bg-white border-border text-text-secondary hover:border-sienna/30"
              )}
            >
              <span className="text-xl">{s.icon}</span>
              <span className="text-xs font-mono">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-text-secondary uppercase tracking-wider">Number of Dependents</label>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => onChange({ ...input, dependents: n })}
              className={twMerge(
                "px-4 py-2 rounded-md text-sm font-mono border transition-colors",
                input.dependents === n ? "bg-sienna/10 border-sienna/30 text-sienna" : "bg-white border-border text-text-secondary"
              )}
            >
              {n}{n === 0 ? " (just me)" : n === 1 ? "" : ""}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: Income ─────────────────────────────────── */
function StepIncome({ input, onChange }: { input: PlannerInput; onChange: (i: PlannerInput) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary font-serif-display">Income & Savings</h2>
        <p className="text-sm text-text-secondary mt-1">Select your bracket — no exact amounts needed.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-text-secondary uppercase tracking-wider">Annual Income Bracket</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {INCOME_BRACKETS.map((b) => (
            <button
              key={b.value}
              onClick={() => onChange({ ...input, incomeBracket: b.value })}
              className={twMerge(
                "p-3 rounded-lg border text-sm font-mono transition-colors text-left",
                input.incomeBracket === b.value
                  ? "bg-sienna/10 border-sienna/30 text-sienna"
                  : "bg-white border-border text-text-secondary hover:border-sienna/30"
              )}
            >
              <div className="font-semibold">{b.label}</div>
              <div className="text-[10px] text-text-muted mt-1">{b.range}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-text-secondary uppercase tracking-wider">
          Savings Rate: {input.savingsRate}%
        </label>
        <input
          type="range"
          min={5}
          max={60}
          step={5}
          value={input.savingsRate}
          onChange={(e) => onChange({ ...input, savingsRate: Number(e.target.value) })}
          className="w-full accent-sienna"
        />
        <div className="flex justify-between text-[10px] text-text-muted font-mono">
          <span>5% (barely saving)</span>
          <span>60% (aggressive saver)</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-text-secondary uppercase tracking-wider">
          Monthly Investment: {formatINR(input.monthlyInvestment)}
        </label>
        <input
          type="range"
          min={1000}
          max={500000}
          step={1000}
          value={input.monthlyInvestment}
          onChange={(e) => onChange({ ...input, monthlyInvestment: Number(e.target.value) })}
          className="w-full accent-sienna"
        />
        <div className="flex justify-between text-[10px] text-text-muted font-mono">
          <span>₹1,000</span>
          <span>₹5,00,000</span>
        </div>
      </div>
    </div>
  );
}

/* ── Step 3: Goals ─────────────────────────────────── */
function StepGoals({ input, onChange }: { input: PlannerInput; onChange: (i: PlannerInput) => void }) {
  const addGoal = (type: GoalType) => {
    const template = GOAL_TYPES.find((g) => g.value === type);
    if (!template) return;
    const newGoal: PlannerGoal = {
      id: `${type}_${Date.now()}`,
      type,
      name: template.label,
      targetAmount: template.defaultAmount,
      yearsFromNow: template.defaultYears,
      priority: "important",
    };
    onChange({ ...input, goals: [...input.goals, newGoal] });
  };

  const updateGoal = (id: string, updates: Partial<PlannerGoal>) => {
    onChange({
      ...input,
      goals: input.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    });
  };

  const removeGoal = (id: string) => {
    onChange({ ...input, goals: input.goals.filter((g) => g.id !== id) });
  };

  const existingTypes = input.goals.map((g) => g.type);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary font-serif-display">Your Financial Goals</h2>
        <p className="text-sm text-text-secondary mt-1">Add goals you&apos;re saving for. We&apos;ll check if you&apos;re on track.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {GOAL_TYPES.filter((g) => !existingTypes.includes(g.value)).map((g) => (
          <button
            key={g.value}
            onClick={() => addGoal(g.value)}
            className="px-3 py-1.5 text-xs font-mono rounded-md border border-border text-text-secondary hover:border-sienna/30 hover:text-sienna transition-colors"
          >
            + {g.label}
          </button>
        ))}
      </div>

      {input.goals.length === 0 && (
        <div className="text-center py-8 text-text-muted text-sm font-mono">
          Add at least one goal to continue
        </div>
      )}

      <div className="flex flex-col gap-3">
        {input.goals.map((goal) => (
          <div key={goal.id} className="p-4 bg-white border border-border rounded-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-text-primary">{goal.name}</span>
              <button onClick={() => removeGoal(goal.id)} className="text-xs text-loss hover:text-loss/80">×</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Target Amount</label>
                <input
                  type="range"
                  min={50000}
                  max={100000000}
                  step={50000}
                  value={goal.targetAmount}
                  onChange={(e) => updateGoal(goal.id, { targetAmount: Number(e.target.value) })}
                  className="w-full accent-sienna"
                />
                <span className="text-xs font-mono text-text-secondary">{formatINR(goal.targetAmount)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Years from now</label>
                <input
                  type="range"
                  min={1}
                  max={40}
                  step={1}
                  value={goal.yearsFromNow}
                  onChange={(e) => updateGoal(goal.id, { yearsFromNow: Number(e.target.value) })}
                  className="w-full accent-sienna"
                />
                <span className="text-xs font-mono text-text-secondary">{goal.yearsFromNow} years</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono text-text-muted uppercase">Priority</label>
              <div className="flex gap-2">
                {(["essential", "important", "nice_to_have"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateGoal(goal.id, { priority: p })}
                    className={twMerge(
                      "px-3 py-1 text-xs font-mono rounded border transition-colors",
                      goal.priority === p
                        ? p === "essential" ? "bg-loss/10 border-loss/30 text-loss"
                          : p === "important" ? "bg-amber-50 border-amber-200 text-amber-700"
                          : "bg-surface-hover border-border text-text-secondary"
                        : "bg-white border-border text-text-muted"
                    )}
                  >
                    {p === "essential" ? "Must have" : p === "important" ? "Should have" : "Nice to have"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Step 4: Insurance ─────────────────────────────── */
function StepInsurance({ input, onChange }: { input: PlannerInput; onChange: (i: PlannerInput) => void }) {
  const toggleInsurance = (type: InsuranceType) => {
    const has = input.insurance.includes(type);
    onChange({
      ...input,
      insurance: has ? input.insurance.filter((i) => i !== type) : [...input.insurance, type],
    });
  };

  const types: { value: InsuranceType; label: string; desc: string }[] = [
    { value: "life", label: "Life Insurance", desc: "Term plan recommended. 10-15x annual income cover." },
    { value: "health", label: "Health Insurance", desc: "Family floater. ₹10-15L base cover minimum." },
    { value: "vehicle", label: "Vehicle Insurance", desc: "Mandatory for car/bike owners. Comprehensive preferred." },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary font-serif-display">Existing Insurance</h2>
        <p className="text-sm text-text-secondary mt-1">Select all that apply. We&apos;ll flag gaps.</p>
      </div>

      <div className="flex flex-col gap-3">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => toggleInsurance(t.value)}
            className={twMerge(
              "p-4 rounded-lg border text-left transition-colors",
              input.insurance.includes(t.value)
                ? "bg-gain/10 border-gain/30"
                : "bg-white border-border hover:border-sienna/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={twMerge(
                "w-5 h-5 rounded border-2 flex items-center justify-center text-xs",
                input.insurance.includes(t.value) ? "bg-gain border-gain text-white" : "border-border"
              )}>
                {input.insurance.includes(t.value) ? "✓" : ""}
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">{t.label}</div>
                <div className="text-xs text-text-secondary mt-0.5">{t.desc}</div>
              </div>
            </div>
          </button>
        ))}
        <button
          onClick={() => toggleInsurance("none")}
          className={twMerge(
            "p-4 rounded-lg border text-left transition-colors",
            input.insurance.includes("none")
              ? "bg-loss/10 border-loss/30"
              : "bg-white border-border hover:border-sienna/30"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={twMerge(
              "w-5 h-5 rounded border-2 flex items-center justify-center text-xs",
              input.insurance.includes("none") ? "bg-loss border-loss text-white" : "border-border"
            )}>
              {input.insurance.includes("none") ? "✓" : ""}
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary">No Insurance</div>
              <div className="text-xs text-text-secondary mt-0.5">We&apos;ll strongly recommend getting covered.</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ── Step 5: Analysis ──────────────────────────────── */
function StepAnalysis({ input, output }: { input: PlannerInput; output: ReturnType<typeof computePlanner> }) {
  const surplusColor = output.surplusDeficit >= 0 ? "text-gain" : "text-loss";
  const surplusLabel = output.surplusDeficit >= 0 ? "Surplus" : "Deficit";
  const riskColors: Record<string, string> = {
    aggressive: "bg-gain/10 text-gain border-gain/30",
    moderate: "bg-amber-50 text-amber-700 border-amber-200",
    conservative: "bg-blue-50 text-blue-700 border-blue-200",
  };
  const riskLabels: Record<string, string> = {
    aggressive: "Aggressive — High risk, high growth potential",
    moderate: "Moderate — Balanced risk and growth",
    conservative: "Conservative — Capital preservation focused",
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary font-serif-display">Your Financial Analysis</h2>
        <p className="text-sm text-text-secondary mt-1">Comprehensive gap analysis, risk profile, and allocation breakdown.</p>
      </div>

      {/* Risk profile badge */}
      <div className={twMerge("p-3 rounded-lg border flex items-center justify-between", riskColors[output.riskProfile])}>
        <div>
          <div className="text-sm font-semibold capitalize">{output.riskProfile} Risk Profile</div>
          <div className="text-xs mt-0.5 opacity-80">{riskLabels[output.riskProfile]}</div>
        </div>
        <div className="text-2xl">{output.riskProfile === "aggressive" ? "📈" : output.riskProfile === "moderate" ? "⚖️" : "🛡️"}</div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-white border border-border rounded-lg">
          <div className="text-[10px] uppercase font-mono text-text-muted">Monthly Invested</div>
          <div className="text-lg font-mono font-semibold text-text-primary">{formatINR(output.currentMonthlyInvestment)}</div>
        </div>
        <div className="p-3 bg-white border border-border rounded-lg">
          <div className="text-[10px] uppercase font-mono text-text-muted">Monthly Needed</div>
          <div className="text-lg font-mono font-semibold text-text-primary">{formatINR(output.monthlyInvestmentNeeded)}</div>
        </div>
        <div className="p-3 bg-white border border-border rounded-lg">
          <div className="text-[10px] uppercase font-mono text-text-muted">{surplusLabel}</div>
          <div className={twMerge("text-lg font-mono font-semibold", surplusColor)}>{formatINR(Math.abs(output.surplusDeficit))}</div>
        </div>
        <div className="p-3 bg-white border border-border rounded-lg">
          <div className="text-[10px] uppercase font-mono text-text-muted">Emergency Fund Gap</div>
          <div className={twMerge("text-lg font-mono font-semibold", output.emergencyFundGap > 0 ? "text-loss" : "text-gain")}>
            {output.emergencyFundGap > 0 ? formatINR(output.emergencyFundGap) : "Covered ✓"}
          </div>
        </div>
      </div>

      {/* Asset allocation */}
      <div className="p-4 bg-white border border-border rounded-lg">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Recommended Asset Allocation</h3>
        <div className="flex h-8 rounded-lg overflow-hidden mb-3">
          {[
            { label: "Equity", value: output.assetAllocation.equity, color: "bg-blue-500" },
            { label: "Debt", value: output.assetAllocation.debt, color: "bg-green-500" },
            { label: "Gold", value: output.assetAllocation.gold, color: "bg-amber-400" },
            { label: "Real Estate", value: output.assetAllocation.realEstate, color: "bg-purple-500" },
            { label: "Cash", value: output.assetAllocation.cash, color: "bg-gray-400" },
          ].filter((s) => s.value > 0).map((slice) => (
            <div key={slice.label} className={twMerge(slice.color, "flex items-center justify-center text-white text-[10px] font-mono font-semibold")} style={{ width: `${slice.value}%` }}>
              {slice.value > 8 ? `${slice.value}%` : ""}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-mono">
          {[
            { label: "Equity", value: output.assetAllocation.equity, color: "bg-blue-500" },
            { label: "Debt", value: output.assetAllocation.debt, color: "bg-green-500" },
            { label: "Gold", value: output.assetAllocation.gold, color: "bg-amber-400" },
            { label: "Real Estate", value: output.assetAllocation.realEstate, color: "bg-purple-500" },
            { label: "Cash", value: output.assetAllocation.cash, color: "bg-gray-400" },
          ].filter((s) => s.value > 0).map((slice) => (
            <div key={slice.label} className="flex items-center gap-1">
              <div className={twMerge("w-2.5 h-2.5 rounded-sm", slice.color)} />
              <span className="text-text-secondary">{slice.label}: {slice.value}%</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-2">{output.assetAllocation.rationale}</p>
      </div>

      {/* Tax strategy */}
      <div className="p-4 bg-white border border-border rounded-lg">
        <h3 className="text-sm font-semibold text-text-primary mb-1">
          {output.taxStrategy.regime === "new" ? "🟢" : "🔵"} {output.taxStrategy.regime === "new" ? "New" : "Old"} Tax Regime Recommended
        </h3>
        <p className="text-xs text-text-secondary mb-3">{output.taxStrategy.regimeReason}</p>
        {output.taxStrategy.estimatedTaxSavings > 0 && (
          <div className="p-2 bg-gain/10 border border-gain/20 rounded text-xs font-mono text-gain mb-3">
            Estimated tax savings: {formatINR(output.taxStrategy.estimatedTaxSavings)}/year
          </div>
        )}
        <div className="flex flex-col gap-2">
          {output.taxStrategy.deductions.map((d) => (
            <div key={d.section} className="flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-text-primary font-semibold">{d.section}</span>
                <span className="text-text-muted ml-1">— {d.description}</span>
              </div>
              <div className="text-text-secondary">
                {formatINR(d.recommendedAmount)} <span className="text-text-muted">/ {formatINR(d.maxAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance recommendations */}
      {output.insuranceRecommendations.length > 0 && (
        <div className="p-4 bg-white border border-border rounded-lg">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Insurance Recommendations</h3>
          <div className="flex flex-col gap-2">
            {output.insuranceRecommendations.map((rec, i) => (
              <div key={i} className={twMerge(
                "p-3 rounded-md border",
                rec.priority === "critical" ? "bg-loss/5 border-loss/20" :
                rec.priority === "high" ? "bg-amber-50 border-amber-200" :
                "bg-surface-hover border-border"
              )}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-text-primary">{rec.type}</span>
                  <span className={twMerge(
                    "text-[10px] font-mono px-1.5 py-0.5 rounded",
                    rec.priority === "critical" ? "bg-loss/10 text-loss" :
                    rec.priority === "high" ? "bg-amber-50 text-amber-700" : "bg-surface-hover text-text-secondary"
                  )}>
                    {rec.priority}
                  </span>
                </div>
                {rec.recommendedCover > 0 && (
                  <div className="text-xs font-mono text-text-secondary">Cover: {formatINR(rec.recommendedCover)} · Premium: ~{formatINR(rec.estimatedPremium)}/yr</div>
                )}
                <p className="text-xs text-text-secondary mt-1">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly budget allocation */}
      {output.monthlyBudgetAllocation.length > 0 && (
        <div className="p-4 bg-white border border-border rounded-lg">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Monthly Budget Allocation</h3>
          <div className="flex flex-col gap-2">
            {output.monthlyBudgetAllocation.map((alloc, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-primary">{alloc.category}</span>
                    <span className="text-xs font-mono text-text-secondary">{formatINR(alloc.amount)}/mo ({alloc.percentage}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full mt-1">
                    <div className="h-full bg-sienna rounded-full" style={{ width: `${Math.min(alloc.percentage, 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5">{alloc.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goal gaps */}
      {output.goalGaps.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text-primary">Goal Gaps</h3>
          {output.goalGaps.map((gg) => (
            <div key={gg.goal.id} className="p-4 bg-white border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-text-primary">{gg.goal.name}</span>
                <span className={twMerge(
                  "text-xs font-mono px-2 py-0.5 rounded",
                  gg.goal.priority === "essential" ? "bg-loss/10 text-loss" :
                  gg.goal.priority === "important" ? "bg-amber-50 text-amber-700" : "bg-surface-hover text-text-secondary"
                )}>
                  {gg.goal.priority === "essential" ? "Essential" : gg.goal.priority === "important" ? "Important" : "Nice to have"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                <div>
                  <div className="text-text-muted">Today&apos;s Target</div>
                  <div className="text-text-primary font-semibold">{formatINR(gg.goal.targetAmount)}</div>
                </div>
                <div>
                  <div className="text-text-muted">Inflated Target</div>
                  <div className="text-loss font-semibold">{formatINR(gg.inflatedTarget)}</div>
                </div>
                <div>
                  <div className="text-text-muted">You&apos;ll Have</div>
                  <div className="text-text-primary font-semibold">{formatINR(gg.projectedAmount)}</div>
                </div>
                <div>
                  <div className="text-text-muted">SIP Needed</div>
                  <div className="text-sienna font-semibold">{formatINR(gg.monthlySIPNeeded)}/mo</div>
                </div>
              </div>
              {gg.gap > 0 && (
                <div className="mt-2 p-2 bg-loss/10 border border-loss/20 rounded text-xs font-mono text-loss">
                  Gap of {formatINR(gg.gap)} — need {formatINR(gg.monthlySIPNeeded)}/mo SIP to reach this goal in {gg.goal.yearsFromNow} years
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Step 6: Action Plan ────────────────────────────── */
function StepAction({ input, output }: { input: PlannerInput; output: ReturnType<typeof computePlanner> }) {
  const priorityColors: Record<string, string> = {
    critical: "bg-loss/10 border-loss/30 text-loss",
    high: "bg-amber-50 border-amber-200 text-amber-700",
    medium: "bg-surface-hover border-border text-text-secondary",
    low: "bg-white border-border text-text-muted",
  };

  // Build calculator data for the download report button
  const calculatorData: Record<string, string> = {
    "Risk Profile": output.riskProfile,
    "Monthly Invested": formatINR(output.currentMonthlyInvestment),
    "Monthly Needed": formatINR(output.monthlyInvestmentNeeded),
    "Surplus/Deficit": formatINR(Math.abs(output.surplusDeficit)),
    "Emergency Fund Gap": output.emergencyFundGap > 0 ? formatINR(output.emergencyFundGap) : "Covered",
    "Retirement Corpus Needed": formatINR(output.retirementCorpusNeeded),
    "Asset Allocation": `Equity ${output.assetAllocation.equity}% / Debt ${output.assetAllocation.debt}% / Gold ${output.assetAllocation.gold}% / RE ${output.assetAllocation.realEstate}%`,
    "Tax Regime": output.taxStrategy.regime === "new" ? "New" : "Old",
    "Est. Tax Savings": formatINR(output.taxStrategy.estimatedTaxSavings) + "/yr",
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary font-serif-display">Your Action Plan</h2>
        <p className="text-sm text-text-secondary mt-1">Step-by-step guidance with specific amounts and timelines.</p>
      </div>

      {/* Key insights */}
      {output.keyInsights.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="text-sm font-semibold text-amber-700 mb-2">Key Insights</h3>
          <ul className="flex flex-col gap-1.5">
            {output.keyInsights.map((insight, i) => (
              <li key={i} className="text-xs text-amber-800 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">●</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step-by-step action plan */}
      {output.stepByStepActionPlan.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text-primary">Step-by-Step Plan</h3>
          {output.stepByStepActionPlan.map((step) => (
            <div key={step.step} className="p-4 bg-white border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-sienna text-white text-xs font-bold flex items-center justify-center">{step.step}</span>
                <div>
                  <div className="text-sm font-semibold text-text-primary">{step.title}</div>
                  <div className="text-[10px] font-mono text-sienna">{step.timeframe}</div>
                </div>
              </div>
              <p className="text-xs text-text-secondary mb-2">{step.description}</p>
              <ul className="flex flex-col gap-1">
                {step.actionItems.map((item, i) => (
                  <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                    <span className="text-sienna mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
              {step.calculatorLink && (
                <Link href={step.calculatorLink} className="inline-block mt-2 text-xs font-mono text-sienna hover:text-sienna/80 underline">
                  Open calculator →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recommendations summary */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-text-primary">Priority Recommendations</h3>
        {output.recommendations.map((rec, i) => (
          <div key={rec.id} className={twMerge("p-4 rounded-lg border", priorityColors[rec.priority] || "bg-white border-border")}>
            <div className="flex items-start gap-3">
              <span className="text-sm font-bold">{i + 1}.</span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{rec.title}</div>
                <div className="text-xs mt-1 opacity-80">{rec.description}</div>
                <div className="text-xs mt-2 font-mono font-semibold">{rec.action}</div>
                {rec.calculatorLink && (
                  <Link href={rec.calculatorLink} className="inline-block mt-2 text-xs font-mono text-sienna hover:text-sienna/80 underline">
                    Open calculator →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Net worth projection */}
      {output.netWorthProjection.length > 0 && (
        <div className="p-4 bg-white border border-border rounded-lg">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Net Worth Projection</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1.5 text-text-muted">Year</th>
                  <th className="text-right py-1.5 text-text-muted">Age</th>
                  <th className="text-right py-1.5 text-text-muted">Invested</th>
                  <th className="text-right py-1.5 text-text-muted">Returns</th>
                  <th className="text-right py-1.5 text-text-muted">Total Corpus</th>
                </tr>
              </thead>
              <tbody>
                {output.netWorthProjection.filter((_, i) => i % 5 === 0 || i === output.netWorthProjection.length - 1).map((row) => (
                  <tr key={row.year} className="border-b border-border/50">
                    <td className="py-1.5 text-text-primary">Y{row.year}</td>
                    <td className="py-1.5 text-right text-text-secondary">{row.age}</td>
                    <td className="py-1.5 text-right text-text-secondary">{formatINR(row.invested)}</td>
                    <td className="py-1.5 text-right text-gain">{formatINR(row.returns)}</td>
                    <td className="py-1.5 text-right text-text-primary font-semibold">{formatINR(row.totalCorpus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Linked calculators */}
      {output.calculatorLinks.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text-primary">Recommended Calculators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {output.calculatorLinks.map((link) => (
              <Link
                key={link.slug}
                href={`/${link.slug}`}
                className="p-3 bg-white border border-border rounded-lg hover:border-sienna/30 transition-colors group"
              >
                <div className="text-sm font-semibold text-text-primary group-hover:text-sienna transition-colors">{link.label}</div>
                <div className="text-xs text-text-muted mt-1">{link.reason}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Download report + Share */}
      <div className="flex flex-col gap-3">
        <DownloadReportButton calculatorTitle="Financial Planner" calculatorData={calculatorData} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-mono">Share:</span>
          <ShareBar title="Financial Planner — c7xai" />
        </div>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-mono text-amber-700">
        This is a planning tool, not financial advice. Consult a SEBI-registered advisor before making investment decisions.
      </div>
    </div>
  );
}