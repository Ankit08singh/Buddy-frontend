import React from "react";
import { Sun, Moon, LogOut, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { BuddyAvatar, Avatar } from "@/components/ui";
import { useAuth } from "@/components/providers/AuthProvider";

interface ChatHeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onClearChat: () => void;
  hasMessages: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onClearChat,
  hasMessages
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-(--border) px-4 py-3 flex items-center justify-between gap-4 transition-all">
      <div className="flex items-center gap-3">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
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
    </header>
  );
};
