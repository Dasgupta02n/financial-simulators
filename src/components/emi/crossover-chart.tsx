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

  const chartData = sampled.reduce<{ month: number; sipCorpus: number; prepaidSaved: number }[]>(
    (acc, row) => {
      const outstandingDiff = (row.outstanding || 0) - (row.prepaidOutstanding || 0);
      const prevSaved = acc.length > 0 ? acc[acc.length - 1].prepaidSaved : 0;
      const saved = prevSaved + Math.round(outstandingDiff * monthlyRate);
      acc.push({
        month: row.month,
        sipCorpus: row.sipCorpus || 0,
        prepaidSaved: Math.max(0, saved),
      });
      return acc;
    },
    []
  );

  return (
    <div className="w-full flex-1 min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
            tickFormatter={(v) => `M${v}`}
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
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="prepaidSaved"
            stroke="#f87171"
            strokeWidth={2}
            dot={false}
            name="Interest Saved"
            isAnimationActive={true}
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