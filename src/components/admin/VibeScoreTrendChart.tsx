import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Calendar } from "lucide-react";
import type { VibeChartData } from "@/types";

interface VibeScoreTrendChartProps {
  data: VibeChartData[];
  loading?: boolean;
  timeRange: string;
  onTimeRangeChange: (range: "7d" | "30d" | "90d") => void;
}

export const VibeScoreTrendChart: React.FC<VibeScoreTrendChartProps> = ({
  data,
  loading,
  timeRange,
  onTimeRangeChange
}) => {
  return (
    <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-(--border) shadow-sm h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-(--foreground) tracking-tight">Team Vibe Trend</h3>
          <p className="text-xs text-(--muted-foreground) font-medium">Daily sentiment score across all employees</p>
        </div>
        <div className="flex p-1 bg-(--secondary) rounded-xl">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => onTimeRangeChange(r)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                timeRange === r 
                  ? "bg-white dark:bg-slate-600 text-primary shadow-sm"
                  : "text-(--muted-foreground) hover:text-(--foreground)"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="flex items-end gap-1 h-24">
              {[40, 70, 50, 90, 60, 80].map((h, i) => (
                <div key={i} className="w-4 bg-primary/10 rounded-t-lg animate-pulse" style={{ height: `${h}%`, animationDelay: `${i*100}ms` }} />
              ))}
            </div>
            <p className="text-xs font-medium text-(--muted-foreground) animate-pulse">Analyzing trends...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-(--muted-foreground) gap-2">
            <Calendar className="w-8 h-8 opacity-20" />
            <p className="text-sm font-medium">No trend data available for this range</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="vibeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 600 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                labelStyle={{ fontWeight: 'bold', color: 'var(--foreground)', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="vibe_score" 
                stroke="var(--primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#vibeGradient)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};