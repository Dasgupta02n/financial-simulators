"use client";

import {
  Area,
  AreaChart,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { YearlyDataPoint } from "@/lib/calculators/sip/types";
import { formatINRShort } from "@/lib/format";

interface ProjectionChartProps {
  data: YearlyDataPoint[];
  showStress: boolean;
}

export function ProjectionChart({ data, showStress }: ProjectionChartProps) {
  return (
    <div className="w-full flex-1 min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 5, bottom: 0 }}>
          <defs>
            <linearGradient id="nominalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#f87171" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="coneGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="year"
            tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
            tickFormatter={(v) => `Y${v}`}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
            tickFormatter={formatINRShort}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
            width={55}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "11px",
            }}
            labelFormatter={(v) => `Year ${v}`}
            formatter={(value, name) => [
              formatINRShort(Number(value)),
              String(name),
            ]}
          />

          {/* Monte Carlo P10/P90 confidence band */}
          <Area
            type="monotone"
            dataKey="p90"
            stroke="none"
            fill="url(#coneGrad)"
            fillOpacity={1}
            name="P90"
          />
          <Area
            type="monotone"
            dataKey="p10"
            stroke="none"
            fill="#ffffff"
            fillOpacity={1}
            name="P10 (mask)"
          />

          {/* Nominal corpus area */}
          <Area
            type="monotone"
            dataKey="nominalCorpus"
            stroke="#6ee7b7"
            strokeWidth={2}
            fill="url(#nominalGrad)"
            name="Nominal"
          />

          {/* Real corpus area */}
          <Area
            type="monotone"
            dataKey="realCorpus"
            stroke="#f87171"
            strokeWidth={2}
            fill="url(#realGrad)"
            name="Real"
          />

          {/* Stress test overlay */}
          {showStress && (
            <Line
              type="monotone"
              dataKey="stressCorpus"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              name="Stress"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}