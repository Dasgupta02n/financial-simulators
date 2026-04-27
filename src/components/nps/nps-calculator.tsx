"use client";

import { useState, useMemo, useCallback } from "react";
import type { NPSInput } from "@/lib/calculators/nps/types";
import { computeNPS } from "@/lib/calculators/nps/engine";
import { formatINR, formatINRShort } from "@/lib/format";
import { MetricCard } from "@/components/sip/metric-card";
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareBar } from "@/components/shared/share-bar";
import { DownloadReportButton } from "@/components/shared/download-report-button";
import { truthFromNPS } from "@/lib/truth/truth-data-adapter";
import { SliderRow } from "@/components/shared/slider-row";

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

export function NPSCalculator() {
  const [input, setInput] = useState<NPSInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof NPSInput>(key: K, value: NPSInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );
  const output = useMemo(() => computeNPS(input), [input]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-white shadow-sm rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">NPS Pension Modeler</h2>
          <SliderRow label="Current Age" value={input.currentAge} displayValue={`${input.currentAge}`}
            min={20} max={55} step={1} onChange={(v) => handleInputChange("currentAge", v)} tickUnit=" yr" />
          <SliderRow label="Retirement Age" value={input.retirementAge} displayValue={`${input.retirementAge}`}
            min={50} max={70} step={1} onChange={(v) => handleInputChange("retirementAge", v)} tickUnit=" yr" />
          <SliderRow label="Monthly Contribution" value={input.monthlyContribution} displayValue={`₹${(input.monthlyContribution / 1000).toFixed(1)}K`}
            min={500} max={50000} step={500} onChange={(v) => handleInputChange("monthlyContribution", v)} />
          <SliderRow label="Employer Contribution" value={input.employerContribution} displayValue={`₹${(input.employerContribution / 1000).toFixed(1)}K`}
            min={0} max={50000} step={500} onChange={(v) => handleInputChange("employerContribution", v)} />
          <SliderRow label="Equity Return" value={input.equityReturn} displayValue={`${input.equityReturn}%`}
            min={4} max={18} step={0.5} onChange={(v) => handleInputChange("equityReturn", v)} tickUnit="%" />
          <SliderRow label="Debt Return" value={input.debtReturn} displayValue={`${input.debtReturn}%`}
            min={3} max={10} step={0.5} onChange={(v) => handleInputChange("debtReturn", v)} tickUnit="%" />
          <SliderRow label="Annuity %" value={input.annuityRate} displayValue={`${input.annuityRate}%`}
            min={40} max={100} step={5} onChange={(v) => handleInputChange("annuityRate", v)} tickUnit="%" />
          <SliderRow label="Annuity Return" value={input.annuityReturn} displayValue={`${input.annuityReturn}%`}
            min={4} max={9} step={0.5} onChange={(v) => handleInputChange("annuityReturn", v)} tickUnit="%" />
          <SliderRow label="Inflation Rate" value={input.inflationRate} displayValue={`${input.inflationRate}%`}
            min={2} max={12} step={0.5} onChange={(v) => handleInputChange("inflationRate", v)} tickUnit="%" />
        </div>
      </div>
      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <ConfidenceBadge inflationRate={input.inflationRate} />
            <ShareBar title="NPS Calculator — c7xai" />
          </div>
          <LieVsTruthPanel truth={truthFromNPS({ corpusAtRetirement: output.corpusAtRetirement, realCorpusAtRetirement: output.realCorpusAtRetirement, lumpsumWithdrawal: output.lumpsumWithdrawal, annuityCorpus: output.annuityCorpus, monthlyPension: output.monthlyPension, realMonthlyPension: output.realMonthlyPension, annuityTaxable: output.annuityTaxable, totalContributed: output.totalContributed ?? 0 }, input.inflationRate)} />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <MetricCard label="Corpus at Retirement" value={output.corpusAtRetirement} variant="gain" />
            <MetricCard label="Real Value (Today's ₹)" value={output.realCorpusAtRetirement} variant="neutral" />
            <MetricCard label="Lumpsum (Tax-Free)" value={output.lumpsumWithdrawal} variant="gain" />
            <MetricCard label="Annuity Corpus" value={output.annuityCorpus} variant="neutral" />
            <MetricCard label="Monthly Pension" value={output.monthlyPension} variant="gain" />
            <MetricCard label="Real Monthly Pension" value={output.realMonthlyPension} variant="neutral" />
          </div>

          <div className="p-2 bg-warn/10 border border-warn/30 rounded-lg text-xs font-mono text-warn">
            NPS Tax: 60% lumpsum is tax-free. Annuity income ({formatINR(output.annuityTaxable)}/yr) is fully taxable.
          </div>

          <div className="flex-1 min-h-0 bg-white rounded-lg border border-border shadow-sm p-4">
            <h3 className="text-xs font-semibold text-text-secondary mb-2">Corpus Growth (Auto Choice Lifecycle)</h3>
            <div className="w-full flex-1 min-h-[220px]">
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
                    fill="url(#npsGrad)" name="Corpus" isAnimationActive={true} />
                  <Line yAxisId="left" type="monotone" dataKey="realCorpusEnd" stroke="#f87171" strokeWidth={2}
                    strokeDasharray="6 4" dot={false} name="Real Value" isAnimationActive={true} />
                  <Line yAxisId="right" type="stepAfter" dataKey="equityPct" stroke="#fbbf24" strokeWidth={1.5}
                    dot={false} name="Equity %" isAnimationActive={true} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-xs text-text-secondary font-mono px-1">
            Auto Choice lifecycle: Equity 75% → 25% with age. 60% lumpsum tax-free; 40% annuity fully taxable.
          </div>
          <WhyThisNumber assumptions={truthFromNPS({ corpusAtRetirement: output.corpusAtRetirement, realCorpusAtRetirement: output.realCorpusAtRetirement, lumpsumWithdrawal: output.lumpsumWithdrawal, annuityCorpus: output.annuityCorpus, monthlyPension: output.monthlyPension, realMonthlyPension: output.realMonthlyPension, annuityTaxable: output.annuityTaxable, totalContributed: output.totalContributed ?? 0 }, input.inflationRate).assumptions} />
          <CalcExplainer>
            <p className="font-semibold text-text-primary">The truth about NPS</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Your monthly pension looks decent, but inflation erodes its purchasing power every year. The real pension is what matters.</li>
              <li>60% lumpsum is tax-free, but 40% annuity income is fully taxable — this drags down your real return.</li>
              <li><span className="text-loss">Red dashed line</span> — what your corpus can actually buy. <span className="text-warn">Yellow line</span> — equity allocation glide path.</li>
            </ul>
          </CalcExplainer>
          <DownloadReportButton
            calculatorTitle="NPS Calculator"
            calculatorData={{
              "Corpus at Retirement": formatINR(output.corpusAtRetirement),
              "Lumpsum (Tax-Free)": formatINR(output.lumpsumWithdrawal),
              "Monthly Pension": formatINR(output.monthlyPension),
              "Real Monthly Pension": formatINR(output.realMonthlyPension),
              "Annuity Corpus": formatINR(output.annuityCorpus),
            }}
          />
        </div>
      </div>
    </div>
  );
}