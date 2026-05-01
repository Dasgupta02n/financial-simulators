"use client";

import { useState, useMemo, useCallback } from "react";
import type { DepreciationInput, VehicleType } from "@/lib/calculators/depreciation/types";
import { computeDepreciation } from "@/lib/calculators/depreciation/engine";
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

const VEHICLE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: "car", label: "Car" },
  { value: "bike", label: "Bike" },
  { value: "commercial", label: "Commercial" },
];

const DEFAULT_INPUT: DepreciationInput = {
  vehicleType: "car",
  purchasePrice: 1000000,
  ownershipYears: 8,
  isEV: false,
  loanAmount: 500000,
  loanRate: 9,
  loanTenureYears: 5,
  fuelCostMonthly: 5000,
  insuranceAnnual: 30000,
  maintenanceAnnual: 15000,
  registrationCost: 50000,
  inflationRate: 6,
  incomeAnnual: 800000,
};

function truthFromDepreciation(result: ReturnType<typeof computeDepreciation>, input: DepreciationInput): TruthResult {
  return {
    grossLabel: "Purchase price",
    grossValue: result.purchasePrice,
    realLabel: "Total cost of ownership",
    realValue: result.netCostAfterTax,
    deductions: [
      { label: "Fuel costs (inflated)", amount: result.totalFuelCost },
      { label: "Insurance (inflated)", amount: result.totalInsuranceCost },
      { label: "Maintenance (inflated)", amount: result.totalMaintenanceCost },
      { label: "Loan interest", amount: result.totalLoanInterest },
      { label: "Registration", amount: result.registrationCost },
      { label: "Less: Resale value", amount: -result.estimatedResaleValue },
      ...(input.isEV && input.incomeAnnual <= 50_00_000
        ? [{ label: "Section 80EEB saved", amount: -Math.min(result.totalLoanInterest, 150000) * 0.3 }]
        : []),
    ],
    assumptions: [
      `15% WDV depreciation per year (Income Tax Act)`,
      `Fuel inflation: 8%/year`,
      input.isEV ? "Section 80EEB: ₹1.5L EV loan interest deduction" : "No EV deduction",
      `Inflation: ${input.inflationRate}% (RBI 10-yr avg)`,
    ],
    taxRegime: `FY ${FY_YEAR}`,
    inflationRate: input.inflationRate,
    lastUpdated: LAST_UPDATED,
  };
}

export function DepreciationCalculator() {
  const [input, setInput] = useState<DepreciationInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof DepreciationInput>(key: K, value: DepreciationInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));
    },
    []
  );
  const output = useMemo(() => computeDepreciation(input), [input]);
  const truth = truthFromDepreciation(output, input);

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-white shadow-sm rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">Configure Vehicle</h2>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary">Vehicle Type</span>
            <div className="flex gap-2">
              {VEHICLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={twMerge(
                    "px-3 py-1.5 text-xs rounded-md font-mono transition-colors",
                    input.vehicleType === opt.value
                      ? "bg-sienna/10 text-sienna border border-sienna/30"
                      : "bg-surface-hover text-text-secondary border border-border"
                  )}
                  onClick={() => handleInputChange("vehicleType", opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <SliderRow
            label="Purchase Price"
            value={input.purchasePrice}
            displayValue={formatINR(input.purchasePrice)}
            min={50000}
            max={10000000}
            step={50000}
            onChange={(v) => handleInputChange("purchasePrice", v)}
          />
          <SliderRow
            label="Ownership Years"
            value={input.ownershipYears}
            displayValue={`${input.ownershipYears} yrs`}
            min={1}
            max={15}
            step={1}
            onChange={(v) => handleInputChange("ownershipYears", v)}
            tickUnit=" yr"
          />

          <div className="flex items-center gap-2">
            <button
              className={twMerge(
                "px-3 py-1.5 text-xs rounded-md font-mono transition-colors",
                input.isEV
                  ? "bg-green-50 text-green-700 border border-green-300"
                  : "bg-surface-hover text-text-secondary border border-border"
              )}
              onClick={() => handleInputChange("isEV", !input.isEV)}
            >
              {input.isEV ? "EV ✓" : "Not EV"}
            </button>
            <span className="text-[10px] text-text-muted">
              {input.isEV ? "Section 80EEB applies (₹1.5L deduction)" : "Toggle if electric vehicle"}
            </span>
          </div>

          <SliderRow
            label="Loan Amount"
            value={input.loanAmount}
            displayValue={formatINR(input.loanAmount)}
            min={0}
            max={10000000}
            step={50000}
            onChange={(v) => handleInputChange("loanAmount", v)}
          />
          <SliderRow
            label="Loan Rate"
            value={input.loanRate}
            displayValue={`${input.loanRate}%`}
            min={5}
            max={18}
            step={0.5}
            onChange={(v) => handleInputChange("loanRate", v)}
            tickUnit="%"
          />
          <SliderRow
            label="Loan Tenure"
            value={input.loanTenureYears}
            displayValue={`${input.loanTenureYears} yrs`}
            min={1}
            max={7}
            step={1}
            onChange={(v) => handleInputChange("loanTenureYears", v)}
            tickUnit=" yr"
          />
          <SliderRow
            label="Fuel Cost /month"
            value={input.fuelCostMonthly}
            displayValue={formatINR(input.fuelCostMonthly)}
            min={0}
            max={50000}
            step={500}
            onChange={(v) => handleInputChange("fuelCostMonthly", v)}
          />
          <SliderRow
            label="Insurance /year"
            value={input.insuranceAnnual}
            displayValue={formatINR(input.insuranceAnnual)}
            min={0}
            max={500000}
            step={5000}
            onChange={(v) => handleInputChange("insuranceAnnual", v)}
          />
          <SliderRow
            label="Maintenance /year"
            value={input.maintenanceAnnual}
            displayValue={formatINR(input.maintenanceAnnual)}
            min={0}
            max={200000}
            step={5000}
            onChange={(v) => handleInputChange("maintenanceAnnual", v)}
          />
          <SliderRow
            label="Registration Cost"
            value={input.registrationCost}
            displayValue={formatINR(input.registrationCost)}
            min={0}
            max={500000}
            step={5000}
            onChange={(v) => handleInputChange("registrationCost", v)}
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
          <SliderRow
            label="Annual Income"
            value={input.incomeAnnual}
            displayValue={formatINR(input.incomeAnnual)}
            min={200000}
            max={5000000}
            step={50000}
            onChange={(v) => handleInputChange("incomeAnnual", v)}
          />
        </div>
      </div>

      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <ConfidenceBadge inflationRate={input.inflationRate} />
            <ShareBar title="Depreciation & TCO Calculator — c7xai" />
          </div>

          <LieVsTruthPanel truth={truth} />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <MetricCard label="Purchase Price" value={output.purchasePrice} variant="neutral" />
            <MetricCard label="Total Cost of Ownership" value={output.totalCostOfOwnership} variant="loss" />
            <MetricCard label="Estimated Resale" value={output.estimatedResaleValue} variant="gain" />
            <MetricCard label="Total Fuel Cost" value={output.totalFuelCost} variant="loss" />
            <MetricCard label="Loan Interest" value={output.totalLoanInterest} variant="loss" />
            <MetricCard
              label="Net Cost After Tax"
              value={output.netCostAfterTax}
              variant="loss"
            />
          </div>

          {input.isEV && input.incomeAnnual <= 50_00_000 && (
            <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-xs font-mono text-green-700">
              Section 80EEB: You can deduct up to ₹1.5L/year in EV loan interest, saving ~₹{formatINR(output.section80EEBDeduction * 0.3)}/year in tax.
            </div>
          )}

          <div className="flex-1 min-h-0 bg-white rounded-lg border border-border shadow-sm p-4">
            <h3 className="text-xs font-semibold text-text-secondary mb-2">Total Cost of Ownership Over Time</h3>
            <div className="w-full flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={output.yearlyData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#f87171" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={(v) => `Y${v}`}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                    tickFormatter={formatINRShort}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                    width={55}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: "11px",
                    }}
                    labelFormatter={(v) => `Year ${v}`}
                    formatter={(value, name) => [formatINRShort(Number(value)), String(name)]}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeCost"
                    stroke="#f87171"
                    strokeWidth={2}
                    fill="url(#costGrad)"
                    name="Total Cost"
                    isAnimationActive={true}
                  />
                  <Bar
                    dataKey="fuelCost"
                    stackId="costs"
                    fill="#fbbf24"
                    fillOpacity={0.8}
                    name="Fuel"
                    isAnimationActive={true}
                  />
                  <Bar
                    dataKey="insuranceCost"
                    stackId="costs"
                    fill="#60a5fa"
                    fillOpacity={0.8}
                    name="Insurance"
                    isAnimationActive={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="resaleValue"
                    stroke="#6ee7b7"
                    strokeWidth={2}
                    dot={false}
                    name="Resale Value"
                    isAnimationActive={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="realCumulativeCost"
                    stroke="#f87171"
                    strokeWidth={1.5}
                    strokeDasharray="6 4"
                    dot={false}
                    name="Real Cost"
                    isAnimationActive={true}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <WhyThisNumber assumptions={truth.assumptions} />

          <CalcExplainer>
            <p className="font-semibold text-text-primary">The truth about vehicle ownership costs</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>The purchase price is just the beginning — fuel, insurance, maintenance, and loan interest add up to 2-3x the sticker price.</li>
              <li><span className="text-loss">Red area</span> — cumulative cost of ownership grows far faster than most expect.</li>
              <li><span className="text-gain">Green line</span> — resale value drops steeply. After 8 years, a car retains only 18-22% of its value.</li>
              <li>EV owners with income below ₹50L can claim Section 80EEB deduction on loan interest.</li>
            </ul>
          </CalcExplainer>
          <DownloadReportButton
            calculatorTitle="Depreciation Calculator"
            calculatorData={{
              "Purchase Price": formatINR(output.purchasePrice),
              "Total Cost of Ownership": formatINR(output.totalCostOfOwnership),
              "Estimated Resale": formatINR(output.estimatedResaleValue),
              "Net Cost After Tax": formatINR(output.netCostAfterTax),
              "Total Fuel Cost": formatINR(output.totalFuelCost),
            }}
          />
        </div>
      </div>
    </div>
  );
}