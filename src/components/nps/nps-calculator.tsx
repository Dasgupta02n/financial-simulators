"use client";

import { useState, useMemo, useCallback } from "react";
import type { NPSInput } from "@/lib/calculators/nps/types";
import { computeNPS } from "@/lib/calculators/nps/engine";
import { formatINR, formatINRShort } from "@/lib/format";
import { MetricCard } from "@/components/sip/metric-card";
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalcExplainer } from "@/components/shared/calc-explainer";

const DEFAULT_INPUT: NPSInput = {
  currentAge: 30,
  retirementAge: 60,
  monthlyContribution: 5000,
  employerContribution: 5000,
  equityReturn: 12,
  debtReturn: 7,
  annuityRate: 40,
  annuityReturn: 6,
  inflationRate: 6,
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

export function NPSCalculator() {
  const [input, setInput] = useState<NPSInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof NPSInput>(key: K, value: NPSInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );
  const output = useMemo(() => computeNPS(input), [input]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="lg:w-[40%]">
        <div className="flex flex-col gap-6 p-6 bg-surface rounded-lg border border-border">
          <h2 className="text-lg font-semibold tracking-tight">NPS Pension Modeler</h2>
          <SliderRow label="Current Age" value={input.currentAge} displayValue={`${input.currentAge}`}
            min={20} max={55} step={1} onChange={(v) => handleInputChange("currentAge", v)} />
          <SliderRow label="Retirement Age" value={input.retirementAge} displayValue={`${input.retirementAge}`}
            min={50} max={70} step={1} onChange={(v) => handleInputChange("retirementAge", v)} />
          <SliderRow label="Monthly Contribution" value={input.monthlyContribution} displayValue={`₹${(input.monthlyContribution / 1000).toFixed(1)}K`}
            min={500} max={50000} step={500} onChange={(v) => handleInputChange("monthlyContribution", v)} />
          <SliderRow label="Employer Contribution" value={input.employerContribution} displayValue={`₹${(input.employerContribution / 1000).toFixed(1)}K`}
            min={0} max={50000} step={500} onChange={(v) => handleInputChange("employerContribution", v)} />
          <SliderRow label="Equity Return" value={input.equityReturn} displayValue={`${input.equityReturn}%`}
            min={4} max={18} step={0.5} onChange={(v) => handleInputChange("equityReturn", v)} />
          <SliderRow label="Debt Return" value={input.debtReturn} displayValue={`${input.debtReturn}%`}
            min={3} max={10} step={0.5} onChange={(v) => handleInputChange("debtReturn", v)} />
          <SliderRow label="Annuity %" value={input.annuityRate} displayValue={`${input.annuityRate}%`}
            min={40} max={100} step={5} onChange={(v) => handleInputChange("annuityRate", v)} />
          <SliderRow label="Annuity Return" value={input.annuityReturn} displayValue={`${input.annuityReturn}%`}
            min={4} max={9} step={0.5} onChange={(v) => handleInputChange("annuityReturn", v)} />
          <SliderRow label="Inflation Rate" value={input.inflationRate} displayValue={`${input.inflationRate}%`}
            min={2} max={12} step={0.5} onChange={(v) => handleInputChange("inflationRate", v)} />
        </div>
      </div>
      <div className="lg:w-[60%]">
        <div className="flex flex-col gap-6">
          <CalcExplainer>
            <p className="font-semibold text-text-primary">What this calculator does</p>
            <p>It projects your National Pension System corpus growth and tells you what monthly pension to expect — in both nominal and real (inflation-adjusted) terms.</p>
            <p className="font-semibold text-text-primary">How NPS works at withdrawal</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-text-primary">60% Lumpsum</span> — withdrawn tax-free at retirement. You get this as a one-time payment.</li>
              <li><span className="text-text-primary">40% Annuity</span> — must be used to buy an annuity (pension plan) from an insurance company. This gives you a monthly pension, but the pension amount is fully taxable as &quot;Income from Other Sources.&quot;</li>
            </ul>
            <p className="font-semibold text-text-primary">Auto Choice lifecycle</p>
            <p>The <span className="text-warn">yellow line</span> in the chart shows your equity allocation automatically shifting down as you age: 75% equity until age 35, gradually reducing to 25% by age 55+. This protects older savers from market crashes near retirement.</p>
            <p className="font-semibold text-text-primary">What each number means</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-text-primary">Monthly Pension</span> — what you receive each month from the annuity.</li>
              <li><span className="text-text-primary">Real Monthly Pension</span> — what that pension can actually buy in today&apos;s prices. If inflation is 6%, a ₹35,000 pension in 30 years buys what ₹6,000 buys today.</li>
            </ul>
          </CalcExplainer>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard label="Corpus at Retirement" value={output.corpusAtRetirement} variant="gain" />
            <MetricCard label="Real Value (Today's ₹)" value={output.realCorpusAtRetirement} variant="neutral" />
            <MetricCard label="Lumpsum (Tax-Free)" value={output.lumpsumWithdrawal} variant="gain" />
            <MetricCard label="Annuity Corpus" value={output.annuityCorpus} variant="neutral" />
            <MetricCard label="Monthly Pension" value={output.monthlyPension} variant="gain" />
            <MetricCard label="Real Monthly Pension" value={output.realMonthlyPension} variant="neutral" />
          </div>

          <div className="p-3 bg-warn/10 border border-warn/30 rounded-lg text-sm font-mono text-warn">
            NPS Tax: 60% lumpsum withdrawal is tax-free. Annuity income ({formatINR(output.annuityTaxable)}/yr) is fully taxable as &quot;Income from Other Sources.&quot;
          </div>

          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Corpus Growth (Auto Choice Lifecycle)</h3>
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={output.yearlyData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="npsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="age" tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                    axisLine={{ stroke: "#1f2937" }} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={formatINRShort} axisLine={{ stroke: "#1f2937" }} tickLine={false} width={60} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={(v: number) => `${v}%`} axisLine={{ stroke: "#1f2937" }} tickLine={false} width={40} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px",
                    fontFamily: "var(--font-geist-mono)", fontSize: "11px" }}
                    labelFormatter={(v) => `Age ${v}`}
                    formatter={(value, name) => [String(name) === "Equity %" ? `${value}%` : formatINRShort(Number(value)), String(name)]} />
                  <Area yAxisId="left" type="monotone" dataKey="corpusEnd" stroke="#6ee7b7" strokeWidth={2}
                    fill="url(#npsGrad)" name="Corpus" isAnimationActive={false} />
                  <Line yAxisId="left" type="monotone" dataKey="realCorpusEnd" stroke="#f87171" strokeWidth={2}
                    strokeDasharray="6 4" dot={false} name="Real Value" isAnimationActive={false} />
                  <Line yAxisId="right" type="stepAfter" dataKey="equityPct" stroke="#fbbf24" strokeWidth={1.5}
                    dot={false} name="Equity %" isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-xs text-text-secondary font-mono px-1">
            Auto Choice lifecycle: Equity shifts from 75% → 25% with age. 60% lumpsum is tax-free; 40% annuity is fully taxable.
          </div>
        </div>
      </div>
    </div>
  );
}