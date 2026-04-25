"use client";

import type { YearlyDataPoint } from "@/lib/calculators/sip/types";
import { MetricCard } from "./metric-card";
import { ProjectionChart } from "./projection-chart";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareBar } from "@/components/shared/share-bar";
import { truthFromSIP } from "@/lib/truth/truth-data-adapter";

interface ResultsPanelProps {
  totalInvested: number;
  nominalCorpus: number;
  postTaxCorpus: number;
  realCorpus: number;
  stressCorpus?: number;
  ltcgTax: number;
  yearlyData: YearlyDataPoint[];
  stressEnabled: boolean;
  vizData: Record<string, number>;
  inflationRate?: number;
}

export function ResultsPanel({
  totalInvested,
  nominalCorpus,
  postTaxCorpus,
  realCorpus,
  stressCorpus,
  ltcgTax,
  yearlyData,
  stressEnabled,
  vizData,
  inflationRate = 6,
}: ResultsPanelProps) {
  const truth = truthFromSIP(
    { totalInvested, nominalCorpus, realCorpus },
    inflationRate
  );

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between shrink-0">
        <ConfidenceBadge inflationRate={inflationRate} />
        <ShareBar title="SIP Simulator — c7xai" />
      </div>

      <LieVsTruthPanel truth={truth} />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 shrink-0">
        <MetricCard label="Total Invested" value={totalInvested} variant="neutral" />
        <MetricCard label="Nominal Corpus" value={nominalCorpus} variant="gain" />
        <MetricCard label="Post-Tax Corpus" value={postTaxCorpus} variant="gain" className="opacity-70" />
        <MetricCard label="Real Purchasing Power" value={realCorpus} variant="loss" />
        {stressEnabled && stressCorpus !== undefined && (
          <MetricCard label="After Stress Test" value={stressCorpus} variant="warn" />
        )}
      </div>

      {ltcgTax > 0 && (
        <div className="text-xs text-text-secondary font-mono px-1 shrink-0">
          LTCG Tax: ₹{ltcgTax.toLocaleString("en-IN", { maximumFractionDigits: 0 })} (12.5% on gains above ₹1.25L exemption)
        </div>
      )}

      <div className="bg-white rounded-lg border border-border shadow-sm p-3 flex-1 min-h-0 flex flex-col">
        <ProjectionChart data={yearlyData} showStress={stressEnabled} />
      </div>

      <WhyThisNumber assumptions={truth.assumptions} />

      <CalcExplainer>
        <p className="font-semibold text-text-primary">How to read this</p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li><span className="text-gain">Green area</span> — post-tax corpus growing over the years.</li>
          <li><span className="text-loss">Red dashed line</span> — real purchasing power (what matters for life goals).</li>
          <li>The gap between green and red is what inflation silently steals.</li>
          {stressEnabled && <li><span className="text-stress">Red line</span> — how a market crash would affect savings.</li>}
        </ul>
      </CalcExplainer>
    </div>
  );
}