"use client";

import type { TruthResult } from "@/lib/truth/types";
import { formatINR } from "@/lib/format";

interface Props {
  truth: TruthResult;
  className?: string;
}

export function LieVsTruthPanel({ truth, className = "" }: Props) {
  const gap = truth.grossValue - truth.realValue;
  const gapPct = truth.grossValue > 0 ? ((gap / truth.grossValue) * 100).toFixed(1) : "0";

  return (
    <div className={`bg-surface rounded-lg border border-border p-4 ${className}`}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
        The Lie vs The Truth
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{truth.grossLabel}</p>
          <p className="text-lg font-mono font-bold text-text-secondary line-through opacity-60">
            {formatINR(truth.grossValue)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-sienna uppercase tracking-wider mb-1">{truth.realLabel}</p>
          <p className="text-lg font-serif-display font-bold text-sienna">
            {formatINR(truth.realValue)}
          </p>
        </div>
      </div>

      {truth.deductions.length > 0 && (
        <div className="space-y-2 border-t border-border/50 pt-3">
          {truth.deductions.map((d, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-text-secondary">{d.label}</span>
              <span className="font-mono text-loss">-{formatINR(d.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between text-xs font-semibold pt-1 border-t border-border/50">
            <span className="text-text-primary">Total erosion</span>
            <span className="font-mono text-loss">{gapPct}% gone</span>
          </div>
        </div>
      )}
    </div>
  );
}