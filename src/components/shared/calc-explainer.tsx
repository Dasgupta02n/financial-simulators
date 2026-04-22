"use client";

import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export function CalcExplainer({ children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setOpen(!open)}
        className="self-start px-3 py-1 text-xs rounded-md font-mono transition-colors bg-border text-text-secondary border border-border hover:bg-border/80"
      >
        {open ? "Hide Guide ↓" : "How to read this →"}
      </button>
      {open && (
        <div className="text-sm text-text-secondary leading-relaxed space-y-3 p-4 bg-surface/50 rounded-lg border border-border">
          {children}
        </div>
      )}
    </div>
  );
}