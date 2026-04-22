"use client";

interface Props {
  data: Record<string, number>;
}

export function GoalVisualization({ data }: Props) {
  const targetAmount = data.targetAmount || 5000000;
  const currentSaved = data.currentSaved || 2000000;
  const monthlySIPNeeded = data.monthlySIPNeeded || 15000;
  const progress = currentSaved / Math.max(targetAmount, 1);

  const cx = 120, cy = 70;

  return (
    <svg viewBox="0 0 240 160" className="w-full max-w-[280px]">
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r="40" fill="none" stroke="var(--color-border)" strokeWidth="6" />
      {/* Progress arc — reactive */}
      <circle
        cx={cx} cy={cy} r="40" fill="none" stroke="var(--color-cat-goal)" strokeWidth="6"
        strokeDasharray={`${Math.max(progress * 251, 2)} 251`}
        strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} opacity="0.7"
        style={{ transition: "stroke-dasharray 0.6s ease-out" }}
      />
      {/* Middle ring */}
      <circle cx={cx} cy={cy} r="28" fill="none" stroke="var(--color-border)" strokeWidth="3" />
      {/* Center */}
      <circle cx={cx} cy={cy} r="14" fill="var(--color-cat-goal)" opacity="0.2" stroke="var(--color-cat-goal)" strokeWidth="1">
        <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fontFamily="var(--font-geist-mono)" fill="var(--color-text-primary)" fontWeight="bold">
        {Math.round(progress * 100)}%
      </text>
      {/* Ripples */}
      <circle cx={cx} cy={cy} r="40" fill="none" stroke="var(--color-cat-goal)" strokeWidth="1" opacity="0">
        <animate attributeName="r" values="40;60" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Label */}
      <text x={cx} y="130" textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill="var(--color-text-muted)">
        SIP needed: ₹{(monthlySIPNeeded / 1000).toFixed(0)}K/mo
      </text>
    </svg>
  );
}