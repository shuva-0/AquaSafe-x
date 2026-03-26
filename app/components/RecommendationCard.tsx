"use client";
import { motion } from "framer-motion";
import { staggerItem } from "@/lib/motionVariants";

interface RecommendationCardProps {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
}

const tiers = [
  {
    key: "immediate" as const,
    label: "Immediate Action",
    icon: "⚡",
    accent: "from-red-500/20 to-orange-500/10",
    border: "border-red-500/25",
    iconBg: "bg-red-500/15 text-red-400",
    dot: "bg-red-400",
  },
  {
    key: "shortTerm" as const,
    label: "Short-Term",
    icon: "🕐",
    accent: "from-amber-500/15 to-yellow-500/10",
    border: "border-amber-500/25",
    iconBg: "bg-amber-500/15 text-amber-400",
    dot: "bg-amber-400",
  },
  {
    key: "longTerm" as const,
    label: "Long-Term",
    icon: "🌿",
    accent: "from-emerald-500/15 to-teal-500/10",
    border: "border-emerald-500/25",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    dot: "bg-emerald-400",
  },
];

export default function RecommendationCard({
  immediate,
  shortTerm,
  longTerm,
}: RecommendationCardProps) {
  const data = { immediate, shortTerm, longTerm };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tiers.map((tier, ti) => (
        <motion.div
          key={tier.key}
          className={`bg-gradient-to-br ${tier.accent} border ${tier.border} rounded-2xl p-5 backdrop-blur-sm`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: ti * 0.1, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${tier.iconBg}`}>
              {tier.icon}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              {tier.label}
            </span>
          </div>

          <ul className="flex flex-col gap-2.5">
            {data[tier.key].map((item, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-300"
                variants={staggerItem}
                initial="hidden"
                animate="visible"
                transition={{ delay: ti * 0.1 + i * 0.06 }}
              >
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${tier.dot}`} />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}