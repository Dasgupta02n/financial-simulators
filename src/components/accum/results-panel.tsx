"use client";

import type { AccumulatorOutput } from "@/lib/calculators/accumulator/types";
import { MetricCard } from "@/components/sip/metric-card";
import { AccumulationChart } from "./accumulation-chart";
import { formatINR } from "@/lib/format";
import { CalcExplainer } from "@/components/shared/calc-explainer";

interface ResultsPanelProps { output: AccumulatorOutput; }

export function AccumResultsPanel({ output }: ResultsPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <CalcExplainer>
        <p className="font-semibold text-text-primary">What this calculator does</p>
        <p>It combines a one-time lumpsum investment with a monthly SIP, and shows how both grow together. The step-up feature increases your SIP amount each year, which can massively boost your final corpus.</p>
        <p className="font-semibold text-text-primary">What each number means</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="text-text-primary">Total Invested</span> — all the money you put in (lumpsum + every SIP payment over the years).</li>
          <li><span className="text-text-primary">Lumpsum Value</span> — how your one-time investment grew on its own.</li>
          <li><span className="text-text-primary">SIP Corpus</span> — how your monthly investments grew combined.</li>
          <li><span className="text-text-primary">Nominal Total</span> — lumpsum + SIP added together, on paper.</li>
          <li><span className="text-text-primary">Real Purchasing Power</span> — what that total can actually buy in today&apos;s money. This is the number to care about for life goals.</li>
        </ul>
        <p className="font-semibold text-text-primary">Step-Up SIP</p>
        <p>Choosing &quot;% Annual&quot; increases your SIP by that percentage each year (like a salary hike). Choosing &quot;₹ Fixed&quot; adds a flat amount yearly. Even a 10% step-up can more than double your final corpus over 20 years.</p>
      </CalcExplainer>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard label="Total Invested" value={output.totalInvested} variant="neutral" />
        <MetricCard label="Lumpsum Value" value={output.finalLumpsum} variant="gain" />
        <MetricCard label="SIP Corpus" value={output.finalSipCorpus} variant="gain" />
        <MetricCard label="Nominal Total" value={output.finalNominalTotal} variant="gain" />
        <MetricCard label="Real Purchasing Power" value={output.finalRealTotal} variant="loss" />
      </div>
      <div className="text-xs text-text-secondary font-mono px-1">
        SIP invested: {formatINR(output.finalSipInvested)} → Corpus: {formatINR(output.finalSipCorpus)}
      </div>
      <div className="bg-surface rounded-lg border border-border p-4">
        <AccumulationChart data={output.yearlyData} />
      </div>
    </div>
  );
}