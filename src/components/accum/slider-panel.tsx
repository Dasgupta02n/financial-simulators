"use client";

import type { AccumulatorInput, StepUpMode } from "@/lib/calculators/accumulator/types";
import { formatINR } from "@/lib/format";
import { SliderRow } from "@/components/shared/slider-row";
import { twMerge } from "tailwind-merge";

interface SliderPanelProps {
  input: AccumulatorInput;
  onInputChange: <K extends keyof AccumulatorInput>(key: K, value: AccumulatorInput[K]) => void;
}

export function AccumSliderPanel({ input, onInputChange }: SliderPanelProps) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-border h-full overflow-y-auto shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-text-primary">Configure Accumulation</h2>
      <SliderRow label="Initial Lumpsum" value={input.lumpsum} displayValue={formatINR(input.lumpsum)}
        min={0} max={50000000} step={100000} onChange={(v) => onInputChange("lumpsum", v)} />
      <SliderRow label="Monthly SIP" value={input.sipMonthly} displayValue={formatINR(input.sipMonthly)}
        min={0} max={500000} step={1000} onChange={(v) => onInputChange("sipMonthly", v)} />
      <SliderRow label="Expected Return" value={input.returnRate} displayValue={`${input.returnRate}%`}
        min={2} max={18} step={0.5} tickUnit="%" onChange={(v) => onInputChange("returnRate", v)} />
      <SliderRow label="Tenure" value={input.tenure} displayValue={`${input.tenure} yrs`}
        min={1} max={40} step={1} tickUnit=" yr" onChange={(v) => onInputChange("tenure", v)} />
      <SliderRow label="Inflation Rate" value={input.inflationRate} displayValue={`${input.inflationRate}%`}
        min={2} max={12} step={0.5} tickUnit="%" onChange={(v) => onInputChange("inflationRate", v)} />
      <div className="flex flex-col gap-2">
        <span className="text-xs text-text-secondary">Step-Up Mode</span>
        <div className="flex gap-2">
          {(["percentage", "absolute"] as StepUpMode[]).map((mode) => (
            <button key={mode} className={twMerge(
              "px-3 py-1 text-xs rounded-md font-mono transition-colors",
              input.stepUpMode === mode
                ? "bg-sienna/10 text-sienna border border-sienna/30"
                : "bg-surface-hover text-text-secondary border border-border"
            )} onClick={() => onInputChange("stepUpMode", mode)}>
              {mode === "percentage" ? "% Annual" : "₹ Fixed"}
            </button>
          ))}
        </div>
      </div>
      <SliderRow
        label={input.stepUpMode === "percentage" ? "Step-Up %" : "Step-Up ₹"}
        value={input.stepUpValue}
        displayValue={input.stepUpMode === "percentage" ? `${input.stepUpValue}%` : formatINR(input.stepUpValue)}
        min={input.stepUpMode === "percentage" ? 0 : 0}
        max={input.stepUpMode === "percentage" ? 50 : 50000}
        step={input.stepUpMode === "percentage" ? 1 : 500}
        onChange={(v) => onInputChange("stepUpValue", v)} />
    </div>
  );
}