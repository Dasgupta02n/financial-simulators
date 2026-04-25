"use client";

import { useState, useMemo, useCallback } from "react";
import type { EMIInput } from "@/lib/calculators/emi/types";
import type { RateShift } from "@/lib/calculators/emi/types";
import { computeAmortization } from "@/lib/calculators/emi/engine";
import { computeSummary, findCrossover } from "@/lib/calculators/emi/comparison";
import { SliderPanel } from "./slider-panel";
import { ResultsPanel } from "./results-panel";

const DEFAULT_INPUT: EMIInput = {
  loanAmount: 5000000,
  interestRate: 8.5,
  tenure: 20,
  extraMonthlyCash: 10000,
  sipReturnRate: 12,
  inflationRate: 6,
};

const DEFAULT_RATE_SHIFT: RateShift = {
  enabled: false,
  shifts: [],
};

export function EMICalculator() {
  const [input, setInput] = useState<EMIInput>(DEFAULT_INPUT);
  const [rateShift, setRateShift] = useState<RateShift>(DEFAULT_RATE_SHIFT);

  const handleInputChange = useCallback(
    <K extends keyof EMIInput>(key: K, value: EMIInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const result = useMemo(() => {
    const amortization = computeAmortization(input, rateShift);
    if (amortization.length === 0) return null;

    const summary = computeSummary(input, amortization);
    const crossover = findCrossover(input, amortization);

    return {
      ...summary,
      crossoverMonth: crossover.crossoverMonth,
      amortization,
    };
  }, [input, rateShift]);

  if (!result) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <SliderPanel
          input={input}
          rateShift={rateShift}
          onInputChange={handleInputChange}
          onRateShiftChange={setRateShift}
        />
      </div>
      <div className="lg:w-[62%] min-h-0">
        <ResultsPanel
          emi={result.emi}
          totalInterest={result.totalInterest}
          totalPayment={result.totalPayment}
          prepaidTotalInterest={result.prepaidTotalInterest}
          prepaidSavedInterest={result.prepaidSavedInterest}
          prepaidMonthsSaved={result.prepaidMonthsSaved}
          sipCorpusAtLoanEnd={result.sipCorpusAtLoanEnd}
          sipInvestedAtLoanEnd={result.sipInvestedAtLoanEnd}
          crossoverMonth={result.crossoverMonth}
          amortization={result.amortization}
          extraCash={input.extraMonthlyCash}
          interestRate={input.interestRate}
        />
      </div>
    </div>
  );
}