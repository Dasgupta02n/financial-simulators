"use client";

import type { TaxOutput, RegimeResult } from "@/lib/calculators/tax/types";
import { formatINR } from "@/lib/format";
import { CrossoverGauge } from "./crossover-gauge";
import { RegimeChart } from "./regime-chart";
import { twMerge } from "tailwind-merge";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { CalcVisualization } from "@/components/shared/calc-visualization";

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
  const vizData = { oldRegimeTax: oldRegime.totalTax, newRegimeTax: newRegime.totalTax };

  return (
    <div className="flex flex-col gap-6">
      <CalcExplainer>
        <p className="font-semibold text-text-primary">What this calculator does</p>
        <p>It compares the Old and New tax regimes side by side for your salary, so you can see exactly which one leaves more money in your pocket — and by how much.</p>
        <p className="font-semibold text-text-primary">Old vs New regime in plain terms</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="text-text-primary">Old Regime</span> — you can claim deductions like 80C (PPF, ELSS), 80D (health insurance), HRA, NPS, etc. Lower salary shown on paper, but you need the receipts.</li>
          <li><span className="text-text-primary">New Regime</span> — almost no deductions allowed, but the tax slabs are wider and rates are lower. Only a ₹75,000 standard deduction.</li>
        </ul>
        <p className="font-semibold text-text-primary">Key terms explained</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="text-text-primary">Surcharge</span> — an extra tax on high earners (income above ₹50L). The calculator applies it automatically with marginal relief so you don&apos;t pay more than you earn above the threshold.</li>
          <li><span className="text-text-primary">Cess (4%)</span> — a flat 4% added on top of your tax + surcharge. Everyone pays this.</li>
          <li><span className="text-text-primary">Crossover Gauge</span> — shows whether your deductions make the Old Regime worthwhile. If the marker is on the left, New Regime wins. If on the right, Old Regime wins.</li>
        </ul>
      </CalcExplainer>
      <CalcVisualization calcId="tax" data={vizData} />
      <div className="text-xs font-mono text-text-secondary">
        {oldWins
          ? `Old Regime saves ${formatINR(savings)}`
          : `New Regime saves ${formatINR(savings)}`}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RegimeCard result={oldRegime} isWinner={oldWins} />
        <RegimeCard result={newRegime} isWinner={!oldWins} />
      </div>

      <CrossoverGauge crossover={crossover} />

      <div className="bg-surface rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold text-text-secondary mb-3">Regime Comparison</h3>
        <RegimeChart oldRegime={oldRegime} newRegime={newRegime} />
      </div>
    </div>
  );
}