"use client";

import { useState, useMemo, useCallback } from "react";
import type { GoalInput, Goal } from "@/lib/calculators/goal/types";
import { computeGoals } from "@/lib/calculators/goal/engine";
import { formatINR } from "@/lib/format";
import { MetricCard } from "@/components/sip/metric-card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { twMerge } from "tailwind-merge";
import { CalcExplainer } from "@/components/shared/calc-explainer";

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
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm text-text-secondary">{label}</label>
        <span className="text-sm font-mono text-text-primary">{displayValue}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border accent-gain" />
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
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="lg:w-[40%]">
        <div className="flex flex-col gap-6 p-6 bg-surface rounded-lg border border-border">
          <h2 className="text-lg font-semibold tracking-tight">Goal-to-Action</h2>
          <SliderRow label="Inflation Rate" value={input.inflationRate} displayValue={`${input.inflationRate}%`}
            min={2} max={12} step={0.5} onChange={(v) => handleInputChange("inflationRate", v)} />
          <SliderRow label="Conservative Return" value={input.returnRateConservative} displayValue={`${input.returnRateConservative}%`}
            min={4} max={10} step={0.5} onChange={(v) => handleInputChange("returnRateConservative", v)} />
          <SliderRow label="Moderate Return" value={input.returnRateModerate} displayValue={`${input.returnRateModerate}%`}
            min={8} max={14} step={0.5} onChange={(v) => handleInputChange("returnRateModerate", v)} />
          <SliderRow label="Aggressive Return" value={input.returnRateAggressive} displayValue={`${input.returnRateAggressive}%`}
            min={10} max={18} step={0.5} onChange={(v) => handleInputChange("returnRateAggressive", v)} />

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-text-primary">Goals</span>
              <button onClick={addGoal} className="px-3 py-1 text-xs rounded-md font-mono bg-gain/20 text-gain border border-gain/40">+ Add</button>
            </div>
            {input.goals.map((goal) => (
              <div key={goal.id} className="flex flex-col gap-2 p-3 bg-border/30 rounded-md border border-border">
                <div className="flex justify-between items-center">
                  <input type="text" value={goal.name} onChange={(e) => updateGoal(goal.id, "name", e.target.value)}
                    className="text-sm font-mono bg-transparent border-none outline-none text-text-primary w-32" />
                  <button onClick={() => removeGoal(goal.id)} className="text-xs text-loss hover:text-loss/80">✕</button>
                </div>
                <div className="flex gap-3 items-center">
                  <input type="number" value={goal.targetAmount} onChange={(e) => updateGoal(goal.id, "targetAmount", parseInt(e.target.value) || 0)}
                    className="w-24 text-xs font-mono bg-transparent border border-border rounded px-2 py-1 text-text-primary" />
                  <select value={goal.yearsFromNow} onChange={(e) => updateGoal(goal.id, "yearsFromNow", parseInt(e.target.value))}
                    className="text-xs font-mono bg-transparent border border-border rounded px-2 py-1 text-text-primary">
                    {[1,2,3,5,8,10,15,20,25].map((y) => <option key={y} value={y}>{y}yr</option>)}
                  </select>
                  <select value={goal.priority} onChange={(e) => updateGoal(goal.id, "priority", e.target.value as Goal["priority"])}
                    className="text-xs font-mono bg-transparent border border-border rounded px-2 py-1 text-text-primary">
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
      <div className="lg:w-[60%]">
        <div className="flex flex-col gap-6">
          <CalcExplainer>
            <p className="font-semibold text-text-primary">What this calculator does</p>
            <p>Instead of starting with &quot;how much should I invest?&quot;, it starts with &quot;what do I want to achieve?&quot; and works backwards to tell you exactly how much to invest monthly for each goal — at three different risk levels.</p>
            <p className="font-semibold text-text-primary">How it works</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Enter each goal as today&apos;s cost (e.g., &quot;child education costs ₹20L today&quot;).</li>
              <li>The calculator inflates that cost to the future year (₹20L today = ₹48L in 15 years at 6% inflation).</li>
              <li>It reverse-calculates the monthly SIP needed to reach that inflated target.</li>
            </ul>
            <p className="font-semibold text-text-primary">Three risk profiles</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-text-primary">Conservative (7%)</span> — mostly debt/fixed income. Reliable but slow growth. Higher SIP needed.</li>
              <li><span className="text-text-primary">Moderate (12%)</span> — balanced equity + debt. The NIFTY long-term average. Moderate SIP.</li>
              <li><span className="text-text-primary">Aggressive (15%)</span> — mostly equity. Higher risk, but historically higher growth. Lowest SIP needed — but markets can dip in the short run.</li>
            </ul>
            <p className="font-semibold text-text-primary">Priority labels</p>
            <p>Essential = must-have (emergency fund, education). Important = should-have (house). Nice-to-have = can delay (vacation). Use these to decide what to fund first if your total SIP feels too high.</p>
          </CalcExplainer>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard label="Total SIP (Conservative)" value={output.totalMonthlyConservative} variant="neutral" />
            <MetricCard label="Total SIP (Moderate)" value={output.totalMonthlyModerate} variant="gain" />
            <MetricCard label="Total SIP (Aggressive)" value={output.totalMonthlyAggressive} variant="gain" />
          </div>

          <div className="flex flex-col gap-2">
            {output.goals.map((g) => (
              <div key={g.id} className="flex items-center gap-4 p-3 bg-surface rounded-lg border border-border">
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-text-primary truncate">{g.name}</span>
                    <span className={`text-xs font-mono ${PRIORITY_COLORS[g.priority]}`}>{g.priority}</span>
                  </div>
                  <div className="text-xs text-text-secondary font-mono">
                    {formatINR(g.todayValue)} today → {formatINR(g.inflatedTarget)} in {g.yearsFromNow}yr
                  </div>
                </div>
                <div className="text-right flex flex-col gap-0.5">
                  <span className="text-sm font-mono text-gain">₹{g.monthlySIPModerate.toLocaleString("en-IN")}/mo</span>
                  <span className="text-xs font-mono text-text-secondary">moderate</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Monthly SIP by Risk Profile</h3>
            <div className="w-full h-[300px]">
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
        </div>
      </div>
    </div>
  );
}