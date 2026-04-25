"use client";

import type { AmortizationRow } from "@/lib/calculators/emi/types";
import { MetricCard } from "@/components/sip/metric-card";
import { AmortizationChart } from "./amortization-chart";
import { CrossoverChart } from "./crossover-chart";
import { formatINR } from "@/lib/format";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { LieVsTruthPanel } from "@/components/shared/lie-vs-truth-panel";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { WhyThisNumber } from "@/components/shared/why-this-number";
import { ShareButton } from "@/components/shared/share-button";
import { truthFromEMI } from "@/lib/truth/truth-data-adapter";

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
  const truth = truthFromEMI({ emi, totalPayment, totalInterest, loanAmount: totalPayment - totalInterest }, 6);

  return (
    <div className="flex flex-col gap-3 min-h-0">
      <div className="flex items-center justify-between shrink-0">
        <ConfidenceBadge inflationRate={6} />
        <ShareButton title="EMI Calculator — c7xai" />
      </div>
      <LieVsTruthPanel truth={truth} />
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
      <WhyThisNumber assumptions={truth.assumptions} />
      <CalcExplainer>
        <p className="font-semibold text-text-primary">The truth about EMI</p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>The bank shows you the EMI — but total interest is what they earn. Your ₹50L loan can cost ₹55L+ in interest alone.</li>
          <li>Prepaying early saves the most because interest is front-loaded. Even small prepayments compound into large savings.</li>
          <li>If investing extra cash earns more than the loan interest rate, SIP beats prepayment. The crossover point tells you when.</li>
        </ul>
      </CalcExplainer>
    </div>
  );
}