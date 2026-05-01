"use client";
import { useState, useMemo, useCallback } from "react";
import type { ForexInput, ForexOutput } from "@/lib/calculators/forex/types";
import { CURRENCY_NAMES } from "@/lib/calculators/forex/types";
import { computeForex } from "@/lib/calculators/forex/engine";
import { formatINR, formatINRShort } from "@/lib/format";
import { ComposedChart, Bar, Area, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MetricCard } from "@/components/sip/metric-card";
import { twMerge } from "tailwind-merge";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareBar } from "@/components/shared/share-bar";
import { DownloadReportButton } from "@/components/shared/download-report-button";
import { SliderRow } from "@/components/shared/slider-row";
import type { TruthResult } from "@/lib/truth/types";
import { FY_YEAR, LAST_UPDATED } from "@/lib/truth/assumptions";

const CURRENCY_OPTIONS = Object.keys(CURRENCY_NAMES);

const DEFAULT_INPUT: ForexInput = {
  amountINR: 1000000,
  targetCurrency: "USD",
  exchangeRate: 83.5,
  holdingYears: 5,
  appreciationRate: 4,
  taxSlab: 30,
  inflationRate: 6,
};

function truthFromForex(result: ForexOutput, input: ForexInput): TruthResult {
  return {
    grossLabel: "Foreign investment value (INR)",
    grossValue: result.finalINRValue,
    realLabel: "Real purchasing power",
    realValue: result.realValue,
    deductions: [
      { label: "Capital gains tax", amount: result.capitalGainsTax },
      { label: "TCS on remittance", amount: result.tcsAmount },
      { label: "Bank spread (~1%)", amount: result.bankSpread },
      { label: `Inflation erosion (${input.inflationRate}%)`, amount: result.netProceeds - result.realValue },
    ],
    assumptions: [
      input.holdingYears > 3 ? "LTCG at 20% with indexation" : "STCG at slab rate",
      `TCS: 20% above ₹7L under LRS`,
      `RBI LRS limit: $2,50,000/year`,
      `Inflation: ${input.inflationRate}% (RBI 10-yr avg)`,
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate: input.inflationRate,
    lastUpdated: LAST_UPDATED,
  };
}

export function ForexCalculator() {
  const [input, setInput] = useState<ForexInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof ForexInput>(key: K, value: ForexInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const output = useMemo(() => computeForex(input), [input]);
  const truth = useMemo(() => truthFromForex(output, input), [output, input]);
  const isNegativeReal = output.effectiveRate < 0;

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      {/* Left Panel — Sliders */}
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-white shadow-sm rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">Configure Forex</h2>

          <SliderRow
            label="Amount in INR"
            value={input.amountINR}
            displayValue={formatINR(input.amountINR)}
            min={10000}
            max={50000000}
            step={10000}
            onChange={(v) => handleInputChange("amountINR", v)}
          />

          <SliderRow
            label="Exchange Rate"
            value={input.exchangeRate}
            displayValue={`${input.exchangeRate} ₹/${input.targetCurrency}`}
            min={50}
            max={200}
            step={0.5}
            onChange={(v) => handleInputChange("exchangeRate", v)}
            tickUnit=""
          />

          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary">Target Currency</span>
            <div className="flex flex-wrap gap-1.5">
              {CURRENCY_OPTIONS.map((cur) => (
                <button
                  key={cur}
                  className={twMerge(
                    "px-2 py-1 text-xs rounded-md font-mono transition-colors",
                    input.targetCurrency === cur
                      ? "bg-sienna/10 text-sienna border border-sienna/30"
                      : "bg-surface-hover text-text-secondary border border-border",
                  )}
                  onClick={() => handleInputChange("targetCurrency", cur)}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="Holding Years"
            value={input.holdingYears}
            displayValue={`${input.holdingYears} yrs`}
            min={1}
            max={15}
            step={1}
            onChange={(v) => handleInputChange("holdingYears", v)}
            tickUnit=" yr"
          />

          <SliderRow
            label="Expected Appreciation %"
            value={input.appreciationRate}
            displayValue={`${input.appreciationRate}%`}
            min={-5}
            max={15}
            step={0.5}
            onChange={(v) => handleInputChange("appreciationRate", v)}
            tickUnit="%"
          />

          <SliderRow
            label="Tax Slab"
            value={input.taxSlab}
            displayValue={`${input.taxSlab}%`}
            min={0}
            max={30}
            step={5}
            onChange={(v) => handleInputChange("taxSlab", v)}
            tickUnit="%"
          />

          <SliderRow
            label="Inflation Rate"
            value={input.inflationRate}
            displayValue={`${input.inflationRate}%`}
            min={2}
            max={12}
            step={0.5}
            onChange={(v) => handleInputChange("inflationRate", v)}
            tickUnit="%"
          />
        </div>
      </div>

      {/* Right Panel — Results */}
      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <ConfidenceBadge inflationRate={input.inflationRate} />
            <ShareBar title="Forex Comparator — c7xai" />
          </div>

          <LieVsTruthPanel truth={truth} />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <MetricCard
              label={`Foreign Amount (${input.targetCurrency})`}
              value={output.finalForeignAmount}
              variant="neutral"
            />
            <MetricCard label="INR Value" value={output.finalINRValue} variant="neutral" />
            <MetricCard label="Capital Gains Tax" value={output.capitalGainsTax} variant="loss" />
            <MetricCard label="TCS Paid" value={output.tcsAmount} variant="loss" />
            <MetricCard label="Net Proceeds" value={output.netProceeds} variant="gain" />
            <MetricCard
              label="Real Value (Today’s ₹)"
              value={output.realValue}
              variant={isNegativeReal ? "loss" : "gain"}
            />
            <MetricCard
              label="Effective Return %"
              value={output.effectiveRate}
              variant={isNegativeReal ? "loss" : "gain"}
            />
          </div>

          {output.initialForeignAmount * (input.targetCurrency === "USD" ? 1 : input.exchangeRate / 83) > 250000 && (
            <div className="p-2 bg-warn/10 border border-warn/30 rounded-lg text-xs font-mono text-warn">
              Investment exceeds RBI LRS annual limit of $2,50,000. Additional documentation and approvals may be required.
            </div>
          )}

          {isNegativeReal && (
            <div className="p-2 bg-loss/10 border border-loss/30 rounded-lg text-xs font-mono text-loss">
              Effective return is negative after taxes, fees, and inflation. Your money loses purchasing power in this scenario.
            </div>
          )}

          <div className="text-xs text-text-secondary font-mono px-1">
            TCS: {formatINR(output.tcsAmount)} | Bank spread: {formatINR(output.bankSpread)} | Total deductions: {formatINR(output.totalDeductions)}
          </div>

          <div className="flex-1 min-h-0 bg-white rounded-lg border border-border shadow-sm p-4">
            <h3 className="text-xs font-semibold text-text-secondary mb-2">Investment Value vs Inflation</h3>
            <div className="w-full flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={output.yearlyData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="forexAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#9ca3af" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={(v) => `Y${v}`}
                    axisLine={{ stroke: "#1f2937" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={formatINRShort}
                    axisLine={{ stroke: "#1f2937" }}
                    tickLine={false}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #1f2937",
                      borderRadius: "8px",
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: "11px",
                    }}
                    labelFormatter={(v) => `Year ${v}`}
                    formatter={(value, name) => [formatINRShort(Number(value)), String(name)]}
                  />
                  <Area
                    type="monotone"
                    dataKey="inrValue"
                    stroke="#9ca3af"
                    strokeWidth={1}
                    fill="url(#forexAreaGrad)"
                    name="INR Value"
                    isAnimationActive={true}
                  />
                  <Bar
                    dataKey="capitalGainsTax"
                    fill="#f87171"
                    name="Tax"
                    isAnimationActive={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="realValue"
                    stroke="#6ee7b7"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                    name="Real Value"
                    isAnimationActive={true}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <WhyThisNumber assumptions={truth.assumptions} />

          <CalcExplainer>
            <p className="font-semibold text-text-primary">The truth about forex investments</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>
                Foreign investments have hidden costs: TCS on remittance, bank spread on conversion, and capital gains tax on returns.
              </li>
              <li>
                <span className="text-loss">Red dashed line</span> shows what your investment is truly worth after inflation erodes purchasing power.
              </li>
              <li>
                RBI caps overseas remittance at $2,50,000/year under LRS. Investments above this require additional approvals.
              </li>
              <li>
                Holding for more than 3 years qualifies for LTCG with indexation, significantly reducing your tax burden.
              </li>
            </ul>
          </CalcExplainer>
          <DownloadReportButton
            calculatorTitle="Forex Calculator"
            calculatorData={{
              "Foreign Amount": `${output.finalForeignAmount.toLocaleString("en-IN")} ${input.targetCurrency}`,
              "INR Value": formatINR(output.finalINRValue),
              "Capital Gains Tax": formatINR(output.capitalGainsTax),
              "Net Proceeds": formatINR(output.netProceeds),
              "Real Value": formatINR(output.realValue),
            }}
          />
        </div>
      </div>
    </div>
  );
}