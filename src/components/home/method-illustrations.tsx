export function InflationIllustration() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 mb-2 opacity-[0.15] absolute top-4 right-4">
      {/* Two diverging lines: 4% vs 6% */}
      <line x1="4" y1="40" x2="44" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="4" y1="40" x2="44" y2="12" stroke="currentColor" strokeWidth="2" />
      <text x="46" y="18" fontSize="6" fill="currentColor" fontFamily="monospace">6%</text>
      <text x="46" y="24" fontSize="5" fill="currentColor" fontFamily="monospace" opacity="0.5">4%</text>
    </svg>
  );
}

export function TaxIllustration() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 mb-2 opacity-[0.15] absolute top-4 right-4">
      {/* Tax slab blocks */}
      <rect x="4" y="8" width="18" height="8" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="4" y="20" width="30" height="8" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="4" y="32" width="40" height="8" rx="1" fill="currentColor" opacity="0.1" />
      <text x="8" y="15" fontSize="5" fill="currentColor" fontFamily="monospace" opacity="0.6">0%</text>
      <text x="8" y="27" fontSize="5" fill="currentColor" fontFamily="monospace" opacity="0.6">12.5%</text>
      <text x="8" y="39" fontSize="5" fill="currentColor" fontFamily="monospace" opacity="0.6">30%</text>
    </svg>
  );
}

export function NoProductIllustration() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 mb-2 opacity-[0.15] absolute top-4 right-4">
      {/* Shopping bag with X */}
      <rect x="12" y="16" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path d="M18 10 Q24 4 30 10" stroke="currentColor" strokeWidth="1.5" opacity="0.3" fill="none" />
      <line x1="20" y1="24" x2="28" y2="32" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <line x1="28" y1="24" x2="20" y2="32" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}