"use client";

import { useState, useMemo, useCallback } from "react";
import type { GoalInput, Goal } from "@/lib/calculators/goal/types";
import { computeGoals } from "@/lib/calculators/goal/engine";
import { formatINR } from "@/lib/format";
import { MetricCard } from "@/components/sip/metric-card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { twMerge } from "tailwind-merge";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareButton } from "@/components/shared/share-button";
import { truthFromGoal } from "@/lib/truth/truth-data-adapter";

const DEFAULT_GOALS: Goal[] = [
  { id: "1", name: "Emergency Fund", targetAmount: 500000, yearsFromNow: 2, priority: "essential" },
  { id: "2", name: "Child Education", targetAmount: 2000000, yearsFromNow: 15, priority: "essential" },
  { id: "3", name: "House Down Payment", targetAmount: 1000000, yearsFromNow: 8, priority: "important" },
  { id: "4", name: "Vacation", targetAmount: 300000, yearsFromNow: 3, priority: "nice-to-have" },
];

const DEFAULT_INPUT: GoalInput = {
  goals: DEFAULT_GOALS,
  returnRateConservative: 7,
  returnRateModerate: 12,
  returnRateAggressive: 15,
  inflationRate: 6,
  currentAge: 30,
  timeHorizon: 25,
};

const PRIORITY_COLORS: Record<string, string> = {
  essential: "text-loss",
  important: "text-warn",
  "nice-to-have": "text-text-secondary",
};

function SliderRow({ label, value, displayValue, min, max, step, onChange }: {
  label: string; value: number; displayValue: string; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-baseline">
        <label className="text-xs text-text-secondary">{label}</label>
        <span className="text-xs font-mono text-text-primary">{displayValue}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer bg-border accent-gain" />
    </div>
  );
}

export function GoalCalculator() {
  const [input, setInput] = useState<GoalInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof GoalInput>(key: K, value: GoalInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );
  const output = useMemo(() => computeGoals(input), [input]);

  const chartData = output.goals.map((g) => ({
    name: g.name.length > 12 ? g.name.slice(0, 12) + "…" : g.name,
    conservative: g.monthlySIPConservative,
    moderate: g.monthlySIPModerate,
    aggressive: g.monthlySIPAggressive,
  }));

  function addGoal() {
    const id = String(input.goals.length + 1);
    setInput((prev) => ({
      ...prev,
      goals: [...prev.goals, { id, name: "New Goal", targetAmount: 500000, yearsFromNow: 5, priority: "important" as const }],
    }));
  }

  function removeGoal(id: string) {
    setInput((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));
  }

  function updateGoal(id: string, field: keyof Goal, value: string | number) {
    setInput((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => g.id === id ? { ...g, [field]: value } : g),
    }));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-surface rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">Goal-to-Action</h2>
          <SliderRow label="Inflation Rate" value={input.inflationRate} displayValue={`${input.inflationRate}%`}
            min={2} max={12} step={0.5} onChange={(v) => handleInputChange("inflationRate", v)} />
          <SliderRow label="Conservative Return" value={input.returnRateConservative} displayValue={`${input.returnRateConservative}%`}
            min={4} max={10} step={0.5} onChange={(v) => handleInputChange("returnRateConservative", v)} />
          <SliderRow label="Moderate Return" value={input.returnRateModerate} displayValue={`${input.returnRateModerate}%`}
            min={8} max={14} step={0.5} onChange={(v) => handleInputChange("returnRateModerate", v)} />
          <SliderRow label="Aggressive Return" value={input.returnRateAggressive} displayValue={`${input.returnRateAggressive}%`}
            min={10} max={18} step={0.5} onChange={(v) => handleInputChange("returnRateAggressive", v)} />

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-text-primary">Goals</span>
              <button onClick={addGoal} className="px-2 py-0.5 text-[10px] rounded-md font-mono bg-gain/20 text-gain border border-gain/40">+ Add</button>
            </div>
            {input.goals.map((goal) => (
              <div key={goal.id} className="flex flex-col gap-1 p-2 bg-border/30 rounded-md border border-border">
                <div className="flex justify-between items-center">
                  <input type="text" value={goal.name} onChange={(e) => updateGoal(goal.id, "name", e.target.value)}
                    className="text-xs font-mono bg-transparent border-none outline-none text-text-primary w-28" />
                  <button onClick={() => removeGoal(goal.id)} className="text-[10px] text-loss hover:text-loss/80">✕</button>
                </div>
                <div className="flex gap-2 items-center">
                  <input type="number" value={goal.targetAmount} onChange={(e) => updateGoal(goal.id, "targetAmount", parseInt(e.target.value) || 0)}
                    className="w-20 text-[10px] font-mono bg-transparent border border-border rounded px-1 py-0.5 text-text-primary" />
                  <select value={goal.yearsFromNow} onChange={(e) => updateGoal(goal.id, "yearsFromNow", parseInt(e.target.value))}
                    className="text-[10px] font-mono bg-transparent border border-border rounded px-1 py-0.5 text-text-primary">
                    {[1,2,3,5,8,10,15,20,25].map((y) => <option key={y} value={y}>{y}yr</option>)}
                  </select>
                  <select value={goal.priority} onChange={(e) => updateGoal(goal.id, "priority", e.target.value as Goal["priority"])}
                    className="text-[10px] font-mono bg-transparent border border-border rounded px-1 py-0.5 text-text-primary">
                    <option value="essential">Essential</option>
                    <option value="important">Important</option>
                    <option value="nice-to-have">Nice-to-have</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <ConfidenceBadge inflationRate={input.inflationRate} />
            <ShareButton title="Goal Planner — c7xai" />
          </div>
          <LieVsTruthPanel truth={truthFromGoal({ totalInflatedTarget: output.totalInflatedTarget ?? 0, totalMonthlyModerate: output.totalMonthlyModerate, goals: output.goals.map(g => ({ name: g.name, inflatedTarget: g.inflatedTarget, todayValue: g.todayValue })) }, input.inflationRate)} />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <MetricCard label="Total SIP (Conservative)" value={output.totalMonthlyConservative} variant="neutral" />
            <MetricCard label="Total SIP (Moderate)" value={output.totalMonthlyModerate} variant="gain" />
            <MetricCard label="Total SIP (Aggressive)" value={output.totalMonthlyAggressive} variant="gain" />
          </div>

          <div className="flex flex-col gap-1">
            {output.goals.map((g) => (
              <div key={g.id} className="flex items-center gap-2 p-2 bg-surface rounded-lg border border-border">
                <div className="flex flex-col gap-0 min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono text-text-primary truncate">{g.name}</span>
                    <span className={`text-[10px] font-mono ${PRIORITY_COLORS[g.priority]}`}>{g.priority}</span>
                  </div>
                  <div className="text-[10px] text-text-secondary font-mono">
                    {formatINR(g.todayValue)} today → {formatINR(g.inflatedTarget)} in {g.yearsFromNow}yr
                  </div>
                </div>
                <div className="text-right flex flex-col gap-0">
                  <span className="text-xs font-mono text-gain">₹{g.monthlySIPModerate.toLocaleString("en-IN")}/mo</span>
                  <span className="text-[10px] font-mono text-text-secondary">moderate</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 min-h-0 bg-surface rounded-lg border border-border p-4">
            <h3 className="text-xs font-semibold text-text-secondary mb-2">Monthly SIP by Risk Profile</h3>
            <div className="w-full flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                    axisLine={{ stroke: "#1f2937" }} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} axisLine={{ stroke: "#1f2937" }} tickLine={false} width={60} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px",
                    fontFamily: "var(--font-geist-mono)", fontSize: "11px" }}
                    formatter={(value, name) => [`₹${(Number(value) / 1000).toFixed(1)}K`, String(name)]} />
                  <Bar dataKey="conservative" fill="#9ca3af" name="Conservative" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="moderate" fill="#6ee7b7" name="Moderate" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="aggressive" fill="#fbbf24" name="Aggressive" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <WhyThisNumber assumptions={truthFromGoal({ totalInflatedTarget: output.totalInflatedTarget ?? 0, totalMonthlyModerate: output.totalMonthlyModerate, goals: output.goals.map(g => ({ name: g.name, inflatedTarget: g.inflatedTarget, todayValue: g.todayValue })) }, input.inflationRate).assumptions} />
          <CalcExplainer>
            <p className="font-semibold text-text-primary">The truth about goal planning</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Inflation silently doubles your goal costs. A ₹10L education goal becomes ₹18L+ in 10 years. You&apos;re saving for the inflated number, not today&apos;s.</li>
              <li>Each goal has a priority: essential goals get funded first, nice-to-haves last.</li>
              <li><span className="text-text-secondary">Gray bars</span> = conservative, <span className="text-gain">green</span> = moderate, <span className="text-warn">yellow</span> = aggressive SIP estimates.</li>
            </ul>
          </CalcExplainer>
        </div>
      </div>
    </div>
  );
}