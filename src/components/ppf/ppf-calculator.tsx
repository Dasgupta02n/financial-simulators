"use client";

import { useState, useMemo, useCallback } from "react";
import type { PPFInput } from "@/lib/calculators/ppf/types";
import { computePPF } from "@/lib/calculators/ppf/engine";
import { formatINR, formatINRShort } from "@/lib/format";
import { MetricCard } from "@/components/sip/metric-card";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareButton } from "@/components/shared/share-button";
import { truthFromPPF } from "@/lib/truth/truth-data-adapter";
import { Area, Line, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SliderRow } from "@/components/shared/slider-row";

const TENURE_OPTIONS = [
  { value: 15, label: "15 yrs" },
  { value: 20, label: "20 yrs" },
  { value: 25, label: "25 yrs" },
];

const DEFAULT_INPUT: PPFInput = {
  yearlyContribution: 150000,
  interestRate: 7.1,
  tenure: 15,
  inflationRate: 6,
};

export function PPFViewModel() {
  const [input, setInput] = useState<PPFInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof PPFInput>(key: K, value: PPFInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );

  const output = useMemo(() => computePPF(input), [input]);
  const isNegativeReal = output.realYield < 0;

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-white shadow-sm rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">Configure PPF</h2>
          <SliderRow label="Yearly Contribution" value={input.yearlyContribution}
            displayValue={formatINR(input.yearlyContribution)}
            min={500} max={150000} step={500}
            onChange={(v) => handleInputChange("yearlyContribution", v)} />
          <SliderRow label="Interest Rate" value={input.interestRate}
            displayValue={`${input.interestRate}%`}
            min={5} max={9} step={0.1}
            onChange={(v) => handleInputChange("interestRate", v)} tickUnit="%" />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary">Tenure</span>
            <div className="flex gap-2">
              {TENURE_OPTIONS.map((opt) => (
                <button key={opt.value} className={`px-3 py-1.5 text-xs rounded-md font-mono transition-colors ${
                  input.tenure === opt.value
                    ? "bg-sienna/10 text-sienna border border-sienna/30"
                    : "bg-surface-hover text-text-secondary border border-border"
                }`} onClick={() => handleInputChange("tenure", opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <SliderRow label="Inflation Rate" value={input.inflationRate}
            displayValue={`${input.inflationRate}%`}
            min={2} max={12} step={0.5}
            onChange={(v) => handleInputChange("inflationRate", v)} tickUnit="%" />
        </div>
      </div>
      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <ConfidenceBadge inflationRate={input.inflationRate} />
            <ShareButton title="PPF Calculator — c7xai" />
          </div>
          <LieVsTruthPanel truth={truthFromPPF({ totalInvested: output.totalInvested, maturityValue: output.maturityValue, realMaturityValue: output.realMaturityValue }, input.inflationRate)} />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <MetricCard label="Total Invested" value={output.totalInvested} variant="neutral" />
            <MetricCard label="Maturity Value" value={output.maturityValue} variant="gain" />
            <MetricCard label="Real Value (Today's ₹)" value={output.realMaturityValue} variant={isNegativeReal ? "loss" : "gain"} />
            <MetricCard label="Interest Earned" value={output.totalInterest} variant="gain" />
            <MetricCard label="Effective Yield" value={output.effectiveYield} variant="neutral" />
            <MetricCard label="Real Yield" value={output.realYield} variant={isNegativeReal ? "loss" : "gain"} />
          </div>
          {isNegativeReal && (
            <div className="p-2 bg-loss/10 border border-loss/30 rounded-lg text-xs font-mono text-loss">
              Real yield is negative — inflation erodes purchasing power faster than PPF grows it.
            </div>
          )}
          <div className="flex-1 min-h-0 bg-white rounded-lg border border-border shadow-sm p-4">
            <h3 className="text-xs font-semibold text-text-secondary mb-2">PPF Growth vs Inflation</h3>
            <div className="w-full flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={output.yearlyData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ppfGrad" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#ppfGrad)" name="Nominal" isAnimationActive={true} />
                  <Line type="monotone" dataKey="realValue" stroke="#f87171" strokeWidth={2}
                    strokeDasharray="6 4" dot={false} name="Real Value" isAnimationActive={true} />
                  <Line type="monotone" dataKey="invested" stroke="#9ca3af" strokeWidth={1}
                    strokeDasharray="3 3" dot={false} name="Invested" isAnimationActive={true} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          <WhyThisNumber assumptions={truthFromPPF({ totalInvested: output.totalInvested, maturityValue: output.maturityValue, realMaturityValue: output.realMaturityValue }, input.inflationRate).assumptions} />
          <CalcExplainer>
            <p className="font-semibold text-text-primary">The truth about PPF</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>PPF is tax-free (EEE status), but inflation still erodes purchasing power. The real value is what your money can actually buy.</li>
              <li><span className="text-loss">Red dashed line</span> — real purchasing power of your PPF maturity. The gap from the green area is what inflation steals.</li>
              <li>When real yield is negative, your PPF loses purchasing power despite tax-free returns.</li>
            </ul>
          </CalcExplainer>
        </div>
      </div>
    </div>
  );
}