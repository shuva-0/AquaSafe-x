import { WaterInput } from '../types'

interface WQIWeights {
  pH: number
  TDS: number
  turbidity: number
  temperature: number
  dissolvedOxygen: number
  conductivity: number
}

const WEIGHTS: WQIWeights = {
  pH: 0.20,
  TDS: 0.20,
  turbidity: 0.25,
  temperature: 0.10,
  dissolvedOxygen: 0.15,
  conductivity: 0.10,
}

// Ideal and max permissible values (WHO/BIS standards)
const STANDARDS = {
  pH: { ideal: 7.0, max: 8.5, min: 6.5 },
  TDS: { ideal: 0, max: 500 },
  turbidity: { ideal: 0, max: 4 },
  temperature: { ideal: 25, max: 35 },
  dissolvedOxygen: { ideal: 14, min: 6 }, // higher is better
  conductivity: { ideal: 0, max: 800 },
}

function normalizeParam(param: keyof typeof STANDARDS, value: number): number {
  switch (param) {
    case 'pH': {
      const ideal = STANDARDS.pH.ideal
      const deviation = Math.abs(value - ideal)
      const maxDeviation = Math.max(ideal - STANDARDS.pH.min, STANDARDS.pH.max - ideal)
      return Math.min(deviation / maxDeviation, 1) * 100
    }
    case 'TDS': {
      return Math.min(value / STANDARDS.TDS.max, 2) * 100
    }
    case 'turbidity': {
      return Math.min(value / STANDARDS.turbidity.max, 25) * 100
    }
    case 'temperature': {
      const deviation = Math.abs(value - STANDARDS.temperature.ideal)
      return Math.min(deviation / 15, 1) * 100
    }
    case 'dissolvedOxygen': {
      // Lower DO = worse quality
      const safe_min = STANDARDS.dissolvedOxygen.min
      if (value >= safe_min) return Math.max(0, (safe_min - value + 2) * 5)
      return Math.min(((safe_min - value) / safe_min) * 100, 100)
    }
    case 'conductivity': {
      return Math.min(value / STANDARDS.conductivity.max, 3) * 100
    }
    default:
      return 0
  }
}

export function computeWQI(input: WaterInput): {
  wqi: number
  paramScores: Record<string, number>
  totalWeight: number
} {
  const paramScores: Record<string, number> = {}
  let weightedSum = 0
  let totalWeight = 0

  const params: Array<{ key: keyof typeof STANDARDS; weight: number; value: number | undefined }> = [
    { key: 'pH', weight: WEIGHTS.pH, value: input.pH },
    { key: 'TDS', weight: WEIGHTS.TDS, value: input.TDS },
    { key: 'turbidity', weight: WEIGHTS.turbidity, value: input.turbidity },
    { key: 'temperature', weight: WEIGHTS.temperature, value: input.temperature },
    { key: 'dissolvedOxygen', weight: WEIGHTS.dissolvedOxygen, value: input.dissolvedOxygen },
    { key: 'conductivity', weight: WEIGHTS.conductivity, value: input.conductivity },
  ]

  for (const { key, weight, value } of params) {
    if (value === undefined || value === null) continue
    const score = normalizeParam(key, value)
    paramScores[key] = score
    weightedSum += weight * score
    totalWeight += weight
  }

  const normalizedWQI = totalWeight > 0 ? weightedSum / totalWeight : 0
  // WQI: 0-100, lower is better
  const wqi = Math.min(Math.round(normalizedWQI * 100) / 100, 100)

  return { wqi, paramScores, totalWeight }
}

export function wqiToScore(wqi: number): number {
  // Convert WQI (0=perfect, 100=terrible) to score (0=terrible, 100=perfect)
  return Math.max(0, Math.round(100 - wqi))
}