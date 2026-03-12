import { StreakTier, StreakMeta } from "@/types/admin";

/**
 * Categorizes a streak into a specific tier.
 */
export function getStreakTier(streak: number): StreakTier {
  if (streak === 0) return "none";
  if (streak <= 3) return "starter";
  if (streak <= 7) return "active";
  return "elite";
}

/**
 * Returns visual and textual metadata for a given streak.
 */
export function getStreakMeta(streak: number): StreakMeta {
  const tier = getStreakTier(streak);
  
  switch (tier) {
    case "none":
      return {
        tier: "none",
        label: "0 day streak",
        colorClass: "bg-slate-100 dark:bg-slate-800 text-slate-500",
        icon: "❄️",
        pulse: false
      };
    case "starter":
      return {
        tier: "starter",
        label: `${streak} day streak`,
        colorClass: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200/50",
        icon: "🌱",
        pulse: false
      };
    case "active":
      return {
        tier: "active",
        label: `${streak} day streak`,
        colorClass: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 border border-orange-300/50",
        icon: "🔥",
        pulse: false
      };
    case "elite":
      return {
        tier: "elite",
        label: `${streak} day streak`,
        colorClass: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 border border-yellow-400/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]",
        icon: "👑",
        pulse: true
      };
  }
}

/**
 * Returns motivational microcopy for streaks.
 */
export function getStreakMotivation(streak: number): string {
  const tier = getStreakTier(streak);
  if (tier === "none") return "Start your journey today!";
  if (tier === "starter") return "Great start! Keep it going.";
  if (tier === "active") return "You're on fire! Consistency pays off.";
  return "Elite level unlocked! You are an inspiration.";
}
