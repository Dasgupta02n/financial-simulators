"use client";

import type { EMIInput } from "@/lib/calculators/emi/types";
import type { RateShift } from "@/lib/calculators/emi/types";
import { RateShiftToggle } from "./rate-shift-toggle";
import { formatINR } from "@/lib/format";
import { SliderRow } from "@/components/shared/slider-row";

interface SliderPanelProps {
  input: EMIInput;
  rateShift: RateShift;
  onInputChange: <K extends keyof EMIInput>(key: K, value: EMIInput[K]) => void;
  onRateShiftChange: (shift: RateShift) => void;
}

export function SliderPanel({
  input,
  rateShift,
  onInputChange,
  onRateShiftChange,
}: SliderPanelProps) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-border h-full overflow-y-auto shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-text-primary">Configure Your Loan</h2>

      <SliderRow
        label="Loan Amount"
        value={input.loanAmount}
        displayValue={formatINR(input.loanAmount)}
        min={100000}
        max={50000000}
        step={100000}
        onChange={(v) => onInputChange("loanAmount", v)}
      />

      <SliderRow
        label="Interest Rate"
        value={input.interestRate}
        displayValue={`${input.interestRate}%`}
        min={4}
        max={18}
        step={0.25}
        tickUnit="%"
        onChange={(v) => onInputChange("interestRate", v)}
      />

      <SliderRow
        label="Tenure"
        value={input.tenure}
        displayValue={`${input.tenure} yrs`}
        min={1}
        max={30}
        step={1}
        tickUnit=" yr"
        onChange={(v) => onInputChange("tenure", v)}
      />

      <SliderRow
        label="Extra Monthly Cash"
        value={input.extraMonthlyCash}
        displayValue={formatINR(input.extraMonthlyCash)}
        min={0}
        max={100000}
        step={1000}
        onChange={(v) => onInputChange("extraMonthlyCash", v)}
      />

      <SliderRow
        label="SIP Return Rate"
        value={input.sipReturnRate}
        displayValue={`${input.sipReturnRate}%`}
        min={4}
        max={18}
        step={0.5}
        tickUnit="%"
        onChange={(v) => onInputChange("sipReturnRate", v)}
      />

      <SliderRow
        label="Inflation Rate"
        value={input.inflationRate}
        displayValue={`${input.inflationRate}%`}
        min={2}
        max={12}
        step={0.5}
        tickUnit="%"
        onChange={(v) => onInputChange("inflationRate", v)}
      />

      <RateShiftToggle rateShift={rateShift} onChange={onRateShiftChange} />
    </div>
  );
}