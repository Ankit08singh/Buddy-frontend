import React, { useState } from "react";
import Head from "next/head";
import { RefreshCw, Download, Sun, Moon, LogOut, LayoutDashboard, Heart, ShieldAlert, Zap } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { BuddyAvatar, Avatar } from "@/components/ui";
import {
  MetricCard,
  EmployeeDataTable,
  VibeScoreTrendChart,
  EmployeeDetailView,
} from "@/components/admin";
import toast from "react-hot-toast";

interface AdminPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

function AdminContent({ darkMode, onToggleDarkMode }: AdminPageProps) {
  const { user, logout } = useAuth();
  const { 
    employees, 
    teamStats, 
    isLoading, 
    refresh 
  } = useAdminDashboard();
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const handleEmployeeClick = (id: string) => {
    setSelectedEmployeeId(id);
  };

  const handleContactEmployee = (employeeId: string, method: "email" | "phone") => {
    const employee = employees.find(emp => emp.employee_id === employeeId);
    if (employee) {
      // Backend EmployeeListItem doesn't currently provide email/phone
      toast.error(`Direct ${method} contact info is not provided by the current backend`);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(employees));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "employee_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const [filters, setFilters] = useState({
    search: "",
    departments: [] as string[],
    riskLevels: [] as any[],
    activityStatus: "all" as any,
    streakTier: "all" as any,
    timeRange: "month" as any,
    sortField: "name" as any,
    sortDirection: "asc" as any
  });

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground) pb-12 transition-colors">
      <Head>
        <title>Admin Dashboard — Buddy</title>
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-(--border) px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-primary/10">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-[10px] font-bold text-(--muted-foreground) uppercase tracking-widest">Global Insights</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refresh()}
            className="p-2.5 rounded-xl bg-(--secondary) text-(--muted-foreground) hover:text-primary transition-all active:scale-95"
            aria-label="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl bg-(--secondary) text-(--muted-foreground) hover:text-primary transition-all active:scale-95"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="h-8 w-px bg-(--border) mx-1 hidden sm:block" />

          <div className="flex items-center gap-3 pl-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold">{user?.name}</p>
              <p className="text-[10px] font-medium text-(--muted-foreground)">Administrator</p>
            </div>
            <Avatar name={user?.name || "Admin"} size="sm" className="ring-2 ring-primary/10" />
            <button
              onClick={logout}
              className="p-2.5 rounded-xl bg-(--secondary) text-(--muted-foreground) hover:text-destructive transition-all active:scale-95 ml-1"
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-in fade-in duration-500">
        {selectedEmployeeId ? (
          <EmployeeDetailView 
            employeeId={selectedEmployeeId} 
            onBack={() => setSelectedEmployeeId(null)}
            onContactEmployee={handleContactEmployee}
          />
        ) : (
          <>
            {/* Metrics Overview */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Workforce"
                value={teamStats?.employee_count?.toString() || "0"}
                icon={LayoutDashboard}
                loading={isLoading}
                subtitle="Registered employees"
              />
              <MetricCard
                title="Avg Vibe Score"
                value={teamStats?.average_vibe_score?.toFixed(1) || "0"}
                icon={Heart}
                loading={isLoading}
                variant="success"
                subtitle="Overall team sentiment"
              />
              <MetricCard
                title="High Risk"
                value={teamStats?.high_risk_count?.toString() || "0"}
                icon={ShieldAlert}
                loading={isLoading}
                variant={teamStats?.high_risk_count && teamStats.high_risk_count > 0 ? "warning" : "default"}
                subtitle="Action required"
              />
              <MetricCard
                title="Active Today"
                value={teamStats?.active_employees?.toString() || "0"}
                icon={Zap}
                loading={isLoading}
                subtitle={`${teamStats?.employee_count ? Math.round(((teamStats.active_employees || 0) / teamStats.employee_count) * 100) : 0}% engagement`}
              />
            </section>


            {/* Data Table */}
            <section>
              <EmployeeDataTable
                employees={employees}
                loading={isLoading}
                filters={filters}
                onFilterChange={setFilters}
                onEmployeeClick={handleEmployeeClick}
                onExport={handleExport}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default function AdminPage(props: AdminPageProps) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminContent {...props} />
    </ProtectedRoute>
  );
}
