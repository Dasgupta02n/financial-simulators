"use client";

import { useState, useMemo, useCallback } from "react";
import type { CompoundInput } from "@/lib/calculators/compound/types";
import { computeCompound } from "@/lib/calculators/compound/engine";
import { formatINR, formatINRShort } from "@/lib/format";
import { MetricCard } from "@/components/sip/metric-card";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { Area, Line, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { twMerge } from "tailwind-merge";

const COMPOUND_OPTIONS = [
  { value: 1 as const, label: "Annual" },
  { value: 4 as const, label: "Quarterly" },
  { value: 12 as const, label: "Monthly" },
];

const DEFAULT_INPUT: CompoundInput = {
  principal: 100000,
  monthlyContribution: 5000,
  annualRate: 12,
  tenure: 10,
  compoundingFreq: 12,
  inflationRate: 6,
  taxSlab: 12.5,
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

export function CompoundCalculator() {
  const [input, setInput] = useState<CompoundInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof CompoundInput>(key: K, value: CompoundInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );

  const output = useMemo(() => computeCompound(input), [input]);
  const isNegativeReal = output.realYield < 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="lg:w-[40%]">
        <div className="flex flex-col gap-6 p-6 bg-surface rounded-lg border border-border">
          <h2 className="text-lg font-semibold tracking-tight">Configure Compound Interest</h2>
          <SliderRow label="Lump Sum (Principal)" value={input.principal}
            displayValue={formatINR(input.principal)}
            min={0} max={10000000} step={10000}
            onChange={(v) => handleInputChange("principal", v)} />
          <SliderRow label="Monthly Contribution" value={input.monthlyContribution}
            displayValue={formatINR(input.monthlyContribution)}
            min={0} max={200000} step={1000}
            onChange={(v) => handleInputChange("monthlyContribution", v)} />
          <SliderRow label="Annual Rate" value={input.annualRate}
            displayValue={`${input.annualRate}%`}
            min={2} max={30} step={0.5}
            onChange={(v) => handleInputChange("annualRate", v)} />
          <SliderRow label="Tenure" value={input.tenure}
            displayValue={`${input.tenure} yrs`}
            min={1} max={40} step={1}
            onChange={(v) => handleInputChange("tenure", v)} />
          <div className="flex flex-col gap-2">
            <span className="text-sm text-text-secondary">Compounding</span>
            <div className="flex gap-2">
              {COMPOUND_OPTIONS.map((opt) => (
                <button key={opt.value} className={twMerge(
                  "px-3 py-1.5 text-sm rounded-md font-mono transition-colors",
                  input.compoundingFreq === opt.value
                    ? "bg-gain/20 text-gain border border-gain/40"
                    : "bg-border text-text-secondary border border-border"
                )} onClick={() => handleInputChange("compoundingFreq", opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <SliderRow label="Tax on Gains (%)" value={input.taxSlab}
            displayValue={`${input.taxSlab}%`}
            min={0} max={30} step={0.5}
            onChange={(v) => handleInputChange("taxSlab", v)} />
          <SliderRow label="Inflation Rate" value={input.inflationRate}
            displayValue={`${input.inflationRate}%`}
            min={2} max={12} step={0.5}
            onChange={(v) => handleInputChange("inflationRate", v)} />
        </div>
      </div>
      <div className="lg:w-[60%]">
        <div className="flex flex-col gap-6">
          <CalcExplainer>
            <p className="font-semibold text-text-primary">What this calculator does</p>
            <p>It shows the actual growth of your money with compound interest — after paying tax on gains and adjusting for inflation. Most calculators only show the rosy nominal number. This one shows reality.</p>
            <p className="font-semibold text-text-primary">What each number means</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-text-primary">Maturity (Nominal)</span> — the raw number your investment grows to.</li>
              <li><span className="text-text-primary">Maturity (Post-Tax)</span> — what you actually receive after paying tax on gains.</li>
              <li><span className="text-text-primary">Real Value</span> — what your post-tax money can buy in today&apos;s prices.</li>
              <li><span className="text-text-primary">Nominal Yield</span> — CAGR of nominal value vs total invested.</li>
              <li><span className="text-text-primary">Real Yield</span> — your effective annual return after both tax and inflation.</li>
            </ul>
          </CalcExplainer>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard label="Total Invested" value={output.totalInvested} variant="neutral" />
            <MetricCard label="Maturity (Nominal)" value={output.maturityNominal} variant="neutral" />
            <MetricCard label="Maturity (Post-Tax)" value={output.maturityPostTax} variant="gain" />
            <MetricCard label="Real Value (Today's ₹)" value={output.maturityReal} variant={isNegativeReal ? "loss" : "gain"} />
            <MetricCard label="Nominal Yield" value={output.nominalYield} variant="neutral" />
            <MetricCard label="Real Yield" value={output.realYield} variant={isNegativeReal ? "loss" : "gain"} />
          </div>
          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Growth Over Time</h3>
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={output.yearlyData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={(v) => `Y${v}`} axisLine={{ stroke: "#1f2937" }} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={formatINRShort} axisLine={{ stroke: "#1f2937" }} tickLine={false} width={60} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px",
                    fontFamily: "var(--font-geist-mono)", fontSize: "11px" }}
                    labelFormatter={(v) => `Year ${v}`}
                    formatter={(value, name) => [formatINRShort(Number(value)), String(name)]} />
                  <Area type="monotone" dataKey="nominalValue" stroke="#6ee7b7" strokeWidth={2}
                    fill="url(#ciGrad)" name="Nominal" isAnimationActive={false} />
                  <Line type="monotone" dataKey="postTaxValue" stroke="#60a5fa" strokeWidth={2}
                    dot={false} name="Post-Tax" isAnimationActive={false} />
                  <Line type="monotone" dataKey="realValue" stroke="#f87171" strokeWidth={2}
                    strokeDasharray="6 4" dot={false} name="Real Value" isAnimationActive={false} />
                  <Line type="monotone" dataKey="invested" stroke="#9ca3af" strokeWidth={1}
                    strokeDasharray="3 3" dot={false} name="Invested" isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}