"use client";

// Animated SVG icons for each calculator category

interface IconProps {
  className?: string;
  color?: string;
}

// SIP — Growing bar chart
export function SIPIcon({ className, color = "var(--color-cat-sip)" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <rect x="6" y="32" width="6" height="10" rx="1" fill={color} opacity="0.4">
        <animate attributeName="height" from="0" to="10" dur="0.6s" fill="freeze" />
        <animate attributeName="y" from="42" to="32" dur="0.6s" fill="freeze" />
      </rect>
      <rect x="16" y="24" width="6" height="18" rx="1" fill={color} opacity="0.7">
        <animate attributeName="height" from="0" to="18" dur="0.8s" fill="freeze" />
        <animate attributeName="y" from="42" to="24" dur="0.8s" fill="freeze" />
      </rect>
      <rect x="26" y="14" width="6" height="28" rx="1" fill={color} opacity="0.85">
        <animate attributeName="height" from="0" to="28" dur="1s" fill="freeze" />
        <animate attributeName="y" from="42" to="14" dur="1s" fill="freeze" />
      </rect>
      <rect x="36" y="6" width="6" height="36" rx="1" fill={color}>
        <animate attributeName="height" from="0" to="36" dur="1.2s" fill="freeze" />
        <animate attributeName="y" from="42" to="6" dur="1.2s" fill="freeze" />
      </rect>
    </svg>
  );
}

// EMI — Split pie/donut
export function EMIIcon({ className, color = "var(--color-cat-emi)" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <circle cx="24" cy="24" r="16" fill={color} opacity="0.2" />
      <path d="M24 8 A16 16 0 0 1 38.4 32 L24 24Z" fill={color} opacity="0.85">
        <animate attributeName="d" from="M24 8 A16 16 0 0 1 24 8 L24 24Z" to="M24 8 A16 16 0 0 1 38.4 32 L24 24Z" dur="1s" fill="freeze" />
      </path>
      <path d="M38.4 32 A16 16 0 0 1 9.6 32 L24 24Z" fill="var(--color-loss)" opacity="0.6">
        <animate attributeName="d" from="M24 8 A16 16 0 0 1 24 8 L24 24Z" to="M38.4 32 A16 16 0 0 1 9.6 32 L24 24Z" dur="1s" fill="freeze" />
      </path>
      <circle cx="24" cy="24" r="8" fill="var(--color-surface)" />
      <text x="24" y="27" textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono)" fill="var(--color-text-primary)">₹</text>
    </svg>
  );
}

// Tax — Balance scale
export function TaxIcon({ className, color = "var(--color-cat-tax)" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <line x1="24" y1="8" x2="24" y2="38" stroke={color} strokeWidth="2" />
      <line x1="8" y1="18" x2="40" y2="18" stroke={color} strokeWidth="2">
        <animateTransform attributeName="transform" type="rotate" from="-5 24 8" to="0 24 8" dur="1.5s" fill="freeze" />
      </line>
      <rect x="4" y="20" width="10" height="6" rx="1" fill={color} opacity="0.7">
        <animate attributeName="opacity" from="0.3" to="0.7" dur="1s" fill="freeze" />
      </rect>
      <rect x="34" y="20" width="10" height="6" rx="1" fill="var(--color-gain)" opacity="0.7">
        <animate attributeName="opacity" from="0.3" to="0.7" dur="1s" begin="0.3s" fill="freeze" />
      </rect>
      <circle cx="24" cy="8" r="3" fill={color} />
      <line x1="6" y1="40" x2="42" y2="40" stroke="var(--color-border)" strokeWidth="1" />
    </svg>
  );
}

// Accumulator — Stacked coins
export function AccumIcon({ className, color = "var(--color-cat-accum)" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      {[36, 30, 24, 18].map((y, i) => (
        <ellipse key={i} cx="24" cy={y} rx="12" ry="3" fill={color} opacity={0.4 + i * 0.2}>
          <animate attributeName="cy" from="42" to={y} dur={`${0.4 + i * 0.2}s`} fill="freeze" />
          <animate attributeName="opacity" from="0" to={0.4 + i * 0.2} dur={`${0.4 + i * 0.2}s`} fill="freeze" />
        </ellipse>
      ))}
      <text x="24" y="14" textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill={color}>+</text>
    </svg>
  );
}

// FD — Lock with rupee
export function FDIcon({ className, color = "var(--color-cat-fd)" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <rect x="10" y="20" width="28" height="22" rx="4" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
      <path d="M18 20 V14 A6 6 0 0 1 30 14 V20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="31" r="3" fill={color}>
        <animate attributeName="r" values="3;3.5;3" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="24" y="33" textAnchor="middle" fontSize="6" fontFamily="var(--font-geist-mono)" fill="var(--color-surface)">₹</text>
    </svg>
  );
}

// SWP — Leaking bucket
export function SWPIcon({ className, color = "var(--color-cat-swp)" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <path d="M12 12 L16 40 H32 L36 12 Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      <path d="M18 24 H30" stroke="var(--color-cat-swp)" strokeWidth="1" opacity="0.4" />
      <path d="M17 30 H31" stroke="var(--color-cat-swp)" strokeWidth="1" opacity="0.3" />
      <path d="M16 36 H28" stroke="var(--color-cat-swp)" strokeWidth="1" opacity="0.2" />
      {/* Drip */}
      <circle cx="24" cy="44" r="1.5" fill={color}>
        <animate attributeName="cy" values="42;46;42" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <line x1="24" y1="40" x2="24" y2="43" stroke={color} strokeWidth="1" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
      </line>
    </svg>
  );
}

// FIRE — Sunrise horizon
export function FIREIcon({ className, color = "var(--color-cat-fire)" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      {/* Horizon line */}
      <line x1="4" y1="32" x2="44" y2="32" stroke="var(--color-border)" strokeWidth="1" />
      {/* Sun */}
      <circle cx="24" cy="28" r="6" fill={color} opacity="0.8">
        <animate attributeName="cy" values="38;28" dur="1s" fill="freeze" />
        <animate attributeName="opacity" values="0;0.8" dur="1s" fill="freeze" />
      </circle>
      {/* Rays */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 24 + Math.cos(rad) * 8;
        const y1 = 28 + Math.sin(rad) * 8;
        const x2 = 24 + Math.cos(rad) * 12;
        const y2 = 28 + Math.sin(rad) * 12;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" opacity="0.4" />;
      })}
      {/* Growth line */}
      <path d="M8 32 Q16 20 24 22 Q32 24 40 14" fill="none" stroke="var(--color-gain)" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6">
        <animate attributeName="strokeDashoffset" from="40" to="0" dur="2s" fill="freeze" />
      </path>
    </svg>
  );
}

// CTC — Funnel filter
export function CTCIcon({ className, color = "var(--color-cat-ctc)" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <path d="M8 8 H40 L28 28 V40 H20 V28 Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      {/* Layers filtering down */}
      <rect x="12" y="14" width="24" height="3" rx="1" fill="var(--color-loss)" opacity="0.5">
        <animate attributeName="opacity" from="0" to="0.5" dur="0.5s" fill="freeze" />
      </rect>
      <rect x="15" y="20" width="18" height="3" rx="1" fill="var(--color-warn)" opacity="0.5">
        <animate attributeName="opacity" from="0" to="0.5" dur="0.7s" fill="freeze" />
      </rect>
      <rect x="18" y="26" width="12" height="3" rx="1" fill="var(--color-gain)" opacity="0.7">
        <animate attributeName="opacity" from="0" to="0.7" dur="0.9s" fill="freeze" />
      </rect>
      <text x="24" y="38" textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill="var(--color-gain)">₹</text>
    </svg>
  );
}

// NPS — Piggy bank with coins
export function NPSIcon({ className, color = "var(--color-cat-nps)" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      {/* Bank body */}
      <ellipse cx="22" cy="28" rx="12" ry="9" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      {/* Slot */}
      <line x1="18" y1="20" x2="26" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Coin dropping in */}
      <circle cx="22" cy="14" r="3" fill="var(--color-warn)" opacity="0.8">
        <animate attributeName="cy" values="10;20" dur="1s" fill="freeze" />
        <animate attributeName="opacity" values="0.8;0" dur="1s" fill="freeze" />
      </circle>
      <text x="22" y="16" textAnchor="middle" fontSize="5" fontFamily="var(--font-geist-mono)" fill="var(--color-ink)">₹</text>
      {/* Legs */}
      <line x1="14" y1="36" x2="14" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="36" x2="30" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Goal — Target bullseye
export function GoalIcon({ className, color = "var(--color-cat-goal)" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <circle cx="24" cy="24" r="16" fill="none" stroke={color} strokeWidth="1.5" opacity="0.2">
        <animate attributeName="r" values="12;16" dur="1.5s" fill="freeze" />
      </circle>
      <circle cx="24" cy="24" r="10" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4">
        <animate attributeName="r" values="8;10" dur="1s" fill="freeze" />
      </circle>
      <circle cx="24" cy="24" r="4" fill={color} opacity="0.8">
        <animate attributeName="r" values="2;4" dur="0.8s" fill="freeze" />
      </circle>
      {/* Ripple */}
      <circle cx="24" cy="24" r="8" fill="none" stroke={color} strokeWidth="1" opacity="0">
        <animate attributeName="r" values="4;20" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}