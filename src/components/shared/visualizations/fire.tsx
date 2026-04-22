"use client";

interface Props {
  data: Record<string, number>;
}

export function FIREVisualization({ data }: Props) {
  const fireNumber = data.fireNumber || 15000000;
  const corpusAtRetirement = data.corpusAtRetirement || 12000000;
  const onTrack = corpusAtRetirement >= fireNumber;
  const fillPct = Math.min(corpusAtRetirement / Math.max(fireNumber, 1), 1.5);

  const sunY = 25;
  const horizonY = 80;

  return (
    <svg viewBox="0 0 240 160" className="w-full max-w-[280px]">
      {/* Horizon */}
      <line x1="20" y1={horizonY} x2="220" y2={horizonY} stroke="var(--color-border)" strokeWidth="1" />
      {/* Sun */}
      <circle cx="60" cy={sunY} r="10" fill="var(--color-cat-fire)" opacity="0.6" />
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 60 + Math.cos(rad) * 13;
        const y1 = sunY + Math.sin(rad) * 13;
        const x2 = 60 + Math.cos(rad) * 18;
        const y2 = sunY + Math.sin(rad) * 18;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-cat-fire)" strokeWidth="1" opacity="0.3" />;
      })}
      {/* Progress bar — reactive */}
      <rect x="90" y="90" width="120" height="12" rx="6" fill="var(--color-border)" />
      <rect
        x="90" y="90" width={Math.max(fillPct * 120, 4)} height="12" rx="6"
        fill={onTrack ? "var(--color-gain)" : "var(--color-loss)"} opacity="0.7"
        style={{ transition: "width 0.6s ease-out" }}
      />
      <text x="150" y="99" textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill="var(--color-text-primary)">
        {Math.round(fillPct * 100)}% of FIRE
      </text>
      {/* Status */}
      <text x="150" y="120" textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono)"
        fill={onTrack ? "var(--color-gain)" : "var(--color-loss)"}>
        {onTrack ? "On Track" : "Behind Target"}
      </text>
      {/* Mountain silhouette */}
      <path d="M20 80 L50 55 L70 68 L100 40 L130 65 L160 50 L190 60 L220 80" fill="none"
        stroke="var(--color-text-muted)" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}