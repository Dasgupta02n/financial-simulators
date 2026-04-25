"use client";

import { useState, useMemo, useCallback } from "react";
import type { RealEstateInput, RealEstateOutput, PropertyType, OwnershipType } from "@/lib/calculators/real-estate/types";
import { STAMP_DUTY } from "@/lib/calculators/real-estate/types";
import { computeRealEstate } from "@/lib/calculators/real-estate/engine";
import { formatINR, formatINRShort } from "@/lib/format";
import { SliderRow } from "@/components/shared/slider-row";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareBar } from "@/components/shared/share-bar";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MetricCard } from "@/components/sip/metric-card";
import { twMerge } from "tailwind-merge";
import type { TruthResult } from "@/lib/truth/types";

const DEFAULT_INPUT: RealEstateInput = {
  propertyValue: 10000000,
  propertyType: "residential",
  ownershipType: "freehold",
  state: "maharashtra",
  holdingYears: 10,
  appreciationRate: 8,
  rentalYield: 2.5,
  maintenanceMonthly: 5000,
  propertyTaxAnnual: 50000,
  loanAmount: 0,
  loanRate: 8.5,
  loanTenureYears: 20,
  inflationRate: 6,
  taxSlab: 30,
};

const STATE_OPTIONS = [
  { value: "maharashtra", label: "MH" },
  { value: "karnataka", label: "KA" },
  { value: "delhi", label: "DL" },
  { value: "tamil_nadu", label: "TN" },
  { value: "telangana", label: "TS" },
  { value: "gujarat", label: "GJ" },
  { value: "rajasthan", label: "RJ" },
  { value: "west_bengal", label: "WB" },
  { value: "haryana", label: "HR" },
  { value: "uttar_pradesh", label: "UP" },
];

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land" },
  { value: "virtual", label: "Virtual" },
];

const OWNERSHIP_TYPES: { value: OwnershipType; label: string }[] = [
  { value: "freehold", label: "Freehold" },
  { value: "leasehold", label: "Leasehold" },
];

function truthFromRealEstate(result: RealEstateOutput, input: RealEstateInput): TruthResult {
  return {
    grossLabel: "Projected property value",
    grossValue: result.finalPropertyValue,
    realLabel: "Real purchasing power",
    realValue: result.realValueAfterInflation,
    deductions: [
      { label: "Stamp duty & registration", amount: result.stampDuty + result.registrationCost },
      { label: "Capital gains tax", amount: result.capitalGainsTax },
      { label: `Inflation erosion (${input.inflationRate}%)`, amount: result.finalPropertyValue - result.realValueAfterInflation },
    ],
    assumptions: [
      `Stamp duty: ${STAMP_DUTY[input.state] || 6}% (${input.state})`,
      `Inflation: ${input.inflationRate}% (RBI 10-yr avg)`,
      input.ownershipType === "leasehold" ? "Leasehold reduces appreciation by ~1.5%" : "Freehold property",
    ],
    taxRegime: "FY 2025-26",
    inflationRate: input.inflationRate,
    lastUpdated: "2026-04-25",
  };
}

export function RealEstateCalculator() {
  const [input, setInput] = useState<RealEstateInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof RealEstateInput>(key: K, value: RealEstateInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );
  const output = useMemo(() => computeRealEstate(input), [input]);
  const truth = useMemo(() => truthFromRealEstate(output, input), [output, input]);
  const isNegativeReal = output.realROI < 0;

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      {/* Left panel — sliders */}
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-white shadow-sm rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">Configure Property</h2>

          <SliderRow label="Property Value" value={input.propertyValue} displayValue={formatINR(input.propertyValue)}
            min={100000} max={100000000} step={100000} onChange={(v) => handleInputChange("propertyValue", v)} />

          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary">Property Type</span>
            <div className="flex gap-2 flex-wrap">
              {PROPERTY_TYPES.map((opt) => (
                <button key={opt.value} className={twMerge(
                  "px-3 py-1.5 text-xs rounded-md font-mono transition-colors",
                  input.propertyType === opt.value
                    ? "bg-sienna/10 text-sienna border border-sienna/30"
                    : "bg-surface-hover text-text-secondary border border-border"
                )} onClick={() => handleInputChange("propertyType", opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary">Ownership</span>
            <div className="flex gap-2">
              {OWNERSHIP_TYPES.map((opt) => (
                <button key={opt.value} className={twMerge(
                  "px-3 py-1.5 text-xs rounded-md font-mono transition-colors",
                  input.ownershipType === opt.value
                    ? "bg-sienna/10 text-sienna border border-sienna/30"
                    : "bg-surface-hover text-text-secondary border border-border"
                )} onClick={() => handleInputChange("ownershipType", opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary">State (stamp duty)</span>
            <div className="flex gap-1 flex-wrap">
              {STATE_OPTIONS.map((opt) => (
                <button key={opt.value} className={twMerge(
                  "px-2 py-1 text-[10px] rounded font-mono transition-colors",
                  input.state === opt.value
                    ? "bg-sienna/10 text-sienna border border-sienna/30"
                    : "bg-surface-hover text-text-secondary border border-border"
                )} onClick={() => handleInputChange("state", opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <SliderRow label="Holding Period" value={input.holdingYears} displayValue={`${input.holdingYears} yrs`}
            min={1} max={30} step={1} onChange={(v) => handleInputChange("holdingYears", v)} tickUnit=" yr" />
          <SliderRow label="Appreciation Rate" value={input.appreciationRate} displayValue={`${input.appreciationRate}%`}
            min={0} max={20} step={0.5} onChange={(v) => handleInputChange("appreciationRate", v)} tickUnit="%" />
          <SliderRow label="Rental Yield" value={input.rentalYield} displayValue={`${input.rentalYield}%`}
            min={0} max={10} step={0.25} onChange={(v) => handleInputChange("rentalYield", v)} tickUnit="%" />
          <SliderRow label="Maintenance (Monthly)" value={input.maintenanceMonthly} displayValue={formatINR(input.maintenanceMonthly)}
            min={0} max={50000} step={500} onChange={(v) => handleInputChange("maintenanceMonthly", v)} />
          <SliderRow label="Property Tax (Annual)" value={input.propertyTaxAnnual} displayValue={formatINR(input.propertyTaxAnnual)}
            min={0} max={500000} step={1000} onChange={(v) => handleInputChange("propertyTaxAnnual", v)} />
          <SliderRow label="Loan Amount" value={input.loanAmount} displayValue={formatINR(input.loanAmount)}
            min={0} max={50000000} step={100000} onChange={(v) => handleInputChange("loanAmount", v)} />
          <SliderRow label="Loan Rate" value={input.loanRate} displayValue={`${input.loanRate}%`}
            min={4} max={15} step={0.25} onChange={(v) => handleInputChange("loanRate", v)} tickUnit="%" />
          <SliderRow label="Loan Tenure" value={input.loanTenureYears} displayValue={`${input.loanTenureYears} yrs`}
            min={1} max={30} step={1} onChange={(v) => handleInputChange("loanTenureYears", v)} tickUnit=" yr" />
          <SliderRow label="Inflation Rate" value={input.inflationRate} displayValue={`${input.inflationRate}%`}
            min={2} max={12} step={0.5} onChange={(v) => handleInputChange("inflationRate", v)} tickUnit="%" />
          <SliderRow label="Tax Slab" value={input.taxSlab} displayValue={`${input.taxSlab}%`}
            min={0} max={30} step={5} onChange={(v) => handleInputChange("taxSlab", v)} tickUnit="%" />
        </div>
      </div>

      {/* Right panel — results */}
      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <ConfidenceBadge inflationRate={input.inflationRate} />
            <ShareBar title="Real Estate Comparator — c7xai" />
          </div>

          <LieVsTruthPanel truth={truth} />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <MetricCard label="Property Value (Final)" value={output.finalPropertyValue} variant="neutral" />
            <MetricCard label="Net Proceeds After Tax" value={output.netProceedsAfterTax} variant="gain" />
            <MetricCard label="Real Value (Today's ₹)" value={output.realValueAfterInflation} variant={isNegativeReal ? "loss" : "gain"} />
            <MetricCard label="Total Cost of Ownership" value={output.totalCostOfOwnership} variant="neutral" />
            <MetricCard label="ROI" value={output.roi} variant="neutral" />
            <MetricCard label="Real ROI" value={output.realROI} variant={isNegativeReal ? "loss" : "gain"} />
          </div>

          {isNegativeReal && (
            <div className="p-2 bg-loss/10 border border-loss/30 rounded-lg text-xs font-mono text-loss">
              Real ROI is negative — after inflation, taxes, and hidden costs, your property actually loses purchasing power.
            </div>
          )}

          <div className="text-xs text-text-secondary font-mono px-1">
            Stamp duty: {formatINR(output.stampDuty)} · Registration: {formatINR(output.registrationCost)} · Capital gains tax: {formatINR(output.capitalGainsTax)}
          </div>

          <div className="flex-1 min-h-0 bg-white rounded-lg border border-border shadow-sm p-4">
            <h3 className="text-xs font-semibold text-text-secondary mb-2">Property Value vs Real Value</h3>
            <div className="w-full flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={output.yearlyData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="propertyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.3} />
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
                  <Area type="monotone" dataKey="propertyValue" stroke="#6ee7b7" strokeWidth={1}
                    fill="url(#propertyGrad)" name="Property Value" isAnimationActive={true} />
                  <Line type="monotone" dataKey="realValue" stroke="#f87171" strokeWidth={2}
                    strokeDasharray="6 4" dot={false} name="Real Value" isAnimationActive={true} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <WhyThisNumber assumptions={truth.assumptions} />

          <CalcExplainer>
            <p className="font-semibold text-text-primary">The truth about real estate returns</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Brokers quote appreciation rates, but stamp duty, registration, and maintenance silently drain your gains.</li>
              <li><span className="text-loss">Red dashed line</span> — what your property can actually buy after inflation eats into nominal gains.</li>
              <li>Capital gains tax with indexation applies for holdings &gt; 2 years. Short-term gains are taxed at your slab rate.</li>
              <li>Rental yield offsets some costs, but maintenance and property tax erode it further.</li>
            </ul>
          </CalcExplainer>
        </div>
      </div>
    </div>
  );
}