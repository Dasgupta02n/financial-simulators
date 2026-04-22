"use client";

interface Props {
  data: Record<string, number>;
}

export function NPSVisualization({ data }: Props) {
  const totalCorpus = data.totalCorpus || 5000000;
  const monthlyPension = data.monthlyPension || 20000;

  const corpusBar = Math.min(totalCorpus / 10000000, 1) * 80;

  return (
    <svg viewBox="0 0 240 160" className="w-full max-w-[280px]">
      {/* Piggy bank body */}
      <ellipse cx="70" cy="60" rx="30" ry="22" fill="var(--color-cat-nps)" opacity="0.1" stroke="var(--color-cat-nps)" strokeWidth="1.5" />
      {/* Slot */}
      <line x1="58" y1="40" x2="78" y2="40" stroke="var(--color-cat-nps)" strokeWidth="2" strokeLinecap="round" />
      {/* Coin dropping */}
      <circle cx="68" cy="28" r="5" fill="var(--color-warn)" opacity="0.7">
        <animate attributeName="cy" values="20;38" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0" dur="1.5s" repeatCount="indefinite" />
      </circle>
      {/* Legs */}
      <line x1="48" y1="80" x2="48" y2="88" stroke="var(--color-cat-nps)" strokeWidth="2" strokeLinecap="round" />
      <line x1="88" y1="80" x2="88" y2="88" stroke="var(--color-cat-nps)" strokeWidth="2" strokeLinecap="round" />
      {/* Corpus bar — reactive */}
      <rect x="120" y="30" width="90" height="12" rx="6" fill="var(--color-border)" />
      <rect
        x="120" y="30" width={Math.max(corpusBar, 4)} height="12" rx="6"
        fill="var(--color-cat-nps)" opacity="0.7"
        style={{ transition: "width 0.6s ease-out" }}
      />
      <text x="165" y="39" textAnchor="middle" fontSize="6" fontFamily="var(--font-geist-mono)" fill="var(--color-text-primary)">
        Corpus
      </text>
      {/* Pension info */}
      <rect x="120" y="55" width="90" height="35" rx="6" fill="var(--color-surface-hover)" stroke="var(--color-border)" strokeWidth="1" />
      <text x="165" y="70" textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill="var(--color-text-muted)">
        Monthly Pension
      </text>
      <text x="165" y="82" textAnchor="middle" fontSize="10" fontFamily="var(--font-geist-mono)" fill="var(--color-gain)" fontWeight="bold">
        ₹{(monthlyPension / 1000).toFixed(0)}K
      </text>
      {/* Arrow connecting bank to bar */}
      <path d="M100 60 L118 45" fill="none" stroke="var(--color-text-muted)" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
    </svg>
  );
}