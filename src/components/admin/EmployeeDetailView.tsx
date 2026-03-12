import React, { useState, useEffect } from "react";
import { ArrowLeft, Mail, RefreshCw, Heart, Zap, ShieldAlert, Clock, AlertTriangle, ShieldCheck, Activity, Briefcase } from "lucide-react";
import { EmployeeListItem, ActivityEntry, RiskAlert } from "@/types";
import { EmotionBadge, RiskBadge, Avatar } from "@/components/ui";
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
  const [employee, setEmployee] = useState<EmployeeListItem | null>(null);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "alerts">("overview");

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [empRes, trendRes] = await Promise.all([
          api.admin.getEmployees(),
          api.admin.getVibeTrend(employeeId).catch(() => null)
        ]);
        
        const emp = empRes.employees.find(e => e.employee_id === employeeId);
        if (emp) {
          setEmployee(emp);
          // Activities and alerts are not globally implemented in all backends, 
          // derived from trend if possible or set empty as per not_implemented list
          setActivities([]); 
          setAlerts([]);
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-(--primary-foreground) text-sm font-bold shadow-lg shadow-primary/10 hover:bg-emerald-900 transition-all active:scale-95"
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
            <div className="absolute -inset-1 bg-linear-to-tr from-primary to-accent rounded-full blur opacity-20 group-hover:opacity-40 transition" />
            <Avatar name={employee.name} size="lg" className="relative w-32 h-32 text-4xl ring-4 ring-white dark:ring-slate-800 shadow-2xl" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-(--foreground) tracking-tight">{employee.name}</h1>
                <RiskBadge risk={employee.latest_sentiment?.flight_risk_level || "low"} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-(--muted-foreground)">
                <div className="flex items-center gap-1.5 pt-1">
                  <Briefcase className="w-4 h-4 text-primary" />
                  {employee.department}
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
                title="Total Points"
                value={employee.engagement?.total_points?.toString() || "0"}
                icon={Zap}
              />
              <MetricCard
                title="Risk level"
                value={employee.latest_sentiment?.flight_risk_level || "low"}
                icon={ShieldAlert}
                variant={employee.latest_sentiment?.flight_risk_level === "high" ? "warning" : "default"}
              />
              <MetricCard
                title="Sessions"
                value={employee.engagement?.total_sessions?.toString() || "0"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
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

              {/* Engagement Stats Card */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 border border-(--border) shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-(--muted-foreground)">Engagement Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-(--secondary)">
                     <p className="text-[10px] font-bold text-(--muted-foreground) uppercase">Current Streak</p>
                     <p className="text-xl font-black">{employee.engagement?.current_streak} days</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-(--secondary)">
                     <p className="text-[10px] font-bold text-(--muted-foreground) uppercase">Total Messages</p>
                     <p className="text-xl font-black">{employee.engagement?.total_messages}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="p-12 text-center text-(--muted-foreground) bg-white/80 dark:bg-slate-800/80 border border-(--border) rounded-3xl shadow-sm">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium">Activity feeds are not currently supported by the backend.</p>
            </div>
          )}

          {activeTab === "alerts" && (
             <div className="bg-white/80 dark:bg-slate-800/80 border border-(--border) rounded-3xl p-12 text-center text-(--muted-foreground)">
               <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-emerald-500 opacity-20" />
               <p className="text-sm font-medium">Risk management and alerts are currently handled via manual assessment.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}