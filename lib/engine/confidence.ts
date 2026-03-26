import { WaterInput } from '../types'

interface ConfidenceFactor {
  name: string
  penalty: number
  reason: string
}

export function computeConfidence(input: WaterInput): {
  confidence: number
  factors: ConfidenceFactor[]
} {
  const factors: ConfidenceFactor[] = []
  let totalPenalty = 0

  // Missing optional parameters reduce confidence
  if (input.dissolvedOxygen === undefined) {
    const penalty = 10
    factors.push({ name: 'Missing DO', penalty, reason: 'Dissolved oxygen not provided — reduces biological assessment accuracy' })
    totalPenalty += penalty
  }

  if (input.conductivity === undefined) {
    const penalty = 8
    factors.push({ name: 'Missing Conductivity', penalty, reason: 'Conductivity not provided — ionic load estimation limited' })
    totalPenalty += penalty
  }

  // Extreme values that may indicate sensor noise
  if (input.turbidity > 500) {
    const penalty = 5
    factors.push({ name: 'Extreme Turbidity', penalty, reason: 'Turbidity value is unusually high — possible sensor error' })
    totalPenalty += penalty
  }

  if (input.TDS > 1800) {
    const penalty = 5
    factors.push({ name: 'Extreme TDS', penalty, reason: 'TDS value near maximum range — verify sensor calibration' })
    totalPenalty += penalty
  }

  if (input.pH < 2 || input.pH > 12) {
    const penalty = 8
    factors.push({ name: 'Extreme pH', penalty, reason: 'pH is at extreme end — verify pH probe calibration' })
    totalPenalty += penalty
  }

  // Emergency location has inherently lower data reliability
  if (input.locationType === 'emergency') {
    const penalty = 5
    factors.push({ name: 'Emergency Context', penalty, reason: 'Emergency scenarios may have field measurement variability' })
    totalPenalty += penalty
  }

  const confidence = Math.max(0, Math.min(100, 100 - totalPenalty))

  return { confidence, factors }
}