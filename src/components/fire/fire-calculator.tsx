"use client";

import { useState, useMemo, useCallback } from "react";
import type { FIREInput } from "@/lib/calculators/fire/types";
import { computeFIRE } from "@/lib/calculators/fire/engine";
import { formatINR, formatINRShort } from "@/lib/format";
import { MetricCard } from "@/components/sip/metric-card";
import { Area, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { twMerge } from "tailwind-merge";
import { CalcExplainer } from "@/components/shared/calc-explainer";

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

export function FIRECalculator() {
  const [input, setInput] = useState<FIREInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof FIREInput>(key: K, value: FIREInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );
  const output = useMemo(() => computeFIRE(input), [input]);

  const retirementYear = input.retirementAge - input.currentAge;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="lg:w-[40%]">
        <div className="flex flex-col gap-6 p-6 bg-surface rounded-lg border border-border">
          <h2 className="text-lg font-semibold tracking-tight">FIRE Matrix</h2>
          <SliderRow label="Current Age" value={input.currentAge} displayValue={`${input.currentAge}`}
            min={20} max={60} step={1} onChange={(v) => handleInputChange("currentAge", v)} />
          <SliderRow label="Retirement Age" value={input.retirementAge} displayValue={`${input.retirementAge}`}
            min={35} max={65} step={1} onChange={(v) => handleInputChange("retirementAge", v)} />
          <SliderRow label="Life Expectancy" value={input.lifeExpectancy} displayValue={`${input.lifeExpectancy}`}
            min={70} max={100} step={1} onChange={(v) => handleInputChange("lifeExpectancy", v)} />
          <SliderRow label="Monthly Expenses" value={input.monthlyExpenses} displayValue={`₹${(input.monthlyExpenses / 1000).toFixed(0)}K`}
            min={10000} max={500000} step={5000} onChange={(v) => handleInputChange("monthlyExpenses", v)} />
          <SliderRow label="Current Corpus" value={input.currentCorpus} displayValue={formatINR(input.currentCorpus)}
            min={0} max={50000000} step={100000} onChange={(v) => handleInputChange("currentCorpus", v)} />
          <SliderRow label="Monthly SIP" value={input.monthlySIP} displayValue={`₹${(input.monthlySIP / 1000).toFixed(0)}K`}
            min={5000} max={500000} step={1000} onChange={(v) => handleInputChange("monthlySIP", v)} />
          <SliderRow label="Pre-Retirement Return" value={input.preRetirementReturn} displayValue={`${input.preRetirementReturn}%`}
            min={4} max={18} step={0.5} onChange={(v) => handleInputChange("preRetirementReturn", v)} />
          <SliderRow label="Post-Retirement Return" value={input.postRetirementReturn} displayValue={`${input.postRetirementReturn}%`}
            min={3} max={12} step={0.5} onChange={(v) => handleInputChange("postRetirementReturn", v)} />
          <SliderRow label="Pre-Retirement Inflation" value={input.preRetirementInflation} displayValue={`${input.preRetirementInflation}%`}
            min={2} max={12} step={0.5} onChange={(v) => handleInputChange("preRetirementInflation", v)} />
          <SliderRow label="Post-Retirement Inflation" value={input.postRetirementInflation} displayValue={`${input.postRetirementInflation}%`}
            min={2} max={10} step={0.5} onChange={(v) => handleInputChange("postRetirementInflation", v)} />
          <SliderRow label="Equity Allocation" value={input.equityAllocation} displayValue={`${input.equityAllocation}%`}
            min={10} max={100} step={5} onChange={(v) => handleInputChange("equityAllocation", v)} />
          <SliderRow label="Glide Path Shift" value={input.glidePathShift} displayValue={`-${input.glidePathShift}%`}
            min={0} max={80} step={5} onChange={(v) => handleInputChange("glidePathShift", v)} />
        </div>
      </div>
      <div className="lg:w-[60%]">
        <div className="flex flex-col gap-6">
          <CalcExplainer>
            <p className="font-semibold text-text-primary">What this calculator does</p>
            <p>It projects your complete financial journey — from today to retirement, and then through retirement until your expected age. It shows whether your current savings rate is enough to fund the retirement life you want.</p>
            <p className="font-semibold text-text-primary">Key concepts</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-text-primary">FIRE Number</span> — 25 times your annual expenses at retirement. This is based on the &quot;4% rule&quot;: if you withdraw 4% per year, your money should last 30 years.</li>
              <li><span className="text-text-primary">Corpus at Retirement</span> — what you&apos;ll actually have saved. If this exceeds the FIRE number, you&apos;re on track.</li>
              <li><span className="text-text-primary">Glide Path</span> — gradually shifting from equity (higher growth, higher risk) to debt (lower growth, safer) as you age. This protects your retirement fund from a market crash when you can&apos;t wait for recovery.</li>
            </ul>
            <p className="font-semibold text-text-primary">Bifurcated inflation</p>
            <p>Inflation before retirement (your earning years) may differ from after retirement. The calculator uses separate rates for each phase, giving you a more realistic picture.</p>
            <p className="font-semibold text-text-primary">How to read the chart</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The <span className="text-warn">yellow dashed line</span> marks your retirement age — the switch from saving to spending.</li>
              <li><span className="text-gain">Green area</span> = corpus, <span className="text-loss">red dashed line</span> = real purchasing power.</li>
              <li>After retirement, watch if the green line starts dropping — that&apos;s your money running out.</li>
            </ul>
          </CalcExplainer>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard label="FIRE Number (25x)" value={output.fireNumber} variant="neutral" />
            <MetricCard label="Corpus at Retirement" value={output.corpusAtRetirement} variant={output.corpusAtRetirement >= output.fireNumber ? "gain" : "loss"} />
            <MetricCard label="Real Corpus at Ret." value={output.realCorpusAtRetirement} variant="neutral" />
            <MetricCard label="Corpus at End" value={output.corpusAtEnd} variant={output.depleted ? "loss" : "gain"} />
            <MetricCard label="Total Contributed" value={output.totalContributed} variant="neutral" />
            <MetricCard label="Total Withdrawn" value={output.totalWithdrawn} variant="neutral" />
          </div>

          {output.depleted && output.depletionAge && (
            <div className="p-3 bg-loss/10 border border-loss/30 rounded-lg text-sm font-mono text-loss">
              Corpus depletes at age {output.depletionAge}. FIRE target not met — increase SIP, reduce expenses, or delay retirement.
            </div>
          )}

          {output.corpusAtRetirement >= output.fireNumber && !output.depleted && (
            <div className="p-3 bg-gain/10 border border-gain/30 rounded-lg text-sm font-mono text-gain">
              Corpus exceeds FIRE number at retirement. Glide path shifts equity from {input.equityAllocation}% → {input.equityAllocation - input.glidePathShift}% over retirement.
            </div>
          )}

          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Corpus Trajectory</h3>
            <div className="w-full h-[350px]">
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
                    fill="url(#fireGrad)" name="Corpus" isAnimationActive={false} />
                  <Line type="monotone" dataKey="realCorpusEnd" stroke="#f87171" strokeWidth={2}
                    strokeDasharray="6 4" dot={false} name="Real Value" isAnimationActive={false} />
                  <ReferenceLine y={output.fireNumber} stroke="#fbbf24" strokeDasharray="2 4" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-xs text-text-secondary font-mono px-1">
            Bifurcated inflation: {input.preRetirementInflation}% pre-retirement, {input.postRetirementInflation}% post-retirement. Glide path shifts equity from {input.equityAllocation}% to {input.equityAllocation - input.glidePathShift}%.
          </div>
        </div>
      </div>
    </div>
  );
}