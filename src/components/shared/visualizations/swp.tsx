"use client";

interface Props {
  data: Record<string, number>;
}

export function SWPVisualization({ data }: Props) {
  const corpusAtStart = data.corpusAtStart || 10000000;
  const corpusAtEnd = data.corpusAtEnd || 5000000;
  const ratio = corpusAtEnd / Math.max(corpusAtStart, 1);
  const waterLevel = 20 + ratio * 50;

  return (
    <svg viewBox="0 0 240 160" className="w-full max-w-[280px]">
      {/* Bucket */}
      <path d="M60 30 L65 130 H175 L180 30 Z" fill="var(--color-cat-swp)" opacity="0.08" stroke="var(--color-cat-swp)" strokeWidth="1.5" />
      {/* Water level — reactive */}
      <rect
        x="63" y={130 - waterLevel} width="114" height={waterLevel}
        fill="var(--color-cat-swp)" opacity="0.2"
        style={{ transition: "y 0.6s ease-out, height 0.6s ease-out" }}
      />
      {/* Water lines */}
      {[0.25, 0.5, 0.75].map((f, i) => (
        <line key={i} x1="65" y1={130 - waterLevel * f} x2="175" y2={130 - waterLevel * f}
          stroke="var(--color-cat-swp)" strokeWidth="0.5" opacity={0.15}
          style={{ transition: "y1 0.6s ease-out, y2 0.6s ease-out" }}
        />
      ))}
      {/* Outflow stream */}
      <path d="M175 60 Q185 70 190 90 Q195 110 200 130" fill="none" stroke="var(--color-loss)" strokeWidth="2" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
      </path>
      {/* Drip drops */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx="197" cy={100 + i * 15} r="2" fill="var(--color-loss)" opacity="0.5">
          <animate attributeName="cy" values="90;130;90" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Labels */}
      <text x="120" y="20" textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono)" fill="var(--color-text-muted)">
        Corpus: {ratio > 0 ? `${Math.round(ratio * 100)}%` : "Depleted"}
      </text>
    </svg>
  );
}