import React from "react";
import { getVibeScoreColor } from "@/lib/utils";

interface VibeScoreBarProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function VibeScoreBar({ score, showLabel = true, size = "md" }: VibeScoreBarProps) {
  const color = getVibeScoreColor(score);
  const height = size === "sm" ? "h-1.5" : "h-2";

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 ${height} bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 tabular-nums w-8 text-right">
          {score}
        </span>
      )}
    </div>
  );
}
