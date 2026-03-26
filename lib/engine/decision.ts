// lib/engine/decision.ts

import { WaterInput, Recommendations } from "../types"
import { RANGES } from "./validate"

export function computeDecision(
  input: WaterInput,
  wqi: number,
  riskLevel: "Low" | "Medium" | "High"
): Recommendations {
  const immediate: string[] = []
  const shortTerm: string[] = []
  const longTerm: string[] = []

  // ---------- THRESHOLDS ----------
  const turbMax = RANGES.turbidity.warnMax ?? RANGES.turbidity.max
  const tdsMax = RANGES.TDS.warnMax ?? RANGES.TDS.max
  const pHMin = RANGES.pH.warnMin ?? RANGES.pH.min
  const pHMax = RANGES.pH.warnMax ?? RANGES.pH.max
  const tempMax = RANGES.temperature.warnMax ?? RANGES.temperature.max
  const doMin = RANGES.dissolvedOxygen.warnMin ?? RANGES.dissolvedOxygen.min

  // ---------- IMMEDIATE ----------
  if (riskLevel === "High" || wqi > 60) {
    immediate.push("⛔ Do NOT consume or use this water for cooking")
    immediate.push("🚨 Notify local health authorities immediately")
  }

  if (input.turbidity > turbMax) {
    immediate.push("💧 Provide alternative safe drinking water (bottled/emergency supply)")
    immediate.push("🧪 Initiate disinfection (chlorination)")
  }

  if (input.pH < pHMin - 1 || input.pH > pHMax + 1) {
    immediate.push("⚗️ Suspend distribution — pH outside safe limits")
  }

  if (input.locationType === "emergency") {
    immediate.push("🏥 Activate emergency WASH response protocols")
  }

  if (immediate.length === 0) {
    if (wqi > 30) {
      immediate.push("⚠️ Restrict use to non-drinking purposes temporarily")
    } else {
      immediate.push("✅ Water safe — continue monitoring")
    }
  }

  // ---------- SHORT TERM ----------
  if (input.turbidity > turbMax) {
    shortTerm.push("🪣 Install filtration (sand filter / coagulation)")
    shortTerm.push("🔬 Test for microbial contamination (E. coli, coliforms)")
  }

  if (input.TDS > tdsMax) {
    shortTerm.push("🔄 Deploy RO or ion-exchange treatment")
    shortTerm.push("📊 Identify source of dissolved solids")
  }

  if (input.pH < pHMin) {
    shortTerm.push("🧂 Neutralize acidity using lime or soda ash")
  }

  if (input.pH > pHMax) {
    shortTerm.push("🧪 Reduce alkalinity via CO₂ dosing or acid treatment")
  }

  if (input.temperature > tempMax) {
    shortTerm.push("🌡️ Reduce temperature (shading, aeration, tank insulation)")
  }

  if (input.dissolvedOxygen !== undefined && input.dissolvedOxygen < doMin) {
    shortTerm.push("💨 Increase aeration to improve oxygen levels")
    shortTerm.push("🌿 Investigate organic contamination sources")
  }

  if (input.locationType === "rural") {
    shortTerm.push("🪵 Train community in boiling, chlorination, SODIS")
    shortTerm.push("📋 Establish periodic manual testing schedule")
  }

  if (shortTerm.length === 0) {
    shortTerm.push("📅 Perform routine water quality check within 2 weeks")
    shortTerm.push("📝 Maintain monitoring logs")
  }

  // ---------- LONG TERM ----------
  longTerm.push("🏗️ Develop sustainable water treatment infrastructure")

  if (input.TDS > 300 || (input.conductivity ?? 0) > 500) {
    longTerm.push("💎 Install multi-stage filtration (sediment → carbon → RO → UV)")
  }

  if (input.locationType === "rural") {
    longTerm.push("🌍 Partner with NGOs for decentralized water systems")
    longTerm.push("📡 Deploy low-cost IoT monitoring solutions")
  }

  if (input.locationType === "urban") {
    longTerm.push("🏙️ Integrate with smart water management systems")
    longTerm.push("📡 Implement SCADA-based monitoring")
  }

  if (input.locationType === "emergency") {
    longTerm.push("🔧 Replace temporary supply with permanent infrastructure")
    longTerm.push("🗺️ Map water sources for disaster preparedness")
  }

  longTerm.push("📊 Establish WQI baseline tracking")
  longTerm.push("🏫 Conduct water safety and hygiene education programs")

  return { immediate, shortTerm, longTerm }
}