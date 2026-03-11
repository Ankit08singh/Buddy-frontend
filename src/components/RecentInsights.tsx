import React from "react";
import type { TrendEntry } from "@/types";

interface RecentInsightsProps {
  trends: TrendEntry[];
}

const emotionCls: Record<string, string> = {
  Joy: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Stress: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Frustration: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  Burnout: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Overwhelm: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Apathy: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
  Alignment: "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  Neutral: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
};

const riskCls: Record<string, string> = {
  Low: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medium: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  High: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export default function RecentInsights({ trends }: RecentInsightsProps) {
  const recent = trends.slice(-10).reverse();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full">
      <div className="px-5 pt-4 pb-2">
        <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Recent Sentiment Signals</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Last 10 entries</p>
      </div>
      <div className="px-3 pb-3 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left px-3 py-2.5 border-b border-slate-200 dark:border-slate-700">
                Date
              </th>
              <th className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left px-3 py-2.5 border-b border-slate-200 dark:border-slate-700">
                Emotion
              </th>
              <th className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left px-3 py-2.5 border-b border-slate-200 dark:border-slate-700">
                Score
              </th>
              <th className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left px-3 py-2.5 border-b border-slate-200 dark:border-slate-700">
                Risk
              </th>
            </tr>
          </thead>
          <tbody>
            {recent.map((entry, i) => {
              const emoCls = emotionCls[entry.emotion] ?? "bg-slate-100 text-slate-600";
              const rCls = riskCls[entry.flightRiskLevel] ?? "bg-slate-100 text-slate-600";
              return (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="text-[13px] text-slate-500 dark:text-slate-400 whitespace-nowrap px-3 py-2.5 border-b border-slate-100 dark:border-slate-700/50">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700/50">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-medium ${emoCls}`}>
                      {entry.emotion}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-teal-500"
                          style={{ width: `${entry.vibeScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {entry.vibeScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700/50">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-medium ${rCls}`}>
                      {entry.flightRiskLevel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
