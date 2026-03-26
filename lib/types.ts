export type LocationType = "rural" | "urban" | "emergency";

export interface WaterInput {
  pH: number;
  TDS: number;
  turbidity: number;
  temperature: number;
  dissolvedOxygen?: number;
  conductivity?: number;
  locationType: LocationType;
}

export interface Alert {
  level: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  timestamp: string;
}

export interface HealthResult {
  riskLevel: "Low" | "Medium" | "High";
  diseases: string[];
}

export interface PredictionResult {
  trend: "Improving" | "Stable" | "Degrading";
  forecast: string;
}

export interface Recommendations {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
}

export interface Contribution {
  param: string;
  impact: number;
}

export interface RankedIssue {
  name: string;
  severity: number;
}

export interface AnalysisResult {
  status: "Safe" | "Unsafe";
  score: number;
  confidence: number;
  wqi: number;

  issues: string[];
  rankedIssues: RankedIssue[];
  contributions: Contribution[];

  health: HealthResult;
  prediction: PredictionResult;
  recommendations: Recommendations;

  alerts: Alert[];

  processedAt: string; // ✅ THIS LINE IS REQUIRED
}
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  sanitized: WaterInput;
}

