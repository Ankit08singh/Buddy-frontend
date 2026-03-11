import React from "react";
import { Shield, AlertTriangle, AlertCircle, Star, Flame } from "lucide-react";
import type { FlightRisk, Engagement } from "@/types";

interface RiskStatusCardProps {
  flightRisk: FlightRisk;
  engagement: Engagement;
}

const riskConfig = {
  Low: { icon: Shield, badgeCls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", label: "Low Risk" },
  Medium: { icon: AlertTriangle, badgeCls: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", label: "Medium Risk" },
  High: { icon: AlertCircle, badgeCls: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400", label: "High Risk" },
};

export default function RiskStatusCard({ flightRisk, engagement }: RiskStatusCardProps) {
  const cfg = riskConfig[flightRisk.level];
  const Icon = cfg.icon;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="px-5 pt-4 pb-2">
        <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Flight Risk Status</h3>
      </div>

      <div className="px-5 pb-5">
        <div className="mb-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium ${cfg.badgeCls}`}>
            <Icon className="w-4 h-4" />
            {cfg.label}
          </span>
        </div>

        <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          {flightRisk.reason}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3.5 py-2.5">
            <Star className="w-[18px] h-[18px] text-amber-400" />
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Points</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{engagement.totalPoints}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3.5 py-2.5">
            <Flame className="w-[18px] h-[18px] text-orange-500" />
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Streak</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{engagement.currentStreak}d</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
