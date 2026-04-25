"use client";

import { useState, useMemo, useCallback } from "react";
import type { SalaryInput } from "@/lib/calculators/salary/types";
import { computeSalary } from "@/lib/calculators/salary/engine";
import { formatINR } from "@/lib/format";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { twMerge } from "tailwind-merge";
import { SliderRow } from "@/components/shared/slider-row";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#6ee7b7", "#38bdf8", "#f59e0b", "#a78bfa", "#f87171"];

const DEFAULT_INPUT: SalaryInput = {
  ctc: 1200000,
  basicPct: 50,
  bonusPct: 10,
  metroCity: true,
  regime: "new",
};

function ResultRow({ label, value, highlight, subtext }: {
  label: string; value: string; highlight?: boolean; subtext?: string;
}) {
  return (
    <div className={`flex justify-between items-baseline py-2 border-b border-border ${highlight ? "text-gain" : "text-text-secondary"}`}>
      <div>
        <span className="text-xs">{label}</span>
        {subtext && <p className="text-[10px] text-text-muted font-mono mt-0.5">{subtext}</p>}
      </div>
      <span className={`text-sm font-mono font-semibold ${highlight ? "text-gain" : "text-text-primary"}`}>{value}</span>
    </div>
  );
}

interface PayloadItem {
  name: string;
  value: number;
  payload: { name: string; value: number };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: PayloadItem[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];
  return (
    <div className="bg-[#111827] border border-border rounded-lg px-3 py-2 text-xs font-mono shadow-lg">
      <span className="text-text-secondary">{item.name}: </span>
      <span className="text-text-primary font-semibold">{formatINR(item.value)}</span>
    </div>
  );
}

export function SalaryCalculator() {
  const [input, setInput] = useState<SalaryInput>(DEFAULT_INPUT);
  const handleInputChange = useCallback(
    <K extends keyof SalaryInput>(key: K, value: SalaryInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );

  const result = useMemo(() => computeSalary(input), [input]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-border shadow-sm">
          <h2 className="text-sm font-semibold tracking-tight">Calculate In-Hand Salary</h2>
          <SliderRow label="Annual CTC" value={input.ctc}
            displayValue={formatINR(input.ctc)}
            min={300000} max={50000000} step={50000}
            onChange={(v) => handleInputChange("ctc", v)} />
          <SliderRow label="Basic Salary (% of CTC)" value={input.basicPct}
            displayValue={`${input.basicPct}%`}
            min={30} max={60} step={2}
            onChange={(v) => handleInputChange("basicPct", v)} tickUnit="%" />
          <SliderRow label="Expected Bonus (% of CTC)" value={input.bonusPct}
            displayValue={`${input.bonusPct}%`}
            min={0} max={40} step={1}
            onChange={(v) => handleInputChange("bonusPct", v)} tickUnit="%" />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary">City Type</span>
            <div className="flex gap-2">
              <button className={twMerge(
                "px-4 py-1.5 text-xs rounded-md font-mono transition-colors",
                input.metroCity
                  ? "bg-sienna/10 text-sienna border border-sienna/30"
                  : "bg-surface-hover text-text-secondary border border-border"
              )} onClick={() => handleInputChange("metroCity", true)}>
                Metro
              </button>
              <button className={twMerge(
                "px-4 py-1.5 text-xs rounded-md font-mono transition-colors",
                !input.metroCity
                  ? "bg-sienna/10 text-sienna border border-sienna/30"
                  : "bg-surface-hover text-text-secondary border border-border"
              )} onClick={() => handleInputChange("metroCity", false)}>
                Non-Metro
              </button>
            </div>
            <p className="text-[10px] text-text-muted">Metro: Delhi, Mumbai, Kolkata, Chennai</p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-secondary">Tax Regime</span>
            <div className="flex gap-2">
              <button className={twMerge(
                "px-4 py-1.5 text-xs rounded-md font-mono transition-colors",
                input.regime === "new"
                  ? "bg-sienna/10 text-sienna border border-sienna/30"
                  : "bg-surface-hover text-text-secondary border border-border"
              )} onClick={() => handleInputChange("regime", "new")}>
                New Regime
              </button>
              <button className={twMerge(
                "px-4 py-1.5 text-xs rounded-md font-mono transition-colors",
                input.regime === "old"
                  ? "bg-sienna/10 text-sienna border border-sienna/30"
                  : "bg-surface-hover text-text-secondary border border-border"
              )} onClick={() => handleInputChange("regime", "old")}>
                Old Regime
              </button>
            </div>
            <p className="text-[10px] text-text-muted">
              {input.regime === "new" ? "New: lower rates, fewer deductions" : "Old: higher rates, more deductions (80C, HRA, 80D)"}
            </p>
          </div>
        </div>
      </div>

      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <CalcExplainer>
            <p className="font-semibold text-text-primary">How to read</p>
            <p>CTC includes all salary components plus employer PF. Your <strong>in-hand salary</strong> is what lands in your bank after deductions:</p>
            <ol className="list-decimal pl-5 space-y-0.5">
              <li>Gross Salary = CTC minus Employer PF</li>
              <li>Deductions = Employee PF (12% basic) + Professional Tax + Income Tax</li>
              <li>In-Hand = Gross Salary minus all Deductions</li>
            </ol>
            <p>{input.regime === "new"
              ? "New regime: Standard deduction of ₹75,000, no 80C/80D/HRA exemptions."
              : "Old regime: Standard deduction of ₹50,000, plus 80C (₹1.5L) and other exemptions."}
            </p>
          </CalcExplainer>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5 p-3 bg-white rounded-lg border border-border shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-text-secondary font-mono">Monthly In-Hand</span>
              <span className="text-xl font-mono font-semibold text-gain">{formatINR(result.monthlyInHand)}</span>
            </div>
            <div className="flex flex-col gap-0.5 p-3 bg-white rounded-lg border border-border shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-text-secondary font-mono">Annual In-Hand</span>
              <span className="text-xl font-mono font-semibold text-gain">{formatINR(result.annualInHand)}</span>
            </div>
          </div>

          {/* CTC Breakdown Pie */}
          <div className="p-4 bg-white rounded-lg border border-border shadow-sm">
            <h3 className="text-xs font-semibold text-text-primary mb-2">CTC Breakdown</h3>
            <div className="flex items-center gap-4">
              <div className="w-1/2 h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={result.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {result.pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 flex flex-col gap-1.5">
                {result.pieData.map((item, index) => {
                  const pct = input.ctc > 0 ? ((item.value / input.ctc) * 100).toFixed(1) : "0";
                  return (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-text-secondary flex-1">{item.name}</span>
                      <span className="font-mono text-text-primary">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Salary Components */}
          <div className="p-4 bg-white rounded-lg border border-border shadow-sm">
            <h3 className="text-xs font-semibold text-text-primary mb-3">Salary Components (Annual)</h3>
            <ResultRow label="Basic Salary" value={formatINR(result.breakdown.basic)}
              subtext={`${input.basicPct}% of CTC`} />
            <ResultRow label={`HRA (${input.metroCity ? "50%" : "40%"} of Basic)`} value={formatINR(result.breakdown.hra)} />
            <ResultRow label="Special Allowance" value={formatINR(result.breakdown.specialAllowance)} />
            <ResultRow label="Bonus" value={formatINR(result.breakdown.bonus)}
              subtext={`${input.bonusPct}% of CTC`} />
            <div className="flex justify-between items-baseline py-2 border-t-2 border-gain mt-1">
              <div>
                <span className="text-xs font-semibold text-text-primary">Gross Salary</span>
                <p className="text-[10px] text-text-muted font-mono">CTC minus Employer PF</p>
              </div>
              <span className="text-sm font-mono font-bold text-text-primary">{formatINR(result.annualGross)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="p-4 bg-white rounded-lg border border-border shadow-sm">
            <h3 className="text-xs font-semibold text-text-primary mb-3">Deductions (Annual)</h3>
            <ResultRow label="Employee PF" value={formatINR(result.deductions.employeePF)}
              subtext="12% of Basic" />
            <ResultRow label="Professional Tax" value={formatINR(result.deductions.professionalTax)}
              subtext="₹200/month" />
            <ResultRow label={`Income Tax (${input.regime === "new" ? "New" : "Old"} Regime)`} value={formatINR(result.deductions.incomeTax)}
              subtext={`Effective rate: ${result.tax.effectiveRate}%`} />
            <div className="flex justify-between items-baseline py-2 border-t-2 border-loss mt-1">
              <span className="text-xs font-semibold text-text-primary">Total Deductions</span>
              <span className="text-sm font-mono font-bold text-loss">{formatINR(result.deductions.totalDeductions)}</span>
            </div>
          </div>

          {/* Tax Slab Breakdown */}
          {result.tax.slabEntries.length > 0 && (
            <div className="p-4 bg-white rounded-lg border border-border shadow-sm">
              <h3 className="text-xs font-semibold text-text-primary mb-2">
                Tax Slab Breakdown ({input.regime === "new" ? "New" : "Old"} Regime)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-text-secondary border-b border-border">
                      <th className="text-left py-1.5">Slab</th>
                      <th className="text-right py-1.5">Rate</th>
                      <th className="text-right py-1.5">Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.tax.slabEntries.map((slab, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-1.5 text-text-primary">
                          {slab.to >= 10000000 ? `${(slab.from / 100000).toFixed(1)}L+` : `${(slab.from / 100000).toFixed(1)}L-${(slab.to / 100000).toFixed(1)}L`}
                        </td>
                        <td className="text-right py-1.5 text-text-secondary">{(slab.rate * 100).toFixed(0)}%</td>
                        <td className="text-right py-1.5 text-text-primary">{formatINR(slab.tax)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {result.tax.rebate > 0 && (
                <p className="text-[10px] text-gain font-mono mt-2">
                  Section 87A rebate: -{formatINR(result.tax.rebate)} (taxable income under {input.regime === "new" ? "₹12L" : "₹5L"})
                </p>
              )}
              <p className="text-[10px] text-text-muted font-mono mt-1">
                + 4% Health & Education Cess: {formatINR(result.tax.cess)}
              </p>
            </div>
          )}

          {/* Take-home summary */}
          <div className="p-3 bg-gain/10 border border-gain/30 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-text-primary">Monthly In-Hand</span>
                <p className="text-[10px] text-text-muted font-mono">({((result.monthlyInHand / result.monthlyGross) * 100).toFixed(1)}% of gross)</p>
              </div>
              <span className="text-lg font-mono font-bold text-gain">{formatINR(result.monthlyInHand)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}