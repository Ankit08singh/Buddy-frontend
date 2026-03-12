import type { Emotion, RiskLevel, TrendDirection } from "./enums";

// Chart and visualization data types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  color?: string;
}

export interface VibeChartData {
  date: string;
  label?: string;
  value: number;
  vibe_score?: number;
  employee_count?: number;
  risk_high?: number;
  risk_medium?: number;
  risk_low?: number;
  annotations?: Array<{ text: string; type: string }>;
}

export interface EmotionDistribution {
  emotion: Emotion;
  count: number;
  percentage: number;
  color: string;
}

export interface RiskDistribution {
  level: RiskLevel;
  count: number;
  percentage: number;
}

export interface TrendAnalysis {
  current_period: number;
  previous_period: number;
  change_percentage: number;
  direction: TrendDirection;
  significance: "low" | "medium" | "high";
}

export interface Annotation {
  date: string;
  label: string;
  type: "event" | "milestone" | "concern";
  color: string;
}