"use client";

import type { TaxInput } from "@/lib/calculators/tax/types";
import { MAX_80C, MAX_80D, MAX_NPS } from "@/lib/calculators/tax/types";
import { formatINR } from "@/lib/format";
import { SliderRow } from "@/components/shared/slider-row";

interface SliderPanelProps {
  input: TaxInput;
  onInputChange: <K extends keyof TaxInput>(key: K, value: TaxInput[K]) => void;
}

export function SliderPanel({ input, onInputChange }: SliderPanelProps) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-border h-full overflow-y-auto shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-text-primary">Configure Your Income</h2>

      <SliderRow
        label="Gross Annual Salary"
        value={input.grossSalary}
        displayValue={formatINR(input.grossSalary)}
        min={300000}
        max={50000000}
        step={100000}
        onChange={(v) => onInputChange("grossSalary", v)}
      />

      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-text-secondary mb-4">Deductions (Old Regime)</h3>

        <SliderRow
          label="Section 80C"
          value={input.section80C}
          displayValue={formatINR(input.section80C)}
          min={0}
          max={MAX_80C}
          step={5000}
          onChange={(v) => onInputChange("section80C", v)}
          hint={`max ${formatINR(MAX_80C)}`}
        />

        <div className="mt-4">
          <SliderRow
            label="Section 80D"
            value={input.section80D}
            displayValue={formatINR(input.section80D)}
            min={0}
            max={MAX_80D}
            step={2500}
            onChange={(v) => onInputChange("section80D", v)}
            hint={`max ${formatINR(MAX_80D)}`}
          />
        </div>

        <div className="mt-4">
          <SliderRow
            label="HRA Exemption"
            value={input.hraExemption}
            displayValue={formatINR(input.hraExemption)}
            min={0}
            max={600000}
            step={5000}
            onChange={(v) => onInputChange("hraExemption", v)}
          />
        </div>

        <div className="mt-4">
          <SliderRow
            label="NPS 80CCD(1B)"
            value={input.nps80CCD1B}
            displayValue={formatINR(input.nps80CCD1B)}
            min={0}
            max={MAX_NPS}
            step={5000}
            onChange={(v) => onInputChange("nps80CCD1B", v)}
            hint={`max ${formatINR(MAX_NPS)}`}
          />
        </div>

        <div className="mt-4">
          <SliderRow
            label="Other Deductions"
            value={input.otherDeductions}
            displayValue={formatINR(input.otherDeductions)}
            min={0}
            max={500000}
            step={5000}
            onChange={(v) => onInputChange("otherDeductions", v)}
          />
        </div>
      </div>

      <div className="text-xs text-text-muted font-mono border-t border-border pt-4">
        New Regime: ₹75K standard deduction, no other deductions allowed.
      </div>
    </div>
  );
}