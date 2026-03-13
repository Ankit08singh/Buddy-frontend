import React, { useState, useEffect } from "react";
import { ArrowLeft, Mail, RefreshCw, Heart, Zap, ShieldAlert, Clock, ShieldCheck, Briefcase, Trophy, Sparkles } from "lucide-react";
import { EmployeeListItem, RiskAlert } from "@/types";
import { EmotionBadge, RiskBadge, Avatar } from "@/components/ui";
import { MetricCard } from "./MetricCard";
import { EmployeeAnalyticsSection } from "./EmployeeAnalyticsSection";
import { api } from "@/lib/api";
import { getStreakMeta, getStreakMotivation } from "@/lib/streakUtils";
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "alerts">("overview");

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const empRes = await api.admin.getEmployees();
        const emp = empRes.employees.find(e => e.employee_id === employeeId);
        if (emp) {
          setEmployee(emp);
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
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-(--border) rounded-[2.5rem] p-8 h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-bold text-(--muted-foreground)">Compiling employee profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const streak = getStreakMeta(employee.engagement?.current_streak || 0);
  const motivation = getStreakMotivation(employee.engagement?.current_streak || 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-(--border) text-(--muted-foreground) hover:text-primary hover:border-primary transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-black uppercase tracking-tight">Back to Workforce</span>
        </button>

        <button
          onClick={() => onContactEmployee?.(employeeId, "email")}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-primary text-(--primary-foreground) text-sm 
          font-black shadow-lg shadow-primary/20 hover:bg-emerald-900 transition-all active:scale-95"
        >
          <Mail className="w-4 h-4" />
          SEND ENCOURAGEMENT
        </button>
      </div>

      {/* Hero Profile - Consistency Focused */}
      <div className="relative group p-10 rounded-[3rem] bg-white/80 dark:bg-slate-800/80 backdrop-blur-3xl border border-(--border) shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000" />
        
        <div className="relative z-10 flex flex-col xl:flex-row gap-10 items-start xl:items-center">
          <div className="relative">
            <div className="absolute -inset-2 bg-linear-to-tr from-primary to-accent rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000" />
            <Avatar name={employee.name} size="lg" className="relative w-40 h-40 text-5xl ring-4 ring-white dark:ring-slate-800 shadow-2xl" />
            <div className={`absolute -bottom-2 -right-2 w-12 h-12 ${streak.colorClass} rounded-2xl shadow-xl flex items-center justify-center`}>
              <streak.icon className="w-6 h-6" />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-2">
                <h1 className="text-4xl font-black text-(--foreground) tracking-tighter">{employee.name}</h1>
                <RiskBadge risk={employee.latest_sentiment?.flight_risk_level || "low"} />
              </div>
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                <Briefcase className="w-4 h-4" />
                {employee.department}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Consistency Score"
                value={<span className="flex items-center gap-1.5"><streak.icon className="w-5 h-5" /> {employee.engagement?.current_streak} Day Streak</span>}
                icon={Zap}
                variant="success"
                subtitle={motivation}
              />
              <MetricCard
                title="Motivation Points"
                value={<span className="flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> {employee.engagement?.total_points}</span>}
                icon={Heart}
                subtitle="All-time engagement"
              />
              <MetricCard
                title="Sentiment Vibe"
                value={employee.latest_sentiment?.vibe_score?.toString() || "0"}
                icon={Briefcase}
                variant={employee.latest_sentiment?.flight_risk_level === "high" ? "warning" : "default"}
                subtitle={employee.latest_sentiment?.primary_emotion || "Neutral"}
              />
              <MetricCard
                title="Total Sessions"
                value={employee.engagement?.total_sessions?.toString() || "0"}
                icon={Clock}
                subtitle="Completed check-ins"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="space-y-8">
        <div className="flex p-1.5 bg-(--secondary) rounded-2xl w-fit shadow-inner">
          {(["overview", "analytics", "alerts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 text-xs font-black rounded-[1.2rem] transition-all uppercase tracking-widest ${
                activeTab === tab 
                  ? "bg-white dark:bg-slate-700 text-primary shadow-md"
                  : "text-(--muted-foreground) hover:text-(--foreground)"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Consistency Insight */}
              <div className="p-10 rounded-[2.5rem] bg-white/80 dark:bg-slate-800/80 border border-(--border) shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <streak.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-(--foreground)">Engagement Tier</h3>
                    <p className="text-xs font-bold text-(--muted-foreground) uppercase tracking-wide opacity-70">Consistency Benchmark</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                   <div className="p-6 rounded-3xl bg-(--secondary) space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-black tracking-tight">{streak.label}</span>
                         <span className="text-[10px] font-black uppercase bg-primary/10 text-primary px-2 py-1 rounded-md">{streak.tier} level</span>
                      </div>
                      <p className="text-sm text-(--muted-foreground) leading-relaxed font-medium">
                        {motivation} By engaging consistently, {employee.name} is building a healthy habit of workplace reflection.
                      </p>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl border border-(--border) bg-white/50 dark:bg-slate-900/50">
                        <p className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest mb-1">Messages</p>
                        <p className="text-xl font-black">{employee.engagement?.total_messages || 0}</p>
                      </div>
                      <div className="p-5 rounded-2xl border border-(--border) bg-white/50 dark:bg-slate-900/50">
                        <p className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest mb-1">Last Active</p>
                        <p className="text-xs font-black">{employee.engagement?.last_session_at ? new Date(employee.engagement.last_session_at).toLocaleDateString() : "Never"}</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="p-10 rounded-[2.5rem] bg-white/80 dark:bg-slate-800/80 border border-(--border) shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                   <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
                     <ShieldCheck className="w-5 h-5" />
                   </div>
                   <div>
                     <h3 className="text-lg font-black uppercase tracking-tight text-(--foreground)">Wellness Snapshot</h3>
                     <p className="text-xs font-bold text-(--muted-foreground) uppercase tracking-wide opacity-70">Sentiment vs. Consistency</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex justify-between items-center p-5 rounded-2xl bg-(--secondary)">
                      <span className="text-xs font-black uppercase tracking-wide">Primary Emotion</span>
                      <EmotionBadge emotion={employee.latest_sentiment?.primary_emotion || "Neutral"} />
                   </div>
                   
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span>Sentiment Health</span>
                         <span>{employee.latest_sentiment?.vibe_score || 0}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000" 
                          style={{ width: `${employee.latest_sentiment?.vibe_score || 0}%` }} 
                        />
                      </div>
                   </div>

                   <p className="text-xs font-medium text-(--muted-foreground) leading-relaxed">
                     Wellness insights are derived from the latest interaction on {employee.latest_sentiment?.date ? new Date(employee.latest_sentiment.date).toLocaleDateString() : "N/A"}.
                   </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <EmployeeAnalyticsSection employeeId={employeeId} />
          )}

          {activeTab === "alerts" && (
             <div className="p-20 text-center bg-white/80 dark:bg-slate-800/80 border border-(--border) rounded-[3rem] shadow-sm">
                <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-emerald-500 opacity-20" />
                <h4 className="text-xl font-black text-(--foreground) tracking-tight">System Status: Secure</h4>
                <p className="text-sm font-bold text-(--muted-foreground) uppercase tracking-widest max-w-sm mx-auto mt-2 opacity-60">
                  No critical anomalies found for this employee session history.
                </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}