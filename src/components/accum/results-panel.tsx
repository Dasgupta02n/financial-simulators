"use client";

import type { AccumulatorOutput } from "@/lib/calculators/accumulator/types";
import { MetricCard } from "@/components/sip/metric-card";
import { AccumulationChart } from "./accumulation-chart";
import { formatINR } from "@/lib/format";
import { CalcExplainer } from "@/components/shared/calc-explainer";

interface ResultsPanelProps { output: AccumulatorOutput; }

export function AccumResultsPanel({ output }: ResultsPanelProps) {
  return (
    <div className="flex flex-col gap-3 min-h-0">
      <CalcExplainer>
        <p className="font-semibold text-text-primary">Accumulation Calculator</p>
        <p>Combines lumpsum + monthly SIP growth. Step-up increases your SIP yearly, which can double your corpus.</p>
        <ul className="list-disc pl-5 space-y-0.5">
          <li><span className="text-text-primary">Total Invested</span> — all money you put in (lumpsum + SIP payments).</li>
          <li><span className="text-text-primary">Lumpsum Value</span> — one-time investment growth.</li>
          <li><span className="text-text-primary">SIP Corpus</span> — monthly investments combined growth.</li>
          <li><span className="text-text-primary">Nominal Total</span> — lumpsum + SIP on paper.</li>
          <li><span className="text-text-primary">Real Purchasing Power</span> — what total can buy in today&apos;s money.</li>
        </ul>
      </CalcExplainer>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        <MetricCard label="Total Invested" value={output.totalInvested} variant="neutral" />
        <MetricCard label="Lumpsum Value" value={output.finalLumpsum} variant="gain" />
        <MetricCard label="SIP Corpus" value={output.finalSipCorpus} variant="gain" />
        <MetricCard label="Nominal Total" value={output.finalNominalTotal} variant="gain" />
        <MetricCard label="Real Purchasing Power" value={output.finalRealTotal} variant="loss" />
      </div>
      <div className="text-xs text-text-secondary font-mono px-1">
        SIP invested: {formatINR(output.finalSipInvested)} → Corpus: {formatINR(output.finalSipCorpus)}
      </div>
      <div className="bg-surface rounded-lg border border-border p-3">
        <div className="flex-1 min-h-[220px]">
          <AccumulationChart data={output.yearlyData} />
        </div>
      </div>
    </div>
  );
}