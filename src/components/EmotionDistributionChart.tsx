import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TrendEntry } from "@/types";

interface EmotionDistributionChartProps {
  trends: TrendEntry[];
}

const EMOTION_COLORS: Record<string, string> = {
  Joy: "#10b981",
  Stress: "#f59e0b",
  Frustration: "#ef4444",
  Burnout: "#ea580c",
  Overwhelm: "#d97706",
  Apathy: "#9ca3af",
  Alignment: "#0d9488",
  Neutral: "#94a3b8",
};

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg text-[13px]">
      <p className="font-medium text-slate-900 mb-0.5">{payload[0].name}</p>
      <p className="text-slate-500">Count: {payload[0].value}</p>
    </div>
  );
}

export default function EmotionDistributionChart({ trends }: EmotionDistributionChartProps) {
  const counts: Record<string, number> = {};
  trends.forEach((t) => {
    counts[t.emotion] = (counts[t.emotion] || 0) + 1;
  });

  const data = Object.entries(counts)
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count);

  const total = data.reduce((s, d) => s + d.count, 0);
  const avgScore = trends.length
    ? Math.round(trends.reduce((s, t) => s + t.vibeScore, 0) / trends.length)
    : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full">
      <div className="px-5 pt-4 pb-1">
        <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Emotion Distribution</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Across all trend data</p>
      </div>
      <div className="px-5 pb-5">
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="emotion"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.emotion}
                    fill={EMOTION_COLORS[entry.emotion] ?? "#94a3b8"}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, color: "#64748b" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginBottom: 30 }}>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgScore}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
