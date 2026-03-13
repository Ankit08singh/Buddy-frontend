import React, { useMemo } from "react";
import { Search, Download, ArrowUpRight, ShieldAlert, Sparkles, Filter, Trophy, CheckCircle2, AlertCircle } from "lucide-react";
import { Avatar, EmotionBadge, RiskBadge } from "@/components/ui";
import type { EmployeeListItem, FilterTimeRange, RiskLevel } from "@/types";
import { getStreakMeta } from "@/lib/streakUtils";

interface EmployeeDataTableProps {
  employees: EmployeeListItem[];
  loading: boolean;
  filters: {
    search: string;
    departments: string[];
    riskLevels: RiskLevel[];
    activityStatus: any;
    timeRange: FilterTimeRange;
    sortField: any;
    sortDirection: any;
  };
  onFilterChange: (filters: any) => void;
  onEmployeeClick: (id: string) => void;
  onExport: () => void;
}

export const EmployeeDataTable: React.FC<EmployeeDataTableProps> = ({
  employees,
  loading,
  filters,
  onFilterChange,
  onEmployeeClick,
  onExport
}) => {
  const filtered = useMemo(() => {
    return employees.filter(emp => {
      if (filters.search && !emp.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.riskLevels.length && !filters.riskLevels.includes(emp.latest_sentiment?.flight_risk_level as any)) return false;
      return true;
    });
  }, [employees, filters]);

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-(--border) rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-8 border-b border-(--border) space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-(--foreground) tracking-tight">Workforce Consistency</h3>
            <p className="text-xs font-bold text-(--muted-foreground) uppercase tracking-widest mt-1 opacity-70">Motivation & Streak Analytics</p>
          </div>
          <div className="flex items-center gap-3">
             <button
              onClick={onExport}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-black rounded-xl bg-(--secondary) text-(--foreground) hover:bg-emerald-900 hover:text-white transition-all active:scale-95 shadow-sm"
            >
              <Download className="w-4 h-4" />
              EXPORT ANALYTICS
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-(--muted-foreground)" />
            <input
              type="text"
              placeholder="Search by name or department..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-(--border) bg-white/50 dark:bg-slate-900/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest flex items-center mr-1">Risk:</span>
            {(["low", "medium", "high"] as RiskLevel[]).map(level => (
              <button
                key={level}
                onClick={() => {
                  const newLevels = filters.riskLevels.includes(level)
                    ? filters.riskLevels.filter(l => l !== level)
                    : [...filters.riskLevels, level];
                  onFilterChange({ ...filters, riskLevels: newLevels });
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all border capitalize flex items-center gap-2 ${
                  filters.riskLevels.includes(level)
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-white/50 dark:bg-slate-900/50 border-(--border) text-(--muted-foreground) hover:border-primary/40"
                }`}
              >
                {level === "low" ? <CheckCircle2 className="w-3.5 h-3.5" /> : level === "medium" ? <AlertCircle className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                {level === "low" ? "Low" : level === "medium" ? "Med" : "High"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900/50">
              <th className="px-8 py-5 text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest">Employee</th>
              <th className="px-8 py-5 text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest">Consistency Rank</th>
              <th className="px-8 py-5 text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest">Engagement</th>
              <th className="px-8 py-5 text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest">Risk Level</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border)">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-8 py-8">
                     <div className="h-4 w-full bg-(--border) rounded-full" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center space-y-3">
                  <Trophy className="w-12 h-12 mx-auto text-(--muted-foreground) opacity-20" />
                  <p className="text-sm font-bold text-(--muted-foreground)">No employees match the consistency criteria.</p>
                </td>
              </tr>
            ) : (
              filtered.map((emp) => {
                const streak = getStreakMeta(emp.engagement.current_streak);
                return (
                  <tr 
                    key={emp.employee_id} 
                    onClick={() => onEmployeeClick(emp.employee_id)}
                    className="group hover:bg-primary/3 cursor-pointer transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <Avatar name={emp.name} size="md" className="ring-2 ring-transparent group-hover:ring-primary/20 transition-all shadow-sm" />
                        <div>
                          <p className="text-sm font-black text-(--foreground) tracking-tight">{emp.name}</p>
                          <p className="text-[10px] font-bold text-(--muted-foreground) uppercase tracking-widest opacity-60">{emp.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${streak.colorClass} ${streak.pulse ? 'animate-pulse' : ''}`}>
                         <streak.icon className="w-3.5 h-3.5" />
                         <span className="text-xs font-black uppercase tracking-tight">{streak.label}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-8">
                           <span className="text-[10px] font-bold text-(--muted-foreground) uppercase">Total Points</span>
                           <span className="text-xs font-black text-primary flex items-center gap-1">
                             <Sparkles className="w-3.5 h-3.5" /> {emp.engagement.total_points}
                           </span>
                        </div>
                        <div className="w-full h-1 bg-(--secondary) rounded-full overflow-hidden">
                           <div className="h-full bg-primary" style={{ width: `${Math.min(100, (emp.engagement.total_points / 500) * 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <RiskBadge risk={emp.latest_sentiment?.flight_risk_level || "low"} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-3 rounded-2xl text-(--muted-foreground) group-hover:text-primary group-hover:bg-primary/10 transition-all active:scale-90">
                        <ArrowUpRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};