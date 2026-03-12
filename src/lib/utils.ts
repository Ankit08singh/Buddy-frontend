import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Emotion, RiskLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const emotionColors: Record<Emotion, string> = {
  Joy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Alignment: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  Neutral: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
  Stress: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Overwhelm: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Frustration: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Burnout: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Apathy: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

export const emotionChartColors: Record<Emotion, string> = {
  Joy: "#22c55e",
  Alignment: "#14b8a6",
  Neutral: "#64748b",
  Stress: "#f59e0b",
  Overwhelm: "#d97706",
  Frustration: "#ef4444",
  Burnout: "#ea580c",
  Apathy: "#9ca3af",
};

export const riskColors: Record<RiskLevel, string> = {
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function getVibeScoreColor(score: number): string {
  if (score < 35) return "bg-red-500";
  if (score < 50) return "bg-amber-500";
  if (score < 70) return "bg-yellow-500";
  return "bg-green-500";
}

export function hashStringToColor(str: string): string {
  const colors = [
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-rose-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
