import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, Mic } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3">
      <div className="flex items-end gap-3 max-w-3xl mx-auto">
        <button
          className="p-2 rounded-full text-teal-600 dark:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0 mb-0.5"
          aria-label="Emoji"
          type="button"
        >
          <Smile className="w-5 h-5" />
        </button>

        <div className="flex-1 bg-slate-100 dark:bg-slate-700/60 rounded-2xl px-4 py-2.5 border border-slate-200 dark:border-slate-600">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message to Buddy..."
            disabled={isLoading}
            rows={1}
            maxLength={2000}
            className="w-full resize-none bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none leading-relaxed"
            aria-label="Type a message"
          />
        </div>

        <button
          className="p-2 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0 mb-0.5"
          aria-label="Voice input"
          type="button"
        >
          <Mic className="w-5 h-5" />
        </button>

        <button
          onClick={handleSubmit}
          disabled={!canSend}
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            canSend
              ? "bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
              : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
          }`}
          aria-label="Send message"
        >
          <Send className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}
