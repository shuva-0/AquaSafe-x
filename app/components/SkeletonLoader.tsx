"use client";

import { motion } from "framer-motion";
import React from "react";

type SkeletonBlockProps = {
  className?: string;
  style?: React.CSSProperties;
};

function SkeletonBlock({ className = "", style }: SkeletonBlockProps) {
  return (
    <motion.div
      className={`rounded-lg bg-gray-800/60 overflow-hidden relative ${className}`}
      style={style}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

export default function SkeletonLoader() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Score Circle */}
      <div className="flex justify-center">
        <SkeletonBlock className="w-56 h-56 rounded-full" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[#121826] border border-gray-800 rounded-2xl p-5 space-y-3"
          >
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-8 w-16" />
            <SkeletonBlock className="h-2 w-full" />
            <SkeletonBlock className="h-2 w-3/4" />
          </div>
        ))}
      </div>

      {/* Contribution Bars */}
      <div className="bg-[#121826] border border-gray-800 rounded-2xl p-5 space-y-4">
        <SkeletonBlock className="h-3 w-32 mb-4" />

        {[80, 60, 45, 30].map((w, i) => (
          <div key={i} className="space-y-1">
            <SkeletonBlock className="h-2.5 w-20" />

            <SkeletonBlock
              className="h-2.5"
              style={{ width: `${w}%` }}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}