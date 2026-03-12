import React from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from "recharts";
import { Info } from "lucide-react";
import type { VibeTrendPoint } from "@/types";

interface VibeScoreTrendChartProps {
  data: VibeTrendPoint[];
  loading?: boolean;
}

export const VibeScoreTrendChart: React.FC<VibeScoreTrendChartProps> = ({
  data,
  loading,
}) => {
  if (loading) return <div className="h-[350px] w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />;
  
  if (data.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center text-(--muted-foreground) italic text-sm">
        No sentiment data available for this employee in the last 90 days.
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
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
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '11px'
            }}
            labelStyle={{ fontWeight: 'black', color: 'var(--foreground)', marginBottom: '4px' }}
          />
          
          {/* Risk Thresholds */}
          <ReferenceLine y={35} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'High Risk', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
          <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'right', value: 'Med Risk', fill: '#f59e0b', fontSize: 10, fontWeight: 'bold' }} />

          <Line 
            type="monotone" 
            dataKey="vibe_score" 
            stroke="var(--primary)" 
            strokeWidth={4}
            dot={{ r: 4, strokeWidth: 2, fill: 'var(--background)' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};