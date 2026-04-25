"use client";

import { useState, useMemo, useCallback } from "react";
import type { CTCInput } from "@/lib/calculators/ctc/types";
import { computeCTC } from "@/lib/calculators/ctc/engine";
import { formatINR } from "@/lib/format";
import { MetricCard } from "@/components/sip/metric-card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalcExplainer } from "@/components/shared/calc-explainer";

const DEFAULT_INPUT: CTCInput = {
  grossCTC: 1500000,
  basicPct: 40,
  hraPct: 50,
  ltaPct: 5,
  npsEmployerPct: 0,
  specialAllowance: 0,
  actualRentMonthly: 20000,
  metroCity: true,
  deduction80C: 150000,
  deduction80D: 25000,
  deductionNPS: 0,
  regime: "new",
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

export function CTCCalculator() {
  const [input, setInput] = useState<CTCInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof CTCInput>(key: K, value: CTCInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );
  const output = useMemo(() => computeCTC(input), [input]);

  const chartData = [
    { name: "Current", inHand: output.inHandAnnual, tax: output.tax.totalTax },
    { name: "Optimized", inHand: output.optimizedInHandAnnual, tax: output.optimizedTax.totalTax },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-surface rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">CTC Optimizer</h2>
          <SliderRow label="Gross CTC" value={input.grossCTC} displayValue={formatINR(input.grossCTC)}
            min={300000} max={10000000} step={50000} onChange={(v) => handleInputChange("grossCTC", v)} />
          <SliderRow label="Basic %" value={input.basicPct} displayValue={`${input.basicPct}%`}
            min={20} max={50} step={2} onChange={(v) => handleInputChange("basicPct", v)} />
          <SliderRow label="HRA (% of Basic)" value={input.hraPct} displayValue={`${input.hraPct}%`}
            min={10} max={50} step={5} onChange={(v) => handleInputChange("hraPct", v)} />
          <SliderRow label="LTA (% of CTC)" value={input.ltaPct} displayValue={`${input.ltaPct}%`}
            min={0} max={15} step={1} onChange={(v) => handleInputChange("ltaPct", v)} />
          <SliderRow label="NPS Employer %" value={input.npsEmployerPct} displayValue={`${input.npsEmployerPct}%`}
            min={0} max={10} step={1} onChange={(v) => handleInputChange("npsEmployerPct", v)} />
          <SliderRow label="Actual Rent/Month" value={input.actualRentMonthly} displayValue={`₹${(input.actualRentMonthly / 1000).toFixed(0)}K`}
            min={0} max={200000} step={1000} onChange={(v) => handleInputChange("actualRentMonthly", v)} />
          <div className="flex justify-between items-baseline">
            <label className="text-xs text-text-secondary">Metro City</label>
            <button className={`px-2 py-1 text-xs rounded-md font-mono transition-colors ${input.metroCity ? "bg-gain/20 text-gain border border-gain/40" : "bg-border text-text-secondary border border-border"}`}
              onClick={() => handleInputChange("metroCity", !input.metroCity)}>
              {input.metroCity ? "YES" : "NO"}
            </button>
          </div>
        </div>
      </div>
      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <CalcExplainer>
            <p className="font-semibold text-text-primary">How to read</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-text-primary">Basic Salary</span> — core part. HRA, PF calculated as % of this. Higher basic = higher HRA exemption, but higher PF deduction.</li>
              <li><span className="text-text-primary">HRA</span> — House Rent Allowance. Portion tax-free if you pay rent. Metro: 50% of basic exempt; non-metro: 40%.</li>
              <li><span className="text-text-primary">LTA</span> — Leave Travel Allowance. Tax-free with actual domestic travel bills.</li>
              <li><span className="text-text-primary">Special Allowance</span> — leftover after Basic, HRA, LTA, NPS. Fully taxable.</li>
            </ul>
            <p className="font-semibold text-text-primary">HRA exemption</p>
            <p>Tax-free part is smallest of: (a) actual HRA, (b) rent minus 10% of basic, or (c) 50%/40% of basic. Optimizer finds the split that maximizes this.</p>
          </CalcExplainer>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <MetricCard label="In-Hand/Year" value={output.inHandAnnual} variant="neutral" />
            <MetricCard label="In-Hand/Month" value={output.inHandMonthly} variant="gain" />
            <MetricCard label="Tax (Current)" value={output.tax.totalTax} variant="loss" />
            <MetricCard label="HRA Exemption" value={output.hraExemption} variant="gain" />
          </div>

          {output.savingsAnnual > 0 && (
            <>
              <div className="p-2 bg-gain/10 border border-gain/30 rounded-lg text-xs font-mono text-gain">
                Optimized saves ₹{formatINR(output.savingsAnnual)}/yr (₹{formatINR(output.savingsMonthly)}/mo) — Basic {output.optimizedBreakdown.basicPct ?? "?"}%, HRA {output.optimizedBreakdown.hraPct ?? "?"}%
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                <MetricCard label="Optimized In-Hand/Yr" value={output.optimizedInHandAnnual} variant="gain" />
                <MetricCard label="Optimized In-Hand/Mo" value={output.optimizedInHandMonthly} variant="gain" />
                <MetricCard label="Optimized Tax" value={output.optimizedTax.totalTax} variant="neutral" />
              </div>
            </>
          )}

          <div className="flex-1 min-h-0 bg-surface rounded-lg border border-border p-4">
            <h3 className="text-xs font-semibold text-text-secondary mb-2">Current vs Optimized</h3>
            <div className="w-full flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 5, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                    axisLine={{ stroke: "#1f2937" }} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={(v: number) => `₹${(v / 100000).toFixed(1)}L`} axisLine={{ stroke: "#1f2937" }} tickLine={false} width={55} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px",
                    fontFamily: "var(--font-geist-mono)", fontSize: "11px" }}
                    formatter={(value, name) => [`₹${(Number(value) / 100000).toFixed(1)}L`, String(name)]} />
                  <Bar dataKey="inHand" fill="#6ee7b7" name="In-Hand" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="tax" fill="#f87171" name="Tax" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-[10px] text-text-secondary font-mono px-1">
            Breakdown: Basic {formatINR(output.breakdown.basic)} | HRA {formatINR(output.breakdown.hra)} | LTA {formatINR(output.breakdown.lta)} | Special {formatINR(output.breakdown.specialAllowance)}
          </div>
        </div>
      </div>
    </div>
  );
}