"use client";

import type { AmortizationRow } from "@/lib/calculators/emi/types";
import { MetricCard } from "@/components/sip/metric-card";
import { AmortizationChart } from "./amortization-chart";
import { CrossoverChart } from "./crossover-chart";
import { formatINR } from "@/lib/format";
import { CalcExplainer } from "@/components/shared/calc-explainer";

interface ResultsPanelProps {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  prepaidTotalInterest: number;
  prepaidSavedInterest: number;
  prepaidMonthsSaved: number;
  sipCorpusAtLoanEnd: number;
  sipInvestedAtLoanEnd: number;
  crossoverMonth: number | null;
  amortization: AmortizationRow[];
  extraCash: number;
  interestRate: number;
}

export function ResultsPanel({
  emi,
  totalInterest,
  totalPayment,
  prepaidTotalInterest,
  prepaidSavedInterest,
  prepaidMonthsSaved,
  sipCorpusAtLoanEnd,
  sipInvestedAtLoanEnd,
  crossoverMonth,
  amortization,
  extraCash,
  interestRate,
}: ResultsPanelProps) {
  return (
    <div className="flex flex-col gap-3 min-h-0">
      <CalcExplainer>
        <p className="font-semibold text-text-primary">EMI Calculator</p>
        <p>Breaks down your loan into interest vs principal each month, and answers: should you prepay or invest extra cash?</p>
        <ul className="list-disc pl-5 space-y-0.5">
          <li><span className="text-text-primary">Monthly EMI</span> — fixed monthly payment.</li>
          <li><span className="text-text-primary">Total Interest</span> — total bank charges over the full loan.</li>
          <li><span className="text-text-primary">Interest Saved (Prepay)</span> — interest avoided by prepaying.</li>
          <li><span className="text-text-primary">Months Saved</span> — months earlier you become debt-free.</li>
          <li><span className="text-text-primary">SIP Corpus</span> — value of extra cash if invested instead.</li>
        </ul>
      </CalcExplainer>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        <MetricCard label="Monthly EMI" value={emi} variant="neutral" />
        <MetricCard label="Total Interest" value={totalInterest} variant="loss" />
        <MetricCard label="Total Payment" value={totalPayment} variant="neutral" />
        <MetricCard label="Interest Saved (Prepay)" value={prepaidSavedInterest} variant="gain" />
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-text-secondary font-mono">
            Months Saved
          </span>
          <span className="text-2xl font-mono font-semibold text-gain">
            {prepaidMonthsSaved}
          </span>
        </div>
        <MetricCard label="SIP Corpus at Loan End" value={sipCorpusAtLoanEnd} variant="gain" />
      </div>

      {extraCash > 0 && (
        <div className="text-xs text-text-secondary font-mono px-1 space-y-1">
          <div>
            Prepaid interest: {formatINR(prepaidTotalInterest)} vs Standard: {formatINR(totalInterest)}
          </div>
          <div>
            SIP invested: {formatINR(sipInvestedAtLoanEnd)} → Corpus: {formatINR(sipCorpusAtLoanEnd)}
          </div>
          {crossoverMonth ? (
            <div className="text-warn">
              Crossover at Month {crossoverMonth}: SIP corpus exceeds prepayment savings
            </div>
          ) : (
            <div className="text-text-secondary">
              No crossover within loan tenure — prepayment saves more than SIP earns
            </div>
          )}
        </div>
      )}

      <div className="bg-surface rounded-lg border border-border p-3">
        <h3 className="text-xs font-semibold text-text-secondary mb-2">Amortization Schedule</h3>
        <div className="flex-1 min-h-[220px]">
          <AmortizationChart data={amortization} />
        </div>
      </div>

      {extraCash > 0 && (
        <div className="bg-surface rounded-lg border border-border p-3">
          <h3 className="text-xs font-semibold text-text-secondary mb-2">
            SIP vs Prepayment Crossover
          </h3>
          <div className="flex-1 min-h-[220px]">
            <CrossoverChart data={amortization} crossoverMonth={crossoverMonth} interestRate={interestRate} />
          </div>
        </div>
      )}
    </div>
  );
}