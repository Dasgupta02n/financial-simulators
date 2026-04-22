"use client";

import { useState, useMemo, useCallback } from "react";
import type { TaxInput } from "@/lib/calculators/tax/types";
import { computeTax } from "@/lib/calculators/tax/engine";
import { SliderPanel } from "./slider-panel";
import { ResultsPanel } from "./results-panel";

const DEFAULT_INPUT: TaxInput = {
  grossSalary: 1500000,
  section80C: 150000,
  section80D: 25000,
  hraExemption: 200000,
  nps80CCD1B: 50000,
  otherDeductions: 0,
};

export function TaxCalculator() {
  const [input, setInput] = useState<TaxInput>(DEFAULT_INPUT);

  const handleInputChange = useCallback(
    <K extends keyof TaxInput>(key: K, value: TaxInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const output = useMemo(() => computeTax(input), [input]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="lg:w-[40%]">
        <SliderPanel input={input} onInputChange={handleInputChange} />
      </div>
      <div className="lg:w-[60%]">
        <ResultsPanel output={output} />
      </div>
    </div>
  );
}