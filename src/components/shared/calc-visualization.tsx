"use client";

import { motion } from "framer-motion";
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
  if (!Visualization) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative rounded-2xl border border-border bg-surface overflow-hidden"
    >
      <div className="px-4 py-2 border-b border-border bg-surface-hover">
        <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
          Live Visualization
        </span>
      </div>
      <div className="p-4 flex items-center justify-center min-h-[200px]">
        <Visualization data={data} />
      </div>
    </motion.div>
  );
}