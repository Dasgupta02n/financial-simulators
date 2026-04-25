"use client";

import { useState, useMemo, useCallback } from "react";
import type { FDInput } from "@/lib/calculators/fd/types";
import { computeFD } from "@/lib/calculators/fd/engine";
import { formatINR } from "@/lib/format";
import { formatINRShort } from "@/lib/format";
import { Area, Bar, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MetricCard } from "@/components/sip/metric-card";
import { twMerge } from "tailwind-merge";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareButton } from "@/components/shared/share-button";
import { truthFromFD } from "@/lib/truth/truth-data-adapter";
import { SliderRow } from "@/components/shared/slider-row";

const COMPOUND_OPTIONS = [
  { value: 1, label: "Annual" },
  { value: 4, label: "Quarterly" },
  { value: 12, label: "Monthly" },
];

const DEFAULT_INPUT: FDInput = {
  principal: 1000000,
  tenure: 5,
  interestRate: 7,
  compoundingFreq: 4,
  taxSlab: 30,
  inflationRate: 6,
};

export function FDCalculator() {
  const [input, setInput] = useState<FDInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof FDInput>(key: K, value: FDInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );
  const output = useMemo(() => computeFD(input), [input]);
  const isNegativeReal = output.realYield < 0;

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-white shadow-sm rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">Configure FD</h2>
          <SliderRow label="Principal" value={input.principal} displayValue={formatINR(input.principal)}
            min={10000} max={50000000} step={10000} onChange={(v) => handleInputChange("principal", v)} />
          <SliderRow label="Interest Rate" value={input.interestRate} displayValue={`${input.interestRate}%`}
            min={2} max={12} step={0.25} onChange={(v) => handleInputChange("interestRate", v)} tickUnit="%" />
          <SliderRow label="Tenure" value={input.tenure} displayValue={`${input.tenure} yrs`}
            min={1} max={20} step={1} onChange={(v) => handleInputChange("tenure", v)} tickUnit=" yr" />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary">Compounding</span>
            <div className="flex gap-2">
              {COMPOUND_OPTIONS.map((opt) => (
                <button key={opt.value} className={twMerge(
                  "px-3 py-1.5 text-xs rounded-md font-mono transition-colors",
                  input.compoundingFreq === opt.value
                    ? "bg-sienna/10 text-sienna border border-sienna/30"
                    : "bg-surface-hover text-text-secondary border border-border"
                )} onClick={() => handleInputChange("compoundingFreq", opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <SliderRow label="Tax Slab" value={input.taxSlab} displayValue={`${input.taxSlab}%`}
            min={0} max={30} step={5} onChange={(v) => handleInputChange("taxSlab", v)} tickUnit="%" />
          <SliderRow label="Inflation Rate" value={input.inflationRate} displayValue={`${input.inflationRate}%`}
            min={2} max={12} step={0.5} onChange={(v) => handleInputChange("inflationRate", v)} tickUnit="%" />
        </div>
      </div>
      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <ConfidenceBadge inflationRate={input.inflationRate} />
            <ShareButton title="FD Comparator — c7xai" />
          </div>
          <LieVsTruthPanel truth={truthFromFD(output, input.inflationRate)} />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <MetricCard label="Maturity (Gross)" value={output.maturityGross} variant="neutral" />
            <MetricCard label="Maturity (Post-Tax)" value={output.maturityPostTax} variant="gain" />
            <MetricCard label="Real Value (Today's ₹)" value={output.maturityReal} variant={isNegativeReal ? "loss" : "gain"} />
            <MetricCard label="Post-Tax Yield" value={output.postTaxYield} variant="neutral" />
            <MetricCard label="Real Yield" value={output.realYield} variant={isNegativeReal ? "loss" : "gain"} />
          </div>
          {isNegativeReal && (
            <div className="p-2 bg-loss/10 border border-loss/30 rounded-lg text-xs font-mono text-loss">
              Real yield is negative — inflation erodes purchasing power faster than post-tax FD returns grow it.
            </div>
          )}
          <div className="text-xs text-text-secondary font-mono px-1">
            Gross interest: {formatINR(output.totalInterestGross)} → Post-tax: {formatINR(output.totalInterestPostTax)} (Tax: {formatINR(output.totalInterestGross - output.totalInterestPostTax)})
          </div>
          <div className="flex-1 min-h-0 bg-white rounded-lg border border-border shadow-sm p-4">
            <h3 className="text-xs font-semibold text-text-secondary mb-2">Growth vs Inflation</h3>
            <div className="w-full flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={output.yearlyData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#9ca3af" stopOpacity={0.02} />
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
                  <Area type="monotone" dataKey="grossValue" stroke="#9ca3af" strokeWidth={1}
                    fill="url(#grossGrad)" name="Gross" isAnimationActive={true} />
                  <Line type="monotone" dataKey="postTaxValue" stroke="#6ee7b7" strokeWidth={2}
                    dot={false} name="Post-Tax" isAnimationActive={true} />
                  <Line type="monotone" dataKey="realValue" stroke="#f87171" strokeWidth={2}
                    strokeDasharray="6 4" dot={false} name="Real Value" isAnimationActive={true} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          <WhyThisNumber assumptions={truthFromFD(output, input.inflationRate).assumptions} />
          <CalcExplainer>
            <p className="font-semibold text-text-primary">The truth about FD returns</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Banks advertise gross interest — but you pay tax on every rupee of FD interest at your slab rate.</li>
              <li><span className="text-loss">Red dashed line</span> — what your FD can actually buy after inflation. Often negative.</li>
              <li>When real yield is negative, your money loses purchasing power every year it sits in an FD.</li>
            </ul>
          </CalcExplainer>
        </div>
      </div>
    </div>
  );
}