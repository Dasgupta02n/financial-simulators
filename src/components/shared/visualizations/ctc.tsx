"use client";

interface Props {
  data: Record<string, number>;
}

export function CTCVisualization({ data }: Props) {
  const grossCTC = data.grossCTC || 1500000;
  const inHand = data.inHand || 1000000;
  const inHandPct = inHand / Math.max(grossCTC, 1);

  return (
    <svg viewBox="0 0 240 160" className="w-full max-w-[280px]">
      {/* Funnel shape */}
      <path d="M30 25 H210 L170 130 H70 Z" fill="var(--color-cat-ctc)" opacity="0.06" stroke="var(--color-cat-ctc)" strokeWidth="1" />
      {/* CTC bar (full width) */}
      <rect x="30" y="40" width="180" height="16" rx="3" fill="var(--color-cat-ctc)" opacity="0.5" />
      <text x="120" y="52" textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill="var(--color-text-primary)">
        Gross CTC
      </text>
      {/* Deduction bar */}
      <rect x="50" y="65" width="140" height="10" rx="2" fill="var(--color-loss)" opacity="0.3" />
      <text x="120" y="73" textAnchor="middle" fontSize="6" fontFamily="var(--font-geist-mono)" fill="var(--color-text-muted)">
        PF + Tax + Benefits
      </text>
      {/* In-hand bar — reactive */}
      <rect
        x="65" y="85" width={Math.max(inHandPct * 130, 10)} height="14" rx="3"
        fill="var(--color-gain)" opacity="0.7"
        style={{ transition: "width 0.5s ease-out" }}
      />
      <text x="130" y="95" textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill="var(--color-gain)">
        In-Hand ₹{(inHand / 100000).toFixed(1)}L
      </text>
      {/* Percentage */}
      <text x="120" y="120" textAnchor="middle" fontSize="9" fontFamily="var(--font-geist-mono)" fill="var(--color-text-primary)">
        {Math.round(inHandPct * 100)}% take-home
      </text>
      {/* Arrow down */}
      <path d="M120 28 L120 35 M116 32 L120 36 L124 32" stroke="var(--color-text-muted)" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}