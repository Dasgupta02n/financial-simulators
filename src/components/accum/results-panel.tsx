"use client";

import type { AccumulatorOutput } from "@/lib/calculators/accumulator/types";
import { MetricCard } from "@/components/sip/metric-card";
import { AccumulationChart } from "./accumulation-chart";
import { formatINR } from "@/lib/format";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareButton } from "@/components/shared/share-button";
import { truthFromAccumulator } from "@/lib/truth/truth-data-adapter";

interface ResultsPanelProps { output: AccumulatorOutput; }

export function AccumResultsPanel({ output }: ResultsPanelProps) {
  const truth = truthFromAccumulator({ totalInvested: output.totalInvested, finalNominalTotal: output.finalNominalTotal, finalRealTotal: output.finalRealTotal });

  return (
    <div className="flex flex-col gap-3 min-h-0">
      <div className="flex items-center justify-between shrink-0">
        <ConfidenceBadge inflationRate={6} />
        <ShareButton title="Accumulation Calculator — c7xai" />
      </div>
      <LieVsTruthPanel truth={truth} />
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
      <div className="bg-white rounded-lg border border-border shadow-sm p-3">
        <div className="flex-1 min-h-[220px]">
          <AccumulationChart data={output.yearlyData} />
        </div>
      </div>
      <WhyThisNumber assumptions={truth.assumptions} />
      <CalcExplainer>
        <p className="font-semibold text-text-primary">The truth about accumulation</p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>Your nominal total looks impressive, but inflation and tax eat a large chunk. The real number is what matters.</li>
          <li><span className="text-loss">Red number</span> — what your corpus can actually buy in today&apos;s money.</li>
          <li>Step-up SIP accelerates growth, but returns are assumed constant — actual market returns vary.</li>
        </ul>
      </CalcExplainer>
    </div>
  );
}