"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { staggerItem } from "@/lib/motionVariants";

interface ResultCardProps {
  title: string;
  icon?: string;
  children: ReactNode;
  accent?: "cyan" | "purple" | "amber" | "red" | "emerald";
  delay?: number;
  className?: string;
}

const accentMap = {
  cyan: "border-cyan-500/20 shadow-cyan-500/5",
  purple: "border-purple-500/20 shadow-purple-500/5",
  amber: "border-amber-500/20 shadow-amber-500/5",
  red: "border-red-500/20 shadow-red-500/5",
  emerald: "border-emerald-500/20 shadow-emerald-500/5",
};

const headerAccentMap = {
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  amber: "text-amber-400",
  red: "text-red-400",
  emerald: "text-emerald-400",
};

export default function ResultCard({
  title,
  icon,
  children,
  accent = "cyan",
  delay = 0,
  className = "",
}: ResultCardProps) {
  return (
    <motion.div
      className={`bg-[#121826]/80 backdrop-blur-sm border rounded-2xl shadow-lg overflow-hidden
        ${accentMap[accent]} ${className}`}
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-800/60">
        {icon && (
          <span className="text-lg leading-none">{icon}</span>
        )}
        <h3 className={`text-xs font-bold uppercase tracking-widest ${headerAccentMap[accent]}`}>
          {title}
        </h3>
      </div>

      {/* Content */}
      <div className="px-6 py-5">{children}</div>
    </motion.div>
  );
}