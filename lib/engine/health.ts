// lib/engine/health.ts

import { WaterInput, HealthResult } from "../types"
import { RANGES } from "./validate"

interface DiseaseRule {
  condition: (input: WaterInput) => boolean
  disease: string
  severity: number // 1=low, 2=medium, 3=high
}

const DISEASE_RULES: DiseaseRule[] = [
  // -------- TURBIDITY --------
  {
    condition: (i) => i.turbidity > (RANGES.turbidity.warnMax ?? RANGES.turbidity.max),
    disease: "Diarrheal diseases (cholera, dysentery)",
    severity: 3,
  },
  {
    condition: (i) => i.turbidity > 1,
    disease: "Gastrointestinal infections",
    severity: 2,
  },

  // -------- TDS --------
  {
    condition: (i) => i.TDS > (RANGES.TDS.warnMax ?? RANGES.TDS.max),
    disease: "Kidney stress and renal complications",
    severity: 2,
  },
  {
    condition: (i) => i.TDS > (RANGES.TDS.warnMax ?? RANGES.TDS.max) * 2,
    disease: "Cardiovascular strain from high mineral load",
    severity: 3,
  },

  // -------- pH --------
  {
    condition: (i) => i.pH < (RANGES.pH.warnMin ?? RANGES.pH.min),
    disease: "Mucous membrane irritation and tooth erosion",
    severity: 2,
  },
  {
    condition: (i) => i.pH > (RANGES.pH.warnMax ?? RANGES.pH.max),
    disease: "Skin and eye irritation (alkaline exposure)",
    severity: 2,
  },
  {
    condition: (i) => i.pH < (RANGES.pH.warnMin ?? RANGES.pH.min) - 1,
    disease: "Severe acidosis risk (long-term exposure)",
    severity: 3,
  },

  // -------- TEMPERATURE --------
  {
    condition: (i) => i.temperature > (RANGES.temperature.warnMax ?? RANGES.temperature.max),
    disease: "Accelerated bacterial growth in water",
    severity: 2,
  },
  {
    condition: (i) => i.temperature > (RANGES.temperature.warnMax ?? RANGES.temperature.max) + 5,
    disease: "Pathogen proliferation (Legionella risk)",
    severity: 3,
  },

  // -------- DISSOLVED OXYGEN --------
  {
    condition: (i) =>
      i.dissolvedOxygen !== undefined &&
      i.dissolvedOxygen < (RANGES.dissolvedOxygen.warnMin ?? RANGES.dissolvedOxygen.min),
    disease: "Reduced pathogen neutralization capacity",
    severity: 2,
  },
  {
    condition: (i) =>
      i.dissolvedOxygen !== undefined &&
      i.dissolvedOxygen < (RANGES.dissolvedOxygen.warnMin ?? RANGES.dissolvedOxygen.min) * 0.6,
    disease: "Hypoxic conditions — toxin release risk",
    severity: 3,
  },

  // -------- CONDUCTIVITY --------
  {
    condition: (i) =>
      i.conductivity !== undefined &&
      i.conductivity > (RANGES.conductivity.warnMax ?? RANGES.conductivity.max),
    disease: "High ionic load — hypertension and mineral imbalance",
    severity: 2,
  },
  {
    condition: (i) =>
      i.conductivity !== undefined &&
      i.conductivity > (RANGES.conductivity.warnMax ?? RANGES.conductivity.max) * 1.5,
    disease: "Severe electrolyte imbalance risk",
    severity: 3,
  },
]

export function computeHealth(input: WaterInput): HealthResult {
  const triggered = DISEASE_RULES.filter(rule => rule.condition(input))

const diseases: string[] = Array.from(
  new Set(triggered.map((r) => r.disease))
)

  const highCount = triggered.filter(r => r.severity === 3).length
  const medCount = triggered.filter(r => r.severity === 2).length

  let riskLevel: "Low" | "Medium" | "High" = "Low"

  if (highCount >= 2 || (highCount >= 1 && medCount >= 2)) {
    riskLevel = "High"
  } else if (highCount >= 1 || medCount >= 2) {
    riskLevel = "Medium"
  } else {
    riskLevel = "Low"
  }

  // Emergency escalation
  if (input.locationType === "emergency" && riskLevel === "Medium") {
    riskLevel = "High"
  }

  return { riskLevel, diseases }
}