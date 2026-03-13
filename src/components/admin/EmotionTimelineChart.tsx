import React from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Cell,
  ReferenceLine
} from "recharts";
import type { EmotionTimelinePoint } from "@/types";

interface EmotionTimelineChartProps {
  data: EmotionTimelinePoint[];
  loading?: boolean;
}

const EMOTION_COLORS: Record<string, string> = {
  Joy: "#22c55e",
  Alignment: "#14b8a6",
  Neutral: "#64748b",
  Stress: "#f59e0b",
  Overwhelm: "#d97706",
  Frustration: "#ef4444",
  Burnout: "#ea580c",
  Apathy: "#9ca3af"
};

export const EmotionTimelineChart: React.FC<EmotionTimelineChartProps> = ({
  data,
  loading
}) => {
  if (loading) return <div className="h-[400px] w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />;
  
  if (data.length === 0) return <div className="h-[400px] flex items-center justify-center text-(--muted-foreground) italic text-sm">No timeline data available.</div>;

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 700 }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 800 }}
            width={35}
          />
          <Tooltip 
            cursor={{ fill: 'var(--primary)', fillOpacity: 0.05 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as EmotionTimelinePoint;
                return (
                  <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-(--border) shadow-xl space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">{data.date}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EMOTION_COLORS[data.emotion] }} />
                      <p className="text-sm font-black">{data.emotion}</p>
                    </div>
                    <div className="flex justify-between gap-8 text-[10px] font-bold">
                      <span className="text-(--muted-foreground)">Vibe Score:</span>
                      <span className="text-(--foreground)">{data.vibe_score}</span>
                    </div>
                    <div className="flex justify-between gap-8 text-[10px] font-bold">
                      <span className="text-(--muted-foreground)">Risk Level:</span>
                      <span className={`uppercase tracking-tighter ${
                        data.risk === 'high' ? 'text-red-500' : 
                        data.risk === 'medium' ? 'text-amber-500' : 'text-emerald-500'
                      }`}>{data.risk}</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine 
            y={40} 
            stroke="#ef4444" 
            strokeDasharray="3 3" 
            strokeOpacity={0.5}
            label={{ 
              value: 'RISK ZONE', 
              position: 'insideBottomRight', 
              fill: '#ef4444', 
              fontSize: 9, 
              fontWeight: 900,
              opacity: 0.6
            }} 
          />
          <Bar 
            dataKey="vibe_score" 
            radius={[6, 6, 6, 6]}
            barSize={16}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={EMOTION_COLORS[entry.emotion] || "#64748b"} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
