// lib/engine/alerts.ts

import { WaterInput, Alert } from "../types";
import { RANGES } from "./validate";

export function computeAlerts(
  input: WaterInput,
  wqi: number,
  riskLevel: "Low" | "Medium" | "High"
): Alert[] {
  const alerts: Alert[] = [];
  const now: string = new Date().toISOString();

  // ---------- GLOBAL RISK ----------
  if (riskLevel === "High") {
    alerts.push({
      level: "CRITICAL",
      message: "High health risk detected — water is unsafe for consumption",
      timestamp: now,
    });
  }

  // ---------- SAFE LIMITS ----------
  const turbMax = RANGES.turbidity.warnMax ?? RANGES.turbidity.max;
  const tdsMax = RANGES.TDS.warnMax ?? RANGES.TDS.max;
  const pHMin = RANGES.pH.warnMin ?? RANGES.pH.min;
  const pHMax = RANGES.pH.warnMax ?? RANGES.pH.max;
  const tempMax = RANGES.temperature.warnMax ?? RANGES.temperature.max;

  // ---------- TURBIDITY ----------
  if (input.turbidity > turbMax * 2.5) {
    alerts.push({
      level: "CRITICAL",
      message: `Turbidity ${input.turbidity} NTU — ${(input.turbidity / turbMax).toFixed(1)}× above safe limit`,
      timestamp: now,
    });
  } else if (input.turbidity > turbMax) {
    alerts.push({
      level: "WARNING",
      message: `Turbidity ${input.turbidity} NTU exceeds safe limit (${turbMax})`,
      timestamp: now,
    });
  }

  // ---------- TDS ----------
  if (input.TDS > tdsMax * 2) {
    alerts.push({
      level: "CRITICAL",
      message: `TDS ${input.TDS} mg/L — ${(input.TDS / tdsMax).toFixed(1)}× above safe threshold`,
      timestamp: now,
    });
  } else if (input.TDS > tdsMax) {
    alerts.push({
      level: "WARNING",
      message: `TDS ${input.TDS} mg/L exceeds safe limit (${tdsMax})`,
      timestamp: now,
    });
  }

  // ---------- pH ----------
  if (input.pH < 5 || input.pH > 10) {
    alerts.push({
      level: "CRITICAL",
      message: `pH ${input.pH} — extreme acidity/alkalinity`,
      timestamp: now,
    });
  } else if (input.pH < pHMin || input.pH > pHMax) {
    alerts.push({
      level: "WARNING",
      message: `pH ${input.pH} outside safe range (${pHMin}–${pHMax})`,
      timestamp: now,
    });
  }

  // ---------- TEMPERATURE ----------
  if (input.temperature > tempMax + 10) {
    alerts.push({
      level: "CRITICAL",
      message: `Temperature ${input.temperature}°C — extreme microbial growth conditions`,
      timestamp: now,
    });
  } else if (input.temperature > tempMax) {
    alerts.push({
      level: "WARNING",
      message: `Temperature ${input.temperature}°C exceeds safe limit (${tempMax})`,
      timestamp: now,
    });
  }

  // ---------- DISSOLVED OXYGEN ----------
  if (typeof input.dissolvedOxygen === "number") {
    const doMin = RANGES.dissolvedOxygen.warnMin ?? RANGES.dissolvedOxygen.min;

    if (input.dissolvedOxygen < doMin * 0.6) {
      alerts.push({
        level: "CRITICAL",
        message: `Dissolved oxygen ${input.dissolvedOxygen} mg/L — severe depletion`,
        timestamp: now,
      });
    } else if (input.dissolvedOxygen < doMin) {
      alerts.push({
        level: "WARNING",
        message: `Dissolved oxygen ${input.dissolvedOxygen} mg/L below safe minimum (${doMin})`,
        timestamp: now,
      });
    }
  }

  // ---------- EMERGENCY ----------
  if (input.locationType === "emergency" && wqi > 40) {
    alerts.push({
      level: "CRITICAL",
      message: "Emergency zone water quality failure — immediate intervention required",
      timestamp: now,
    });
  }

  // ---------- FALLBACK ----------
  if (alerts.length === 0) {
    alerts.push({
      level: "INFO",
      message: "All water quality parameters within acceptable limits",
      timestamp: now,
    });
  }

  return alerts;
}