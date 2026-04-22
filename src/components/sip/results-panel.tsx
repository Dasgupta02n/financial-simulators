"use client";

import type { YearlyDataPoint } from "@/lib/calculators/sip/types";
import { MetricCard } from "./metric-card";
import { ProjectionChart } from "./projection-chart";
import { CalcExplainer } from "@/components/shared/calc-explainer";

interface ResultsPanelProps {
  totalInvested: number;
  nominalCorpus: number;
  postTaxCorpus: number;
  realCorpus: number;
  stressCorpus?: number;
  ltcgTax: number;
  yearlyData: YearlyDataPoint[];
  stressEnabled: boolean;
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
}: ResultsPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <CalcExplainer>
        <p className="font-semibold text-text-primary">What this calculator does</p>
        <p>It shows how your monthly investment grows over time, after considering the real-world effects of inflation, taxes, and market crashes.</p>
        <p className="font-semibold text-text-primary">What each number means</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="text-text-primary">Total Invested</span> — the actual money you put in from your pocket over the years.</li>
          <li><span className="text-text-primary">Nominal Corpus</span> — what your investment grows to on paper, before tax.</li>
          <li><span className="text-text-primary">Post-Tax Corpus</span> — what you actually get after paying long-term capital gains tax (12.5% on profits above ₹1.25 lakh).</li>
          <li><span className="text-text-primary">Real Purchasing Power</span> — the most important number. This is what your post-tax money can actually buy in today&apos;s prices, after inflation eats away at its value.</li>
        </ul>
        <p className="font-semibold text-text-primary">How to read the chart</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="text-gain">Green area</span> — your post-tax corpus growing over the years.</li>
          <li><span className="text-loss">Red dashed line</span> — the real purchasing power of that money (this is what matters for your life goals).</li>
          <li>The gap between green and red is what inflation silently steals from you.</li>
          <li>When stress test is on, a <span className="text-stress">red line</span> shows how a market crash would affect your savings.</li>
        </ul>
        <p className="font-semibold text-text-primary">Step-Up SIP</p>
        <p>Increasing your SIP by a small amount each year (even 10%) dramatically increases your final amount, because more money stays invested for longer.</p>
      </CalcExplainer>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard label="Total Invested" value={totalInvested} variant="neutral" />
        <MetricCard label="Nominal Corpus" value={nominalCorpus} variant="gain" />
        <MetricCard label="Post-Tax Corpus" value={postTaxCorpus} variant="gain" className="opacity-70" />
        <MetricCard label="Real Purchasing Power" value={realCorpus} variant="loss" />
        {stressEnabled && stressCorpus !== undefined && (
          <MetricCard label="After Stress Test" value={stressCorpus} variant="warn" />
        )}
      </div>

      {ltcgTax > 0 && (
        <div className="text-xs text-text-secondary font-mono px-1">
          LTCG Tax: ₹{ltcgTax.toLocaleString("en-IN", { maximumFractionDigits: 0 })} (12.5% on gains above ₹1.25L exemption)
        </div>
      )}

      <div className="bg-surface rounded-lg border border-border p-4">
        <ProjectionChart data={yearlyData} showStress={stressEnabled} />
      </div>
    </div>
  );
}