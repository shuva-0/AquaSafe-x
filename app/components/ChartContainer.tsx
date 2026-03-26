"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: number;
  delay?: number;
}

export default function ChartContainer({
  title,
  subtitle,
  children,
  height = 260,
  delay = 0,
}: ChartContainerProps) {
  return (
    <motion.div
      className="bg-[#121826]/80 backdrop-blur-sm border border-gray-800/60 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="px-6 py-4 border-b border-gray-800/60">
        <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">{title}</h3>
        {subtitle && (
          <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="px-2 py-4" style={{ height }}>
        {children}
      </div>
    </motion.div>
  );
}