"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface ScoreIndicatorProps {
  score: number; // 0–100
  wqi: number;
  status: "Safe" | "Unsafe";
  confidence: number;
}

function getColor(score: number) {
  if (score >= 75) return { stroke: "#06b6d4", glow: "rgba(6,182,212,0.5)", text: "text-cyan-400" };
  if (score >= 50) return { stroke: "#f59e0b", glow: "rgba(245,158,11,0.5)", text: "text-amber-400" };
  return { stroke: "#ef4444", glow: "rgba(239,68,68,0.5)", text: "text-red-400" };
}

export default function ScoreIndicator({ score, wqi, status, confidence }: ScoreIndicatorProps) {
  const countRef = useRef<HTMLSpanElement>(null);
  const wqiRef = useRef<HTMLSpanElement>(null);
  const motionScore = useMotionValue(0);
  const motionWqi = useMotionValue(0);

  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const colors = getColor(score);

  useEffect(() => {
    const scoreCtrl = animate(motionScore, score, { duration: 1.4, ease: "easeOut" });
    const wqiCtrl = animate(motionWqi, wqi, { duration: 1.4, ease: "easeOut" });

    const unsubScore = motionScore.on("change", (v) => {
      if (countRef.current) countRef.current.textContent = Math.round(v).toString();
    });
    const unsubWqi = motionWqi.on("change", (v) => {
      if (wqiRef.current) wqiRef.current.textContent = Math.round(v).toString();
    });

    return () => {
      scoreCtrl.stop();
      wqiCtrl.stop();
      unsubScore();
      unsubWqi();
    };
  }, [score, wqi]);

  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
    >
      {/* Circular Progress */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Glow layer */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{ background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)` }}
        />

        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Track */}
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#1e2d3d" strokeWidth="10" />
          {/* Progress */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 8px ${colors.stroke})` }}
          />
        </svg>

        {/* Inner content */}
        <div className="flex flex-col items-center z-10">
          <div className={`text-5xl font-black font-mono tracking-tighter ${colors.text}`}>
            <span ref={countRef}>0</span>
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Safety Score</div>
          <div
            className={`mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${
              status === "Safe"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {status}
          </div>
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-white/[0.03] border border-gray-800 rounded-xl p-3 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">WQI</div>
          <div className="text-2xl font-black font-mono text-purple-400">
            <span ref={wqiRef}>0</span>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-gray-800 rounded-xl p-3 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Confidence</div>
          <div className="text-2xl font-black font-mono text-cyan-400">{confidence}<span className="text-sm text-gray-500">%</span></div>
        </div>
      </div>
    </motion.div>
  );
}