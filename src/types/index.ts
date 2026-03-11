export type ToneDirective =
  | "active_listening"
  | "supportive_advice"
  | "celebratory"
  | "empathetic_validation";

export type PrimaryEmotion =
  | "Joy"
  | "Frustration"
  | "Stress"
  | "Burnout"
  | "Overwhelm"
  | "Apathy"
  | "Alignment"
  | "Neutral";

export type RiskLevel = "Low" | "Medium" | "High";

export interface SentimentResult {
  primary_emotion: PrimaryEmotion;
  secondary_emotions: string[];
  vibe_score: number;
  flight_risk_indicator: boolean;
  tone_directive: ToneDirective;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  sentiment?: SentimentResult;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastMessageAt: Date;
}

export interface TrendEntry {
  date: string;
  vibeScore: number;
  emotion: string;
  flightRiskLevel: RiskLevel;
}

export interface FlightRisk {
  level: RiskLevel;
  reason: string;
}

export interface Engagement {
  totalPoints: number;
  currentStreak: number;
}

export interface User {
  userId: string;
  name: string;
}
