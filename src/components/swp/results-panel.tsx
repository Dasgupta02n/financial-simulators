"use client";

import type { SWPOutput } from "@/lib/calculators/swp/types";
import { formatINR, formatINRShort } from "@/lib/format";
import { MetricCard } from "@/components/sip/metric-card";
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareButton } from "@/components/shared/share-button";
import { truthFromSWP } from "@/lib/truth/truth-data-adapter";

interface Props {
  output: SWPOutput;
  crashEnabled: boolean;
  inflationRate?: number;
}

export function SWPResultsPanel({ output, crashEnabled, inflationRate = 6 }: Props) {
  const isDepleted = output.depleted;
  const isStressWorse = crashEnabled && output.stressDepleted && (output.stressYearsLasted ?? 0) < output.yearsLasted;
  const truth = truthFromSWP({ finalCorpus: output.finalCorpus, finalRealCorpus: output.finalRealCorpus, totalWithdrawn: output.totalWithdrawn }, inflationRate);

  return (
    <div className="flex flex-col gap-3 min-h-0">
      <div className="flex items-center justify-between shrink-0">
        <ConfidenceBadge inflationRate={inflationRate} />
        <ShareButton title="SWP Stress Test — c7xai" />
      </div>
      <LieVsTruthPanel truth={truth} />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        <MetricCard label="Final Corpus" value={output.finalCorpus} variant={isDepleted ? "loss" : "gain"} />
        <MetricCard label="Real Value (Today's ₹)" value={output.finalRealCorpus} variant={isDepleted ? "loss" : "neutral"} />
        <MetricCard label="Years Lasted" value={output.yearsLasted} variant={isDepleted ? "loss" : "gain"} />
        <MetricCard label="Total Withdrawn" value={output.totalWithdrawn} variant="neutral" />
        <MetricCard label="Total Growth" value={output.totalGrowth} variant="gain" />
      </div>

      {isDepleted && (
        <div className="p-3 bg-loss/10 border border-loss/30 rounded-lg text-sm font-mono text-loss">
          Corpus depletes in {output.yearsLasted} year{output.yearsLasted > 1 ? "s" : ""}. Consider reducing withdrawal or increasing return assumptions.
        </div>
      )}

      {crashEnabled && isStressWorse && (
        <div className="p-3 bg-stress/10 border border-stress/30 rounded-lg text-sm font-mono text-stress">
          Stress scenario depletes in {output.stressYearsLasted} year{output.stressYearsLasted! > 1 ? "s" : ""} — {output.yearsLasted - output.stressYearsLasted!} fewer than nominal. This is sequence-of-returns risk: early crashes are devastating.
        </div>
      )}

      {crashEnabled && !isStressWorse && output.stressFinalCorpus !== undefined && (
        <div className="p-3 bg-warn/10 border border-warn/30 rounded-lg text-sm font-mono text-warn">
          Stress corpus survives with ₹{formatINR(output.stressFinalCorpus)} remaining — but still reduced from nominal by ₹{formatINR(output.finalCorpus - output.stressFinalCorpus)}.
        </div>
      )}

      <WhyThisNumber assumptions={truth.assumptions} />
      <CalcExplainer>
        <p className="font-semibold text-text-primary">The truth about SWP</p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>Your corpus might last 25 years on paper — but inflation eats its purchasing power every year.</li>
          <li><span className="text-loss">Red dashed line</span> — real value of your remaining corpus in today&apos;s money.</li>
          {crashEnabled && <li><span className="text-stress">Red line</span> — how a market crash early in retirement derails your plan.</li>}
        </ul>
      </CalcExplainer>

      <div className="bg-white rounded-lg border border-border shadow-sm p-3">
        <h3 className="text-xs font-semibold text-text-secondary mb-2">Corpus Over Time</h3>
        <div className="w-full flex-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={output.yearlyData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                tickFormatter={(v) => `Y${v}`} axisLine={{ stroke: "#1f2937" }} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                tickFormatter={formatINRShort} axisLine={{ stroke: "#1f2937" }} tickLine={false} width={55} />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px",
                fontFamily: "var(--font-geist-mono)", fontSize: "11px" }}
                labelFormatter={(v) => `Year ${v}`}
                formatter={(value, name) => [formatINRShort(Number(value)), String(name)]} />
              <Area type="monotone" dataKey="corpusEnd" stroke="#6ee7b7" strokeWidth={2}
                fill="url(#corpusGrad)" name="Nominal" isAnimationActive={true} />
              <Line type="monotone" dataKey="realCorpusEnd" stroke="#f87171" strokeWidth={2}
                strokeDasharray="6 4" dot={false} name="Real Value" isAnimationActive={true} />
              {crashEnabled && <Line type="monotone" dataKey="stressCorpusEnd" stroke="#ef4444" strokeWidth={2}
                dot={false} name="Stress" isAnimationActive={true} />}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-xs text-text-secondary font-mono px-1">
        Withdrawals increase at {output.yearlyData.length > 1 ? "inflation rate" : "configured rate"} each year (real purchasing power preserved).
        {crashEnabled && " Stress path injects a crash in early years — this is the Bucket Strategy risk scenario."}
      </div>
    </div>
  );
}