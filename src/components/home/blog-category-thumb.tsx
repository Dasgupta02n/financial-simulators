interface BlogCategoryThumbProps {
  category: string;
}

const illustrations: Record<string, (props: { className?: string }) => React.ReactElement> = {
  retirement: ({ className }) => (
    <svg viewBox="0 0 200 150" className={className} fill="none">
      <rect width="200" height="150" fill="currentColor" opacity="0.04" />
      {/* Sun/horizon */}
      <circle cx="160" cy="50" r="30" fill="#D8400E" opacity="0.15" />
      <line x1="0" y1="90" x2="200" y2="90" stroke="#D8400E" strokeWidth="1" opacity="0.3" />
      {/* Beach umbrella */}
      <path d="M70 90 L70 45" stroke="#D8400E" strokeWidth="2" opacity="0.6" />
      <path d="M40 50 Q70 30 100 50" stroke="#D8400E" strokeWidth="2" fill="#D8400E" opacity="0.12" />
      {/* Waves */}
      <path d="M0 105 Q50 95 100 105 Q150 115 200 105" stroke="#D8400E" strokeWidth="1" opacity="0.2" />
      <path d="M0 115 Q50 105 100 115 Q150 125 200 115" stroke="#D8400E" strokeWidth="1" opacity="0.12" />
      {/* ₹ symbol */}
      <text x="100" y="80" textAnchor="middle" fill="#D8400E" fontSize="24" opacity="0.25" fontFamily="serif">₹</text>
    </svg>
  ),
  "personal-finance": ({ className }) => (
    <svg viewBox="0 0 200 150" className={className} fill="none">
      <rect width="200" height="150" fill="currentColor" opacity="0.04" />
      {/* Wallet shape */}
      <rect x="50" y="40" width="100" height="70" rx="8" stroke="#D8400E" strokeWidth="1.5" opacity="0.3" />
      <rect x="55" y="35" width="90" height="15" rx="4" stroke="#D8400E" strokeWidth="1.5" fill="#D8400E" opacity="0.06" />
      {/* Cards */}
      <rect x="60" y="55" width="50" height="30" rx="4" stroke="#D8400E" strokeWidth="1" opacity="0.2" />
      <rect x="65" y="60" width="20" height="3" rx="1" fill="#D8400E" opacity="0.2" />
      {/* ₹ coin */}
      <circle cx="145" cy="70" r="18" stroke="#D8400E" strokeWidth="1.5" opacity="0.3" />
      <text x="145" y="76" textAnchor="middle" fill="#D8400E" fontSize="16" opacity="0.4" fontFamily="serif">₹</text>
    </svg>
  ),
  "tax-ctc": ({ className }) => (
    <svg viewBox="0 0 200 150" className={className} fill="none">
      <rect width="200" height="150" fill="currentColor" opacity="0.04" />
      {/* Balance scale */}
      <line x1="100" y1="30" x2="100" y2="80" stroke="#D8400E" strokeWidth="2" opacity="0.4" />
      <line x1="40" y1="50" x2="160" y2="50" stroke="#D8400E" strokeWidth="1.5" opacity="0.3" />
      {/* Left pan */}
      <path d="M30 50 L40 50 L35 70 L25 70 Z" stroke="#D8400E" strokeWidth="1" opacity="0.25" fill="#D8400E" fillOpacity="0.08" />
      <text x="30" y="85" textAnchor="middle" fill="#D8400E" fontSize="10" opacity="0.35" fontFamily="monospace">OLD</text>
      {/* Right pan */}
      <path d="M160 50 L170 50 L165 70 L155 70 Z" stroke="#D8400E" strokeWidth="1" opacity="0.25" fill="#D8400E" fillOpacity="0.08" />
      <text x="165" y="85" textAnchor="middle" fill="#D8400E" fontSize="10" opacity="0.35" fontFamily="monospace">NEW</text>
      {/* Base */}
      <rect x="85" y="80" width="30" height="6" rx="3" fill="#D8400E" opacity="0.2" />
      {/* ₹ symbols */}
      <text x="33" y="68" textAnchor="middle" fill="#D8400E" fontSize="14" opacity="0.3" fontFamily="serif">₹</text>
      <text x="163" y="68" textAnchor="middle" fill="#D8400E" fontSize="14" opacity="0.3" fontFamily="serif">₹</text>
    </svg>
  ),
  "markets-policy": ({ className }) => (
    <svg viewBox="0 0 200 150" className={className} fill="none">
      <rect width="200" height="150" fill="currentColor" opacity="0.04" />
      {/* Candlestick pattern */}
      {[40, 70, 100, 130, 160].map((x, i) => (
        <g key={i}>
          {/* Wick */}
          <line x1={x} y1={30 + (i % 2) * 20} x2={x} y2={100 - (i % 3) * 15} stroke="#D8400E" strokeWidth="1" opacity="0.25" />
          {/* Body */}
          <rect x={x - 8} y={45 + (i % 2) * 10} width="16" height={30 - (i % 3) * 5} rx="2"
            fill={i % 2 === 0 ? "#D8400E" : "transparent"} stroke="#D8400E" strokeWidth="1"
            opacity={i % 2 === 0 ? 0.15 : 0.25} />
        </g>
      ))}
      {/* Trend line */}
      <path d="M35 80 Q100 60 165 40" stroke="#D8400E" strokeWidth="1.5" opacity="0.2" strokeDasharray="4 4" />
    </svg>
  ),
};

function DefaultThumb({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" className={className} fill="none">
      <rect width="200" height="150" fill="currentColor" opacity="0.04" />
      {/* Abstract line chart */}
      <polyline points="30,110 60,90 90,100 120,60 150,70 180,40"
        stroke="#D8400E" strokeWidth="1.5" opacity="0.25" fill="none" />
      {/* Grid lines */}
      <line x1="30" y1="120" x2="180" y2="120" stroke="#D8400E" strokeWidth="0.5" opacity="0.1" />
      <line x1="30" y1="80" x2="180" y2="80" stroke="#D8400E" strokeWidth="0.5" opacity="0.06" strokeDasharray="4 6" />
      <text x="100" y="100" textAnchor="middle" fill="#D8400E" fontSize="20" opacity="0.12" fontFamily="monospace">₹</text>
    </svg>
  );
}

export function BlogCategoryThumb({ category }: BlogCategoryThumbProps) {
  const Illustration = illustrations[category];
  const className = "w-full h-full";
  return Illustration ? <Illustration className={className} /> : <DefaultThumb className={className} />;
}