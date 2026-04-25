"use client";

import type { SIPInput, StressTestConfig } from "@/lib/calculators/sip/types";
import { twMerge } from "tailwind-merge";

interface SliderPanelProps {
  input: SIPInput;
  stressConfig: StressTestConfig;
  onInputChange: <K extends keyof SIPInput>(key: K, value: SIPInput[K]) => void;
  onStressChange: <K extends keyof StressTestConfig>(key: K, value: StressTestConfig[K]) => void;
}

function SliderRow({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-baseline">
        <label className="text-xs text-text-secondary">{label}</label>
        <span className="text-xs font-mono text-text-primary">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer bg-border accent-gain"
      />
    </div>
  );
}

export function SliderPanel({
  input,
  stressConfig,
  onInputChange,
  onStressChange,
}: SliderPanelProps) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-surface rounded-lg border border-border h-full overflow-y-auto">
      <h2 className="text-sm font-semibold tracking-tight">Configure Your SIP</h2>

      <SliderRow
        label="Monthly SIP"
        value={input.monthlySIP}
        displayValue={`₹${input.monthlySIP.toLocaleString("en-IN")}`}
        min={500}
        max={500000}
        step={500}
        onChange={(v) => onInputChange("monthlySIP", v)}
      />

      <SliderRow
        label="Initial Lumpsum"
        value={input.lumpsum}
        displayValue={`₹${input.lumpsum.toLocaleString("en-IN")}`}
        min={0}
        max={10000000}
        step={10000}
        onChange={(v) => onInputChange("lumpsum", v)}
      />

      <SliderRow
        label="Expected Return"
        value={input.returnRate}
        displayValue={`${input.returnRate}%`}
        min={4}
        max={18}
        step={0.5}
        onChange={(v) => onInputChange("returnRate", v)}
      />

      <SliderRow
        label="Tenure"
        value={input.tenure}
        displayValue={`${input.tenure} yrs`}
        min={1}
        max={40}
        step={1}
        onChange={(v) => onInputChange("tenure", v)}
      />

      <SliderRow
        label="Inflation Rate"
        value={input.inflationRate}
        displayValue={`${input.inflationRate}%`}
        min={2}
        max={12}
        step={0.5}
        onChange={(v) => onInputChange("inflationRate", v)}
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-text-secondary">Step-Up Mode</span>
        <div className="flex gap-2">
          <button
            className={twMerge(
              "px-3 py-1 text-xs rounded-md font-mono transition-colors",
              input.stepUpMode === "percentage"
                ? "bg-gain/20 text-gain border border-gain/40"
                : "bg-border text-text-secondary border border-border"
            )}
            onClick={() => onInputChange("stepUpMode", "percentage")}
          >
            % Annual
          </button>
          <button
            className={twMerge(
              "px-3 py-1 text-xs rounded-md font-mono transition-colors",
              input.stepUpMode === "fixed"
                ? "bg-gain/20 text-gain border border-gain/40"
                : "bg-border text-text-secondary border border-border"
            )}
            onClick={() => onInputChange("stepUpMode", "fixed")}
          >
            ₹ Fixed
          </button>
        </div>
      </div>

      <SliderRow
        label={input.stepUpMode === "percentage" ? "Step-Up %" : "Step-Up ₹"}
        value={input.stepUpValue}
        displayValue={
          input.stepUpMode === "percentage"
            ? `${input.stepUpValue}%`
            : `₹${input.stepUpValue.toLocaleString("en-IN")}`
        }
        min={input.stepUpMode === "percentage" ? 1 : 500}
        max={input.stepUpMode === "percentage" ? 50 : 50000}
        step={input.stepUpMode === "percentage" ? 1 : 500}
        onChange={(v) => onInputChange("stepUpValue", v)}
      />

      <div className="border-t border-border pt-3 mt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary font-semibold">
            Stress Test
          </span>
          <button
            className={twMerge(
              "w-8 h-4 rounded-full transition-colors relative",
              stressConfig.enabled ? "bg-warn" : "bg-border"
            )}
            onClick={() =>
              onStressChange("enabled", !stressConfig.enabled)
            }
          >
            <span
              className={twMerge(
                "absolute top-0.5 w-3 h-3 rounded-full bg-text-primary transition-transform",
                stressConfig.enabled ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </button>
        </div>

        {stressConfig.enabled && (
          <div className="flex flex-col gap-3 mt-3">
            <div className="flex gap-2">
              <button
                className={twMerge(
                  "px-2 py-0.5 text-xs rounded-md font-mono",
                  stressConfig.severity === 0.2
                    ? "bg-stress/20 text-stress border border-stress/40"
                    : "bg-border text-text-secondary border border-border"
                )}
                onClick={() => onStressChange("severity", 0.2)}
              >
                20% Crash
              </button>
              <button
                className={twMerge(
                  "px-2 py-0.5 text-xs rounded-md font-mono",
                  stressConfig.severity === 0.3
                    ? "bg-stress/20 text-stress border border-stress/40"
                    : "bg-border text-text-secondary border border-border"
                )}
                onClick={() => onStressChange("severity", 0.3)}
              >
                30% Crash
              </button>
            </div>
            <SliderRow
              label="Crash Window"
              value={stressConfig.crashYears}
              displayValue={`Last ${stressConfig.crashYears} yr${stressConfig.crashYears > 1 ? "s" : ""}`}
              min={1}
              max={5}
              step={1}
              onChange={(v) => onStressChange("crashYears", v)}
            />
          </div>
        )}
      </div>
    </div>
  );
}