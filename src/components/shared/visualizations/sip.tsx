"use client";

interface Props {
  data: Record<string, number>;
}

export function SIPVisualization({ data }: Props) {
  const invested = data.totalInvested || 100000;
  const nominal = data.nominalCorpus || 500000;
  const postTax = data.postTaxCorpus || 450000;
  const real = data.realCorpus || 300000;
  const max = Math.max(invested, nominal, postTax, real, 1);
  const scale = (v: number) => (v / max) * 100;

  const bars = [
    { label: "Invested", value: invested, color: "var(--color-text-muted)", height: scale(invested) },
    { label: "Nominal", value: nominal, color: "var(--color-cat-sip)", height: scale(nominal) },
    { label: "Post-Tax", value: postTax, color: "var(--color-warn)", height: scale(postTax) },
    { label: "Real", value: real, color: "var(--color-gain)", height: scale(real) },
  ];

  return (
    <svg viewBox="0 0 240 160" className="w-full max-w-[280px]">
      {bars.map((bar) => {
        const x = 30 + bars.indexOf(bar) * 55;
        const barHeight = Math.max(bar.height * 0.8, 2);
        const y = 130 - barHeight;
        return (
          <g key={bar.label}>
            <rect
              x={x} y={y} width={36} height={barHeight}
              rx={4} fill={bar.color} opacity={0.85}
              style={{ transition: "y 0.5s ease-out, height 0.5s ease-out" }}
            />
            <text
              x={x + 18} y={y - 6}
              textAnchor="middle" fontSize="9" fontFamily="var(--font-geist-mono)"
              fill={bar.color}
              style={{ transition: "y 0.5s ease-out" }}
            >
              {bar.label}
            </text>
          </g>
        );
      })}
      <line x1="20" y1="132" x2="250" y2="132" stroke="var(--color-border)" strokeWidth="1" />
    </svg>
  );
}