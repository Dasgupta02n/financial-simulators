"use client";

import { useState, useMemo, useCallback } from "react";
import type { HRAInput } from "@/lib/calculators/hra/types";
import { computeHRA } from "@/lib/calculators/hra/engine";
import { formatINR } from "@/lib/format";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { twMerge } from "tailwind-merge";

const DEFAULT_INPUT: HRAInput = {
  basicSalary: 50000,
  hraReceived: 20000,
  rentPaid: 15000,
  metroCity: true,
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

export function HRACalculator() {
  const [input, setInput] = useState<HRAInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof HRAInput>(key: K, value: HRAInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );

  const result = useMemo(() => computeHRA(input), [input]);

  const exemptionPercent = input.hraReceived > 0
    ? ((result.hraExemption / input.hraReceived) * 100).toFixed(0)
    : "0";

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-surface rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">Calculate HRA Exemption</h2>
          <SliderRow label="Basic Salary (Monthly)" value={input.basicSalary}
            displayValue={formatINR(input.basicSalary)}
            min={5000} max={500000} step={1000}
            onChange={(v) => handleInputChange("basicSalary", v)} />
          <SliderRow label="HRA Received (Monthly)" value={input.hraReceived}
            displayValue={formatINR(input.hraReceived)}
            min={0} max={200000} step={1000}
            onChange={(v) => handleInputChange("hraReceived", v)} />
          <SliderRow label="Rent Paid (Monthly)" value={input.rentPaid}
            displayValue={formatINR(input.rentPaid)}
            min={0} max={300000} step={1000}
            onChange={(v) => handleInputChange("rentPaid", v)} />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary">City Type</span>
            <div className="flex gap-2">
              <button className={twMerge(
                "px-4 py-1.5 text-xs rounded-md font-mono transition-colors",
                input.metroCity
                  ? "bg-gain/20 text-gain border border-gain/40"
                  : "bg-border text-text-secondary border border-border"
              )} onClick={() => handleInputChange("metroCity", true)}>
                Metro
              </button>
              <button className={twMerge(
                "px-4 py-1.5 text-xs rounded-md font-mono transition-colors",
                !input.metroCity
                  ? "bg-gain/20 text-gain border border-gain/40"
                  : "bg-border text-text-secondary border border-border"
              )} onClick={() => handleInputChange("metroCity", false)}>
                Non-Metro
              </button>
            </div>
            <p className="text-[10px] text-text-muted">Metro: Delhi, Mumbai, Kolkata, Chennai (50% limit). Others: 40%.</p>
          </div>
        </div>
      </div>
      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <CalcExplainer>
            <p className="font-semibold text-text-primary">How to read</p>
            <p>Your HRA exemption (Section 10(13A)) is the <strong>minimum</strong> of:</p>
            <ol className="list-decimal pl-5 space-y-0.5">
              <li>Actual HRA received from employer</li>
              <li>Rent paid minus 10% of basic salary</li>
              <li>50% of basic (metro) or 40% of basic (non-metro)</li>
            </ol>
            <p>The lowest of these three is your tax-free HRA. The rest is taxable income.</p>
          </CalcExplainer>

          <div className="p-4 bg-surface rounded-lg border border-border">
            <h3 className="text-xs font-semibold text-text-primary mb-3">HRA Exemption Breakdown</h3>

            <ResultRow label="① Actual HRA Received"
              value={formatINR(result.breakdown.actualHRA)} />
            <ResultRow label="② Rent - 10% of Basic"
              value={formatINR(result.breakdown.rentOver10Percent)}
              subtext={`Rent (${formatINR(input.rentPaid)}) - 10% Basic (${formatINR(Math.round(0.1 * input.basicSalary))})`} />
            <ResultRow label={`③ ${input.metroCity ? "50%" : "40%"} of Basic (Metro Limit)`}
              value={formatINR(result.breakdown.metroLimit)} />

            <div className="mt-3 pt-3 border-t-2 border-gain">
              <div className="flex justify-between items-center py-1">
                <div>
                  <span className="text-xs font-semibold text-text-primary">HRA Exemption (Tax-Free)</span>
                  <p className="text-[10px] text-text-muted font-mono">{exemptionPercent}% of your HRA is exempt</p>
                </div>
                <span className="text-base font-mono font-bold text-gain">{formatINR(result.hraExemption)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-text-secondary">Taxable HRA (Added to Income)</span>
                <span className="text-sm font-mono font-semibold text-loss">{formatINR(result.taxableHRA)}</span>
              </div>
            </div>
          </div>

          {result.hraExemption === 0 && input.rentPaid > 0 && (
            <div className="p-2 bg-loss/10 border border-loss/30 rounded-lg text-xs font-mono text-loss">
              Rent ({formatINR(input.rentPaid)}) is less than 10% of basic ({formatINR(Math.round(0.1 * input.basicSalary))}). Pay rent above this threshold to claim HRA exemption.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}