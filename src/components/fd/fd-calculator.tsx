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
import { CalcVisualization } from "@/components/shared/calc-visualization";

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

export function FDCalculator() {
  const [input, setInput] = useState<FDInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof FDInput>(key: K, value: FDInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );
  const output = useMemo(() => computeFD(input), [input]);
  const isNegativeReal = output.realYield < 0;
  const vizData = useMemo(() => ({
    grossReturn: output.maturityGross,
    postTaxReturn: output.maturityPostTax,
    realReturn: output.maturityReal,
  }), [output.maturityGross, output.maturityPostTax, output.maturityReal]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="lg:w-[40%]">
        <div className="flex flex-col gap-6 p-6 bg-surface rounded-lg border border-border">
          <h2 className="text-lg font-semibold tracking-tight">Configure FD</h2>
          <SliderRow label="Principal" value={input.principal} displayValue={formatINR(input.principal)}
            min={10000} max={50000000} step={10000} onChange={(v) => handleInputChange("principal", v)} />
          <SliderRow label="Interest Rate" value={input.interestRate} displayValue={`${input.interestRate}%`}
            min={2} max={12} step={0.25} onChange={(v) => handleInputChange("interestRate", v)} />
          <SliderRow label="Tenure" value={input.tenure} displayValue={`${input.tenure} yrs`}
            min={1} max={20} step={1} onChange={(v) => handleInputChange("tenure", v)} />
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
          <SliderRow label="Tax Slab" value={input.taxSlab} displayValue={`${input.taxSlab}%`}
            min={0} max={30} step={5} onChange={(v) => handleInputChange("taxSlab", v)} />
          <SliderRow label="Inflation Rate" value={input.inflationRate} displayValue={`${input.inflationRate}%`}
            min={2} max={12} step={0.5} onChange={(v) => handleInputChange("inflationRate", v)} />
        </div>
      </div>
      <div className="lg:w-[60%]">
        <div className="flex flex-col gap-6">
          <CalcExplainer>
            <p className="font-semibold text-text-primary">What this calculator does</p>
            <p>It shows the truth behind FD returns — what the bank advertises versus what you actually keep after paying tax on interest and accounting for rising prices.</p>
            <p className="font-semibold text-text-primary">What each number means</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-text-primary">Maturity (Gross)</span> — what the bank tells you you&apos;ll get. No tax deducted.</li>
              <li><span className="text-text-primary">Maturity (Post-Tax)</span> — what you actually receive after paying tax on the interest at your income tax slab rate.</li>
              <li><span className="text-text-primary">Real Value</span> — what your post-tax money can buy in today&apos;s prices. This reveals whether FD actually grows your wealth or just preserves some of it.</li>
              <li><span className="text-text-primary">Post-Tax Yield</span> — your effective annual return after tax. A 7% FD at 30% tax slab gives only ~5.3% post-tax.</li>
              <li><span className="text-text-primary">Real Yield</span> — post-tax yield minus inflation. If this is negative, your money is losing purchasing power despite appearing to grow.</li>
            </ul>
            <p className="font-semibold text-text-primary">Compounding frequency</p>
            <p>Quarterly compounding (most common in India) pays slightly more than annual. Monthly pays a tiny bit more. The difference is small but adds up over long tenures.</p>
          </CalcExplainer>
          <CalcVisualization calcId="fd" data={vizData} />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard label="Maturity (Gross)" value={output.maturityGross} variant="neutral" />
            <MetricCard label="Maturity (Post-Tax)" value={output.maturityPostTax} variant="gain" />
            <MetricCard label="Real Value (Today's ₹)" value={output.maturityReal} variant={isNegativeReal ? "loss" : "gain"} />
            <MetricCard label="Post-Tax Yield" value={output.postTaxYield} variant="neutral" />
            <MetricCard label="Real Yield" value={output.realYield} variant={isNegativeReal ? "loss" : "gain"} />
          </div>
          {isNegativeReal && (
            <div className="p-3 bg-loss/10 border border-loss/30 rounded-lg text-sm font-mono text-loss">
              Your real yield is negative — inflation erodes your purchasing power faster than post-tax FD returns grow it.
            </div>
          )}
          <div className="text-xs text-text-secondary font-mono px-1">
            Gross interest: {formatINR(output.totalInterestGross)} → Post-tax: {formatINR(output.totalInterestPostTax)} (Tax: {formatINR(output.totalInterestGross - output.totalInterestPostTax)})
          </div>
          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Growth vs Inflation</h3>
            <div className="w-full h-[350px]">
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
                    fill="url(#grossGrad)" name="Gross" isAnimationActive={false} />
                  <Line type="monotone" dataKey="postTaxValue" stroke="#6ee7b7" strokeWidth={2}
                    dot={false} name="Post-Tax" isAnimationActive={false} />
                  <Line type="monotone" dataKey="realValue" stroke="#f87171" strokeWidth={2}
                    strokeDasharray="6 4" dot={false} name="Real Value" isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}