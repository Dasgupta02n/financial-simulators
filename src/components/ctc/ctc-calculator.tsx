"use client";

import { useState, useMemo, useCallback } from "react";
import type { CTCInput } from "@/lib/calculators/ctc/types";
import { computeCTC } from "@/lib/calculators/ctc/engine";
import { formatINR } from "@/lib/format";
import { MetricCard } from "@/components/sip/metric-card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareBar } from "@/components/shared/share-bar";
import { truthFromCTC } from "@/lib/truth/truth-data-adapter";
import { SliderRow } from "@/components/shared/slider-row";

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
        <div className="flex flex-col gap-3 p-4 bg-white shadow-sm rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">CTC Optimizer</h2>
          <SliderRow label="Gross CTC" value={input.grossCTC} displayValue={formatINR(input.grossCTC)}
            min={300000} max={10000000} step={50000} onChange={(v) => handleInputChange("grossCTC", v)} />
          <SliderRow label="Basic %" value={input.basicPct} displayValue={`${input.basicPct}%`}
            min={20} max={50} step={2} onChange={(v) => handleInputChange("basicPct", v)} tickUnit="%" />
          <SliderRow label="HRA (% of Basic)" value={input.hraPct} displayValue={`${input.hraPct}%`}
            min={10} max={50} step={5} onChange={(v) => handleInputChange("hraPct", v)} tickUnit="%" />
          <SliderRow label="LTA (% of CTC)" value={input.ltaPct} displayValue={`${input.ltaPct}%`}
            min={0} max={15} step={1} onChange={(v) => handleInputChange("ltaPct", v)} tickUnit="%" />
          <SliderRow label="NPS Employer %" value={input.npsEmployerPct} displayValue={`${input.npsEmployerPct}%`}
            min={0} max={10} step={1} onChange={(v) => handleInputChange("npsEmployerPct", v)} tickUnit="%" />
          <SliderRow label="Actual Rent/Month" value={input.actualRentMonthly} displayValue={`₹${(input.actualRentMonthly / 1000).toFixed(0)}K`}
            min={0} max={200000} step={1000} onChange={(v) => handleInputChange("actualRentMonthly", v)} />
          <div className="flex justify-between items-baseline">
            <label className="text-xs text-text-secondary">Metro City</label>
            <button className={`px-2 py-1 text-xs rounded-md font-mono transition-colors ${input.metroCity ? "bg-sienna/10 text-sienna border border-sienna/30" : "bg-surface-hover text-text-secondary border border-border"}`}
              onClick={() => handleInputChange("metroCity", !input.metroCity)}>
              {input.metroCity ? "YES" : "NO"}
            </button>
          </div>
        </div>
      </div>
      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <ConfidenceBadge inflationRate={6} />
            <ShareBar title="CTC Optimizer — c7xai" />
          </div>
          <LieVsTruthPanel truth={truthFromCTC({ inHandMonthly: output.inHandMonthly, savingsMonthly: output.savingsMonthly })} />
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

          <div className="flex-1 min-h-0 bg-white rounded-lg border border-border shadow-sm p-4">
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
          <WhyThisNumber assumptions={truthFromCTC({ inHandMonthly: output.inHandMonthly, savingsMonthly: output.savingsMonthly }).assumptions} />
          <CalcExplainer>
            <p className="font-semibold text-text-primary">The truth about your CTC</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>CTC is what they offer. In-hand is what you get. The gap is tax + PF + other deductions.</li>
              <li><span className="text-gain">Green bars</span> — money you actually receive. <span className="text-loss">Red bars</span> — money that goes to tax.</li>
              <li>HRA exemption can save significant tax if you pay rent — the optimizer finds the best split.</li>
            </ul>
          </CalcExplainer>
        </div>
      </div>
    </div>
  );
}