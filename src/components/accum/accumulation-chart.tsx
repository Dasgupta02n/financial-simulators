"use client";

import { Area, AreaChart, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { YearlyAccumulationPoint } from "@/lib/calculators/accumulator/types";
import { formatINRShort } from "@/lib/format";

interface AccumulationChartProps { data: YearlyAccumulationPoint[]; }

export function AccumulationChart({ data }: AccumulationChartProps) {
  return (
    <div className="w-full flex-1 min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="lumpGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="sipGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
            tickFormatter={(v) => `Y${v}`} axisLine={{ stroke: "#1f2937" }} tickLine={false} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
            tickFormatter={formatINRShort} axisLine={{ stroke: "#1f2937" }} tickLine={false} width={55} />
          <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px",
            fontFamily: "var(--font-geist-mono)", fontSize: "11px" }}
            labelFormatter={(v) => `Year ${v}`}
            formatter={(value, name) => [formatINRShort(Number(value)), String(name)]} />
          <Area type="monotone" dataKey="lumpsumValue" stroke="#6ee7b7" strokeWidth={2}
            fill="url(#lumpGrad)" name="Lumpsum Base" isAnimationActive={false} />
          <Area type="monotone" dataKey="sipCorpus" stroke="#60a5fa" strokeWidth={2}
            fill="url(#sipGrad)" name="SIP Corpus" isAnimationActive={false} />
          <Line type="monotone" dataKey="realTotal" stroke="#f87171" strokeWidth={1.5}
            strokeDasharray="6 4" dot={false} name="Real Total" isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}