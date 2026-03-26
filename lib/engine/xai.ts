// lib/engine/xai.ts

import { WaterInput, Contribution, RankedIssue } from "../types"
import { RANGES } from "./validate"

interface ParameterPenalty {
  param: string
  penalty: number
  label: string
}

function computePenalty(param: string, value: number): number {
  switch (param) {
    case "pH": {
      const min = RANGES.pH.warnMin ?? RANGES.pH.min
      const max = RANGES.pH.warnMax ?? RANGES.pH.max

      if (value < min) return ((min - value) / min) * 100
      if (value > max) return ((value - max) / (14 - max)) * 100
      return 0
    }

    case "TDS": {
      const max = RANGES.TDS.warnMax ?? RANGES.TDS.max
      if (value > max) return Math.min(((value - max) / max) * 100, 100)
      return 0
    }

    case "turbidity": {
      const max = RANGES.turbidity.warnMax ?? RANGES.turbidity.max
      if (value > max) return Math.min(((value - max) / max) * 100, 100)
      return 0
    }

    case "temperature": {
      const min = RANGES.temperature.warnMin ?? RANGES.temperature.min
      const max = RANGES.temperature.warnMax ?? RANGES.temperature.max

      if (value < min) return ((min - value) / min) * 50
      if (value > max) return Math.min(((value - max) / 10) * 100, 100)
      return 0
    }

    case "dissolvedOxygen": {
      const min = RANGES.dissolvedOxygen.warnMin ?? RANGES.dissolvedOxygen.min
      if (value < min) return Math.min(((min - value) / min) * 100, 100)
      return 0
    }

    case "conductivity": {
      const max = RANGES.conductivity.warnMax ?? RANGES.conductivity.max
      if (value > max) return Math.min(((value - max) / max) * 100, 100)
      return 0
    }

    default:
      return 0
  }
}

const PARAM_LABELS: Record<string, string> = {
  pH: "pH Level",
  TDS: "Total Dissolved Solids",
  turbidity: "Turbidity",
  temperature: "Temperature",
  dissolvedOxygen: "Dissolved Oxygen",
  conductivity: "Conductivity",
}

export function computeXAI(input: WaterInput): {
  contributions: Contribution[]
  rankedIssues: RankedIssue[]
  issues: string[]
} {
  const penalties: ParameterPenalty[] = []

  const params: Array<{ key: string; value: number | undefined }> = [
    { key: "pH", value: input.pH },
    { key: "TDS", value: input.TDS },
    { key: "turbidity", value: input.turbidity },
    { key: "temperature", value: input.temperature },
    { key: "dissolvedOxygen", value: input.dissolvedOxygen },
    { key: "conductivity", value: input.conductivity },
  ]

  for (const { key, value } of params) {
    if (value === undefined) continue

    const penalty = computePenalty(key, value)

    penalties.push({
      param: key,
      penalty,
      label: PARAM_LABELS[key] ?? key,
    })
  }

  const totalPenalty = penalties.reduce((sum, p) => sum + p.penalty, 0)

  const contributions: Contribution[] = penalties
    .map((p) => ({
      param: p.label,
      impact:
        totalPenalty > 0
          ? Math.round((p.penalty / totalPenalty) * 100)
          : 0,
    }))
    .filter((c) => c.impact > 0)
    .sort((a, b) => b.impact - a.impact)

  const rankedIssues: RankedIssue[] = penalties
    .filter((p) => p.penalty > 0)
    .map((p) => ({
      name: p.label,
      severity: Math.round(p.penalty),
    }))
    .sort((a, b) => b.severity - a.severity)

  const issues = buildIssueMessages(input)

  return { contributions, rankedIssues, issues }
}

function buildIssueMessages(input: WaterInput): string[] {
  const issues: string[] = []

  const pHMin = RANGES.pH.warnMin ?? RANGES.pH.min
  const pHMax = RANGES.pH.warnMax ?? RANGES.pH.max

  if (input.pH < pHMin) {
    issues.push(`pH ${input.pH.toFixed(1)} is acidic (below ${pHMin})`)
  } else if (input.pH > pHMax) {
    issues.push(`pH ${input.pH.toFixed(1)} is alkaline (above ${pHMax})`)
  }

  const tdsMax = RANGES.TDS.warnMax ?? RANGES.TDS.max
  if (input.TDS > tdsMax) {
    issues.push(`TDS ${input.TDS} mg/L exceeds safe limit (${tdsMax})`)
  }

  const turbMax = RANGES.turbidity.warnMax ?? RANGES.turbidity.max
  if (input.turbidity > turbMax) {
    issues.push(`Turbidity ${input.turbidity} NTU exceeds safe limit (${turbMax})`)
  }

  const tempMax = RANGES.temperature.warnMax ?? RANGES.temperature.max
  if (input.temperature > tempMax) {
    issues.push(`Temperature ${input.temperature}°C exceeds safe range (${tempMax})`)
  }

  const doMin = RANGES.dissolvedOxygen.warnMin ?? RANGES.dissolvedOxygen.min
  if (input.dissolvedOxygen !== undefined && input.dissolvedOxygen < doMin) {
    issues.push(`Dissolved Oxygen ${input.dissolvedOxygen} mg/L is below safe minimum (${doMin})`)
  }

  const condMax = RANGES.conductivity.warnMax ?? RANGES.conductivity.max
  if (input.conductivity !== undefined && input.conductivity > condMax) {
    issues.push(`Conductivity ${input.conductivity} µS/cm exceeds safe limit (${condMax})`)
  }

  return issues
}