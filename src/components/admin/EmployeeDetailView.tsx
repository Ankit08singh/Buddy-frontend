import React, { useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Briefcase, User, Activity, AlertTriangle, TrendingUp, TrendingDown, Clock, Settings, Zap, ShieldCheck } from "lucide-react";
import { Employee, ActivityEntry, RiskAlert } from "@/types";
import { EmotionBadge, RiskBadge, Avatar, LoadingSkeleton } from "@/components/ui";
import { MetricCard } from "./MetricCard";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface EmployeeDetailViewProps {
  employeeId: string;
  onBack: () => void;
  onContactEmployee?: (employeeId: string, method: "email" | "phone") => void;
}

export function EmployeeDetailView({
  employeeId,
  onBack,
  onContactEmployee,
}: EmployeeDetailViewProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "alerts">("overview");

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [empRes, activitiesRes, alertsRes] = await Promise.all([
          api.admin.getEmployees(), // Finding in total list
          api.admin.getEmployeeActivities(employeeId).catch(() => ({ activities: [] })),
          api.admin.getEmployeeAlerts(employeeId).catch(() => ({ alerts: [] }))
        ]);
        
        const emp = empRes.employees.find(e => e.employee_id === employeeId);
        if (emp) {
          setEmployee(emp);
          setActivities(activitiesRes.activities || []);
          setAlerts(alertsRes.alerts || []);
        } else {
          toast.error("Employee not found");
          onBack();
        }
      } catch (err) {
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [employeeId, onBack]);

  const handleUpdateRisk = async (level: "low" | "medium" | "high") => {
    try {
      await api.admin.updateEmployeeRisk(employeeId, level);
      setEmployee(prev => prev ? { ...prev, flight_risk: { ...prev.flight_risk!, level } } : null);
      toast.success(`Risk updated to ${level}`);
    } catch (err) {
      toast.error("Failed to update risk");
    }
  };

  if (loading || !employee) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <button onClick={onBack} className="flex items-center gap-2 text-(--muted-foreground) hover:text-primary transition-all">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold">Back to Dashboard</span>
        </button>
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-(--border) rounded-3xl p-8 h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-bold text-(--muted-foreground)">Retrieving employee insights...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-(--border) text-(--muted-foreground) hover:text-primary hover:border-primary transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold">Back to Dashboard</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => onContactEmployee?.(employeeId, "email")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-(--primary-foreground) text-sm font-bold shadow-lg shadow-primary/10 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Mail className="w-4 h-4" />
            Reach Out
          </button>
        </div>
      </div>

      {/* Hero Profile */}
      <div className="relative group p-8 rounded-[2rem] bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-(--border) shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-accent rounded-full blur opacity-20 group-hover:opacity-40 transition" />
            <Avatar name={employee.name} size="lg" className="relative w-32 h-32 text-4xl ring-4 ring-white dark:ring-slate-800 shadow-2xl" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-(--foreground) tracking-tight">{employee.name}</h1>
                <RiskBadge risk={employee.flight_risk?.level || "low"} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-(--muted-foreground)">
                <div className="flex items-center gap-1.5 pt-1">
                  <Briefcase className="w-4 h-4 text-primary" />
                  {employee.job_title} • {employee.department}
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <Mail className="w-4 h-4 text-primary" />
                  {employee.email}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <MetricCard
                title="Vibe Score"
                value={employee.latest_sentiment?.vibe_score?.toString() || "0"}
                icon={Heart}
                variant="success"
              />
              <MetricCard
                title="Engagement"
                value={employee.engagement?.total_points?.toString() || "0"}
                icon={Zap}
              />
              <MetricCard
                title="Risk level"
                value={employee.flight_risk?.level || "Low"}
                icon={ShieldAlert}
                variant={employee.flight_risk?.level === "high" ? "warning" : "default"}
              />
              <MetricCard
                title="Sessions"
                value={employee.engagement?.session_count?.toString() || "0"}
                icon={Clock}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex p-1 bg-(--secondary) rounded-2xl w-fit">
          {(["overview", "activity", "alerts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all capitalize ${
                activeTab === tab 
                  ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                  : "text-(--muted-foreground) hover:text-(--foreground)"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
              {/* Sentiment Card */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 border border-(--border) shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-(--muted-foreground)">Sentiment Summary</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-(--secondary) p-4 rounded-2xl">
                    <span className="text-xs font-bold">Top Emotion</span>
                    <EmotionBadge emotion={employee.latest_sentiment?.primary_emotion || "Neutral"} />
                  </div>
                  <div className="flex justify-between items-center bg-(--secondary) p-4 rounded-2xl">
                    <span className="text-xs font-bold">Health Score</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${employee.latest_sentiment?.vibe_score || 0}%` }} />
                      </div>
                      <span className="text-xs font-black">{employee.latest_sentiment?.vibe_score || 0}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Settings Card */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 border border-(--border) shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-(--muted-foreground)">Risk Management</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-medium text-(--muted-foreground)">Adjust the risk classification for this employee based on your manual assessment.</p>
                  <div className="flex flex-col gap-2">
                    {(["low", "medium", "high"] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => handleUpdateRisk(level)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          employee.flight_risk?.level === level
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-(--border) hover:border-primary/40 text-(--muted-foreground)"
                        }`}
                      >
                        Set as {level.toUpperCase()} Risk
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Factors Card */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 border border-(--border) shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-(--muted-foreground)">Risk Factors</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {employee.flight_risk?.factors?.length ? (
                    employee.flight_risk.factors.map(f => (
                      <span key={f} className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider">
                        {f}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs font-medium text-(--muted-foreground)">No concerning factors detected.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="bg-white/80 dark:bg-slate-800/80 border border-(--border) rounded-3xl shadow-sm divide-y divide-(--border) animate-in fade-in slide-in-from-right-4 duration-500">
              {activities.length > 0 ? (
                activities.map((act) => (
                  <div key={act.id} className="p-6 flex gap-4 items-start hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-(--foreground)">{act.action}</h4>
                      <p className="text-xs font-medium text-(--muted-foreground) mt-1">{act.details}</p>
                      <span className="text-[10px] text-(--muted-foreground) mt-2 inline-block opacity-60">
                        {new Date(act.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-(--muted-foreground)">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-medium">No recent activity recorded.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "alerts" && (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
               {alerts.length > 0 ? (
                 alerts.map(alert => (
                   <div key={alert.id} className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20 flex gap-4 items-start">
                     <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-black text-rose-500 uppercase tracking-tight">{alert.type} Alert</h4>
                        <span className="px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold">{alert.priority}</span>
                       </div>
                       <p className="text-xs font-medium text-(--foreground)">{alert.message}</p>
                       <span className="text-[10px] text-(--muted-foreground) mt-2 inline-block opacity-60">
                         Detected {new Date(alert.created_at).toLocaleString()}
                       </span>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="bg-white/80 dark:bg-slate-800/80 border border-(--border) rounded-3xl p-12 text-center text-(--muted-foreground)">
                   <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-emerald-500 opacity-20" />
                   <p className="text-sm font-medium">System reports zero active risk alerts.</p>
                 </div>
               )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Heart, RefreshCw, ShieldAlert } from "lucide-react";