"use client";

import { motion } from "framer-motion";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const mounted = useIsMounted();

  return (
    <motion.div
      initial={mounted ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}