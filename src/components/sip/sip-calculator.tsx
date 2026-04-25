"use client";

import { useState, useMemo, useCallback } from "react";
import type { SIPInput, StressTestConfig, YearlyDataPoint } from "@/lib/calculators/sip/types";
import { computeSIP } from "@/lib/calculators/sip/engine";
import { applyLTCG } from "@/lib/calculators/sip/tax";
import { runMonteCarlo } from "@/lib/calculators/sip/monte-carlo";
import { applyStressTest } from "@/lib/calculators/sip/stress-test";
import { presentValue } from "@/lib/calculators/sip/inflation";
import { SliderPanel } from "./slider-panel";
import { ResultsPanel } from "./results-panel";

const DEFAULT_INPUT: SIPInput = {
  monthlySIP: 10000,
  lumpsum: 0,
  returnRate: 12,
  tenure: 20,
  inflationRate: 6,
  stepUpMode: "percentage",
  stepUpValue: 10,
};

const DEFAULT_STRESS: StressTestConfig = {
  enabled: false,
  severity: 0.3,
  crashYears: 2,
};

export function SIPCalculator() {
  const [input, setInput] = useState<SIPInput>(DEFAULT_INPUT);
  const [stressConfig, setStressConfig] = useState<StressTestConfig>(DEFAULT_STRESS);

  const handleInputChange = useCallback(
    <K extends keyof SIPInput>(key: K, value: SIPInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleStressChange = useCallback(
    <K extends keyof StressTestConfig>(key: K, value: StressTestConfig[K]) => {
      setStressConfig((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const result = useMemo(() => {
    const yearlyData = computeSIP(input);

    const finalPoint = yearlyData[yearlyData.length - 1];
    if (!finalPoint) return null;

    const { postTaxCorpus, tax: ltcgTax } = applyLTCG(
      finalPoint.nominalCorpus,
      finalPoint.invested
    );

    const realCorpus = presentValue(
      postTaxCorpus,
      input.inflationRate / 100,
      input.tenure
    );

    const mcResult = runMonteCarlo(input, 500);

    const enrichedData: YearlyDataPoint[] = yearlyData.map((point, idx) => ({
      ...point,
      postTaxCorpus: applyLTCG(point.nominalCorpus, point.invested).postTaxCorpus,
      realCorpus: presentValue(
        applyLTCG(point.nominalCorpus, point.invested).postTaxCorpus,
        input.inflationRate / 100,
        point.year
      ),
      p10: mcResult.p10Path[idx],
      p90: mcResult.p90Path[idx],
    }));

    const stressData = applyStressTest(input, stressConfig);
    if (stressConfig.enabled && stressData.length > 0) {
      const stressFinal = stressData[stressData.length - 1];
      return {
        totalInvested: finalPoint.invested,
        nominalCorpus: finalPoint.nominalCorpus,
        postTaxCorpus,
        realCorpus,
        stressCorpus: stressFinal.stressCorpus,
        ltcgTax,
        yearlyData: enrichedData.map((point, idx) => ({
          ...point,
          stressCorpus: stressData[idx]?.stressCorpus,
        })),
      };
    }

    return {
      totalInvested: finalPoint.invested,
      nominalCorpus: finalPoint.nominalCorpus,
      postTaxCorpus,
      realCorpus,
      ltcgTax,
      yearlyData: enrichedData,
    };
  }, [input, stressConfig]);

  const vizData = useMemo(() => result ? {
    totalInvested: result.totalInvested,
    nominalCorpus: result.nominalCorpus,
    postTaxCorpus: result.postTaxCorpus,
    realCorpus: result.realCorpus,
  } : { totalInvested: 0, nominalCorpus: 0, postTaxCorpus: 0, realCorpus: 0 }, [result]);

  if (!result) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <SliderPanel
          input={input}
          stressConfig={stressConfig}
          onInputChange={handleInputChange}
          onStressChange={handleStressChange}
        />
      </div>
      <div className="lg:w-[62%] min-h-0">
        <ResultsPanel
          vizData={vizData}
          totalInvested={result.totalInvested}
          nominalCorpus={result.nominalCorpus}
          postTaxCorpus={result.postTaxCorpus}
          realCorpus={result.realCorpus}
          stressCorpus={result.stressCorpus}
          ltcgTax={result.ltcgTax}
          yearlyData={result.yearlyData}
          stressEnabled={stressConfig.enabled}
          inflationRate={input.inflationRate}
        />
      </div>
    </div>
  );
}