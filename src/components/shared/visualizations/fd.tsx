"use client";

interface Props {
  data: Record<string, number>;
}

export function FDVisualization({ data }: Props) {
  const grossReturn = data.grossReturn || 7;
  const postTaxReturn = data.postTaxReturn || 5.5;
  const realReturn = data.realReturn || 1.5;

  const barW = 36;
  const maxH = 70;

  const bars = [
    { label: "Gross", pct: grossReturn, color: "var(--color-cat-fd)", h: (grossReturn / 10) * maxH },
    { label: "Post-Tax", pct: postTaxReturn, color: "var(--color-warn)", h: (postTaxReturn / 10) * maxH },
    { label: "Real", pct: realReturn, color: "var(--color-gain)", h: (Math.max(realReturn, 0.5) / 10) * maxH },
  ];

  return (
    <svg viewBox="0 0 240 160" className="w-full max-w-[280px]">
      {/* Lock icon top */}
      <rect x="105" y="8" width="30" height="22" rx="4" fill="var(--color-cat-fd)" opacity="0.2" stroke="var(--color-cat-fd)" strokeWidth="1" />
      <path d="M112 8 V4 A8 8 0 0 1 128 4 V8" fill="none" stroke="var(--color-cat-fd)" strokeWidth="1.5" />
      <text x="120" y="23" textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill="var(--color-cat-fd)">FD</text>

      {bars.map((bar) => {
        const i = bars.indexOf(bar);
        const x = 30 + i * 70;
        const h = Math.max(bar.h, 3);
        const y = 130 - h;
        return (
          <g key={bar.label}>
            <rect
              x={x} y={y} width={barW} height={h} rx="4" fill={bar.color} opacity={0.75}
              style={{ transition: "y 0.5s ease-out, height 0.5s ease-out" }}
            />
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill={bar.color}
              style={{ transition: "y 0.5s ease-out" }}>
              {bar.pct.toFixed(1)}%
            </text>
            <text x={x + barW / 2} y="142" textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill="var(--color-text-muted)">
              {bar.label}
            </text>
          </g>
        );
      })}
      {/* Erosion arrows */}
      <path d="M90 60 L95 55 M90 60 L85 55" stroke="var(--color-loss)" strokeWidth="1.5" opacity="0.4" />
      <path d="M160 60 L165 55 M160 60 L155 55" stroke="var(--color-loss)" strokeWidth="1.5" opacity="0.4" />
      <line x1="20" y1="132" x2="220" y2="132" stroke="var(--color-border)" strokeWidth="1" />
    </svg>
  );
}