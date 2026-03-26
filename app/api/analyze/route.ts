// app/api/analyze/route.ts

import { NextRequest, NextResponse } from "next/server";

import { validateInput } from "@/lib/engine/validate";
import { computeWQI, wqiToScore } from "@/lib/engine/wqi";
import { computeXAI } from "@/lib/engine/xai";
import { computePrediction } from "@/lib/engine/prediction";
import { computeHealth } from "@/lib/engine/health";
import { computeDecision } from "@/lib/engine/decision";
import { computeConfidence } from "@/lib/engine/confidence";
import { computeAlerts } from "@/lib/engine/alerts";

import { AnalysisResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ---------- VALIDATION ----------
    const validation = validateInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const input = validation.sanitized;

    // ---------- CORE ENGINE ----------
    const { wqi } = computeWQI(input);
    const score = wqiToScore(wqi);

    const status: "Safe" | "Unsafe" =
      score >= 50 ? "Safe" : "Unsafe";

    const { contributions, rankedIssues, issues } =
      computeXAI(input);

    const health = computeHealth(input);

    const prediction = computePrediction(input);

    const recommendations = computeDecision(
      input,
      wqi,
      health.riskLevel
    );

    const { confidence } = computeConfidence(input);

    const alerts = computeAlerts(
      input,
      wqi,
      health.riskLevel
    );

    // ---------- FINAL OUTPUT ----------
    const result: AnalysisResult = {
      status,
      score,
      confidence,
      wqi: Number(wqi.toFixed(2)),

      issues,
      rankedIssues,
      contributions,

      health,
      prediction,
      recommendations,

      alerts,

      processedAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[ANALYZE_API_ERROR]:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}