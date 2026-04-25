"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface CalcCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  tag?: string;
  index: number;
}

export function CalcCard({ id, name, slug, description, tag, index }: CalcCardProps) {
  return (
    <Link href={`/${slug}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.06 }}
        className="relative flex flex-col gap-4 p-8 bg-white border border-border hover:border-sienna/50
          transition-all duration-300 group-hover:shadow-md"
      >
        {/* Tag only — no numbered index */}
        {tag && (
          <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 border border-sienna/30 text-sienna font-mono font-semibold w-fit">
            {tag}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-text-primary group-hover:text-sienna transition-colors duration-200">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>

        {/* Arrow */}
        <span className="text-xs font-mono text-sienna opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-2 group-hover:gap-3">
          Open Calculator <span className="text-sienna">&rarr;</span>
        </span>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-sienna group-hover:w-full transition-all duration-500" />
      </motion.div>
    </Link>
  );
}