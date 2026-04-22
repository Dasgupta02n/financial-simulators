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
  const vizData = useMemo(() => ({
    corpusAtStart: input.corpus,
    corpusAtEnd: output.finalCorpus,
    monthlyWithdrawal: input.monthlyWithdrawal,
  }), [input.corpus, input.monthlyWithdrawal, output.finalCorpus]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="lg:w-[40%]"><SWPSliderPanel input={input} onInputChange={handleInputChange} /></div>
      <div className="lg:w-[60%]"><SWPResultsPanel output={output} crashEnabled={input.crashEnabled} vizData={vizData} /></div>
    </div>
  );
}