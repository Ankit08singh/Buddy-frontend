import React, { useState } from "react";
import { Sun, Moon, LogOut, Info, MessageSquare, Clock, Calendar, Zap, Star } from "lucide-react";
import { BuddyAvatar, Avatar } from "@/components/ui";
import { useAuth } from "@/components/providers/AuthProvider";
import { EngagementSummary } from "@/types";
import { getStreakMeta } from "@/lib/streakUtils";

interface ChatHeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onClearChat: () => void;
  hasMessages: boolean;
  score?: EngagementSummary | null;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onClearChat,
  hasMessages,
  score
}) => {
  const { user, logout } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  
  const streakMeta = score ? getStreakMeta(score.current_streak) : null;

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-(--border) transition-all">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-tr from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <BuddyAvatar size="md" className="relative bg-white dark:bg-slate-800 rounded-2xl" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-(--foreground) leading-none">Buddy</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-medium text-(--muted-foreground) tracking-tight uppercase">Ready to help</span>
            </div>
          </div>
        </div>

        {/* Motivation Center - Primary Display */}
        {score && (
          <div 
            className={`flex items-center gap-2 px-3 py-1.5 bg-(--secondary) rounded-2xl border border-(--border) cursor-pointer hover:border-primary/50 transition-all shadow-sm animate-in fade-in zoom-in duration-500 ${streakMeta?.pulse ? 'ring-2 ring-amber-500/20 shadow-amber-500/10' : ''}`}
            onClick={() => setShowDetails(!showDetails)}
          >
            <div className="flex items-center gap-1 pr-2 border-r border-(--border)">
              <span className="text-sm">🔥</span>
              <span className="text-xs font-black text-(--foreground)">{score.current_streak} day streak</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">⭐</span>
              <span className="text-xs font-black text-(--foreground)">{score.total_points} points</span>
            </div>
            <Info className={`w-3 h-3 ml-1 text-(--muted-foreground) transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </div>
        )}

        <div className="flex items-center gap-2">
          {hasMessages && (
            <button
              onClick={onClearChat}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-destructive hover:bg-destructive/10 transition-colors border border-destructive/20"
            >
              End Session
            </button>
          )}
          
          <div className="h-8 w-px bg-(--border) mx-1 hidden sm:block" />

          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl bg-(--secondary) text-(--muted-foreground) hover:text-primary transition-all active:scale-95"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={logout}
            className="p-2.5 rounded-xl bg-(--secondary) text-(--muted-foreground) hover:text-destructive transition-all active:scale-95"
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>

          <div className="pl-1">
            <Avatar name={user?.name || "User"} size="sm" className="ring-2 ring-primary/10 transition-transform hover:scale-105" />
          </div>
        </div>
      </div>

      {/* Motivation Details - Secondary Display */}
      {showDetails && score && (
        <div className="px-4 py-2 bg-(--background)/50 border-t border-(--border) flex flex-wrap items-center gap-x-6 gap-y-2 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-(--muted-foreground)">
            <Calendar className="w-3 h-3 text-primary" />
            <span>{score.total_sessions} Sessions</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-(--muted-foreground)">
            <MessageSquare className="w-3 h-3 text-primary" />
            <span>{score.total_messages} Messages</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-(--muted-foreground)">
            <Clock className="w-3 h-3 text-primary" />
            <span>{score.daily_chat_seconds}/{score.daily_chat_cap_seconds} sec today</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Zap className="w-3 h-3" />
            <span>{score.billable_chat_seconds_remaining} sec remaining</span>
          </div>
        </div>
      )}
    </header>
  );
};
