"use client";

import { useState, useMemo, useCallback } from "react";
import type { SimpleInterestInput } from "@/lib/calculators/simple-interest/types";
import { computeSimpleInterest } from "@/lib/calculators/simple-interest/engine";
import { formatINR } from "@/lib/format";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import {
  Bar,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatINRShort } from "@/lib/format";
import { twMerge } from "tailwind-merge";

const COMPOUNDING_OPTIONS = [
  { label: "Annually", value: 1 },
  { label: "Semi-Annual", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
];

const DEFAULT_INPUT: SimpleInterestInput = {
  principal: 100000,
  rate: 8,
  years: 5,
  compoundingFrequency: 1,
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

function ResultRow({ label, value, highlight, subtext }: {
  label: string; value: string; highlight?: boolean; subtext?: string;
}) {
  return (
    <div className={`flex justify-between items-baseline py-2 border-b border-border ${highlight ? "text-gain" : "text-text-secondary"}`}>
      <div>
        <span className="text-xs">{label}</span>
        {subtext && <p className="text-[10px] text-text-muted font-mono mt-0.5">{subtext}</p>}
      </div>
      <span className={`text-sm font-mono font-semibold ${highlight ? "text-gain" : "text-text-primary"}`}>{value}</span>
    </div>
  );
}

export function SimpleInterestCalculator() {
  const [input, setInput] = useState<SimpleInterestInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof SimpleInterestInput>(key: K, value: SimpleInterestInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );

  const result = useMemo(() => computeSimpleInterest(input), [input]);

  const compoundingLabel = COMPOUNDING_OPTIONS.find((o) => o.value === input.compoundingFrequency)?.label ?? "Annually";

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-surface rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">Calculate Simple Interest</h2>
          <SliderRow label="Principal Amount" value={input.principal}
            displayValue={formatINR(input.principal)}
            min={1000} max={10000000} step={1000}
            onChange={(v) => handleInputChange("principal", v)} />
          <SliderRow label="Annual Interest Rate (%)" value={input.rate}
            displayValue={`${input.rate}%`}
            min={1} max={30} step={0.5}
            onChange={(v) => handleInputChange("rate", v)} />
          <SliderRow label="Time Period (Years)" value={input.years}
            displayValue={`${input.years} yr${input.years > 1 ? "s" : ""}`}
            min={1} max={30} step={1}
            onChange={(v) => handleInputChange("years", v)} />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary">Compounding Frequency</span>
            <div className="flex gap-2">
              {COMPOUNDING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={twMerge(
                    "px-3 py-1.5 text-xs rounded-md font-mono transition-colors",
                    input.compoundingFrequency === opt.value
                      ? "bg-gain/20 text-gain border border-gain/40"
                      : "bg-border text-text-secondary border border-border"
                  )}
                  onClick={() => handleInputChange("compoundingFrequency", opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-text-muted">Affects the compound interest comparison only.</p>
          </div>
        </div>
      </div>

      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <CalcExplainer>
            <p className="font-semibold text-text-primary">How to read</p>
            <p><strong>Simple Interest</strong> = P &times; R &times; T / 100 is calculated only on the principal.</p>
            <p><strong>Compound Interest</strong> = P(1 + r/n)<sup>nt</sup> &minus; P includes interest-on-interest.</p>
            <p>The difference grows over time as compounding accelerates. More frequent compounding means a larger gap.</p>
          </CalcExplainer>

          <div className="p-4 bg-surface rounded-lg border border-border">
            <h3 className="text-xs font-semibold text-text-primary mb-3">Interest Breakdown</h3>

            <ResultRow label="Simple Interest Earned" value={formatINR(result.simpleInterest)} />
            <ResultRow label="Total Amount (Simple)" value={formatINR(result.totalAmount)}
              subtext={`Principal (${formatINR(input.principal)}) + Interest (${formatINR(result.simpleInterest)})`} />

            <div className="mt-2 pt-2 border-t border-border">
              <ResultRow label={`Compound Interest (${compoundingLabel})`}
                value={formatINR(result.compoundInterest)} />
              <ResultRow label="Total Amount (Compound)" value={formatINR(result.compoundAmount)} />
            </div>

            <div className="mt-3 pt-3 border-t-2 border-gain">
              <div className="flex justify-between items-center py-1">
                <div>
                  <span className="text-xs font-semibold text-text-primary">Extra Earned via Compounding</span>
                  <p className="text-[10px] text-text-muted font-mono">
                    Compound gives {formatINR(result.difference)} more than simple
                  </p>
                </div>
                <span className="text-base font-mono font-bold text-gain">{formatINR(result.difference)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-surface rounded-lg border border-border flex-1 min-h-0 flex flex-col">
            <h3 className="text-xs font-semibold text-text-primary mb-2">Year-by-Year Comparison</h3>
            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={result.yearlyBreakdown} margin={{ top: 5, right: 20, left: 5, bottom: 0 }}>
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={(v) => `Y${v}`}
                    axisLine={{ stroke: "#1f2937" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={formatINRShort}
                    axisLine={{ stroke: "#1f2937" }}
                    tickLine={false}
                    width={55}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #1f2937",
                      borderRadius: "8px",
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: "11px",
                    }}
                    labelFormatter={(v) => `Year ${v}`}
                    formatter={(value, name) => [formatINRShort(Number(value)), String(name)]}
                  />
                  <Bar
                    dataKey="simpleInterest"
                    fill="#6ee7b7"
                    fillOpacity={0.8}
                    name="Simple Interest"
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="compoundInterest"
                    fill="#60a5fa"
                    fillOpacity={0.8}
                    name="Compound Interest"
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 justify-center mt-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-sm bg-[#6ee7b7]" />
                <span className="text-[10px] text-text-secondary font-mono">Simple</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-sm bg-[#60a5fa]" />
                <span className="text-[10px] text-text-secondary font-mono">Compound</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}