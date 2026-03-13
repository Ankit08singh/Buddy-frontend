import React from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import type { EmotionDistributionPoint } from "@/types";

interface EmotionDistributionProps {
  data: EmotionDistributionPoint[];
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

export const EmotionBarChart: React.FC<EmotionDistributionProps> = ({
  data,
  loading
}) => {
  if (loading) return <div className="h-[250px] w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />;
  
  if (data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-(--muted-foreground) italic text-sm">
        Insufficient data for analysis.
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.3} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="emotion" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--foreground)', fontSize: 10, fontWeight: 700 }}
            width={75}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '12px',
              border: '1px solid var(--border)',
              fontSize: '11px',
              fontWeight: 'bold'
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.emotion] || "#64748b"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const EmotionPieChart: React.FC<EmotionDistributionProps> = ({
  data,
  loading
}) => {
  if (loading) return <div className="h-[250px] w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />;
  
  if (data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-(--muted-foreground) italic text-sm">
        Insufficient data for analysis.
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="count"
            nameKey="emotion"
            cx="40%"
            cy="50%"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.emotion] || "#64748b"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '12px',
              border: '1px solid var(--border)',
              fontSize: '11px',
              fontWeight: 'bold'
            }}
          />
          <Legend 
            layout="vertical" 
            align="right" 
            verticalAlign="middle"
            formatter={(value, entry: any) => (
              <span className="text-[10px] font-bold text-(--foreground) ml-2 whitespace-nowrap">
                {value} - {entry.payload.percentage}%
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
