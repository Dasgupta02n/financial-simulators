"use client";

interface Props {
  data: Record<string, number>;
}

export function AccumVisualization({ data }: Props) {
  const sipFinal = data.sipFinal || 400000;
  const lumpFinal = data.lumpFinal || 350000;
  const max = Math.max(sipFinal, lumpFinal, 1);
  const sipH = (sipFinal / max) * 80;
  const lumpH = (lumpFinal / max) * 80;

  return (
    <svg viewBox="0 0 240 160" className="w-full max-w-[280px]">
      {/* SIP stack */}
      <g>
        {[0, 1, 2, 3].map((i) => {
          const segH = sipH / 4;
          const y = 130 - (i + 1) * segH;
          const h = Math.max(segH - 2, 2);
          return (
            <rect
              key={`sip-${i}`}
              x="40" y={y} width="60" height={h} rx="4"
              fill="var(--color-cat-accum)" opacity={0.3 + i * 0.2}
              style={{ transition: "y 0.5s ease-out, height 0.5s ease-out" }}
            />
          );
        })}
        <text x="70" y={130 - sipH - 8} textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono)" fill="var(--color-cat-accum)"
          style={{ transition: "y 0.5s ease-out" }}>
          SIP
        </text>
      </g>
      {/* Lump sum */}
      <g>
        <rect
          x="140" y={130 - lumpH} width="60" height={Math.max(lumpH, 2)} rx="4"
          fill="var(--color-warn)" opacity={0.7}
          style={{ transition: "y 0.5s ease-out, height 0.5s ease-out" }}
        />
        <text x="170" y={130 - lumpH - 8} textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono)" fill="var(--color-warn)"
          style={{ transition: "y 0.5s ease-out" }}>
          Lump Sum
        </text>
      </g>
      {/* Arrow between */}
      <text x="120" y="75" textAnchor="middle" fontSize="14" fill="var(--color-text-muted)">vs</text>
      <line x1="20" y1="132" x2="220" y2="132" stroke="var(--color-border)" strokeWidth="1" />
    </svg>
  );
}