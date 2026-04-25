"use client";

import { useState, useMemo, useCallback } from "react";
import type { GSTInput } from "@/lib/calculators/gst/types";
import { computeGST } from "@/lib/calculators/gst/engine";
import { formatINR } from "@/lib/format";
import { CalcExplainer } from "@/components/shared/calc-explainer";
import { twMerge } from "tailwind-merge";
import { SliderRow } from "@/components/shared/slider-row";

const GST_SLABS = [5, 12, 18, 28] as const;

const DEFAULT_INPUT: GSTInput = {
  amount: 10000,
  gstRate: 18,
  inclusive: false,
  intraState: true,
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

export function GSTCalculator() {
  const [input, setInput] = useState<GSTInput>(DEFAULT_INPUT);
  const [customRate, setCustomRate] = useState(false);

  const handleInputChange = useCallback(
    <K extends keyof GSTInput>(key: K, value: GSTInput[K]) => { setInput((prev) => ({ ...prev, [key]: value })); }, []
  );

  const result = useMemo(() => computeGST(input), [input]);

  const slabButtons = (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-text-secondary">GST Rate</span>
      <div className="flex gap-2 flex-wrap">
        {GST_SLABS.map((rate) => (
          <button key={rate} className={twMerge(
            "px-3 py-1.5 text-xs rounded-md font-mono transition-colors",
            !customRate && input.gstRate === rate
              ? "bg-sienna/10 text-sienna border border-sienna/30"
              : "bg-surface-hover text-text-secondary border border-border"
          )} onClick={() => { setCustomRate(false); handleInputChange("gstRate", rate); }}>
            {rate}%
          </button>
        ))}
        <button className={twMerge(
          "px-3 py-1.5 text-xs rounded-md font-mono transition-colors",
          customRate
            ? "bg-sienna/10 text-sienna border border-sienna/30"
            : "bg-surface-hover text-text-secondary border border-border"
        )} onClick={() => setCustomRate(true)}>
          Custom
        </button>
      </div>
      {customRate && (
        <div className="flex items-center gap-2 mt-1">
          <input type="number" min={0.25} max={100} step={0.25}
            value={input.gstRate}
            onChange={(e) => handleInputChange("gstRate", parseFloat(e.target.value) || 0)}
            className="w-20 px-2 py-1 text-xs font-mono bg-border border border-border rounded-md text-text-primary focus:outline-none focus:border-gain" />
          <span className="text-xs text-text-secondary">%</span>
        </div>
      )}
    </div>
  );

  const toggleButtons = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-text-secondary">Tax Calculation Mode</span>
        <div className="flex gap-2">
          <button className={twMerge(
            "px-4 py-1.5 text-xs rounded-md font-mono transition-colors",
            !input.inclusive
              ? "bg-sienna/10 text-sienna border border-sienna/30"
              : "bg-surface-hover text-text-secondary border border-border"
          )} onClick={() => handleInputChange("inclusive", false)}>
            Exclusive
          </button>
          <button className={twMerge(
            "px-4 py-1.5 text-xs rounded-md font-mono transition-colors",
            input.inclusive
              ? "bg-sienna/10 text-sienna border border-sienna/30"
              : "bg-surface-hover text-text-secondary border border-border"
          )} onClick={() => handleInputChange("inclusive", true)}>
            Inclusive
          </button>
        </div>
        <p className="text-[10px] text-text-muted">
          {input.inclusive
            ? "The entered amount already includes GST — we extract the base price."
            : "The entered amount is before GST — we add GST on top."}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-text-secondary">Supply Type</span>
        <div className="flex gap-2">
          <button className={twMerge(
            "px-4 py-1.5 text-xs rounded-md font-mono transition-colors",
            input.intraState
              ? "bg-sienna/10 text-sienna border border-sienna/30"
              : "bg-surface-hover text-text-secondary border border-border"
          )} onClick={() => handleInputChange("intraState", true)}>
            Intra-State
          </button>
          <button className={twMerge(
            "px-4 py-1.5 text-xs rounded-md font-mono transition-colors",
            !input.intraState
              ? "bg-sienna/10 text-sienna border border-sienna/30"
              : "bg-surface-hover text-text-secondary border border-border"
          )} onClick={() => handleInputChange("intraState", false)}>
            Inter-State
          </button>
        </div>
        <p className="text-[10px] text-text-muted">
          {input.intraState
            ? "Intra-state: GST is split equally as CGST + SGST."
            : "Inter-state: GST is collected as a single IGST component."}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="lg:w-[38%] shrink-0">
        <div className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-border shadow-sm">
          <h2 className="text-sm font-semibold tracking-tight">Calculate GST Breakdown</h2>
          <SliderRow label={input.inclusive ? "Total Amount (incl. GST)" : "Base Amount (excl. GST)"}
            value={input.amount}
            displayValue={formatINR(input.amount)}
            min={0} max={10000000} step={100}
            onChange={(v) => handleInputChange("amount", v)} />
          {slabButtons}
          {toggleButtons}
        </div>
      </div>

      <div className="lg:w-[62%] min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <CalcExplainer>
            <p className="font-semibold text-text-primary">How to read</p>
            {input.inclusive ? (
              <p>When the amount is <strong>GST-inclusive</strong>, the base price is extracted using: Base = Total x 100 / (100 + GST Rate). The difference is the GST component.</p>
            ) : (
              <p>When the amount is <strong>GST-exclusive</strong>, GST is added on top: GST = Base x Rate / 100. Total = Base + GST.</p>
            )}
            {input.intraState ? (
              <p>For <strong>intra-state</strong> supplies, GST is split equally: CGST = GST / 2 and SGST = GST / 2.</p>
            ) : (
              <p>For <strong>inter-state</strong> supplies, the full GST amount is collected as IGST.</p>
            )}
          </CalcExplainer>

          <div className="p-4 bg-white rounded-lg border border-border shadow-sm">
            <h3 className="text-xs font-semibold text-text-primary mb-3">GST Breakdown</h3>

            {input.inclusive ? (
              <>
                <ResultRow label="Total Amount (incl. GST)"
                  value={formatINR(result.postTaxTotal)} />
                <ResultRow label="Pre-Tax Amount"
                  value={formatINR(result.preTaxAmount)}
                  subtext={`Base = Total x 100 / ${100 + result.effectiveRate}`} />
                <ResultRow label={`GST Amount @ ${result.effectiveRate}%`}
                  value={formatINR(result.gstAmount)}
                  highlight
                  subtext={`Total - Base = ${formatINR(result.postTaxTotal)} - ${formatINR(result.preTaxAmount)}`} />
              </>
            ) : (
              <>
                <ResultRow label="Base Amount (excl. GST)"
                  value={formatINR(result.preTaxAmount)} />
                <ResultRow label={`GST Amount @ ${result.effectiveRate}%`}
                  value={formatINR(result.gstAmount)}
                  highlight
                  subtext={`${result.effectiveRate}% of ${formatINR(result.preTaxAmount)}`} />
                <ResultRow label="Total Amount (incl. GST)"
                  value={formatINR(result.postTaxTotal)} />
              </>
            )}

            <div className="mt-3 pt-3 border-t-2 border-gain">
              <div className="flex justify-between items-center py-1">
                <div>
                  <span className="text-xs font-semibold text-text-primary">
                    {input.intraState ? "CGST + SGST Split" : "IGST (Full GST)"}
                  </span>
                  <p className="text-[10px] text-text-muted font-mono">
                    {input.intraState
                      ? `Each @ ${result.effectiveRate / 2}%`
                      : `@ ${result.effectiveRate}%`}
                  </p>
                </div>
              </div>
              {input.intraState ? (
                <div className="flex gap-3 mt-1">
                  <div className="flex-1 p-2 bg-gain/10 rounded-md text-center">
                    <p className="text-[10px] text-text-secondary">CGST</p>
                    <p className="text-sm font-mono font-semibold text-gain">{formatINR(result.cgst)}</p>
                  </div>
                  <div className="flex-1 p-2 bg-gain/10 rounded-md text-center">
                    <p className="text-[10px] text-text-secondary">SGST</p>
                    <p className="text-sm font-mono font-semibold text-gain">{formatINR(result.sgst)}</p>
                  </div>
                </div>
              ) : (
                <div className="p-2 bg-gain/10 rounded-md text-center mt-1">
                  <p className="text-[10px] text-text-secondary">IGST</p>
                  <p className="text-sm font-mono font-semibold text-gain">{formatINR(result.igst)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-border shadow-sm">
            <h3 className="text-xs font-semibold text-text-primary mb-2">Detailed Breakdown Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-border text-text-secondary">
                    <th className="text-left py-1.5 font-medium">Component</th>
                    <th className="text-right py-1.5 font-medium">Rate</th>
                    <th className="text-right py-1.5 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-1.5 text-text-primary">Pre-Tax Price</td>
                    <td className="text-right text-text-muted">—</td>
                    <td className="text-right text-text-primary">{formatINR(result.preTaxAmount)}</td>
                  </tr>
                  {input.intraState ? (
                    <>
                      <tr className="border-b border-border">
                        <td className="py-1.5 text-gain">CGST</td>
                        <td className="text-right text-text-muted">{result.effectiveRate / 2}%</td>
                        <td className="text-right text-gain">{formatINR(result.cgst)}</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-1.5 text-gain">SGST</td>
                        <td className="text-right text-text-muted">{result.effectiveRate / 2}%</td>
                        <td className="text-right text-gain">{formatINR(result.sgst)}</td>
                      </tr>
                    </>
                  ) : (
                    <tr className="border-b border-border">
                      <td className="py-1.5 text-gain">IGST</td>
                      <td className="text-right text-text-muted">{result.effectiveRate}%</td>
                      <td className="text-right text-gain">{formatINR(result.igst)}</td>
                    </tr>
                  )}
                  <tr className="border-b border-border font-semibold">
                    <td className="py-1.5 text-text-primary">Total GST</td>
                    <td className="text-right text-text-muted">{result.effectiveRate}%</td>
                    <td className="text-right text-gain">{formatINR(result.gstAmount)}</td>
                  </tr>
                  <tr className="font-semibold">
                    <td className="py-1.5 text-text-primary">Total Price</td>
                    <td className="text-right text-text-muted">—</td>
                    <td className="text-right text-text-primary">{formatINR(result.postTaxTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}