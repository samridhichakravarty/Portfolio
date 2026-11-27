"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Springy scroll-in for non-critical content. Never wrap the hero headline in this.
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ type: "spring", stiffness: 120, damping: 19, delay }}
    >
      {children}
    </motion.div>
  );
}
