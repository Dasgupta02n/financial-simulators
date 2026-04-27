"use client";

import { useState, useMemo, useCallback } from "react";
import type { CryptoInput } from "@/lib/calculators/crypto/types";
import { computeCrypto } from "@/lib/calculators/crypto/engine";
import { formatINR, formatINRShort } from "@/lib/format";
import { ComposedChart, Bar, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MetricCard } from "@/components/sip/metric-card";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareBar } from "@/components/shared/share-bar";
import { DownloadReportButton } from "@/components/shared/download-report-button";
import { SliderRow } from "@/components/shared/slider-row";
import { truthFromCrypto } from "@/lib/truth/truth-data-adapter";

const DEFAULT_INPUT: CryptoInput = {
  purchasePrice: 500000,
  quantity: 1,
  currentPrice: 1200000,
  holdingYears: 3,
  stakingIncome: 0,
  taxSlab: 30,
  inflationRate: 6,
};

export function CryptoCalculator() {
  const [input, setInput] = useState<CryptoInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof CryptoInput>(key: K, value: CryptoInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));
    },
    []
  );
  const output = useMemo(() => computeCrypto(input), [input]);
  const truth = truthFromCrypto(output, input.inflationRate);
  const isNegativeReal = output.realReturn < 0;

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-white shadow-sm rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">Configure Crypto</h2>
          <SliderRow label="Purchase Price" value={input.purchasePrice} displayValue={formatINR(input.purchasePrice)}
            min={1000} max={100000000} step={1000} onChange={(v) => handleInputChange("purchasePrice", v)} />
          <SliderRow label="Current Price" value={input.currentPrice} displayValue={formatINR(input.currentPrice)}
            min={1000} max={100000000} step={1000} onChange={(v) => handleInputChange("currentPrice", v)} />
          <SliderRow label="Quantity" value={input.quantity} displayValue={`${input.quantity}`}
            min={0.01} max={100} step={0.01} onChange={(v) => handleInputChange("quantity", v)} />
          <SliderRow label="Holding Years" value={input.holdingYears} displayValue={`${input.holdingYears} yrs`}
            min={1} max={20} step={1} onChange={(v) => handleInputChange("holdingYears", v)} tickUnit=" yr" />
          <SliderRow label="Staking Income /yr" value={input.stakingIncome} displayValue={formatINR(input.stakingIncome)}
            min={0} max={500000} step={5000} onChange={(v) => handleInputChange("stakingIncome", v)} />
          <SliderRow label="Tax Slab" value={input.taxSlab} displayValue={`${input.taxSlab}%`}
            min={0} max={30} step={5} onChange={(v) => handleInputChange("taxSlab", v)} tickUnit="%" />
          <SliderRow label="Inflation Rate" value={input.inflationRate} displayValue={`${input.inflationRate}%`}
            min={2} max={12} step={0.5} onChange={(v) => handleInputChange("inflationRate", v)} tickUnit="%" />
        </div>
      </div>

      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <ConfidenceBadge inflationRate={input.inflationRate} />
            <ShareBar title="Crypto Tax Calculator — c7xai" />
          </div>

          <LieVsTruthPanel truth={truth} />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <MetricCard label="Total Gains" value={output.totalGains} variant={output.totalGains > 0 ? "gain" : "loss"} />
            <MetricCard label="Tax @30%" value={output.taxOnGains} variant="loss" />
            <MetricCard label="TDS Deducted" value={output.tdsAmount} variant="loss" />
            <MetricCard label="Net After Tax" value={output.netAfterTax} variant="neutral" />
            <MetricCard label="Real Value" value={output.realValueAfterInflation} variant={isNegativeReal ? "loss" : "gain"} />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-text-secondary font-mono">Effective Tax Rate</span>
              <span className="text-xl font-mono font-semibold text-text-primary">{output.effectiveTaxRate.toFixed(1)}%</span>
            </div>
          </div>

          {isNegativeReal && (
            <div className="p-2 bg-loss/10 border border-loss/30 rounded-lg text-xs font-mono text-loss">
              After India&apos;s 30% crypto tax and inflation, your real return is negative. Your money loses purchasing power.
            </div>
          )}

          <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs font-mono text-amber-700">
            ⚠ Wash sale rule: Crypto losses cannot offset gains from stocks, mutual funds, or other asset classes.
          </div>

          <div className="flex-1 min-h-0 bg-white rounded-lg border border-border shadow-sm p-4">
            <h3 className="text-xs font-semibold text-text-secondary mb-2">Tax Breakdown Over Time</h3>
            <div className="w-full flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={output.yearlyData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <XAxis dataKey="year" tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={(v) => `Y${v}`} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={formatINRShort} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} width={55} />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px",
                    fontFamily: "var(--font-geist-mono)", fontSize: "11px" }}
                    labelFormatter={(v) => `Year ${v}`}
                    formatter={(value, name) => [formatINRShort(Number(value)), String(name)]} />
                  <Bar dataKey="tax30Pct" fill="#f87171" fillOpacity={0.8} name="30% Tax" isAnimationActive={true} />
                  <Bar dataKey="tds1Pct" fill="#fbbf24" fillOpacity={0.8} name="1% TDS" isAnimationActive={true} />
                  <Line type="monotone" dataKey="realValue" stroke="#6ee7b7" strokeWidth={2}
                    strokeDasharray="6 4" dot={false} name="Real Value" isAnimationActive={true} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <WhyThisNumber assumptions={truth.assumptions} />

          <CalcExplainer>
            <p className="font-semibold text-text-primary">The truth about crypto returns in India</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>India taxes crypto gains at a flat 30% under Section 115BBE — no slab benefit, no offset against other losses.</li>
              <li>1% TDS is deducted on transfers above ₹10L (Section 194S) — this reduces your capital further.</li>
              <li><span className="text-loss">Red bars</span> — the tax you pay every year. <span className="text-gain">Green dashed line</span> — what your investment is actually worth after tax and inflation.</li>
              <li>Staking income is taxed separately at your slab rate, not at the 30% crypto rate.</li>
            </ul>
          </CalcExplainer>
          <DownloadReportButton
            calculatorTitle="Crypto Tax Calculator"
            calculatorData={{
              "Total Gains": formatINR(output.totalGains),
              "Tax @30%": formatINR(output.taxOnGains),
              "TDS Deducted": formatINR(output.tdsAmount),
              "Net After Tax": formatINR(output.netAfterTax),
              "Real Value": formatINR(output.realValueAfterInflation),
            }}
          />
        </div>
      </div>
    </div>
  );
}