"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import NavBar from "./components/NavBar";
import { staggerContainer, staggerItem, fadeSlideUp } from "@/lib/motionVariants";

const features = [
  {
    icon: "🧮",
    title: "WHO-Compliant WQI",
    desc: "Weighted scoring engine using WHO/EPA parameter thresholds for deterministic, auditable results.",
    color: "from-cyan-500/10 to-cyan-500/5",
    border: "border-cyan-500/20",
    accent: "text-cyan-400",
  },
  {
    icon: "🧠",
    title: "Explainable AI",
    desc: "Parameter-level contribution analysis. No black-box — every score is fully traceable.",
    color: "from-purple-500/10 to-purple-500/5",
    border: "border-purple-500/20",
    accent: "text-purple-400",
  },
  {
    icon: "🏥",
    title: "Health Risk Engine",
    desc: "Maps water parameters to disease vectors: diarrhea, kidney stress, irritation, and more.",
    color: "from-red-500/10 to-red-500/5",
    border: "border-red-500/20",
    accent: "text-red-400",
  },
  {
    icon: "📈",
    title: "Trend Prediction",
    desc: "Forecasts quality trajectory based on parameter drift — 24-72 hour contamination warnings.",
    color: "from-amber-500/10 to-amber-500/5",
    border: "border-amber-500/20",
    accent: "text-amber-400",
  },
  {
    icon: "⚡",
    title: "Decision Support",
    desc: "Tiered, cost-aware recommendations from immediate action to long-term infrastructure.",
    color: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/20",
    accent: "text-emerald-400",
  },
  {
    icon: "📡",
    title: "Simulation Mode",
    desc: "Live data simulation for demo, testing, and sensor integration readiness.",
    color: "from-sky-500/10 to-sky-500/5",
    border: "border-sky-500/20",
    accent: "text-sky-400",
  },
];

const stats = [
  { value: "<200ms", label: "API Response" },
  { value: "7", label: "Analysis Modules" },
  { value: "100%", label: "Deterministic" },
  { value: "WHO", label: "Compliant" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-hidden">
      <NavBar />

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <main className="relative z-10">
        {/* Hero */}
        <section className="pt-36 pb-24 px-6 max-w-6xl mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-6"
          >
            {/* Badge */}
            <motion.div
              variants={staggerItem}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30
                bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-widest"
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Autonomous Water Intelligence Platform
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={staggerItem}
              className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight max-w-4xl"
            >
              Water Quality.{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Analyzed.
              </span>
              <br />
              Explained. Protected.
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={staggerItem}
              className="text-gray-400 text-lg max-w-2xl leading-relaxed"
            >
              AquaSafe X∞ delivers deterministic, explainable water safety analysis — from WHO-standard
              WQI scoring to health risk prediction and tiered recommendations. Built for NGOs, field
              operators, and public health systems.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={staggerItem} className="flex items-center gap-4 flex-wrap justify-center">
              <Link href="/analyze">
                <motion.button
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white
                    font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Analyze Water Sample →
                </motion.button>
              </Link>
              <Link href="/dashboard">
                <motion.button
                  className="px-8 py-3.5 rounded-xl bg-white/5 border border-gray-700 text-gray-300
                    font-semibold text-sm hover:bg-white/8 hover:border-gray-600 transition-all"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View Dashboard
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            transition={{ delayChildren: 0.5 }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="bg-white/[0.03] border border-gray-800 rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            variants={fadeSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Full-Stack{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Intelligence Pipeline
              </span>
            </h2>
            <p className="text-gray-500 mt-3 text-base max-w-xl mx-auto">
              Seven specialized analysis modules that work in concert to produce actionable water safety intelligence.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className={`bg-gradient-to-br ${f.color} border ${f.border} rounded-2xl p-6 group cursor-default`}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className={`text-sm font-bold uppercase tracking-widest ${f.accent} mb-2`}>
                  {f.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center bg-gradient-to-br from-cyan-500/10 to-purple-500/10
              border border-cyan-500/20 rounded-3xl p-12"
            variants={fadeSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h2 className="text-3xl font-black mb-4">
              Ready to analyze your{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                water sample?
              </span>
            </h2>
            <p className="text-gray-400 mb-8 text-base">
              Enter your sensor readings and get a full WHO-compliant safety report in under 200ms.
            </p>
            <Link href="/analyze">
              <motion.button
                className="px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600
                  font-bold text-white shadow-2xl shadow-cyan-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Start Analysis →
              </motion.button>
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6 text-center text-gray-600 text-xs relative z-10">
        AquaSafe X∞ — Autonomous Water Intelligence Platform · Built for public health protection
      </footer>
    </div>
  );
}