import type { EmployeeListItem as Employee, RiskLevel, TrendEntry } from "@/types";
import { TrendDirection, type Emotion } from "@/types/enums";

// Type guards for safe type checking
export function isHighRisk(risk: RiskLevel): risk is "high" {
  return risk === "high";
}

export function isValidEmployee(data: unknown): data is Employee {
  return (
    typeof data === "object" &&
    data !== null &&
    "employee_id" in data &&
    "name" in data &&
    "department" in data
  );
}

export function hasLatestSentiment(
  employee: Employee
): employee is Employee & { latest_sentiment: NonNullable<Employee["latest_sentiment"]> } {
  return employee.latest_sentiment !== null && employee.latest_sentiment !== undefined;
}

// Utility functions for business logic
export function calculateTrendDirection(current: number, previous: number): TrendDirection {
  const threshold = 0.05; // 5% threshold for stability
  const change = (current - previous) / previous;
  
  if (Math.abs(change) < threshold) return "stable";
  return change > 0 ? "up" : "down";
}

export interface RiskDisplayProps {
  color: string;
  label: string;
  bgColor: string;
  textColor: string;
}

export function formatRiskLevel(level: RiskLevel): RiskDisplayProps {
  const riskMap: Record<RiskLevel, RiskDisplayProps> = {
    low: {
      color: "green",
      label: "Low Risk",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-400"
    },
    medium: {
      color: "yellow",
      label: "Medium Risk", 
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-700 dark:text-yellow-400"
    },
    high: {
      color: "red",
      label: "High Risk",
      bgColor: "bg-red-50 dark:bg-red-900/20", 
      textColor: "text-red-700 dark:text-red-400"
    }
  };
  
  return riskMap[level];
}

export function groupEmployeesByDepartment(employees: Employee[]): Record<string, Employee[]> {
  return employees.reduce((acc, employee) => {
    const dept = employee.department || "Unassigned";
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(employee);
    return acc;
  }, {} as Record<string, Employee[]>);
}

export interface VibeScoreStats {
  average: number;
  median: number;
  distribution: { level: RiskLevel; count: number; percentage: number }[];
}

export function calculateVibeScoreStats(employees: Employee[]): VibeScoreStats {
  const scores = employees
    .map(emp => emp.latest_sentiment?.vibe_score || 0)
    .filter(score => score > 0)
    .sort((a, b) => a - b);
    
  if (scores.length === 0) {
    return {
      average: 0,
      median: 0,
      distribution: []
    };
  }
  
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const median = scores[Math.floor(scores.length / 2)];
  
  const riskCounts = employees.reduce(
    (acc, emp) => {
      const risk = emp.latest_sentiment?.flight_risk_level || "low";
      acc[risk]++;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );
  
  const total = employees.length;
  const distribution = Object.entries(riskCounts).map(([level, count]) => ({
    level: level as RiskLevel,
    count: count as number,
    percentage: total > 0 ? ((count as number) / total) * 100 : 0
  }));
  
  return { average, median, distribution };
}

export function generateRiskAlerts(employees: Employee[]) {
  return employees
    .filter(emp => emp.latest_sentiment?.flight_risk_level === "high")
    .map(emp => ({
      id: `alert-${emp.employee_id}`,
      employee_id: emp.employee_id,
      employee_name: emp.name,
      level: (emp.latest_sentiment?.flight_risk_level || "high") as RiskLevel,
      message: `${emp.name} in ${emp.department} is currently showing high risk signals.`,
      created_at: new Date().toISOString(),
      primary_concern: "High risk flight level detected",
      days_since_last_session: Math.floor(Math.random() * 14), // Mock data
      vibe_score_trend: "down" as const,
      urgency: "high" as const
    }))
    .sort((a, b) => (b.days_since_last_session || 0) - (a.days_since_last_session || 0));
}