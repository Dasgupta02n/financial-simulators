"use client";

import type { TaxOutput, RegimeResult } from "@/lib/calculators/tax/types";
import { formatINR } from "@/lib/format";
import { CrossoverGauge } from "./crossover-gauge";
import { RegimeChart } from "./regime-chart";
import { twMerge } from "tailwind-merge";
import { CalcExplainer } from "@/components/shared/calc-explainer";

interface ResultsPanelProps {
  output: TaxOutput;
}

function RegimeCard({ result, isWinner }: { result: RegimeResult; isWinner: boolean }) {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-3 p-4 rounded-lg border",
        isWinner
          ? "border-gain/40 bg-gain/5"
          : "border-border bg-surface"
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{result.regimeName}</h3>
        {isWinner && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gain/20 text-gain">
            OPTIMAL
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
        <span className="text-text-secondary">Gross Income</span>
        <span className="text-right">{formatINR(result.grossIncome)}</span>

        <span className="text-text-secondary">Std Deduction</span>
        <span className="text-right">{formatINR(result.standardDeduction)}</span>

        <span className="text-text-secondary">Total Deductions</span>
        <span className="text-right">{formatINR(result.totalDeductions)}</span>

        <span className="text-text-secondary">Taxable Income</span>
        <span className="text-right">{formatINR(result.taxableIncome)}</span>

        <div className="col-span-2 border-t border-border my-1" />

        <span className="text-text-secondary">Tax on Slabs</span>
        <span className="text-right">{formatINR(result.taxBeforeCess)}</span>

        {result.surcharge > 0 && (
          <>
            <span className="text-text-secondary">Surcharge</span>
            <span className="text-right">{formatINR(result.surcharge)}</span>
          </>
        )}

        {result.marginalRelief > 0 && (
          <>
            <span className="text-text-secondary">Marginal Relief</span>
            <span className="text-right text-gain">-{formatINR(result.marginalRelief)}</span>
          </>
        )}

        <span className="text-text-secondary">Cess (4%)</span>
        <span className="text-right">{formatINR(result.cess)}</span>

        <div className="col-span-2 border-t border-border my-1" />

        <span className="text-text-secondary font-semibold">Total Tax</span>
        <span className={twMerge("text-right font-semibold", isWinner ? "text-gain" : "text-loss")}>
          {formatINR(result.totalTax)}
        </span>

        <span className="text-text-secondary">Effective Rate</span>
        <span className="text-right">{(result.effectiveRate * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
}

export function ResultsPanel({ output }: ResultsPanelProps) {
  const { oldRegime, newRegime, crossover } = output;
  const oldWins = crossover.recommendation === "old";
  const savings = Math.abs(oldRegime.totalTax - newRegime.totalTax);

  return (
    <div className="flex flex-col gap-3 min-h-0">
      <CalcExplainer>
        <p className="font-semibold text-text-primary">Tax Calculator</p>
        <p>Compares Old vs New tax regimes for your salary — which leaves more money in your pocket?</p>
        <ul className="list-disc pl-5 space-y-0.5">
          <li><span className="text-text-primary">Old Regime</span> — claim 80C, 80D, HRA, NPS deductions. Lower taxable income, but needs receipts.</li>
          <li><span className="text-text-primary">New Regime</span> — wider slabs, lower rates. Only ₹75K standard deduction.</li>
          <li><span className="text-text-primary">Surcharge</span> — extra tax on high earners (above ₹50L).</li>
          <li><span className="text-text-primary">Cess (4%)</span> — flat 4% on tax + surcharge.</li>
        </ul>
      </CalcExplainer>
      <div className="text-xs font-mono text-text-secondary">
        {oldWins
          ? `Old Regime saves ${formatINR(savings)}`
          : `New Regime saves ${formatINR(savings)}`}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <RegimeCard result={oldRegime} isWinner={oldWins} />
        <RegimeCard result={newRegime} isWinner={!oldWins} />
      </div>

      <CrossoverGauge crossover={crossover} />

      <div className="bg-surface rounded-lg border border-border p-3">
        <h3 className="text-xs font-semibold text-text-secondary mb-2">Regime Comparison</h3>
        <div className="flex-1 min-h-[220px]">
          <RegimeChart oldRegime={oldRegime} newRegime={newRegime} />
        </div>
      </div>
    </div>
  );
}