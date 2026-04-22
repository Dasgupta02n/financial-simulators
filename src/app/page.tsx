"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { SIPCalculator } from "@/components/sip/sip-calculator";
import { EMICalculator } from "@/components/emi/emi-calculator";
import { TaxCalculator } from "@/components/tax/tax-calculator";
import { AccumCalculator } from "@/components/accum/accum-calculator";
import { FDCalculator } from "@/components/fd/fd-calculator";
import { SWPCalculator } from "@/components/swp/swp-calculator";
import { FIRECalculator } from "@/components/fire/fire-calculator";
import { CTCCalculator } from "@/components/ctc/ctc-calculator";
import { NPSCalculator } from "@/components/nps/nps-calculator";
import { GoalCalculator } from "@/components/goal/goal-calculator";

const CALCULATORS = [
  { id: "sip", label: "SIP Simulator" },
  { id: "emi", label: "EMI Analyzer" },
  { id: "tax", label: "Tax Sandbox" },
  { id: "accum", label: "Accumulator" },
  { id: "fd", label: "FD Comparator" },
  { id: "swp", label: "SWP Stress" },
  { id: "fire", label: "FIRE Matrix" },
  { id: "ctc", label: "CTC Optimizer" },
  { id: "nps", label: "NPS Modeler" },
  { id: "goal", label: "Goal Planner" },
] as const;

type CalcId = (typeof CALCULATORS)[number]["id"];

export default function Home() {
  const [activeCalc, setActiveCalc] = useState<CalcId>("sip");

  return (
    <main className="flex-1 flex flex-col items-center">
      <header className="w-full max-w-7xl mx-auto px-4 pt-8 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Financial Simulators</h1>
        <p className="text-sm text-text-secondary mt-1">
          Real returns. No marketing. All math runs in your browser.
        </p>
        <nav className="flex gap-2 mt-4 flex-wrap">
          {CALCULATORS.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setActiveCalc(calc.id)}
              className={twMerge(
                "px-4 py-2 text-sm rounded-md font-mono transition-colors",
                activeCalc === calc.id
                  ? "bg-gain/20 text-gain border border-gain/40"
                  : "bg-border text-text-secondary border border-border hover:bg-border/80"
              )}
            >
              {calc.label}
            </button>
          ))}
        </nav>
      </header>

      {activeCalc === "sip" && <SIPCalculator />}
      {activeCalc === "emi" && <EMICalculator />}
      {activeCalc === "tax" && <TaxCalculator />}
      {activeCalc === "accum" && <AccumCalculator />}
      {activeCalc === "fd" && <FDCalculator />}
      {activeCalc === "swp" && <SWPCalculator />}
      {activeCalc === "fire" && <FIRECalculator />}
      {activeCalc === "ctc" && <CTCCalculator />}
      {activeCalc === "nps" && <NPSCalculator />}
      {activeCalc === "goal" && <GoalCalculator />}

      <footer className="w-full max-w-7xl mx-auto px-4 py-6 text-xs text-text-secondary border-t border-border mt-auto">
        Zero PII. Zero tracking. Computed entirely client-side. Macro defaults: NIFTY 12% μ / 18% σ, 6% inflation, LTCG 12.5% above ₹1.25L.
      </footer>
    </main>
  );
}