import React from "react";
import { formatRelativeTime } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
  userName?: string;
}

export default function ChatMessage({ message, userName }: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} items-end gap-2.5 mb-5`}>
      <div className="shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">✦</span>
          </div>
        )}
      </div>

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[70%]`}>

        <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1 px-1">
          {isUser ? "You" : "Buddy"}
        </span>

        <div
          className={`px-4 py-3 text-[14px] leading-relaxed ${
            isUser
              ? "bg-teal-600 text-white rounded-2xl rounded-br-sm"
              : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm shadow-sm"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>

        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
          {formatRelativeTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
