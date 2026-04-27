"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  SIPVisualization, EMIVisualization, TaxVisualization, AccumVisualization,
  FDVisualization, SWPVisualization, FIREVisualization, CTCVisualization,
  NPSVisualization, GoalVisualization,
} from "./visualizations";

const VIS_MAP: Record<string, React.FC<{ data: Record<string, number> }>> = {
  sip: SIPVisualization,
  emi: EMIVisualization,
  tax: TaxVisualization,
  accum: AccumVisualization,
  fd: FDVisualization,
  swp: SWPVisualization,
  fire: FIREVisualization,
  ctc: CTCVisualization,
  nps: NPSVisualization,
  goal: GoalVisualization,
};

interface CalcVisualizationProps {
  calcId: string;
  data: Record<string, number>;
}

export function CalcVisualization({ calcId, data }: CalcVisualizationProps) {
  const Visualization = VIS_MAP[calcId];
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!Visualization) return null;

  return (
    <motion.div
      initial={mounted ? { opacity: 0, scale: 0.95 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative rounded-lg border border-border bg-white overflow-hidden shadow-sm"
    >
      <div className="px-3 py-1 border-b border-border bg-ink-light">
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
          Live Visualization
        </span>
      </div>
      <div className="p-3 flex items-center justify-center min-h-[120px]">
        <Visualization data={data} />
      </div>
    </motion.div>
  );
}