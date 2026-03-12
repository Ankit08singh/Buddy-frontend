import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  secondaryValue?: string;
  icon: LucideIcon;
  loading?: boolean;
  variant?: "default" | "warning" | "success";
  trend?: {
    direction?: "up" | "down" | "neutral";
    value?: number;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  secondaryValue,
  icon: Icon,
  loading,
  variant = "default",
  trend
}) => {
  if (loading) {
    return (
      <div className="p-6 rounded-3xl bg-white/50 dark:bg-slate-800/50 border border-(--border) animate-pulse">
        <div className="h-4 w-24 bg-(--border) rounded-full mb-4" />
        <div className="h-10 w-20 bg-(--border) rounded-xl" />
      </div>
    );
  }

  const variants = {
    default: "text-primary bg-primary/5",
    warning: "text-orange-500 bg-orange-500/5",
    success: "text-emerald-500 bg-emerald-500/5",
  };

  return (
    <div className="group relative p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-(--border) shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-bold text-(--muted-foreground) uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-(--foreground) tracking-tight">{value}</h3>
            {secondaryValue && (
              <span className="text-sm font-medium text-(--muted-foreground)">{secondaryValue}</span>
            )}
          </div>
          {(subtitle || trend) && (
            <div className="flex items-center gap-2 mt-1">
              {trend && trend.value !== undefined && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-lg ${
                  trend.direction === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 
                  trend.direction === 'down' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-500'
                }`}>
                  {trend.direction === 'up' ? '+' : ''}{trend.value}%
                </span>
              )}
              {subtitle && <p className="text-xs text-(--muted-foreground) font-medium">{subtitle}</p>}
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-2xl ${variants[variant]} transition-colors`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};