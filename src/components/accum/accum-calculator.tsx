"use client";

import { useState, useMemo, useCallback } from "react";
import type { AccumulatorInput } from "@/lib/calculators/accumulator/types";
import { computeAccumulation } from "@/lib/calculators/accumulator/engine";
import { AccumSliderPanel } from "./slider-panel";
import { AccumResultsPanel } from "./results-panel";

const DEFAULT_INPUT: AccumulatorInput = {
  lumpsum: 500000,
  sipMonthly: 25000,
  returnRate: 12,
  tenure: 20,
  stepUpMode: "percentage",
  stepUpValue: 10,
  inflationRate: 6,
};

export function AccumCalculator() {
  const [input, setInput] = useState<AccumulatorInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof AccumulatorInput>(key: K, value: AccumulatorInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));
    }, []
  );
  const output = useMemo(() => computeAccumulation(input), [input]);
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0"><AccumSliderPanel input={input} onInputChange={handleInputChange} /></div>
      <div className="lg:w-[62%] min-h-0"><AccumResultsPanel output={output} /></div>
    </div>
  );
}