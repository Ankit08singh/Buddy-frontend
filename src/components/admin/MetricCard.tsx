import React from "react";
import { LucideIcon } from "lucide-react";
import { TrendDirection } from "@/types";

interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  secondaryValue?: string;
  icon: LucideIcon;
  loading?: boolean;
  variant?: "default" | "warning" | "success";
  trend?: {
    direction?: TrendDirection;
    value?: number;
  };
  suffix?: string;
  size?: "default" | "sm";
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  secondaryValue,
  icon: Icon,
  loading,
  variant = "default",
  trend,
  suffix,
  size = "default",
  className = ""
}) => {
  if (loading) {
    return (
      <div className={`p-6 rounded-3xl bg-white/50 dark:bg-slate-800/50 border border-(--border) animate-pulse ${className}`}>
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

  const pSize = size === "sm" ? "p-4" : "p-6";
  const tSize = size === "sm" ? "text-xl" : "text-3xl";
  const iSize = size === "sm" ? "w-5 h-5" : "w-6 h-6";

  return (
    <div className={`group relative ${pSize} rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-(--border) shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-widest opacity-70">{title.split(' ').join(' ')}</p>
          <div className="flex items-baseline gap-1.5">
            <h3 className={`${tSize} font-black text-(--foreground) tracking-tight`}>{value}</h3>
            {suffix && (
              <span className="text-xs font-bold text-(--muted-foreground) tracking-tighter">{suffix}</span>
            )}
            {secondaryValue && (
              <span className="text-[10px] font-bold text-(--muted-foreground) tracking-tight ml-1">{secondaryValue}</span>
            )}
          </div>
          {(subtitle || trend) && (
            <div className="flex items-center gap-2 mt-1">
              {trend && trend.value !== undefined && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                  trend.direction === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 
                  trend.direction === 'down' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-500'
                }`}>
                  {trend.direction === 'up' ? '+' : ''}{trend.value}%
                </span>
              )}
              {subtitle && <p className="text-[10px] text-(--muted-foreground) font-bold opacity-70">{subtitle}</p>}
            </div>
          )}
        </div>
        
        <div className={`${size === 'sm' ? 'p-2.5' : 'p-3'} rounded-2xl ${variants[variant]} transition-colors`}>
          <Icon className={iSize} />
        </div>
      </div>
    </div>
  );
};