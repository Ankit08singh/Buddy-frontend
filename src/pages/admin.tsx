import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Sun, Moon, LogOut, Users, TrendingUp, AlertTriangle, Search, ChevronDown, Loader2, RefreshCw, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { BuddyAvatar, Avatar, EmotionBadge, RiskBadge, VibeScoreBar, TableRowSkeleton, EmptyState } from "@/components/ui";
import type { Employee, TrendEntry } from "@/types";
import toast from "react-hot-toast";

interface AdminPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

function AdminContent({ darkMode, onToggleDarkMode }: AdminPageProps) {
  const { user, logout } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [trendData, setTrendData] = useState<TrendEntry[]>([]);
  const [trendLoading, setTrendLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getEmployees();
      setEmployees(data.employees);
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSelectEmployee = async (emp: Employee) => {
    setSelectedEmployee(emp);
    setTrendLoading(true);
    try {
      const data = await api.admin.getVibeTrend(emp.employee_id);
      setTrendData(data.trends);
    } catch {
      toast.error("Failed to load trend data");
      setTrendData([]);
    } finally {
      setTrendLoading(false);
    }
  };

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department?.toLowerCase().includes(search.toLowerCase()) ||
    e.job_title?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: employees.length,
    highRisk: employees.filter((e) => e.flight_risk?.level === "high").length,
    avgVibe: employees.length
      ? Math.round(employees.reduce((sum, e) => sum + (e.engagement?.vibe_score || 0), 0) / employees.length)
      : 0,
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard — Buddy</title>
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
          <div className="max-w-[1400px] mx-auto px-6 flex items-center h-14 gap-4">
            <BuddyAvatar size="sm" />
            <span className="text-[15px] font-semibold text-slate-900 dark:text-white">Buddy Admin</span>

            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
              <button
                onClick={() => { logout(); }}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <LogOut className="w-[18px] h-[18px]" />
              </button>
              <Avatar name={user?.name || "Admin"} size="sm" />
            </div>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Wellness Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor employee wellbeing across your organization</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Employees</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.avgVibe}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Avg Vibe Score</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.highRisk}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">High Risk</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 dark:text-white">Employees</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-48"
                    />
                  </div>
                  <button
                    onClick={fetchEmployees}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700/50 text-left">
                    <tr>
                      <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Employee</th>
                      <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Emotion</th>
                      <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vibe Score</th>
                      <th className="px-5 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
                    ) : filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8">
                          <EmptyState
                            icon={Users}
                            title="No employees found"
                            description={search ? "Try adjusting your search" : "Employees will appear here"}
                          />
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((emp) => (
                        <tr
                          key={emp.employee_id}
                          onClick={() => handleSelectEmployee(emp)}
                          className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition ${
                            selectedEmployee?.employee_id === emp.employee_id ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
                          }`}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={emp.name} size="sm" />
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{emp.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{emp.job_title || emp.department || "—"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {emp.latest_sentiment?.primary_emotion ? (
                              <EmotionBadge emotion={emp.latest_sentiment.primary_emotion} size="sm" />
                            ) : (
                              <span className="text-slate-400 text-sm">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4 min-w-[150px]">
                            <VibeScoreBar score={emp.engagement?.vibe_score || 0} size="sm" />
                          </td>
                          <td className="px-5 py-4">
                            {emp.flight_risk?.level ? (
                              <RiskBadge risk={emp.flight_risk.level} size="sm" />
                            ) : (
                              <span className="text-slate-400 text-sm">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              {selectedEmployee ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar name={selectedEmployee.name} size="lg" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{selectedEmployee.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{selectedEmployee.job_title || selectedEmployee.department || "Employee"}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Engagement</p>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-600 dark:text-slate-300">Vibe Score</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedEmployee.engagement?.vibe_score || 0}</span>
                      </div>
                      <VibeScoreBar score={selectedEmployee.engagement?.vibe_score || 0} showLabel={false} />
                    </div>

                    {selectedEmployee.latest_sentiment && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Latest Sentiment</p>
                        <EmotionBadge emotion={selectedEmployee.latest_sentiment.primary_emotion} />
                      </div>
                    )}

                    {selectedEmployee.flight_risk && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Flight Risk</p>
                        <RiskBadge risk={selectedEmployee.flight_risk.level} />
                        {selectedEmployee.flight_risk.reasons && selectedEmployee.flight_risk.reasons.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {selectedEmployee.flight_risk.reasons.map((r, i) => (
                              <li key={i} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1">
                                <span className="text-red-400 mt-0.5">•</span>
                                {r}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Vibe Trend</p>
                      {trendLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                        </div>
                      ) : trendData.length > 0 ? (
                        <div className="h-32 flex items-end gap-1">
                          {trendData.slice(-14).map((t, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-indigo-500 rounded-t opacity-70 hover:opacity-100 transition"
                              style={{ height: `${Math.max(10, t.vibe_score)}%` }}
                              title={`${t.date}: ${t.vibe_score}`}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No trend data</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                    <MessageSquare className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Select an employee</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Click on a row to view details</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default function AdminPage(props: AdminPageProps) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminContent {...props} />
    </ProtectedRoute>
  );
}
