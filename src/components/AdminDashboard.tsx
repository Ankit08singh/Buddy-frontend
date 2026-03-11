import React, { useState, useEffect } from "react";
import { getVibeTrend } from "@/lib/api";
import type { TrendEntry, FlightRisk, Engagement } from "@/types";
import RiskStatusCard from "./RiskStatusCard";
import VibeScoreChart from "./VibeScoreChart";
import EmotionDistributionChart from "./EmotionDistributionChart";
import RecentInsights from "./RecentInsights";

interface AdminDashboardProps {
  userId: string;
}

export default function AdminDashboard({ userId }: AdminDashboardProps) {
  const [trends, setTrends] = useState<TrendEntry[]>([]);
  const [flightRisk, setFlightRisk] = useState<FlightRisk | null>(null);
  const [engagement, setEngagement] = useState<Engagement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getVibeTrend(userId);
        if (cancelled) return;
        setTrends(data.trends);
        setFlightRisk(data.flightRisk);
        setEngagement(data.engagement);
      } catch (err: any) {
        if (cancelled) return;
        setError(err.message || "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse ${
              i < 2 ? "lg:col-span-1" : i < 4 ? "lg:col-span-1" : "lg:col-span-3"
            }`}
            style={{ height: i < 4 ? 280 : 200 }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="font-medium text-red-500 mb-1">Error loading data</p>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="space-y-5">
          {flightRisk && engagement && (
            <RiskStatusCard flightRisk={flightRisk} engagement={engagement} />
          )}
        </div>

        <div className="lg:col-span-2">
          <VibeScoreChart trends={trends} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <EmotionDistributionChart trends={trends} />
        <div className="lg:col-span-2">
          <RecentInsights trends={trends} />
        </div>
      </div>
    </div>
  );
}
