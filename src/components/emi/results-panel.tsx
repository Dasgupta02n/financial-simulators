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
    <div className="flex flex-col gap-6">
      <CalcExplainer>
        <p className="font-semibold text-text-primary">What this calculator does</p>
        <p>It breaks down your home loan into exactly where your money goes each month — how much pays off the loan versus how much goes to the bank as interest. Then it answers the big question: should you prepay or invest that extra cash?</p>
        <p className="font-semibold text-text-primary">What each number means</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="text-text-primary">Monthly EMI</span> — your fixed monthly payment to the bank.</li>
          <li><span className="text-text-primary">Total Interest</span> — the total money the bank charges you over the full loan period. This can shock you — it often exceeds the loan amount itself.</li>
          <li><span className="text-text-primary">Interest Saved (Prepay)</span> — how much interest you avoid by putting your extra cash toward the loan each month.</li>
          <li><span className="text-text-primary">Months Saved</span> — how many months earlier you become debt-free with prepayment.</li>
          <li><span className="text-text-primary">SIP Corpus at Loan End</span> — if you invest that extra cash instead of prepaying, this is what it grows to by the time your loan ends.</li>
        </ul>
        <p className="font-semibold text-text-primary">How to read the charts</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="text-loss">Red bars</span> in the amortization chart = interest going to the bank. <span className="text-gain">Green bars</span> = actual loan reduction. Watch red shrink and green grow over time — that&apos;s your loan getting cheaper.</li>
          <li>The <span className="text-warn">crossover chart</span> shows when investing beats prepaying. Before crossover: prepay. After crossover: invest.</li>
        </ul>
      </CalcExplainer>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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

      <div className="bg-surface rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold text-text-secondary mb-3">Amortization Schedule</h3>
        <AmortizationChart data={amortization} />
      </div>

      {extraCash > 0 && (
        <div className="bg-surface rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-text-secondary mb-3">
            SIP vs Prepayment Crossover
          </h3>
          <CrossoverChart data={amortization} crossoverMonth={crossoverMonth} interestRate={interestRate} />
        </div>
      )}
    </div>
  );
}