import type { Emotion, RiskLevel, OverallSentiment, TrendDirection } from "./enums";

// Core admin dashboard data model types
export interface Employee {
  employee_id: string;
  name: string;
  department?: string;
  job_title?: string;
  email?: string;
  phone?: string;
  location?: string;
  engagement?: Engagement;
  latest_sentiment?: LatestSentiment | null;
  flight_risk?: FlightRisk;
}

export interface LatestSentiment {
  vibe_score: number;
  primary_emotion: Emotion;
  flight_risk_level: RiskLevel;
  date: string;
  timestamp: string;
}

export interface Engagement {
  total_sessions: number;
  total_messages: number;
  current_streak: number;
  total_points: number;
  session_count: number;
  average_session_duration?: number;
  last_active: string;
}

export interface TrendEntry {
  date: string;
  vibe_score: number;
  overall: OverallSentiment;
  primary_emotion: Emotion;
  flight_risk_level: RiskLevel;
  flight_risk_score: number;
  timestamp: string;
}

export interface FlightRisk {
  level: RiskLevel;
  score: number;
  reason?: string;
  reasons?: string[];
  factors?: string[];
  last_updated: string;
}

export interface VibeTrendResponse {
  employee_id?: string;
  trends: TrendEntry[];
  flightRisk?: FlightRisk;
  engagement?: Engagement;
}

export interface EmployeeListResponse {
  employees: Employee[];
}

export interface TeamStats {
  employee_count: number;
  active_employees?: number;
  average_vibe_score: number;
  high_risk_count?: number;
  medium_risk_count?: number;
  low_risk_count?: number;
  vibe_trend?: {
    direction?: TrendDirection;
    percentage?: number;
  };
}

export interface RiskAlert {
  id: string;
  employee_id?: string;
  employee_name?: string;
  risk_level?: RiskLevel;
  primary_concern?: string;
  days_since_last_session?: number;
  vibe_score_trend?: "up" | "down" | "stable";
  urgency?: "low" | "medium" | "high";
  type?: string;
  message?: string;
  status?: "active" | "resolved" | "dismissed";
  priority?: "low" | "medium" | "high";
  created_at: string;
}

export interface ActivityEntry {
  id: string;
  employee_id?: string;
  employee_name?: string;
  session_duration?: number;
  message_count?: number;
  vibe_score?: number;
  primary_emotion?: Emotion;
  timestamp: string;
  action: string;
  details?: string;
}

export interface SessionSummary {
  session_id: string;
  employee_id: string;
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  message_count: number;
  vibe_score?: number;
  primary_emotion?: Emotion;
}

export interface SessionSummary {
  session_id: string;
  date: string;
  duration_minutes: number;
  message_count: number;
  vibe_score: number;
  primary_emotion: Emotion;
  key_topics: string[];
  ai_summary: string;
}