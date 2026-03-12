import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  onQuickAction?: string;
  onClearQuickAction?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  isLoading, 
  onQuickAction,
  onClearQuickAction 
}) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (onQuickAction) {
      setText(onQuickAction);
      onClearQuickAction?.();
      // Auto-focus after quick action
      textareaRef.current?.focus();
    }
  }, [onQuickAction, onClearQuickAction]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSend(text);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-(--border) bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-4 sm:p-6 transition-all">
      <div className="max-w-3xl mx-auto relative group">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Buddy..."
          disabled={isLoading}
          className="w-full pl-6 pr-14 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-(--border) focus:border-primary focus:ring-4 focus:ring-primary/5 text-(--foreground) placeholder:text-slate-500 dark:placeholder:text-slate-400 resize-none transition-all shadow-md font-medium"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isLoading}
          className="absolute right-3 bottom-3 p-2.5 rounded-xl bg-primary text-(--primary-foreground) disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-primary/20 active:scale-95 hover:bg-primary/90"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      <p className="max-w-3xl mx-auto text-[10px] text-center text-(--muted-foreground) mt-3">
        Buddy is an AI companion and can make mistakes. Consider checking important info.
      </p>
    </div>
  );
};
