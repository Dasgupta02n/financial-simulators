"use client";

import type { AccumulatorInput, StepUpMode } from "@/lib/calculators/accumulator/types";
import { formatINR } from "@/lib/format";
import { twMerge } from "tailwind-merge";

interface SliderPanelProps {
  input: AccumulatorInput;
  onInputChange: <K extends keyof AccumulatorInput>(key: K, value: AccumulatorInput[K]) => void;
}

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

export function AccumSliderPanel({ input, onInputChange }: SliderPanelProps) {
  return (
    <div className="flex flex-col gap-6 p-6 bg-surface rounded-lg border border-border">
      <h2 className="text-lg font-semibold tracking-tight">Configure Accumulation</h2>
      <SliderRow label="Initial Lumpsum" value={input.lumpsum} displayValue={formatINR(input.lumpsum)}
        min={0} max={50000000} step={100000} onChange={(v) => onInputChange("lumpsum", v)} />
      <SliderRow label="Monthly SIP" value={input.sipMonthly} displayValue={formatINR(input.sipMonthly)}
        min={0} max={500000} step={1000} onChange={(v) => onInputChange("sipMonthly", v)} />
      <SliderRow label="Expected Return" value={input.returnRate} displayValue={`${input.returnRate}%`}
        min={2} max={18} step={0.5} onChange={(v) => onInputChange("returnRate", v)} />
      <SliderRow label="Tenure" value={input.tenure} displayValue={`${input.tenure} yrs`}
        min={1} max={40} step={1} onChange={(v) => onInputChange("tenure", v)} />
      <SliderRow label="Inflation Rate" value={input.inflationRate} displayValue={`${input.inflationRate}%`}
        min={2} max={12} step={0.5} onChange={(v) => onInputChange("inflationRate", v)} />
      <div className="flex flex-col gap-2">
        <span className="text-sm text-text-secondary">Step-Up Mode</span>
        <div className="flex gap-2">
          {(["percentage", "absolute"] as StepUpMode[]).map((mode) => (
            <button key={mode} className={twMerge(
              "px-4 py-1.5 text-sm rounded-md font-mono transition-colors",
              input.stepUpMode === mode
                ? "bg-gain/20 text-gain border border-gain/40"
                : "bg-border text-text-secondary border border-border"
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