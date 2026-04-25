"use client";

import { useState, useMemo, useCallback } from "react";
import type { SWPInput } from "@/lib/calculators/swp/types";
import { computeSWP } from "@/lib/calculators/swp/engine";
import { SWPSliderPanel } from "./slider-panel";
import { SWPResultsPanel } from "./results-panel";

const DEFAULT_INPUT: SWPInput = {
  corpus: 5000000,
  monthlyWithdrawal: 30000,
  returnRate: 8,
  tenure: 25,
  inflationRate: 6,
  crashEnabled: true,
  crashSeverity: 0.3,
  crashYear: 2,
  crashDuration: 2,
};

export function SWPCalculator() {
  const [input, setInput] = useState<SWPInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof SWPInput>(key: K, value: SWPInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));
    }, []
  );
  const output = useMemo(() => computeSWP(input), [input]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0"><SWPSliderPanel input={input} onInputChange={handleInputChange} /></div>
      <div className="lg:w-[62%] min-h-0"><SWPResultsPanel output={output} crashEnabled={input.crashEnabled} inflationRate={input.inflationRate} /></div>
    </div>
  );
}