"use client";

import {
  Area,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AmortizationRow } from "@/lib/calculators/emi/types";
import { formatINRShort } from "@/lib/format";

interface CrossoverChartProps {
  data: AmortizationRow[];
  crossoverMonth: number | null;
  interestRate: number;
}

export function CrossoverChart({ data, crossoverMonth, interestRate }: CrossoverChartProps) {
  const sampled = data.filter((_, i) => i % 6 === 0 || i === data.length - 1);
  const monthlyRate = interestRate / 100 / 12;

  let prepaidSaved = 0;
  const chartData = sampled.map((row) => {
    const outstandingDiff = (row.outstanding || 0) - (row.prepaidOutstanding || 0);
    prepaidSaved += Math.round(outstandingDiff * monthlyRate);
    return {
      month: row.month,
      sipCorpus: row.sipCorpus || 0,
      prepaidSaved: Math.max(0, prepaidSaved),
    };
  });

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
            tickFormatter={(v) => `M${v}`}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
            tickFormatter={formatINRShort}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
            width={60}
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
          <Area
            type="monotone"
            dataKey="sipCorpus"
            stroke="#6ee7b7"
            strokeWidth={2}
            fill="#6ee7b7"
            fillOpacity={0.08}
            name="SIP Corpus"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="prepaidSaved"
            stroke="#f87171"
            strokeWidth={2}
            dot={false}
            name="Interest Saved"
            isAnimationActive={false}
          />
          {crossoverMonth && (
            <ReferenceLine
              x={crossoverMonth}
              stroke="#fbbf24"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `M${crossoverMonth}`,
                fill: "#fbbf24",
                fontSize: 11,
                fontFamily: "var(--font-geist-mono)",
                position: "top",
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}