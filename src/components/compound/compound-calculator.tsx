"use client";

import { useState, useMemo, useCallback } from "react";
import type { CompoundInput } from "@/lib/calculators/compound/types";
import { computeCompound } from "@/lib/calculators/compound/engine";
import { formatINR, formatINRShort } from "@/lib/format";
import { MetricCard } from "@/components/sip/metric-card";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareButton } from "@/components/shared/share-button";
import { truthFromCompound } from "@/lib/truth/truth-data-adapter";
import { SliderRow } from "@/components/shared/slider-row";
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

export function CompoundCalculator() {
  const [input, setInput] = useState<CompoundInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof CompoundInput>(key: K, value: CompoundInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );

  const output = useMemo(() => computeCompound(input), [input]);
  const isNegativeReal = output.realYield < 0;

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-white shadow-sm rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">Configure Compound Interest</h2>
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
            onChange={(v) => handleInputChange("annualRate", v)} tickUnit="%" />
          <SliderRow label="Tenure" value={input.tenure}
            displayValue={`${input.tenure} yrs`}
            min={1} max={40} step={1}
            onChange={(v) => handleInputChange("tenure", v)} tickUnit=" yr" />
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
          <SliderRow label="Tax on Gains (%)" value={input.taxSlab}
            displayValue={`${input.taxSlab}%`}
            min={0} max={30} step={0.5}
            onChange={(v) => handleInputChange("taxSlab", v)} tickUnit="%" />
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
            <ShareButton title="Compound Interest Calculator — c7xai" />
          </div>
          <LieVsTruthPanel truth={truthFromCompound(output, input.inflationRate)} />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <MetricCard label="Total Invested" value={output.totalInvested} variant="neutral" />
            <MetricCard label="Maturity (Nominal)" value={output.maturityNominal} variant="neutral" />
            <MetricCard label="Maturity (Post-Tax)" value={output.maturityPostTax} variant="gain" />
            <MetricCard label="Real Value (Today's ₹)" value={output.maturityReal} variant={isNegativeReal ? "loss" : "gain"} />
            <MetricCard label="Nominal Yield" value={output.nominalYield} variant="neutral" />
            <MetricCard label="Real Yield" value={output.realYield} variant={isNegativeReal ? "loss" : "gain"} />
          </div>
          <div className="flex-1 min-h-0 bg-white rounded-lg border border-border shadow-sm p-4">
            <h3 className="text-xs font-semibold text-text-secondary mb-2">Growth Over Time</h3>
            <div className="w-full flex-1 min-h-[220px]">
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
                    fill="url(#ciGrad)" name="Nominal" isAnimationActive={true} />
                  <Line type="monotone" dataKey="postTaxValue" stroke="#60a5fa" strokeWidth={2}
                    dot={false} name="Post-Tax" isAnimationActive={true} />
                  <Line type="monotone" dataKey="realValue" stroke="#f87171" strokeWidth={2}
                    strokeDasharray="6 4" dot={false} name="Real Value" isAnimationActive={true} />
                  <Line type="monotone" dataKey="invested" stroke="#9ca3af" strokeWidth={1}
                    strokeDasharray="3 3" dot={false} name="Invested" isAnimationActive={true} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          <WhyThisNumber assumptions={truthFromCompound(output, input.inflationRate).assumptions} />
          <CalcExplainer>
            <p className="font-semibold text-text-primary">The truth about compound interest</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><span className="text-gain">Green area</span> — nominal value grows impressively. But that&apos;s not what you keep.</li>
              <li><span className="text-loss">Red dashed line</span> — real purchasing power after tax and inflation. The gap is what they don&apos;t show.</li>
              <li>When real yield is negative, your money loses purchasing power despite appearing to grow.</li>
            </ul>
          </CalcExplainer>
        </div>
      </div>
    </div>
  );
}