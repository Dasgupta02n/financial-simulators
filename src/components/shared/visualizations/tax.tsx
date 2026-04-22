"use client";

interface Props {
  data: Record<string, number>;
}

export function TaxVisualization({ data }: Props) {
  const oldTax = data.oldRegimeTax || 100000;
  const newTax = data.newRegimeTax || 80000;
  const max = Math.max(oldTax, newTax, 1);
  const tilt = ((oldTax - newTax) / max) * 15;

  const cx = 120, cy = 70;
  const beamY = cy - 20;
  const oldH = Math.max((oldTax / max) * 40, 5);
  const newH = Math.max((newTax / max) * 40, 5);

  return (
    <svg viewBox="0 0 240 160" className="w-full max-w-[280px]">
      {/* Fulcrum */}
      <polygon points={`${cx},${cy + 20} ${cx - 8},${cy + 35} ${cx + 8},${cy + 35}`} fill="var(--color-text-muted)" />
      {/* Beam */}
      <g transform={`rotate(${tilt}, ${cx}, ${beamY})`} style={{ transition: "transform 0.5s ease-out" }}>
        <line x1={cx - 70} y1={beamY} x2={cx + 70} y2={beamY} stroke="var(--color-cat-tax)" strokeWidth="2" />
        {/* Old regime weight */}
        <rect
          x={cx - 85} y={beamY + 5} width="30" height={oldH} rx="3"
          fill="var(--color-loss)" opacity={0.6}
          style={{ transition: "height 0.5s ease-out" }}
        />
        <text x={cx - 70} y={beamY - 4} textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill="var(--color-loss)">
          Old
        </text>
        {/* New regime weight */}
        <rect
          x={cx + 55} y={beamY + 5} width="30" height={newH} rx="3"
          fill="var(--color-gain)" opacity={0.6}
          style={{ transition: "height 0.5s ease-out" }}
        />
        <text x={cx + 70} y={beamY - 4} textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill="var(--color-gain)">
          New
        </text>
      </g>
      {/* Baseline */}
      <line x1="20" y1={cy + 36} x2="220" y2={cy + 36} stroke="var(--color-border)" strokeWidth="1" />
      {/* Savings label */}
      {oldTax > newTax && (
        <text x={cx} y={cy + 55} textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono)" fill="var(--color-gain)">
          New saves ₹{(oldTax - newTax).toLocaleString("en-IN")}
        </text>
      )}
    </svg>
  );
}