"use client";

import { useState, useMemo, useCallback } from "react";
import type { FIREInput } from "@/lib/calculators/fire/types";
import { computeFIRE } from "@/lib/calculators/fire/engine";
import { formatINR, formatINRShort } from "@/lib/format";
import { MetricCard } from "@/components/sip/metric-card";
import { Area, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { twMerge } from "tailwind-merge";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareBar } from "@/components/shared/share-bar";
import { truthFromFIRE } from "@/lib/truth/truth-data-adapter";
import { SliderRow } from "@/components/shared/slider-row";

const DEFAULT_INPUT: FIREInput = {
  currentAge: 30,
  retirementAge: 50,
  lifeExpectancy: 85,
  monthlyExpenses: 50000,
  currentCorpus: 2000000,
  monthlySIP: 50000,
  preRetirementReturn: 12,
  postRetirementReturn: 8,
  preRetirementInflation: 6,
  postRetirementInflation: 5,
  equityAllocation: 70,
  glidePathShift: 55,
};

export function FIRECalculator() {
  const [input, setInput] = useState<FIREInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof FIREInput>(key: K, value: FIREInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );
  const output = useMemo(() => computeFIRE(input), [input]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-white shadow-sm rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">FIRE Matrix</h2>
          <SliderRow label="Current Age" value={input.currentAge} displayValue={`${input.currentAge}`}
            min={20} max={60} step={1} onChange={(v) => handleInputChange("currentAge", v)} tickUnit=" yr" />
          <SliderRow label="Retirement Age" value={input.retirementAge} displayValue={`${input.retirementAge}`}
            min={35} max={65} step={1} onChange={(v) => handleInputChange("retirementAge", v)} tickUnit=" yr" />
          <SliderRow label="Life Expectancy" value={input.lifeExpectancy} displayValue={`${input.lifeExpectancy}`}
            min={70} max={100} step={1} onChange={(v) => handleInputChange("lifeExpectancy", v)} tickUnit=" yr" />
          <SliderRow label="Monthly Expenses" value={input.monthlyExpenses} displayValue={`₹${(input.monthlyExpenses / 1000).toFixed(0)}K`}
            min={10000} max={500000} step={5000} onChange={(v) => handleInputChange("monthlyExpenses", v)} />
          <SliderRow label="Current Corpus" value={input.currentCorpus} displayValue={formatINR(input.currentCorpus)}
            min={0} max={50000000} step={100000} onChange={(v) => handleInputChange("currentCorpus", v)} />
          <SliderRow label="Monthly SIP" value={input.monthlySIP} displayValue={`₹${(input.monthlySIP / 1000).toFixed(0)}K`}
            min={5000} max={500000} step={1000} onChange={(v) => handleInputChange("monthlySIP", v)} />
          <SliderRow label="Pre-Retirement Return" value={input.preRetirementReturn} displayValue={`${input.preRetirementReturn}%`}
            min={4} max={18} step={0.5} onChange={(v) => handleInputChange("preRetirementReturn", v)} tickUnit="%" />
          <SliderRow label="Post-Retirement Return" value={input.postRetirementReturn} displayValue={`${input.postRetirementReturn}%`}
            min={3} max={12} step={0.5} onChange={(v) => handleInputChange("postRetirementReturn", v)} tickUnit="%" />
          <SliderRow label="Pre-Retirement Inflation" value={input.preRetirementInflation} displayValue={`${input.preRetirementInflation}%`}
            min={2} max={12} step={0.5} onChange={(v) => handleInputChange("preRetirementInflation", v)} tickUnit="%" />
          <SliderRow label="Post-Retirement Inflation" value={input.postRetirementInflation} displayValue={`${input.postRetirementInflation}%`}
            min={2} max={10} step={0.5} onChange={(v) => handleInputChange("postRetirementInflation", v)} tickUnit="%" />
          <SliderRow label="Equity Allocation" value={input.equityAllocation} displayValue={`${input.equityAllocation}%`}
            min={10} max={100} step={5} onChange={(v) => handleInputChange("equityAllocation", v)} tickUnit="%" />
          <SliderRow label="Glide Path Shift" value={input.glidePathShift} displayValue={`-${input.glidePathShift}%`}
            min={0} max={80} step={5} onChange={(v) => handleInputChange("glidePathShift", v)} tickUnit="%" />
        </div>
      </div>
      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <ConfidenceBadge inflationRate={input.preRetirementInflation} />
            <ShareBar title="FIRE Calculator — c7xai" />
          </div>
          <LieVsTruthPanel truth={truthFromFIRE({ corpusAtRetirement: output.corpusAtRetirement, realCorpusAtRetirement: output.realCorpusAtRetirement, totalContributed: output.totalContributed }, input.preRetirementInflation)} />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <MetricCard label="FIRE Number (25x)" value={output.fireNumber} variant="neutral" />
            <MetricCard label="Corpus at Retirement" value={output.corpusAtRetirement} variant={output.corpusAtRetirement >= output.fireNumber ? "gain" : "loss"} />
            <MetricCard label="Real Corpus at Ret." value={output.realCorpusAtRetirement} variant="neutral" />
            <MetricCard label="Corpus at End" value={output.corpusAtEnd} variant={output.depleted ? "loss" : "gain"} />
            <MetricCard label="Total Contributed" value={output.totalContributed} variant="neutral" />
            <MetricCard label="Total Withdrawn" value={output.totalWithdrawn} variant="neutral" />
          </div>

          {output.depleted && output.depletionAge && (
            <div className="p-2 bg-loss/10 border border-loss/30 rounded-lg text-xs font-mono text-loss">
              Corpus depletes at age {output.depletionAge}. Increase SIP, reduce expenses, or delay retirement.
            </div>
          )}

          {output.corpusAtRetirement >= output.fireNumber && !output.depleted && (
            <div className="p-2 bg-gain/10 border border-gain/30 rounded-lg text-xs font-mono text-gain">
              Corpus exceeds FIRE number. Glide path: equity {input.equityAllocation}% → {input.equityAllocation - input.glidePathShift}%.
            </div>
          )}

          <div className="flex-1 min-h-0 bg-white rounded-lg border border-border shadow-sm p-4">
            <h3 className="text-xs font-semibold text-text-secondary mb-2">Corpus Trajectory</h3>
            <div className="w-full flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={output.yearlyData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fireGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="age" tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                    axisLine={{ stroke: "#1f2937" }} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={formatINRShort} axisLine={{ stroke: "#1f2937" }} tickLine={false} width={60} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px",
                    fontFamily: "var(--font-geist-mono)", fontSize: "11px" }}
                    labelFormatter={(v) => `Age ${v}`}
                    formatter={(value, name) => [formatINRShort(Number(value)), String(name)]} />
                  <ReferenceLine x={input.retirementAge} stroke="#fbbf24" strokeDasharray="4 4" label={{ value: "RETIRE", fill: "#fbbf24", fontSize: 10, fontFamily: "var(--font-geist-mono)" }} />
                  <Area type="monotone" dataKey="corpusEnd" stroke="#6ee7b7" strokeWidth={2}
                    fill="url(#fireGrad)" name="Corpus" isAnimationActive={true} />
                  <Line type="monotone" dataKey="realCorpusEnd" stroke="#f87171" strokeWidth={2}
                    strokeDasharray="6 4" dot={false} name="Real Value" isAnimationActive={true} />
                  <ReferenceLine y={output.fireNumber} stroke="#fbbf24" strokeDasharray="2 4" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-xs text-text-secondary font-mono px-1">
            Bifurcated inflation: {input.preRetirementInflation}% pre, {input.postRetirementInflation}% post. Glide: equity {input.equityAllocation}% → {input.equityAllocation - input.glidePathShift}%.
          </div>
          <WhyThisNumber assumptions={truthFromFIRE({ corpusAtRetirement: output.corpusAtRetirement, realCorpusAtRetirement: output.realCorpusAtRetirement, totalContributed: output.totalContributed }, input.preRetirementInflation).assumptions} />
          <CalcExplainer>
            <p className="font-semibold text-text-primary">The truth about FIRE</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Your corpus at retirement looks large, but its real purchasing power is far less. Inflation before and after retirement eats both.</li>
              <li><span className="text-loss">Red dashed line</span> — what your corpus can actually buy. <span className="text-warn">Yellow line</span> — retirement age.</li>
              <li>After retirement, if the green line drops, your money is running out. The 4% rule is a starting point, not a guarantee.</li>
            </ul>
          </CalcExplainer>
        </div>
      </div>
    </div>
  );
}