import React, { useState, useEffect, useMemo } from "react";
import { HelpCircle, TrendingUp, BarChart3, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { VibeScoreTrendChart } from "./VibeScoreTrendChart";
import { EmotionDistributionCharts } from "./EmotionDistributionCharts";
import { EmotionTimelineChart } from "./EmotionTimelineChart";
import type { 
  TrendEntry, 
  VibeTrendPoint, 
  EmotionDistributionPoint, 
  EmotionTimelinePoint,
  Emotion
} from "@/types";
import toast from "react-hot-toast";

interface EmployeeAnalyticsSectionProps {
  employeeId: string;
}

export function EmployeeAnalyticsSection({ employeeId }: EmployeeAnalyticsSectionProps) {
  const [trends, setTrends] = useState<TrendEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrends() {
      setLoading(true);
      try {
        const res = await api.admin.getVibeTrend(employeeId);
        // Derived state: sort trends by date ascending
        const sortedTrends = [...(res.trends || [])].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setTrends(sortedTrends);
      } catch (err) {
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    }
    fetchTrends();
  }, [employeeId]);

  // Derived Data: Vibe Trend Points
  const vibeTrendData = useMemo<VibeTrendPoint[]>(() => {
    return trends.map(t => ({
      date: new Date(t.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      vibe_score: t.vibe_score,
      risk: t.flight_risk_level
    }));
  }, [trends]);

  // Derived Data: Emotion Distribution
  const emotionDistribution = useMemo<EmotionDistributionPoint[]>(() => {
    if (trends.length === 0) return [];
    
    const counts: Record<string, number> = {};
    trends.forEach(t => {
      counts[t.primary_emotion] = (counts[t.primary_emotion] || 0) + 1;
    });

    return Object.entries(counts).map(([emotion, count]) => ({
      emotion: emotion as Emotion,
      count,
      percentage: Number(((count / trends.length) * 100).toFixed(1))
    })).sort((a, b) => b.count - a.count);
  }, [trends]);

  // Derived Data: Emotion Timeline
  const emotionTimelineData = useMemo<EmotionTimelinePoint[]>(() => {
    return trends.map(t => ({
      date: new Date(t.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      emotion: t.primary_emotion,
      vibe_score: t.vibe_score,
      risk: t.flight_risk_level
    }));
  }, [trends]);

  const isEmpty = !loading && trends.length === 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Vibe Trend - Full Width */}
      <AnalyticsCard 
        title="Vibe Score Trend (90 Days)" 
        subtitle="Tracking emotional health and risk thresholds over time"
        icon={<TrendingUp className="w-5 h-5 text-primary" />}
      >
        <VibeScoreTrendChart data={vibeTrendData} loading={loading} />
      </AnalyticsCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribution */}
        <AnalyticsCard 
          title="Emotion Count and Percentage" 
          subtitle="Frequency and share of primary emotional states"
          icon={<BarChart3 className="w-5 h-5 text-emerald-500" />}
        >
          <EmotionDistributionCharts data={emotionDistribution} loading={loading} />
        </AnalyticsCard>

        {/* Timeline */}
        <AnalyticsCard 
          title="When What Emotion Happened" 
          subtitle="Time-based mapping of emotional occurrences"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        >
          <EmotionTimelineChart data={emotionTimelineData} loading={loading} />
        </AnalyticsCard>
      </div>

      {isEmpty && (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-dashed border-(--border)">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 text-(--muted-foreground) opacity-20" />
          <h4 className="text-lg font-bold text-(--foreground)">No Data Found</h4>
          <p className="text-sm text-(--muted-foreground) max-w-sm mx-auto">
            No sentiment data available for this employee in the last 90 days. 
            Encourage them to engage with Buddy for more insights.
          </p>
        </div>
      )}
    </div>
  );
}

function AnalyticsCard({ title, subtitle, icon, children }: { title: string; subtitle: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="p-8 rounded-[2rem] bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-(--border) shadow-sm group">
      <div className="flex items-start justify-between mb-8">
        <div className="flex gap-4">
          <div className="p-3 rounded-2xl bg-(--secondary) group-hover:bg-primary/10 transition-colors">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-black text-(--foreground) tracking-tight">{title}</h3>
            <p className="text-xs font-bold text-(--muted-foreground) uppercase tracking-wide opacity-70">{subtitle}</p>
          </div>
        </div>
        <button className="p-2 text-(--muted-foreground) hover:text-primary transition-colors">
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  );
}
