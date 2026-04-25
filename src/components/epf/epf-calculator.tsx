"use client";

import { useState, useMemo, useCallback } from "react";
import type { EPFInput } from "@/lib/calculators/epf/types";
import { computeEPF } from "@/lib/calculators/epf/engine";
import { formatINR } from "@/lib/format";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareBar } from "@/components/shared/share-bar";
import { truthFromEPF } from "@/lib/truth/truth-data-adapter";
import { SliderRow } from "@/components/shared/slider-row";

const DEFAULT_INPUT: EPFInput = {
  monthlyBasicSalary: 50000,
  employeeRate: 12,
  employerEpfRate: 3.67,
  employerEpsRate: 8.33,
  ageOfEntry: 25,
  retirementAge: 58,
  annualSalaryIncrease: 6,
  epfInterestRate: 8.25,
  inflationRate: 6,
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

export function EPFCalculator() {
  const [input, setInput] = useState<EPFInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof EPFInput>(key: K, value: EPFInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );

  const result = useMemo(() => computeEPF(input), [input]);

  const years = Math.max(1, input.retirementAge - input.ageOfEntry);

  const employeePercent = result.totalCorpusAtRetirement > 0
    ? ((result.totalEmployeeContribution / result.totalCorpusAtRetirement) * 100).toFixed(0)
    : "0";
  const employerPercent = result.totalCorpusAtRetirement > 0
    ? ((result.totalEmployerEpfContribution / result.totalCorpusAtRetirement) * 100).toFixed(0)
    : "0";
  const interestPercent = result.totalCorpusAtRetirement > 0
    ? ((result.totalInterestEarned / result.totalCorpusAtRetirement) * 100).toFixed(0)
    : "0";

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      {/* Sliders */}
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-white shadow-sm rounded-lg border border-border">
          <h2 className="text-sm font-semibold tracking-tight">Calculate EPF Corpus</h2>
          <SliderRow label="Monthly Basic Salary" value={input.monthlyBasicSalary}
            displayValue={formatINR(input.monthlyBasicSalary)}
            min={5000} max={500000} step={1000}
            onChange={(v) => handleInputChange("monthlyBasicSalary", v)} />
          <SliderRow label="Employee PF Rate" value={input.employeeRate}
            displayValue={`${input.employeeRate}%`}
            min={1} max={20} step={0.5}
            onChange={(v) => handleInputChange("employeeRate", v)} tickUnit="%" />
          <SliderRow label="Employer EPF Rate" value={input.employerEpfRate}
            displayValue={`${input.employerEpfRate}%`}
            min={1} max={15} step={0.01}
            onChange={(v) => handleInputChange("employerEpfRate", v)} tickUnit="%" />
          <SliderRow label="Employer EPS Rate" value={input.employerEpsRate}
            displayValue={`${input.employerEpsRate}%`}
            min={1} max={15} step={0.01}
            onChange={(v) => handleInputChange("employerEpsRate", v)} tickUnit="%" />
          <SliderRow label="Age of Entry" value={input.ageOfEntry}
            displayValue={`${input.ageOfEntry} yrs`}
            min={18} max={55} step={1}
            onChange={(v) => handleInputChange("ageOfEntry", v)} tickUnit=" yr" />
          <SliderRow label="Retirement Age" value={input.retirementAge}
            displayValue={`${input.retirementAge} yrs`}
            min={40} max={65} step={1}
            onChange={(v) => handleInputChange("retirementAge", v)} tickUnit=" yr" />
          <SliderRow label="Annual Salary Increase" value={input.annualSalaryIncrease}
            displayValue={`${input.annualSalaryIncrease}%`}
            min={0} max={20} step={0.5}
            onChange={(v) => handleInputChange("annualSalaryIncrease", v)} tickUnit="%" />
          <SliderRow label="EPF Interest Rate" value={input.epfInterestRate}
            displayValue={`${input.epfInterestRate}%`}
            min={5} max={12} step={0.25}
            onChange={(v) => handleInputChange("epfInterestRate", v)} tickUnit="%" />
          <SliderRow label="Inflation Rate" value={input.inflationRate}
            displayValue={`${input.inflationRate}%`}
            min={0} max={15} step={0.5}
            onChange={(v) => handleInputChange("inflationRate", v)} tickUnit="%" />
        </div>
      </div>

      {/* Results */}
      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <ConfidenceBadge inflationRate={input.inflationRate} />
            <ShareBar title="EPF Calculator — c7xai" />
          </div>
          <LieVsTruthPanel truth={truthFromEPF({ totalCorpusAtRetirement: result.totalCorpusAtRetirement, totalEmployeeContribution: result.totalEmployeeContribution, totalInterestEarned: result.totalInterestEarned }, input.inflationRate)} />

          {/* Monthly contribution summary */}
          <div className="p-4 bg-white rounded-lg border border-border shadow-sm">
            <h3 className="text-xs font-semibold text-text-primary mb-3">Monthly Contributions</h3>
            <ResultRow label="Employee Contribution"
              value={formatINR(result.monthlyEmployeeContribution)} />
            <ResultRow label="Employer EPF (to savings)"
              value={formatINR(result.monthlyEmployerEpfContribution)}
              subtext={`${input.employerEpfRate}% of basic`} />
            <ResultRow label="Employer EPS (to pension)"
              value={formatINR(result.monthlyEmployerEpsContribution)}
              subtext={`${input.employerEpsRate}% of basic, capped at ₹15,000`} />
          </div>

          {/* Corpus breakdown */}
          <div className="p-4 bg-white rounded-lg border border-border shadow-sm">
            <h3 className="text-xs font-semibold text-text-primary mb-3">Corpus at Retirement ({years} years)</h3>
            <ResultRow label="Total Employee Contribution"
              value={formatINR(result.totalEmployeeContribution)}
              subtext={`${employeePercent}% of corpus`} />
            <ResultRow label="Total Employer EPF"
              value={formatINR(result.totalEmployerEpfContribution)}
              subtext={`${employerPercent}% of corpus`} />
            <ResultRow label="Total Interest Earned"
              value={formatINR(result.totalInterestEarned)}
              subtext={`${interestPercent}% of corpus`} />

            <div className="mt-3 pt-3 border-t-2 border-gain">
              <div className="flex justify-between items-center py-1">
                <div>
                  <span className="text-xs font-semibold text-text-primary">Total EPF Corpus at Retirement</span>
                  <p className="text-[10px] text-text-muted font-mono">Employee + Employer EPF + Interest</p>
                </div>
                <span className="text-base font-mono font-bold text-gain">{formatINR(result.totalCorpusAtRetirement)}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-border/50">
                <div className="flex justify-between items-center py-1">
                  <div>
                    <span className="text-xs text-text-secondary">Real Purchasing Power (inflation-adjusted)</span>
                    <p className="text-[10px] text-text-muted font-mono">At {input.inflationRate}% avg inflation</p>
                  </div>
                  <span className="text-sm font-mono font-semibold text-loss">{formatINR(result.realCorpusAtRetirement)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Year-by-year growth chart */}
          <div className="p-4 bg-white rounded-lg border border-border shadow-sm">
            <h3 className="text-xs font-semibold text-text-primary mb-3">Year-by-Year Growth</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono">
                <thead>
                  <tr className="text-text-muted border-b border-border">
                    <th className="text-left py-1.5 pr-2">Yr</th>
                    <th className="text-right py-1.5 pr-2">Age</th>
                    <th className="text-right py-1.5 pr-2">Monthly Basic</th>
                    <th className="text-right py-1.5 pr-2">Year Deposit</th>
                    <th className="text-right py-1.5 pr-2">Interest</th>
                    <th className="text-right py-1.5">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="border-b border-border/50 hover:bg-border/20">
                      <td className="py-1.5 pr-2 text-text-secondary">{row.year}</td>
                      <td className="py-1.5 pr-2 text-right text-text-secondary">{row.age}</td>
                      <td className="py-1.5 pr-2 text-right">{formatINR(row.monthlyBasic)}</td>
                      <td className="py-1.5 pr-2 text-right">{formatINR(row.totalYearContribution)}</td>
                      <td className="py-1.5 pr-2 text-right text-gain">{formatINR(row.interestEarned)}</td>
                      <td className="py-1.5 text-right font-semibold">{formatINR(row.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <WhyThisNumber assumptions={truthFromEPF({ totalCorpusAtRetirement: result.totalCorpusAtRetirement, totalEmployeeContribution: result.totalEmployeeContribution, totalInterestEarned: result.totalInterestEarned }, input.inflationRate).assumptions} />
          <CalcExplainer>
            <p className="font-semibold text-text-primary">The truth about EPF</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Your EPF corpus at retirement looks large, but its real purchasing power is far less. Inflation silently erodes it every year.</li>
              <li>EPF is tax-free if withdrawn after 5 years of continuous service — but that tax-free status doesn&apos;t protect against inflation.</li>
              <li>EPS contributions fund a monthly pension, not your lump-sum corpus. The pension itself is taxable.</li>
            </ul>
          </CalcExplainer>
        </div>
      </div>
    </div>
  );
}