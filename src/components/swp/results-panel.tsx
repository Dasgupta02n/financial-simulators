"use client";

import type { SWPOutput } from "@/lib/calculators/swp/types";
import { formatINR, formatINRShort } from "@/lib/format";
import { MetricCard } from "@/components/sip/metric-card";
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalcExplainer } from "@/components/shared/calc-explainer";

interface Props {
  output: SWPOutput;
  crashEnabled: boolean;
}

export function SWPResultsPanel({ output, crashEnabled }: Props) {
  const isDepleted = output.depleted;
  const isStressWorse = crashEnabled && output.stressDepleted && (output.stressYearsLasted ?? 0) < output.yearsLasted;

  return (
    <div className="flex flex-col gap-6">
      <CalcExplainer>
        <p className="font-semibold text-text-primary">What this calculator does</p>
        <p>It shows how long your retirement fund will last when you withdraw from it every month, while the remaining money continues to earn returns. The stress test reveals what happens if the market crashes early in retirement — the worst possible timing.</p>
        <p className="font-semibold text-text-primary">What each number means</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="text-text-primary">Final Corpus</span> — money left (or ₹0 if depleted) at the end of your chosen period.</li>
          <li><span className="text-text-primary">Real Value</span> — what the remaining corpus can buy in today&apos;s prices.</li>
          <li><span className="text-text-primary">Years Lasted</span> — how many years before the money runs out. If this is less than your retirement period, you need to adjust.</li>
          <li><span className="text-text-primary">Total Withdrawn / Growth</span> — how much you took out versus how much the market added back.</li>
        </ul>
        <p className="font-semibold text-text-primary">The stress test</p>
        <p>Turn it on to simulate a market crash (20% or 30% drop) in your first few years of withdrawals. This is called <em>sequence-of-returns risk</em> — a crash when you&apos;re already withdrawing is far more damaging than one while you&apos;re still investing. This is why the &quot;Bucket Strategy&quot; (keeping 3-5 years of expenses in safe assets) exists.</p>
      </CalcExplainer>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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

      <div className="bg-surface rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold text-text-secondary mb-3">Corpus Over Time</h3>
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={output.yearlyData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                tickFormatter={(v) => `Y${v}`} axisLine={{ stroke: "#1f2937" }} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                tickFormatter={formatINRShort} axisLine={{ stroke: "#1f2937" }} tickLine={false} width={60} />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px",
                fontFamily: "var(--font-geist-mono)", fontSize: "11px" }}
                labelFormatter={(v) => `Year ${v}`}
                formatter={(value, name) => [formatINRShort(Number(value)), String(name)]} />
              <Area type="monotone" dataKey="corpusEnd" stroke="#6ee7b7" strokeWidth={2}
                fill="url(#corpusGrad)" name="Nominal" isAnimationActive={false} />
              <Line type="monotone" dataKey="realCorpusEnd" stroke="#f87171" strokeWidth={2}
                strokeDasharray="6 4" dot={false} name="Real Value" isAnimationActive={false} />
              {crashEnabled && <Line type="monotone" dataKey="stressCorpusEnd" stroke="#ef4444" strokeWidth={2}
                dot={false} name="Stress" isAnimationActive={false} />}
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