import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { TrendEntry } from "@/types";

interface VibeScoreChartProps {
  trends: TrendEntry[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as TrendEntry;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg text-[13px]">
      <p className="font-medium text-slate-900 mb-1">{label}</p>
      <p className="text-teal-600">Score: {d.vibeScore}</p>
      <p className="text-slate-500">Emotion: {d.emotion}</p>
      <p className="text-slate-500">Risk: {d.flightRiskLevel}</p>
    </div>
  );
}

export default function VibeScoreChart({ trends }: VibeScoreChartProps) {
  const last30 = trends.slice(-30);

  const formatted = last30.map((t) => ({
    ...t,
    label: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full">
      <div className="px-5 pt-4 pb-1">
        <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
          30-Day Vibe Score Trend
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Score over time</p>
      </div>
      <div className="px-5 pb-5">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatted} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                interval={Math.max(0, Math.floor(formatted.length / 6) - 1)}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickCount={6}
              />
              <ReferenceLine y={35} stroke="#ef4444" strokeDasharray="4 4" />
              <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="4 4" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="vibeScore"
                stroke="#0d9488"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: "#0d9488", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
