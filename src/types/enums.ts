// Core enumeration types for the admin dashboard
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

export type OverallSentiment = "positive" | "neutral" | "negative" | "mixed";

export type TrendDirection = "up" | "down" | "stable";

export type FilterTimeRange = "today" | "week" | "month" | "quarter" | "all";

export type SortField = 
  | "name" 
  | "department" 
  | "vibe_score" 
  | "risk_level" 
  | "last_active" 
  | "streak" 
  | "total_points";

export type SortDirection = "asc" | "desc";

export type ActiveStatus = "all" | "active_today" | "inactive";