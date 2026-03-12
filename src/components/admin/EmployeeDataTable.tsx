import React from "react";
import { Search, Filter, Download, ArrowUpRight, ShieldAlert, Heart, Zap } from "lucide-react";
import { Avatar, EmotionBadge, RiskBadge } from "@/components/ui";
import type { EmployeeListItem, FilterTimeRange, RiskLevel } from "@/types";

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
  const filtered = employees.filter(emp => {
    if (filters.search && !emp.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.riskLevels.length && !filters.riskLevels.includes(emp.latest_sentiment?.flight_risk_level as any)) return false;
    return true;
  });

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-(--border) rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-(--border) space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-(--foreground)">Employee Insights</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl bg-(--secondary) text-(--foreground) hover:bg-primary hover:text-(--primary-foreground) transition-all"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--muted-foreground)" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-(--border) bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filters.riskLevels[0] || ""}
              onChange={(e) => onFilterChange({ ...filters, riskLevels: e.target.value ? [e.target.value as any] : [] })}
              className="px-4 py-2.5 rounded-xl border border-(--border) bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none transition-all font-medium"
            >
              <option value="">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900/50">
              <th className="px-6 py-4 text-xs font-bold text-(--muted-foreground) uppercase tracking-wider">Employee</th>
              <th className="px-6 py-4 text-xs font-bold text-(--muted-foreground) uppercase tracking-wider">Risk Level</th>
              <th className="px-6 py-4 text-xs font-bold text-(--muted-foreground) uppercase tracking-wider">Latest vibe</th>
              <th className="px-6 py-4 text-xs font-bold text-(--muted-foreground) uppercase tracking-wider">Engagement</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border)">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-8">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-(--border) rounded-full" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-(--border) rounded-full" />
                        <div className="h-3 w-24 bg-(--border) rounded-full" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-(--muted-foreground)">
                  No employees found matching your criteria.
                </td>
              </tr>
            ) : (
              filtered.map((emp) => (
                <tr 
                  key={emp.employee_id} 
                  onClick={() => onEmployeeClick(emp.employee_id)}
                  className="group hover:bg-primary/[0.02] cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} size="sm" className="ring-2 ring-transparent group-hover:ring-primary/20 transition-all" />
                      <div>
                        <p className="text-sm font-bold text-(--foreground)">{emp.name}</p>
                        <p className="text-xs text-(--muted-foreground) uppercase tracking-tighter opacity-50">{emp.employee_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge risk={emp.latest_sentiment?.flight_risk_level || "low"} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-(--secondary) rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${emp.latest_sentiment?.vibe_score || 0}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-(--foreground)">{emp.latest_sentiment?.vibe_score || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-xs font-bold text-(--muted-foreground)">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        {emp.engagement?.total_sessions || 0} sess
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-xl text-(--muted-foreground) group-hover:text-primary group-hover:bg-primary/10 transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};