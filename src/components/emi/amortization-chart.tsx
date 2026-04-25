"use client";

import {
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AmortizationRow } from "@/lib/calculators/emi/types";
import { formatINRShort } from "@/lib/format";

interface AmortizationChartProps {
  data: AmortizationRow[];
}

export function AmortizationChart({ data }: AmortizationChartProps) {
  // Sample every 6 months for readability
  const sampled = data.filter((_, i) => i % 6 === 0 || i === data.length - 1);

  return (
    <div className="w-full flex-1 min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={sampled} margin={{ top: 5, right: 20, left: 5, bottom: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
            tickFormatter={(v) => `M${v}`}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
            tickFormatter={formatINRShort}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
            width={55}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "8px",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "11px",
            }}
            labelFormatter={(v) => `Month ${v}`}
            formatter={(value, name) => [formatINRShort(Number(value)), String(name)]}
          />
          <Bar
            dataKey="principal"
            stackId="emi"
            fill="#6ee7b7"
            fillOpacity={0.8}
            name="Principal"
            isAnimationActive={false}
          />
          <Bar
            dataKey="interest"
            stackId="emi"
            fill="#f87171"
            fillOpacity={0.8}
            name="Interest"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="outstanding"
            stroke="#9ca3af"
            strokeWidth={1.5}
            dot={false}
            name="Outstanding"
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}