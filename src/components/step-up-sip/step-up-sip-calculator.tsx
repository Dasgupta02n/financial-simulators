"use client";

import { useState, useMemo, useCallback } from "react";
import type { StepUpSIPInput } from "@/lib/calculators/step-up-sip/types";
import { computeStepUpSIP } from "@/lib/calculators/step-up-sip/engine";
import { formatINR, formatINRShort } from "@/lib/format";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DEFAULT_INPUT: StepUpSIPInput = {
  monthlySIP: 10000,
  annualStepUp: 10,
  returnRate: 12,
  tenureYears: 20,
  inflationRate: 6,
};

function SliderRow({ label, value, displayValue, min, max, step, onChange, suffix }: {
  label: string; value: number; displayValue: string; min: number; max: number; step: number;
  onChange: (v: number) => void; suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-baseline">
        <label className="text-xs text-text-secondary">{label}</label>
        <span className="text-xs font-mono text-text-primary">{displayValue}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer bg-border accent-gain" />
    </div>
  );
}

export function StepUpSIPCalculator() {
  const [input, setInput] = useState<StepUpSIPInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof StepUpSIPInput>(key: K, value: StepUpSIPInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));
    }, []
  );

  const result = useMemo(() => computeStepUpSIP(input), [input]);

  const chartData = result.yearlyBreakdown.map((row) => ({
    year: `Yr ${row.year}`,
    "Step-Up Value": row.nominalValue,
    "Invested": row.investedSoFar,
  }));

  const stepUpPercentVsRegular = result.regularCorpus > 0
    ? ((result.stepUpGainVsRegular / result.regularCorpus) * 100).toFixed(0)
    : "0";

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-surface rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">Step-Up SIP Projection</h2>
          <SliderRow label="Monthly SIP (Start)" value={input.monthlySIP}
            displayValue={formatINR(input.monthlySIP)}
            min={500} max={500000} step={500}
            onChange={(v) => handleInputChange("monthlySIP", v)} />
          <SliderRow label="Annual Step-Up" value={input.annualStepUp}
            displayValue={`${input.annualStepUp}%`}
            min={0} max={30} step={1}
            onChange={(v) => handleInputChange("annualStepUp", v)} suffix="%" />
          <SliderRow label="Expected Return" value={input.returnRate}
            displayValue={`${input.returnRate}%`}
            min={1} max={30} step={0.5}
            onChange={(v) => handleInputChange("returnRate", v)} suffix="%" />
          <SliderRow label="Tenure" value={input.tenureYears}
            displayValue={`${input.tenureYears}`}
            min={1} max={40} step={1}
            onChange={(v) => handleInputChange("tenureYears", v)} suffix=" yr" />
          <SliderRow label="Inflation" value={input.inflationRate}
            displayValue={`${input.inflationRate}%`}
            min={0} max={15} step={0.5}
            onChange={(v) => handleInputChange("inflationRate", v)} suffix="%" />
        </div>
      </div>

      <div className="lg:w-[62%] min-h-0 overflow-auto">
        <div className="flex flex-col gap-3 min-h-0">
          <CalcExplainer>
            <p className="font-semibold text-text-primary">How to read</p>
            <p>Step-Up SIP increases your monthly investment by a fixed percentage each year.</p>
            <p>A <strong>10% step-up</strong> on ₹10,000/month means ₹11,000 in year 2, ₹12,100 in year 3, and so on.</p>
            <p>The <strong className="text-gain">green area</strong> shows your corpus growth; the <strong className="text-text-secondary">gray area</strong> shows total invested amount.</p>
          </CalcExplainer>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-surface rounded-lg border border-border">
              <div className="text-[10px] text-text-muted font-mono">STEP-UP CORPUS</div>
              <div className="text-lg font-mono font-bold text-gain">{formatINR(result.nominalCorpus)}</div>
              <div className="text-[10px] text-text-muted font-mono">After LTCG: {formatINR(result.afterLTCG)}</div>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <div className="text-[10px] text-text-muted font-mono">REGULAR SIP CORPUS</div>
              <div className="text-lg font-mono font-bold text-text-primary">{formatINR(result.regularCorpus)}</div>
              <div className="text-[10px] text-gain font-mono">Step-Up is {stepUpPercentVsRegular}% more</div>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <div className="text-[10px] text-text-muted font-mono">REAL VALUE (INFLATION-ADJ)</div>
              <div className="text-lg font-mono font-bold text-text-primary">{formatINR(result.realCorpus)}</div>
              <div className="text-[10px] text-text-muted font-mono">What your money actually buys</div>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <div className="text-[10px] text-text-muted font-mono">TOTAL INVESTED</div>
              <div className="text-lg font-mono font-bold text-text-primary">{formatINR(result.totalInvested)}</div>
              <div className="text-[10px] text-text-muted font-mono">vs Regular: {formatINR(result.regularInvested)}</div>
            </div>
          </div>

          <div className="p-3 bg-surface rounded-lg border border-border">
            <h3 className="text-xs font-semibold text-text-primary mb-2">Corpus Growth Over Time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="#555" />
                <YAxis tick={{ fontSize: 10 }} stroke="#555" tickFormatter={(v: number) => formatINRShort(v)} />
                <Tooltip formatter={(v) => formatINR(Number(v))} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="Step-Up Value" fill="#4ade80" fillOpacity={0.15} stroke="#4ade80" strokeWidth={2} />
                <Area type="monotone" dataKey="Invested" fill="#888" fillOpacity={0.1} stroke="#888" strokeWidth={1} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}