import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { Employee, TeamStats, RiskAlert, VibeChartData } from "@/types";
import toast from "react-hot-toast";

export function useAdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [vibeChartData, setVibeChartData] = useState<VibeChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async (vibeRange: string = "30d") => {
    setIsLoading(true);
    try {
      const [empRes, statsRes, alertsRes, vibeRes] = await Promise.all([
        api.admin.getEmployees(),
        api.admin.getTeamStats().catch(() => null),
        api.admin.getRiskAlerts().catch(() => ({ alerts: [] })),
        api.admin.getVibeTrend(undefined, vibeRange).catch(() => ({ trends: [] }))
      ]);

      setEmployees(empRes.employees);
      setRiskAlerts(alertsRes.alerts);
      setVibeChartData((vibeRes.trends || []).map(t => ({ ...t, value: t.vibe_score })));

      if (statsRes) {
        setTeamStats(statsRes);
      } else {
        // Fallback stats calculation
        const activeCount = empRes.employees.filter(e => (e.engagement?.session_count ?? 0) > 0).length;
        const avgScore = empRes.employees.length ? 
          empRes.employees.reduce((s, e) => s + (e.latest_sentiment?.vibe_score ?? 0), 0) / empRes.employees.length : 0;
        
        setTeamStats({
          employee_count: empRes.employees.length,
          active_employees: activeCount,
          average_vibe_score: avgScore,
          high_risk_count: empRes.employees.filter(e => e.flight_risk?.level === "high").length,
          medium_risk_count: empRes.employees.filter(e => e.flight_risk?.level === "medium").length,
          low_risk_count: empRes.employees.filter(e => e.flight_risk?.level === "low").length,
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateVibeTrendRange = useCallback(async (range: string) => {
    try {
      const res = await api.admin.getVibeTrend(undefined, range);
      setVibeChartData((res.trends || []).map(t => ({ ...t, value: t.vibe_score })));
    } catch (err) {
      toast.error("Failed to update chart data");
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    employees,
    teamStats,
    riskAlerts,
    vibeChartData,
    isLoading,
    refresh: fetchDashboardData,
    updateVibeTrendRange
  };
}
