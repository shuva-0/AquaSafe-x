"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import NavBar from "../components/NavBar";
import ChartContainer from "../components/ChartContainer";
import { pageTransition, staggerContainer, staggerItem } from "@/lib/motionVariants";

interface DataPoint {
  time: string;
  wqi: number;
  score: number;
  turbidity: number;
  pH: number;
  tds: number;
  status: "Safe" | "Unsafe";
}

interface TimelineAlert {
  time: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
}

function generatePoint(index: number): DataPoint {
  const wqi = Math.max(10, Math.min(100, 55 + Math.sin(index * 0.4) * 30 + (Math.random() - 0.5) * 15));
  const score = Math.max(5, Math.min(100, wqi + (Math.random() - 0.5) * 10));
  return {
    time: new Date(Date.now() - (29 - index) * 12000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    wqi: parseFloat(wqi.toFixed(1)),
    score: parseFloat(score.toFixed(1)),
    turbidity: parseFloat((1 + Math.random() * 18).toFixed(1)),
    pH: parseFloat((6 + Math.random() * 3).toFixed(2)),
    tds: parseFloat((150 + Math.random() * 800).toFixed(0)),
    status: wqi > 50 ? "Safe" : "Unsafe",
  };
}

function generateAlerts(data: DataPoint[]): TimelineAlert[] {
  const alerts: TimelineAlert[] = [];
  data.forEach((d) => {
    if (d.wqi < 30)
      alerts.push({ time: d.time, severity: "CRITICAL", message: `WQI critically low: ${d.wqi}` });
    else if (d.wqi < 50)
      alerts.push({ time: d.time, severity: "WARNING", message: `WQI below safe threshold: ${d.wqi}` });
    else if (d.turbidity > 12)
      alerts.push({ time: d.time, severity: "WARNING", message: `High turbidity: ${d.turbidity} NTU` });
  });
  return alerts.slice(-8);
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a2436] border border-gray-700 rounded-xl px-4 py-3 shadow-2xl text-xs">
      <div className="text-gray-400 mb-2">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-300">{p.name}:</span>
          <span className="font-bold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const severityConfig = {
  INFO: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  WARNING: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  CRITICAL: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
};

export default function DashboardPage() {
  const [data, setData] = useState<DataPoint[]>(() =>
    Array.from({ length: 30 }, (_, i) => generatePoint(i))
  );
  const [live, setLive] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (live) {
      intervalRef.current = setInterval(() => {
        setData((prev) => {
          const next = [...prev.slice(1), generatePoint(prev.length)];
          return next;
        });
      }, 2000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [live]);

  const latest = data[data.length - 1];
  const alerts = generateAlerts(data);
  const safeCount = data.filter((d) => d.status === "Safe").length;
  const avgWqi = (data.reduce((s, d) => s + d.wqi, 0) / data.length).toFixed(1);

  const summaryCards = [
    { label: "Current WQI", value: latest.wqi.toString(), sub: "Live reading", color: "text-cyan-400", trend: latest.wqi > 50 ? "▲" : "▼" },
    { label: "Safety Score", value: latest.score.toFixed(0), sub: latest.status, color: latest.status === "Safe" ? "text-emerald-400" : "text-red-400", trend: "" },
    { label: "Avg WQI (30 pts)", value: avgWqi, sub: "Rolling average", color: "text-purple-400", trend: "" },
    { label: "Safe Readings", value: `${safeCount}/30`, sub: `${((safeCount / 30) * 100).toFixed(0)}% safe`, color: "text-amber-400", trend: "" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <NavBar />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.main
        className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-24"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="mb-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Analytics{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Real-time water quality monitoring and trend analysis</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 uppercase tracking-widest">Live Feed</span>
            <motion.button
              onClick={() => setLive((l) => !l)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${live ? "bg-cyan-500" : "bg-gray-700"}`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
                animate={{ left: live ? "26px" : "2px" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </motion.button>
            {live && (
              <span className="text-xs text-cyan-400 flex items-center gap-1">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                Updating every 2s
              </span>
            )}
          </div>
        </div>

        {/* Summary cards */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {summaryCards.map((c, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="bg-[#121826]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-5"
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">{c.label}</div>
              <div className={`text-3xl font-black font-mono ${c.color}`}>
                {c.trend && <span className="text-sm mr-1">{c.trend}</span>}
                {c.value}
              </div>
              <div className="text-xs text-gray-600 mt-1">{c.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <ChartContainer title="WQI Trend" subtitle="Water Quality Index over last 30 readings" delay={0.1}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="wqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2d3d" strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} interval={5} />
                <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="wqi" name="WQI" stroke="#06b6d4" fill="url(#wqiGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Safety Score Trend" subtitle="Composite safety score over time" delay={0.15}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2d3d" strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} interval={5} />
                <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" name="Score" stroke="#a855f7" fill="url(#scoreGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <ChartContainer title="Turbidity" subtitle="NTU readings" delay={0.2} height={220}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 4, right: 12, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#1e2d3d" strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fill: "#4b5563", fontSize: 9 }} tickLine={false} interval={8} />
                <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="turbidity" name="Turbidity" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="pH Level" subtitle="Acidity trend" delay={0.25} height={220}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 4, right: 12, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#1e2d3d" strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fill: "#4b5563", fontSize: 9 }} tickLine={false} interval={8} />
                <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} domain={[0, 14]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="pH" name="pH" stroke="#10b981" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="TDS" subtitle="Total dissolved solids (mg/L)" delay={0.3} height={220}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.slice(-15)} margin={{ top: 4, right: 12, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#1e2d3d" strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fill: "#4b5563", fontSize: 9 }} tickLine={false} interval={4} />
                <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tds" name="TDS" radius={[3, 3, 0, 0]}>
                  {data.slice(-15).map((d, i) => (
                    <Cell key={i} fill={d.tds > 500 ? "#ef4444" : "#06b6d4"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Alerts timeline */}
        <motion.div
          className="bg-[#121826]/80 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Alerts Timeline</h3>
            <span className="text-xs text-gray-600">{alerts.length} recent alerts</span>
          </div>

          <div className="p-5">
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-600 text-center py-4">No alerts in current data window.</p>
            ) : (
              <div className="flex flex-col gap-2">
                <AnimatePresence>
                  {alerts.map((alert, i) => {
                    const cfg = severityConfig[alert.severity];
                    return (
                      <motion.div
                        key={`${alert.time}-${i}`}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${cfg.bg} ${cfg.border}`}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className={`text-[10px] font-black uppercase tracking-widest w-16 flex-shrink-0 ${cfg.color}`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-gray-500 font-mono flex-shrink-0 w-20">{alert.time}</span>
                        <span className="text-sm text-gray-300">{alert.message}</span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}