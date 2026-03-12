import React from "react";
import { BuddyAvatar, Avatar } from "@/components/ui";
import { useAuth } from "@/components/providers/AuthProvider";
import type { ChatMessage } from "@/types";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  onQuickAction: (text: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  bottomRef,
  onQuickAction
}) => {
  const { user } = useAuth();

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <BuddyAvatar size="lg" className="relative z-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-(--foreground) tracking-tight">
              Welcome, {user?.name?.split(" ")[0] || "there"}
            </h2>
            <p className="text-(--muted-foreground) mt-2">
              I'm Buddy, your workspace companion. I'm here to listen and support you. How's your day going?
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {[
              "I'm feeling a bit stressed",
              "How can I focus better?",
              "Let's talk about work-life balance"
            ].map((text) => (
              <button
                key={text}
                onClick={() => onQuickAction(text)}
                className="px-4 py-2 text-sm font-medium rounded-full bg-white/50 dark:bg-slate-800/50 border border-(--border) hover:border-primary hover:text-primary transition-all backdrop-blur-sm"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              msg.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div className="shrink-0 mt-1">
              {msg.sender === "ai" ? (
                <BuddyAvatar size="sm" />
              ) : (
                <Avatar name={user?.name || "User"} size="sm" />
              )}
            </div>
            
            <div className={`flex flex-col max-w-[80%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm text-sm whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-white dark:bg-slate-800 border border-(--border) text-(--foreground) rounded-tl-none shadow-sm"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-(--muted-foreground) mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 animate-in fade-in duration-300">
            <BuddyAvatar size="sm" className="shrink-0 mt-1" />
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-(--border) px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex items-center gap-1.5 px-0.5">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};
