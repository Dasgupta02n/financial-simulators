"use client";

import { FY_YEAR, LAST_UPDATED, INFLATION_RATE } from "@/lib/truth/assumptions";

interface Props {
  taxRegime?: string;
  inflationRate?: number;
  lastUpdated?: string;
  className?: string;
}

export function ConfidenceBadge({
  taxRegime = `FY ${FY_YEAR}`,
  inflationRate = INFLATION_RATE,
  lastUpdated = LAST_UPDATED,
  className = "",
}: Props) {
  return (
    <div className={`flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono text-text-muted ${className}`}>
      <span>Last updated: {lastUpdated}</span>
      <span>Tax regime: {taxRegime}</span>
      <span>Inflation: {inflationRate}% (RBI 10-yr avg)</span>
    </div>
  );
}