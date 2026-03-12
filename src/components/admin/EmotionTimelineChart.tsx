import React from "react";
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  CartesianGrid,
  Cell
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

const EMOTION_ORDER = [
  "Joy",
  "Alignment",
  "Neutral",
  "Stress",
  "Overwhelm",
  "Frustration",
  "Burnout",
  "Apathy"
];

export const EmotionTimelineChart: React.FC<EmotionTimelineChartProps> = ({
  data,
  loading
}) => {
  if (loading) return <div className="h-[300px] w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />;
  
  if (data.length === 0) return <div className="h-[300px] flex items-center justify-center text-(--muted-foreground) italic text-sm">No timeline data available.</div>;

  // Map emotions to Y-axis indices
  const chartData = data.map(point => ({
    ...point,
    yIndex: EMOTION_ORDER.indexOf(point.emotion),
    // Bubble size based on vibe score
    z: point.vibe_score
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            name="Date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 600 }}
          />
          <YAxis 
            type="number" 
            dataKey="yIndex" 
            name="Emotion" 
            ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
            tickFormatter={(index) => EMOTION_ORDER[index]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--foreground)', fontSize: 9, fontWeight: 700 }}
          />
          <ZAxis type="number" dataKey="z" range={[50, 400]} name="Vibe Score" />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
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
                      <span className="text-(--muted-foreground)">Risk:</span>
                      <span className="text-(--foreground) uppercase tracking-tighter">{data.risk}</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Emotions" data={chartData}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.emotion] || "#64748b"} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
