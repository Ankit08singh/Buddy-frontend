import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { 
  EmployeeListItem, 
  TeamStats, 
  RiskAlert, 
  TrendEntry 
} from "@/types";
import toast from "react-hot-toast";

export function useAdminDashboard() {
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Reconciling with backend: Only GET /api/admin/employees is reliably implemented for workforce data
      const empRes = await api.admin.getEmployees();
      
      const employeeList = empRes.employees || [];
      setEmployees(employeeList);

      // Client-Side Computed Metrics as specified in Backend Manifest
      const avgVibe = employeeList.length > 0
        ? employeeList.reduce((sum, emp) => sum + (emp.latest_sentiment?.vibe_score || 0), 0) / employeeList.length
        : 0;

      const highRisk = employeeList.filter(e => e.latest_sentiment?.flight_risk_level === "high").length;
      const mediumRisk = employeeList.filter(e => e.latest_sentiment?.flight_risk_level === "medium").length;
      const lowRisk = employeeList.filter(e => e.latest_sentiment?.flight_risk_level === "low").length;
      const coverage = employeeList.filter(e => e.latest_sentiment !== null).length;

      // Active employees logic: engaged in last 7 days or has points
      const activeCount = employeeList.filter(e => 
        e.engagement.total_sessions > 0 || (e.engagement.total_points || 0) > 0
      ).length;

      setTeamStats({
        employee_count: employeeList.length,
        active_employees: activeCount,
        average_vibe_score: avgVibe,
        high_risk_count: highRisk,
        medium_risk_count: mediumRisk,
        low_risk_count: lowRisk,
        active_sentiment_coverage: coverage
      });

      // alerts are not implemented in backend, generating local alerts from high risk employees
      const derivedAlerts: RiskAlert[] = employeeList
        .filter(e => e.latest_sentiment?.flight_risk_level === "high")
        .map(e => ({
          id: `alert-${e.employee_id}`,
          employee_id: e.employee_id,
          employee_name: e.name,
          level: "high",
          message: `High risk detected for ${e.name} in ${e.department}. Score: ${e.latest_sentiment?.vibe_score}`,
          created_at: new Date().toISOString()
        }));
      
      setRiskAlerts(derivedAlerts);

    } catch (err: any) {
      if (err.message !== "NOT_IMPLEMENTED") {
        toast.error(err.message || "Failed to load dashboard data");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    employees,
    teamStats,
    riskAlerts,
    vibeChartData: [], // Dashboard-wide trend not implemented in backend
    isLoading,
    refresh: fetchDashboardData
  };
}
