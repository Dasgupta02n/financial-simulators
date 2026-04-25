"use client";

interface Props {
  assumptions: string[];
  className?: string;
}

export function WhyThisNumber({ assumptions, className = "" }: Props) {
  return (
    <details className={`group ${className}`}>
      <summary className="text-xs text-text-secondary cursor-pointer hover:text-sienna transition-colors select-none">
        Why this number? ▾
      </summary>
      <div className="mt-2 pl-3 border-l-2 border-sienna/30 space-y-1">
        {assumptions.map((a, i) => (
          <p key={i} className="text-[11px] text-text-secondary leading-relaxed">
            {a}
          </p>
        ))}
      </div>
    </details>
  );
}