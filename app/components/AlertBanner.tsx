"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Alert } from "@/lib/types";

interface AlertBannerProps {
  alerts: Alert[];
}

const severityConfig = {
  INFO: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    icon: "ℹ",
    label: "INFO",
  },
  WARNING: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    icon: "⚠",
    label: "WARNING",
  },
  CRITICAL: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    icon: "✕",
    label: "CRITICAL",
  },
};

export default function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {alerts.map((alert, i) => {
          if (dismissed.has(i)) return null;

          const cfg = severityConfig[alert.level];

          return (
            <motion.div
              key={i}
              className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${cfg.bg} ${cfg.border} relative overflow-hidden`}
              initial={{ opacity: 0, x: -24, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 24, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* CRITICAL pulse */}
              {alert.level === "CRITICAL" && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  animate={{
                    boxShadow: [
                      "inset 0 0 0px rgba(239,68,68,0)",
                      "inset 0 0 12px rgba(239,68,68,0.15)",
                      "inset 0 0 0px rgba(239,68,68,0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <span className={`text-lg mt-0.5 ${cfg.text}`}>
                {cfg.icon}
              </span>

              <div className="flex-1">
                <span className={`text-[10px] font-black uppercase ${cfg.text} mr-2`}>
                  {cfg.label}
                </span>
                <span className="text-sm text-gray-300">
                  {alert.message}
                </span>
              </div>

              <button
                onClick={() =>
                  setDismissed((s) => {
                    const next = new Set<number>(s);
                    next.add(i);
                    return next;
                  })
                }
                className="text-gray-600 hover:text-gray-400 text-xs"
              >
                ✕
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}