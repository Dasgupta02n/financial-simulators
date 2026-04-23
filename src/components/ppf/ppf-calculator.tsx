"use client";

import { useState, useMemo, useCallback } from "react";
import type { PPFInput } from "@/lib/calculators/ppf/types";
import { computePPF } from "@/lib/calculators/ppf/engine";
import { formatINR, formatINRShort } from "@/lib/format";
import { MetricCard } from "@/components/sip/metric-card";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { Area, Line, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

export function PPFViewModel() {
  const [input, setInput] = useState<PPFInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof PPFInput>(key: K, value: PPFInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );

  const output = useMemo(() => computePPF(input), [input]);
  const isNegativeReal = output.realYield < 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="lg:w-[40%]">
        <div className="flex flex-col gap-6 p-6 bg-surface rounded-lg border border-border">
          <h2 className="text-lg font-semibold tracking-tight">Configure PPF</h2>
          <SliderRow label="Yearly Contribution" value={input.yearlyContribution}
            displayValue={formatINR(input.yearlyContribution)}
            min={500} max={150000} step={500}
            onChange={(v) => handleInputChange("yearlyContribution", v)} />
          <SliderRow label="Interest Rate" value={input.interestRate}
            displayValue={`${input.interestRate}%`}
            min={5} max={9} step={0.1}
            onChange={(v) => handleInputChange("interestRate", v)} />
          <div className="flex flex-col gap-2">
            <span className="text-sm text-text-secondary">Tenure</span>
            <div className="flex gap-2">
              {TENURE_OPTIONS.map((opt) => (
                <button key={opt.value} className={`px-3 py-1.5 text-sm rounded-md font-mono transition-colors ${
                  input.tenure === opt.value
                    ? "bg-gain/20 text-gain border border-gain/40"
                    : "bg-border text-text-secondary border border-border"
                }`} onClick={() => handleInputChange("tenure", opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
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
            <p>It shows the real value of your PPF maturity after accounting for inflation. PPF has EEE (Exempt-Exempt-Exempt) tax status — no tax on contribution, interest, or maturity — making it one of the few debt instruments that actually grows wealth.</p>
            <p className="font-semibold text-text-primary">What each number means</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-text-primary">Maturity Value</span> — the nominal amount you receive at the end of the PPF tenure.</li>
              <li><span className="text-text-primary">Real Value</span> — what your maturity money can buy in today&apos;s prices. This is the number that matters.</li>
              <li><span className="text-text-primary">Effective Yield</span> — your annualized return based on total invested vs maturity. With regular contributions, this is higher than the interest rate due to compounding.</li>
              <li><span className="text-text-primary">Real Yield</span> — effective yield minus inflation. If positive, PPF grows your purchasing power.</li>
            </ul>
            <p className="font-semibold text-text-primary">Key PPF rules</p>
            <p>Minimum 15-year lock-in. Max ₹1.5L/year contribution. Interest rate set quarterly by government (currently 7.1%). No tax on maturity (EEE status).</p>
          </CalcExplainer>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard label="Total Invested" value={output.totalInvested} variant="neutral" />
            <MetricCard label="Maturity Value" value={output.maturityValue} variant="gain" />
            <MetricCard label="Real Value (Today's ₹)" value={output.realMaturityValue} variant={isNegativeReal ? "loss" : "gain"} />
            <MetricCard label="Interest Earned" value={output.totalInterest} variant="gain" />
            <MetricCard label="Effective Yield" value={output.effectiveYield} variant="neutral" />
            <MetricCard label="Real Yield" value={output.realYield} variant={isNegativeReal ? "loss" : "gain"} />
          </div>
          {isNegativeReal && (
            <div className="p-3 bg-loss/10 border border-loss/30 rounded-lg text-sm font-mono text-loss">
              Your real yield is negative — inflation erodes your purchasing power faster than PPF grows it.
            </div>
          )}
          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold text-text-secondary mb-3">PPF Growth vs Inflation</h3>
            <div className="w-full h-[350px]">
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
                    fill="url(#ppfGrad)" name="Nominal" isAnimationActive={false} />
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