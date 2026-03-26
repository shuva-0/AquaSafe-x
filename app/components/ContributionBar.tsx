"use client";
import { motion } from "framer-motion";
import { useState } from "react";

interface ContributionBarProps {
  param: string;
  impact: number; // 0–100
  index: number;
}

const paramMeta: Record<string, { label: string; tooltip: string; color: string }> = {
  pH: {
    label: "pH Level",
    tooltip: "Measures acidity/alkalinity. WHO safe range: 6.5–8.5",
    color: "from-cyan-500 to-blue-500",
  },
  TDS: {
    label: "TDS",
    tooltip: "Total Dissolved Solids — minerals & salts. WHO limit: <500mg/L",
    color: "from-purple-500 to-violet-500",
  },
  turbidity: {
    label: "Turbidity",
    tooltip: "Cloudiness from particles. WHO limit: <4 NTU",
    color: "from-amber-500 to-orange-500",
  },
  temperature: {
    label: "Temperature",
    tooltip: "Water temp. Extreme values accelerate microbial growth.",
    color: "from-rose-500 to-pink-500",
  },
  dissolvedOxygen: {
    label: "Dissolved O₂",
    tooltip: "Oxygen in water. Low DO indicates contamination risk.",
    color: "from-emerald-500 to-teal-500",
  },
  conductivity: {
    label: "Conductivity",
    tooltip: "Electrical conductivity from dissolved ions. High = more contamination.",
    color: "from-sky-500 to-indigo-500",
  },
};

export default function ContributionBar({ param, impact, index }: ContributionBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const meta = paramMeta[param] ?? {
    label: param,
    tooltip: "Contribution to overall water quality score.",
    color: "from-cyan-500 to-purple-500",
  };

  const severity = impact > 70 ? "high" : impact > 40 ? "medium" : "low";
  const severityColor =
    severity === "high"
      ? "text-red-400"
      : severity === "medium"
      ? "text-amber-400"
      : "text-emerald-400";

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-gray-300 font-medium">{meta.label}</span>
        <span className={`text-sm font-bold font-mono ${severityColor}`}>{impact.toFixed(1)}%</span>
      </div>

      <div className="h-2.5 rounded-full bg-gray-800 overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${meta.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${impact}%` }}
          transition={{ duration: 0.8, delay: index * 0.07 + 0.2, ease: "easeOut" }}
          style={{ boxShadow: `0 0 10px rgba(6,182,212,0.3)` }}
        />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          className="absolute bottom-full left-0 mb-2 z-50 bg-[#1a2436] border border-cyan-500/30
            text-xs text-gray-300 rounded-lg px-3 py-2 shadow-xl max-w-xs pointer-events-none"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          <span className="font-semibold text-cyan-400">{meta.label}: </span>
          {meta.tooltip}
          <div className="absolute bottom-[-5px] left-4 w-2 h-2 rotate-45 bg-[#1a2436] border-r border-b border-cyan-500/30" />
        </motion.div>
      )}
    </motion.div>
  );
}