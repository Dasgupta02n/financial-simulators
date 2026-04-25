"use client";

import { twMerge } from "tailwind-merge";
import type { CrossoverResult } from "@/lib/calculators/tax/types";
import { formatINR } from "@/lib/format";

interface CrossoverGaugeProps {
  crossover: CrossoverResult;
}

export function CrossoverGauge({ crossover }: CrossoverGaugeProps) {
  const { crossoverDeduction, currentDeductions, recommendation } = crossover;

  const maxDeduction = Math.max(crossoverDeduction * 1.5, currentDeductions * 1.2, 300000);
  const crossoverPct = Math.min(100, (crossoverDeduction / maxDeduction) * 100);
  const currentPct = Math.min(100, (currentDeductions / maxDeduction) * 100);

  const isOldBetter = recommendation === "old";

  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-secondary">Regime Crossover Gauge</h3>
        <span
          className={twMerge(
            "text-xs font-mono px-2 py-0.5 rounded",
            isOldBetter
              ? "bg-gain/20 text-gain"
              : "bg-loss/20 text-loss"
          )}
        >
          {isOldBetter ? "Old Regime Wins" : "New Regime Wins"}
        </span>
      </div>

      <div className="relative h-8 bg-ink rounded-full overflow-hidden">
        {/* New Regime zone (left of crossover) */}
        <div
          className="absolute top-0 left-0 h-full bg-loss/15 rounded-l-full"
          style={{ width: `${crossoverPct}%` }}
        />
        {/* Old Regime zone (right of crossover) */}
        <div
          className="absolute top-0 h-full bg-gain/15 rounded-r-full"
          style={{ left: `${crossoverPct}%`, width: `${100 - crossoverPct}%` }}
        />

        {/* Crossover line */}
        <div
          className="absolute top-0 h-full w-0.5 bg-warn z-10"
          style={{ left: `${crossoverPct}%` }}
        >
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-warn whitespace-nowrap">
            Crossover
          </span>
        </div>

        {/* Current position marker */}
        <div
          className="absolute top-0.5 h-[calc(100%-4px)] w-2 rounded-full bg-text-primary z-20 transition-all duration-150"
          style={{ left: `calc(${currentPct}% - 4px)` }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-mono text-text-secondary">
        <span>New Regime better</span>
        <span>Old Regime better</span>
      </div>

      <div className="flex flex-col gap-1 text-xs font-mono text-text-secondary mt-1">
        <div>
          Crossover deduction: <span className="text-warn">{formatINR(crossoverDeduction)}</span>
        </div>
        <div>
          Your deductions: <span className="text-text-primary">{formatINR(currentDeductions)}</span>
        </div>
        <div>
          {isOldBetter
            ? `Old Regime saves you ${formatINR(-crossover.currentSavingsNewOverOld)}`
            : `New Regime saves you ${formatINR(-crossover.currentSavingsNewOverOld)}`}
        </div>
      </div>
    </div>
  );
}