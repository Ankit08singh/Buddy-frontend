import React from "react";
import { TrendingUp, TrendingDown, Minus, Heart, Users, Activity } from "lucide-react";
import { TeamStats, TrendDirection } from "@/types";
import { MetricCard } from "./MetricCard";

interface TeamHealthScoreProps {
  teamStats: TeamStats;
  loading?: boolean;
  className?: string;
}

export function TeamHealthScore({ 
  teamStats, 
  loading = false, 
  className = "" 
}: TeamHealthScoreProps) {
  // Calculate overall health score (0-100)
  const calculateHealthScore = (stats: TeamStats): number => {
    const avgVibeScore = stats.average_vibe_score || 0;
    const engagementRate = stats.employee_count > 0 
      ? ((stats.active_employees || 0) / stats.employee_count) * 100 
      : 0;
    const lowRiskRate = stats.employee_count > 0
      ? ((stats.employee_count - (stats.high_risk_count || 0) - (stats.medium_risk_count || 0)) / stats.employee_count) * 100
      : 0;
    
    // Weighted average: 50% vibe score, 30% engagement, 20% low risk
    return Math.round((avgVibeScore * 0.5) + (engagementRate * 0.3) + (lowRiskRate * 0.2));
  };

  const healthScore = calculateHealthScore(teamStats);
  
  // Determine health level and color
  const getHealthLevel = (score: number) => {
    if (score >= 80) return { level: "Excellent", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/20" };
    if (score >= 65) return { level: "Good", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-900/20" };
    if (score >= 50) return { level: "Fair", color: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-50 dark:bg-yellow-900/20" };
    return { level: "Poor", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-900/20" };
  };

  const health = getHealthLevel(healthScore);

  const getTrendIcon = (direction?: TrendDirection) => {
    switch (direction) {
      case "up": return TrendingUp;
      case "down": return TrendingDown;
      default: return Minus;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-6"></div>
        
        {/* Health Score Skeleton */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
            <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto mb-2"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-24 mx-auto"></div>
        </div>
        
        {/* Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
        Team Health Score
      </h2>
      
      {/* Health Score Circle */}
      <div className="text-center mb-8">
        <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
          {/* Background Circle */}
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              className="stroke-slate-200 dark:stroke-slate-700"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              className={`${health.color.replace('text-', 'stroke-')}`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(healthScore / 100) * 351.86} 351.86`}
              style={{
                transition: "stroke-dasharray 1s ease-in-out"
              }}
            />
          </svg>
          
          {/* Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${health.color}`}>
              {healthScore}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              / 100
            </span>
          </div>
        </div>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${health.bgColor} ${health.color}`}>
          <Heart className="w-4 h-4 mr-1" />
          {health.level}
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Average Vibe"
          value={teamStats.average_vibe_score?.toFixed(1) || "0"}
          trend={{
            direction: teamStats.vibe_trend?.direction,
            value: teamStats.vibe_trend?.percentage
          }}
          icon={Activity}
          suffix="/100"
          size="sm"
          className="border-0 shadow-none bg-slate-50 dark:bg-slate-700/50"
        />
        
        <MetricCard
          title="Active Members"
          value={teamStats.active_employees?.toString() || "0"}
          secondaryValue={`of ${teamStats.employee_count}`}
          icon={Users}
          size="sm"
          className="border-0 shadow-none bg-slate-50 dark:bg-slate-700/50"
        />
        
        <MetricCard
          title="High Risk"
          value={teamStats.high_risk_count?.toString() || "0"}
          secondaryValue={teamStats.employee_count > 0 
            ? `${Math.round(((teamStats.high_risk_count || 0) / teamStats.employee_count) * 100)}%`
            : "0%"
          }
          icon={getTrendIcon("down")}
          variant={teamStats.high_risk_count && teamStats.high_risk_count > 0 ? "warning" : "default"}
          size="sm"
          className="border-0 shadow-none bg-slate-50 dark:bg-slate-700/50"
        />
      </div>

      {/* Health Breakdown */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Health Factors
        </h3>
        
        <div className="space-y-3">
          {/* Vibe Score Factor */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Sentiment Score (50%)
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${teamStats.average_vibe_score || 0}%` }}
                />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-8">
                {teamStats.average_vibe_score?.toFixed(0) || "0"}
              </span>
            </div>
          </div>
          
          {/* Engagement Factor */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Engagement (30%)
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ 
                    width: `${teamStats.employee_count > 0 
                      ? ((teamStats.active_employees || 0) / teamStats.employee_count) * 100 
                      : 0}%` 
                  }}
                />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-8">
                {teamStats.employee_count > 0 
                  ? Math.round(((teamStats.active_employees || 0) / teamStats.employee_count) * 100)
                  : 0}%
              </span>
            </div>
          </div>
          
          {/* Risk Factor */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Low Risk (20%)
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ 
                    width: `${teamStats.employee_count > 0
                      ? ((teamStats.employee_count - (teamStats.high_risk_count || 0) - (teamStats.medium_risk_count || 0)) / teamStats.employee_count) * 100
                      : 0}%` 
                  }}
                />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-8">
                {teamStats.employee_count > 0
                  ? Math.round(((teamStats.employee_count - (teamStats.high_risk_count || 0) - (teamStats.medium_risk_count || 0)) / teamStats.employee_count) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}