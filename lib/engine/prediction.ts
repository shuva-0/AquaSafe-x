// lib/engine/prediction.ts

import { WaterInput, PredictionResult } from "../types"
import { RANGES } from "./validate"

// Compute severity score (0–100, higher = worse)
function getSeverityScore(input: WaterInput): number {
  let total = 0

  // pH deviation
  const pHMin = RANGES.pH.warnMin ?? RANGES.pH.min
  const pHMax = RANGES.pH.warnMax ?? RANGES.pH.max

  if (input.pH < pHMin) {
    total += ((pHMin - input.pH) / pHMin) * 20
  } else if (input.pH > pHMax) {
    total += ((input.pH - pHMax) / (14 - pHMax)) * 20
  }

  // TDS
  const tdsMax = RANGES.TDS.warnMax ?? RANGES.TDS.max
  if (input.TDS > tdsMax) {
    total += Math.min(((input.TDS - tdsMax) / tdsMax) * 20, 20)
  }

  // Turbidity (high weight)
  const turbMax = RANGES.turbidity.warnMax ?? RANGES.turbidity.max
  if (input.turbidity > turbMax) {
    total += Math.min(((input.turbidity - turbMax) / turbMax) * 30, 30)
  }

  // Temperature
  const tempMax = RANGES.temperature.warnMax ?? RANGES.temperature.max
  if (input.temperature > tempMax) {
    total += Math.min(((input.temperature - tempMax) / 10) * 10, 10)
  }

  // Dissolved Oxygen (lower is worse)
  if (input.dissolvedOxygen !== undefined) {
    const doMin = RANGES.dissolvedOxygen.warnMin ?? RANGES.dissolvedOxygen.min
    if (input.dissolvedOxygen < doMin) {
      total += Math.min(((doMin - input.dissolvedOxygen) / doMin) * 20, 20)
    }
  }

  return Math.min(Math.round(total), 100)
}

export function computePrediction(
  input: WaterInput,
  previousWQI?: number
): PredictionResult {
  const severity = getSeverityScore(input)

  let trend: "Improving" | "Stable" | "Degrading" = "Stable"

  // If historical WQI available
  if (previousWQI !== undefined) {
    const delta = severity - previousWQI

    if (delta > 5) trend = "Degrading"
    else if (delta < -5) trend = "Improving"
    else trend = "Stable"
  } else {
    // Fallback heuristic
    if (severity > 60) trend = "Degrading"
    else if (severity > 30) trend = "Stable"
    else trend = "Improving"
  }

  const forecast = buildForecast(input, severity, trend)

  return { trend, forecast }
}

function buildForecast(
  input: WaterInput,
  severity: number,
  trend: "Improving" | "Stable" | "Degrading"
): string {
  // Critical condition
  if (severity > 70) {
    return "Critical contamination detected. Unsafe water conditions expected to persist for 72+ hours without intervention."
  }

  if (trend === "Degrading") {
    if (input.turbidity > 10) {
      return "Rapid turbidity increase detected. Contamination likely worsening. Unsafe conditions expected within 24–48 hours."
    }

    if (input.TDS > 600) {
      return "High dissolved solids with degrading trend. Water likely to become unsafe within 48 hours."
    }

    return "Water quality is degrading. Unsafe conditions expected within 48 hours without corrective measures."
  }

  if (trend === "Stable") {
    if (severity > 40) {
      return "Water quality is borderline but stable. Monitor conditions closely every 12–24 hours."
    }

    return "Water quality is stable and within safe limits. No immediate risk detected."
  }

  // Improving
  if (input.locationType === "emergency") {
    return "Improvement trend detected in emergency conditions. Safe levels may be reached within 48–72 hours."
  }

  return "Water quality is improving steadily. Expected to reach optimal conditions within 24–48 hours."
}