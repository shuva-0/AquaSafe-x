// lib/engine/validate.ts

import { WaterInput, ValidationResult } from "../types"

interface ParamRange {
  min: number
  max: number
  warnMin?: number
  warnMax?: number
  label: string
}

export const RANGES: Record<string, ParamRange> = {
  pH: { min: 0, max: 14, warnMin: 6.5, warnMax: 8.5, label: "pH" },
  TDS: { min: 0, max: 10000, warnMax: 500, label: "TDS" },
  turbidity: { min: 0, max: 1000, warnMax: 4, label: "Turbidity" },
  temperature: { min: 0, max: 100, warnMin: 10, warnMax: 30, label: "Temperature" },
  dissolvedOxygen: { min: 0, max: 20, warnMin: 5, label: "Dissolved Oxygen" },
  conductivity: { min: 0, max: 10000, warnMax: 1000, label: "Conductivity" },
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

// Explicit numeric keys (strict typing)
type NumericKey =
  | "pH"
  | "TDS"
  | "turbidity"
  | "temperature"
  | "dissolvedOxygen"
  | "conductivity"

export function validateInput(input: Partial<WaterInput>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Required fields
  if (input.pH === undefined || isNaN(input.pH)) errors.push("pH is required")
  if (input.TDS === undefined || isNaN(input.TDS)) errors.push("TDS is required")
  if (input.turbidity === undefined || isNaN(input.turbidity)) errors.push("Turbidity is required")
  if (input.temperature === undefined || isNaN(input.temperature)) errors.push("Temperature is required")
  if (!input.locationType) errors.push("Location type is required")

  // Initialize sanitized with safe defaults
  const sanitized: WaterInput = {
    pH: input.pH ?? 7,
    TDS: input.TDS ?? 300,
    turbidity: input.turbidity ?? 2,
    temperature: input.temperature ?? 22,
    locationType: input.locationType ?? "urban",
    dissolvedOxygen: input.dissolvedOxygen,
    conductivity: input.conductivity,
  }

  const numericKeys: NumericKey[] = [
    "pH",
    "TDS",
    "turbidity",
    "temperature",
    "dissolvedOxygen",
    "conductivity",
  ]

  for (const key of numericKeys) {
    const value = input[key]

    if (value === undefined || isNaN(value)) continue

    const range = RANGES[key]

    // Clamp + error if outside physical range
    if (value < range.min || value > range.max) {
      errors.push(
        `${range.label} value ${value} is out of physical range [${range.min}, ${range.max}]`
      )
      sanitized[key] = clamp(value, range.min, range.max)
    } else {
      sanitized[key] = value
    }

    // Warning thresholds (safe limits)
    if (range.warnMin !== undefined && value < range.warnMin) {
      warnings.push(
        `${range.label} (${value}) is below safe threshold (${range.warnMin})`
      )
    }

    if (range.warnMax !== undefined && value > range.warnMax) {
      warnings.push(
        `${range.label} (${value}) exceeds safe threshold (${range.warnMax})`
      )
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    sanitized,
  }
}