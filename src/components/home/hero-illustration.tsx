"use client";

import { motion } from "framer-motion";

export function HeroIllustration() {
  return (
    <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-72 h-64">
      <svg viewBox="0 0 300 220" fill="none" className="w-full h-full">
        {/* Background glow */}
        <circle cx="150" cy="110" r="100" fill="#D8400E" opacity="0.04" />

        {/* 12% bar (tall, faded) */}
        <motion.rect
          x="40" y="30" width="50" height="140" rx="4"
          fill="#D8400E" opacity="0.15"
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ transformOrigin: "bottom" }}
        />
        <text x="65" y="22" textAnchor="middle" fill="#D8400E" opacity="0.3"
          fontSize="12" fontFamily="monospace" fontWeight="bold">12%</text>
        <text x="65" y="195" textAnchor="middle" fill="white" opacity="0.2"
          fontSize="9" fontFamily="monospace">Advertised</text>

        {/* Tax slice */}
        <motion.rect
          x="130" y="120" width="40" height="50" rx="3"
          fill="#D8400E" opacity="0.1"
          initial={{ opacity: 0 }} animate={{ opacity: 0.1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />
        <text x="150" y="150" textAnchor="middle" fill="#D8400E" opacity="0.25"
          fontSize="8" fontFamily="monospace">Tax</text>

        {/* 3.8% bar (short, bold) */}
        <motion.rect
          x="200" y="140" width="50" height="30" rx="4"
          fill="#D8400E" opacity="0.8"
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ transformOrigin: "bottom" }}
        />
        <text x="225" y="135" textAnchor="middle" fill="#D8400E" opacity="0.9"
          fontSize="13" fontFamily="monospace" fontWeight="bold">3.8%</text>
        <text x="225" y="195" textAnchor="middle" fill="white" opacity="0.2"
          fontSize="9" fontFamily="monospace">Reality</text>

        {/* Arrow showing erosion */}
        <motion.path
          d="M 90 100 Q 150 130 195 150"
          stroke="#D8400E" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        />
      </svg>
    </div>
  );
}