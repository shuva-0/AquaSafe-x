"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import NavBar from "../components/NavBar";
import InputField from "../components/InputField";
import ScoreIndicator from "../components/ScoreIndicator";
import ContributionBar from "../components/ContributionBar";
import AlertBanner from "../components/AlertBanner";
import RecommendationCard from "../components/RecommendationCard";
import ResultCard from "../components/ResultCard";
import SkeletonLoader from "../components/SkeletonLoader";
import ChatAssistant from "../components/ChatAssistant";

import { AnalysisResult } from "@/lib/types";
import {
  staggerContainer,
  staggerItem,
  pageTransition,
} from "@/lib/motionVariants";

interface FormState {
  pH: string;
  TDS: string;
  turbidity: string;
  temperature: string;
  dissolvedOxygen: string;
  conductivity: string;
  locationType: string;
}

const defaultForm: FormState = {
  pH: "7.2",
  TDS: "320",
  turbidity: "3.5",
  temperature: "22",
  dissolvedOxygen: "7.5",
  conductivity: "450",
  locationType: "urban",
};

function generateSimData(): FormState {
  return {
    pH: (6 + Math.random() * 3).toFixed(2),
    TDS: (200 + Math.random() * 700).toFixed(0),
    turbidity: (1 + Math.random() * 20).toFixed(1),
    temperature: (18 + Math.random() * 16).toFixed(1),
    dissolvedOxygen: (3 + Math.random() * 7).toFixed(1),
    conductivity: (200 + Math.random() * 1200).toFixed(0),
    locationType: ["rural", "urban", "emergency"][
      Math.floor(Math.random() * 3)
    ],
  };
}

export default function AnalyzePage() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simMode, setSimMode] = useState(false);

  const simInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const analyze = useCallback(async (data: FormState) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pH: parseFloat(data.pH),
          TDS: parseFloat(data.TDS),
          turbidity: parseFloat(data.turbidity),
          temperature: parseFloat(data.temperature),
          dissolvedOxygen: data.dissolvedOxygen
            ? parseFloat(data.dissolvedOxygen)
            : undefined,
          conductivity: data.conductivity
            ? parseFloat(data.conductivity)
            : undefined,
          locationType: data.locationType,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Analysis failed");

      setResult(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (simMode) {
      const run = () => {
        const d = generateSimData();
        setForm(d);
        analyze(d);
      };

      run();
      simInterval.current = setInterval(run, 3000);
    } else {
      if (simInterval.current) clearInterval(simInterval.current);
    }

    return () => {
      if (simInterval.current) clearInterval(simInterval.current);
    };
  }, [simMode, analyze]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    analyze(form);
  }

  const riskColors: Record<string, string> = {
    Low: "text-emerald-400",
    Medium: "text-amber-400",
    High: "text-red-400",
  };

  const trendIcons: Record<string, string> = {
    Improving: "📈",
    Stable: "➡️",
    Degrading: "📉",
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <NavBar />

      <motion.main
        className="max-w-7xl mx-auto px-6 pt-28 pb-24"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* INPUT PANEL */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="pH" name="pH" value={form.pH} onChange={handleChange} />
            <InputField label="TDS" name="TDS" value={form.TDS} onChange={handleChange} />
            <InputField label="Turbidity" name="turbidity" value={form.turbidity} onChange={handleChange} />
            <InputField label="Temperature" name="temperature" value={form.temperature} onChange={handleChange} />
            <InputField label="Dissolved O₂" name="dissolvedOxygen" value={form.dissolvedOxygen} onChange={handleChange} />
            <InputField label="Conductivity" name="conductivity" value={form.conductivity} onChange={handleChange} />
            <InputField
              label="Location"
              name="locationType"
              value={form.locationType}
              onChange={handleChange}
              as="select"
              options={[
                { value: "urban", label: "Urban" },
                { value: "rural", label: "Rural" },
                { value: "emergency", label: "Emergency" },
              ]}
            />

            <button className="w-full bg-cyan-500 py-2 rounded">
              Analyze
            </button>
          </form>

          {/* RESULTS PANEL */}
          <div>
            <AnimatePresence mode="wait">
              {loading ? (
                <SkeletonLoader />
              ) : result ? (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-5"
                >
                  {/* ✅ FIXED ALERTS */}
                  {result.alerts?.length > 0 && (
                    <motion.div variants={staggerItem}>
                      <AlertBanner alerts={result.alerts} />
                    </motion.div>
                  )}

                  <ResultCard title="Score">
                    <ScoreIndicator
                      score={result.score}
                      wqi={result.wqi}
                      status={result.status}
                      confidence={result.confidence}
                    />
                  </ResultCard>

                  <ResultCard title="Health">
                    <div className={riskColors[result.health.riskLevel]}>
                      {result.health.riskLevel}
                    </div>
                  </ResultCard>

                  <ResultCard title="Prediction">
                    <div>
                      {trendIcons[result.prediction.trend]}{" "}
                      {result.prediction.trend}
                    </div>
                  </ResultCard>

                  <ResultCard title="Contributions">
                    {result.contributions.map((c, i) => (
                      <ContributionBar key={i} {...c} index={i} />
                    ))}
                  </ResultCard>

                  <ResultCard title="Recommendations">
                    <RecommendationCard {...result.recommendations} />
                  </ResultCard>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </motion.main>

      <ChatAssistant context={result} />
    </div>
  );
}