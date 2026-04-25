"use client";

import type { SWPInput } from "@/lib/calculators/swp/types";
import { SliderRow } from "@/components/shared/slider-row";
import { twMerge } from "tailwind-merge";

interface Props {
  input: SWPInput;
  onInputChange: <K extends keyof SWPInput>(key: K, value: SWPInput[K]) => void;
}

const SEVERITY_OPTIONS = [
  { value: 0.2, label: "-20%" },
  { value: 0.3, label: "-30%" },
];

export function SWPSliderPanel({ input, onInputChange }: Props) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-border h-full overflow-y-auto shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-text-primary">Configure SWP</h2>
      <SliderRow label="Corpus" value={input.corpus} displayValue={`₹${(input.corpus / 100000).toFixed(1)}L`}
        min={500000} max={50000000} step={100000} onChange={(v) => onInputChange("corpus", v)} />
      <SliderRow label="Monthly Withdrawal" value={input.monthlyWithdrawal} displayValue={`₹${(input.monthlyWithdrawal / 1000).toFixed(0)}K`}
        min={5000} max={500000} step={1000} onChange={(v) => onInputChange("monthlyWithdrawal", v)} />
      <SliderRow label="Expected Return" value={input.returnRate} displayValue={`${input.returnRate}%`}
        min={2} max={15} step={0.5} tickUnit="%" onChange={(v) => onInputChange("returnRate", v)} />
      <SliderRow label="Tenure" value={input.tenure} displayValue={`${input.tenure} yrs`}
        min={5} max={40} step={1} tickUnit=" yr" onChange={(v) => onInputChange("tenure", v)} />
      <SliderRow label="Inflation Rate" value={input.inflationRate} displayValue={`${input.inflationRate}%`}
        min={2} max={12} step={0.5} tickUnit="%" onChange={(v) => onInputChange("inflationRate", v)} />

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-baseline">
          <label className="text-xs text-text-secondary">Stress Test</label>
          <button className={twMerge(
            "px-3 py-1 text-xs rounded-md font-mono transition-colors",
            input.crashEnabled
              ? "bg-loss/10 text-loss border border-loss/30"
              : "bg-surface-hover text-text-secondary border border-border"
          )} onClick={() => onInputChange("crashEnabled", !input.crashEnabled)}>
            {input.crashEnabled ? "ON" : "OFF"}
          </button>
        </div>
        {input.crashEnabled && (
          <div className="flex flex-col gap-3 pl-2 border-l-2 border-loss/30">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-text-secondary">Crash Severity</span>
              <div className="flex gap-2">
                {SEVERITY_OPTIONS.map((opt) => (
                  <button key={opt.value} className={twMerge(
                    "px-3 py-1 text-xs rounded-md font-mono transition-colors",
                    input.crashSeverity === opt.value
                      ? "bg-loss/10 text-loss border border-loss/30"
                      : "bg-surface-hover text-text-secondary border border-border"
                  )} onClick={() => onInputChange("crashSeverity", opt.value)}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <SliderRow label="Crash Year" value={input.crashYear} displayValue={`Year ${input.crashYear}`}
              min={1} max={3} step={1} ticks={false} onChange={(v) => onInputChange("crashYear", v)} />
            <SliderRow label="Crash Duration" value={input.crashDuration} displayValue={`${input.crashDuration} yr${input.crashDuration > 1 ? "s" : ""}`}
              min={1} max={5} step={1} ticks={false} onChange={(v) => onInputChange("crashDuration", v)} />
          </div>
        )}
      </div>
    </div>
  );
}