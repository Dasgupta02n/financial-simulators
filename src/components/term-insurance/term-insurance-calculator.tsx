"use client";

import { useState, useMemo, useCallback } from "react";
import type { TermInsuranceInput } from "@/lib/calculators/term-insurance/types";
import { computeTermInsurance } from "@/lib/calculators/term-insurance/engine";
import { formatINR } from "@/lib/format";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { twMerge } from "tailwind-merge";
import { SliderRow } from "@/components/shared/slider-row";
import { ShareBar } from "@/components/shared/share-bar";
import { DownloadReportButton } from "@/components/shared/download-report-button";

const DEFAULT_INPUT: TermInsuranceInput = {
  annualIncome: 1200000,
  monthlyExpenses: 40000,
  outstandingLoans: 2000000,
  numberOfDependants: 2,
  yearsOfCoverage: 20,
  inflationRate: 6,
  existingInsuranceCover: 0,
  savingsInvestments: 500000,
};

function ResultRow({ label, value, highlight, subtext }: {
  label: string; value: string; highlight?: boolean; subtext?: string;
}) {
  return (
    <div className={`flex justify-between items-baseline py-2 border-b border-border ${highlight ? "text-gain" : "text-text-secondary"}`}>
      <div>
        <span className="text-xs">{label}</span>
        {subtext && <p className="text-[10px] text-text-muted font-mono mt-0.5">{subtext}</p>}
      </div>
      <span className={`text-sm font-mono font-semibold ${highlight ? "text-gain" : "text-text-primary"}`}>{value}</span>
    </div>
  );
}

export function TermInsuranceCalculator() {
  const [input, setInput] = useState<TermInsuranceInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof TermInsuranceInput>(key: K, value: TermInsuranceInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );

  const result = useMemo(() => computeTermInsurance(input), [input]);

  const coverShortfall = Math.max(0, result.totalRequired - input.existingInsuranceCover - input.savingsInvestments);
  const existingBarPercent = result.totalRequired > 0
    ? Math.min(100, Math.round((input.existingInsuranceCover / result.totalRequired) * 100))
    : 0;
  const savingsBarPercent = result.totalRequired > 0
    ? Math.min(100 - existingBarPercent, Math.round((input.savingsInvestments / result.totalRequired) * 100))
    : 0;
  const gapBarPercent = Math.max(0, 100 - existingBarPercent - savingsBarPercent);

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-border shadow-sm">
          <h2 className="text-sm font-semibold tracking-tight">Calculate Term Cover Needed</h2>
          <SliderRow label="Annual Income" value={input.annualIncome}
            displayValue={formatINR(input.annualIncome)}
            min={200000} max={50000000} step={100000}
            onChange={(v) => handleInputChange("annualIncome", v)} />
          <SliderRow label="Monthly Expenses" value={input.monthlyExpenses}
            displayValue={formatINR(input.monthlyExpenses)}
            min={5000} max={500000} step={1000}
            onChange={(v) => handleInputChange("monthlyExpenses", v)} />
          <SliderRow label="Outstanding Loans" value={input.outstandingLoans}
            displayValue={formatINR(input.outstandingLoans)}
            min={0} max={50000000} step={100000}
            onChange={(v) => handleInputChange("outstandingLoans", v)} />
          <SliderRow label="Number of Dependants" value={input.numberOfDependants}
            displayValue={String(input.numberOfDependants)}
            min={0} max={6} step={1}
            onChange={(v) => handleInputChange("numberOfDependants", v)} />
          <SliderRow label="Years of Coverage" value={input.yearsOfCoverage}
            displayValue={`${input.yearsOfCoverage} yrs`}
            min={5} max={40} step={1}
            onChange={(v) => handleInputChange("yearsOfCoverage", v)} tickUnit=" yr" />
          <SliderRow label="Inflation Rate (% p.a.)" value={input.inflationRate}
            displayValue={`${input.inflationRate}%`}
            min={2} max={15} step={0.5}
            onChange={(v) => handleInputChange("inflationRate", v)} tickUnit="%" />
          <SliderRow label="Existing Life Insurance" value={input.existingInsuranceCover}
            displayValue={formatINR(input.existingInsuranceCover)}
            min={0} max={50000000} step={100000}
            onChange={(v) => handleInputChange("existingInsuranceCover", v)} />
          <SliderRow label="Savings & Investments" value={input.savingsInvestments}
            displayValue={formatINR(input.savingsInvestments)}
            min={0} max={50000000} step={100000}
            onChange={(v) => handleInputChange("savingsInvestments", v)} />
        </div>
      </div>
      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <CalcExplainer>
            <p className="font-semibold text-text-primary">How to read</p>
            <p>The Human Life Value (HLV) method estimates the cover your family needs:</p>
            <ol className="list-decimal pl-5 space-y-0.5">
              <li>Inflate monthly expenses over the coverage period</li>
              <li>Add outstanding loans (immediate liability)</li>
              <li>Add emergency fund (6 months expenses)</li>
              <li>Subtract savings & investments</li>
              <li>Subtract existing life insurance cover</li>
            </ol>
            <p>The result is the additional term cover you should buy.</p>
          </CalcExplainer>

          <div className="p-4 bg-white rounded-lg border border-border shadow-sm">
            <h3 className="text-xs font-semibold text-text-primary mb-3">Cover Breakdown</h3>

            <ResultRow label="① Future Expenses (Inflated)"
              value={formatINR(result.futureExpenses)}
              subtext={`${input.yearsOfCoverage} years of expenses at ${input.inflationRate}% inflation`} />
            <ResultRow label="② Outstanding Loans"
              value={formatINR(input.outstandingLoans)} />
            <ResultRow label="③ Emergency Fund (6 months)"
              value={formatINR(result.emergencyFund)} />
            <ResultRow label="④ Total Required (①+②+③)"
              value={formatINR(result.totalRequired)}
              highlight={false} />
            <ResultRow label="Less: Savings & Investments"
              value={formatINR(input.savingsInvestments)} />
            <ResultRow label="Less: Existing Insurance Cover"
              value={formatINR(input.existingInsuranceCover)} />

            <div className="mt-3 pt-3 border-t-2 border-gain">
              <div className="flex justify-between items-center py-1">
                <div>
                  <span className="text-xs font-semibold text-text-primary">Additional Cover Needed</span>
                  <p className="text-[10px] text-text-muted font-mono">
                    {result.coverageAdequacyYears} years of expenses covered
                  </p>
                </div>
                <span className="text-base font-mono font-bold text-gain">{formatINR(result.coverNeeded)}</span>
              </div>
            </div>
          </div>

          {/* Visual bar: existing cover vs needed */}
          <div className="p-4 bg-white rounded-lg border border-border shadow-sm">
            <h3 className="text-xs font-semibold text-text-primary mb-2">Cover Adequacy</h3>
            <div className="w-full h-6 rounded-full overflow-hidden bg-border flex">
              {input.existingInsuranceCover > 0 && (
                <div
                  className="bg-gain/60 h-full flex items-center justify-center text-[10px] font-mono text-gain-foreground"
                  style={{ width: `${existingBarPercent}%` }}
                  title={`Existing cover: ${formatINR(input.existingInsuranceCover)}`}
                >
                  {existingBarPercent >= 8 ? `${existingBarPercent}%` : ""}
                </div>
              )}
              {input.savingsInvestments > 0 && (
                <div
                  className="bg-gain/30 h-full flex items-center justify-center text-[10px] font-mono text-text-secondary"
                  style={{ width: `${savingsBarPercent}%` }}
                  title={`Savings: ${formatINR(input.savingsInvestments)}`}
                >
                  {savingsBarPercent >= 8 ? `${savingsBarPercent}%` : ""}
                </div>
              )}
              <div
                className={twMerge(
                  "h-full flex items-center justify-center text-[10px] font-mono",
                  result.coverNeeded > 0 ? "bg-loss/40 text-loss" : "bg-gain/20 text-gain"
                )}
                style={{ width: `${gapBarPercent}%` }}
                title={`Gap: ${formatINR(result.coverNeeded)}`}
              >
                {gapBarPercent >= 8 ? `${gapBarPercent}%` : ""}
              </div>
            </div>
            <div className="flex gap-4 mt-2 text-[10px] text-text-muted font-mono">
              {input.existingInsuranceCover > 0 && (
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-sm bg-gain/60" />
                  Existing cover ({formatINR(input.existingInsuranceCover)})
                </span>
              )}
              {input.savingsInvestments > 0 && (
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-sm bg-gain/30" />
                  Savings ({formatINR(input.savingsInvestments)})
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className={twMerge(
                  "inline-block w-2 h-2 rounded-sm",
                  result.coverNeeded > 0 ? "bg-loss/40" : "bg-gain/20"
                )} />
                {result.coverNeeded > 0 ? `Gap (${formatINR(result.coverNeeded)})` : "Fully covered"}
              </span>
            </div>
          </div>

          {/* Premium estimate */}
          <div className="p-4 bg-white rounded-lg border border-border shadow-sm">
            <h3 className="text-xs font-semibold text-text-primary mb-2">Estimated Monthly Premium</h3>
            <div className="flex justify-between items-baseline py-1">
              <span className="text-xs text-text-secondary">Range (30-yr non-smoker)</span>
              <span className="text-sm font-mono font-semibold text-text-primary">
                {formatINR(result.monthlyPremiumLow)} — {formatINR(result.monthlyPremiumHigh)}
              </span>
            </div>
            <div className="flex justify-between items-baseline py-1 border-b border-border">
              <span className="text-xs text-text-secondary">Premium as % of income</span>
              <span className="text-sm font-mono font-semibold text-text-primary">{result.premiumAsPercentOfIncome}%</span>
            </div>
            <p className="text-[10px] text-text-muted font-mono mt-2">
              Approx ₹800-1200 per ₹1Cr cover/year. Actual premiums vary by age, health, insurer.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-3 mt-auto">
            <span className="text-xs text-text-muted font-mono">Share:</span>
            <ShareBar title="Term Insurance Calculator — c7xai" />
          </div>
          <DownloadReportButton
            calculatorTitle="Term Insurance Calculator"
            calculatorData={{
              "Total Cover Needed": formatINR(result.totalRequired),
              "Additional Cover Needed": formatINR(result.coverNeeded),
              "Future Expenses": formatINR(result.futureExpenses),
              "Emergency Fund": formatINR(result.emergencyFund),
              "Monthly Premium Range": `${formatINR(result.monthlyPremiumLow)} — ${formatINR(result.monthlyPremiumHigh)}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}