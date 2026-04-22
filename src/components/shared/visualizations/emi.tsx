"use client";

interface Props {
  data: Record<string, number>;
}

export function EMIVisualization({ data }: Props) {
  const principal = data.principal || 500000;
  const totalInterest = data.totalInterest || 300000;
  const total = principal + totalInterest;
  const principalPct = total > 0 ? principal / total : 0.5;

  const cx = 120, cy = 80, r = 50;
  const principalArc = principalPct * 360;
  const interestArc = 360 - principalArc;

  const polarPoint = (angle: number) => ({
    x: cx + r * Math.cos(((angle - 90) * Math.PI) / 180),
    y: cy + r * Math.sin(((angle - 90) * Math.PI) / 180),
  });

  const ps = polarPoint(0);
  const pe = polarPoint(principalArc);
  const is = pe;
  const ie = ps;

  const principalPathD = `M${cx},${cy} L${ps.x},${ps.y} A${r},${r} 0 ${principalArc > 180 ? 1 : 0},1 ${pe.x},${pe.y} Z`;
  const interestPathD = `M${cx},${cy} L${is.x},${is.y} A${r},${r} 0 ${interestArc > 180 ? 1 : 0},1 ${ie.x},${ie.y} Z`;

  return (
    <svg viewBox="0 0 240 160" className="w-full max-w-[280px]">
      {/* Principal arc */}
      <path
        d={principalPathD}
        fill="var(--color-cat-emi)" opacity={0.7}
      />
      {/* Interest arc */}
      <path
        d={interestPathD}
        fill="var(--color-loss)" opacity={0.5}
      />
      {/* Center hole (donut) */}
      <circle cx={cx} cy={cy} r={22} fill="var(--color-surface)" />
      {/* Labels */}
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono)" fill="var(--color-text-primary)">
        {Math.round(principalPct * 100)}%
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="6" fontFamily="var(--font-geist-mono)" fill="var(--color-text-muted)">
        principal
      </text>
      {/* Legend */}
      <rect x="40" y="145" width="8" height="8" rx="1" fill="var(--color-cat-emi)" opacity={0.7} />
      <text x="52" y="152" fontSize="7" fontFamily="var(--font-geist-mono)" fill="var(--color-text-secondary)">Principal</text>
      <rect x="130" y="145" width="8" height="8" rx="1" fill="var(--color-loss)" opacity={0.5} />
      <text x="142" y="152" fontSize="7" fontFamily="var(--font-geist-mono)" fill="var(--color-text-secondary)">Interest</text>
    </svg>
  );
}