"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RegimeResult } from "@/lib/calculators/tax/types";
import { formatINRShort } from "@/lib/format";

interface RegimeChartProps {
  oldRegime: RegimeResult;
  newRegime: RegimeResult;
}

export function RegimeChart({ oldRegime, newRegime }: RegimeChartProps) {
  const data = [
    {
      name: "Taxable Income",
      old: oldRegime.taxableIncome,
      new: newRegime.taxableIncome,
    },
    {
      name: "Tax (before cess)",
      old: oldRegime.taxBeforeCess,
      new: newRegime.taxBeforeCess,
    },
    {
      name: "Surcharge",
      old: oldRegime.surcharge,
      new: newRegime.surcharge,
    },
    {
      name: "Cess",
      old: oldRegime.cess,
      new: newRegime.cess,
    },
    {
      name: "Total Tax",
      old: oldRegime.totalTax,
      new: newRegime.totalTax,
    },
  ];

  return (
    <div className="w-full flex-1 min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
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
            formatter={(value, name) => [formatINRShort(Number(value)), String(name)]}
          />
          <Bar
            dataKey="old"
            fill="#f87171"
            fillOpacity={0.8}
            name="Old Regime"
            isAnimationActive={true}
          />
          <Bar
            dataKey="new"
            fill="#6ee7b7"
            fillOpacity={0.8}
            name="New Regime"
            isAnimationActive={true}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}