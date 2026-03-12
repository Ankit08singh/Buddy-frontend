export type Role = "employee" | "admin";

export type Emotion =
  | "Joy"
  | "Frustration"
  | "Stress"
  | "Burnout"
  | "Overwhelm"
  | "Apathy"
  | "Alignment"
  | "Neutral";

export type RiskLevel = "low" | "medium" | "high";
export type Overall = "positive" | "neutral" | "negative" | "mixed";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  employee_id?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export interface Engagement {
  total_sessions: number;
  total_messages: number;
  current_streak: number;
  total_points: number;
  vibe_score: number;
}

export interface LatestSentiment {
  vibe_score: number;
  primary_emotion: Emotion;
  flight_risk_level: RiskLevel;
  date: string;
}

export interface Employee {
  employee_id: string;
  name: string;
  department?: string;
  job_title?: string;
  engagement?: Engagement;
  latest_sentiment?: LatestSentiment | null;
  flight_risk?: FlightRisk;
}

export interface TrendEntry {
  date: string;
  vibe_score: number;
  overall: Overall;
  primary_emotion: Emotion;
  flight_risk_level: RiskLevel;
  flight_risk_score: number;
}

export interface FlightRisk {
  level: RiskLevel;
  reason?: string;
  reasons?: string[];
}

export interface VibeTrendResponse {
  employee_id: string;
  trends: TrendEntry[];
  flightRisk: FlightRisk;
  engagement: {
    total_points: number;
    current_streak: number;
    total_sessions: number;
  };
}

export interface LoginResponse {
  token: string;
  role: Role;
  employee_id?: string;
}

export interface RegisterResponse {
  token: string;
  role: Role;
  employee_id?: string;
}

export interface ChatResponse {
  reply: string;
  session_id: string;
}

export interface EndSessionResponse {
  ended: boolean;
  message: string;
}

export interface EmployeeListResponse {
  employees: Employee[];
}
