import type { Emotion, RiskLevel, OverallSentiment } from "./enums";

export interface EmployeeEngagement {
  total_sessions: number;
  total_messages: number;
  current_streak: number;
  last_session_at: string | null;
  total_points: number;
  daily_chat_seconds: number;
  daily_points_date: string | null;
}

export interface LatestSentiment {
  vibe_score: number;
  primary_emotion: Emotion;
  flight_risk_level: RiskLevel;
  date: string;
}

export interface EmployeeListItem {
  employee_id: string;
  name: string;
  department: string;
  engagement: EmployeeEngagement;
  latest_sentiment: LatestSentiment | null;
}

export interface GetEmployeesResponse {
  employees: EmployeeListItem[];
}

export interface TrendEntry {
  date: string;
  vibe_score: number;
  overall: OverallSentiment;
  primary_emotion: Emotion;
  flight_risk_level: RiskLevel;
  flight_risk_score: number;
}

export interface FlightRiskSummary {
  level: 'Low' | 'Medium' | 'High';
  reason: string;
}

export interface TrendEngagementSummary {
  total_points: number;
  current_streak: number;
  total_sessions: number;
}

export interface GetEmployeeTrendResponse {
  employee_id: string;
  trends: TrendEntry[];
  flightRisk: FlightRiskSummary;
  engagement: TrendEngagementSummary;
}

export interface ApiError {
  error: string;
}

// Keep some internal types for UI if they don't conflict
export interface TeamStats {
  employee_count: number;
  active_employees: number;
  average_vibe_score: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  active_sentiment_coverage: number;
}

export interface RiskAlert {
  id: string;
  employee_id: string;
  employee_name: string;
  level: RiskLevel;
  message: string;
  created_at: string;
}