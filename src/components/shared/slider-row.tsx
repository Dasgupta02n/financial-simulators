"use client";

import { useMemo } from "react";

interface SliderRowProps {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  /** Show tick marks at key positions. Default: true */
  ticks?: boolean;
  /** Custom tick positions as fractions [0..1]. Default: [0, 0.25, 0.5, 0.75, 1] */
  tickPositions?: number[];
  /** Show value bubble above thumb. Default: true */
  bubble?: boolean;
  /** Unit suffix for tick labels (e.g. "L", "Cr", "%", "yr") */
  tickUnit?: string;
  /** Formatter for tick labels — receives the raw value at that position */
  tickFormat?: (v: number) => string;
  /** Optional hint text shown next to label */
  hint?: string;
}

function formatTickDefault(v: number): string {
  if (v >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `${(v / 100000).toFixed(0)}L`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return `${v}`;
}

export function SliderRow({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
  ticks = true,
  tickPositions,
  bubble = true,
  tickUnit,
  tickFormat,
  hint,
}: SliderRowProps) {
  const range = max - min;
  const fillPct = range > 0 ? ((value - min) / range) * 100 : 50;
  const fillPctClamped = Math.max(0, Math.min(100, fillPct));

  const tickLabels = useMemo(() => {
    const ticks = tickPositions ?? [0, 0.25, 0.5, 0.75, 1];
    const fmt = tickFormat ?? formatTickDefault;
    return ticks.map((frac) => {
      const raw = min + frac * range;
      const rounded = Math.round(raw / step) * step;
      const text = tickUnit ? `${fmt(rounded)}${tickUnit}` : fmt(rounded);
      return text;
    });
  }, [min, range, step, tickFormat, tickUnit, tickPositions]);

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-baseline">
        <label className="text-xs text-text-secondary">
          {label}
          {hint && <span className="text-text-muted ml-1">({hint})</span>}
        </label>
        <span className="text-xs font-mono font-semibold text-text-primary">{displayValue}</span>
      </div>
      <div className="relative range-with-ticks" style={{ paddingTop: bubble ? "28px" : "0" }}>
        {bubble && (
          <div className="slider-value-bubble">{displayValue}</div>
        )}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{ "--range-fill": `${fillPctClamped}%` } as React.CSSProperties}
        />
      </div>
      {ticks && (
        <div className="range-ticks">
          {tickLabels.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}