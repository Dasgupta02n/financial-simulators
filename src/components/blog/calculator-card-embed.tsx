import Link from "next/link";

const CALCULATOR_INFO: Record<string, { name: string; description: string; slug: string }> = {
  sip: { name: "SIP Simulator", description: "See actual returns after inflation and tax", slug: "sip-simulator" },
  emi: { name: "EMI Analyzer", description: "Compare loan EMIs with real cost", slug: "emi-analyzer" },
  tax: { name: "Tax Sandbox", description: "Old vs New regime, side by side", slug: "tax-sandbox" },
  accum: { name: "Accumulator", description: "Lump sum vs SIP comparison", slug: "accumulation-calculator" },
  fd: { name: "FD Comparator", description: "Real FD returns after tax and inflation", slug: "fd-comparator" },
  swp: { name: "SWP Stress Test", description: "Will your corpus survive a crash?", slug: "swp-stress-test" },
  fire: { name: "FIRE Matrix", description: "When can you retire?", slug: "fire-matrix" },
  ctc: { name: "CTC Optimizer", description: "Maximize your in-hand salary", slug: "ctc-optimizer" },
  nps: { name: "NPS Modeler", description: "Project your pension and corpus", slug: "nps-modeler" },
  goal: { name: "Goal Planner", description: "Monthly SIP needed per goal", slug: "goal-planner" },
};

interface CalculatorCardProps {
  id: string;
}

export function CalculatorCard({ id }: CalculatorCardProps) {
  const info = CALCULATOR_INFO[id];

  if (!info) {
    return null;
  }

  return (
    <Link
      href={`/${info.slug}`}
      className="block my-6 p-4 rounded-lg border border-gain/40 bg-gain/10 hover:bg-gain/15 transition-colors"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gain">{info.name}</h4>
        <span className="text-xs font-mono text-gain">Open →</span>
      </div>
      <p className="text-sm text-text-secondary mt-1">{info.description}</p>
    </Link>
  );
}